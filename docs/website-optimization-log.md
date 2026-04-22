# Website Optimization Log

Date: 2026-04-20
Workspace: `/Users/macos/Desktop/portfolio_hy_resources_github`

## Scope

- Audit the portfolio site for real website errors.
- Fix low-risk performance and QA issues that affect the live site or developer checks.
- Save the exact steps, commands, findings, and outcomes for later reference.

## Starting State

- `git status` showed the repo was already dirty before this pass.
- Local site crawl already passed.
- `check:remote` failed against GitHub Pages because the remote crawler resolved relative URLs from `/portfolio` as if they were rooted at `https://daichunghy-ben.github.io/`.
- Mobile Lighthouse for the two main entry pages showed good structure but avoidable render-blocking time:
  - `index.html`: performance `83`, LCP `3.4 s`, render-blocking savings `2,640 ms`
  - `projects.html`: performance `81`, LCP `3.6 s`, render-blocking savings `2,600 ms`

Artifacts created during the initial audit:

- `output/lighthouse/index-mobile.json`
- `output/lighthouse/projects-mobile.json`
- `output/playwright/home-mobile.png`
- `output/playwright/home-mobile-menu.png`
- `output/playwright/projects-mobile.png`
- `output/playwright/projects-mobile-scrolled.png`

## Audit Steps Run

### 1. Inspect repo and current site tooling

Commands used:

```bash
git status --short --branch
git diff --stat
sed -n '1,220p' package.json
sed -n '1,260p' scripts/check-site-remote.mjs
sed -n '1,80p' styles/base.css
sed -n '1,80p' styles/home.css
sed -n '1,80p' styles/projects.css
```

Why:

- Confirm what was already modified.
- Avoid overwriting unrelated work.
- Identify which parts of the build pipeline controlled crawling and render performance.

### 2. Run baseline site checks

Commands used:

```bash
npm run check:local
SITE_URL=https://daichunghy-ben.github.io/portfolio/ npm run check:remote
```

Findings:

- `check:local` passed.
- `check:remote` produced false 404s for root-level URLs like `/assets/...` and `/projects.html`.
- Root cause: the remote checker was using the requested URL instead of the redirected final URL when resolving relative paths.

### 3. Stage the production build and run browser QA

Commands used:

```bash
npm run stage:pages
python3 -m http.server 4173 --directory .deploy/public
```

Playwright CLI session used:

```bash
export PWCLI=/Users/macos/.codex/skills/playwright/scripts/playwright_cli.sh
export PLAYWRIGHT_CLI_SESSION=portfolio-audit
"$PWCLI" open http://127.0.0.1:4173/index.html --headed
"$PWCLI" console warning
"$PWCLI" network
"$PWCLI" resize 390 844
"$PWCLI" goto http://127.0.0.1:4173/index.html
"$PWCLI" click e6
"$PWCLI" screenshot --filename output/playwright/home-mobile-menu.png
"$PWCLI" goto http://127.0.0.1:4173/projects.html
"$PWCLI" screenshot --filename output/playwright/projects-mobile.png --full-page
"$PWCLI" eval \"() => { window.scrollTo(0, 700); return 'ok'; }\"
"$PWCLI" screenshot --filename output/playwright/projects-mobile-scrolled.png
"$PWCLI" close
```

Findings:

- No console errors or broken local network requests on the main entry pages.
- Mobile menu opened correctly.
- Full-page screenshots on the projects page showed large blank areas, but manual scroll showed the cards render correctly in viewport. This behavior is tied to deferred rendering and reveal effects, not a broken card layout.

### 4. Measure performance before and after

Commands used for baseline:

```bash
npx lighthouse http://127.0.0.1:4173/index.html \
  --chrome-path "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --chrome-flags "--headless=new --no-sandbox" \
  --only-categories=performance \
  --preset=perf \
  --output=json \
  --output-path=output/lighthouse/index-mobile.json

npx lighthouse http://127.0.0.1:4173/projects.html \
  --chrome-path "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --chrome-flags "--headless=new --no-sandbox" \
  --only-categories=performance \
  --preset=perf \
  --output=json \
  --output-path=output/lighthouse/projects-mobile.json
```

Commands used for the final verification:

```bash
npx lighthouse http://127.0.0.1:4173/index.html \
  --chrome-path "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --chrome-flags "--headless=new --no-sandbox" \
  --only-categories=performance \
  --preset=perf \
  --output=json \
  --output-path=output/lighthouse/index-mobile-after-seq.json

npx lighthouse http://127.0.0.1:4173/projects.html \
  --chrome-path "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --chrome-flags "--headless=new --no-sandbox" \
  --only-categories=performance \
  --preset=perf \
  --output=json \
  --output-path=output/lighthouse/projects-mobile-after-seq.json
```

Important note:

- When Lighthouse was run in parallel with other heavy browser work, the scores became noisy and much worse than reality.
- The final accepted numbers are the sequential reruns in `*-after-seq.json`.

## Changes Made

### A. Fix remote crawl validation

File changed:

- `scripts/check-site-remote.mjs`

What changed:

- The crawler now resolves relative links from `response.url` when a redirect occurred.
- HTML, CSS, and JS detection now also uses the effective final URL.

Why:

- GitHub Pages redirects `/portfolio` to `/portfolio/`.
- Without using the redirected URL, relative links were being expanded against the wrong base and produced false 404s.

Result:

- `SITE_URL=https://daichunghy-ben.github.io/portfolio/ npm run check:remote`
- Final result: `passed`, `262` internal URLs verified.

### B. Remove a render-blocking font import from the main base stylesheet

File changed:

- `styles/base.css`

What changed:

- Removed the top-level Google Fonts `@import`.
- Replaced the shared font variables with a local system sans stack.

Why:

- The homepage and projects page were paying for an external font stylesheet on first paint.
- The imported font chain was a major contributor to Lighthouse render-blocking time on mobile.
- The visual language of the site is compatible with a high-quality system sans stack, so this was a low-risk performance win.

### C. Reduce over-aggressive deferred rendering on core sections

Files changed:

- `styles/home.css`
- `styles/projects.css`

What changed:

- Removed `content-visibility: auto` from the most important `#research` sections on home and projects pages.

Why:

- These sections are central content, not low-priority footer material.
- Applying aggressive deferred rendering to the primary archive section made automated visual verification unreliable and can delay paint for important content.

## Repo Hygiene Changes

Files changed:

- `.gitignore`

Cleanup:

- Added `.DS_Store` to `.gitignore`
- Removed the tracked local `.DS_Store` file from the working tree

## Final Verification

Checks run:

