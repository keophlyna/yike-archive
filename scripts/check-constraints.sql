-- Read-only check: verifies that all ten data-quality constraints exist on
-- public.entries. Run this in the Supabase SQL editor any time you want to
-- confirm the rules are active. It changes nothing.
--
-- Expected output: one row per constraint with status 'PRESENT'. Anything
-- marked 'MISSING' was never created — an ALTER TABLE that errors (0A000
-- subquery, 23514 bad existing rows) creates nothing, so re-run that
-- statement after cleaning the data.

SELECT expected.constraint_name,
       CASE
         WHEN c.conname IS NULL THEN 'MISSING'
         ELSE 'PRESENT'
       END AS status,
       pg_get_constraintdef(c.oid) AS definition
FROM (VALUES
  ('entries_title_check'),
  ('entries_title_kh_check'),
  ('entries_description_check'),
  ('entries_description_kh_check'),
  ('entries_category_check'),
  ('entries_place_pair_check'),
  ('entries_contributor_check'),
  ('entries_contributor_kh_check'),
  ('entries_photo_url_check'),
  ('entries_photo_is_ai_check')
) AS expected(constraint_name)
LEFT JOIN pg_constraint c
  ON c.conrelid = 'public.entries'::regclass
 AND c.contype = 'c'
 AND c.conname = expected.constraint_name
ORDER BY expected.constraint_name;
