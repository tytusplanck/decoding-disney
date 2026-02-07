# Decoding Disney

An Astro-powered static blog for Disney parks tips.

## Getting Started

```bash
npm install
npm run dev
```

## Useful Scripts

- `npm run dev` – Start the Astro dev server on [http://localhost:4321](http://localhost:4321)
- `npm run lint` – Run code lint + markdown content lint
- `npm run lint:code` – Run ESLint across Astro/TypeScript files
- `npm run lint:md` – Run markdownlint on README, posts, and `.github` markdown docs
- `npm run lint:fix` – Auto-fix lint issues where possible
- `npm run format` – Format the repo with Prettier
- `npm run format:check` – Validate formatting without changing files
- `npm run test:unit` – Validate post frontmatter/body invariants
- `npm run test:artifacts` – Validate generated files in `dist/`
- `npm run test:smoke` – Smoke-check rendered routes in `dist/`
- `npm run test:links` – Validate internal links in built HTML
- `npm run test:seo` – Verify canonical/OG/JSON-LD/robots/manifest metadata in `dist/`
- `npm run test:all` – Run unit tests, build, artifact tests, smoke tests, link checks, and SEO tests
- `npm run check` – Type-check and validate content collections
- `npm run build` – Generate the production build in `dist/`
- `npm run preview` – Preview the production build locally
- `npm run verify` – Full quality gate: lint + format check + Astro check + tests

## Quality Gate

Run `npm run verify` before opening or updating a PR. Vercel also runs the same command during builds via `vercel.json` (`buildCommand: "npm run verify"`), so deploys fail on lint, formatting, Astro check, unit regressions, route smoke failures, or broken build artifacts.

## Pre-commit Guardrail

This repo uses Husky + lint-staged. After `npm install`, staged files are auto-linted/formatted on commit via `.husky/pre-commit`.

## Content

Markdown posts live under `src/content/posts/<slug>/index.md` with colocated `cover.jpg` files for optimized images.

## How To Update Content

### 1) Create or edit a post

- Location: `src/content/posts/<slug>/index.md`
- Cover image: `src/content/posts/<slug>/cover.jpg`
- Keep one folder per post slug.

### 2) Use required frontmatter

```md
---
title: 'Post title'
excerpt: 'Short summary used in SEO and feeds'
date: '2026-02-07'
author:
  name: 'Tytus Planck'
coverImage: ./cover.jpg
---
```

Optional frontmatter:

- `updatedDate`: e.g. `'2026-02-10'` (used for article modified metadata)
- `draft`: `true` or `false` (draft posts are excluded from home/feed/sitemap/routes)
- `keywords`: list of SEO keywords
- `ogImage`: custom social image object
  - `url`: absolute or site-relative image URL
  - `width`: optional number
  - `height`: optional number

### 3) Draft workflow (recommended)

1. Set `draft: true` while writing.
2. Run `npm run verify` and confirm all checks pass.
3. Flip to `draft: false` when ready to publish.
4. Run `npm run verify` again before deploy.

### 4) Content style/structure

- Start section headings at `##` inside posts (do not jump directly to `###`).
- Keep links valid; internal link checks run in `test:links`.
- Keep excerpt and title clean, since they are used in metadata and feed output.
