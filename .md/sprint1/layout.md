# Sprint 1, Step 3 — EntryCard layout

Instructions for Cline. Read fully before making any changes.
This step assumes Step 1 (fonts) and Step 2 (data fields) are already done and committed.

## Environment

Next.js 15 App Router, plain JavaScript, no TypeScript.

## Scope

Edit `components/EntryCard.js` only. Do not touch `data/data_entries.js`, `app/fonts.js`, `app/layout.js`, or `app/page.js`.

## Task

Rebuild the card to this layout:

- Card: photo at top, 3:2 aspect ratio, `object-fit: cover`, rounded top corners, max-width ~540px.
  - Top-left overlay badge on the photo: entry number (e.g. "Entry 01") — white text, dark translucent pill.
  - Bottom-left overlay badge on the photo: the fixed word "Visual" (media type, not the category) — dark text on a light mint translucent pill.
- Body (~30px padding):
  - A category pill (uses the new `category` field, e.g. "History") sitting above the title — separate from the "Visual" badge on the photo.
  - Title in English — Fraunces, weight 600, ~23px.
  - Title in Khmer below it — Noto Serif Khmer, ~17.5px. Only render this line if `titleKh` is non-empty; omit entirely if blank.
  - A short 32px-wide, 2px-tall horizontal rule.
  - Description — Source Serif 4, ~15.5px, relaxed line-height, wraps naturally, no clipping.
  - Footer, thin top border: two columns — "Source" and "Place" — small uppercase mono labels, values below.

Component needs a new prop: `entryNumber` (e.g. "Entry 01") and should read `category` and `titleKh` from the entry object passed in.

Use these colors for now (light mode only — theme switching comes in a later step):

- page/card bg `#ffffff`, border `#D8EAFF`
- primary text `#1F2A33`, secondary text `#496580`
- mint accent `#BAFFF5` (pair with dark text, never white), peach `#FFDBBB`

## Constraints

No new npm packages, no CSS framework — inline styles or a CSS file, matching the existing pattern.

## Output

Show the plan first — how the component structure and props are changing — before writing code. Wait for approval.
