-- The entries table as it was first created in the Supabase dashboard in
-- Sprint 2, written down afterwards so a fresh project can be rebuilt from the
-- repo. Columns, types, defaults and NOT NULL match the hosted database
-- (checked 12 November 2026 against information_schema.columns).
--
-- Later migrations add the rest: data-quality constraints (20261004...),
-- title/contributor character rules (20261009...), sources (20261016...), title punctuation (20261017...) and
-- the review workflow with its row level security (20261023...).
--
-- Apply manually in the Supabase SQL Editor. On the hosted project, where the
-- table already exists, this does nothing.

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_kh text,
  description text not null,
  description_kh text,
  category text not null,
  contributor text not null,
  contributor_kh text,
  place text,
  place_kh text,
  photo_url text,
  created_at timestamptz not null default now(),
  owner uuid not null,
  phases jsonb,
  characters jsonb,
  garments jsonb,
  -- Ordered the Sprint 1 cards. The app no longer reads it.
  display_order integer,
  photo_is_ai boolean not null default false
);

-- The data-quality CHECK constraints come next, in 20261004..._entries_data_quality.sql.

-- Photos are served through public URLs (getPublicUrl in
-- utils/entries/uploadPhoto.js), so the bucket is public. Who may upload or
-- delete is decided by the storage policies in the review workflow migration.
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;
