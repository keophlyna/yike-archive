# Khmer Lakhon Yike Archive · បណ្ណសារល្ខោនយីកេ

A bilingual (English / Khmer) living archive of Lakhon Yike, built by Keo Phlyna for ICT 340 at AUPP, Fall 2026.

**Live site:** https://ict340-archive-keophlyna.vercel.app/

---

## 1. What this is

Yike is a traditional Khmer theater form that combines music, dance and storytelling. It carries Khmer stories, language, music and cultural knowledge from one generation to the next, and much of that knowledge was disrupted during the Khmer Rouge period. This archive collects what survives: performance phases, character types, costumes, music, history and oral history. The material comes from published sources: articles on Khmer performing arts, institutions such as the Royal University of Fine Arts and the Ministry of Culture and Fine Arts, and recorded interviews with Yike practitioners. Anyone can browse and search the 9 published entries in English or Khmer. Anyone who signs up can contribute a new entry with a photo. No entry goes public until a reviewer has read it and published it.

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
- An edit by the owner always resets the entry to `pending` (`utils/entries/updateEntry.js`). A reviewer's own entry is no exception: the update policy requires the saved row to be `pending` for everyone, reviewers included.
- Only `published` entries are loaded by the home page and its search.

**Policies: who can read and write what**

| Who | `entries` read | `entries` write | Storage `photos` |
|---|---|---|---|
| Logged out | published rows only | none | view photos through their public URL; no upload or delete |
| Signed-in contributor | published rows + their own rows of any status | insert only as `owner = auth.uid()` with status `pending`; update own rows, and the result must still be `pending`; delete own rows | upload and delete only inside their own `<user id>/` folder; no overwrite (there is no update policy) |
| Reviewer | every row (`is_reviewer()` in the read policy) | the same as a contributor, plus decisions through `review_entry()` on other people's pending entries (never their own) | same as a contributor |
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
| Cline with Claude Sonnet 5.5 (main partner) | Sprint 1–3 features: Supabase client setup (`utils/supabase/client.js`, `server.js`), sign-up/login pages, auth status in the header, the contribution form with photo upload, edit/delete own entries, Khmer localisation of the forms (`formText.js`, `entryCardText.js`, `reviewText.js`), splitting `EntryCard` into `PerformanceSection`, `CostumeSection` and `PendingPhoto`, entries waiting for review, the review queue (`/review`, `ReviewQueue`, `ReviewItem`), design tokens (`theme.css`), the search bar with suggestions (`SearchSuggestions.js`) | **Kept:** the structure of the form, the owner-only edit/delete (every query filters on `id` and `owner` and ends in `.select()`, so a blocked change is not reported as saved), and the validation, which checks a photo's real type from its first bytes instead of trusting the file extension.<br>**Re-prompted:** the search (Enter-to-search broke the dropdown colours), the language toggle (it did not translate everything), and the missing "back to archive" button after submitting an entry. I did not hand-edit these. I described the bug and had the agent fix it, because I need to be able to defend each diff, not write it myself. | Ran every change in the browser in English and Khmer, light and dark. Read each diff before approving, using Plan Mode before Act Mode. Tested as a stranger: a second account could not edit or delete my entries, a logged-out visitor could not see pending entries, and a non-reviewer opening `/review` saw only "reviewers only". |
| Claude Opus 5.5 (code construction once my Pro plan ran out) | The November "review fix" commits: profiles migration (a trigger copies the first/last name from sign-up metadata into `public.profiles`, with 60-character CHECK constraints), first/last name at sign-up (`NameFields.js`, `checkName`, which lets Khmer combining marks through), the reviewer note (`review_entry` now takes a note, clears it on publish, and the owner sees it on My entries), edits re-queue an entry (`updateEntry` always resets `status` to `pending`), header/mobile fixes (`responsive.css`, `home.css`), `CLAUDE.md`, the SQL and diagnosis of the security holes, and the 17 November fix that stops reviewers publishing their own entries (`20261117000100_reviewers_cannot_self_publish.sql`: `review_entry` skips the caller's own entries and the update policy requires `pending` for everyone; the queue shows a reviewer's own entries without Publish/Return, in English and Khmer) | **Kept:** the SQL as written, and the rule that an edit always returns an entry to review, since only the owner can edit it.<br>**Re-prompted:** the header on narrow phones, until the Khmer wordmark no longer ran under the account controls. Its first security pass also missed that reviewers could publish their own entries. I asked it to re-check the live policies, and that led to the 17 November fix. | Read the migration before running it. Tested the reviewer note end to end: returning an entry showed the note to its owner, and publishing cleared it. Confirmed `review_entry` returns `true` and treated `false` as a refusal, because it returns `false` with no error when it refuses. Re-ran the attack tests after each SQL change. |
| Codex (GPT Luna 6) | Sprint 3 features and bug fixes: the thank-you screen after submitting an entry, which tells the contributor the entry is waiting for review and gives them a "Back to the archive" button so they aren't left on a dead end; the *My entries* page (`/my-entries`), which lists only the signed-in user's own entries with their status (Waiting for review, Published, or Returned for changes) in English and Khmer; and the owner-only check, so a contributor sees and manages only their own entries | **Kept** all three as written. Each one did what I asked the first time, and none of them needed rewriting. They also follow the project rules: the strings exist in both English and Khmer, and the owner check filters on the signed-in user's id from the session, not on anything the form sends. | Ran each flow in the browser. Submitted a new entry and confirmed that the thank-you message appeared, that "Back to the archive" returned to the home page, and that the entry showed on *My entries* as "Waiting for review" and not on the public home page. Read each diff before accepting it. Signed in with a second account and confirmed it could not see the first account's pending entry on *My entries*. |
| Cline with Claude Opus 4.7 (Sprint 1) | The first EntryCards, UI design and bug fixes. I chose it after comparing models because it handled UI design best | **Kept:** the card layout and typography. **Rewrote:** a font change it made broke the site, so I stopped letting it edit files unreviewed and re-prompted from a clean state. | Ran the site after each change. Reviewed the diff before allowing writes. Counted tokens, which showed that letting the agent run commands used the most. |
| Cline with Claude Sonnet 4.6 and Fable 5 (trial only) | The same EntryCard task, to compare output quality across models | **Discarded.** I kept Opus 4.7's result because its UI was stronger. | Compared the outputs side by side in the browser. |
| GitHub Copilot (GPT Luna 5.2) | Built features, edited files, generated SQL and planned implementation. One strong prompt gave the redesigned layout: cleaner, larger scale, better typography | **Kept:** the redesign and the SQL. **Re-prompted:** the search and the animations, which felt awkward. | Ran it, read the generated SQL before running it in the Supabase editor, and checked the row-level security policies by attacking them. |
| Claude Sonnet 5.5 (chat) | Prompt refinement, planning, lab walkthroughs, review-queue messages and labels, and finding the leftover database rules that let a second account publish its own entry | **Kept** the plans and the review-queue wording. It wrote no code that I used directly. | Followed its steps in the Supabase SQL editor and confirmed the fix by re-testing: after dropping the old policies, every entry had to pass a reviewer. |
| Gemini (Flash 3.5, Pro, Plus) | Researched the topic and prepared **all the Khmer text, English descriptions and entry content**. Also grammar, content templates, prompt refinement and the first HTML/CSS prototypes | **Kept** the content as prepared. I pasted it into the agent, which put it in the site and the Supabase migration. The images were not from Gemini. I read every Khmer field myself as a native speaker and corrected wording that sounded machine-translated. | The migration preserved the Khmer exactly, and I checked it displays correctly in the browser. For each entry I opened the source it cites (the *Khmer Times* video, RUFA, the Ministry, UNESCO, Wikipedia) and checked names, places and claims against it. I removed anything I could not find there. |
| ChatGPT / GPT-5.6 Luna (chat) | Brainstorming the archive idea, improving my English wording, and backup debugging when Claude and Gemini ran out of tokens | **Kept** the wording help. Used for debugging only as a fallback. | Ran each suggested fix and discarded the ones that did not work. |

