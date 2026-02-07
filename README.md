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
- `npm run lint:md` – Run markdownlint on README, posts, and PR templates
- `npm run lint:fix` – Auto-fix lint issues where possible
- `npm run format` – Format the repo with Prettier
- `npm run format:check` – Validate formatting without changing files
- `npm run test:unit` – Validate post frontmatter/body invariants
- `npm run test:artifacts` – Validate generated files in `dist/`
- `npm run test:smoke` – Smoke-check rendered routes in `dist/`
- `npm run test:all` – Run unit tests, build, artifact tests, and smoke tests
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
