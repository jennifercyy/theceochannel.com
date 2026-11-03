// ============================================================
// Reads everything Jamie saves in the editor (the files in
// /content) and prepares it for the page templates.
//
// You should not need to edit this file to publish anything.
// ============================================================
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const markdown = require("markdown-it")({ html: true, typographer: true });

const ROOT = path.join(__dirname, "..");

// Read every .md file in a /content sub-folder.
// Each item is keyed by its path, e.g. "content/ceos/grace-tan.md",
// because that is how the editor links one item to another.
function readFolder(folder) {
  const dir = path.join(ROOT, "content", folder);
  if (!fs.existsSync(dir)) return {};
  const items = {};
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
    const key = `content/${folder}/${file}`;
    items[key] = { ...data, slug: file.replace(/\.md$/, ""), key, bodyMarkdown: content };
  }
  return items;
}

function readJson(name) {
  const file = path.join(ROOT, "content", "settings", `${name}.json`);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
}

// "2026-08-26T00:00:00.000Z" → "26 August 2026" (Singapore time)
function formatDate(iso, withTime) {
  if (!iso) return "";
  const opts = { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Singapore" };
  if (withTime) Object.assign(opts, { hour: "numeric", minute: "2-digit" });
  return new Date(iso).toLocaleString("en-SG", opts).replace(" at ", ", ").replace("am", "AM").replace("pm", "PM");
}

// "Keep this part in view" → CSS object-position
// "center" (the default) keeps the upper part of the photo in view,
// where faces usually are; "middle" is the exact centre.
const FOCUS = { center: "50% 25%", middle: "50% 50%", top: "50% 0%", bottom: "50% 100%", left: "0% 50%", right: "100% 50%" };

// A photo counts only if it has a picture AND "Show this photo" isn't unticked.
function usable(p) {
  if (!p || !p.src || p.show === false) return null;
  return { ...p, position: FOCUS[p.focus] || FOCUS.center };
}

// Split the article text into blocks (paragraphs and headings) and
// slot photos and the newsletter box in between. "After paragraph N"
// counts paragraphs only, not sub-headings. Usual places:
//   Photo 2              after paragraph 2
//   Photo 3              after paragraph 4
//   Newsletter box       after paragraph 5
//   Pull quote, Photos 4 + 5 (pair), Instagram   after paragraph 6
//   Photo 6              after paragraph 8
//   Photo 7              before the last paragraph
// Jamie can override 2, 3, 4 (moves the pair), 6 and 7 with
// "Put it after paragraph number" in the editor.
// Anything a short article has no room for goes at the end, in order.
function buildBody(a) {
  const blocks = a.bodyMarkdown
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => ({ type: "html", html: markdown.render(b) }));

  const p = (n) => usable(a[`photo${n}`]);
  const chosen = (n) => {
    const v = parseInt(a[`photo${n}`] && a[`photo${n}`].afterParagraph, 10);
    return v > 0 ? v : null;
  };
  const slots = [
    { after: chosen(2) || 2, order: 1, items: [p(2) && { type: "photo", photo: p(2) }] },
    { after: chosen(3) || 4, order: 2, items: [p(3) && { type: "photo", photo: p(3) }] },
    { after: 5, order: 3, items: [{ type: "newsletter" }] },
    {
      after: chosen(4) || 6, order: 4,
      items: [
        a.pullQuote && { type: "quote", text: a.pullQuote },
        (p(4) || p(5)) && { type: "pair", left: p(4), right: p(5) },
        a.instagramEmbed && { type: "instagram", html: a.instagramEmbed },
      ],
    },
    { after: chosen(6) || 8, order: 5, items: [p(6) && { type: "photo", photo: p(6) }] },
    // Photo 7: a chosen paragraph, otherwise "before the last paragraph"
    { after: chosen(7), beforeLast: !chosen(7), order: 6, items: [p(7) && { type: "photo", photo: p(7) }] },
  ]
    .map((s) => ({ ...s, items: s.items.filter(Boolean), placed: false }))
    .filter((s) => s.items.length);

  const parts = [];
  let paragraphs = 0;
  const lastIndex = blocks.length - 1;
  blocks.forEach((block, i) => {
    if (i === lastIndex && blocks.length > 1) {
      for (const s of slots) if (s.beforeLast && !s.placed) { parts.push(...s.items); s.placed = true; }
    }
    parts.push(block);
    if (block.html.startsWith("<p")) {
      paragraphs++;
      for (const s of slots) if (!s.placed && !s.beforeLast && s.after === paragraphs) { parts.push(...s.items); s.placed = true; }
    }
  });
  for (const s of slots.sort((x, y) => x.order - y.order)) if (!s.placed) parts.push(...s.items);
  return parts;
}

