# Structured Data Policy (JSON-LD)

## Purpose
Standardize machine-readable identity and research evidence signals for recruiter trust, search consistency, and claim governance.

## Baseline Scope
- Applies to local pages in `/Users/macos/Desktop/portfolio_hy_resources`.
- Deployment domain is unknown in this audit cycle, so `url` fields are policy placeholders until `site_url` is set.

## Required Data Sources
1. `/Users/macos/Desktop/portfolio_hy_resources/assets/data/site-config.json`
2. `/Users/macos/Desktop/portfolio_hy_resources/assets/data/research-manifest.json`
3. `/Users/macos/Desktop/portfolio_hy_resources/assets/data/claims-registry.json`

## Page-Type Schema Rules

### 1) Homepage (`index.html`)
Use `Person` + `WebSite`.

Required `Person` properties:
- `@type`: `Person`
- `name`
- `url` (resolved from `site_url`)
- `jobTitle` (recruiter-facing role target)
- `sameAs` (LinkedIn, ORCID)
- `email` (optional; include only if intended for public indexing)
- `address` (optional city-level only)

Required `WebSite` properties:
- `@type`: `WebSite`
- `name`
- `url`
- `inLanguage`

### 2) CV page (`cv.html`)
Use `Person` + optional `ProfilePage`.

Required properties:
- `mainEntity` as `Person`
- `hasCredential` for degree/certification summaries
- `knowsAbout` for core domains (market research, consumer insights, analytics)

### 3) Research detail pages (`research-*.html`)
Use `CreativeWork` or `ScholarlyArticle` depending on evidence strength.

Decision rule:
- If DOI/proceedings/public publisher record exists: `ScholarlyArticle`.
- If project is conceptual/internal without publication record: `CreativeWork`.

Required properties:
- `name`
- `description`
- `author` (link to `Person` entity)
- `datePublished` (only if externally evidenced)
- `url`
- `isBasedOn` or `citation` for evidence links
- `identifier` (DOI where available)

## Claim Status Mapping
Use `claims-registry.json` and `research-manifest.json` fields:
- `Verified`: may be rendered as hard factual statements.
- `Self-Reported`: include explicit qualifier text.
- `Unverified`: avoid hard factual phrasing in structured data.

Policy gate:
- Do not emit `datePublished`, numeric sample sizes, or publication totals in JSON-LD unless claim status is `Verified` or explicitly marked self-reported in human-visible copy.

## Canonical and URL Policy
- Canonical URLs must be absolute once `site_url` is known.
- JSON-LD `url` fields must use the same canonical base.

## Validation and QA
Minimum checks before release:
1. JSON-LD parses as valid JSON.
2. Schema type matches page intent (`Person`, `WebSite`, `CreativeWork`, `ScholarlyArticle`).
3. No unverified claim is emitted as verified fact.
4. `sameAs` links resolve (or are labeled authwalled when not resolvable by bots).

## Example Skeletons

### Homepage Person
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Chung Hy Dai",
  "jobTitle": "Market Research and Consumer Insights Analyst",
  "url": "<site_url>",
  "sameAs": [
    "https://www.linkedin.com/in/chung-hy-d-17792826b/",
    "https://orcid.org/0009-0009-6790-8981"
  ]
}
```

### Research Page ScholarlyArticle
```json
{
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  "name": "Exploring the Effect of Social Media Content of Virtual Influencers on Generation Z's Purchase Intention",
  "identifier": "https://doi.org/10.1007/978-981-96-4116-1_9",
  "author": {
    "@type": "Person",
    "name": "Chung Hy Dai"
  },
  "datePublished": "2025-06-18",
  "url": "<canonical_page_url>"
}
```

## Ownership
- Claim owner: `chung-hy-dai`
- Governance update cadence: every content release or at least monthly.
