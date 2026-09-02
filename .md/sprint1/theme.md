# Sprint 1, Step 5 — Light/dark theme

Instructions for Cline. Read fully before making any changes.
This step assumes Steps 1–4 are already done and committed.

## Environment

Next.js 15 App Router, plain JavaScript, no TypeScript.

## Scope

Edit `components/EntryCard.js`, `app/layout.js`, and `app/page.js` only (page.js only if needed for a toggle button — confirm with me first if so). Do not touch `data/data_entries.js` or `app/fonts.js`.

## Task

Support both light and dark themes via a `data-theme` attribute on `<html>` or `<body>`, toggled by a button somewhere visible on the page. Colors as CSS variables that swap based on the attribute.

**Light** (already the current EntryCard colors from Step 3):

- page bg `#EAF3FF`, card bg `#ffffff`, border `#D8EAFF`
- primary text `#1F2A33`, secondary text `#496580`
- mint accent `#BAFFF5`, peach `#FFDBBB`

**Dark:**

- page bg `#10181F`, card bg `#1B2733`, border `rgba(186,221,255,.14)`
- primary text `#F2F6FA`, secondary text `#9FB6C7`
- mint accent `#BAFFF5` stays the same; Khmer title switches to peach `#FFDBBB`; mono labels use mint

`app/layout.js` currently hardcodes a dark background (`#14181F`) directly as an inline style on `<body>` — replace that with the CSS-variable/data-theme approach so it responds to the toggle instead of being fixed.

## Constraints

No new npm packages. Keep the "entries in the archive" count text in `app/page.js` working correctly if you touch that file.

## Output

Show the plan first — especially what's changing in `app/layout.js` and where the toggle button lives — before writing any code. Wait for approval.