module.exports = function () {
  const categories = readFolder("categories");
  const authors = readFolder("authors");
  const ceos = readFolder("ceos");
  const videos = readFolder("videos");
  const allArticles = readFolder("articles");
  const homepage = readJson("homepage");
  const site = readJson("site");

  // ---------- Sections and menu (no drop-downs) ----------
  for (const c of Object.values(categories)) c.url = `/section/${c.slug}/`;
  const byOrder = (a, b) => (a.order || 99) - (b.order || 99);
  const menu = Object.values(categories)
    .filter((c) => c.showInMenu !== false)
    .sort(byOrder)
    .map((c) => ({ name: c.name, slug: c.slug, url: c.url }));

  // ---------- Articles (published and drafts) ----------
  const iso = (d) => (d ? new Date(d).toISOString() : "");
  const everything = Object.values(allArticles).sort(
    (a, b) => new Date(b.publishedDate) - new Date(a.publishedDate)
  );
  for (const a of everything) {
    a.publishedDate = iso(a.publishedDate);
    a.updatedDate = iso(a.updatedDate);
    a.isDraft = a.draft === true;
    a.url = a.isDraft ? `/preview/${a.slug}/` : `/articles/${a.slug}/`;
    a.cat = categories[a.category] || { name: "", url: "/" };
    a.sectionKeys = [a.category, ...(a.alsoIn || []).map((x) => x.category)].filter(Boolean);
    a.authorInfo = authors[a.author] || null;
    a.date = formatDate(a.publishedDate);
    a.publishedText = formatDate(a.publishedDate, true);
    a.updatedText = formatDate(a.updatedDate, true);
    a.lead = usable(a.photo1);
    a.image = a.lead ? a.lead.src : "";
    a.imagePosition = a.lead ? a.lead.position : FOCUS.center;
    a.keywords = (a.tags || []).filter(Boolean);
    a.parts = buildBody(a);
    a.label = a.sponsored ? `Partner content${a.sponsorName ? " · " + a.sponsorName : ""}` : a.cat.name;
  }
  const articles = everything.filter((a) => !a.isDraft); // what the public sees

  // Short version of an article, used wherever one story links to
  // another (so the data never loops back on itself).
  const summary = (a) => a && ({
    url: a.url, title: a.title, excerpt: a.excerpt, image: a.image, imagePosition: a.imagePosition,
    date: a.date, label: a.label, sponsored: a.sponsored, format: a.format, storyLabel: a.storyLabel,
    cat: { name: a.cat.name },
  });
  const byKey = Object.fromEntries(articles.map((a) => [a.key, a]));
  const inSection = (catKey) => articles.filter((a) => a.sectionKeys.includes(catKey));

  // Related (4 under the main photo) and Recommended (the next 4)
  for (const a of everything) {
    const others = articles.filter((o) => o !== a);
    const shared = (o) => (o.keywords || []).some((t) => a.keywords.includes(t));
    const sameSection = (o) => o.sectionKeys.some((k) => a.sectionKeys.includes(k));
    const score = (o) => (shared(o) ? 4 : 0) + (o.format === "Listicle" ? 2 : 0) + (sameSection(o) ? 1 : 0);
    a.related = others
      .map((o, idx) => ({ o, s: score(o), idx }))
      .sort((x, y) => y.s - x.s || x.idx - y.idx)
      .slice(0, 8)
      .map((x) => summary(x.o));
  }

  // ---------- C-Suite profiles (/profile/<name>/) ----------
  const initials = (name) => (name || "").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  for (const c of Object.values(ceos)) {
    c.url = `/profile/${c.slug}/`;
    c.initials = initials(c.name);
    c.portraitPosition = FOCUS[c.focus] || FOCUS.center;
    c.bodyHtml = c.bodyMarkdown && c.bodyMarkdown.trim() ? markdown.render(c.bodyMarkdown) : "";
    c.stories = articles.filter((a) => (a.relatedCEO || []).some((r) => r.ceo === c.key)).map(summary);
  }
  const person = (c) => c && ({
    name: c.name, role: c.role, companyName: c.companyName, url: c.url, portrait: c.portrait,
    portraitPosition: c.portraitPosition, initials: c.initials, shortBio: c.shortBio,
    sponsored: c.sponsored, stories: c.stories,
  });
  // People named in each article, with a link to their profile
  for (const a of everything) a.people = (a.relatedCEO || []).map((r) => person(ceos[r.ceo])).filter(Boolean);
  const profiles = Object.values(ceos).map((c) => ({
    ...person(c), slug: c.slug, bodyHtml: c.bodyHtml, linkedin: c.linkedin, website: c.website,
  }));

  // ---------- Homepage ----------
  const h = homepage;
  const COUNT = { grid: 3, pictures: 4, band: 3, list: 4 };
  const sections = (h.sections || [])
    .filter((s) => s.show !== false)
    .map((s) => {
      if (s._template === "stories") {
        const cat = categories[s.category];
        const layout = s.layout || "grid";
        return {
          type: "stories", layout, slug: cat && cat.slug, heading: s.heading || (cat && cat.name) || "",
          description: cat && cat.description, moreUrl: cat && cat.url,
          items: inSection(s.category).slice(0, COUNT[layout] || 3).map(summary),
        };
      }
      if (s._template === "csuite") {
        const who = person(ceos[s.ceo]);
        const cat = categories[s.category];
        const theirs = new Set(who ? who.stories.map((x) => x.url) : []);
        return {
          type: "csuite", slug: cat && cat.slug, heading: s.heading || (cat && cat.name) || "C-Suites", person: who,
          moreUrl: cat && cat.url,
          items: (s.category ? inSection(s.category) : articles).map(summary).filter((x) => !theirs.has(x.url)).slice(0, 3),
        };
      }
      if (s._template === "spotlight")
        return { type: "spotlight", heading: s.heading || "CEO Spotlight", intro: s.intro, items: (s.ceos || []).map((x) => person(ceos[x.ceo])).filter(Boolean) };
      if (s._template === "video") return { type: "video", item: videos[s.video] };
      if (s._template === "newsletter") return { type: "newsletter" };
      return null;
    })
    .filter((s) => s && (s.type !== "stories" || s.items.length) && (s.type !== "spotlight" || s.items.length) && (s.type !== "csuite" || s.person) && (s.type !== "video" || s.item));

  // Top of the homepage: ticked "Feature" articles first (newest first),
  // then the picks on the Homepage screen fill any gaps.
  const top = [];
  const add = (a) => { if (a && !top.includes(a)) top.push(a); };
  articles.filter((a) => a.featured === true).forEach(add);
  add(byKey[h.leadStory]);
  (h.secondaryStories || []).forEach((x) => add(byKey[x.article]));
  const home = {
    lead: summary(top[0]),
    secondary: top.slice(1, 4).map(summary),
    sections,
  };

  // Menu: jump to the section on the homepage when it's there,
  // otherwise open the section's own page.
  const onHome = new Set(sections.map((s) => s.slug).filter(Boolean));
  for (const m of menu) m.url = onHome.has(m.slug) ? `/#${m.slug}` : m.url;

  // Keyword pages (/keyword/<name>/)
  const slugify = (t) => String(t).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const kw = {};
  for (const a of articles) for (const k of a.keywords) {
    const slug = slugify(k);
    (kw[slug] = kw[slug] || { name: k, slug, url: `/keyword/${slug}/`, items: [] }).items.push(summary(a));
  }
  for (const a of everything) a.keywordLinks = a.keywords.map((k) => ({ name: k, url: `/keyword/${slugify(k)}/` }));
  const keywords = Object.values(kw);

  // ---------- Section pages ----------
  const sectionPages = Object.values(categories).map((c) => ({
    name: c.name, slug: c.slug, url: c.url, description: c.description,
    items: inSection(c.key).map(summary),
  }));

  return { articles, everything, menu, sections: sectionPages, profiles, keywords, home, site, formatDate };
};
