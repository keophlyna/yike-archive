# Cline project rules — read automatically for every task in this repo.
# These are standing constraints so they don't need to be retyped per prompt.

## Stack
- Next.js 15, App Router, plain JavaScript. Never introduce TypeScript.
- No CSS frameworks (no Tailwind, no Bootstrap, etc.) — inline style objects or plain CSS files only, matching the existing pattern already in the codebase.

## Packages
- Never install a new npm package without it being explicitly requested in the prompt for that task.

## Process
- Always state your plan — which files you're touching and why — before writing any code. Wait for approval before editing.
- Only touch the files explicitly listed in a prompt's scope. If a change seems to require touching an unlisted file, stop and ask first rather than proceeding.
- Never run npm/git/shell commands unless the prompt explicitly asks for it — file edits only, unless told otherwise.

## Content integrity
- Never invent, guess, or pad missing data — including Khmer text, contributor names, places, or dates. If a field is missing or empty, leave it empty and flag it rather than filling it with plausible-sounding content.
- Real Khmer text and real names provided by the user must be preserved exactly as given, never paraphrased or "corrected."

## Reference files
- `DESIGN.md` (or `.md/entry-sketch.md`, depending on current project state) holds the design tokens, typography, and EntryCard spec — read it before styling anything rather than inventing new colors/fonts.
- `data/data_entries.js` holds the real archive entry data — use it as source of truth for sample/seed data, never lorem ipsum.
