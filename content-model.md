# Content Model

This defines every content type the client can create and edit in the CMS.

**Write this before building pages.** Changing the content model after articles
exist means rewriting files by hand. Get it right once.

Each collection below becomes a folder of Markdown files in `/content/`.

---

## Article
`/content/articles/`

| Field | Type | Required | Notes |
|---|---|---|---|
| title | text | yes | |
| slug | text | yes | Auto from title; editable for SEO |
| excerpt | long text | yes | Shown on cards and listing pages |
| coverImage | image | yes | |
| coverCaption | text | no | |
| author | reference → Author | yes | |
| category | reference → Category | yes | One only |
| tags | list of references → Tag | no | |
| publishedDate | date | yes | |
| featured | boolean | no | Controls homepage hero |
| sponsored | boolean | no | Shows the "Sponsored" label |
| sponsorName | text | no | Only if sponsored is true |
| relatedCEO | reference → CEO | no | Links article to a profile |
| relatedBrand | reference → Brand | no | |
| body | rich text | yes | Supports headings, pull quotes, images |
| seoTitle | text | no | Falls back to title |
| seoDescription | text | no | Falls back to excerpt |

---

## CEO / Leader
`/content/ceos/`

| Field | Type | Required |
|---|---|---|
| name | text | yes |
| slug | text | yes |
| role | text | yes |
| company | reference → Brand | no |
| portrait | image | yes |
| shortBio | long text | yes |
| fullBio | rich text | no |
| linkedin | url | no |
| featured | boolean | no |

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
| featured | boolean | no |

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

| Field | Type | Required |
|---|---|---|
| name | text | yes |
| slug | text | yes |
| description | text | no |

Starting set: [decide with client — e.g. Leadership, Strategy, Industry, Interviews]

---

## Tag
`/content/tags/`

name · slug

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

## Not modelled (out of scope)
Ads · subscriptions/members · events · downloadable reports
