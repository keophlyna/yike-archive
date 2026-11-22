# Khmer Lakhon Yike Archive · បណ្ណសារល្ខោនយីកេ

A bilingual (English / Khmer) living archive of Lakhon Yike, built by Keo Phlyna for ICT 340 at AUPP, Fall 2026.

**Live site:** https://ict340-archive-keophlyna.vercel.app/

---

## 1. What this is

Yike is a traditional Khmer theater form that combines music, dance and storytelling. It carries Khmer stories, language, music and cultural knowledge from one generation to the next, and much of that knowledge was disrupted during the Khmer Rouge period. This archive collects what survives: performance phases, character types, costumes, music, history and oral history. The material comes from published articles, institutions such as RUFA and the Ministry of Culture and Fine Arts, and press reporting on living Yike performers. Anyone can browse and search the 9 published entries in English or Khmer. Anyone who signs up can contribute a new entry with a photo. No entry goes public until a reviewer has read it and published it.

## 2. Who it's for

The archive is for people in Cambodia: students and teachers of Khmer arts, Yike troupes and their families, and anyone who wants to learn about the form in their own language. Because most of these readers will read and write in Khmer, often on a phone, I gave every entry its own Khmer fields instead of translating only the interface, and I made the main buttons large enough to tap easily. What I did for them:

- **Khmer is a first-class language, not a translation layer.** Every screen a user meets has `en` and `kh` strings. That covers the home page, entry pages, the forms, *My entries* and the review queue. One toggle switches the language and remembers the choice (`localStorage["yike-language"]`). Every entry has Khmer fields for title, description, place, contributor and sources. Khmer text uses Noto Serif Khmer, because the main UI font has no Khmer glyphs.
- **Validation never damages Khmer.** The form rules use Unicode letter/mark/number classes, not ASCII regexes, so Khmer vowels and subscripts pass through unchanged. The database constraints use a code-point helper that does the same (`has_only_letters_numbers_spaces`). `scripts/check-khmer.mjs` proves that real Khmer text is accepted byte for byte.
- **Phones first.** Layouts are fluid (`app/responsive.css`, `clamp()` type sizes), and the main action buttons (Edit, Delete, Publish, Return) are at least 44 px tall so they are easy to tap.
- **Slow connections.** Photos are capped at 5 MB and limited to JPG, PNG and WebP. They are served through Next.js image optimisation. The theme is set before first paint (`public/theme-bootstrap.js`), so pages don't flash on slow loads.
- **Sources are named and credited.** Each entry has a contributor (English and Khmer) and an optional sources note in both languages. If a photo was AI-generated, the contributor must say so, and the entry then shows an "AI-generated image" badge.

## 3. How it works

- **Site:** Next.js 15 (App Router) and React 19, plain JavaScript, deployed on Vercel. The archive's name, description, curator and source come from `collection.config.js`.
- **Backend:** Supabase. Auth handles accounts, Postgres holds the data, and Storage holds the photos (bucket `photos`, path `<user id>/<uuid>.<ext>`).

**Tables**

| Table | What it holds | Defined in |
|---|---|---|
| `entries` | `id` (uuid), `title`, `title_kh`, `description`, `description_kh`, `category`, `place`, `place_kh`, `contributor`, `contributor_kh`, `sources`, `sources_kh`, `photo_url`, `photo_is_ai` (default `false`), `phases`, `characters`, `garments` (jsonb), `owner` (uuid, required), `status` (default `'pending'`), `review_note`, `created_at` (default `now()`), `display_order` (left over from Sprint 1, unused by the app) | Base table: `…20260927…_entries_base_table.sql`. Then `…1004…` (data-quality constraints), `…1009…` (character rules), `…1016…` (sources), `…1017…` (title punctuation), and `…1023…_review_workflow.sql` (status, `review_note`, RLS) |
| `profiles` | first and last name, one row per account | `supabase/migrations/20261105000100_profiles_names.sql` |
| `reviewers` | `user_id`: one row per account allowed to review. Added by hand in the SQL editor. The app has no way to add a reviewer. | `supabase/migrations/20261023000100_review_workflow.sql` |

