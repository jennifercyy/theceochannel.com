# Project Context

## What this is
A digital business/leadership magazine site. The client is a journalist and
editor. Her core need: **publish articles herself, with ease, without touching
code.**

Client: JAMIE NONIS
Domain: theceochannel.com
Budget: SGD 3,000 fixed. Three phases, three invoices.

## Who you are working with
I am **not a developer**. Assume no prior knowledge of terminals, build systems,
or package managers. When you give me instructions:

- Give me the exact command or the exact file to change. Do not say "configure
  your environment" or "set up the build" without spelling out every step.
- Tell me what a successful result looks like, so I know whether it worked.
- If something can be done through the GitHub website instead of a terminal,
  prefer that.
- When I paste an error, explain in one plain sentence what broke before fixing it.

## Stack
- Static site hosted on **GitHub Pages** (free)
- **Tina CMS** for the client's editing interface (added in Phase 2, not before)
- Content stored as Markdown files in this repo
- No servers, no database, no monthly hosting cost

Do not propose migrating to another stack, framework, or host. This was chosen
deliberately for maintainability by a non-developer.

## Scope — what is IN
Homepage · Article page · CEO profile pages · Brand/Company profile pages ·
Insights listing page · About page · Partner With Us page + inquiry form ·
CMS login for the client · image uploads · categories · tags · author profiles ·
sponsored-content labelling · mobile responsive · SEO meta fields ·
custom domain

## Scope — what is OUT
Ad slots / Google Ad Manager · CRM integration · paywall or membership ·
events module · downloadable reports module · infinite scroll ·
additional partner landing page templates beyond one

**If I ask you to build something on the OUT list, stop and remind me it is out
of scope before writing any code.** This is a fixed-fee project and scope creep
is the main financial risk.

## Phases
1. Foundation — repo, design system, homepage, domain. **INVOICED & PAID.**
2. Core pages + Tina CMS working for the client
3. Conversion page, form, GA4, newsletter, SEO, QA, launch

## Working rules
- Read `design-system.md` before writing any CSS. Never introduce a colour,
  font, or spacing value that is not defined there.
- Read `content-model.md` before touching anything CMS-related.
- Keep pages as separate, readable HTML/CSS files. Favour clarity over cleverness —
  I need to be able to read this in six months.
- Every page must work on a phone. Check that first, not last.
- When you finish something, tell me how to see it in the browser.
