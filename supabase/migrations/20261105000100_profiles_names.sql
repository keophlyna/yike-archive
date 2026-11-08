-- Stores each user's first and last name in public.profiles, one row per
-- account. auth.users is managed by Supabase, so no columns are added there.
--
-- Apply manually in the Supabase SQL Editor. It is safe to run more than once:
-- nothing is dropped, and no existing row is changed.

do $$
begin
  if to_regclass('public.profiles') is null then
    create table public.profiles (
      id uuid primary key references auth.users (id) on delete cascade,
      created_at timestamptz not null default now()
    );

    alter table public.profiles enable row level security;

    -- Users can see only their own row. There is no insert or update access:
    -- the trigger below is the only writer, so names are set once at sign-up.
    revoke all on public.profiles from anon, authenticated;
    grant select on public.profiles to authenticated;
    create policy profiles_select_own on public.profiles
      for select to authenticated using (id = auth.uid());

  -- If a profiles table already exists, stop rather than guess its shape. The
  -- trigger needs an id column and must be able to insert with only the names,
  -- or every new sign-up would fail.
  elsif not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'id'
  ) or exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles'
      and column_name not in ('id', 'first_name', 'last_name')
      and is_nullable = 'NO' and column_default is null
  ) then
    raise exception 'public.profiles already exists with a different structure. Nothing was changed.';
  end if;
end $$;

-- Nullable so accounts created before this change stay valid without a name.
alter table public.profiles
  add column if not exists first_name text check (first_name is null or char_length(first_name) between 1 and 60),
  add column if not exists last_name text check (last_name is null or char_length(last_name) between 1 and 60);

-- Runs as the table owner because new sign-ups have no session yet. The empty
-- search_path is the standard guard for a security definer function.
create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    nullif(btrim(new.raw_user_meta_data ->> 'first_name'), ''),
    nullif(btrim(new.raw_user_meta_data ->> 'last_name'), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke execute on function public.create_profile_for_new_user() from public, anon, authenticated;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'on_auth_user_created_profile' and tgrelid = 'auth.users'::regclass
  ) then
    create trigger on_auth_user_created_profile
      after insert on auth.users
      for each row execute function public.create_profile_for_new_user();
  end if;
end $$;
