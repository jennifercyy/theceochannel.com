# How to publish on The CEO Channel

For Jamie. No code involved: everything happens in the editor.

**Editor address:** `theceochannel.com/admin` (until the domain is connected:
`jennifercyy.github.io/theceochannel.com/admin`)

After you press **Save**, the website updates by itself in about 2 minutes.

---

## Publish an article

1. Log in, then click **Articles** → **Create new**.
2. Fill in **Headline** and **Standfirst**.
3. Leave **Draft** switched ON while you work. Nobody can see a draft.
4. Pick the **Section** (the most specific one, e.g. *Succession* rather than
   *Leadership*) and the **Type of story**.
5. Add photos (see the photo map below).
6. Type or paste the story into **Article text**. Use *Heading 2* for sub-headings.
7. When it is ready: switch **Draft** OFF and press **Save**.

## Photo map — where each photo goes

| Box in the editor | Where it appears | Shape and minimum size |
|---|---|---|
| Photo 1 of 5 — Main photo (**required**) | Top of the article, full width. Also used for the story on the homepage, cropped to fit | Landscape 16:9 · 1600 × 900 px |
| Photo 2 of 5 | After the 2nd paragraph | Landscape 3:2 · 1200 × 800 px |
| Photo 3 of 5 | Middle of the article, LEFT of a side-by-side pair | Portrait 4:5 · 800 × 1000 px |
| Photo 4 of 5 | Middle of the article, RIGHT of the pair | Portrait 4:5 · 800 × 1000 px |
| Photo 5 of 5 | Before the last paragraph | Landscape 3:2 · 1200 × 800 px |
| Instagram post | Straight after the photo pair | Paste the Embed code from Instagram |
| Pull quote | Just before the photo pair | Short text |
| CEO portrait (in **CEOs**) | CEO Spotlight on the homepage | Portrait 4:5 · 800 × 1000 px |
| Video cover picture (in **Videos**) | Video block on the homepage | Landscape 16:9 · 1200 × 675 px |

Empty boxes are simply skipped — an article needs only Photo 1.

Keep the important part of Photo 1 near the centre: the homepage crops it to a
tall shape in the picture section and a square in the grey feature band.

## Run the homepage

Click **Homepage**:

- **Main story** and **Three stories beside the main story** — pick them.
- Every other section has a **Show** switch. Switch it off to hide the whole
  section. Nothing is deleted; switch it back on any time.
- **Picture section** and **List section** fill themselves with the newest
  stories from the section you choose.
- **Feature band** — you write the heading and description, and pick three stories.

## Hide or rename a menu tab

Click **Sections & menu**, open the section, and switch **Show in the menu**
off. Its articles stay online. *Position in the menu* sets the order.

## Footer emails and social links

Click **Footer & contact**. Leave a social link empty to hide its icon.

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
