// ============================================================
// Site builder settings (Eleventy).
// Turns the templates (*.njk) + Jamie's content into plain HTML
// pages in the _site folder, which GitHub Pages then serves.
// ============================================================
const { HtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function (config) {
  // Adds the right address prefix to every link and image.
  // On the preview link that is /theceochannel.com/; on the real
  // domain it is nothing. Set in .github/workflows/deploy.yml.
  config.addPlugin(HtmlBasePlugin);

  // Files copied to the website as they are
  config.addPassthroughCopy("styles.css");
  config.addPassthroughCopy("site.js");
  config.addPassthroughCopy("images");
  config.addPassthroughCopy("admin");

  return {
    templateFormats: ["njk"], // only *.njk files become pages
    pathPrefix: process.env.PATH_PREFIX || "/",
    dir: { input: ".", includes: "_includes", data: "_data", output: "_site" },
  };
};