**Entry statuses**

```
contributor submits ─► pending ─┬─► published   (shown to everyone)
        ▲                       └─► returned    (optional reviewer note, shown to the owner only)
        └──── owner edits a published or returned entry → back to pending
```

- New entries are inserted without a status, so the database default `pending` applies. The insert policy also rejects any row whose status isn't `pending`, so even a hand-made console insert can't start out published.
- An edit by the owner always resets the entry to `pending` (`utils/entries/updateEntry.js`). A reviewer's own entry is no exception.
- Only `published` entries are loaded by the home page and its search.

**Policies: who can read and write what**

| Who | `entries` read | `entries` write | Storage `photos` |
|---|---|---|---|
| Logged out | published rows only | none | view photos through their public URL; no upload or delete |
| Signed-in contributor | published rows + their own rows of any status | insert only as `owner = auth.uid()` with status `pending`; update own rows, and the result must still be `pending`; delete own rows | upload and delete only inside their own `<user id>/` folder; no overwrite (there is no update policy) |
| Reviewer | every row (`is_reviewer()` in the read policy) | the same as a contributor, plus decisions through `review_entry()` | same as a contributor |
| `profiles` | own row only (`profiles_select_own`) | nobody. Only the sign-up trigger writes it | n/a |

The policies, as they exist in Supabase:

| Table | Policy | Rule |
|---|---|---|
| `entries` | *anyone can read published entries* (SELECT, public) | `status = 'published' OR auth.uid() = owner OR is_reviewer()` |
| `entries` | *owners add their own entries* (INSERT, authenticated) | check: `auth.uid() = owner AND status = 'pending'` |
| `entries` | *owners edit their own entries* (UPDATE, authenticated) | using: `auth.uid() = owner`; check: `auth.uid() = owner AND status = 'pending'` |
| `entries` | *owners delete their own entries* (DELETE, public) | `auth.uid() = owner` |
| `storage.objects` | *contributors upload into their own folder* / *contributors delete their own photos* | `bucket_id = 'photos'` and the first folder of the path equals `auth.uid()` |
| `profiles` | `profiles_select_own` (SELECT, authenticated) | `id = auth.uid()` |

`storage.objects` also has `photos_insert_own` and `photos_delete_own`, which are exact duplicates of the two storage policies above. They're leftovers from an earlier attempt and change nothing.

Row-level security is switched on for `entries`, `profiles` and `reviewers` (checked 12 November 2026 with `pg_class.relrowsecurity`). `reviewers` has no policies, so the browser can't read or write it, and nobody can add themselves as a reviewer. Only the `security definer` function `is_reviewer()` reads it.

The database also enforces CHECK constraints (title and contributor characters, category list, lengths, photo URL) that mirror `utils/form/validateEntry.js`. `scripts/check-constraints.sql` is a read-only check that they exist.

## 4. Security decisions

**The gate.** Publishing happens in the database, not in the page. The review queue (`/review`) is a server component. It first calls `is_reviewer()`, and only if that returns exactly `true` does it load the pending entries. The Publish and Return buttons call `review_entry(entry_id, decision, note)`, and the page counts the decision as saved only when the function returns `true`.

`review_entry` is a `security definer` function. That means it runs with the table owner's rights, not the caller's, so it can change rows the caller couldn't. Because of that, it checks everything itself and returns `false` instead of doing anything when:

1. the caller isn't in `reviewers` (`is_reviewer()` must be exactly true; null counts as no),
2. the decision isn't `published` or `returned`,
3. the note is longer than 500 characters (an empty note is stored as no note),
4. the entry isn't currently `pending`,
5. the entry belongs to the reviewer. Nobody reviews their own work.

The update is `WHERE id = entry_id AND status = 'pending' AND owner <> auth.uid()`, and it returns `true` only if exactly one row changed.

When an entry is published, any old note is cleared. Only a returned entry keeps one. `is_reviewer()` itself is `security definer` with an empty `search_path` and simply checks whether `auth.uid()` has a row in `reviewers`.

