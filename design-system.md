# Design System — The CEO Channel

Derived from the client brief: AUTHORITATIVE · INFLUENTIAL · ASPIRATIONAL ·
INSPIRATIONAL. Reference titles: Robb Report, Tatler, The Peak.

These values are decided. Do not introduce any colour, font, or spacing value
that is not on this page. If a page seems to need a new value, fix the system
here first, then apply it everywhere.

---

## Colour

| Token | Hex | Used for |
|---|---|---|
| `--ink` | `#0F0F0F` | Headlines, body text |
| `--paper` | `#FFFFFF` | Page background |
| `--accent` | `#B46943` | Bronze. Category tags, links, rules, buttons, menu highlights |
| `--muted` | `#6E6E6E` | Bylines, dates, captions, metadata |
| `--rule` | `#E4E1DA` | Dividers, borders, card edges |
| `--wash` | `#F3F2EF` | Light grey panel: feature band, image placeholders while loading |

Reasoning: bronze, per client feedback (Oct 2026: "more bronze"). It reads
"business authority" rather than "lifestyle magazine" and survives being placed
next to corporate photography.

**Confirmed value.** `#B46943` supplied by the client (Nov 2026), replacing the
interim `#8F6436`. It lives in one place, `styles.css` (`--accent`), and every
bronze element on every page follows it.

Contrast: 4.2:1 on white. Fine for headings, rules, buttons and large text;
for small text keep it at weight 500+ (category tags already are).

Dark bands (CEO Spotlight) use `--ink` as background and `--paper` / `--rule`
for text. No new colour values.

Dark mode appears in the client brief but is NOT in the contracted scope.
Build light mode only.

---

## Typography

Both free on Google Fonts.

- Display / headlines: Newsreader, weights 500 and 600
- Body / UI: Inter, weights 400 and 500

| Role | Size (desktop / mobile) | Line height |
|---|---|---|
| Hero headline | 3.25rem / 2rem | 1.1 |
| Article headline | 2.5rem / 1.75rem | 1.15 |
| Section heading | 1.5rem | 1.2 |
| Card title | 1.125rem | 1.3 |
| Body | 1.0625rem | 1.65 |
| Byline / meta | 0.8125rem | 1.4 |

Rules:
- Body line length capped at 68 characters.
- Sentence case for headlines and section headings.
- ALL-CAPS permitted ONLY for category tags — 0.6875rem, letter-spacing 0.08em,
  in `--accent`. Nowhere else.
- Never italicise or recolour a single word inside a headline for emphasis.

---

## Spacing

One scale, in rem. Nothing off-scale.

0.25 · 0.5 · 1 · 1.5 · 2 · 3 · 4 · 6

- Section padding: 4rem desktop, 2rem mobile
- Max grid width: 1200px
- Max article text width: 680px

---

## Layout

- Breakpoints: mobile <640px · tablet 640–1024px · desktop >1024px
- Grid: 3 columns desktop, 2 tablet, 1 mobile
- Alignment: left. Centred text reads as marketing; this is a publication.

---

## Photography

The biggest driver of "aspirational" here. Portraits of business leaders, shot
dark and confident. Full-bleed hero image. Never place a colour wash over a
photograph.

---

## Components

- Article card (image, category tag, headline, date — no byline on the homepage)
- Picture section (Tatler Homes photo placement): tall picture + standfirst left;
  wide picture top right; two small pictures side by side below; centred
  "More … →" link under a hairline
- Feature band (Tatler Homes Design Awards placement): `--wash` panel,
  heading + short bronze bar + description left, three picture rows right
- Lead story + secondary stories block (main story with clickable title, three
  secondary stories beside it; replaces the full-bleed hero)
- Section menu with drop-down sub-sections (click to open/close; accordion on phones)
- CEO Spotlight card (portrait, name, role, two or more articles on that CEO)
- Partner content video block (labelled; links quietly to Partner with us)
- Photo placeholder (grey block, "Photo n of 5")
- Instagram embed slot
- Share bar (WhatsApp, Telegram, Facebook, LinkedIn, X, email, copy link,
  Add as preferred source on Google)
- Up next teaser + listicle-style related list
- Section heading with hairline rule
- Author byline block
- Pull quote
- Category tag
- Sponsored label
- Newsletter signup
- Footer

---

## Restraint rules

- One bold move per page. Everything else stays quiet.
- Motion only in response to a click. No fade-up-on-scroll.
- Borders encode structure; they do not decorate.
- Before shipping any page, remove one decorative element.# Design System

Fill in the bracketed decisions ONCE, then never deviate. Every page uses only
what is defined here. If a page seems to need a new value, the system is wrong —
fix it here first, then apply everywhere.

---

## Colour

Define 5 values. Not more. A magazine gets its personality from typography and
photography, not from a wide palette.

| Token | Hex | Used for |
|---|---|---|
| `--ink` | [#______] | Body text, headlines |
| `--paper` | [#______] | Page background |
| `--accent` | [#______] | Links, category tags, the one thing that draws the eye |
| `--muted` | [#______] | Bylines, dates, captions, metadata |
| `--rule` | [#______] | Dividers, borders, table lines |

Avoid: warm cream (#F4F1EA) with a terracotta accent (~#D97757). That exact
pairing is the current default look of AI-generated sites and reads as
templated. Pick something that belongs to *this* publication.

---

## Typography

Two families maximum. If two, make them obviously different — not two similar sans.

- **Display / headlines:** [FONT NAME], weight [___]
- **Body:** [FONT NAME], weight [___]

Type scale (set once, use everywhere):

| Role | Size | Line height |
|---|---|---|
| Article headline | [___] | [___] |
| Section heading | [___] | [___] |
| Card title | [___] | [___] |
| Body | [___] | [___] |
| Byline / meta | [___] | [___] |

Rules:
- Body line length under 80 characters. Serif body gets more line height than sans.
- Sentence case for headings. **No ALL-CAPS labels above sections** — it is the
  single commonest tell of a generated page.
- Do not italicise or recolour one word in a headline for emphasis.

---

## Spacing

One scale, in rem. Nothing off-scale.

`0.25 · 0.5 · 1 · 1.5 · 2 · 3 · 4 · 6`

Section padding: [___] desktop, [___] mobile.
Max content width: [___] (articles should be narrower than the grid pages).

---

## Layout

- Breakpoints: mobile [___] · tablet [___] · desktop [___]
- Grid: [___] columns desktop, [___] tablet, 1 mobile
- Alignment: [left / centred / mixed — decide and state why]

---

## Components

Keep this list short. Every component here must appear on at least two pages.

- Article card (image, category, headline, byline, date)
- Featured / hero article block
- Section heading with rule
- Author byline block
- Pull quote
- Category tag
- Sponsored label
- Newsletter signup
- Footer

---

## Restraint rules

- One bold move per page. Everything else stays quiet.
- Motion only where it answers a click. No fade-up-on-scroll on every section.
- Numbered markers (01 / 02 / 03) only where content is genuinely a sequence.
- Borders and dividers must encode structure, not decorate.
- Before shipping a page: remove one decorative element.
