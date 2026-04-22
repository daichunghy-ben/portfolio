# GitHub Pages Setup (Root-Level User Site)

This portfolio now targets the GitHub user-site format so the canonical deployment can live at the root domain instead of a subdirectory.

## 1) Repository naming
- Preferred repository name: `daichunghy-ben.github.io`
- Owner account: `daichunghy-ben`
- Keep the default branch on `main`.

## 2) Enable GitHub Pages via Actions
- In GitHub repo: `Settings` -> `Pages`.
- Under **Build and deployment**, set **Source** to `GitHub Actions`.

## 3) (Optional but recommended) Set metadata variables
- In GitHub repo: `Settings` -> `Secrets and variables` -> `Actions` -> `Variables`.
- Add:
  - `SITE_URL` = `https://daichunghy-ben.github.io/`
  - `LEGACY_PAGES_HOSTS` = `chunghy-portfolio.pages.dev,chunghy.pages.dev`

If `SITE_URL` is not set, staging falls back to the production URL stored in `assets/data/site-config.json`.

## 4) Deploy
- Push to `main`, or run workflow manually at `Actions` -> `Deploy GitHub Pages`.
- Workflow builds `.deploy/public` using `scripts/stage-pages.mjs` and publishes it.

## 5) Final URL
- Root user-site URL:
  - `https://daichunghy-ben.github.io/`

## 6) Local verification before push
```bash
npm run stage:pages
npm run check:local
```
