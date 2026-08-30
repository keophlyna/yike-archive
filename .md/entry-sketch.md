# Design System — Khmer Living Archive

Reference this file in Cline prompts instead of re-describing colors, fonts, or card layout each time. Point at a specific section, e.g. "use the palette in DESIGN.md section 1" or "match the EntryCard spec in DESIGN.md section 3."

---

## 1. Color Tokens

| Token       | Hex       | Use                                        |
| ----------- | --------- | ------------------------------------------ |
| `paper`     | `#ffffff` | Card background                            |
| `paper-dim` | `#faf9f6` | Page background behind cards               |
| `line`      | `#e7e3da` | Borders, dividers                          |
| `ink`       | `#1c1712` | Primary text (titles)                      |
| `ink-soft`  | `#5c554c` | Secondary/body text                        |
| `gold`      | `#b8892f` | Accent — rules, labels, number badge       |
| `jade`      | `#3f5d4e` | Secondary accent — category tag background |

These are the "clean and white" archival palette, distinct from the dark theme currently in `app/layout.js` (`#14181F` background). If a component should match the dark theme instead, say so explicitly in the prompt — otherwise Cline should assume the light palette above for new archive-facing UI (cards, entry listings).

---

## 2. Typography

Load all three via `next/font/google` in `app/layout.js` — built into Next.js, not a new dependency.

| Role               | Font             | Notes                                                                          |
| ------------------ | ---------------- | ------------------------------------------------------------------------------ |
| Display / titles   | `Fraunces`       | Weight 600 for headings                                                        |
| Body / description | `Source Serif 4` | Regular weight, relaxed line-height (~1.6)                                     |
| Labels / metadata  | `IBM Plex Mono`  | Uppercase, letter-spaced, used for small labels like "SOURCE", "PLACE", badges |

---

## 3. EntryCard Component Spec

Current file: `components/EntryCard.js`
Current props: `title`, `description`, `contributor`, `place`, `photo`

**Layout**

- Card: white background, `line` border, 6px radius, subtle drop shadow, max-width ~460px.
- Media (top): photo at 3:2 aspect ratio, `object-fit: cover`, rounded top corners only.
  - Top-left overlay badge: entry number (e.g. "Entry 04") — white text, dark translucent pill.
  - Bottom-left overlay badge: category tag (e.g. "Visual") — white text, `jade` translucent pill, uppercase, letter-spaced.
- Body (~28px padding):
  - Title — Fraunces, 600, ~23px, `ink` color.
  - Short rule — 32px wide, 2px tall, `gold`.
  - Description — Source Serif 4, ~15px, `ink-soft` color.
  - Footer (thin top border): two columns — "Source" and "Place" — each with a small uppercase `gold` mono label and the value in regular text below it.

**Constraints**

- No new npm packages, no CSS frameworks — plain inline style objects or a single CSS file, matching the existing pattern in the codebase.
- If adding new props (`entryNumber`, `category`), make them optional with sensible fallbacks so existing calls in `app/page.js` don't break.

---

## 4. Real Entry Data (source of truth for sample/seed data)

Pull from these — real data, never lorem ipsum, when Cline needs sample entries.

**Entry — Kampot Yike performance** _(retired — replaced by Entry 1 and Entry 2 below; remove from app/page.js when adding the pitch-based entries)_

- title: "Khmer Yike Lakhon"
- description: "On a moonlit evening in Kampot, the troupe opened with the traditional Yike orchestra of drums, gongs, and roneat. Elders remember audiences gathering on woven mats along the riverbank, following the story as it unfolded through call-and-response singing that lasted until dawn."
- contributor: "Community elders of Kampot"
- place: "Kampot Province"

**Entry 1 — History & Cultural Context of Lakhon Yike**

- title: "History & Cultural Context of Lakhon Yike"
- description: "Lakhon Yike traces its roots to Cham and Malay musical influence, and flourished in rural communities — particularly Takeo province — before receiving royal patronage through the 20th century. The tradition was rebuilt during Cambodia's post-1979 cultural recovery."
- contributor: "Ministry of Culture and Fine Arts, Royal University of Fine Arts Archives, UNESCO Phnom Penh"
- place: "Takeo Province"
- photo: `/entries/entry-01-history.jpg` _(add the real file to `public/entries/` — not yet present)_

**Entry 2 — Performance Structure, Staging & Movement**

- title: "Performance Structure, Staging & Movement"
- description: "Each performance opens with the Hom Rong ceremony, invoking ancestral teachers before the story begins. The ensemble — typically 12 to 25 performers — moves through call-and-response vocal dynamics across a defined stage geography."
- contributor: "Master Yike directors and troupe leaders from Takeo and Phnom Penh"
- place: "Takeo and Phnom Penh"
- photo: `/entries/entry-02-performance.jpg` _(add the real file to `public/entries/` — not yet present)_

**Entry — Costume Symbolism**

- title: "Costume Symbolism & Character Archetypes"
- description: "Traditional Yike wardrobe communicates character and status the moment a performer steps into view. Gilded crowns, painted colors, and carved horns identify archetypes instantly — including the Neak Rea (King/Royalty), Neang (Princess/Heroine), Yeak (Ogre/Antagonist), and Lok Ta (Hermit/Wise Sage)."
- contributor: "Dept. of Performing Arts costume designers; senior wardrobe masters"
- place: "Cambodia" _(narrow to a specific province if known)_
- photo: mask image — place in `public/entries/` before referencing

**Entry — Living Traditions: Master Sobpa Sith**

- title: "Living Traditions: Master Sobpa Sith"
- description: "Master Sobpa Sith is among the veteran Yike practitioners preserving the oral tradition of the art form — from how technique and repertoire are passed down between generations, to memories of rebuilding performance practice after the disruption of the post-1979 recovery era."
- contributor: "Master Sobpa Sith"
- place: _(fill in the real province/village — don't let Cline invent this)_

---

## 5. Data Model Gap (open decision)

`.md/entry-sketch.md` (course spec) requires `khmer name` and `date` as required fields; the current `EntryCard.js` doesn't have them. Decide before expanding the component further — don't let Cline add them silently as a side effect of an unrelated prompt.
