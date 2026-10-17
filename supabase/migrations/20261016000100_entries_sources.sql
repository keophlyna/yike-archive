-- Optional bilingual source notes for archive entries.
ALTER TABLE public.entries
  ADD COLUMN IF NOT EXISTS sources text,
  ADD COLUMN IF NOT EXISTS sources_kh text;

-- Make the new columns visible to Supabase's PostgREST API immediately.
NOTIFY pgrst, 'reload schema';