```bash
npm run stage:pages
npm run check:local
SITE_URL=https://daichunghy-ben.github.io/portfolio/ npm run check:remote
```

Results:

- `stage:pages` succeeded
- `check:local` passed with `264` internal URLs
- `check:remote` passed with `262` internal URLs on the live GitHub Pages URL

Final mobile Lighthouse results from sequential reruns:

- `output/lighthouse/index-mobile-after-seq.json`
  - performance `92`
  - LCP `2.6 s`
  - Speed Index `3.2 s`
  - render-blocking savings reduced to `1,200 ms`
- `output/lighthouse/projects-mobile-after-seq.json`
  - performance `92`
  - LCP `2.6 s`
  - Speed Index `3.0 s`
  - render-blocking savings reduced to `1,200 ms`

## Files Changed In This Pass

- `.gitignore`
- `styles/base.css`
- `styles/home.css`
- `styles/projects.css`
- `scripts/check-site-remote.mjs`

## Follow-Up Opportunities

- `unused-css-rules` is still large in Lighthouse (`~169-178 KiB`). The next meaningful optimization would be splitting shared CSS more aggressively by page or trimming legacy selectors.
- Some research pages still load custom Google Fonts separately. That is acceptable for now, but those pages can be optimized later if they become important landing pages.
- Full-page automated screenshots are still a poor proxy for sections hidden by reveal-on-scroll effects. If you need clean capture artifacts, use viewport screenshots after scrolling to each section instead of one full-page capture.

---

## Advanced SEO Pass

Date: 2026-04-20

### SEO Scope

- Improve Google search visibility with stronger canonical signals, metadata coverage, structured data, and crawlable internal linking.
- Fix deployment-path errors specific to GitHub Pages project sites under `/portfolio/`.
- Strengthen naming consistency across homepage, projects archive, and research detail pages.
- Save the full implementation and verification trail in this log.

### Agent-Assisted Findings

Two explorer agents were used to audit the site before implementation.

Key findings from the audit:

- Several research detail pages lacked static canonical, Open Graph, Twitter card, and JSON-LD coverage.
- Existing metadata coverage was inconsistent across the archive and detail pages.
- Internal linking on research detail pages was shallow, which weakened discovery and context for search engines.
- Naming across navigation, page titles, headings, and archive labels was fragmented (`Work`, `Projects`, `Research`).
- GitHub Pages subpath handling was fragile, creating a risk that canonical URLs could drop `/portfolio/` and point to the wrong host path.

### Commands Used

```bash
sed -n '1,220p' assets/data/site-config.json
sed -n '1,260p' scripts/stage-pages.mjs
sed -n '1,220p' scripts/check-site-local.mjs
sed -n '1,220p' scripts/check-site-remote.mjs
sed -n '1,220p' assets/data/research-manifest.json

SITE_URL=https://daichunghy-ben.github.io/portfolio/ npm run stage:pages
npm run check:local

npx lighthouse http://127.0.0.1:4173/index.html \
  --chrome-path "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --chrome-flags "--headless=new --no-sandbox" \
  --only-categories=seo \
  --output=json \
  --output-path=output/lighthouse/index-seo-after.json

npx lighthouse http://127.0.0.1:4173/projects.html \
  --chrome-path "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --chrome-flags "--headless=new --no-sandbox" \
  --only-categories=seo \
  --output=json \
  --output-path=output/lighthouse/projects-seo-after.json

npx lighthouse http://127.0.0.1:4173/research-virtual-influencers.html \
  --chrome-path "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --chrome-flags "--headless=new --no-sandbox" \
  --only-categories=seo \
  --output=json \
  --output-path=output/lighthouse/research-virtual-seo-after.json
```

### Changes Made

#### 1. Centralized build-time SEO generation

Files changed:

- `scripts/seo-page-data.mjs` (new)
- `scripts/stage-pages.mjs`

What changed:

- Added a single SEO generator that runs during staging and applies metadata to every HTML page in `.deploy/public`.
- Generated or normalized:
  - `<title>`
  - `meta description`
  - `meta robots`
  - `meta author`
  - canonical
  - Open Graph fields
  - Twitter card fields
  - JSON-LD structured data
- Structured data now covers:
  - homepage as `WebSite`, `Person`, `ProfilePage`
  - projects archive as `CollectionPage`, `BreadcrumbList`, `ItemList`
  - research detail pages as `CreativeWork` or `ScholarlyArticle`
- Added automatic visible breadcrumb navigation and related-research linking blocks on research pages.

Why:

- This eliminates page-by-page metadata drift and makes the production output deterministic.
- Google gets clearer page purpose, entity context, and archive-detail relationships.

#### 2. Fixed GitHub Pages subpath canonical bug

Files changed:

- `scripts/seo-page-data.mjs`
- `scripts/stage-pages.mjs`

What changed:

- Reworked page URL resolution so project-site pages resolve under `https://daichunghy-ben.github.io/portfolio/` instead of accidentally resetting to the domain root.
- Fixed canonical, `og:url`, JSON-LD `url`, breadcrumb item URLs, and sitemap URL generation to preserve the `/portfolio/` subpath.
- Normalized legacy absolute asset/page URLs so old Pages-host URLs are rewritten safely into the active site path.

Why:

- This was a real SEO defect. If canonical or schema URLs fall off the project subpath, Google can see conflicting signals about the preferred URL.

#### 3. Improved SEO QA checks

Files changed:

- `scripts/seo-checks.mjs` (new)
- `scripts/check-site-local.mjs`
- `scripts/check-site-remote.mjs`

What changed:

- Added lightweight SEO lint checks for:
  - title
  - meta description
  - canonical
  - robots
  - Open Graph
  - Twitter card
  - H1
  - JSON-LD
- Local QA now maps staged pages back to the deployed base URL when evaluating canonical correctness, instead of comparing against `localhost`.

Why:

- Without this, local checks can pass or fail for the wrong reason on a subpath deployment.
- The checker now validates the same URL shape that Google will actually crawl.

#### 4. Strengthened internal linking and archive discoverability

Files changed:

- `scripts/seo-page-data.mjs`
- `styles/base.css`

What changed:

- Added generated breadcrumb trails to archive and research detail pages.
- Added a related-research section linking sibling studies from each research detail page.
- Added stylesheet support for the generated SEO blocks so they fit the existing visual system.

Why:

- Better internal linking improves crawl depth, topical clustering, and user pathing between related pages.

#### 5. Cleaned up search-facing naming

Files changed:

