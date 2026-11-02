// ============================================================
// The CEO Channel — editing system (Tina CMS)
//
// This file decides what Jamie sees after logging in at /admin:
// the menus on the left (Articles, CEOs, Homepage …) and every
// box on every form. The labels and help text below are written
// for Jamie, not for developers.
//
// Matches content-model.md. Change that file first, then this one.
// ============================================================
import { defineConfig } from "tinacms";

// ---------- Reusable pieces ----------

// One photo: the picture itself, plus caption and credit.
// `where` and `size` are shown to Jamie under the upload box.
function photo(name: string, label: string, where: string, size: string, required = false) {
  return {
    type: "object" as const,
    name,
    label,
    description: `${where} — ${size}`,
    fields: [
      { type: "image" as const, name: "src", label: "Upload photo", required },
      { type: "string" as const, name: "alt", label: "Describe the photo in a few words (for blind readers and Google)" },
      { type: "string" as const, name: "caption", label: "Caption (optional)" },
      { type: "string" as const, name: "credit", label: "Photo credit (optional)", description: "e.g. The CEO Channel, or Courtesy of Straits Meridian" },
    ],
  };
}

// A switch that shows or hides one homepage section.
function show(label: string) {
  return { type: "boolean" as const, name: "show", label: `Show “${label}” on the homepage`, description: "Turn off to hide the whole section. Nothing is deleted." };
}

// A list where Jamie picks articles one by one.
function pickArticles(name: string, label: string, description: string) {
  return {
    type: "object" as const,
    name,
    label,
    description,
    list: true,
    ui: { itemProps: (item: any) => ({ label: item?.article ? item.article.split("/").pop().replace(".md", "") : "Choose an article" }) },
    fields: [{ type: "reference" as const, name: "article", label: "Article", collections: ["article"] }],
  };
}

const branch =
  process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";

