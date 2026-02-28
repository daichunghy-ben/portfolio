# LinkedIn Block Mitigation Runbook

## Purpose
Use this runbook when LinkedIn blocks the portfolio link with messages like `Malicious Website Suspected`.

## 1) Prepare Deploy Variables
Set these environment variables before staging/deploying:

```bash
export CF_PAGES_PROJECT="your-pages-project"
export SITE_URL="https://portfolio.your-custom-domain.com"
export LEGACY_PAGES_HOSTS="chunghy-portfolio.pages.dev,chunghy.pages.dev"
```

Notes:
- `SITE_URL` must be your final custom domain (HTTPS).
- `LEGACY_PAGES_HOSTS` is the old Pages host list that should 301 to `SITE_URL`.

## 2) Stage + Validate Metadata

```bash
npm run stage:pages
npm run check:local
```

What this now does:
- Rewrites staged canonical and `og:url` tags to absolute URLs under `SITE_URL`.
- Normalizes `og:image`, `og:image:secure_url`, and `twitter:image` to absolute URLs.
- Updates staged `assets/data/site-config.json` with deploy-time URL fields.

## 3) Deploy with Redirect Middleware

```bash
npm run deploy:pages
```

Deploy now includes Cloudflare Pages Functions (`functions/_middleware.js`) which:
- Detects requests coming from legacy Pages hosts.
- Returns `301` to the equivalent path on `SITE_URL`.

## 4) Collect Evidence for LinkedIn Review

```bash
npm run evidence:linkedin
```

This writes a markdown report under `.audit/linkedin/` containing:
- Direct `HEAD` checks (normal and LinkedInBot UA).
- Snapshot of LinkedIn redirect/check page signals.

Attach this report when submitting a false-positive request.

## 5) Quick Link Hygiene Audit

```bash
npm run audit:externals
```

Review domains flagged as:
- non-HTTPS links,
- known shorteners,
- direct IP-host links.

## 6) LinkedIn Submission Template
Use this message in LinkedIn's report form:

> My portfolio domain was blocked as malicious, but the site serves clean static content and returns normal responses (`HTTP 200`) for both browser and bot user-agents. We also migrated to a dedicated custom domain and implemented permanent redirects from old Pages hosts. Please review and remove this false-positive block.

Include:
- blocked URL,
- custom domain URL,
- timestamp and evidence file content.

## 7) Acceptance Checks
- Desktop LinkedIn profile link opens site (no block page).
- Mobile LinkedIn app link opens site.
- `curl -I` on custom domain returns `2xx`.
- `curl -I` on legacy host returns `301` to custom domain.
- LinkedIn Post Inspector renders preview.
