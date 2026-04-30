# GitHub Pages Setup (Copy Project)

This folder is a copy of the original portfolio. All GitHub migration work is done here so the original files remain untouched.

## 1) Create GitHub repository
- Create a new repository named `portfolio` under account `daichunghy-ben`.
- Push this copied folder to the `main` branch.

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
- Project repo URL format:
  - `https://daichunghy-ben.github.io/portfolio/`
- User/Org site repo URL format (repo name exactly `<username>.github.io`):
  - `https://daichunghy-ben.github.io/`

## 6) Local verification before push
```bash
node scripts/stage-pages.mjs
node scripts/check-site-local.mjs
```
