# Khmer Lakhon Yike Archive · បណ្ណសារល្ខោនយីកេ

A bilingual (English / Khmer) living archive of Lakhon Yike, built by Keo Phlyna for ICT 340 at AUPP, Fall 2026.

**Live site:** UNSURE (the Vercel URL is not recorded anywhere in the repo)

> Lines marked **UNSURE** are things the code and SQL in this repository can't confirm: what lives only in the hosted Supabase project, and what only I know (permissions, test dates, links). Each one must be replaced with a checked answer before submission.

---

## 1. What this is

I built a living archive of Lakhon Yike, a Khmer theater form that combines music, dance and storytelling. Yike carries Khmer stories, language, music and cultural knowledge from one generation to the next, and much of that knowledge was disrupted during the Khmer Rouge period. The material comes from community elders, Yike performances and workshops, and published articles on Khmer performing arts (`collection.config.js`). The archive covers performance phases, character types, costumes, music, history and oral history. Anyone can browse and search the published entries in English or Khmer. Anyone who signs up can contribute an entry with a photo, and nothing they submit goes public until a reviewer reads it and publishes it. Number of published entries: UNSURE. The repo only holds the five original Sprint 1 entries (`reference/sprint1-entries.js`), and the live entries are in Supabase.

## 2. Who it's for

The archive is for people in Cambodia: students and teachers of Khmer arts, Yike troupes and their families, and anyone who wants to learn about the form in their own language. What I did for them:

- **Khmer first.** One toggle switches the whole interface between English and Khmer and remembers the choice (`localStorage["yike-language"]`, `components/hooks/useLanguage.js`). The home page, entry pages, sign-up and login, the contribute and edit forms, *My entries* and the review queue all have `en` and `kh` strings. Validation errors are translated as well (`utils/form/validateEntry.js` maps every message through `formText.js`). Every entry has Khmer fields for title, description, place, contributor and sources. Khmer text uses Noto Serif Khmer (`app/fonts.js`), because Google Sans has no Khmer glyphs.
  - Known gaps: the "AI-generated image" badge (`components/entry/EntryCard.js`) and the category label on entry cards and in the review queue still appear in English in Khmer mode. Only the category dropdown on the form is translated.
- **Validation never damages Khmer.** The form rules use Unicode classes (`\p{L}\p{M}\p{N}`), not ASCII ranges. Khmer vowels and subscripts are combining marks (`\p{M}`), so a letters-only rule would reject real Khmer names. Values are trimmed and checked, never rewritten. The database uses a code-point helper for the same rule (`has_only_letters_numbers_spaces`), because Postgres regex has no `\p{…}`. `node scripts/check-khmer.mjs` checks that real Khmer text is stored byte for byte and that length limits still apply. It passes 29 of 29 checks.
- **Phones first.** Layouts are fluid, with breakpoints at 720, 600, 520 and 420 px (`app/responsive.css`) and `clamp()` heading sizes. Buttons and links are at least 44 px tall so they're easy to tap. Form inputs use 16 px text on small screens, which stops iOS Safari zooming in on focus.
- **Slow connections.** Uploads are capped at 5 MB and limited to JPG, PNG and WebP. Images go through `next/image` with `sizes`, so phones download a smaller version. Fonts are self-hosted through `next/font`. `public/theme-bootstrap.js` sets the theme before first paint, so a slow page doesn't flash the wrong colours.
- **Sources are named and credited.** Every entry needs a named contributor. The form rejects a URL in place of a name, and it rejects "unknown". Contributor names can also be given in Khmer, and there's an optional sources note in both languages. If a photo is AI-generated, the contributor has to tick a box, and the entry then shows a badge.

## 3. How it works

- **Site:** Next.js 15 (App Router) and React 19 in plain JavaScript, deployed on Vercel. The archive's name, description, curator and source all come from `collection.config.js`.
- **Backend:** Supabase. Auth handles accounts, Postgres holds the data, and Storage holds the photos (bucket `photos`, path `<user id>/<uuid>.<ext>`).

```
Browser (Next.js pages)
  │  anon key + the user's login session
  ▼
Supabase ── Auth (accounts)
         ├─ Postgres: entries, profiles, reviewer list, RLS, is_reviewer(), review_entry()
         └─ Storage: photos/<user id>/<uuid>.<ext>
```

**Tables**

