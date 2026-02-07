# Decoding Disney

An Astro-powered static blog for Disney parks tips.

## Getting Started

```bash
npm install
npm run dev
```

## Useful Scripts

- `npm run dev` – Start the Astro dev server on http://localhost:4321
- `npm run lint` – Run ESLint across Astro/TypeScript files
- `npm run lint:fix` – Auto-fix lint issues where possible
- `npm run format` – Format the repo with Prettier
- `npm run format:check` – Validate formatting without changing files
- `npm run check` – Type-check and validate content collections
- `npm run build` – Generate the production build in `dist/`
- `npm run preview` – Preview the production build locally
- `npm run verify` – Full quality gate: lint + format check + Astro check + build

## Quality Gate

Run `npm run verify` before opening or updating a PR. Vercel also runs the same command during builds via `vercel.json` (`buildCommand: "npm run verify"`), so deploys fail if lint, formatting, Astro checks, or build fail.

## Content

Markdown posts live under `src/content/posts/<slug>/index.md` with colocated `cover.jpg` files for optimized images.