- `assets/data/site-config.json`
- `index.html`
- `projects.html`
- `research-hotel.html`
- `research-ev.html`
- `research-nutrition.html`
- `research-virtual-influencers.html`

What changed:

- Standardized the site name and alternate name:
  - `Chung Hy Dai`
  - `Chung Hy Dai Portfolio`
- Replaced inconsistent `Work` labeling with `Research`.
- Updated the projects archive heading to `Research Projects`.
- Tightened several research titles/H1s so search phrases align better with actual study topics:
  - hotel segmentation
  - EV design/range trade-offs
  - nutrition, physical activity, and diet quality
  - virtual influencer trust and purchase intention

Why:

- Search engines rely heavily on title, heading, site name, and anchor consistency to infer page topic and site identity.

#### 6. Hardened deployment URL derivation

Files changed:

- `.github/workflows/deploy-pages.yml`

What changed:

- The GitHub Pages workflow now derives the correct production base URL automatically from repository context if `SITE_URL` is not explicitly set.

Why:

- This reduces the chance of shipping correct content with incorrect canonical metadata.

### Verification Results

Build and crawl verification:

- `SITE_URL=https://daichunghy-ben.github.io/portfolio/ npm run stage:pages`
  - passed
- `npm run check:local`
  - passed
  - verified `264` internal URLs

SEO-focused Lighthouse artifacts:

- `output/lighthouse/projects-seo-after.json`
  - SEO score `100`
- `output/lighthouse/research-virtual-seo-after.json`
  - SEO score `100`
- `output/lighthouse/index-seo-after.json`
  - SEO score `92`
  - note: homepage score is suppressed in local audit because the canonical points to the production GitHub Pages URL rather than the localhost URL used by Lighthouse; the staged markup itself is correct after the subpath fix

Manual staged-output validation:

- `projects.html` canonical and JSON-LD URLs now correctly resolve to:
  - `https://daichunghy-ben.github.io/portfolio/projects.html`
- Research detail page canonical and breadcrumb item URLs now correctly resolve to:
  - `https://daichunghy-ben.github.io/portfolio/research-*.html`
- Homepage canonical resolves to:
  - `https://daichunghy-ben.github.io/portfolio/`

### Files Added In This SEO Pass

- `scripts/seo-checks.mjs`
- `scripts/seo-page-data.mjs`

### Practical Limits

- The current free domain (`daichunghy-ben.github.io/portfolio/`) is workable and now properly canonicalized.
- A custom domain would still improve branding and branded-search recall, but that is outside the no-cost constraint.
- Google visibility still depends on deployment plus Search Console resubmission. Code changes alone do not force reindexing.

### Recommended Next Step After Deploy

1. Deploy the updated site.
2. Open Google Search Console.
3. Resubmit:
   - `https://daichunghy-ben.github.io/portfolio/sitemap.xml`
4. Request reindex for:
   - homepage
   - `projects.html`
   - top research pages

---

### 2026-04-20 - Advanced SEO pass: keyword clustering, reputation signals, schema expansion

Goal:

- Increase search visibility with stronger keyword targeting.
- Improve query matching by aligning titles, headings, and anchor text.
- Strengthen credibility signals with richer structured data and provenance metadata.

What changed:

- `scripts/seo-page-data.mjs`
  - Preserved authored `<title>` values instead of flattening them.
  - Decoded HTML entities before title extraction to avoid double-escaped output.
  - Added richer `Person` schema: profile image, `alumniOf`, and `knowsLanguage`.
  - Added `ItemList` structured data on the homepage for selected work.
  - Added `datePublished`, `dateModified`, `identifier`, and `citation` to research pages when available.
- `assets/data/site-config.json`
  - Shortened the site description to keep metadata within safe length and avoid truncation.
- `assets/data/research-manifest.json`
  - Reworded several titles and summaries to match higher-intent search phrases:
    - hospitality segmentation
    - EV design and range trade-offs
    - influencer retention and brand transfer
    - virtual influencer trust
    - buffet nudging
    - nutrition and diet quality
    - psychological ownership
    - arts workshop co-creation
    - hotel value segmentation
    - Hanoi motorbike phase-out acceptance
- `index.html`
  - Expanded the homepage summary with clearer topic keywords.
  - Added descriptive internal links for selected work.
  - Added profile links that reinforce entity signals.
- `projects.html`
  - Reframed the archive as a topical landing page with keyword clusters.
  - Added semantic topic sections to improve crawl context and internal discovery.
  - Strengthened archive card titles and summaries.
- Research detail pages
  - Updated page titles and H1s on selected pages to match topic intent more closely.
  - Aligned the EV page `<title>` with the existing H1/JSON-LD wording so the keyword phrase stays consistent across metadata layers.

Why:

- Search engines rely heavily on title, H1, anchor text, canonical URL, and schema to infer topical relevance.
- Query-aligned titles and clusters help pages rank for more specific long-tail searches.
- `Person`, `ScholarlyArticle`, `BreadcrumbList`, `ItemList`, and citation metadata strengthen trust and entity understanding.

Verification:

- `SITE_URL=https://daichunghy-ben.github.io/portfolio/ npm run stage:pages`
  - passed
  - staged `658` files to `.deploy/public`
- Manual HTML checks on staged output confirmed:
  - canonical URLs stayed on the `/portfolio/` subpath
  - authored titles were preserved
  - no `&amp;amp;` double-encoding appeared in `<title>`/OG tags
  - homepage `Person` schema included `image`, `alumniOf`, and `knowsLanguage`
  - homepage `ItemList` included the selected work links
  - research pages emitted `datePublished` and `dateModified` where available
- Freshness metadata sanity check:
  - 11 research detail pages emitted `dateModified: 2026-04-20`
  - 1 publication-backed page emitted `datePublished`
- `npm run check:local`
  - passed
  - verified `264` internal URLs

Notes:

- This pass improves organic visibility and search relevance without spending money.
- A custom domain would still help branding, but it is not required for the SEO improvements made here.
- After deployment, the sitemap should be resubmitted in Google Search Console for faster reindexing.

---

### 2026-04-20 - Discovery IA pass: about page, topic hubs, image sitemap, and hub-based internal linking

Goal:

- Expand the site beyond flat project/detail navigation so Google can crawl clearer topic clusters.
- Improve branded-search and entity understanding with a dedicated profile/methodology page.
- Add richer crawl surfaces for images and internal links without making the UI heavier.

What changed:

- New discovery pages:
  - `about.html`
  - `hospitality-analytics.html`
  - `mobility-policy.html`
  - `creator-economy.html`
  - `health-behavior.html`
  - `organizational-behavior.html`
- New shared styling:
  - `styles/discovery.css`
