-- Submit, review, publish: the entry status, the reviewers list, the two
-- functions the app calls, and every row level security policy on entries and
-- on the photos bucket. Written down from the hosted database on 12 November
-- 2026 (pg_policies and pg_get_functiondef), so this file matches what is live.
--
-- Apply manually in the Supabase SQL Editor after the earlier migrations. It is
-- safe to run more than once: columns and tables are only added if missing,
-- functions are replaced with the same body, and each policy is dropped and
-- recreated with the same rule.

-- Status lifecycle: pending -> published or returned. New rows get 'pending'
-- from the default; the app never sends a status on insert.
alter table public.entries
  add column if not exists status text not null default 'pending',
  -- Written only by review_entry, and only on a returned entry.
  add column if not exists review_note text;

-- Only the three known statuses, and a note no longer than review_entry allows.
do $$
begin
  if not exists (select 1 from pg_constraint where conrelid = 'public.entries'::regclass and conname = 'entries_status_check') then
    alter table public.entries
      add constraint entries_status_check check (status = any (array['pending', 'published', 'returned']));
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.entries'::regclass and conname = 'entries_review_note_length') then
    alter table public.entries
      add constraint entries_review_note_length check (review_note is null or char_length(review_note) <= 500);
  end if;
end $$;

-- One row per account allowed to review. Rows are added by hand in the SQL
-- editor; there is no policy at all, so the browser can neither read nor write
-- this table and nobody can make themselves a reviewer.
create table if not exists public.reviewers (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.reviewers enable row level security;

-- Security definer so it can read reviewers, which the caller cannot. The empty
-- search_path is the standard guard for a security definer function.
create or replace function public.is_reviewer()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.reviewers where user_id = (select auth.uid()));
$$;

-- The gate. It runs with the table owner's rights, so it checks everything
-- itself and returns false rather than acting when: the caller is not a
-- reviewer, the decision is not published/returned, the note is over 500
-- characters, or the entry is not currently pending. Publishing clears any old
-- note; only a returned entry keeps one.
create or replace function public.review_entry(entry_id uuid, decision text, note text default null)
returns boolean
language plpgsql
security definer
set search_path = 'public'
as $$
declare
  clean_note text := nullif(btrim(note), '');
  changed int;
begin
  if coalesce(public.is_reviewer(), false) is not true then
    return false;
  end if;
  if decision not in ('published', 'returned') then
    return false;
  end if;
  if clean_note is not null and char_length(clean_note) > 500 then
    return false;
  end if;

  update public.entries
     set status = decision,
         review_note = case when decision = 'returned' then clean_note else null end
   where id = entry_id
     and status = 'pending';

  get diagnostics changed = row_count;
  return changed = 1;
end;
$$;

alter table public.entries enable row level security;

-- Everyone sees published entries; owners also see their own pending and
-- returned ones; reviewers see everything.
drop policy if exists "anyone can read published entries" on public.entries;
create policy "anyone can read published entries" on public.entries
  for select to public
  using (status = 'published' or (select auth.uid()) = owner or (select public.is_reviewer()));

-- A new entry must belong to the signed-in user and start as pending, so even
-- a hand-made console insert cannot arrive published.
drop policy if exists "owners add their own entries" on public.entries;
create policy "owners add their own entries" on public.entries
  for insert to authenticated
  with check ((select auth.uid()) = owner and status = 'pending');

-- Owners may edit only their own rows, and a non-reviewer's edit must leave the
-- row pending. Known gap, described in README section 4: the "or is_reviewer()"
-- lets a reviewer set their own entry to published from the console.
drop policy if exists "owners edit their own entries" on public.entries;
create policy "owners edit their own entries" on public.entries
  for update to authenticated
  using ((select auth.uid()) = owner)
  with check ((select auth.uid()) = owner and (status = 'pending' or (select public.is_reviewer())));

drop policy if exists "owners delete their own entries" on public.entries;
create policy "owners delete their own entries" on public.entries
  for delete to public
  using (auth.uid() = owner);

-- Photos live at <user id>/<uuid>.<ext>. The first folder of the path must be
-- the uploader's own id. There is no update policy, so a photo cannot be
-- overwritten in place.
drop policy if exists "contributors upload into their own folder" on storage.objects;
create policy "contributors upload into their own folder" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid()::text));

drop policy if exists "contributors delete their own photos" on storage.objects;
create policy "contributors delete their own photos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid()::text));

-- The hosted project also has photos_insert_own and photos_delete_own, exact
-- duplicates of the two policies above left from an earlier attempt. They are
-- not recreated here.
