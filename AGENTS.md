# Active Portfolio Workspace

This is the active website workspace for Chung Hy Dai's portfolio.

- Edit this repo for the current site: `/Users/macos/Desktop/portfolio_hy_resources_github`.
- Current production URL to edit and verify: `https://daichunghy-ben.github.io/portfolio/index.html`.
- The root URL `https://daichunghy-ben.github.io/` is not the current website target. Do not create, edit, or verify root-level portfolio HTML unless the user explicitly asks for a root redirect or root landing page.
- Stale Cloudflare hosts may still appear in old config (`https://daichunghy-portfolio.pages.dev/`, `https://chunghy.pages.dev/`), but they should not be treated as the current live site unless DNS/deploy config is updated.
- Local preview: run `npm run preview`, then open `http://127.0.0.1:4173/`.
- Do not edit `/Users/macos/Desktop/portfolio_hy_resources` or `/Users/macos/Desktop/portfolio_hy_resources_publish` for current website work; those are legacy/publish snapshots and can cause agents to patch the wrong site.

# Live Site Update Rules

- The production site is GitHub Pages, so changes are not visible on `https://daichunghy-ben.github.io/portfolio/...` until the repo is pushed to `main` and the GitHub Pages workflow finishes.
- Local edits and `npm run preview` only update the local preview at `http://127.0.0.1:4173/`; never imply that production changed unless a push/deploy actually completed.
- When the user asks to change the live website, treat the task as publish-bound by default: edit the files, run the build checks, stage only the relevant files, commit, push to `origin/main`, and then verify the production URL after GitHub Pages deploys.
- If there is a dirty worktree with unrelated changes, do not stage or revert them. Stage only the files required for the requested site update and explicitly mention any unrelated dirty files.
- There is no true no-push real-time editing path for the current GitHub Pages production site. Alternatives such as local preview, a temporary tunnel, Cloudflare/Vercel direct deploys, or a CMS still require serving from a different URL or running a deployment step.

# Publication Evidence Rules

- Springer virtual influencer chapter may be described as published with DOI `10.1007/978-981-96-4116-1_9`.
- Nutrition may be described as an FCBEM 2025 proceedings-linked paper when linking the hosted PDF and FCBEM page.
- CIEMB EV and motorbike outputs should remain "CIEMB manuscript/conference context" unless an external record, exported email, or archived source is attached.
- If Gmail evidence is requested but the Gmail connector is unavailable, do not claim it was read. Use local exports/screenshots only and note the evidence gap.

# Build Checks

- Before handing off site changes, run `npm run stage:pages` and `npm run check:local`.
- Use `npm run audit:externals` after changing external links or mirrored media.
