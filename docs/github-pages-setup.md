# GitHub Pages Setup

This repository is the active GitHub Pages source for Chung Hy Dai's current portfolio.

## 1) Repository
- Repository: `daichunghy-ben/daichunghy-ben.github.io`
- Branch: `main`
- Active website path: `/portfolio/`

## 2) Enable GitHub Pages via Actions
- In GitHub repo: `Settings` -> `Pages`.
- Under **Build and deployment**, set **Source** to `GitHub Actions`.

## 3) (Optional but recommended) Set metadata variables
- In GitHub repo: `Settings` -> `Secrets and variables` -> `Actions` -> `Variables`.
- Add:
  - `SITE_URL` = `https://daichunghy-ben.github.io/portfolio/`
  - `LEGACY_PAGES_HOSTS` = `chunghy-portfolio.pages.dev,chunghy.pages.dev`

If `SITE_URL` is not set, canonical/OG tags remain in source-default mode.

## 4) Deploy
- Push to `main`, or run workflow manually at `Actions` -> `Deploy GitHub Pages`.
- Workflow builds `.deploy/public` using `scripts/stage-pages.mjs` and publishes it.

## 5) Final URL
- Current production URL:
  - `https://daichunghy-ben.github.io/portfolio/index.html`
- Root URL:
  - `https://daichunghy-ben.github.io/` is not the current website target. Root-level HTML pages are intentionally excluded from deployment to avoid maintaining a second version.

## 6) Local verification before push
```bash
node scripts/stage-pages.mjs
node scripts/check-site-local.mjs
```
