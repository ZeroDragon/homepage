# Carlos Flores Benavides

A static Eleventy site for [floresbenavides.com](https://floresbenavides.com), migrated from the publicly published WordPress pages and posts. The migration snapshot contains three pages and 25 posts; drafts, private content, and comments are not included.

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

## Content and assets

The read-only WordPress export is stored in `src/_data/wordpress.json`; Eleventy data processing normalizes its content and retains the original page and post slugs. Public media referenced by the published content is stored under `src/assets/uploads/`. The avatar is served by GitHub at the account's public avatar URL. Departure Mono is bundled locally with its SIL Open Font License in `src/assets/fonts/LICENSE`.

The static output preserves the root-level post URLs, `/about/`, `/blog/`, category archive URLs, and the published pages' original slugs.

