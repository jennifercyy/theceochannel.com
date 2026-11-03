// ============================================================
// The CEO Channel — editing system (Tina CMS)
//
// This file decides what Jamie sees after logging in at /admin:
// the menus on the left (Articles, CEOs, Homepage …) and every
// box on every form. The labels and help text below are written
// for Jamie, not for developers.
//
// Matches content-model.md. Change that file first, then this one.
//
// No `router` settings on purpose: our pages are plain HTML, so Tina's
// side-by-side visual preview can't attach to them. Without a router,
// clicking an item opens the full-screen form, which is what we want.
// Drafts get their own preview address instead (see the Draft switch).
// ============================================================
import { defineConfig } from "tinacms";

// ---------- Reusable pieces ----------

// Which part of a photo to keep in view when the site crops it.
const focusField = {
  type: "string" as const,
  name: "focus",
  label: "Keep this part in view when cropped",
  description: "The site trims photos to fit each space. The default keeps the upper part in view so faces aren’t cut off. Choose Top if heads are still cropped, or Exact middle for scenes and buildings.",
  options: [
    { value: "center", label: "Faces / upper centre (default)" },
    { value: "middle", label: "Exact middle" },
    { value: "top", label: "Top" },
    { value: "bottom", label: "Bottom" },
    { value: "left", label: "Left" },
    { value: "right", label: "Right" },
  ],
};

// One photo: a show/hide tick, the picture, its focus point, caption and credit.
// `where` and `size` are shown to Jamie on the photo box.
// `movable` adds a box to choose which paragraph the photo follows.
function photo(name: string, label: string, where: string, size: string, movable = "") {
  const place = movable
    ? [{
        type: "number" as const, name: "afterParagraph", label: "Put it after paragraph number (optional)",
        description: `${movable} Leave empty to use the usual place. Paragraphs are counted without sub-headings.`,
      }]
    : [];
  return {
    type: "object" as const,
    name,
    label,
    description: `${where} — ${size}`,
    fields: [
      { type: "boolean" as const, name: "show", label: "Show this photo", description: "Untick to leave this space out of the article. The photo stays saved." },
      { type: "image" as const, name: "src", label: "Upload photo" },
      ...place,
      focusField,
      { type: "string" as const, name: "alt", label: "Describe the photo in a few words (for blind readers and Google)" },
      { type: "string" as const, name: "caption", label: "Caption (optional)" },
      { type: "string" as const, name: "credit", label: "Photo credit (optional)", description: "e.g. The CEO Channel, or Courtesy of Straits Meridian" },
    ],
  };
}

// Name shown for each homepage section in the editor's list,
// e.g. "Interviews" or "CEO Spotlight (hidden)".
const sectionLabel = (fallback: string) => (item: any) => ({
  label: `${item?.heading || fallback}${item?.show === false ? "  (hidden)" : ""}`,
});

const show = (label: string) => ({
  type: "boolean" as const,
  name: "show",
  label: `Show “${label}”`,
  description: "Turn off to hide this section. Nothing is deleted.",
});

const branch =
  process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";

