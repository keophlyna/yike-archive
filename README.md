# Khmer Lakhon Yike Archive · បណ្ណសារល្ខោនយីកេ

A bilingual (English / Khmer) living archive of Lakhon Yike, built by Keo Phlyna for ICT 340 at AUPP, Fall 2026.

**Live site:** ⟨FILL IN: Vercel URL⟩

---

## 1. What this is

Yike is a traditional Khmer theater form that combines music, dance and storytelling. It carries Khmer stories, language, music and cultural knowledge from one generation to the next, and much of that knowledge was disrupted during the Khmer Rouge period. This archive collects what survives: performance phases, character types, costumes, music, history and oral history. The material comes from community elders, Yike performances and workshops, and published articles on Khmer performing arts. Anyone can browse and search the 12 published entries in English or Khmer. Anyone who signs up can contribute a new entry with a photo. No entry goes public until a reviewer has read it and published it.

## 2. Who it's for

The archive is for people in Cambodia: students and teachers of Khmer arts, Yike troupes and their families, and anyone who wants to learn about the form in their own language. What I did for them:

- **Khmer is a first-class language, not a translation layer.** Every screen a user meets has `en` and `kh` strings. That covers the home page, entry pages, the forms, *My entries* and the review queue. One toggle switches the language and remembers the choice (`localStorage["yike-language"]`). Every entry has Khmer fields for title, description, place, contributor and sources. Khmer text uses Noto Serif Khmer, because the main UI font has no Khmer glyphs.
- **Validation never damages Khmer.** The form rules use Unicode letter/mark/number classes, not ASCII regexes, so Khmer vowels and subscripts pass through unchanged. The database constraints use a code-point helper that does the same (`has_only_letters_numbers_spaces`). `scripts/check-khmer.mjs` proves that real Khmer text is accepted byte for byte.
- **Phones first.** Layouts are fluid (`app/responsive.css`, `clamp()` type sizes), and buttons are at least 44 px tall so they are easy to tap.
- **Slow connections.** Photos are capped at 5 MB and limited to JPG, PNG and WebP. They are served through Next.js image optimisation. The theme is set before first paint (`public/theme-bootstrap.js`), so pages don't flash on slow loads.
- **Sources are named and credited.** Each entry has a contributor (English and Khmer) and an optional sources note in both languages. If a photo was AI-generated, the contributor must say so, and the entry then shows an "AI-generated image" badge.

## 3. How it works

- **Site:** Next.js 15 (App Router) and React 19, plain JavaScript, deployed on Vercel. The archive's name, description, curator and source come from `collection.config.js`.
- **Backend:** Supabase. Auth handles accounts, Postgres holds the data, and Storage holds the photos (bucket `photos`, path `<user id>/<uuid>.<ext>`).

**Tables**

| Table | What it holds | Defined in |
|---|---|---|
| `entries` | `title`, `title_kh`, `description`, `description_kh`, `category`, `place`, `place_kh`, `contributor`, `contributor_kh`, `sources`, `sources_kh`, `photo_url`, `photo_is_ai`, `phases`, `characters`, `garments`, `owner`, `status`, `review_note`, `created_at` | Base table ⟨FILL IN: created in the Supabase dashboard / SQL editor⟩. Added later: `supabase/migrations/2026100900…`, `…1016…` (sources), `…1017…` (title punctuation) |
| `profiles` | first and last name, one row per account | `supabase/migrations/20261105000100_profiles_names.sql` |
| ⟨FILL IN: reviewers table name⟩ | ⟨FILL IN: columns, e.g. `user_id`⟩ | ⟨FILL IN: not yet in the repo⟩ |

**Entry statuses**

```
contributor submits ─► pending ─┬─► published   (shown to everyone)
        ▲                       └─► returned    (optional reviewer note, shown to the owner only)
        └──── owner edits a published or returned entry → back to pending
```

