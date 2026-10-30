const { existsSync, mkdirSync, readFileSync, writeFileSync } = require("node:fs");
const path = require("node:path");
const TurndownService = require("turndown");

const root = path.resolve(__dirname, "..");
const exportPath = process.argv[2] ? path.resolve(process.argv[2]) : null;

if (!exportPath || !existsSync(exportPath)) {
  throw new Error("Usage: npm run import:wordpress -- /path/to/wordpress-export.json");
}

const wordpress = JSON.parse(readFileSync(exportPath, "utf8"));
const uploadsDirectory = path.join(root, "src/assets/uploads");
const avatar = "https://avatars.githubusercontent.com/u/616185?v=4";
const legacyClassNames = {
  "wp-block-button__link": "button-link",
  "wp-block-buttons": "content-buttons",
  "wp-block-code": "code-block",
  "wp-block-column": "content-column",
  "wp-block-columns": "content-columns",
  "wp-block-embed": "media-embed",
  "wp-block-embed__wrapper": "media-embed-frame",
  "wp-block-image": "content-figure",
  "wp-block-quote": "content-quote",
  "wp-element-button": "button-link",
  "wp-image-42": "home-avatar",
};

function yamlString(value) {
  return JSON.stringify(String(value ?? ""));
}

function cleanupMarkup(content, { home = false } = {}) {
  let html = content;

  if (home) {
    html = html
      .replace(
        /<img\b(?=[^>]*\bclass="[^"]*\bwp-image-42\b")[^>]*>/,
        "",
      )
      .replace(
        /<h[1-6]\b[^>]*>\s*Ultimo post:\s*<\/h[1-6]>(?:\s*<!--[\s\S]*?-->)*\s*<!--\s*wp:latest-posts\b[\s\S]*?-->/i,
        "",
      );
  }

  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\sclass="([^"]*)"/g, (attribute, classList) => {
      const classes = classList.split(/\s+/).flatMap((className) => {
        if (className === "alignwide") {
          return ["content-columns-wide"];
        }

        if (legacyClassNames[className]) {
          return [legacyClassNames[className]];
        }

        return className.startsWith("wp-")
          || className.startsWith("has-")
          || className.startsWith("is-")
          || className.startsWith("align")
          ? []
          : [className];
      });

      return classes.length ? ` class="${[...new Set(classes)].join(" ")}"` : "";
    })
    .replace(/\s(?:data-type|data-id)="[^"]*"/g, "")
    .replace(
      /https?:\/\/(?:www\.)?floresbenavides\.com\/wp-content\/uploads\/([^"'<>\s)]+)/gi,
      (url, file) => {
        const relativePath = decodeURIComponent(file.split(/[?#]/, 1)[0]);
        const localPath = path.resolve(uploadsDirectory, relativePath);
        if (!localPath.startsWith(`${uploadsDirectory}${path.sep}`) || !existsSync(localPath)) {
          return url;
        }

        return `/assets/uploads/${relativePath.split("/").map(encodeURIComponent).join("/")}`;
      },
    )
    .replace(/https?:\/\/(?:www\.)?floresbenavides\.com/gi, "");
}

function convertContent(content, options) {
  const html = cleanupMarkup(content, options);
  return new TurndownService({
    headingStyle: "atx",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
  }).turndown(html).trim();
}

function contentFile(record) {
  const isHome = record.post_type === "page" && record.ID === Number(wordpress.options.page_on_front);
  const isBlog = record.post_type === "page" && record.ID === Number(wordpress.options.page_for_posts);
  const type = isHome ? "home" : isBlog ? "blog" : record.post_type;
  const layout = isHome ? "layouts/home.njk" : isBlog ? "layouts/blog.njk" : `layouts/${type}.njk`;
  const permalink = isHome
    ? "/index.html"
    : isBlog
      ? "/blog/index.html"
      : `/${record.post_name}/index.html`;
  const categories = (record.terms ?? [])
    .filter((term) => term.taxonomy === "category")
    .map((term) => ({ name: term.name, slug: term.slug }));
  const postTags = (record.terms ?? [])
    .filter((term) => term.taxonomy === "post_tag")
    .map((term) => ({ name: term.name, slug: term.slug }));
  const featuredMedia = record.featured_media;
  let featuredImage = featuredMedia?.url ?? "";

  if (featuredMedia?.file) {
    const localPath = path.resolve(uploadsDirectory, featuredMedia.file);
    if (localPath.startsWith(`${uploadsDirectory}${path.sep}`) && existsSync(localPath)) {
      featuredImage = `/assets/uploads/${featuredMedia.file.split("/").map(encodeURIComponent).join("/")}`;
    }
  }

  const frontMatter = [
    "---",
    `title: ${yamlString(isHome ? "Inicio" : record.post_title)}`,
    `type: ${type}`,
    `slug: ${yamlString(record.post_name)}`,
    `layout: ${layout}`,
    `permalink: ${permalink}`,
  ];

  if (type !== "page") {
    frontMatter.push(`date: ${yamlString(record.post_date.replace(" ", "T") + "Z")}`);
  }

  if (record.post_excerpt) {
    frontMatter.push(`description: ${yamlString(record.post_excerpt.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim())}`);
  }

  if (categories.length) {
    frontMatter.push(
      "categories:",
      ...categories.flatMap((category) => [
        `  - name: ${yamlString(category.name)}`,
        `    slug: ${yamlString(category.slug)}`,
      ]),
    );
  }

  if (postTags.length) {
    frontMatter.push(
      "postTags:",
      ...postTags.flatMap((tag) => [
        `  - name: ${yamlString(tag.name)}`,
        `    slug: ${yamlString(tag.slug)}`,
      ]),
    );
  }

  if (featuredImage) {
    frontMatter.push(`featuredImage: ${yamlString(featuredImage)}`);
    frontMatter.push(`featuredImageAlt: ${yamlString(featuredMedia?.title ?? "")}`);
  }

  if (type === "home") {
    frontMatter.push(`description: ${yamlString(wordpress.options.blogdescription)}`);
  }

  if (type === "blog") {
    frontMatter.push(`description: ${yamlString("Artículos sobre desarrollo web, tecnología y aventuras.")}`);
  }

  frontMatter.push("---");

  const markdown = type === "blog"
    ? ""
    : convertContent(record.post_content, { home: isHome });

  return {
    type,
    slug: record.post_name,
    markdown: `${frontMatter.join("\n")}\n\n${markdown}\n`,
  };
}

const pagesDirectory = path.join(root, "src/pages");
const postsDirectory = path.join(root, "src/posts");
mkdirSync(pagesDirectory, { recursive: true });
mkdirSync(postsDirectory, { recursive: true });

for (const record of wordpress.posts) {
  const page = contentFile(record);
  const filePath = page.type === "home"
    ? path.join(root, "src/index.md")
    : page.type === "blog"
      ? path.join(root, "src/blog.md")
      : path.join(
        page.type === "post" ? postsDirectory : pagesDirectory,
        `${page.slug}.md`,
      );

  writeFileSync(filePath, page.markdown);
  console.log(path.relative(root, filePath));
}
