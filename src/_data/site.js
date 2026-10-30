const { existsSync } = require("node:fs");
const path = require("node:path");
const wordpress = require("./wordpress.json");

const uploadsDirectory = path.resolve(__dirname, "../assets/uploads");
const avatar = "https://avatars.githubusercontent.com/u/616185?v=4";
const uploadUrl = /https?:\/\/(?:www\.)?floresbenavides\.com\/wp-content\/uploads\/([^"'<>\s)]+)/gi;

function rewriteContent(content = "") {
  return content
    .replace(uploadUrl, (url, encodedPath) => {
      const relativePath = decodeURIComponent(encodedPath.split(/[?#]/, 1)[0]);
      const localPath = path.resolve(uploadsDirectory, relativePath);
      if (!localPath.startsWith(`${uploadsDirectory}${path.sep}`) || !existsSync(localPath)) {
        return url;
      }

      const webPath = relativePath.split("/").map(encodeURIComponent).join("/");
      return `/assets/uploads/${webPath}`;
    })
    .replace(/https?:\/\/(?:www\.)?floresbenavides\.com(?!\/wp-content\/uploads\/)/gi, "");
}

function normalize(record) {
  const featuredMedia = record.featured_media;
  let featuredUrl = featuredMedia?.url ?? "";
  if (featuredMedia?.file) {
    const filePath = path.resolve(uploadsDirectory, featuredMedia.file);
    if (filePath.startsWith(`${uploadsDirectory}${path.sep}`) && existsSync(filePath)) {
      featuredUrl = `/assets/uploads/${featuredMedia.file.split("/").map(encodeURIComponent).join("/")}`;
    }
  }

  return {
    ...record,
    post_content: rewriteContent(record.post_content),
    post_excerpt: rewriteContent(record.post_excerpt),
    featured_media: featuredMedia ? { ...featuredMedia, url: featuredUrl } : null,
    terms: record.terms ?? [],
  };
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function latestPostMarkup(post) {
  if (!post) {
    return "";
  }

  const text = post.post_excerpt || post.post_content
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const excerpt = text.split(/\s+/).slice(0, 50).join(" ");
  const url = `/${encodeURIComponent(post.post_name)}/`;
  const image = post.featured_media?.url
    ? `<div class="wp-block-latest-posts__featured-image"><a href="${url}"><img src="${escapeHtml(post.featured_media.url)}" alt="${escapeHtml(post.featured_media.title)}" loading="lazy"></a></div>`
    : "";

  return `<ul class="wp-block-latest-posts__list"><li>${image}<a class="wp-block-latest-posts__post-title" href="${url}">${escapeHtml(post.post_title)}</a><time class="wp-block-latest-posts__post-date" datetime="${escapeHtml(post.post_date)}">${escapeHtml(post.post_date.slice(0, 10))}</time><div class="wp-block-latest-posts__post-excerpt">${escapeHtml(excerpt)} <a class="more-link" href="${url}">Leer artículo</a></div></li></ul>`;
}

const records = wordpress.posts.map(normalize);
const posts = records.filter((record) => record.post_type === "post");
const pages = records.filter((record) => record.post_type === "page");
const homePageId = Number(wordpress.options.page_on_front);
const blogPageId = Number(wordpress.options.page_for_posts);
const homePage = pages.find((page) => page.ID === homePageId);
const blogPage = pages.find((page) => page.ID === blogPageId);
if (homePage) {
  homePage.post_content = homePage.post_content
    .replace(
      /<img\b(?=[^>]*\bclass="[^"]*\bwp-image-42\b")[^>]*>/,
      `<img src="${avatar}" alt="Carlos Flores Benavides" class="wp-image-42 home-avatar" width="158" height="158">`,
    )
    .replace(
      /<!--\s*wp:latest-posts\b[\s\S]*?\/-->/,
      latestPostMarkup(posts[0]),
    );
}

function makeTaxonomy(taxonomy) {
  const names = new Map();
  for (const post of posts) {
    for (const term of post.terms) {
      if (term.taxonomy === taxonomy) {
        names.set(term.slug, { name: term.name, slug: term.slug });
      }
    }
  }

  return [...names.values()]
    .map((term) => ({
      ...term,
      posts: posts.filter((post) => post.terms.some(
        (postTerm) => postTerm.taxonomy === taxonomy && postTerm.slug === term.slug,
      )),
    }))
    .sort((left, right) => left.name.localeCompare(right.name, "es"));
}

module.exports = {
  author: wordpress.options.blogname,
  avatar,
  baseUrl: "https://floresbenavides.com",
  blogDescription: wordpress.options.blogdescription,
  blogPage,
  categories: makeTaxonomy("category"),
  description: wordpress.options.blogdescription,
  homePage,
  pages: pages.filter((page) => page.ID !== blogPageId),
  posts,
  tags: makeTaxonomy("post_tag"),
  title: wordpress.options.blogname,
};