Every AI-assisted commit is tagged `(AI-assisted)` in the history. The AI agents followed the rules in `AGENTS.md`: no new dependencies, no TypeScript, no secrets in files, small scoped diffs, and Khmer kept as real content.

## 6. Sources and credits

All 9 published entries were researched from the published sources below with Gemini's help (see §5), then checked and entered by the curator. Each entry names its source on its page.

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

- Master Sobpa Sith, Yike practitioner. The information comes from a *Khmer Times* video interview. I didn't speak to Master Sobpa Sith myself, so the name is credited as it appears in that published interview and not by personal permission.
- The percussionists, costume designers and wardrobe masters above are credited by role, the way the published sources describe them. I gathered this material from online sources and didn't contact any of them directly, so nobody was asked about being named and nobody asked not to be named.
- The community of Wat Svay Andet, Kandal, for its records of Lakhon Khol.

**Institutions and published sources**

- Royal University of Fine Arts (RUFA), Phnom Penh
- Ministry of Culture and Fine Arts, Cambodia, and its Department of Performing Arts
- UNESCO Intangible Cultural Heritage listing for the Royal Ballet of Cambodia
- Toni Samantha Phim and Ashley Thompson, *Dance in Cambodia*
- *Khmer Times*
- Wikipedia, "Yike"

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
- A stranger cannot publish their own entry through the page or the console: yes, tested 22 November 2026
- Logged out, the API returns nothing pending or returned: yes, tested 22 November 2026 (anon REST query returns only the 9 published rows; anon insert, update and `review_entry` are all refused)
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
- Q&A slot booked for 04 December, 12:10 PM TO 12:15 PM
