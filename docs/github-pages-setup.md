# GitHub Pages Setup (Copy Project)

This folder is a copy of the original portfolio. All GitHub migration work is done here so the original files remain untouched.

## 1) Create GitHub repository
- Create a new repository (recommended name: `portfolio`).
- Push this copied folder to the `main` branch.

## 2) Enable GitHub Pages via Actions
- In GitHub repo: `Settings` -> `Pages`.
- Under **Build and deployment**, set **Source** to `GitHub Actions`.

## 3) (Optional but recommended) Set metadata variables
- In GitHub repo: `Settings` -> `Secrets and variables` -> `Actions` -> `Variables`.
- Add:
  - `SITE_URL` = `https://<your-username>.github.io/<repo-name>/`
  - `LEGACY_PAGES_HOSTS` = `chunghy-portfolio.pages.dev,chunghy.pages.dev`

If `SITE_URL` is not set, canonical/OG tags remain in source-default mode.

## 4) Deploy
- Push to `main`, or run workflow manually at `Actions` -> `Deploy GitHub Pages`.
- Workflow builds `.deploy/public` using `scripts/stage-pages.mjs` and publishes it.

## 5) Final URL
- Project repo URL format:
  - `https://<your-username>.github.io/<repo-name>/`
- User/Org site repo URL format (repo name exactly `<username>.github.io`):
  - `https://<your-username>.github.io/`

## 6) Local verification before push
```bash
node scripts/stage-pages.mjs
node scripts/check-site-local.mjs
```