- New entries are inserted without a status, so the database default `pending` applies. The client never sets its own status on insert.
- An edit by the owner always resets the entry to `pending` (`utils/entries/updateEntry.js`). A reviewer's own entry is no exception.
- Only `published` entries are loaded by the home page and its search.

**Policies: who can read and write what**

| Who | `entries` read | `entries` write | Storage `photos` |
|---|---|---|---|
| Logged out | ⟨FILL IN: published rows only⟩ | none | ⟨FILL IN⟩ |
| Signed-in contributor | ⟨FILL IN: published rows + own rows of any status⟩ | insert with `owner = auth.uid()`; update/delete own rows only | ⟨FILL IN: upload into own `<user id>/` folder⟩ |
| Reviewer | ⟨FILL IN: also all pending rows⟩ | status changes only through `review_entry()` | ⟨FILL IN⟩ |
| `profiles` | own row only (`profiles_select_own`) | nobody. Only the sign-up trigger writes it | n/a |

The database also enforces CHECK constraints (title and contributor characters, category list, lengths, photo URL) that mirror `utils/form/validateEntry.js`. `scripts/check-constraints.sql` is a read-only check that they exist.

## 4. Security decisions

**The gate.** Publishing happens in the database, not in the page. The review queue (`/review`) is a server component. It first calls `is_reviewer()`, and only if that returns exactly `true` does it load the pending entries. The Publish and Return buttons call `review_entry(entry_id, decision, note)`, and the page counts the decision as saved only when the function returns `true`. ⟨FILL IN: what `review_entry` checks. For example: it runs as `security definer`, rejects callers who aren't in the reviewers table, accepts only `published`/`returned`, and only changes rows that are currently `pending`.⟩

Why in the database: anyone can open the browser console and call Supabase directly with the public key. Hiding the Publish button or the *Review* link only keeps the page tidy for non-reviewers, and it stops nobody. What actually stops a stranger publishing their own entry is row-level security, which doesn't let a contributor set `status` themselves, plus `review_entry()` refusing callers who aren't reviewers.

**Decisions the briefs left to me**

| Decision | What I chose | Why |
|---|---|---|
| What a returned entry says | The owner sees "Returned for changes / បានបញ្ជូនត្រឡប់មកវិញ" on *My entries*. If the reviewer wrote a note (optional, max 500 characters), they see it under "Reviewer's note". The note shows only on returned entries and is rendered as plain text, never HTML. | A bare "returned" doesn't tell a contributor what to fix. Keeping the note optional keeps reviewing quick. |
| Can reviewers take down published entries? | **No.** Reviewers act only on pending entries. Once an entry is published, only its owner can change it (which sends it back to review) or delete it. | The contributor owns their knowledge and keeps control of it. If a published entry needs removing, the curator does it directly in Supabase rather than through the app. |
| What search shows a contributor about their own pending entries | **Nothing.** Search and the *My entries* toggle on the home page only filter published entries. Pending and returned entries appear only on `/my-entries`, with their status. | Search results should look the same to everyone. That way an unreviewed entry never looks published, even to its author. |

**Other choices that protect the data**

- Writes list each column by name. A form object is never spread into `insert`/`update`, and `owner` comes from the session, never from the form.
- Updates and deletes filter on `id` **and** `owner` and end in `.select()`. A write blocked by RLS returns zero rows with no error, so the code checks that a row actually came back before it says "saved".
- If the row write fails after a photo upload, the photo is removed again, so no orphaned files are left.
- The photo's file type and extension come from its first bytes (magic numbers), never from the filename.
- `profiles` is written only by a `security definer` trigger with an empty `search_path`. Names are set once at sign-up and can't be edited from the browser.

## 5. AI use

