# Search

Instructions for Cline. Read fully before making any changes.
This assumes Sprint 1 and Sprint 2 are already done and committed.

## Environment

Next.js 15 App Router, plain JavaScript, no TypeScript.

## Scope

Edit `app/page.js` only. Do not touch `components/EntryCard.js`, `data/data_entries.js`, `app/layout.js`, or `app/fonts.js`.

## Task

Add a search input above the entry list. As the user types, filter the entries array (already loaded from `data/data_entries.js`) to only show entries whose `title`, `description`, or `titleKh` field includes the typed text — case-insensitive matching.

This is client-side only:

- No server, no API route, no `fetch`.
- No new npm packages.
- Use React state (`useState`) to hold the search text and derive the filtered list from the existing entries array on every render — don't mutate the original array.

## Empty state

If no entries match the search text, show this message instead of the entry grid (do not use a generic "No results" placeholder):

[PLACEHOLDER — replace this line with your own message before sending to Cline, e.g. an English line and, if it fits your collection, a Khmer line beneath it. This is written by you, not generated.]

## Edge cases to handle sensibly

- Empty search text → show all entries (no filtering applied).
- A single letter → filter normally, even if it matches many or all entries.
- A word matching nothing → show the empty-state message above.
- Khmer text typed into the box → must correctly match against the `titleKh` field, not just `title`/`description`.

## Constraints

- No new npm packages, no CSS framework — plain inline styles matching the existing pattern in `app/page.js`.
- Don't change the "entries in the archive: X" count text's existing behavior — if you add a "X of Y entries shown" indicator for the filtered state, keep the original total count logic intact alongside it.

## Output

Show the plan first — exactly what's being added to `app/page.js` (state, filter logic, input placement) — before writing any code. Wait for approval.
