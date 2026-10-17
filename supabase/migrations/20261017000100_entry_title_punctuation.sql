-- Let entry titles contain ampersands, commas, parentheses, and colons while keeping
-- the contributor name constraint limited to letters, numbers, and spaces.
-- Requires 20261009000100_entries_text_characters.sql, which defines the
-- Unicode-aware has_only_letters_numbers_spaces helper used below.
CREATE OR REPLACE FUNCTION public.has_valid_entry_title(input_text text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
STRICT
PARALLEL SAFE
AS $$
  SELECT public.has_only_letters_numbers_spaces(
    regexp_replace(input_text, '[&,():]', '', 'g')
  );
$$;

ALTER TABLE public.entries
  DROP CONSTRAINT IF EXISTS entries_title_letters_numbers_spaces_check;

-- Existing titles are kept as-is; the rule applies to new or updated titles.
ALTER TABLE public.entries
  ADD CONSTRAINT entries_title_letters_numbers_spaces_check
    CHECK (
      title IS NOT NULL
      AND title = btrim(title)
      AND public.has_valid_entry_title(title)
    ) NOT VALID;

NOTIFY pgrst, 'reload schema';
