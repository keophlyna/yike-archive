# Sprint 1, Step 4 — Responsive behavior

Instructions for Cline. Read fully before making any changes.
This step assumes Steps 1–3 are already done and committed.

## Environment

Next.js 15 App Router, plain JavaScript, no TypeScript.

## Scope

Edit `components/EntryCard.js` only. Do not touch any other file.

## Task

Add responsive behavior to the existing card:

- Card scales fluidly: max-width ~540px on desktop, full-width with ~16px side margins on mobile.
- Below ~600px width: reduce body padding (~30px → ~18px) and title size (~23px → ~18px). Keep the photo at 3:2 aspect ratio.
- Photo badges stay legible and don't wrap at small sizes — shrink font-size slightly (e.g. 11px → 10px) instead of wrapping.
- Source/Place footer stays two columns down to ~360px width; stack to one column only below that.
- No horizontal scroll or text cutoff at 320px width (smallest common phone).
- Use CSS media queries or fluid units (`clamp()`, `%`, `rem`) — no JS-based screen-size detection.

## Constraints

No new npm packages. Don't change the layout/content decisions from Step 3, only how it adapts to screen size.

## Output

Show the plan first — which breakpoints and rules you're adding — before writing code. Wait for approval.
