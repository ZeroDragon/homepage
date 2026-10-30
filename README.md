# Carlos Flores Benavides

A static Eleventy site for [floresbenavides.com](https://floresbenavides.com). Site content is authored in Markdown under `src/posts/`, `src/pages/`, and the root-level `src/index.md` and `src/blog.md`.

## Development

```sh
npm install
npm start
```

Build the production site into `_site/`:

```sh
npm run build
```

Run the build and static-site checks:

```sh
npm test
```

## Deployment

Pushing a Git tag whose name ends in `-prod` builds and deploys the site to GitHub Pages:

```sh
git tag v1.0.0-prod
git push origin v1.0.0-prod
```

The workflow publishes `_site/` and includes `src/CNAME` for the custom domain
`floresbenavides.com`. Before the first deployment, set the repository's Pages
publishing source to **GitHub Actions** and its custom domain to
`floresbenavides.com` in **Settings → Pages**. Configure the domain's DNS records
with its DNS provider and enable HTTPS after Pages verifies the domain; the
workflow does not change DNS or repository settings.

## Writing content

Create a new post as a Markdown file in `src/posts/`. Include the title, publication date, and URL slug in the front matter:

```markdown
---
title: "A new post"
type: post
slug: a-new-post
date: "2026-10-29T12:00:00Z"
layout: layouts/post.njk
permalink: /a-new-post/index.html
description: "A short summary for archives and search engines."
categories:
  - name: "Javascript"
    slug: "javascript"
---

Write the post in Markdown. Put images in `src/assets/uploads/` and link to them
with a site-root path such as `/assets/uploads/2026/10/example.png`.
```

The original published content is now stored in Markdown: 25 posts and the `about`, home, and blog pages. The migration importer can convert a WordPress JSON export if one is available:

```sh
npm run import:wordpress -- /path/to/wordpress-export.json
```

The importer writes Markdown files; Eleventy builds from those Markdown files, not from WordPress or its export. Public media referenced by the migrated content is stored under `src/assets/uploads/`. The avatar is served by GitHub at the account's public avatar URL. Departure Mono is bundled locally with its SIL Open Font License in `src/assets/fonts/LICENSE`.

The static output preserves root-level post URLs, `/about/`, `/blog/`, category archive URLs, and migrated page slugs.
