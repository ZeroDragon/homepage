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

function dateValue(value) {
  if (value instanceof Date) {
    return value;
  }

  const text = String(value ?? "");
  const date = new Date(text.includes("T") ? text : `${text.replace(" ", "T")}Z`);
  if (Number.isNaN(date.getTime())) {
    throw new TypeError(`Invalid content date: ${text}`);
  }
  return date;
}

function termValue(term) {
  return typeof term === "string"
    ? { name: term, slug: term.toLowerCase().replace(/\s+/g, "-") }
    : term;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("src/CNAME");

  eleventyConfig.addCollection("posts", (collectionApi) => collectionApi.getAll()
    .filter((item) => item.data.type === "post")
    .sort((left, right) => dateValue(right.data.date) - dateValue(left.data.date)));
  eleventyConfig.addCollection("pages", (collectionApi) => collectionApi.getAll()
    .filter((item) => ["blog", "home", "page"].includes(item.data.type)));
  eleventyConfig.addCollection("categories", (collectionApi) => {
    const categories = new Map();
    for (const post of collectionApi.getFilteredByGlob("src/posts/*.md")) {
      for (const rawTerm of post.data.categories ?? []) {
        const term = termValue(rawTerm);
        if (!term?.slug || !term?.name) {
          continue;
        }

        if (!categories.has(term.slug)) {
          categories.set(term.slug, { name: term.name, slug: term.slug, posts: [] });
        }
        categories.get(term.slug).posts.push(post);
      }
    }

    return [...categories.values()]
      .map((category) => ({
        ...category,
        posts: category.posts.sort((left, right) => dateValue(right.data.date) - dateValue(left.data.date)),
      }))
      .sort((left, right) => left.name.localeCompare(right.name, "es"));
  });
  eleventyConfig.addCollection("tags", (collectionApi) => {
    const tags = new Map();
    for (const post of collectionApi.getFilteredByGlob("src/posts/*.md")) {
      for (const rawTerm of post.data.postTags ?? []) {
        const term = termValue(rawTerm);
        if (!term?.slug || !term?.name) {
          continue;
        }

        if (!tags.has(term.slug)) {
          tags.set(term.slug, { name: term.name, slug: term.slug, posts: [] });
        }
        tags.get(term.slug).posts.push(post);
      }
    }

    return [...tags.values()];
  });

  eleventyConfig.addFilter("decodeEntities", decodeEntities);
  eleventyConfig.addFilter("formatDate", (value) => {
    const date = dateValue(value);
    return new Intl.DateTimeFormat("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  });
  eleventyConfig.addFilter("dateIso", (value) => {
    return dateValue(value).toISOString();
  });
  eleventyConfig.addFilter("splitText", (value, separator) => String(value).split(separator));
  eleventyConfig.addFilter("rfcDate", (value) => {
    return dateValue(value).toUTCString();
  });
  eleventyConfig.addFilter("excerpt", (value, limit = 220) => {
    const text = decodeEntities(String(value).replace(/<[^>]*>/g, " "))
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[`*_>#]/g, "")
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
    templateFormats: ["html", "njk", "md", "txt", "xml"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: false,
  };
};
