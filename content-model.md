# Content Model

This defines every content type the client can create and edit in the CMS.

**Write this before building pages.** Changing the content model after articles
exist means rewriting files by hand. Get it right once.

Each collection below becomes a folder of Markdown files in `/content/`.

> **Revision 4 — 3 Nov 2026.** Sections are now Interviews · C-Suites · Power Up ·
> Exec Lifestyle (menu) + Leadership (homepage only); no sub-sections or
> drop-downs. Homepage sections are a drag-to-reorder list. Seven photos per
> article, each with a Show tick and a focus point; Photo 1 no longer required.
> Articles can appear in extra sections ("Also show in"). Keywords (tags)
> shown under articles. Drafts are built at /preview/<name>/. Site settings
> gain logo, search on/off and Mailchimp address.
>
> **Revision 3 — 2 Nov 2026.** Built in Tina (`tina/config.ts`). Signature
> series removed (client does not want it). Every homepage section and every
> menu tab now has an on/off switch. Photos 1–5 have fixed positions (see
> Article). Tags are typed words rather than a separate collection.
>
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
| Menu bar | Categories with showInMenu on, by `order` |
| Homepage lead story + 3 secondary stories | Homepage settings |
| Homepage sections, in order | Homepage settings → `sections` blocks |
| Article: Related (4, under main photo) | Related rule |
| Article: Up next | `nextArticle` if set, otherwise the next-newest article |
| Article: Recommended (4) | Related rule, next four |
| Article: Keywords | `tags` |
| Sign-up forms (pop-up, homepage, in article) | Site settings → `mailchimpFormUrl` |
| Footer | Site settings |

---|---|
| Menu bar | Categories with showInMenu on, by order |
| Homepage lead story + 3 secondary stories | Homepage settings |
| Latest interviews | Newest 3 articles with format = Interview |
| CEO Spotlight | Homepage settings → chosen CEOs; each shows their linked articles |
| Video block | Homepage settings → chosen Video |
| Picture section (Tatler photo layout) | Homepage settings → chosen category; newest 4 |
| Feature band (grey panel) | Homepage settings → heading, description, 3 chosen articles |
| List section | Homepage settings → chosen category; newest 4 |
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
| photo1 … photo7 | {show, src, focus, alt, caption, credit} | no | **CHANGED (rev 4).** `show` tick hides a photo without deleting it; `focus` = center/top/bottom/left/right (what stays in view when cropped). Positions: 1 top of article + homepage; 2 after paragraph 2; 3 after paragraph 4; 4 + 5 side-by-side pair after paragraph 6; 6 after paragraph 8; 7 before the last paragraph |
| draft | boolean | no | On = hidden from the site; built at /preview/<name>/ for checking |
| draft | boolean | no | **NEW (rev 3).** On = hidden from the site |
| instagramEmbed | long text | no | **NEW.** Paste Instagram's Embed code (post → ••• → Embed). Used when there are no press photos |
| pullQuote | text | no | **CHANGED.** Was part of the body; now a separate optional field so it can be switched off site-wide **[confirm: keep pull quotes?]** |
| body | rich text | yes | Headings, paragraphs, links. Photos and embeds are placed automatically between paragraphs |
| author | reference → Author | yes | Shown on the article page only, never on the homepage |
| category | reference → Category | yes | Main section, shown as the label |
| alsoIn | list of {category} | no | **NEW (rev 4).** Extra sections the article also appears in |
| tags | list of words | no | Shown as **Keywords** under the article; used by Related / Recommended |
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
| showInMenu | boolean | no | Off = not on the menu bar; articles and homepage section stay |
| order | number | no | Position on the menu bar |
| description | text | no | Section page intro; also used by the grey band layout |

No sub-sections or drop-downs (removed rev 4).

| Section | In menu bar | Order |
|---|---|---|
| Interviews | yes | 1 |
| C-Suites | yes | 2 |
| Power Up | yes | 3 |
| Exec Lifestyle | yes | 4 |
| Leadership | no (homepage only) **[confirm]** | 5 |

---

## Homepage settings
`/content/settings/homepage.json` — a single file, not a collection.

| Field | Type | Notes |
|---|---|---|
| leadStory | reference → Article | Main story (big image + headline) |
| secondaryStories | list of {article} | Exactly 3 |
| sections | **ordered list of blocks** (drag to reorder) | See below |

Block types (`_template`):

| Block | Fields | Notes |
|---|---|---|
| stories | show, heading, category, layout | layout = grid (3) · pictures (Tatler, 4) · band (grey, 3) · list (4, with ad space). Newest stories whose main or "also show in" section matches |
| spotlight | show, heading, intro, ceos | Dark CEO band |
| video | show, video | |
| newsletter | show | "Sharpen your game" sign-up |

Default order (client, 3 Nov 2026): Interviews (grid) → Leadership (pictures) →
C-Suites (band) → Exec Lifestyle (list) → Power Up (grid) → CEO Spotlight
(hidden **[confirm]**) → Newsletter. Partner-content video and Lists & rankings
band removed.

---

## Site settings
`/content/settings/site.json` — a single file.

| Field | Type | Notes |
|---|---|---|
| logo | image | Menu bar logo; empty = THE CEO CHANNEL wordmark |
| searchEnabled | boolean | Shows/hides the search icon |
| mailchimpFormUrl | url | Mailchimp embedded-form action address; empty = "coming soon" message |
| tagline | text | Footer line ("Sharpening your game") |
| editorialEmail · partnershipsEmail · generalEmail | email | Footer only |
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
Ads · subscriptions/members · events · downloadable reports · infinite scroll · series
