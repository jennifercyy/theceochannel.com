# How to publish on The CEO Channel

For Jamie. No code involved: everything happens in the editor.

**Editor address:** `theceochannel.com/admin` (until the domain is connected:
`jennifercyy.github.io/theceochannel.com/admin`)

After you press **Save**, the website updates by itself in about 2 minutes.

---

## Publish an article

1. Log in, then click **Articles** → **Add File**.
2. Fill in **Headline**, **Standfirst**, **Section** and **Type of story** first —
   the editor won't open the photo boxes while these are empty.
3. Leave **Draft** switched ON while you work. Nobody can see a draft.
4. Optional: **Also show in these homepage sections** puts the story in more
   than one section (e.g. Interviews *and* Leadership).
5. Add photos (see the photo map below), then the **Article text**.
6. Add a few **Keywords** — they show under the article.
7. **Preview:** press Save, wait about 2 minutes, then open
   `theceochannel.com/preview/` + the article's name (shown at the top of the
   form, e.g. `/preview/my-headline/`). A bronze bar says it's a preview.
8. To publish: switch **Draft** OFF and press **Save**.

## Photo map — where each photo goes

Every photo box has a **Show this photo** tick (untick to leave it out without
deleting it) and **Keep this part in view when cropped** (Centre, Top, Bottom,
Left, Right — e.g. Top for a face). No photo is required.

**Choosing where a photo goes:** Photos 2, 3, 4, 6 and 7 each have a
**Put it after paragraph number** box. Leave it empty for the usual place
below, or type a number (e.g. 3 = after the 3rd paragraph) to suit the
length of the article. Photo 4's number moves the whole pair (4 and 5),
with the pull quote and Instagram post.

| Box | Usual place | Shape and minimum size |
|---|---|---|
| Photo 1 — Main photo | Top of the article, full width. Also the story's picture on the homepage | Landscape 16:9 · 1600 × 900 px |
| Photo 2 | After the 2nd paragraph | Landscape 3:2 · 1200 × 800 px |
| Photo 3 | After the 4th paragraph | Landscape 3:2 · 1200 × 800 px |
| Photo 4 | After the 6th paragraph, LEFT of a side-by-side pair | Portrait 4:5 · 800 × 1000 px |
| Photo 5 | RIGHT of the pair (always next to Photo 4) | Portrait 4:5 · 800 × 1000 px |
| Photo 6 | After the 8th paragraph | Landscape 3:2 · 1200 × 800 px |
| Photo 7 | Before the last paragraph | Landscape 3:2 · 1200 × 800 px |
| Pull quote | Just before the pair | Short text |
| Instagram post | Straight after the pair | Paste the Embed code from Instagram |
| Newsletter box | After the 5th paragraph (automatic) | — |
| Portrait (in **C-Suite profiles**) | Profile page and homepage C-Suite feature | Portrait 4:5 · 1200 × 1500 px |

Paragraphs are counted without sub-headings. In a short article, anything
there's no room for goes at the end, in order.

## Run the homepage

Click **Homepage**:

- **Main story** and **Three stories beside the main story** — pick them.
- **Sections, top to bottom** — drag the ⠿ handle to move a section up or
  down. Open a section to change its heading, which section it takes stories
  from, its **Layout** (Grid, Pictures, Grey band, List), or to switch it off.
  **+** adds a section; the bin removes it.

## C-Suite profiles (paid features)

Each person in **C-Suite profiles** gets their own page at
`theceochannel.com/profile/<name>/`: big portrait, job title, short bio,
full profile, links, and every story that mentions them, newest first.

- Turn on **Paid feature** when a company has paid for the profile — a
  "Partner feature" label appears on the profile and its homepage feature.
- To link a story to a profile: in the article, add the person under
  **C-Suite profiles in this story**. The story then appears on their
  profile, and the article shows a "View profile" box.
- To feature someone on the homepage: **Homepage** → open **C-Suites**
  (C-Suite feature) → **Person to feature on the left**.

## Menu bar

**Sections & menu** → open a section → **Show in the menu bar** on/off, and
**Position in the menu** for the order.

## Site settings

Logo for the menu bar · search icon on/off · Mailchimp sign-up address ·
footer line, emails and social links.

---

## One-time setup (Jennifer)

Do this once, before Jamie's first login.

1. Go to **app.tina.io** and sign up with GitHub.
2. Click **Create Project** → **Import your site** → choose
   `jennifercyy/theceochannel.com`. Site URL: the preview link for now.
3. In the project, open **Overview**, and copy the **Client ID**.
   Open **Tokens**, and copy the **Content (Read-only)** token.
4. On GitHub: the repo → **Settings** → **Secrets and variables** → **Actions**
   → **New repository secret**. Add `TINA_CLIENT_ID` (paste the Client ID),
   then `TINA_TOKEN` (paste the token).
5. On GitHub: **Settings** → **Pages** → **Source**: change to **GitHub Actions**.
6. In Tina, open **Collaborators** → **Add** → Jamie's email. Jamie gets an
   invite to set a password.

**Success looks like:** the **Actions** tab on GitHub shows a green tick for
"Publish website", and the editor address shows a login screen.

When theceochannel.com is connected, edit `.github/workflows/deploy.yml`:
set `PATH_PREFIX: /` and `TINA_BASE_PATH: ""`, and update the Site URL in Tina.