- `index.html`
  - Added a top-level `About` route in the main nav.
  - Replaced the secondary hero CTA with a direct link to the new About/methodology page.
  - Added a new `Focus Areas` section with five topic-hub cards:
    - hospitality analytics
    - mobility and policy
    - creator economy
    - health and behavior
    - organizational behavior
  - Added supporting route links back to the About page and full archive.
- `projects.html`
  - Added a top-level `About` route in the main nav.
  - Added a topic-route switchboard near the archive intro so users and crawlers can enter by cluster.
  - Reorganized the archive taxonomy to align with the new hubs.
  - Moved `buffet nudging` out of the mobility block and into `Health and Behavior Research`.
  - Converted cluster headings into exact-name links to their corresponding hub pages.
- `styles/home.css`
  - Added restrained styles for the homepage focus-area module and route links.
- `styles/projects.css`
  - Added route-map styles and link styling for linked cluster headings.
- `styles/base.css`
  - Changed `.topic-hub-grid` from a fixed five-column layout to an `auto-fit` grid so two-card adjacent-link sections on topic pages do not collapse into under-emphasized whitespace.
- `scripts/seo-page-data.mjs`
  - Added special handling for About and topic-hub pages.
  - Added structured data for:
    - `AboutPage`
    - topic `CollectionPage` hubs
    - hub-aware breadcrumbs
  - Added topic-hub links into research-page related-links blocks and breadcrumbs.
  - Added hub pages to homepage/profile and archive structured data via `hasPart`.
  - Normalized study-type labels to exact hub names, including:
    - `Hospitality Analytics Research`
    - `Organizational Behavior Research`
- `scripts/stage-pages.mjs`
  - Added support for staging `styles/discovery.css`.
  - Added image extraction and generation for `image-sitemap.xml`.
  - Added the image sitemap reference to `robots.txt`.
- `scripts/check-site-local.mjs`
  - Added validation for `image-sitemap.xml`.
- `scripts/check-site-remote.mjs`
  - Added validation for `image-sitemap.xml`.
- `js/research-manifest.js`
  - Enabled topic pages to hydrate their project cards from the research manifest.

Agent-audit fixes applied during this pass:

- Removed a stray `>` that broke the adjacent-links wrapper in `mobility-policy.html`.
- Fixed archive taxonomy coherence so the cluster names match the hub titles exactly.
- Adjusted shared hub-grid behavior so adjacent links remain visually strong on wide screens.

Why:

- The new About page gives Google and human reviewers a cleaner branded-search landing page for:
  - name queries
  - portfolio queries
  - methodology/profile queries
- Topic hubs create stronger topical authority than a flat archive because they:
  - group related work
  - reinforce keyword clusters
  - create repeated internal links between archive, hub, and detail layers
- An image sitemap improves discovery for a portfolio that depends heavily on visual artifacts.
- Matching cluster names across headings, links, and schema reduces ambiguity for crawlers.

Verification:

- Script syntax checks:
  - `node --check scripts/seo-page-data.mjs`
  - `node --check scripts/stage-pages.mjs`
  - `node --check scripts/check-site-local.mjs`
  - `node --check scripts/check-site-remote.mjs`
  - all passed
- Build/stage verification:
  - `npm run build:css`
  - `npm run build:js`
  - `SITE_URL=https://daichunghy-ben.github.io/portfolio/ node scripts/stage-pages.mjs`
  - passed
  - staged `666` files to `.deploy/public`
- Local crawl verification:
  - `npm run check:local`
  - passed
  - verified `274` internal URLs
- Manual staged-output checks confirmed:
  - `.deploy/public` contains:
    - `about.html`
    - all 5 topic pages
    - `image-sitemap.xml`
  - `sitemap.xml` includes the About page and all 5 topic hubs
  - homepage structured data includes:
    - About page
    - all 5 topic hubs
  - archive structured data includes all 5 topic hubs via `hasPart`
  - `organizational-behavior.html` uses the normalized hub title everywhere

Notes:

- I intentionally used a lighter verification path (`build:css`, `build:js`, then `stage-pages`) after the HTML/CSS/SEO edits, because this pass did not change source images and the full `build:images` step is not required to verify sitemap/crawl behavior.
- `check:remote` was not rerun in this pass because the new pages are not deployed yet; remote verification would only reflect the older live site.

---

### 2026-04-20 - Freshness pass: visible update dates and image presentation signals

Goal:

- Add another SEO technique that improves freshness signals without cluttering the interface.
- Keep the portfolio aesthetic restrained while making the page date and image hints more explicit for search engines.

What changed:

- `scripts/seo-page-data.mjs`
  - Added `dateModified` to the projects archive `CollectionPage` structured data so the visible archive update and JSON-LD match.
- `about.html`
  - Added a subtle `Last updated 20 Apr 2026` line in the hero intro.
- Topic hub pages
  - Added the same `Last updated 20 Apr 2026` freshness label to:
    - `hospitality-analytics.html`
    - `mobility-policy.html`
    - `creator-economy.html`
    - `health-behavior.html`
    - `organizational-behavior.html`
- `projects.html`
  - Added the same freshness label under the archive intro.
- `styles/discovery.css`
  - Added a restrained style for the freshness label used by About and topic hub pages.
- `styles/projects.css`
  - Added matching freshness-label styling for the archive page.

Why:

- Google’s byline-date guidance recommends making update dates visible when you want the crawler to recognize them reliably.
- The label gives the archive and hub pages a small freshness signal without making the layout feel blog-like or noisy.
- This keeps the site aligned with the portfolio’s aesthetic while supporting search presentation.

Verification:

- `node --check scripts/seo-page-data.mjs`
  - passed
- `npm run build:css`
  - passed
- `SITE_URL=https://daichunghy-ben.github.io/portfolio/ node scripts/stage-pages.mjs`
  - passed
  - staged `666` files to `.deploy/public`
- `npm run check:local`
  - passed
  - verified `274` internal URLs
- Manual staged-output checks confirmed:
  - visible `Last updated 20 Apr 2026` lines are present on About, topic hub, and archive pages
  - `projects.html` emits `dateModified: 2026-04-20` in JSON-LD

Notes:

- I did not add a visible date to the homepage because it would not materially help the front page and would start to feel forced.
- I kept the date copy compact and uniform so it reads like metadata, not editorial content.

---

### 2026-04-20 - Deploy check and crawl-mesh pass

Goal:

- Verify whether the current SEO changes are actually live on GitHub Pages.
- Add one more crawl-focused improvement that helps discovery even when users enter from deep pages.

Live-site findings:

