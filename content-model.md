# Content Model

This defines every content type the client can create and edit in the CMS.

**Write this before building pages.** Changing the content model after articles
exist means rewriting files by hand. Get it right once.

Each collection below becomes a folder of Markdown files in `/content/`.

> **Revision 2 — 22 Oct 2026.** Updated after the first round of client
> feedback on the homepage and article preview. Changes from revision 1 are
> marked **NEW** or **CHANGED**. Items marked **[confirm]** need the client's
> answer before the CMS is set up.

---

## How the pages use this content

So the client never touches HTML, every block on the site is filled from a
field below. Nothing on a page is typed in by hand.

| On the site | Comes from |
|---|---|
| Menu (sections + drop-down sub-sections) | Categories (`parent` field) |
| Homepage lead story + 3 secondary stories | Homepage settings |
| Latest interviews | Newest 3 articles with format = Interview |
| CEO Spotlight | Homepage settings → chosen CEOs; each shows their linked articles |
| Leadership mosaic | Newest 5 articles in the Leadership category |
| Video block | Homepage settings → chosen Video |
| Signature series | Series collection (in `order`) |
| Insights list | Newest 4 articles in the Insights category |
| Article: Up next | `nextArticle` if set, otherwise the next-newest article |
| Article: Related / More to read | Rule (see "Related articles rule") |
| Footer contact details | Site settings |

---

## Article
`/content/articles/`

| Field | Type | Required | Notes |
|---|---|---|---|
| title | text | yes | |
| slug | text | yes | Auto from title; editable for SEO |
| excerpt | long text | yes | Standfirst. Shown under the headline and on cards |
| format | choice | yes | **NEW.** Interview · Profile · Column · Listicle · News. Drives "Latest interviews" and the Related rule |
| storyLabel | text | no | **NEW.** Short label shown in CEO Spotlight, e.g. "Follow-up", "Off the Record". Falls back to `format` |
| coverImage | image | yes | Photo 1 of 5. Landscape 16:9, min 1600px wide |
| coverCaption | text | no | |
| coverCredit | text | no | **NEW** |
| gallery | list of {image, caption, credit, shape} | no | **NEW.** Photos 2–5. Max 4 items. `shape` = landscape or portrait; two portraits in a row display side by side |
| instagramEmbed | long text | no | **NEW.** Paste Instagram's Embed code (post → ••• → Embed). Used when there are no press photos |
| pullQuote | text | no | **CHANGED.** Was part of the body; now a separate optional field so it can be switched off site-wide **[confirm: keep pull quotes?]** |
| body | rich text | yes | Headings, paragraphs, links. Photos and embeds are placed automatically between paragraphs |
| author | reference → Author | yes | Shown on the article page only, never on the homepage |
| category | reference → Category | yes | One only. Pick a sub-category where one exists |
| tags | list of references → Tag | no | Used by the Related rule |
| series | reference → Series | no | **NEW** |
| publishedDate | date + time | yes | **CHANGED.** Now includes time |
| updatedDate | date + time | no | **NEW.** Shown as "Updated …" when filled in |
| relatedCEO | list of references → CEO | no | **CHANGED.** Now a list. An article can be about more than one leader. This is what fills each CEO's story list in CEO Spotlight |
| relatedBrand | reference → Brand | no | |
| nextArticle | reference → Article | no | **NEW.** Overrides "Up next". Leave empty to use the next-newest article |
| sponsored | boolean | no | Shows the "Partner content" label |
| sponsorName | text | no | Only if sponsored is true |
| seoTitle | text | no | Falls back to title |
| seoDescription | text | no | Falls back to excerpt |

Removed from revision 1: `featured` (replaced by Homepage settings, which is
clearer — the client picks the lead story directly instead of ticking a box).

---

## CEO / Leader
`/content/ceos/`

| Field | Type | Required | Notes |
|---|---|---|---|
| name | text | yes | |
| slug | text | yes | |
| role | text | yes | e.g. "Group CEO" |
| company | reference → Brand | no | |
| companyName | text | no | **NEW.** Used when there's no Brand page for the company |
| portrait | image | yes | Portrait 4:5 |
| shortBio | long text | yes | |
| fullBio | rich text | no | |
| linkedin | url | no | |

