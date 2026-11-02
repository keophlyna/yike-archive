# CLAUDE.md

Guidance for Claude Code in this repository.

**Read [AGENTS.md](AGENTS.md) first. Its rules are binding and override anything here.** In short: JavaScript only (no TypeScript), no new dependencies, no CSS frameworks or component libraries, never commit secrets, keep diffs scoped, one small component per file, treat Khmer text as first-class content, and state a plan before multi-file changes. Build only what the current sprint task asks for.

## What this is

A bilingual (English / Khmer) archive of Khmer Lakhon Yike theater, built for ICT 340 at AUPP. Next.js 15 App Router + React 19, backed by Supabase (Postgres, Auth, Storage). The archive's identity (name, description, curator, province, source) comes from [collection.config.js](collection.config.js). Read it from there and never hard-code those values.

## Commands

- `npm run dev`: local dev server
- `npm run build` / `npm start`: production build and serve
- `node scripts/check-khmer.mjs`: the only automated check. It verifies that the validation in `utils/form/` accepts real Khmer text unchanged and enforces length limits. Run it after touching `validateEntry.js`, `places.js`, or `formText.js`.

There is no lint script, test runner, or TypeScript config, and none should be added.

Supabase needs `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` (and in Vercel env vars). `.env*` is gitignored. Never write values into a committed file.

## Layout

```
app/              Routes (thin). Each page.js mostly renders one component.
  page.js         Home: browse, search, "my entries" toggle, header/auth menu (large client component)
  contribute/     New entry form          -> components/form/ContributeForm
  entries/[id]/   Entry detail            -> components/entry/EntryDetail
  entries/[id]/edit/  Edit own entry      -> components/form/EntryEditor
  my-entries/     Signed-in user's entries with status
  review/         Server component: reviewer gate + pending queue -> components/review/ReviewQueue
  login/, signup/ -> components/auth/AuthForm (mode="login" | "signup")
  theme.css       Color tokens (CSS vars) for light/dark via [data-theme]
  home.css, responsive.css
components/       auth/ entry/ form/ hooks/ review/ theme/, one component per file
utils/
  supabase/       client.js (browser) and server.js (cookies, for server components)
  entries/        saveEntry, updateEntry, deleteEntry, fetchEntry, uploadPhoto: all DB/Storage writes
  form/           validateEntry (all form rules), formText (EN/KH form strings), places (province list)
supabase/         SQL migrations, applied manually in the Supabase SQL editor
scripts/          check-khmer.mjs, check-constraints.sql (read-only constraint audit)
reference/        sprint1-entries.js: original hard-coded entries. Nothing imports it.
public/entries/   Static images; public/theme-bootstrap.js sets data-theme before paint
```

## Data model and flow

Supabase table `public.entries` (snake_case columns): `title`, `title_kh`, `description`, `description_kh`, `category`, `place`, `place_kh`, `contributor`, `contributor_kh`, `sources`, `sources_kh`, `photo_url`, `photo_is_ai`, `phases`, `characters`, `garments`, `owner`, `status`, `created_at`.

- **Status lifecycle:** `pending` → `published` (or `returned`). The home page shows only `published`. New entries are inserted without a status, so the DB default applies. A non-reviewer editing an entry resets it to `pending` (see `updateEntry.js`).
- **Reviewers:** the RPCs `is_reviewer()` and `review_entry(entry_id, decision)` plus row-level security are the real access control. They live in Supabase and are **not** in this repo's migrations. Hiding UI links is only a courtesy, so never treat client checks as security.
- **Row mapping:** DB rows are snake_case and component props are camelCase (`title_kh` → `titleKh`, `photo_url` → `photo`, `sources` → `sourceText`, …). The mapping is explicit, field by field, in `fetchEntry.js` and `app/page.js`. Keep it explicit.
- **Photos:** Storage bucket `photos`, path `<user id>/<uuid>.<ext>`. The extension comes from validated magic bytes, never from the filename. Max 5 MB, JPG/PNG/WebP. `next.config.mjs` allows remote images from `**.supabase.co`.

## Conventions worth preserving

- **Writes list columns one by one.** Never spread a form object into `insert`/`update`. `owner` comes from the session, never from the form.
- **Updates/deletes filter by `id` AND `owner` and end in `.select()`.** A write blocked by RLS returns zero rows with no error, so always check `data.length` before reporting success.
- **Failed row write ⇒ remove the uploaded photo** (`removePhoto`, best effort).
- **Result shape** from `utils/entries/*`: `{ ok: true, id }` or `{ ok: false, step, error, message, field? }`. `error` is only for `console.error`. `message` is the safe, localized line shown to users.
- **Validation is mirrored in two places:** `utils/form/validateEntry.js` (client) and DB CHECK constraints in `supabase/migrations/`. Change both together, and map DB constraint errors back to fields via `getTextEntryConstraintError`. The DB uses a Unicode code-point helper (`has_only_letters_numbers_spaces`) because Postgres regex has no `\p{…}`.
- **Legacy-schema fallback:** save/update retry without `sources`/`sources_kh` when the hosted DB lacks that migration (`isMissingSourcesSchema`).
- **Bilingual UI:** language is `"en"` or `"kh"`, stored in `localStorage["yike-language"]` and read via `components/hooks/useLanguage.js`. Strings live in per-feature objects (`formText.js`, `reviewText.js`, `entryCardText.js`, inline `text`/`translations` maps) with `en` and `kh` keys. Add both whenever you add a string. Khmer uses `var(--font-noto-serif-khmer)`.
- **Theme:** `localStorage["yike-theme"]`, applied by `public/theme-bootstrap.js` before paint and then managed by `ThemeContext`. Use the CSS variables from `app/theme.css` (`--ink`, `--red`, `--surface`, `--rule`, …) instead of literal colors.
- **Styling:** inline `styles` objects at the top of each file plus `yk-` prefixed classes in the CSS files.
- **Imports** are relative with explicit `.js` extensions (no path aliases).
- **Comments** explain *why* (security reasoning, edge cases) in plain prose so a student can defend every line. Match that density.

## Gotchas

- `app/page.js` (~590 lines) and `components/theme/ThemeToggle.js` exceed the ~80-line component guideline. Don't make them bigger. If you need to change one substantially, propose splitting it first.
- The comment in `app/entries/[id]/page.js` says `utils/supabase/server.js` isn't configured. It is now (`app/review/page.js` uses it), so that comment is stale.
- `CATEGORIES` in `validateEntry.js` must match the DB `entries_category_check` constraint.
- Migrations are not auto-applied. Run `scripts/check-constraints.sql` in the Supabase SQL editor to confirm constraints exist.