- The current live homepage still shows the older navigation and content structure.
- The live site does **not** currently have:
  - `about.html`
  - topic hub pages
  - `image-sitemap.xml`
- Live checks performed:
  - `curl -s https://daichunghy-ben.github.io/portfolio/`
    - confirmed the old `Work / Experience / Credentials / Skills / Education` nav is still live
  - `curl -I -L https://daichunghy-ben.github.io/portfolio/about.html`
    - returned `404`
  - `curl -s https://daichunghy-ben.github.io/portfolio/robots.txt`
    - currently lists only the main sitemap
  - `curl -I -L https://daichunghy-ben.github.io/portfolio/image-sitemap.xml`
    - returned `404`

Conclusion:

- The current SEO work has **not** been deployed to the live GitHub Pages site yet.
- Google cannot crawl the new pages until the repo changes are pushed and Pages rebuilds.

Additional crawl-focused improvement added in source:

- `scripts/seo-page-data.mjs`
  - Added a generated `site-routes` module that injects direct crawlable links to:
    - About
    - Research archive
    - all topic hub pages
  - The block is inserted before the footer on pages processed by the staging pipeline.
- `styles/base.css`
  - Added lightweight styling for the generated site-routes panel so it stays compact and visually quiet.

Why:

- Some crawlers and users enter deep pages directly. A compact site-level route block near the footer gives every page a consistent path back into the important clusters and profile page.
- This complements breadcrumbs and related-links with a broader discovery mesh.

Verification:

- `node --check scripts/seo-page-data.mjs`
  - passed
- `npm run build:css`
  - passed
- `SITE_URL=https://daichunghy-ben.github.io/portfolio/ node scripts/stage-pages.mjs && npm run check:local`
  - passed
  - verified `274` internal URLs

Notes:

- This pass improves crawlability in source, but it does not change live Google behavior until the site is deployed.

---

### 2026-04-21 - Domain and keyword alignment pass

Goal:

- Lock the portfolio's canonical domain to the free GitHub Pages URL.
- Strengthen keyword signals without stuffing.
- Keep redirects, social preview text, canonical tags, and sitemap output aligned.

Changes made:

- `assets/data/site-config.json`
  - Updated `site_url` and `canonical_base` to `https://daichunghy-ben.github.io/portfolio/`.
  - Expanded `site_keywords` to cover:
    - `market research`
    - `consumer insights`
    - `market research analyst`
    - `consumer behavior`
    - `behavioral research`
    - `qualitative research`
    - `quantitative research`
    - `Ho Chi Minh City`
    - `Swinburne Vietnam`
    - the portfolio owner's name and portfolio phrasing
  - Updated `site_alternate_name` to a more search-friendly phrase.
  - Updated `last_updated` to `2026-04-21` so structured data can mark the site as fresh.

- `scripts/seo-page-data.mjs`
  - Preserved `site_url`, `canonical_base`, and `site_keywords` when normalizing config.
  - Added keyword metadata generation for page types:
    - homepage
    - research archive
    - about page
    - topic hub pages
    - research detail pages
  - Injected `<meta name="keywords">` into staged HTML.

- `scripts/stage-pages.mjs`
  - Kept the GitHub Pages URL as the fallback production base.
  - Changed the log so it reports when `site-config.json` is supplying the base URL.
  - Kept canonical, `og:url`, robots, sitemap, and image sitemap generation under the same resolved site URL.

- `functions/_middleware.js`
  - Changed the default redirect target to the GitHub Pages URL instead of the old `pages.dev` host.

- `scripts/build-social-preview.mjs`
  - Replaced the hardcoded old website text in the social preview card with the site URL from `assets/data/site-config.json`.

- `scripts/build-social-preview-review.mjs`
  - Same website text update as the main social preview card.

Verification:

- `npm run stage:pages`
  - passed
  - logged: `SITE_URL not set; using site-config base URL: https://daichunghy-ben.github.io/portfolio/`
  - logged: `Applied deployment metadata base URL: https://daichunghy-ben.github.io/portfolio/`
  - staged `839` files to `.deploy/public`
- Manual staged-output checks confirmed:
  - `index.html` canonical URL is `https://daichunghy-ben.github.io/portfolio/`
  - `projects.html` and `about.html` canonical and `og:url` values match the same domain
  - `meta name="keywords"` is present on the main pages and includes the new keyword set
  - `robots.txt`, `sitemap.xml`, and `image-sitemap.xml` point at the GitHub Pages URL
- `npm run check:local`
  - passed
  - verified `272` internal URLs
- `node --check scripts/build-social-preview.mjs`
  - passed
- `node --check scripts/build-social-preview-review.mjs`
  - passed
- `node --check functions/_middleware.js`
  - passed
- `node --check scripts/stage-pages.mjs`
  - passed

Notes:

- The free GitHub Pages URL is now the canonical production domain in source and staged output.
- The keyword set is broader, but still limited to terms that describe the actual portfolio content.
- Live Google visibility still depends on deployment and crawl timing, but the SEO signals are now aligned before deploy.

---

### 2026-04-21 - Full re-check run

Goal:

- Re-run all major checks after the latest SEO/domain updates.
- Verify both staged output and current live GitHub Pages behavior.

Commands executed:

- `npm run stage:pages`
- `npm run check:local`
- `SITE_URL=https://daichunghy-ben.github.io/portfolio/ npm run check:remote`
- `curl -sSI https://daichunghy-ben.github.io/portfolio/`
- `curl -sSI https://daichunghy-ben.github.io/portfolio/sitemap.xml`
- `curl -sSI https://daichunghy-ben.github.io/portfolio/image-sitemap.xml`
- `curl -s https://daichunghy-ben.github.io/portfolio/ | sed -n '1,90p'`
- `curl -s https://daichunghy-ben.github.io/portfolio/projects.html | rg -n "name=\"keywords\"|og:image:alt|twitter:image:alt"`

Results:

- `stage:pages` passed and used:
  - `SITE_URL not set; using site-config base URL: https://daichunghy-ben.github.io/portfolio/`
- `check:local` passed:
  - verified `272` internal URLs
- `check:remote` passed:
  - verified `274` internal URLs
- Live endpoint checks returned `HTTP 200` for:
  - homepage
  - `sitemap.xml`
  - `image-sitemap.xml`

Live-vs-staged observation:

- Staged output (`.deploy/public`) contains the expanded keyword metadata and updated SEO labels.
- Live homepage and projects page still show older OG/Twitter alt wording (`Chung Hy Dai Portfolio`) and do not yet show the expanded `meta name="keywords"` block from staged output.
- Conclusion: crawl/link health is good, but the latest metadata improvements are not fully reflected on the currently served live build yet.

