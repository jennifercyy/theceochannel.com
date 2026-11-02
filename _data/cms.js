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

// Split the article text into blocks (paragraphs and headings) and
// slot the photos in between, at the places the editor promises:
//   Photo 2            after the 2nd paragraph
//   Pull quote,
//   Photos 3 + 4,
//   Instagram post     about halfway through
//   Photo 5            before the last paragraph
function buildBody(article) {
  const blocks = article.bodyMarkdown
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => ({ type: "html", html: markdown.render(b) }));

  const paragraphsSeen = (i) =>
    blocks.slice(0, i + 1).filter((b) => b.html.startsWith("<p")).length;

  const has = (p) => p && p.src;
  const parts = [];
  let placedTwo = false, placedMiddle = false;
  const middle = Math.floor(blocks.length / 2);
  const last = blocks.length - 1;

  blocks.forEach((block, i) => {
    if (i === last && blocks.length > 1 && has(article.photo5)) parts.push({ type: "photo", photo: article.photo5, n: 5 });
    if (i === middle && i > 0 && !placedMiddle) {
      placedMiddle = true;
      if (article.pullQuote) parts.push({ type: "quote", text: article.pullQuote });
      if (has(article.photo3) || has(article.photo4)) parts.push({ type: "pair", left: article.photo3, right: article.photo4 });
      if (article.instagramEmbed) parts.push({ type: "instagram", html: article.instagramEmbed });
    }
    parts.push(block);
    if (!placedTwo && paragraphsSeen(i) === 2 && block.html.startsWith("<p")) {
      placedTwo = true;
      if (has(article.photo2)) parts.push({ type: "photo", photo: article.photo2, n: 2 });
    }
  });

  // Very short articles: anything not yet placed goes at the end.
  if (!placedTwo && has(article.photo2)) parts.push({ type: "photo", photo: article.photo2, n: 2 });
  if (!placedMiddle) {
    if (article.pullQuote) parts.push({ type: "quote", text: article.pullQuote });
    if (has(article.photo3) || has(article.photo4)) parts.push({ type: "pair", left: article.photo3, right: article.photo4 });
    if (article.instagramEmbed) parts.push({ type: "instagram", html: article.instagramEmbed });
  }
  if (blocks.length <= 1 && has(article.photo5)) parts.push({ type: "photo", photo: article.photo5, n: 5 });
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

  // ---------- Sections and menu ----------
  for (const c of Object.values(categories)) {
    c.url = `/section/${c.slug}/`;
    c.parentCat = c.parent ? categories[c.parent] : null;
  }
  const byOrder = (a, b) => (a.order || 99) - (b.order || 99);
  const menu = Object.values(categories)
    .filter((c) => !c.parent && c.showInMenu !== false)
    .sort(byOrder)
    .map((c) => ({
      ...c,
      children: Object.values(categories)
        .filter((s) => s.parent === c.key && s.showInMenu !== false)
        .sort(byOrder),
    }));

  // The top-level section a category belongs to (Succession → Leadership)
  const topOf = (cat) => (cat && cat.parentCat ? cat.parentCat.name : cat && cat.name);

  // ---------- Articles ----------
  const articles = Object.values(allArticles)
    .filter((a) => a.draft !== true)
    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

  for (const a of articles) {
    a.url = `/articles/${a.slug}/`;
    a.cat = categories[a.category] || { name: "", url: "/" };
    a.topCat = topOf(a.cat);
    a.authorInfo = authors[a.author] || null;
    a.date = formatDate(a.publishedDate);
    a.publishedText = formatDate(a.publishedDate, true);
    a.updatedText = formatDate(a.updatedDate, true);
    a.image = a.photo1 && a.photo1.src ? a.photo1.src : "";
    a.ceoList = (a.relatedCEO || []).map((r) => ceos[r.ceo]).filter(Boolean);
    a.parts = buildBody(a);
    a.label = a.sponsored ? `Partner content${a.sponsorName ? " · " + a.sponsorName : ""}` : a.cat.name;
  }
  // Short version of an article, used wherever one story links to
  // another (so the data never loops back on itself).
  const summary = (a) => a && ({
    url: a.url, title: a.title, excerpt: a.excerpt, image: a.image, date: a.date,
    label: a.label, sponsored: a.sponsored, format: a.format, storyLabel: a.storyLabel,
    cat: { name: a.cat.name }, photo1: a.photo1,
  });
  const bySlug = Object.fromEntries(articles.map((a) => [a.key, a]));
  const inCategory = (catKey) =>
    articles.filter((a) => a.category === catKey || (a.cat.parent === catKey));

  // Up next + related, for each article
  articles.forEach((a, i) => {
    let next = bySlug[a.nextArticle] || articles[i + 1] || articles[0];
    if (next === a) next = null;
    a.upNextFull = next;
    const others = articles.filter((o) => o !== a && o !== next);
    const shared = (o) => (o.tags || []).some((t) => (a.tags || []).includes(t));
    const score = (o) =>
      (shared(o) ? 4 : 0) + (o.format === "Listicle" ? 2 : 0) + (o.topCat === a.topCat ? 1 : 0);
    a.related = others
      .map((o, idx) => ({ o, s: score(o), idx }))
      .sort((x, y) => y.s - x.s || x.idx - y.idx)
      .slice(0, 5)
      .map((x) => summary(x.o));
  });
  for (const a of articles) { a.upNext = summary(a.upNextFull); delete a.upNextFull; }
  for (const a of articles) a.ceoList = a.ceoList.map((c) => ({ name: c.name, role: c.role, companyName: c.companyName }));

  // ---------- CEOs: attach their stories ----------
  for (const c of Object.values(ceos)) {
    c.stories = articles.filter((a) => (a.relatedCEO || []).some((r) => r.ceo === c.key)).map(summary);
    c.url = c.stories[0] ? c.stories[0].url : "/";
  }

  // ---------- Homepage ----------
  const pick = (list) => (list || []).map((x) => summary(bySlug[x.article])).filter(Boolean);
  const h = homepage;
  const home = {
    lead: summary(bySlug[h.leadStory]),
    secondary: pick(h.secondaryStories).slice(0, 3),
    latestInterviews: { show: h.latestInterviews?.show !== false, items: articles.filter((a) => a.format === "Interview").slice(0, 3).map(summary) },
    spotlight: { ...h.spotlight, show: h.spotlight?.show !== false, items: (h.spotlight?.ceos || []).map((x) => ceos[x.ceo]).filter(Boolean) },
    photoSection: {
      ...h.photoSection,
      show: h.photoSection?.show !== false,
      cat: categories[h.photoSection?.category],
      items: inCategory(h.photoSection?.category).slice(0, 4).map(summary),
    },
    video: { show: h.video?.show !== false, item: videos[h.video?.video] },
    featureBand: {
      ...h.featureBand,
      show: h.featureBand?.show !== false,
      viewAllCat: categories[h.featureBand?.viewAll],
      items: pick(h.featureBand?.articles).slice(0, 3),
    },
    insights: {
      ...h.insights,
      show: h.insights?.show !== false,
      cat: categories[h.insights?.category],
      items: inCategory(h.insights?.category).slice(0, 4).map(summary),
    },
    newsletter: { show: h.newsletter?.show !== false },
  };

  // ---------- Section pages ----------
  const sections = Object.values(categories).map((c) => ({
    ...c,
    parentCat: undefined,
    items: inCategory(c.key).map(summary),
  }));

  return { articles, menu, sections, home, site, formatDate };
};
