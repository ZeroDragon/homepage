const assert = require("node:assert/strict");
const { existsSync, readFileSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const wordpress = require("../src/_data/wordpress.json");
const site = require("../src/_data/site");

const output = path.join(__dirname, "..", "_site");

test("migration contains only the published page and post snapshot", () => {
  assert.equal(site.pages.length, 2);
  assert.equal(site.posts.length, 25);
  assert.equal(site.homePage.ID, Number(wordpress.options.page_on_front));
  assert.equal(site.blogPage.ID, Number(wordpress.options.page_for_posts));
});

test("all published WordPress routes are generated", () => {
  for (const record of [...site.pages, site.blogPage, ...site.posts]) {
    const route = record.post_type === "post" || record.ID !== site.blogPage.ID
      ? record.post_name
      : "blog";
    assert.ok(
      existsSync(path.join(output, route, "index.html")),
      `Missing generated route for ${record.post_name}`,
    );
  }
  assert.ok(existsSync(path.join(output, "index.html")));
});

test("blog archive and taxonomies include the migrated posts", () => {
  const blog = readFileSync(path.join(output, "blog", "index.html"), "utf8");
  assert.equal((blog.match(/class="post-row"/g) ?? []).length, site.posts.length);

  for (const category of site.categories) {
    assert.ok(
      existsSync(path.join(output, "category", category.slug, "index.html")),
      `Missing category archive ${category.slug}`,
    );
  }
});

test("dynamic WordPress home blocks are rendered and navigation stays active", () => {
  const home = readFileSync(path.join(output, "index.html"), "utf8");
  const about = readFileSync(path.join(output, "about", "index.html"), "utf8");
  assert.ok(home.includes(site.posts[0].post_title));
  assert.ok(!home.includes("wp:latest-posts"));
  assert.match(about, /href="\/about\/" aria-current="page"/);
});

test("local media references resolve to copied public files", () => {
  const content = [...site.pages, site.homePage, ...site.posts]
    .map((record) => record.post_content)
    .join("\n");
  const localReferences = [...content.matchAll(/\/assets\/uploads\/([^"'<>\s)]+)/g)];
  assert.ok(localReferences.length > 0, "Expected migrated local media references");
  for (const [, relativePath] of localReferences) {
    const decodedPath = relativePath.split(/[?#]/, 1)[0]
      .split("/")
      .map(decodeURIComponent)
      .join(path.sep);
    assert.ok(
      existsSync(path.join(output, "assets", "uploads", decodedPath)),
      `Missing copied media ${decodedPath}`,
    );
  }

  for (const post of site.posts) {
    if (post.featured_media?.url.startsWith("/assets/uploads/")) {
      const localPath = post.featured_media.url
        .replace(/^\/assets\/uploads\//, "")
        .split("/")
        .map(decodeURIComponent)
        .join(path.sep);
      assert.ok(existsSync(path.join(output, "assets", "uploads", localPath)));
    }
  }
});
