-- Closes the gap described in README section 4: a reviewer could publish their
-- own entry, either by approving it in the queue or by setting status straight
-- from the console. After this, every entry is published by someone other than
-- the person who wrote it.
--
-- Apply manually in the Supabase SQL Editor after
-- 20261023000100_review_workflow.sql. It is safe to run more than once.

-- Owners still edit their own rows, but the saved row must be pending for
-- everyone, reviewers included. The "or is_reviewer()" is gone: review_entry
-- does not need it, because it is security definer and runs with the table
-- owner's rights, which row level security does not restrict.
drop policy if exists "owners edit their own entries" on public.entries;
create policy "owners edit their own entries" on public.entries
  for update to authenticated
  using ((select auth.uid()) = owner)
  with check ((select auth.uid()) = owner and status = 'pending');

-- Same function as before with one more condition on the update: the entry
-- must belong to someone else. A reviewer's own pending entry is left alone and
-- the function returns false, so it waits for a second reviewer.
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
     and status = 'pending'
     and owner <> (select auth.uid());

  get diagnostics changed = row_count;
  return changed = 1;
end;
$$;