---

### 2026-04-21 - Follow-up fixes after full check

Goal:

- Fix remaining SEO consistency gaps found in the full re-check.

Changes made:

- `scripts/stage-pages.mjs`
  - Added date normalization and merge logic for sitemap timestamps.
  - `sitemap.xml` now uses `max(file_mtime, site_config.last_updated)` for each page's `lastmod`.
  - Updated sitemap generation call to pass SEO config context.

- `index.html`
  - Added source-level `meta name="keywords"` fallback.
  - Updated source-level `og:image:alt` and `twitter:image:alt` to:
    - `Market Research, Consumer Insights & Applied Analytics Portfolio`

- `projects.html`
  - Added source-level `meta name="keywords"` fallback.
  - Updated source-level `og:image:alt` and `twitter:image:alt` to the same normalized phrase.

Verification:

- `node --check scripts/stage-pages.mjs`
  - passed
- `npm run stage:pages`
  - passed
- `npm run check:local`
  - passed
  - verified `272` internal URLs
- `SITE_URL=https://daichunghy-ben.github.io/portfolio/ npm run check:remote`
  - passed
  - verified `274` internal URLs
- Staged output checks:
  - `.deploy/public/sitemap.xml` now emits `lastmod` as `2026-04-21`
  - `.deploy/public/index.html` and `.deploy/public/projects.html` include the expanded keyword metadata
  - staged OG/Twitter image alt text is now consistent with the updated site naming

---

### 2026-04-21 - Presence upgrade pass (entity + metadata hardening)

Goal:

- Increase discoverability signals beyond baseline canonical/sitemap setup.
- Add stronger, repeatable SEO checks so regressions are caught before deploy.

Changes made:

- `scripts/seo-page-data.mjs`
  - Added crawler and locale metadata on all pages generated by the staging pipeline:
    - `meta name="googlebot"` (mirrors robots rules)
    - `meta name="language"` = `en`
    - `meta property="og:locale"` = `en_US`
  - Added article metadata for research detail pages (non-deprecated entries):
    - `article:author`
    - `article:section`
    - `article:published_time` (when inferable)
    - `article:modified_time` (from `last_verified_at` when valid)
    - `article:tag`
  - Added cleanup step to strip stale `article:*` tags before re-inserting page-specific values.

- `scripts/seo-checks.mjs`
  - Strengthened lint rules to require:
    - non-trivial `meta name="keywords"`
    - `og:image:alt`
    - `twitter:image:alt`
  - This makes quality checks stricter for future updates.

- `assets/data/site-config.json`
  - Expanded keyword set with name-query variants:
    - `Dai Chung Hy`
    - `Chung Hy Dai Swinburne`

Verification:

- `node --check scripts/seo-page-data.mjs`
  - passed
- `node --check scripts/seo-checks.mjs`
  - passed
- `node --check scripts/stage-pages.mjs`
  - passed
- `npm run stage:pages`
  - passed
- `npm run check:local`
  - passed
  - verified `272` internal URLs
- Staged-output spot checks confirmed:
  - `index.html` and `projects.html` include `googlebot`, `og:locale`, and enriched keyword metadata
  - research detail pages include `article:*` metadata where applicable

Remote check status:

- `SITE_URL=https://daichunghy-ben.github.io/portfolio/ npm run check:remote`
  - failed with `missing or weak meta keywords` on multiple live URLs
  - this is expected while the live build is still older than the latest staged source
  - once this source revision is deployed, remote lint should return to pass

---

### 2026-04-21 - Google visibility implementation pass

Goal:

- Remove runtime SEO rewrites from the main source pages.
- Strengthen entity signals for the portfolio owner.
- Align the SEO checker with what Google actually uses.

Changes made:

- `index.html` and `projects.html`
  - Removed the inline JavaScript that rewrote canonical and social metadata at runtime.
  - Switched the main canonical and social URLs to the GitHub Pages production base.

- `about.html`
  - Canonical URL now points directly to the GitHub Pages production base.

- `research-hanoi-phaseout.html`
  - Added explicit `noindex` and `googlebot` directives for the legacy alias page.
  - Pointed its canonical URL directly to the canonical research page on GitHub Pages.

- `assets/data/site-config.json`
  - Added `owner.alternate_names` with `Dai Chung Hy`.
  - Added `owner.knows_about` with the portfolio's core topic areas.

- `scripts/seo-page-data.mjs`
  - Normalized public `sameAs` URLs.
  - Added `Person.alternateName` and `Person.knowsAbout` to the homepage structured data.
  - Upgraded the homepage `jobTitle` to a recruiter-facing analyst title.
  - Kept page-level `keywords` generation as an auxiliary signal, but not a Google gate.

- `scripts/seo-checks.mjs`
  - Removed the hard fail on `meta name="keywords"`.
  - Added checks for `meta name="googlebot"` and `og:locale`.

- `docs/structured-data-policy.md`
  - Updated the policy to reflect the current repo path and canonical GitHub Pages URL.
  - Documented `alternateName` and `knowsAbout` in the homepage person schema.

Verification:

- `node --check scripts/seo-page-data.mjs`
  - passed
- `node --check scripts/seo-checks.mjs`
  - passed
- `node --check scripts/stage-pages.mjs`
  - passed
- `npm run stage:pages`
  - passed
  - staged `839` files to `.deploy/public`
- `npm run check:local`
  - passed
  - verified `272` internal URLs

Notes:

- The live site still needs the current source revision to be pushed before Google can see the newest metadata.
- The repository still contains generated asset outputs from the build pipeline; those are intentionally left uncommitted for now because GitHub Actions regenerates them during deploy.

---

### 2026-04-21 - Entity clarity and crawl-dilution pass

Goal:

- Improve Google's understanding of the site name, person identity, and high-value portfolio routes.
- Reduce crawl/index dilution from support pages and non-content routes.
- Tighten visible copy so name queries and role queries match the site more directly.

Changes made:

- `assets/data/site-config.json`
  - Changed `site_alternate_name` to the concise site-name variant `Chung Hy Dai Portfolio`.
  - Added `site_tagline` as `Market Research, Consumer Insights & Applied Analytics Portfolio`.
  - Expanded the supporting keyword set with role and geography variants such as `consumer insights analyst` and `Vietnam market research`.