Why in the database: anyone can open the browser console and call Supabase directly with the public key. Hiding the Publish button or the *Review* link only keeps the page tidy for non-reviewers, and it stops nobody. What actually stops a stranger from publishing their own entry is in the database:
- the insert policy only accepts `pending` rows,
- the update policy only lets anyone save their own entry if it stays `pending`,
- `review_entry()` refuses anyone who isn't a reviewer.

**A gap I found and closed: reviewers publishing their own entries.** Checking the live policies for this README, I found two rules that let a reviewer publish their *own* entry without anyone else looking at it:
- `review_entry()` didn't check who owned the entry, so a reviewer could approve their own pending entry in the queue.
- The update policy said `status = 'pending' OR is_reviewer()`, so a reviewer could set their own entry to `published` straight from the console.

Strangers were never affected, but "every entry is reviewed" should mean reviewed by someone else. I closed the gap on 17 November 2026 with `supabase/migrations/20261117000100_reviewers_cannot_self_publish.sql`:
- the update policy now requires `pending` for everyone,
- `review_entry()` skips entries the caller owns,
- `/review` shows the reviewer's own entries marked "This is your own entry", with no Publish/Return buttons.

The `OR is_reviewer()` was never needed, because `review_entry()` runs with the table owner's rights, which RLS doesn't restrict. The trade-off: a reviewer's own new entries now wait for a second reviewer.

**Decisions the briefs left to me**

| Decision | What I chose | Why |
|---|---|---|
| What a returned entry says | The owner sees "Returned for changes / បានបញ្ជូនត្រឡប់មកវិញ" on *My entries*. If the reviewer wrote a note (optional, max 500 characters), they see it under "Reviewer's note". The note shows only on returned entries and is rendered as plain text, never HTML. | A bare "returned" doesn't tell a contributor what to fix. Keeping the note optional keeps reviewing quick. |
| Can reviewers take down published entries? | **No.** `review_entry()` only changes rows that are `pending`, and the update and delete policies only match the entry's owner. Once an entry is published, only its owner can change it (which sends it back to review) or delete it. | The contributor owns their knowledge and keeps control of it. If a published entry needs removing, the curator does it directly in Supabase rather than through the app. |
| What search shows a contributor about their own pending entries | **Nothing.** Search and the *My entries* toggle on the home page only filter published entries. Pending and returned entries appear only on `/my-entries`, with their status. The read policy would allow more (an owner can read their own pending rows), so this is an app choice, not a database limit. | Search results should look the same to everyone. That way an unreviewed entry never looks published, even to its author. |

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

All 9 published entries were researched and entered by the curator. Each entry names its source on its page.

| Entry | Source | Place |
|---|---|---|
| History & Cultural Context of Lakhon Yike | Royal University of Fine Arts (RUFA) | Takeo |
| Performance Structure, Staging & Movement | Wikipedia, "Yike" | Cambodia |
| Music, Instrumentation & Narrative Soundscapes | master Yike percussionists; acoustic field recordings and musical transcriptions | Cambodia |
| Costume Symbolism and Character Archetypes | costume designers of the Department of Performing Arts; senior wardrobe masters | Cambodia |
| Living Traditions: Oral History of Yike Performers | Master Sobpa Sith and other living Yike practitioners across generations, as reported by *Khmer Times* | Cambodia |
| Lakhon Bassac | Ministry of Culture and Fine Arts, Cambodia | Cambodia |
| Royal Ballet of Cambodia (Robam Preah Reach Trop) | UNESCO Intangible Cultural Heritage listing; Ministry of Culture and Fine Arts; *Dance in Cambodia* by Toni Samantha Phim and Ashley Thompson | Phnom Penh |
| Lakhon Khol (Masked Theater) | Ministry of Culture and Fine Arts; local community records of Wat Svay Andet | Kandal |
| Performance Dynamics, Staging, and Musical Structure of Lakhon Bassac | Ministry of Culture and Fine Arts; Department of Performing Arts | Phnom Penh |