export default defineConfig({
  branch,

  // Filled in from Tina Cloud once the account is set up (see HOW-TO-PUBLISH.md).
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
          router: ({ document }) => `/articles/${document._sys.filename}/`,
          filename: { slugify: (v: any) => (v?.title || "").toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") },
        },
        defaultItem: () => ({ publishedDate: new Date().toISOString(), draft: true }),
        fields: [
          { type: "string", name: "title", label: "Headline", isTitle: true, required: true },
          { type: "string", name: "excerpt", label: "Standfirst", description: "One or two sentences under the headline. Also shown on homepage cards.", ui: { component: "textarea" }, required: true },
          {
            type: "boolean", name: "draft", label: "Draft — hide this article from the website",
            description: "Leave ON while writing. Turn OFF and press Save to publish.",
          },

          { type: "reference", name: "category", label: "Section", description: "Pick the most specific one, e.g. Succession rather than Leadership.", collections: ["category"], required: true },
          {
            type: "string", name: "format", label: "Type of story", required: true,
            description: "“Interview” stories appear in Latest interviews. “List” stories are favoured in Related reading.",
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

          // ---------- The five photos, in the order they appear ----------
          photo("photo1", "Photo 1 of 5 — Main photo", "TOP of the article, full width under the headline. Also used for this story everywhere on the homepage (cropped to fit)", "Landscape 16:9, at least 1600 × 900 px", true),
          photo("photo2", "Photo 2 of 5", "Inside the article, after the 2nd paragraph", "Landscape 3:2, at least 1200 × 800 px"),
          photo("photo3", "Photo 3 of 5 — left of a pair", "MIDDLE of the article, side by side with Photo 4", "Portrait 4:5, at least 800 × 1000 px"),
          photo("photo4", "Photo 4 of 5 — right of a pair", "MIDDLE of the article, side by side with Photo 3", "Portrait 4:5, at least 800 × 1000 px"),
          photo("photo5", "Photo 5 of 5", "Near the END, before the last paragraph", "Landscape 3:2, at least 1200 × 800 px"),
          {
            type: "string", name: "instagramEmbed", label: "Instagram post (optional — use when there are no press photos)",
            description: "On Instagram: open the post → ••• → Embed → Copy embed code, then paste it here. It appears straight after the photo pair (Photos 3 and 4).",
            ui: { component: "textarea" },
          },
          { type: "string", name: "pullQuote", label: "Pull quote (optional)", description: "A short line from the interview, shown large in the middle of the article, just before Photos 3 and 4.", ui: { component: "textarea" } },

          { type: "rich-text", name: "body", label: "Article text", description: "Type or paste the story. Use Heading 2 for sub-headings. Photos are placed automatically — see the photo boxes above for where.", isBody: true },

          // ---------- Linking ----------
          {
            type: "object", name: "relatedCEO", label: "CEOs in this story", list: true,
            description: "The story then appears under each CEO in CEO Spotlight.",
            fields: [{ type: "reference", name: "ceo", label: "CEO", collections: ["ceo"] }],
          },
          { type: "string", name: "storyLabel", label: "Label in CEO Spotlight (optional)", description: "e.g. Follow-up, Off the Record. Leave empty to use the type of story." },
          { type: "string", name: "tags", label: "Topics (optional)", list: true, description: "A few words, e.g. succession, banking. Used to pick Related reading." },
          { type: "reference", name: "nextArticle", label: "“Up next” article (optional)", description: "Leave empty and the next-newest story is used.", collections: ["article"] },

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
      // CEOs
      // ======================================================
      {
        name: "ceo",
        label: "CEOs",
        path: "content/ceos",
        format: "md",
        fields: [
          { type: "string", name: "name", label: "Name", isTitle: true, required: true },
          { type: "string", name: "role", label: "Job title", description: "e.g. Group CEO", required: true },
          { type: "string", name: "companyName", label: "Company", required: true },
          { type: "image", name: "portrait", label: "Portrait photo", description: "Shown in CEO Spotlight on the homepage — Portrait 4:5, at least 800 × 1000 px", required: true },
          { type: "string", name: "shortBio", label: "Short bio", ui: { component: "textarea" } },
          { type: "string", name: "linkedin", label: "LinkedIn link (optional)" },
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
          { type: "boolean", name: "showInMenu", label: "Show in the menu", description: "Turn off to hide this section (or sub-section) from the menu. Articles in it stay online." },
          { type: "reference", name: "parent", label: "Sits under (optional)", description: "Leave empty for a main menu section. Pick a section to make this a sub-section in its drop-down.", collections: ["category"] },
          { type: "number", name: "order", label: "Position in the menu", description: "1 = first" },
          { type: "string", name: "description", label: "Short description (optional)", ui: { component: "textarea" } },
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
        ui: { allowedActions: { create: false, delete: false }, router: () => "/" },
        fields: [
          { type: "reference", name: "leadStory", label: "Main story (top left, biggest picture)", collections: ["article"], required: true },
          pickArticles("secondaryStories", "Three stories beside the main story", "Pick exactly three. The first one shows with its picture."),

          {
            type: "object", name: "latestInterviews", label: "Latest interviews",
            description: "Fills itself with the three newest stories whose type is Interview.",
            fields: [show("Latest interviews")],
          },
          {
            type: "object", name: "spotlight", label: "CEO Spotlight (dark band)",
            fields: [
              show("CEO Spotlight"),
              { type: "string", name: "intro", label: "Line under the heading" },
              {
                type: "object", name: "ceos", label: "CEOs to feature (4 look best)", list: true,
                fields: [{ type: "reference", name: "ceo", label: "CEO", collections: ["ceo"] }],
              },
            ],
          },
          {
            type: "object", name: "photoSection", label: "Picture section (Tatler-style photo layout)",
            description: "One tall picture on the left, one wide and two small on the right. Fills itself with the four newest stories in the section you choose.",
            fields: [
              show("Picture section"),
              { type: "string", name: "heading", label: "Heading" },
              { type: "reference", name: "category", label: "Take stories from this section", collections: ["category"] },
            ],
          },
          {
            type: "object", name: "video", label: "Video block",
            fields: [
              show("Video block"),
              { type: "reference", name: "video", label: "Video to feature", collections: ["video"] },
            ],
          },
          {
            type: "object", name: "featureBand", label: "Feature band (grey panel)",
            description: "Heading and description on the left, three stories with small pictures on the right.",
            fields: [
              show("Feature band"),
              { type: "string", name: "heading", label: "Heading" },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              { type: "reference", name: "viewAll", label: "“View all” goes to this section", collections: ["category"] },
              pickArticles("articles", "Three stories", "Pick three."),
            ],
          },
          {
            type: "object", name: "insights", label: "List section",
            description: "A list of four stories with small pictures, newest first, from the section you choose.",
            fields: [
              show("List section"),
              { type: "string", name: "heading", label: "Heading" },
              { type: "reference", name: "category", label: "Take stories from this section", collections: ["category"] },
            ],
          },
          { type: "object", name: "newsletter", label: "Newsletter sign-up", fields: [show("Newsletter sign-up")] },
        ],
      },

      // ======================================================
      // SITE SETTINGS — footer details
      // ======================================================
      {
        name: "site",
        label: "Footer & contact",
        path: "content/settings",
        format: "json",
        match: { include: "site" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
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