| Table | What it holds | Where it's defined |
|---|---|---|
| `entries` | `title`, `title_kh`, `description`, `description_kh`, `category`, `place`, `place_kh`, `contributor`, `contributor_kh`, `sources`, `sources_kh`, `photo_url`, `photo_is_ai`, `phases`, `characters`, `garments`, `owner`, `status`, `created_at`, plus `review_note` (read by `/my-entries`, which falls back gracefully if the column is missing) | The base table isn't in the repo (UNSURE how it was created). In the repo: `supabase/migrations/20261009000100_…` (title/contributor character checks), `20261016000100_…` (`sources`, `sources_kh`), `20261017000100_…` (title punctuation). The `review_note` migration is **not** in the repo (UNSURE) |
| `profiles` | first and last name, one row per account | `supabase/migrations/20261105000100_profiles_names.sql` |
| Reviewer list | who counts as a reviewer for `is_reviewer()` | UNSURE: not in the repo (name, columns and how rows are added) |

**Entry statuses**

```
contributor submits ─► pending ─┬─► published   (shown to everyone)
        ▲                       └─► returned    (with an optional reviewer note, owner sees it on /my-entries)
        │                                │
        └────── owner edits any entry ◄──┘   (status is set back to pending)
```

- New entries are inserted without a `status` (`utils/entries/saveEntry.js`), so the database default applies. That the default is `pending` comes from the project notes. The `entries` table definition isn't in the repo (UNSURE).
- Every edit by the owner sets `status: "pending"` (`utils/entries/updateEntry.js`). That includes a reviewer editing their own entry.
- The home page and its search load only `status = 'published'` (`app/page.js`). The review queue loads only `pending` (`app/review/page.js`).

**Policies: who can read and write what**

| Who | `entries` read | `entries` write | Storage `photos` |
|---|---|---|---|
| Logged out | UNSURE: RLS for `entries` isn't in the repo | UNSURE | UNSURE |
| Signed-in contributor | UNSURE | What the app sends: insert with `owner` from the session; update/delete filtered by `id` **and** `owner`. What RLS enforces: UNSURE | The app uploads to `<own user id>/…`. Bucket policy: UNSURE |
| Reviewer | UNSURE (the queue reads `pending` rows, so RLS must allow it) | status changes only through `review_entry()` (internals UNSURE) | UNSURE |
| `profiles` | own row only (`profiles_select_own`) | nobody from the browser. Only the `security definer` sign-up trigger writes it. | n/a |

The database also has CHECK constraints that mirror `utils/form/validateEntry.js`. Two of them are defined in this repo: `entries_title_letters_numbers_spaces_check` and `entries_contributor_letters_numbers_spaces_check`. `scripts/check-constraints.sql` audits ten more (`entries_title_check`, `entries_category_check`, `entries_photo_url_check`, …), but their definitions are not in the repo (UNSURE). The audit script doesn't check the two constraints that *are* in the repo.

## 4. Security decisions

**The gate.** Publishing happens in the database, not in the page.

- `/review` is a server component. It calls `is_reviewer()` first and loads pending entries only if the answer is exactly `true`. Anything else, including an error, a `null` or a signed-out visitor, gets "This page is for reviewers only."
- The Publish and Return buttons call `review_entry(entry_id, decision)` with `decision` set to `published` or `returned`. A return can also carry a trimmed `note`. The page counts a decision as saved only when the function returns `true`. Otherwise it says the decision wasn't saved.
- What `review_entry` does inside: UNSURE. Its SQL isn't in the repo. I need to confirm whether it is `security definer`, whether it rejects non-reviewers, whether it accepts only `published`/`returned`, and whether it only changes rows that are still `pending`.

**Why it lives in the database.** The anon key ships to every browser, so anyone can open the console and call Supabase directly, without using my pages at all. Hiding the Publish button or the *Review* link (`app/page.js` shows the link only when `is_reviewer()` returns `true`) keeps the page tidy for contributors and protects nothing. A stranger can still run `supabase.from("entries").update({ status: "published" })` or `supabase.rpc("review_entry", …)` from the console. Only RLS refusing that update, and `review_entry()` refusing a non-reviewer, stops it. Whether both hold on the hosted project: UNSURE until tested (see the checklist).

**Decisions the briefs left to me**