| Tool / model | What it did | Kept or rewrote, and why | How I checked |
|---|---|---|---|
| Cline with Claude Sonnet 5.5 (main partner) | Sprint 1–3 features: Supabase client setup, sign-up/login pages, auth status in the header, the contribution form with photo upload, edit/delete own entries, Khmer localisation of the forms, splitting `EntryCard`, entries waiting for review, the review queue, design tokens, the search bar | ⟨FILL IN⟩ | ⟨FILL IN: e.g. ran it, read every diff, tested with a second "stranger" account⟩ |
| Claude Opus 5.5 (code construction once my Pro plan ran out) | ⟨FILL IN: e.g. the November "review fix" commits: profiles migration, first/last name at sign-up, reviewer note, edits re-queue an entry, header/mobile fixes; `CLAUDE.md`⟩ | ⟨FILL IN⟩ | ⟨FILL IN⟩ |
| Codex (GPT Luna 6) | ⟨FILL IN⟩ | ⟨FILL IN⟩ | ⟨FILL IN⟩ |

Every AI-assisted commit is tagged `(AI-assisted)` in the history. The AI agents followed the rules in `AGENTS.md`: no new dependencies, no TypeScript, no secrets in files, small scoped diffs, and Khmer kept as real content.

## 6. Sources and credits

**People and places**

- ⟨FILL IN: name, role, place, with permission, e.g. "a Yike performer in ___ who asked not to be named"⟩
- ⟨FILL IN⟩

**Published sources**

- ⟨FILL IN: articles / books on Khmer performing arts⟩

**Photos**

- ⟨FILL IN: who took each photo in `public/entries/` and in the uploaded entries, or "taken by the curator"⟩
- Photos marked "AI-generated image" on the site were generated by ⟨FILL IN: tool⟩.

## 7. Running it locally

Requires Node.js 18.18 or newer.

```bash
git clone ⟨FILL IN: repository URL⟩
cd yike-archive
npm install
```

Create `.env.local` in the project root with these two variables (find the values in your Supabase project's API settings):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

`.env*` is gitignored, so no values are committed. The anon (publishable) key is public by design: it is sent to every visitor's browser anyway, and the data is protected by row-level security, not by keeping the key secret. A service-role key is never used.

Database setup: in the Supabase SQL editor, apply `supabase/migrations/*.sql` in filename order. ⟨FILL IN: plus the base `entries` table, reviewers table, RLS policies, `is_reviewer()` and `review_entry()`, which are not yet in the repo⟩. Then run `scripts/check-constraints.sql` to confirm the constraints exist.

```bash
npm run dev                     # http://localhost:3000
node scripts/check-khmer.mjs    # verifies the form validation keeps Khmer text intact
npm run build && npm start      # production build
```

## 8. Submission checklist

- Live URL loads logged out and shows published entries only: yes, ⟨FILL IN: URL⟩
- A stranger cannot publish their own entry through the page or the console: yes, tested ⟨FILL IN: date⟩
- Logged out, the API returns nothing pending or returned: yes, tested ⟨FILL IN: date⟩
- Contributors can edit and delete only their own entries: yes. See `utils/entries/updateEntry.js` and `deleteEntry.js` (filtered by `id` + `owner`, row count checked) and the RLS policies in §3
- No secrets anywhere in the repo history: yes, checked with `git log --all -p` searched for `service_role`, `sb_secret` and JWT (`eyJhbGci`) patterns, no matches. `.env*` is gitignored
- At least eight real entries, each with a credited source: yes, 12
- Khmer renders on every screen a user meets, including the queue: yes
- Works at phone width: yes, tested on ⟨FILL IN: device or browser width⟩
- No test entries, lorem ipsum or TODO comments in shipped pages: yes
- No console errors on the main pages: yes
- jesseorndorff is a collaborator on this repo: ⟨FILL IN: yes⟩
- Supabase project restored and awake on ⟨FILL IN: date⟩
- Demo video link opens in a private window: yes, ⟨FILL IN: link⟩
- Reflection pasted in the Canvas submission: ⟨FILL IN: yes⟩
- Posted in the Show Your Archive discussion: ⟨FILL IN: yes⟩
- Q&A slot booked for ⟨FILL IN: date and time⟩
