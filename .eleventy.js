const { existsSync } = require("node:fs");

function decodeEntities(value = "") {
  const named = {
    amp: "&",
    apos: "'",
    gt: ">",
    hellip: "…",
    ldquo: "“",
    lsquo: "‘",
    lt: "<",
    mdash: "—",
    nbsp: "\u00a0",
    ndash: "–",
    quot: '"',
    rdquo: "”",
    rsquo: "’",
  };

  return String(value).replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, code) => {
    if (code[0] !== "#") {
      return named[code.toLowerCase()] ?? entity;
    }

    const number = code[1].toLowerCase() === "x"
      ? Number.parseInt(code.slice(2), 16)
      : Number.parseInt(code.slice(1), 10);
    return Number.isFinite(number) ? String.fromCodePoint(number) : entity;
  });
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  eleventyConfig.addFilter("decodeEntities", decodeEntities);
  eleventyConfig.addFilter("formatDate", (value) => {
    const date = new Date(`${String(value).replace(" ", "T")}Z`);
    return new Intl.DateTimeFormat("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  });
  eleventyConfig.addFilter("dateIso", (value) => {
    const date = new Date(`${String(value).replace(" ", "T")}Z`);
    return date.toISOString();
  });
  eleventyConfig.addFilter("rfcDate", (value) => {
    const date = new Date(`${String(value).replace(" ", "T")}Z`);
    return date.toUTCString();
  });
  eleventyConfig.addFilter("excerpt", (value, limit = 220) => {
    const text = decodeEntities(String(value).replace(/<[^>]*>/g, " "))
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const characters = Array.from(text);
    return characters.length > limit
      ? `${characters.slice(0, limit).join("").trimEnd()}…`
      : text;
  });
  eleventyConfig.addFilter("xmlEscape", (value) => String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;"));

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["html", "njk", "txt", "xml"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