| Decision | What the code does | Why |
|---|---|---|
| What a returned entry says | On *My entries*, the owner sees "Returned for changes / បានបញ្ជូនត្រឡប់មកវិញ". If the reviewer wrote a note (optional, max 500 characters in the textarea), it appears under "Reviewer's note". The note shows only on returned entries, and React renders it as plain text, never HTML. | A bare "returned" doesn't tell a contributor what to fix. Keeping the note optional keeps reviewing quick. |
| Can reviewers take down published entries? | **Not through the app.** The queue lists and acts on `pending` entries only. A published entry can be changed only by its owner (an edit sends it back to review) or deleted by its owner. Whether `review_entry()` itself would accept a published row: UNSURE. | The contributor keeps control of their own knowledge. If something published has to come down, the curator removes it directly in Supabase. (UNSURE: confirm this is the policy I want to defend.) |
| What search shows a contributor about their own pending entries | **Nothing.** Search and the home page's *My entries* toggle filter the published list only. Pending and returned entries appear only on `/my-entries`, with their status. | Search looks the same to everyone, so an unreviewed entry never looks published, even to its author. |

One more case is UNSURE. `/entries/<id>` (`utils/entries/fetchEntry.js`) loads an entry by id with no status filter. Whether a logged-out visitor or a stranger can open a *pending* entry by its URL depends entirely on RLS.

**Other choices that protect the data**

- Writes list each column by name. A form object is never spread into `insert`/`update`, and `owner` comes from the session, never from the form.
- Updates and deletes filter on `id` **and** `owner` and end in `.select()`. A write blocked by RLS returns zero rows and no error, so the code checks that a row came back before it says "saved".
- If the row write fails after a photo upload, the photo is removed again (`removePhoto`, best effort).
- The photo's type and file extension come from its first bytes (magic numbers), never from the filename or `file.type`. SVG is rejected.
- `next/image` only renders `https://*.supabase.co` or local paths (`PendingPhoto.js`). A bad `photo_url` falls back to a placeholder instead of crashing the page.
- `profiles` is written only by a `security definer` trigger with an empty `search_path`, and `execute` on it is revoked from `anon` and `authenticated`. Names are set once at sign-up, and the browser can't change them.

## 5. AI use

What the repo shows: 25 of the 61 commits are tagged "(AI-assisted)" or a variant of it. Ten of them, from 2 and 8 November, carry a `Co-Authored-By: Claude …` trailer from Claude Code. The other fifteen don't record which tool or model wrote them. `.clineignore` is set up for Cline, so Cline was in use at some point. `AGENTS.md` holds the rules every agent worked under: no new dependencies, no TypeScript, no secrets in files, small scoped diffs, and Khmer kept as real content. The 36 untagged commits include Sprint 1 and some Sprint 2 work (for example "Apply constraint rules" and "sprint 2: retire the data file, entries live in supabase"). UNSURE whether those had no AI help or were just not tagged.

