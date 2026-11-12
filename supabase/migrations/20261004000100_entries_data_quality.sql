-- The ten data-quality CHECK constraints on public.entries, first added in the
-- Supabase dashboard (commit "Apply constraint rules", 4 October 2026) and
-- written down here from the hosted database on 12 November 2026
-- (pg_get_constraintdef). They mirror utils/form/validateEntry.js, so change
-- both together. scripts/check-constraints.sql confirms all ten exist.
--
-- Khmer is matched by its Unicode block (ក-៿) instead of being
-- treated as "other characters", so Khmer text is accepted unchanged.
--
-- Apply manually in the Supabase SQL Editor. It is safe to run more than once:
-- a constraint that already exists is skipped, never dropped and re-added, so
-- existing rows are not re-checked.

do $$
declare
  rule record;
begin
  for rule in
    select * from (values
      ('entries_title_check',
       $c$CHECK (((title IS NOT NULL) AND ((char_length(TRIM(BOTH FROM title)) >= 3) AND (char_length(TRIM(BOTH FROM title)) <= 120)) AND (title !~ '[[:cntrl:]]'::text) AND (title ~ '[[:alpha:]ក-៓]'::text)))$c$),

      ('entries_title_kh_check',
       $c$CHECK (((title_kh IS NULL) OR ((char_length(TRIM(BOTH FROM title_kh)) <= 120) AND (title_kh !~ '[[:cntrl:]]'::text) AND ((char_length(TRIM(BOTH FROM title_kh)) = 0) OR (title_kh ~ '[ក-៿]'::text)))))$c$),

      ('entries_description_check',
       $c$CHECK (((description IS NOT NULL) AND ((char_length(TRIM(BOTH FROM description)) >= 30) AND (char_length(TRIM(BOTH FROM description)) <= 2500)) AND (description ~ '[[:alpha:]ក-៓]'::text)))$c$),

      ('entries_description_kh_check',
       $c$CHECK (((description_kh IS NULL) OR ((char_length(TRIM(BOTH FROM description_kh)) <= 2500) AND ((char_length(TRIM(BOTH FROM description_kh)) = 0) OR (description_kh ~ '[ក-៿]'::text)))))$c$),

      -- Must match CATEGORIES in utils/form/validateEntry.js.
      ('entries_category_check',
       $c$CHECK (((category IS NOT NULL) AND (category = ANY (ARRAY['History'::text, 'Performance'::text, 'Music'::text, 'Costume'::text, 'Oral History'::text]))))$c$),

      -- The English and Khmer place must be a matching pair from the province
      -- list in utils/form/places.js, so the two languages can never disagree.
      ('entries_place_pair_check',
       $c$CHECK (((place IS NOT NULL) AND (place_kh IS NOT NULL) AND (((place = 'Cambodia'::text) AND (place_kh = 'កម្ពុជា'::text)) OR ((place = 'Banteay Meanchey'::text) AND (place_kh = 'បន្ទាយមានជ័យ'::text)) OR ((place = 'Battambang'::text) AND (place_kh = 'បាត់ដំបង'::text)) OR ((place = 'Kampong Cham'::text) AND (place_kh = 'កំពង់ចាម'::text)) OR ((place = 'Kampong Chhnang'::text) AND (place_kh = 'កំពង់ឆ្នាំង'::text)) OR ((place = 'Kampong Speu'::text) AND (place_kh = 'កំពង់ស្ពឺ'::text)) OR ((place = 'Kampong Thom'::text) AND (place_kh = 'កំពង់ធំ'::text)) OR ((place = 'Kampot'::text) AND (place_kh = 'កំពត'::text)) OR ((place = 'Kandal'::text) AND (place_kh = 'កណ្តាល'::text)) OR ((place = 'Kep'::text) AND (place_kh = 'កែប'::text)) OR ((place = 'Koh Kong'::text) AND (place_kh = 'កោះកុង'::text)) OR ((place = 'Kratié'::text) AND (place_kh = 'ក្រចេះ'::text)) OR ((place = 'Mondulkiri'::text) AND (place_kh = 'មណ្ឌលគិរី'::text)) OR ((place = 'Oddar Meanchey'::text) AND (place_kh = 'ឧត្តរមានជ័យ'::text)) OR ((place = 'Pailin'::text) AND (place_kh = 'ប៉ៃលិន'::text)) OR ((place = 'Phnom Penh'::text) AND (place_kh = 'ភ្នំពេញ'::text)) OR ((place = 'Preah Sihanouk'::text) AND (place_kh = 'ព្រះសីហនុ'::text)) OR ((place = 'Preah Vihear'::text) AND (place_kh = 'ព្រះវិហារ'::text)) OR ((place = 'Prey Veng'::text) AND (place_kh = 'ព្រៃវែង'::text)) OR ((place = 'Pursat'::text) AND (place_kh = 'ពោធិ៍សាត់'::text)) OR ((place = 'Ratanakiri'::text) AND (place_kh = 'រតនគិរី'::text)) OR ((place = 'Siem Reap'::text) AND (place_kh = 'សៀមរាប'::text)) OR ((place = 'Stung Treng'::text) AND (place_kh = 'ស្ទឹងត្រែង'::text)) OR ((place = 'Svay Rieng'::text) AND (place_kh = 'ស្វាយរៀង'::text)) OR ((place = 'Takeo'::text) AND (place_kh = 'តាកែវ'::text)) OR ((place = 'Tboung Khmum'::text) AND (place_kh = 'ត្បូងឃ្មុំ'::text)))))$c$),

      -- A contributor is a name, not a link: web addresses and "unknown" are
      -- refused so every entry credits a real person or institution.
      ('entries_contributor_check',
       $c$CHECK (((contributor IS NOT NULL) AND ((char_length(TRIM(BOTH FROM contributor)) >= 1) AND (char_length(TRIM(BOTH FROM contributor)) <= 100)) AND (contributor !~ '[[:cntrl:]]'::text) AND (contributor !~* '(www\.|https?:|\.(com|net|org|edu|gov|info|biz|io|co|kh|app|dev)($|[^a-zA-Z0-9.]))'::text) AND (TRIM(BOTH FROM contributor) ~ '^([[:alnum:] .,;''&()-]|[ -ɏ̀-ͯក-៿])+$'::text) AND (contributor !~* '\munknown\M'::text)))$c$),

      ('entries_contributor_kh_check',
       $c$CHECK (((contributor_kh IS NULL) OR ((char_length(TRIM(BOTH FROM contributor_kh)) <= 100) AND (contributor_kh !~ '[[:cntrl:]]'::text) AND ((char_length(TRIM(BOTH FROM contributor_kh)) = 0) OR (contributor_kh ~ '[ក-៿]'::text)))))$c$),

      -- Either a full https URL (Supabase Storage) or one of the Sprint 1
      -- images in public/entries/. Angle brackets are refused outright.
      ('entries_photo_url_check',
       $c$CHECK (((photo_url IS NOT NULL) AND ((photo_url ~* '^https?://\S+$'::text) OR (photo_url ~ '^/entries/[A-Za-z0-9_.-]+\.(jpg|jpeg|png|webp)$'::text)) AND (photo_url !~ '[<>]'::text)))$c$),

      ('entries_photo_is_ai_check',
       $c$CHECK ((photo_is_ai IS NOT NULL))$c$)
    ) as rules(name, definition)
  loop
    if not exists (
      select 1 from pg_constraint
      where conrelid = 'public.entries'::regclass and conname = rule.name
    ) then
      execute format('alter table public.entries add constraint %I %s', rule.name, rule.definition);
    end if;
  end loop;
end $$;