Their articles are not entered here: any article that lists this CEO in
`relatedCEO` appears on their card and profile page automatically, newest first.

Removed from revision 1: `featured` (moved to Homepage settings).

---

## Brand / Company
`/content/brands/`

| Field | Type | Required |
|---|---|---|
| name | text | yes |
| slug | text | yes |
| logo | image | yes |
| sector | text | no |
| description | rich text | yes |
| website | url | no |

---

## Video — NEW
`/content/videos/`

| Field | Type | Required | Notes |
|---|---|---|---|
| title | text | yes | |
| slug | text | yes | |
| description | long text | yes | 1–2 sentences |
| videoUrl | url | yes | YouTube or Vimeo link. The raw file is uploaded there, not to the site (too large for GitHub) |
| thumbnail | image | yes | 16:9 |
| duration | text | no | e.g. "4:12" |
| sponsored | boolean | no | Shows "Partner content" label |
| sponsorName | text | no | |
| relatedArticle | reference → Article | no | |
| publishedDate | date | yes | |

---

## Series — NEW
`/content/series/`

| Field | Type | Required | Notes |
|---|---|---|---|
| name | text | yes | e.g. "The First 100 Days" |
| slug | text | yes | |
| kicker | text | no | e.g. "Annual ranking", "Series · Audio" |
| description | text | yes | One line |
| image | image | yes | |
| order | number | yes | 1 = the large tile in the showcase |

---

## Author
`/content/authors/`

| Field | Type | Required |
|---|---|---|
| name | text | yes |
| slug | text | yes |
| photo | image | no |
| bio | long text | no |
| role | text | no |

---

## Category
`/content/categories/`

| Field | Type | Required | Notes |
|---|---|---|---|
| name | text | yes | |
| slug | text | yes | |
| description | text | no | |
| parent | reference → Category | no | **NEW.** Empty = top-level menu section. Filled = sub-section in that section's drop-down |
| order | number | no | **NEW.** Order in the menu |

Starting set — **[confirm with client; these are placeholders]**

| Section (top level) | Sub-sections (drop-down) |
|---|---|
| CEO Spotlight | Interviews · Profiles |
| Leadership | Boards & governance · Succession · Founders · Managing people |
| Insights | Strategy · Markets · Lists & rankings |
| Series | (built from the Series collection) |
| Video | Interviews on camera · Partner content |

"Industry" removed (client feedback, Oct 2026).

---

## Tag
`/content/tags/`

name · slug

---

## Homepage settings — NEW
`/content/settings/homepage.md` — a single file, not a collection.

| Field | Type | Required | Notes |
|---|---|---|---|
| leadStory | reference → Article | yes | Main story (big image + headline) |
| secondaryStories | list of references → Article | yes | Exactly 3 |
| spotlightCEOs | list of references → CEO | yes | 4, in display order |
| spotlightIntro | text | no | Line under the CEO Spotlight heading |
| featuredVideo | reference → Video | no | Hides the video block if empty |

---

## Site settings — NEW
`/content/settings/site.md` — a single file.

| Field | Type | Notes |
|---|---|---|
| tagline | text | Footer line |
| editorialEmail | email | Footer only |
| partnershipsEmail | email | Footer only |
| generalEmail | email | Footer only |
| linkedin · instagram · youtube · x | url | Footer social icons; empty = icon hidden |

---

## Page (About, Partner With Us)
`/content/pages/`

| Field | Type |
|---|---|
| title | text |
| slug | text |
| body | rich text |
| seoTitle | text |
| seoDescription | text |

---

## Inquiry (Partner With Us form submissions)

Captured fields: name · company · role · email · objective · message · submittedAt

Note: a static site cannot store form submissions by itself. Use a free form
service (Formspree, Web3Forms, or Netlify Forms) that emails submissions to the
client. Decide which in Phase 3.

---

## Related articles rule — NEW

A static site has no live algorithm, so "related" is a fixed rule applied each
time the site is rebuilt:

1. Same tags as this article, Listicle format first
2. Then same category
3. Then newest
4. Never the current article, and never the "Up next" article

**[confirm]** client is happy with a rule rather than personalised suggestions.

---

## Not modelled (out of scope)
Ads · subscriptions/members · events · downloadable reports · infinite scroll