| Model / tool | What it wrote | Kept as written / rewrote, and why | How I checked |
|---|---|---|---|
| UNSURE: tool and model aren't recorded (Cline is likely, given `.clineignore`) | The fifteen tagged commits without a trailer: Sprint 1 fonts and the `EntryCard` layout rebuild; Supabase client setup, sign-up/login pages, auth status in the header, the contribution form with photo upload, edit/delete own entries, owner management and live search, the entry detail pages, splitting `EntryCard`, Khmer localisation of the forms; entries waiting for review, the review queue; the first README draft (`1d0f54b`) | UNSURE | UNSURE |
| Claude Code (model named in the commits' `Co-Authored-By` trailers) | `53f33b8` design tokens and `de3c205` search bar; the 8 November "review fix" commits: `profiles` migration, first/last name at sign-up, name tests in `check-khmer.mjs`, header/mobile fixes, hiding empty costume sections, edits re-queue an entry, the optional reviewer note. Also this revision of the README. `CLAUDE.md` (`2a8ed27`) is untagged, so who wrote it is UNSURE | UNSURE | UNSURE. What exists in the repo: `node scripts/check-khmer.mjs` (29 checks, passing) |
| Codex (from my earlier draft) | UNSURE: no commit in the repo is attributed to it | UNSURE | UNSURE |

## 6. Sources and credits

The five Sprint 1 entries in `reference/sprint1-entries.js` credit these contributors. Whether each gave permission to be named, and how they want to be named: UNSURE.

- Royal University of Fine Arts (RUFA): *History & Cultural Context of Lakhon Yike*
- Yike, Wikipedia: *Performance Structure, Staging & Movement*
- Master Yike percussionists, acoustic field recordings and musical transcriptions: *Music, Instrumentation & Narrative Soundscapes* (UNSURE: names, place)
- Department of Performing Arts costume designers and senior wardrobe masters: *Costume Symbolism & Character Archetypes* (UNSURE: names, place)
- Master Sobpa Sith and other living Yike practitioners across generations; *Khmer Times*: *Living Traditions: Oral History of Yike Performers*

Entries added through the site since Sprint 1 are in Supabase, not the repo. Their contributors: UNSURE.

If someone asked not to be named, I list them like this: "a Yike performer in ___ who asked not to be named."

**Photos.** The photos in `public/entries/` (`entry1.jpg`, `entry2.png`, `costume.png`, `prince.jpg`, `princess.jpg`, `yeak.jpg`, `tlok.jpg`, `sampot-chong-kben.jpg`, `sampot-hol.jpg`, `sbai.jpg`, `mkot.jpg`, `oral-history.jpg`, `khmer-traditional-music-instruments.jpg`, `yike-hom-rong.jpg`, `skor-mei-call.jpg`, `arena-drama.jpg`, `ending.jpg`, `Skor_yike.jpg`, `hero-image.jpg`, `lakhon-yike-logo.png`): who took each one, and under what licence, UNSURE. Uploaded photos marked "AI-generated image": which tool made them, UNSURE.

## 7. Running it locally

Requires Node.js 18.18 or newer (Next.js 15's minimum).

```bash
git clone https://github.com/keophlyna/yike-archive.git
```

```bash
cd yike-archive
```

```bash
npm install
```

Create `.env.local` in the project root with these two variables. The values are in your Supabase project under API settings.

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

`.env*` is gitignored and no `.env` file has ever been committed. No Supabase key is in the repo: `utils/supabase/client.js` and `server.js` read both values from the environment. The anon (publishable) key is public by design. It is sent to every visitor's browser anyway, so the data is protected by row-level security, not by keeping the key secret. The app never uses a service-role key.

**Database.** In the Supabase SQL editor, run `supabase/migrations/*.sql` in filename order. The base `entries` table, its RLS policies, the reviewer list, `is_reviewer()`, `review_entry()`, the `review_note` column and the `photos` bucket policies also have to exist, but they are **not** in this repo (UNSURE how to recreate them from here). Then run `scripts/check-constraints.sql` to confirm the constraints exist.

```bash
npm run dev
```

Opens on http://localhost:3000.

```bash
node scripts/check-khmer.mjs
```

Checks that form validation keeps Khmer text intact.

```bash
npm run build && npm start
```

Production build.

## 8. Submission checklist

- Live URL loads logged out and shows published entries only: UNSURE (URL not in the repo). The code side holds: `app/page.js` filters on `status = 'published'`
- A stranger cannot publish their own entry through the page or the console: UNSURE, not tested. To test, sign in as a second account and run `update({ status: "published" })` and `rpc("review_entry", …)` from the console
- Logged out, the API returns nothing pending or returned: UNSURE, not tested. Depends on `entries` RLS, which isn't in the repo
- Contributors can edit and delete only their own entries: in code, yes (`utils/entries/updateEntry.js`, `deleteEntry.js`: filtered by `id` + `owner`, row count checked). RLS side: UNSURE, not tested
- No secrets anywhere in the repo history: yes, checked 12 November 2026. Searched `git log --all -p` across all 61 commits on all 8 branches (after `git fetch --unshallow`) for `service_role`, `sb_secret_`, `sb_publishable_`, JWTs (`eyJhbGci…`), project URLs (`<ref>.supabase.co`) and password literals: no matches. No `.env` file was ever committed
- At least eight real entries, each with a credited source: UNSURE (count is in Supabase). The repo holds 5 Sprint 1 entries, each with a named contributor
- Khmer renders on every screen a user meets, including the queue: not fully. Every page, form, error and the review queue have Khmer strings, but the "AI-generated image" badge and category labels on cards and in the queue stay English (see §2)
- Works at phone width: UNSURE, not tested. Breakpoints down to 420 px are in `app/responsive.css`
- No test entries, lorem ipsum or TODO comments in shipped pages: code yes (no `TODO`, `FIXME` or `lorem` in `app/`, `components/` or `utils/`). Test entries in the database: UNSURE
- No console errors on the main pages: UNSURE, not tested
- jesseorndorff is a collaborator on this repo: UNSURE
- Supabase project restored and awake on UNSURE
- Demo video link opens in a private window: UNSURE
- Reflection pasted in the Canvas submission: UNSURE
- Posted in the Show Your Archive discussion: UNSURE
- Q&A slot booked for UNSURE
