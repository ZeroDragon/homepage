const assert = require("node:assert/strict");
const { existsSync, readFileSync, readdirSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const site = require("../src/_data/site");

const root = path.join(__dirname, "..");
const source = path.join(root, "src");
const output = path.join(root, "_site");
const postFiles = readdirSync(path.join(source, "posts"))
  .filter((file) => file.endsWith(".md"))
  .sort();
const pageFiles = [
  path.join(source, "index.md"),
  path.join(source, "blog.md"),
  ...readdirSync(path.join(source, "pages"))
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join(source, "pages", file)),
];

function frontMatter(file) {
  const contents = readFileSync(file, "utf8");
  const match = contents.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(match, `Missing front matter in ${path.relative(root, file)}`);
  return match[1];
}

function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(file) : file.endsWith(".html") ? [file] : [];
  });
}

test("published content is authored in Markdown", () => {
  assert.equal(postFiles.length, 25);
  assert.equal(pageFiles.length, 3);

  for (const file of postFiles) {
    const metadata = frontMatter(path.join(source, "posts", file));
    assert.match(metadata, /^type: post$/m, `${file} should be a post`);
    assert.match(metadata, /^title: ".+"$/m, `${file} should have a title`);
    assert.match(metadata, /^date: ".+"$/m, `${file} should have a publication date`);
    assert.match(metadata, /^permalink: \/.+\/index\.html$/m, `${file} should preserve its URL`);
  }

  for (const file of pageFiles) {
    assert.ok(frontMatter(file).match(/^type: (?:home|blog|page)$/m));
  }
  assert.equal(existsSync(path.join(source, "_data/wordpress.json")), false);
});

test("all Markdown content routes are generated without WordPress markup", () => {
  assert.equal(readFileSync(path.join(output, "CNAME"), "utf8").trim(), "floresbenavides.com");

  for (const file of [...pageFiles, ...postFiles.map((name) => path.join(source, "posts", name))]) {
    const metadata = frontMatter(file);
    const permalink = metadata.match(/^permalink: (.+)$/m)?.[1];
    assert.ok(permalink, `Missing permalink in ${path.relative(root, file)}`);
    const generatedPage = path.join(output, permalink.replace(/^\//, ""));
    assert.ok(existsSync(generatedPage), `Missing generated route ${permalink}`);
  }

  for (const file of htmlFiles(output)) {
    const html = readFileSync(file, "utf8");
    assert.doesNotMatch(html, /class="[^"]*\bwp-[\w-]+/, `WordPress class remains in ${file}`);
    assert.doesNotMatch(html, /<!--\s*\/?wp:/, `WordPress block comment remains in ${file}`);
  }
});

test("blog archive, category archives, RSS, and sitemap use Markdown posts", () => {
  const blog = readFileSync(path.join(output, "blog", "index.html"), "utf8");
  assert.equal((blog.match(/class="post-row"/g) ?? []).length, postFiles.length);

  const categorySlugs = new Set();
  for (const file of postFiles) {
    const metadata = frontMatter(path.join(source, "posts", file));
    for (const [, slug] of metadata.matchAll(/^\s+slug: "([^"]+)"/gm)) {
      categorySlugs.add(slug);
    }
  }
  assert.ok(categorySlugs.size > 0);
  for (const slug of categorySlugs) {
    assert.ok(existsSync(path.join(output, "category", slug, "index.html")), `Missing category ${slug}`);
  }

  const feed = readFileSync(path.join(output, "feed.xml"), "utf8");
  assert.equal((feed.match(/<item>/g) ?? []).length, postFiles.length);
  const sitemap = readFileSync(path.join(output, "sitemap.xml"), "utf8");
  assert.match(sitemap, /https:\/\/floresbenavides\.com\/about\//);
  assert.match(sitemap, /https:\/\/floresbenavides\.com\/blog\//);
});

test("home page uses the GitHub avatar and retains its latest-post section", () => {
  const home = readFileSync(path.join(output, "index.html"), "utf8");
  const about = readFileSync(path.join(output, "about", "index.html"), "utf8");
  assert.match(home, /class="recent-posts"/);
  assert.match(home, /class="home-details"/);
  assert.match(home, /class="home-about prose"/);
  assert.match(home, /class="home-latest prose"/);
  assert.match(home, /class="home-social prose"/);
  assert.doesNotMatch(home, /<hr>/);
  assert.match(home, /ÚLTIMO POST/);
  assert.match(home, /id="latest-post-heading"><a href="\/sitecraft-desplegado\/">SiteCraft Desplegado/);
  assert.equal((home.match(/class="post-card"/g) ?? []).length, 3);
  assert.match(home, /SiteCraft Desplegado/);
  assert.match(home, new RegExp(`src="${site.avatar.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
  assert.match(home, /class="home-avatar"/);
  assert.doesNotMatch(home, /\/assets\/uploads\/2021\/01\/abe3b73d502764dd8c5c7eb5cd6a37f4-1\.png/);
  assert.match(about, /href="\/about\/" aria-current="page"/);
});

test("local media references resolve to copied public files", () => {
  const content = [...pageFiles, ...postFiles.map((file) => path.join(source, "posts", file))]
    .map((file) => readFileSync(file, "utf8"))
    .join("\n");
  const localReferences = [...content.matchAll(/\/assets\/uploads\/([^"'<>\s)]+)/g)];
  assert.ok(localReferences.length > 0, "Expected migrated local media references");

  for (const [, relativePath] of localReferences) {
    const decodedPath = relativePath.split(/[?#]/, 1)[0]
      .split("/")
      .map(decodeURIComponent)
      .join(path.sep);
    assert.ok(existsSync(path.join(output, "assets", "uploads", decodedPath)), `Missing media ${decodedPath}`);
  }
});
