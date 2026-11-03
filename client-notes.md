# Client notes and change log

Running record of client meetings, decisions and what changed on the site.
Newest first. Jamie Nonis uses they/them.

---

## 3 Nov 2026 — second round of client changes

Built and live
- Homepage sections can be dragged into any order in the editor; each has a
  layout choice and an on/off switch. Order set to Interviews → Leadership →
  C-Suites → Exec Lifestyle (replaces Insights) → Power Up → Newsletter.
- Removed: Partner content video block; Lists & rankings band.
- Section headings in CAPS; every "See all / View all" is now "More".
- Menu bar: navy, INTERVIEWS · C-SUITES · POWER UP · EXEC LIFESTYLE, no
  drop-downs, SUBSCRIBE button (pop-up "Sharpen your game"), search icon.
- Search built (Pagefind, free, no server); on/off switch in Site settings.
- Articles: 7 photo spaces, each with a Show tick and a "keep in view" focus
  point; no photo required; draft preview at /preview/<name>/; centred,
  wider header; Related with thumbnails under the main photo; newsletter box
  in the text; Keywords under the article; share icons in brand colours;
  "Add The CEO Channel on Google"; "Recommended" replaces "More to read";
  "Also show in" sections.
- Footer line: "Sharpening your game".

Waiting on the client
- Logo file (slot ready in Site settings) and navy hex (interim #14213D).
- Mailchimp account + embedded form address (sign-ups show "coming soon"
  until then).
- Leadership: on the homepage but not in the menu list — confirm.
- CEO Spotlight: not in the new order — switched off; confirm keep or drop.
- Pop-up says "Sharpen your game", footer says "Sharpening your game" —
  confirm both wordings are intended.

Scope notes
- Search delivered as goodwill (no charge), per 2 Nov discussion.
- Direct CRM integration remains out of scope; Mailchimp's own integrations
  can pass subscribers on to a CRM.
- Photo cropping/dragging inside the editor isn't available in Tina; the
  focus-point setting is the substitute.

---

## 2 Nov 2026 (afternoon) — editing system, first version

Decisions
- "Tatler Home awards" reference meant **photo placement**, not the awards
  format. Applied as two layouts: the picture section (tall + wide + two small)
  and the grey feature band (heading left, three picture rows right).
- Jamie does not want **Signature series** — removed from site, menu and editor.
- Other sections and tabs Jamie may not want can be **switched off in the
  editor** (Homepage → Show switches; Sections & menu → Show in the menu).
  Waiting on Jamie's list of which to switch off.
- Ad uploading raised — **out of scope** (CLAUDE.md). Not built; to be quoted
  as an add-on if wanted.

Built on branch `cms` (preview link unchanged until merged)
- Tina editor with Articles, CEOs, Sections & menu, Writers, Videos,
  Homepage, Footer & contact. Each photo box states position and size.
- Pages built from /content by Eleventy; auto-publish via GitHub Actions.
- HOW-TO-PUBLISH.md: photo map for Jamie + one-time Tina Cloud setup.

Still to build: About, Partner with us page + form, CEO and Brand profile
pages, GA4, newsletter hook-up.

---

## 2 Nov 2026 — deadline and colour confirmed

Decisions
- Brand bronze confirmed as **#B46943** (replaces the interim #8F6436).
- Completion deadline: **7 November 2026**, with the CMS working for Jamie and
  the site live.
- Balance invoice INV-2026-002 issued: SGD 2,000 (Phases 2 + 3), due on handover.

Site changes
- `--accent` in `styles.css` set to #B46943; `design-system.md` updated.
- `content-model.md` revision 2 (from 22 Oct) committed.

Plan to 7 Nov
| Day | Work |
|---|---|
| Mon 2 – Tue 3 | Pages become templates filled from `/content/`; Tina CMS set up from `content-model.md` |
| Wed 4 | Tina Cloud account connected to this repo; automatic publishing switched on |
| Thu 5 | Partner with us form, GA4, newsletter sign-up, SEO; domain pointed at the site |
| Fri 6 | Jamie publishes a test article; phone checks and fixes |
| Sat 7 | Handover walkthrough; invoice sent |

Needed from Jamie before Thu 5
- Final menu sections and sub-sections
- Branded video (YouTube or Vimeo link)
- Login to the theceochannel.com domain registrar
- Email address for partner inquiries
- GA4 measurement ID and Mailchimp account, if wanted at launch

---

## 22 Oct 2026 — first client review (Revision 1)

References given: Boulevard, CNA, The Peak, Tatler, SBR.

Applied to the site the same day
- Menu: each section has a drop-down of sub-sections (accordion on phones).
- Top of homepage: CNA-style main story plus three secondary stories; photo
  reduced so the next section shows; headline clicks through.
- "Latest interviews" moved up, under the top stories.
- "CEO Spotlight" replaces "CEO profiles"; each leader shows 2–3 articles.
- Leadership section picture-led (Tatler Homes layout).
- Signature series in the Tatler Home Design Awards format.
- Section layouts varied: grids, dark band, photo mosaic, video block, list.
- Removed: "Industry", homepage bylines, homepage contact (footer only).
- Partnerships hinted, not shown: labelled branded-video block and a quiet
  "Partner with us" link.
- Article page: 5 photo slots, Instagram embed slot, Published/Updated date and
  time, CNA-style share bar plus "Add as preferred source on Google", "Up next"
  block, related reading weighted to listicles.
- More bronze throughout (interim shade).

Open questions sent to Jamie (Revision 1 email, reminder set for 26 Oct)
1. Deck colour scheme — **bronze now settled (2 Nov)**
2. Keep pull quotes?
3. Is the Tatler awards format meant for the Signature series section?
4. Final menu sections and sub-sections
5. Branded video file or link
6. "Up next": automatic (next newest) or picked per article?

Unresolved from the notes: "Quotation – remove or not" (read as pull quotes).

Out of scope — offered as paid add-ons
Events section · continuous scroll into the next article · site search ·
Google Ad Manager setup · extra design revision rounds.
The search icon in the menu is a placeholder and does nothing.

---

## 31 Aug 2026 — kickoff

- Domain: **theceochannel.com** (Jamie's portfolio at jamienonis.com stays).
- Jamie's deck is a design reference only, not the spec. Scope is the
  SGD 3,000 quotation, three phases of SGD 1,000.
- Invoice 1 (Phase 1) paid.
- Design direction: authoritative, aspirational (Robb Report / Tatler / The Peak).
  Newsreader headlines, Inter body, light mode only, one accent colour.
- First homepage and article page put up on the preview link.