export default defineConfig({
  branch,

  // Filled in from Tina Cloud (GitHub secrets TINA_CLIENT_ID, TINA_TOKEN).
  clientId: process.env.TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,

  build: {
    outputFolder: "admin", // the login page lives at /admin
    publicFolder: "",
    // On the preview link the site sits under /theceochannel.com/.
    // Set in .github/workflows/deploy.yml; empty on the real domain.
    basePath: process.env.TINA_BASE_PATH || "",
  },

  // Uploaded photos are saved in images/uploads/ in this repo.
  media: {
    tina: { mediaRoot: "images/uploads", publicFolder: "" },
  },

  schema: {
    collections: [
      // ======================================================
      // ARTICLES
      // ======================================================
      {
        name: "article",
        label: "Articles",
        path: "content/articles",
        format: "md",
        ui: {
          filename: { slugify: (v: any) => (v?.title || "").toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") },
        },
        defaultItem: () => ({ publishedDate: new Date().toISOString(), draft: true }),
        fields: [
          { type: "string", name: "title", label: "Headline", isTitle: true, required: true },
          { type: "string", name: "excerpt", label: "Standfirst", description: "One or two sentences under the headline. Also shown on homepage cards.", ui: { component: "textarea" }, required: true },
          {
            type: "boolean", name: "draft", label: "Draft — hide this article from the website",
            description: "Leave ON while writing. To preview: press Save, wait 2 minutes, then open theceochannel.com/preview/ followed by the name shown at the top of this page (e.g. /preview/my-headline/). Turn OFF and Save to publish.",
          },

          {
            type: "boolean", name: "featured", label: "Feature at the top of the homepage",
            description: "Tick to put this story in the top area of the homepage. The newest ticked story becomes the main story; the next three sit beside it. If fewer than four are ticked, the picks on the Homepage screen fill the gaps.",
          },
          { type: "reference", name: "category", label: "Section", description: "The article's main section. It shows as the label above the headline.", collections: ["category"], required: true },
          {
            type: "object", name: "alsoIn", label: "Also show in these homepage sections (optional)", list: true,
            description: "The article also appears in these sections on the homepage and their pages.",
            fields: [{ type: "reference", name: "category", label: "Section", collections: ["category"] }],
          },
          {
            type: "string", name: "format", label: "Type of story", required: true,
            description: "“List” stories are favoured in Recommended and Related reading.",
            options: [
              { value: "Interview", label: "Interview" },
              { value: "Profile", label: "Profile" },
              { value: "Column", label: "Column" },
              { value: "Listicle", label: "List (e.g. 7 habits of…)" },
              { value: "News", label: "News" },
            ],
          },
          { type: "reference", name: "author", label: "Written by", description: "Shown on the article page only, never on the homepage.", collections: ["author"] },
          { type: "datetime", name: "publishedDate", label: "Published on", ui: { timeFormat: "h:mm A" }, required: true },
          { type: "datetime", name: "updatedDate", label: "Updated on (optional)", description: "Fill in when you edit a story after publishing. Shows as “Updated …”.", ui: { timeFormat: "h:mm A" } },

          // ---------- The seven photos, in the order they appear ----------
          photo("photo1", "Photo 1 of 7 — Main photo", "TOP of the article, full width. Also used for this story on the homepage", "Landscape 16:9, at least 1600 × 900 px"),
          photo("photo2", "Photo 2 of 7", "Usually after the 2nd paragraph (you can change this)", "Landscape 3:2, at least 1200 × 800 px", "e.g. 3 puts it after the 3rd paragraph."),
          photo("photo3", "Photo 3 of 7", "Usually after the 4th paragraph (you can change this)", "Landscape 3:2, at least 1200 × 800 px", "e.g. 5 puts it after the 5th paragraph."),
          photo("photo4", "Photo 4 of 7 — left of a pair", "Usually after the 6th paragraph, side by side with Photo 5 (you can change this)", "Portrait 4:5, at least 800 × 1000 px", "This moves the whole pair (Photos 4 and 5), with the pull quote and Instagram post that go with it."),
          photo("photo5", "Photo 5 of 7 — right of a pair", "Always next to Photo 4 — move Photo 4 to move the pair", "Portrait 4:5, at least 800 × 1000 px"),
          photo("photo6", "Photo 6 of 7", "Usually after the 8th paragraph (you can change this)", "Landscape 3:2, at least 1200 × 800 px", "e.g. 7 puts it after the 7th paragraph."),
          photo("photo7", "Photo 7 of 7", "Usually before the last paragraph (you can change this)", "Landscape 3:2, at least 1200 × 800 px", "Fill in a number to put it after that paragraph instead."),
          {
            type: "string", name: "instagramEmbed", label: "Instagram post (optional — use when there are no press photos)",
            description: "On Instagram: open the post → ••• → Embed → Copy embed code, then paste it here. It appears straight after the photo pair (Photos 4 and 5).",
            ui: { component: "textarea" },
          },
          { type: "string", name: "pullQuote", label: "Pull quote (optional)", description: "A short line, shown large just before the photo pair (Photos 4 and 5), wherever the pair is placed.", ui: { component: "textarea" } },

          { type: "rich-text", name: "body", label: "Article text", description: "Type or paste the story. Use Heading 2 for sub-headings. Photos and a newsletter sign-up box are placed automatically.", isBody: true },

          // ---------- Linking ----------
          { type: "string", name: "tags", label: "Keywords", list: true, description: "A few words, e.g. succession, banking. Shown under the article, and used to pick Related and Recommended stories." },
          {
            type: "object", name: "relatedCEO", label: "C-Suite profiles in this story", list: true,
            description: "The story is then listed on each person's profile page and in their homepage feature, and the article links to their profile.",
            fields: [{ type: "reference", name: "ceo", label: "Person", collections: ["ceo"] }],
          },
          { type: "string", name: "storyLabel", label: "Label in CEO Spotlight (optional)", description: "e.g. Follow-up, Off the Record. Leave empty to use the type of story." },

          // ---------- Partner content ----------
          { type: "boolean", name: "sponsored", label: "This is partner (paid) content", description: "Adds the “Partner content” label wherever the story appears." },
          { type: "string", name: "sponsorName", label: "Partner name", description: "Only needed if the switch above is on." },

          // ---------- Google ----------
          {
            type: "object", name: "seo", label: "Google settings (optional)",
            description: "Leave empty and the headline and standfirst are used.",
            fields: [
              { type: "string", name: "title", label: "Title shown on Google" },
              { type: "string", name: "description", label: "Description shown on Google", ui: { component: "textarea" } },
            ],
          },
        ],
      },

      // ======================================================
      // C-SUITE PROFILES — one page each, at /profile/<name>/
      // ======================================================
      {
        name: "ceo",
        label: "C-Suite profiles",
        path: "content/ceos",
        format: "md",
        fields: [
          { type: "string", name: "name", label: "Name", isTitle: true, required: true },
          { type: "string", name: "role", label: "Job title", description: "e.g. Co-founder and Senior Vice President", required: true },
          { type: "string", name: "companyName", label: "Company", required: true },
          { type: "image", name: "portrait", label: "Portrait photo", description: "Shown large on the profile page and the homepage C-Suite feature — Portrait 4:5, at least 1200 × 1500 px. Until one is uploaded, a grey panel with initials shows." },
          focusField,
          { type: "string", name: "shortBio", label: "Short bio", description: "Two or three sentences. Shown on the homepage feature and at the top of the profile page.", ui: { component: "textarea" } },
          { type: "rich-text", name: "body", label: "Full profile (optional)", description: "Longer profile shown on the profile page.", isBody: true },
          { type: "string", name: "linkedin", label: "LinkedIn link (optional)" },
          { type: "string", name: "website", label: "Company website (optional)" },
          {
            type: "boolean", name: "sponsored", label: "Paid feature",
            description: "Turn on when the company has paid for this profile. Adds a “Partner feature” label to the profile and its homepage feature.",
          },
        ],
      },

      // ======================================================
      // SECTIONS (the menu)
      // ======================================================
      {
        name: "category",
        label: "Sections & menu",
        path: "content/categories",
        format: "md",
        fields: [
          { type: "string", name: "name", label: "Name", isTitle: true, required: true },
          { type: "boolean", name: "showInMenu", label: "Show in the menu bar", description: "Turn off to keep this section off the menu bar. Its articles and homepage section stay online." },
          { type: "number", name: "order", label: "Position in the menu", description: "1 = first (left)" },
          { type: "string", name: "description", label: "Short description (optional)", description: "Shown on the section's own page, and in the grey band layout.", ui: { component: "textarea" } },
        ],
      },

      // ======================================================
      // AUTHORS
      // ======================================================
      {
        name: "author",
        label: "Writers",
        path: "content/authors",
        format: "md",
        fields: [
          { type: "string", name: "name", label: "Name", isTitle: true, required: true },
          { type: "string", name: "role", label: "Role (optional)" },
          { type: "image", name: "photo", label: "Photo (optional)", description: "Square, at least 400 × 400 px" },
          { type: "string", name: "bio", label: "Short bio (optional)", ui: { component: "textarea" } },
        ],
      },

      // ======================================================
      // VIDEOS
      // ======================================================
      {
        name: "video",
        label: "Videos",
        path: "content/videos",
        format: "md",
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "string", name: "description", label: "One or two sentences", ui: { component: "textarea" } },
          { type: "string", name: "videoUrl", label: "YouTube or Vimeo link", description: "Upload the video to YouTube or Vimeo first, then paste its link here. Video files are too large to upload to the site itself." },
          { type: "image", name: "thumbnail", label: "Cover picture", description: "Shown before the video plays — Landscape 16:9, at least 1200 × 675 px" },
          { type: "string", name: "duration", label: "Length (optional)", description: "e.g. 4:12" },
          { type: "boolean", name: "sponsored", label: "This is partner (paid) content" },
          { type: "string", name: "sponsorName", label: "Partner name" },
        ],
      },

      // ======================================================
      // HOMEPAGE — one screen to run the front page
      // ======================================================
      {
        name: "homepage",
        label: "Homepage",
        path: "content/settings",
        format: "json",
        match: { include: "homepage" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "reference", name: "leadStory", label: "Main story (used when no article has “Feature at the top of the homepage” ticked)", description: "Ticking “Feature at the top of the homepage” on an article overrides this.", collections: ["article"] },
          {
            type: "object", name: "secondaryStories", label: "Three stories beside the main story (fill-ins)", list: true,
            description: "Used to fill any of the three places not taken by ticked “Feature” articles.",
            ui: { itemProps: (item: any) => ({ label: item?.article ? item.article.split("/").pop().replace(".md", "") : "Choose an article" }) },
            fields: [{ type: "reference", name: "article", label: "Article", collections: ["article"] }],
          },
          {
            type: "object", name: "sections", label: "Sections, top to bottom (drag ⠿ to reorder)", list: true,
            description: "Drag a section up or down to move it on the homepage. Press + to add a section; the bin removes it.",
            templates: [
              {
                name: "stories",
                label: "Section of stories",
                ui: { defaultItem: { show: true, layout: "grid" }, itemProps: sectionLabel("New section of stories") },
                fields: [
                  show("this section"),
                  { type: "string", name: "heading", label: "Heading", description: "Shown in capitals on the site" },
                  { type: "reference", name: "category", label: "Take the newest stories from", collections: ["category"] },
                  {
                    type: "string", name: "layout", label: "Layout",
                    options: [
                      { value: "grid", label: "Grid — three cards in a row" },
                      { value: "pictures", label: "Pictures — one tall, one wide, two small (Tatler style)" },
                      { value: "band", label: "Grey band — description left, three small pictures right" },
                      { value: "list", label: "List — four rows with small pictures" },
                    ],
                  },
                ],
              },
              {
                name: "csuite",
                label: "C-Suite feature (big portrait left, stories right)",
                ui: { defaultItem: { show: true }, itemProps: sectionLabel("C-Suite feature") },
                fields: [
                  show("C-Suite feature"),
                  { type: "string", name: "heading", label: "Heading", description: "e.g. C-Suites" },
                  { type: "reference", name: "ceo", label: "Person to feature on the left", description: "Their portrait, short bio and the stories that mention them.", collections: ["ceo"] },
                  { type: "reference", name: "category", label: "Fill the right side with the newest stories from", collections: ["category"] },
                ],
              },
              {
                name: "spotlight",
                label: "CEO Spotlight (dark band)",
                ui: { defaultItem: { show: true }, itemProps: sectionLabel("CEO Spotlight") },
                fields: [
                  show("CEO Spotlight"),
                  { type: "string", name: "heading", label: "Heading" },
                  { type: "string", name: "intro", label: "Line under the heading" },
                  {
                    type: "object", name: "ceos", label: "People to feature (4 look best)", list: true,
                    fields: [{ type: "reference", name: "ceo", label: "Person", collections: ["ceo"] }],
                  },
                ],
              },
              {
                name: "video",
                label: "Video",
                ui: { defaultItem: { show: true }, itemProps: sectionLabel("Video") },
                fields: [
                  show("Video"),
                  { type: "reference", name: "video", label: "Video to feature", collections: ["video"] },
                ],
              },
              {
                name: "newsletter",
                label: "Newsletter sign-up",
                ui: { defaultItem: { show: true }, itemProps: sectionLabel("Newsletter sign-up") },
                fields: [show("Newsletter sign-up")],
              },
            ],
          },
        ],
      },

      // ======================================================
      // SITE SETTINGS — logo, search, newsletter, footer
      // ======================================================
      {
        name: "site",
        label: "Site settings",
        path: "content/settings",
        format: "json",
        match: { include: "site" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "image", name: "logo", label: "Logo for the menu bar (optional)", description: "Shown on the navy menu bar instead of the words THE CEO CHANNEL. A white or light logo, PNG or SVG with a transparent background, at least 400 px wide." },
          { type: "boolean", name: "searchEnabled", label: "Show the search icon", description: "Turn off to hide search from the site." },
          {
            type: "string", name: "mailchimpFormUrl", label: "Mailchimp sign-up address",
            description: "Where newsletter sign-ups are sent. In Mailchimp: Audience → Signup forms → Embedded forms → copy the address after action=\" in the code. Until this is filled in, the sign-up boxes show a ‘coming soon’ message.",
          },
          { type: "string", name: "tagline", label: "Line under the logo in the footer" },
          { type: "string", name: "editorialEmail", label: "Editorial email" },
          { type: "string", name: "partnershipsEmail", label: "Partnerships email" },
          { type: "string", name: "generalEmail", label: "General email" },
          { type: "string", name: "linkedin", label: "LinkedIn page link", description: "Leave empty to hide the icon" },
          { type: "string", name: "instagram", label: "Instagram link", description: "Leave empty to hide the icon" },
          { type: "string", name: "youtube", label: "YouTube link", description: "Leave empty to hide the icon" },
          { type: "string", name: "x", label: "X (Twitter) link", description: "Leave empty to hide the icon" },
        ],
      },
    ],
  },
});
