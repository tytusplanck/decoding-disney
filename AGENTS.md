# AGENTS.md

## Purpose

This repository is designed for heavy agent maintenance.
Human owner responsibilities:

- Set direction and priorities.
- Write and edit blog post content.

Agent responsibilities:

- Implement requested code/system changes.
- Preserve site reliability and quality.
- Never bypass quality gates.

## Project Context

- Stack: Astro + TypeScript + Tailwind.
- Content location: `src/content/posts/<slug>/index.md` with colocated `cover.jpg`.
- Deployment: Vercel only (no GitHub Actions workflow is used).
- Vercel build command: `npm run verify` (defined in `vercel.json`).

## Non-Negotiable Quality Rules

Agents must follow these rules on every change:

1. Do not disable, weaken, or skip checks to make a build pass unless explicitly asked by the owner.
2. Do not claim completion if `npm run verify` fails.
3. Do not merge/deploy broken builds.
4. Prefer minimal, targeted changes over broad refactors.
5. If a check fails, fix root cause before continuing.

## Required Local Commands

Run from repository root:

```bash
npm install
npm run verify
```

`npm run verify` is the canonical quality gate and must pass before handoff.

## What `verify` Enforces

- `npm run lint`
- `npm run format:check`
- `npm run check`
- `npm run test:all`

### Lint Layer

- `lint:code`: ESLint for Astro/TypeScript code.
- `lint:md`: markdownlint for:
  - `README.md`
  - `AGENTS.md`
  - `src/content/posts/**/*.md`
  - `.github/**/*.md`

### Type/Schema Layer

- `astro check` validates TypeScript and content collection typing/schema.

### Test Layer

- `test:unit`: post frontmatter/body invariants and content expectations.
- `build`: static generation must succeed.
- `test:artifacts`: required `dist` files/routes/feed/sitemap must exist and include all posts.
- `test:smoke`: rendered output smoke checks for home/posts/feed/sitemap/404.
- `test:links`: internal link integrity checks against built HTML.
- `test:seo`: metadata regressions for canonical tags, OG tags, JSON-LD, robots, and manifest.

## Content Editing Rules

When editing posts, agents must preserve schema validity:

- Required frontmatter fields:
  - `title`
  - `excerpt`
  - `date`
  - `author.name`
  - `coverImage` (colocated image path in markdown frontmatter)
- Optional but supported frontmatter:
  - `updatedDate`
  - `draft`
  - `keywords`
  - `ogImage.url` (+ optional `width` and `height`)
- Keep slug folder structure consistent.
- Keep a valid `cover.jpg` in each post folder.
- Start post section headings at `##` (do not jump from title directly to `###`).

If content changes were not requested, do not rewrite article voice or messaging.

## Publishing Behavior

- Posts with `draft: true` must never appear in generated routes, feed, or sitemap.
- Agents must treat draft leakage as a blocking defect.
- Home/share fallback OG image is `/og/default-og.svg`; do not point OG defaults to favicon assets.

## Commit Guardrails

- Pre-commit hook is enabled via Husky.
- Staged files run through `lint-staged` (ESLint/Prettier/markdownlint where relevant).
- Agents should still run full `npm run verify` before final handoff.

## Dependency and Tooling Policy

Before adding new dependencies:

1. Prefer built-in Astro features or existing tooling.
2. Prefer first-party/official integrations.
3. Avoid large toolchain additions unless needed for reliability.
4. Document why a new dependency is necessary.

## Vercel Expectations

- Vercel must stay aligned with local checks by using `npm run verify`.
- If Vercel fails, agents should:
  1. Reproduce locally with `npm run verify`.
  2. Fix the issue in source (not by bypassing gates).
  3. Re-run `npm run verify` before handoff.

## Agent Handoff Checklist

Before declaring work complete, agents must confirm:

1. Requested change is implemented.
2. `npm run verify` passed.
3. Any tradeoffs/limitations are documented.
4. Files changed are clearly listed for the owner.