- `scripts/seo-page-data.mjs`
  - Added a shared `WebSite` + `Person` graph and prepend it across about, projects, hub, and research pages so entity references are self-contained on more ranking URLs.
  - Moved the profile-page emphasis to the about page and kept the homepage centered on `WebSite` / `WebPage` / `Person`.
  - Added a `noindex` path for thin support content (`research-hotel-value.html`) and for `404.html`.
  - Added a dedicated 404 description path so the 404 page does not inherit normal portfolio descriptions.
  - Upgraded generated site-route anchor labels to be more descriptive:
    - `Chung Hy Dai portfolio homepage`
    - `About Chung Hy Dai and research methodology`
    - `Market research projects archive`
    - `<hub name> case studies`

- `scripts/stage-pages.mjs`
  - Excluded `noindex` pages from both `sitemap.xml` and `image-sitemap.xml`, not just canonical-mismatched pages.

- `scripts/seo-checks.mjs`
  - Added an explicit assertion that `404.html` must remain `noindex` for both `robots` and `googlebot`.

- `index.html`
  - Replaced `customer insights` with the exact phrase `consumer insights`.
  - Added visible alias support for `Dai Chung Hy`.
  - Made homepage internal links more query-aligned:
    - `About Chung Hy Dai`
    - `Market Research Archive`
  - Added parent-hub links above the three featured case-study cards.
  - Replaced generic featured-card labels with stronger case-study titles.

- `about.html`
  - Added visible name-variant copy for `Chung Hy Dai` / `Dai Chung Hy`.
  - Reframed the page toward `market research` and `consumer insights` roles.
  - Updated the visible archive route label from `Projects page` to `Market research archive`.

- `projects.html`
  - Strengthened the header copy with the exact phrase `market research, consumer insights, and applied analytics`.
  - Updated the support-route label to `About Chung Hy Dai and methodology`.

- Topic hubs:
  - `hospitality-analytics.html`
  - `mobility-policy.html`
  - `creator-economy.html`
  - `health-behavior.html`
  - `organizational-behavior.html`
  - Added one exact-match sentence per page describing the hub as grouped `market research`, `consumer insights`, and `applied analytics` work.
  - Updated visible `Last updated` labels to `21 Apr 2026`.

- `research-hotel-prca.html`
  - Aligned the visible H1 and hero copy with the title's `PRCA + Kano` framing.

- `styles/base.css`
  - Added styling for the new selected-work hub route labels so the extra internal links remain visually restrained.

Verification:

- `node --check scripts/seo-page-data.mjs`
  - passed
- `node --check scripts/stage-pages.mjs`
  - passed
- `node --check scripts/seo-checks.mjs`
  - passed
- `node scripts/stage-pages.mjs`
  - passed
- `npm run check:local`
  - passed
  - verified `272` internal URLs
- Staged-output checks confirmed:
  - `about.html` now emits a `ProfilePage` plus shared `WebSite` / `Person`
  - `projects.html` now emits shared `WebSite` / `Person`
  - `research-hotel-value.html` is `noindex,follow`
  - `404.html` is `noindex,follow`
  - `research-hotel-value.html` is absent from both `sitemap.xml` and `image-sitemap.xml`
  - `404.html` is absent from both `sitemap.xml` and `image-sitemap.xml`

Notes:

- The `research-hotel-value.html` page remains available for navigation and context, but is now treated as support content instead of a primary search target.
- The live site still needs a push/deploy before Google can see these new signals.

---

### 2026-04-21 - Query-fit content pass for EV, nutrition, and virtual influencer pages

Goal:

- Raise query match on the three detail pages that were still weaker than the rest of the site.
- Make the visible copy and metadata more aligned with search intents such as `EV choice experiment`, `student diet quality`, `virtual influencer trust`, and `creator economy`.

Changes made:

- `assets/data/research-manifest.json`
  - Updated the EV study title to `EV Choice Experiment in Vietnam`.
  - Updated the nutrition study title to `Student Diet Quality in Vietnam`.
  - Updated the virtual influencer study title to `Virtual Influencer Trust and Purchase Intention`.
  - Rewrote the corresponding card summaries to include more direct query phrases:
    - `EV choice experiment`
    - `design, range, price, and charging trade-offs`
    - `Vietnamese university students`
    - `creator-economy research`
    - `virtual influencer cues`
    - `Gen Z trust`

- `research-ev.html`
  - Updated the title to emphasize `EV Choice Experiment in Vietnam`.
  - Reworked the hero badge and intro to include `consumer insights`, `market research`, and `DCE`.
  - Tightened the explanatory copy so the page reads like an EV choice-experiment study rather than a generic design showcase.
  - Renamed the footer CTA to `Open Research Archive`.

- `research-nutrition.html`
  - Updated the title to emphasize `Student Diet Quality in Vietnam`.
  - Reworked the hero badge and intro to include `consumer insights` and `statistical modeling`.
  - Tightened the challenge/method/result copy so it clearly describes a Vietnamese student diet-quality study.
  - Renamed the footer CTA to `Open Research Archive`.

- `research-virtual-influencers.html`
  - Updated the title to emphasize `Virtual Influencer Trust and Purchase Intention`.
  - Reworked the hero badge and intro to include `creator economy` and `consumer insights`.
  - Tightened the challenge/method/result copy so it clearly frames the work as a Gen Z purchase-intention and trust study.
  - Renamed the PDF button to `Read Book Chapter PDF`.
  - Renamed the footer CTA to `Open Research Archive`.

Verification:

- `node --check scripts/seo-page-data.mjs`
  - passed
- `node --check scripts/stage-pages.mjs`
  - passed
- `node --check scripts/seo-checks.mjs`
  - passed
- `node scripts/stage-pages.mjs`
  - passed
- `npm run check:local`
  - passed
  - verified `272` internal URLs

Notes:

- This pass is staged locally and ready to deploy, but the live remote check must wait until the next push finishes building.
- I have not yet changed the live deployment for this content pass, so Google will still see the previous live version until the next deploy completes.

---

### 2026-04-21 - Public signal pass for search discoverability

Goal:

- Add a free, crawlable external signal so Google has another path to discover the portfolio.
- Make the GitHub repository itself describe the portfolio clearly and link to the live site.

Changes made:

- `assets/data/site-config.json`
  - Added the GitHub profile URL to `same_as` so the `Person` schema has one more verified public identity signal.

- `README.md`
  - Added a public repo README with the exact portfolio name.
  - Linked the live portfolio URL, GitHub profile, LinkedIn, and ORCID.
  - Included the main topic phrases the portfolio should rank for, such as `market research`, `consumer insights`, `EV choice experiment in Vietnam`, `student diet quality`, and `virtual influencer trust`.

Notes:

- This is a discoverability boost, not a guarantee of instant indexing.
- The next best free step after this is to let Google recrawl the site and repo, then inspect Search Console URL coverage if available.

---

### 2026-04-21 - Visible GitHub entity link pass

Goal:

- Make the GitHub profile visible inside the portfolio itself, not only in schema and repo metadata.

Changes made:

- `about.html`
  - Added a public GitHub profile link to the external references section.
  - Added the GitHub profile to the footer contact row alongside LinkedIn and ORCID.

Notes:

- This is a small but useful reinforcement for entity matching and branded search.
- It does not guarantee immediate indexing, but it strengthens the network of crawlable references around the site.

---

### 2026-04-22 - Root-domain migration, references hub, insights hub, and feed launch

Goal:

- Move the portfolio from the GitHub Pages project-site path to the root user-site path for stronger branded search and cleaner site-name/entity signals.
- Centralize SEO generation around one root canonical base.
- Add two supporting route types:
  - `references.html` for verified public signals
  - `insights.html` plus three short note pages for freshness and long-tail discovery
- Generate an Atom feed that can be submitted alongside the XML sitemaps.

Changes made:

- `assets/data/site-config.json`
  - Switched `site_url` and `canonical_base` from `https://daichunghy-ben.github.io/portfolio/` to `https://daichunghy-ben.github.io/`.
  - Updated the primary role wording to `Market Research and Consumer Insights Analyst`.
  - Refined the site description for a more role-first branded signal.
  - Added `feed_title` and `feed_description`.
  - Expanded branded and long-tail keyword coverage around EV choice, student diet quality, and virtual influencer trust.

- `assets/data/notes-manifest.json`
  - Added a new notes manifest to drive:
    - insights archive cards
    - note-page schema
    - Atom feed entries
  - Added three notes:
    - `insight-ev-choice-vietnam`
    - `insight-student-diet-quality-vietnam`
    - `insight-virtual-influencer-trust`

- `scripts/seo-page-data.mjs`
  - Added support for new special pages:
    - `references.html`
    - `insights.html`
  - Added support for note pages driven from `notes-manifest.json`.
  - Added generated schema for:
    - references collection page
    - insights collection page
    - note `BlogPosting` pages
  - Expanded shared route generation so internal SEO route blocks now include:
    - homepage
    - about
    - archive
    - references
    - insights
    - topic hubs
  - Added an Atom feed `<link rel="alternate" type="application/atom+xml">` across generated pages.
  - Standardized role/title handling around `Market Research and Consumer Insights Analyst`.

- `scripts/stage-pages.mjs`
  - Changed the fallback deployment base URL to the root domain.
  - Added `feed.xml` generation from the notes manifest.
  - Added the feed to `robots.txt` alongside `sitemap.xml` and `image-sitemap.xml`.

- `scripts/check-site-local.mjs`
  - Added validation that `feed.xml` exists and contains entries.

- `scripts/check-site-remote.mjs`
  - Added the same `feed.xml` validation for live checks.

- `scripts/seo-checks.mjs`
  - Added linting for the Atom feed discovery link.
  - Fixed the Atom link detector so attribute order does not create false negatives.

- `functions/_middleware.js`
  - Switched the default primary redirect target to the root GitHub Pages domain.

- `scripts/build-social-preview.mjs`
  - Switched the default site label to `daichunghy-ben.github.io`.

- `scripts/build-social-preview-review.mjs`
  - Switched the default site label to `daichunghy-ben.github.io`.

- `index.html`
  - Removed old hard-coded canonical/OG/Twitter/JSON-LD blocks so generated metadata can be the single source of truth.
  - Updated homepage copy to use role-first wording.
  - Added direct visible internal links to:
    - `references.html`
    - `insights.html`
  - Added a new homepage section for verified references and short research insights.

- `about.html`
  - Removed the stale hard-coded canonical tag.
  - Added visible navigation links to `references.html` and `insights.html`.
  - Added direct next-step links to the references and insights routes.

- `projects.html`
  - Removed old hard-coded canonical/OG/Twitter/JSON-LD blocks so generated metadata controls the page.
  - Added supporting links to `references.html` and `insights.html`.

- `research-hanoi-phaseout.html`
  - Replaced the source canonical with a relative canonical so the build step can cleanly emit the root-domain absolute URL.

- `references.html`
  - Added a new public references page that groups:
    - GitHub
    - LinkedIn
    - ORCID
    - Swinburne feature
    - Springer chapter record
    - FCBEM page
    - public PDF artifacts

- `insights.html`
  - Added a new insights archive page that explains the note layer and links to the three short note pages.

- `insight-ev-choice-vietnam.html`
  - Added a short note page for `EV choice experiment in Vietnam`.

- `insight-student-diet-quality-vietnam.html`
  - Added a short note page for `student diet quality in Vietnam`.

- `insight-virtual-influencer-trust.html`
  - Added a short note page for `virtual influencer trust`.

- `README.md`
  - Updated the live site URL to the root domain.

- `docs/structured-data-policy.md`
  - Updated the canonical deployment domain and corrected local data-source paths.

- `docs/github-pages-setup.md`
  - Updated the setup guide for the root-level user-site repo layout.

- `_build/CV.md`
  - Updated the portfolio link to the root domain.

Verification:

- `node --check scripts/seo-page-data.mjs`
  - passed
- `node --check scripts/stage-pages.mjs`
  - passed
- `node --check scripts/check-site-local.mjs`
  - passed
- `node --check scripts/check-site-remote.mjs`
  - passed
- `node --check scripts/seo-checks.mjs`
  - passed
- `npm run stage:pages`
  - passed
  - staged output root canonical base: `https://daichunghy-ben.github.io/`
- `npm run check:local`
  - passed
  - verified `279` internal URLs

Observed staged output:

- `robots.txt` now lists:
  - `sitemap.xml`
  - `image-sitemap.xml`
  - `feed.xml`
- `sitemap.xml` now includes:
  - `references.html`
  - `insights.html`
  - all 3 note pages
- generated pages now include an Atom feed discovery link
- canonical and `og:url` values resolve to the root domain, not `/portfolio/`

Operational notes:

- I intentionally did not commit the newly generated `assets/optimized/*` outputs from the local image build. GitHub Actions will regenerate those during the production deploy, and they are not the source-of-truth files for this SEO/content pass.
- Remaining off-site actions that still require manual updates outside this repo:
  - LinkedIn website/featured link should point to `https://daichunghy-ben.github.io/`
  - ORCID website field should point to `https://daichunghy-ben.github.io/`
  - GitHub profile bio/website field should match the same root URL and role wording if user-profile auth permits editing