**People**

- Master Sobpa Sith, Yike practitioner, is credited from public *Khmer Times* reporting, not a personal interview.
- The percussionists, costume designers and wardrobe masters above are credited by role because the sources didn't name them.
- The community of Wat Svay Andet, Kandal, for its records of Lakhon Khol.

**Institutions and published sources**

- Royal University of Fine Arts (RUFA), Phnom Penh
- Ministry of Culture and Fine Arts, Cambodia, and its Department of Performing Arts
- UNESCO Intangible Cultural Heritage listing for the Royal Ballet of Cambodia
- Toni Samantha Phim and Ashley Thompson, *Dance in Cambodia*
- *Khmer Times*
- Wikipedia, "Yike"
- ⟨FILL IN: any other article or book you used⟩

**Photos**

The photos are not mine. They come from these photographers, pages and channels:

- Arena photo: Nai Phun (Facebook)
- Momvan dance (Kiripost)
- Va Sonyka (*Khmer Times*)
- Abong Abong (Facebook)
- Tourism Cambodia
- Cambodia Living Arts (Pinterest)
- បុរាណាចារ្យ (Facebook)
- Say Tola (*Khmer Times*)
- Chap Chamroeun Tola (Facebook)
- ចាប សុីដាណាល់ – Chab Sydanal (Facebook)
- Wikimedia Commons
- Wikipedia
- Fresh News
- BTV Cambodia
- TII Record (YouTube)
- Chorvy Basak (YouTube)
- No entry uses an AI-generated photo. The form still asks, so a future AI image would be labelled.

## 7. Running it locally

Requires Node.js 18.18 or newer.

```bash
git clone https://github.com/keophlyna/yike-archive.git
cd yike-archive
npm install
```

Create `.env.local` in the project root with these two variables (find the values in your Supabase project's API settings):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

`.env*` is gitignored, so no values are committed. The anon (publishable) key is public by design: it is sent to every visitor's browser anyway, and the data is protected by row-level security, not by keeping the key secret. A service-role key is never used.

Database setup: in the Supabase SQL editor, apply `supabase/migrations/*.sql` in filename order. That covers the tables, the `photos` bucket, every RLS policy, `is_reviewer()` and `review_entry()`. To make yourself a reviewer, insert your user id into `public.reviewers` in the SQL editor. Then run `scripts/check-constraints.sql`. It should list all ten data-quality constraints as `PRESENT`.

```bash
npm run dev                     # http://localhost:3000
node scripts/check-khmer.mjs    # verifies the form validation keeps Khmer text intact
npm run build && npm start      # production build
```

## 8. Submission checklist

- Live URL loads logged out and shows published entries only: yes, https://ict340-archive-keophlyna.vercel.app/
- A stranger cannot publish their own entry through the page or the console: yes, tested 6 November 2026
- Logged out, the API returns nothing pending or returned: yes, tested 20 November 2026 (anon REST query returns only the 9 published rows; anon insert, update and `review_entry` are all refused)
- Contributors can edit and delete only their own entries: yes. See `utils/entries/updateEntry.js` and `deleteEntry.js` (filtered by `id` + `owner`, row count checked) and the RLS policies in §3
- No secrets anywhere in the repo history: yes, checked with `git log --all -p` searched for `service_role`, `sb_secret` and JWT (`eyJhbGci`) patterns, no matches. `.env*` is gitignored
- At least eight real entries, each with a credited source: yes, 9
- Khmer renders on every screen a user meets, including the queue: yes
- Works at phone width: yes, tested on an iPhone 16 Pro Max (440 × 956)
- No test entries, lorem ipsum or TODO comments in shipped pages: yes
- No console errors on the main pages: yes
- jesseorndorff is a collaborator on this repo: yes
- Supabase project restored and awake on 20 November 2026
- Demo video link opens in a private window: yes, ⟨FILL IN: link⟩
- Reflection pasted in the Canvas submission: yes
- Posted in the Show Your Archive discussion: yes
- Q&A slot booked for ⟨FILL IN: date and time⟩
