import fs from 'node:fs/promises';
import path from 'node:path';
import {
  buildHreflangBlock,
  getLanguageForHtmlFile,
  localizeAbsolutePageUrl,
  localizedHtmlFileForLanguage,
  localizeStructuredDataForVietnamese,
  sourceHtmlFileForLocalizedFile,
  translateHtmlVisibleText,
  translateKeywordList,
  translatePlainText
} from './i18n-vi.mjs';

const DEFAULT_OG_IMAGE = './assets/social-preview-og-v8.jpg?fbrefresh=20260225v8';
const DEFAULT_SITE_DESCRIPTION =
  'Portfolio of Chung Hy Dai featuring market research, consumer insights, insight reporting, AI-assisted analysis, and applied analytics for business decisions.';
const DEFAULT_SITE_KEYWORDS = [
  'Chung Hy Dai',
  'market research portfolio',
  'applied analytics portfolio',
  'consumer insights',
  'research portfolio',
  'Vietnam'
];
const FEATURED_RESEARCH_IDS = [
  'hotel-segmentation',
  'hotel-prca',
  'ev-choice',
  'motorbike-phaseout',
  'virtual-influencers',
  'nutrition-diet'
];
const SUPPORT_CONTENT_NOINDEX_IDS = new Set(['hotel-value-framework']);
const TOPIC_HUBS = {
  hospitality: {
    id: 'hospitality',
    file: 'hospitality-analytics.html',
    name: 'Hospitality Analytics Research',
    summary: 'Hotel segmentation, attribute asymmetry, and service value frameworks.',
    description:
      'Hospitality analytics research by Chung Hy Dai covering hotel customer segmentation, attribute asymmetry, and value frameworks for service decision-making.',
    image: './assets/optimized/hotel-segmentation-fig1-optimized.webp',
    researchIds: ['hotel-segmentation', 'hotel-prca', 'hotel-value-framework']
  },
  policy: {
    id: 'policy',
    file: 'mobility-policy.html',
    name: 'Mobility and Policy Research',
    summary: 'EV choice trade-offs, transition design, and public acceptance of urban mobility policy.',
    description:
      'Mobility and policy research by Chung Hy Dai covering EV choice trade-offs and public acceptance of Hanoi transition policy.',
    image: './assets/optimized/ev-choice-experiment-optimized.webp',
    researchIds: ['ev-choice', 'motorbike-phaseout']
  },
  creator: {
    id: 'creator',
    file: 'creator-economy.html',
    name: 'Creator Economy Research',
    summary: 'UGC retention, influencer strategy, and virtual influencer trust pathways.',
    description:
      'Creator economy research by Chung Hy Dai covering influencer retention, engagement, brand transfer, and virtual influencer trust.',
    image: './assets/portfolio-creator-editorial.png',
    researchIds: ['influencer-strategy', 'virtual-influencers']
  },
  health: {
    id: 'health',
    file: 'health-behavior.html',
    name: 'Health and Behavior Research',
    summary: 'Nutrition knowledge, diet quality, and behavioral menu design.',
    description:
      'Health and behavior research by Chung Hy Dai covering nutrition, diet quality, and menu nudging in applied decision contexts.',
    image: './assets/portfolio-buffet-editorial.png',
    researchIds: ['buffet-nudging', 'nutrition-diet']
  },
  organizational: {
    id: 'organizational',
    file: 'organizational-behavior.html',
    name: 'Organizational Behavior Research',
    summary: 'Psychological ownership, co-creation, and participation design in institutional settings.',
    description:
      'Organizational behavior research by Chung Hy Dai covering psychological ownership, co-creation, and participation design in education and service settings.',
    image: './assets/optimized/psych-ownership-framework-optimized.webp',
    researchIds: ['psych-ownership', 'arts-workshop']
  }
};
const SPECIAL_PAGES = {
  'about.html': {
    type: 'about',
    title: 'About Chung Hy Dai | Education, Research Focus, and Evidence Standards',
    description:
      'About Chung Hy Dai, including education context, research focus, working method, and evidence standards.',
    image: './assets/optimized/profile-portfolio-main-optimized.webp'
  },
  'insights.html': {
    type: 'insights',
    title: 'Research Insights | EV Choice, Diet Quality, and Virtual Influencer Trust | Chung Hy Dai',
    description:
      'Short research insights by Chung Hy Dai covering EV choice in Vietnam, student diet quality, and virtual influencer trust.'
  },
  'references.html': {
    type: 'references',
    title: 'Verified References | Profiles, Publications, and Project Records | Chung Hy Dai',
    description:
      "Public profiles, publication records, and portfolio routes that help verify Chung Hy Dai's work.",
    image: './assets/portfolio-botanical-vase.png'
  },
  'hospitality-analytics.html': {
    type: 'hub',
    hubId: 'hospitality',
    title: 'Hospitality Analytics Research | Hotel Segmentation and Service Quality | Chung Hy Dai'
  },
  'mobility-policy.html': {
    type: 'hub',
    hubId: 'policy',
    title: 'Mobility and Policy Research | EV Choice and Hanoi Transition | Chung Hy Dai'
  },
  'creator-economy.html': {
    type: 'hub',
    hubId: 'creator',
    title: 'Creator Economy Research | Influencer Retention and Virtual Influencers | Chung Hy Dai'
  },
  'health-behavior.html': {
    type: 'hub',
    hubId: 'health',
    title: 'Health and Behavior Research | Nutrition and Menu Nudging | Chung Hy Dai'
  },
  'organizational-behavior.html': {
    type: 'hub',
    hubId: 'organizational',
    title: 'Organizational Behavior Research | Ownership and Co-creation | Chung Hy Dai'
  }
};

const readJson = async (filePath, fallback) => {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch {
    return fallback;
  }
};

const stripHtml = (value) =>
  String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const decodeHtmlEntities = (value) =>
  String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const clampText = (value, maxLength = 170) => {
  const clean = stripHtml(value);
  if (clean.length <= maxLength) return clean;
  const sliced = clean.slice(0, maxLength - 1).replace(/\s+\S*$/, '');
  return `${sliced.trim()}.`;
};

const normalizeUniqueStrings = (values) =>
  [...new Set((Array.isArray(values) ? values : []).map((value) => stripHtml(value)).filter(Boolean))];

const normalizePublicUrls = (values) =>
  normalizeUniqueStrings(values).filter((value) => /^https?:\/\//i.test(value));

const joinSentences = (...parts) =>
  parts
    .map((part) => stripHtml(part))
    .filter(Boolean)
    .map((part) => part.replace(/[.:\s]+$/g, ''))
    .join('. ')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\.+$/g, '')
    .concat(parts.some((part) => stripHtml(part)) ? '.' : '');

const normalizeSummaryPrefix = (summary) =>
  stripHtml(summary).replace(
    /^\s*(?:Reported(?:\s*\(self-reported\))?|Derived interpretation|Conceptual framework)\s*:\s*/i,
    ''
  ).trim();

const buildTag = (name, attrs, selfClosing = true) => {
  const serialized = Object.entries(attrs)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
    .join(' ');
  return selfClosing ? `<${name} ${serialized}/>` : `<${name} ${serialized}>`;
};

const buildProfileMeLinks = (siteConfig) => {
  const profileUrls = normalizePublicUrls(siteConfig?.same_as);
  if (!profileUrls.length) return '';

  return [
    '<!-- SEO-GENERATED:profile-me-links:START -->',
    ...profileUrls.map((url) => buildTag('link', { href: url, rel: 'me' })),
    '<!-- SEO-GENERATED:profile-me-links:END -->'
  ].join('\n');
};

const insertBeforeClosingTag = (html, tagName, content) => {
  const pattern = new RegExp(`</${tagName}>`, 'i');
  if (!pattern.test(html)) return html;
  return html.replace(pattern, `${content}\n</${tagName}>`);
};

const upsertTitleTag = (html, title) => {
  const next = `<title>${escapeHtml(title)}</title>`;
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(/<title>[\s\S]*?<\/title>/i, next);
  }
  return insertBeforeClosingTag(html, 'head', next);
};

const upsertMetaTag = (html, selectorAttr, selectorValue, attrs) => {
  const escapedSelector = selectorValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `<meta\\b[^>]*\\b${selectorAttr}\\s*=\\s*["']${escapedSelector}["'][^>]*>`,
    'i'
  );
  const next = buildTag('meta', { ...attrs, [selectorAttr]: selectorValue });
  if (pattern.test(html)) {
    return html.replace(pattern, next);
  }
  return insertBeforeClosingTag(html, 'head', next);
};

const stripMetaTag = (html, selectorAttr, selectorValue) => {
  const escapedSelector = selectorValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `\\s*<meta\\b[^>]*\\b${selectorAttr}\\s*=\\s*["']${escapedSelector}["'][^>]*>`,
    'gi'
  );
  return html.replace(pattern, '');
};

const upsertLinkTag = (html, rel, attrs) => {
  const escapedRel = rel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `<link\\b[^>]*\\brel\\s*=\\s*["']${escapedRel}["'][^>]*>`,
    'i'
  );
  const next = buildTag('link', { ...attrs, rel });
  if (pattern.test(html)) {
    return html.replace(pattern, next);
  }
  return insertBeforeClosingTag(html, 'head', next);
};

const stripJsonLd = (html) =>
  html.replace(/\s*<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '');

const stripGeneratedBlock = (html, key) => {
  const pattern = new RegExp(
    `\\s*<!-- SEO-GENERATED:${key}:START -->[\\s\\S]*?<!-- SEO-GENERATED:${key}:END -->`,
    'gi'
  );
  return html.replace(pattern, '');
};

const insertAfterOpeningMain = (html, content) =>
  html.replace(/<main\b[^>]*>/i, (match) => `${match}\n${content}`);

const withHtml = (slug) => (slug.endsWith('.html') ? slug : `${slug}.html`);

const resolveWithinSite = (siteUrl, value = '') => {
  const normalized = String(value || '').replace(/^\/+/, '');
  return new URL(normalized, siteUrl).href;
};

const absolutePageUrlForFile = (siteUrl, htmlFileName) => {
  const normalized = String(htmlFileName || '').replace(/\\/g, '/').replace(/^\/+/, '');
  const isIndex = path.posix.basename(normalized).toLowerCase() === 'index.html';
  if (!isIndex) return resolveWithinSite(siteUrl, normalized);
  const dir = path.posix.dirname(normalized);
  return dir === '.' ? new URL(siteUrl).href : resolveWithinSite(siteUrl, `${dir}/`);
};

const findMetaContent = (html, selectorAttr, selectorValue) => {
  const escapedSelector = selectorValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `<meta\\b[^>]*\\b${selectorAttr}\\s*=\\s*["']${escapedSelector}["'][^>]*>`,
    'i'
  );
  const tag = html.match(pattern)?.[0] || '';
  return decodeHtmlEntities(tag.match(/\bcontent\s*=\s*["']([^"']+)["']/i)?.[1] || '');
};

const extractCanonicalHref = (html) => {
  const tag = html.match(/<link\b[^>]*\brel\s*=\s*["']canonical["'][^>]*>/i)?.[0];
  if (!tag) return '';
  return tag.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1] || '';
};

const extractTitleText = (html) =>
  decodeHtmlEntities(stripHtml(html.match(/<title>([^<]+)<\/title>/i)?.[1] || ''));

const extractMetaDescription = (html) => stripHtml(findMetaContent(html, 'name', 'description'));

const normalizeStudyTypeLabel = (studyType) => {
  switch ((studyType || '').trim().toLowerCase()) {
  case 'hospitality':
    return 'Hospitality Analytics Research';
  case 'policy':
    return 'Mobility and Policy Research';
  case 'creator':
    return 'Creator Economy Research';
  case 'health':
    return 'Health and Behavior Research';
  case 'organizational':
    return 'Organizational Behavior Research';
  default:
    return 'Applied Research';
  }
};

const getTopicHubByStudyType = (studyType) =>
  TOPIC_HUBS[String(studyType || '').trim().toLowerCase()] || null;

const getHubEntries = (hub, researchEntries) => {
  if (!hub) return [];
  return hub.researchIds
    .map((id) => researchEntries.find((entry) => entry?.id === id))
    .filter(Boolean);
};

const getSpecialPageConfig = (htmlFile) => {
  const sourceHtmlFile = sourceHtmlFileForLocalizedFile(htmlFile);
  const config = SPECIAL_PAGES[sourceHtmlFile];
  if (!config) return null;
  if (config.type !== 'hub') return config;

  const hub = TOPIC_HUBS[config.hubId];
  if (!hub) return null;

  return {
    ...config,
    hub,
    description: hub.description,
    image: hub.image
  };
};

const resolveAbsoluteUrl = (value, siteUrl, legacyHosts) => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (/^data:/i.test(raw)) return raw;

  const site = new URL(siteUrl);
  try {
    if (/^https?:\/\//i.test(raw)) {
      const parsed = new URL(raw);
      if (legacyHosts.has(parsed.hostname.toLowerCase())) {
        return resolveWithinSite(site.href, `${parsed.pathname}${parsed.search}${parsed.hash}`);
      }
      return parsed.href;
    }

    if (/^\/\//.test(raw)) {
      return `https:${raw}`;
    }

    return resolveWithinSite(site.href, raw);
  } catch {
    return '';
  }
};

const normalizeSiteConfig = (siteConfig) => {
  const owner = siteConfig?.owner || {};
  const ownerName = stripHtml(owner.name || 'Chung Hy Dai') || 'Chung Hy Dai';
  const ownerAlternateNames = normalizeUniqueStrings(owner.alternate_names).filter((value) => value !== ownerName);
  const ownerKnowsAbout = normalizeUniqueStrings(owner.knows_about);
  const ownerJobTitle =
    stripHtml(owner.job_title || siteConfig?.site_tagline || 'Market Research and Consumer Insights Analyst') ||
    'Market Research and Consumer Insights Analyst';
  const siteKeywords = Array.isArray(siteConfig?.site_keywords)
    ? siteConfig.site_keywords
        .map((value) => stripHtml(value))
        .filter(Boolean)
    : [];
  return {
    site_name: stripHtml(siteConfig?.site_name || ownerName) || ownerName,
    site_alternate_name:
      stripHtml(siteConfig?.site_alternate_name || `${ownerName} Portfolio`) || `${ownerName} Portfolio`,
    site_tagline:
      stripHtml(siteConfig?.site_tagline || 'Market Research, Consumer Insights & Applied Analytics Portfolio') ||
      'Market Research, Consumer Insights & Applied Analytics Portfolio',
    site_keywords: normalizeUniqueStrings([...DEFAULT_SITE_KEYWORDS, ...siteKeywords]),
    site_url: stripHtml(siteConfig?.site_url || ''),
    canonical_base: stripHtml(siteConfig?.canonical_base || ''),
    site_description:
      clampText(siteConfig?.site_description || DEFAULT_SITE_DESCRIPTION, 190) || DEFAULT_SITE_DESCRIPTION,
    feed_title:
      stripHtml(siteConfig?.feed_title || `${ownerName} Insights`) || `${ownerName} Insights`,
    feed_description:
      clampText(
        siteConfig?.feed_description ||
          `Short research insights from the portfolio of ${ownerName}.`,
        180
      ) || `Short research insights from the portfolio of ${ownerName}.`,
    default_og_image: stripHtml(siteConfig?.default_og_image || DEFAULT_OG_IMAGE) || DEFAULT_OG_IMAGE,
    last_updated: stripHtml(siteConfig?.last_updated || ''),
    same_as: normalizePublicUrls(siteConfig?.same_as),
    analytics: {
      provider: stripHtml(siteConfig?.analytics?.provider || ''),
      plausible_domain: stripHtml(siteConfig?.analytics?.plausible_domain || ''),
      plausible_script_url: stripHtml(siteConfig?.analytics?.plausible_script_url || ''),
      google_measurement_id: stripHtml(siteConfig?.analytics?.google_measurement_id || '')
    },
    owner: {
      name: ownerName,
      job_title: ownerJobTitle,
      email: stripHtml(owner.email || ''),
      location: stripHtml(owner.location || 'Ho Chi Minh City, Vietnam'),
      alternate_names: ownerAlternateNames,
      knows_about: ownerKnowsAbout
    }
  };
};

const buildKeywords = (entry) => {
  const values = [
    'Market research',
    'Consumer insights',
    'Applied analytics',
    normalizeStudyTypeLabel(entry?.study_type || ''),
    stripHtml(entry?.title || ''),
    stripHtml(entry?.model || '')
  ];
  return [...new Set(values.filter(Boolean))].join(', ');
};

const buildMetaKeywords = ({ htmlFile, siteConfig, researchEntry, specialPage, topicHub }) => {
  const keywords = new Set();

  const add = (...values) => {
    values.flat().forEach((value) => {
      const cleaned = stripHtml(value);
      if (cleaned) keywords.add(cleaned);
    });
  };

  if (htmlFile === 'index.html') {
    add(
      'market research portfolio',
      'consumer insights portfolio',
      'insight reporting',
      'research reporting',
      'AI-assisted analysis',
      'applied analytics',
      'business evidence',
      'data storytelling',
      'survey analysis',
      'text analytics',
      'Swinburne Vietnam'
    );
  } else if (htmlFile === 'projects.html') {
    add(
      'projects archive',
      'market research projects',
      'applied analytics projects',
      'hospitality segmentation',
      'EV choice',
      'policy acceptance',
      'influencer retention',
      'nutrition',
      'organizational behavior'
    );
  } else if (specialPage?.type === 'about') {
    add(
      'about Chung Hy Dai',
      'research methodology',
      'evidence standards',
      'education context'
    );
  } else if (specialPage?.type === 'insights') {
    add(
      'research insights',
      'EV choice insight',
      'student diet quality insight',
      'virtual influencer trust insight'
    );
  } else if (specialPage?.type === 'references') {
    add(
      'verified references',
      'public profiles',
      'publication records',
      'portfolio routes',
      'ORCID',
      'LinkedIn'
    );
  } else if (specialPage?.type === 'hub' && specialPage.hub) {
    const hubKeywordsById = {
      hospitality: [
        'hotel segmentation',
        'hotel attribute asymmetry',
        'service value frameworks',
        'Da Nang'
      ],
      policy: ['EV choice', 'motorbike phase-out', 'mobility policy', 'Hanoi'],
      creator: ['influencer retention', 'virtual influencers', 'UGC', 'brand transfer'],
      health: ['nutrition', 'diet quality', 'menu nudging', 'behavior change'],
      organizational: ['psychological ownership', 'co-creation', 'participation design', 'university context']
    };
    add(specialPage.hub.name, specialPage.hub.summary, hubKeywordsById[specialPage.hub.id] || []);
  } else if (researchEntry) {
    add(
      stripHtml(researchEntry.title || ''),
      normalizeStudyTypeLabel(researchEntry.study_type || ''),
      topicHub?.name || '',
      'research',
      'portfolio'
    );
  }

  add(
    siteConfig?.site_name,
    siteConfig?.site_alternate_name,
    siteConfig?.site_tagline,
    ...(Array.isArray(siteConfig?.site_keywords) ? siteConfig.site_keywords : []),
    'market research',
    'applied analytics'
  );

  return [...keywords]
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 24)
    .join(', ');
};

const buildPersonEntity = (siteUrl, siteConfig, imageUrl) => {
  const alternateNames = normalizeUniqueStrings([
    ...(siteConfig.owner.alternate_names || []),
    'Dai Chung Hy'
  ]).filter((value) => value !== siteConfig.owner.name);
  const knowsAbout = siteConfig.owner.knows_about.length
    ? siteConfig.owner.knows_about
    : [
      'Market research',
      'Consumer insights',
      'Applied analytics',
      'Survey design',
      'Experimental design',
      'Segmentation',
      'Choice modeling',
      'Behavioral research'
    ];
  const identifier = siteConfig.same_as.find((value) => /orcid\.org/i.test(value));

  return {
    '@type': 'Person',
    '@id': `${siteUrl}#person`,
    name: siteConfig.owner.name,
    ...(alternateNames.length ? { alternateName: alternateNames } : {}),
    url: siteUrl,
    jobTitle: siteConfig.owner.job_title,
    description: siteConfig.site_description,
    image: imageUrl,
    sameAs: siteConfig.same_as,
    ...(identifier ? { identifier } : {}),
    ...(knowsAbout.length ? { knowsAbout } : {}),
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Swinburne University of Technology'
    },
    knowsLanguage: ['Vietnamese', 'English'],
    ...(siteConfig.owner.email ? { email: siteConfig.owner.email } : {}),
    ...(siteConfig.owner.location
      ? {
        address: {
          '@type': 'PostalAddress',
          addressLocality: siteConfig.owner.location,
          addressCountry: 'VN'
        }
      }
      : {})
  };
};

const buildSharedEntityGraph = (siteUrl, siteConfig, imageUrl) => [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,
    url: siteUrl,
    name: siteConfig.site_name,
    alternateName: siteConfig.site_alternate_name,
    description: siteConfig.site_description,
    inLanguage: 'en'
  },
  {
    '@context': 'https://schema.org',
    ...buildPersonEntity(siteUrl, siteConfig, imageUrl)
  }
];

const buildCoreRoutePages = (siteUrl) => [
  {
    '@type': 'CollectionPage',
    url: absolutePageUrlForFile(siteUrl, 'projects.html'),
    name: 'Market Research and Applied Analytics Projects'
  },
  {
    '@type': 'CollectionPage',
    url: absolutePageUrlForFile(siteUrl, 'insights.html'),
    name: 'Research Insights'
  },
  ...Object.values(TOPIC_HUBS).map((hub) => ({
    '@type': 'CollectionPage',
    url: absolutePageUrlForFile(siteUrl, hub.file),
    name: hub.name
  }))
];

const normalizeNoteEntry = (entry) => {
  if (!entry || !entry.slug) return null;
  return {
    ...entry,
    id: stripHtml(entry.id || entry.slug),
    slug: stripHtml(entry.slug),
    title: stripHtml(entry.title || entry.slug),
    summary: clampText(entry.summary || entry.description || entry.title || '', 180),
    description: clampText(entry.description || entry.summary || entry.title || '', 180),
    image: stripHtml(entry.image || ''),
    hub_id: stripHtml(entry.hub_id || ''),
    keywords: normalizeUniqueStrings(entry.keywords || []),
    related_research_ids: normalizeUniqueStrings(entry.related_research_ids || []),
    published_at: stripHtml(entry.published_at || ''),
    modified_at: stripHtml(entry.modified_at || entry.published_at || '')
  };
};

const findRelatedResearchEntriesByIds = (ids, researchEntries) =>
  normalizeUniqueStrings(ids)
    .map((id) => researchEntries.find((entry) => entry?.id === id))
    .filter(Boolean);

const buildNoteKeywords = (noteEntry, topicHub, researchEntries, siteConfig) => {
  const relatedTitles = researchEntries.map((entry) => stripHtml(entry.title || ''));
  return normalizeUniqueStrings([
    noteEntry.title,
    noteEntry.summary,
    ...(noteEntry.keywords || []),
    topicHub?.name || '',
    ...relatedTitles,
    siteConfig.site_name,
    siteConfig.site_alternate_name,
    siteConfig.owner.job_title,
    'research insights'
  ]).join(', ');
};

const pickNoteImage = (noteEntry, siteUrl, siteConfig, legacyHosts) => {
  if (noteEntry?.image) {
    return resolveAbsoluteUrl(noteEntry.image, siteUrl, legacyHosts);
  }
  return resolveAbsoluteUrl(siteConfig.default_og_image, siteUrl, legacyHosts);
};

const buildBreadcrumbList = (pageUrl, items) => ({
  '@type': 'BreadcrumbList',
  '@id': `${pageUrl}#breadcrumb`,
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    ...(item.url ? { item: item.url } : {})
  }))
});

const isLikelyVerifiedPublication = (entry) => {
  if (!entry || String(entry.verification_status || '').toLowerCase() !== 'verified') return false;
  const sourceText = (Array.isArray(entry.source_links) ? entry.source_links : [])
    .map((item) => `${item.label || ''} ${item.url || ''}`)
    .join(' ')
    .toLowerCase();
  return /doi\.org|springer|conference|proceedings|chapter|journal/.test(sourceText);
};

const extractIdentifier = (entry) => {
  const sourceLinks = Array.isArray(entry?.source_links) ? entry.source_links : [];
  for (const link of sourceLinks) {
    const raw = `${link.url || ''} ${link.label || ''}`;
    const match = raw.match(/10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i);
    if (match) return match[0];
  }
  return '';
};

const extractDatePublished = (entry) => {
  const candidates = [
    entry?.publication_date,
    ...(Array.isArray(entry?.key_metrics) ? entry.key_metrics.map((item) => item?.value || '') : []),
    ...(Array.isArray(entry?.source_links)
      ? entry.source_links.map((item) => `${item?.label || ''} ${item?.url || ''}`)
      : [])
  ]
    .map((value) => stripHtml(value))
    .filter(Boolean);

  for (const candidate of candidates) {
    const isoMatch = candidate.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
    if (isoMatch) return isoMatch[0];

    const textMatch = candidate.match(
      /\b((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*)\s+(\d{1,2}),\s+(\d{4})\b/i
    );
    if (!textMatch) continue;

    const monthLookup = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11
    };
    const month = monthLookup[textMatch[2].slice(0, 3).toLowerCase()];
    if (month === undefined) continue;
    const year = Number(textMatch[4]);
    const day = Number(textMatch[3]);
    const parsed = new Date(Date.UTC(year, month, day));
    if (Number.isNaN(parsed.valueOf())) continue;
    return parsed.toISOString().slice(0, 10);
  }

  return '';
};

const normalizeIsoDateTime = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.valueOf())) return '';
  return parsed.toISOString();
};

const deriveResearchDescription = (entry) => {
  if (!entry) return '';
  if (entry.deprecated && entry.redirect_to) {
    return clampText(
      `Legacy alias page for ${stripHtml(entry.title)}. Search engines should use the canonical research page instead.`,
      170
    );
  }

  const summary = normalizeSummaryPrefix(entry.card_summary || entry.title || '');
  const sample = stripHtml(entry.sample || '');
  const model = stripHtml(entry.model || '');
  return clampText(joinSentences(summary, sample && !/deprecated alias/i.test(sample) ? sample : model), 175);
};

const pickResearchImage = (entry, siteUrl, siteConfig, legacyHosts) => {
  const source = stripHtml(entry?.card_image || '');
  if (source && !/^https?:\/\//i.test(source)) {
    return resolveAbsoluteUrl(source, siteUrl, legacyHosts);
  }
  return resolveAbsoluteUrl(siteConfig.default_og_image, siteUrl, legacyHosts);
};

const buildHomeStructuredData = ({
  siteUrl,
  siteConfig,
  description,
  imageUrl,
  personImageUrl,
  researchEntries
}) => {
  const featuredEntries = FEATURED_RESEARCH_IDS.slice(0, 3).map((id) =>
    researchEntries.find((entry) => entry?.id === id)
  ).filter(Boolean);
  const routePages = buildCoreRoutePages(siteUrl);
  return [
    ...buildSharedEntityGraph(siteUrl, siteConfig, personImageUrl || imageUrl),
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${siteUrl}#webpage`,
      url: siteUrl,
      name: `${siteConfig.site_name} Portfolio`,
      isPartOf: { '@id': `${siteUrl}#website` },
      about: { '@id': `${siteUrl}#person` },
      mainEntity: { '@id': `${siteUrl}#person` },
      description,
      primaryImageOfPage: imageUrl,
      ...(siteConfig.last_updated ? { dateModified: siteConfig.last_updated } : {}),
      hasPart: routePages
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${siteUrl}#selected-work`,
      name: 'Applied Projects',
      description: 'Full project rail highlighted on the homepage.',
      itemListElement: featuredEntries.map((entry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: absolutePageUrlForFile(siteUrl, withHtml(entry.slug)),
        name: stripHtml(entry.title || entry.slug)
      }))
    }
  ];
};

const buildAboutStructuredData = ({ siteUrl, pageUrl, siteConfig, description, imageUrl, researchEntries }) => {
  const focusAreas = Object.values(TOPIC_HUBS);
  const routePages = buildCoreRoutePages(siteUrl).filter((item) => item.url !== pageUrl);
  const featuredEntries = FEATURED_RESEARCH_IDS.slice(0, 3)
    .map((id) => researchEntries.find((entry) => entry?.id === id))
    .filter(Boolean)
    .map((entry) => ({
      '@type': 'CreativeWork',
      url: absolutePageUrlForFile(siteUrl, withHtml(entry.slug)),
      name: stripHtml(entry.title || entry.slug)
    }));
  return [
    ...buildSharedEntityGraph(siteUrl, siteConfig, imageUrl),
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: 'About Chung Hy Dai',
      description,
      isPartOf: { '@id': `${siteUrl}#website` },
      about: { '@id': `${siteUrl}#person` },
      mainEntity: { '@id': `${siteUrl}#person` },
      primaryImageOfPage: imageUrl,
      ...(siteConfig.last_updated ? { dateModified: siteConfig.last_updated } : {})
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${pageUrl}#profile-page`,
      url: pageUrl,
      name: 'About Chung Hy Dai',
      description,
      isPartOf: { '@id': `${siteUrl}#website` },
      about: { '@id': `${siteUrl}#person` },
      mainEntity: { '@id': `${siteUrl}#person` },
      primaryImageOfPage: imageUrl,
      ...(siteConfig.last_updated ? { dateModified: siteConfig.last_updated } : {}),
      hasPart: [...featuredEntries, ...routePages]
    },
    {
      '@context': 'https://schema.org',
      ...buildBreadcrumbList(pageUrl, [
        { name: 'Home', url: siteUrl },
        { name: 'About', url: pageUrl }
      ])
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${pageUrl}#focus-areas`,
      name: 'Research Focus Areas',
      itemListElement: focusAreas.map((hub, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: absolutePageUrlForFile(siteUrl, hub.file),
        name: hub.name
      }))
    }
  ];
};

const buildHubStructuredData = ({ siteUrl, pageUrl, siteConfig, description, hub, researchEntries }) => {
  const hubEntries = getHubEntries(hub, researchEntries);
  return [
    ...buildSharedEntityGraph(
      siteUrl,
      siteConfig,
      absolutePageUrlForFile(siteUrl, 'assets/optimized/profile-portfolio-main-optimized.webp')
    ),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: hub.name,
      description,
      isPartOf: { '@id': `${siteUrl}#website` },
      about: { '@id': `${siteUrl}#person` },
      ...(siteConfig.last_updated ? { dateModified: siteConfig.last_updated } : {})
    },
    {
      '@context': 'https://schema.org',
      ...buildBreadcrumbList(pageUrl, [
        { name: 'Home', url: siteUrl },
        { name: 'Projects', url: absolutePageUrlForFile(siteUrl, 'projects.html') },
        { name: hub.name, url: pageUrl }
      ])
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${pageUrl}#itemlist`,
      name: hub.name,
      itemListElement: hubEntries.map((entry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: absolutePageUrlForFile(siteUrl, withHtml(entry.slug)),
        name: stripHtml(entry.title || entry.slug)
      }))
    }
  ];
};

const buildProjectsStructuredData = ({ siteUrl, pageUrl, siteConfig, description, researchEntries }) => {
  const listedEntries = researchEntries.filter((entry) => !entry?.deprecated);
  const routePages = buildCoreRoutePages(siteUrl).filter((item) => item.url !== pageUrl);
  return [
    ...buildSharedEntityGraph(
      siteUrl,
      siteConfig,
      absolutePageUrlForFile(siteUrl, 'assets/optimized/profile-portfolio-main-optimized.webp')
    ),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: 'Market Research & Applied Analytics Projects',
      description,
      isPartOf: { '@id': `${siteUrl}#website` },
      about: { '@id': `${siteUrl}#person` },
      ...(siteConfig.last_updated ? { dateModified: siteConfig.last_updated } : {}),
      hasPart: routePages
    },
    {
      '@context': 'https://schema.org',
      ...buildBreadcrumbList(pageUrl, [
        { name: 'Home', url: siteUrl },
        { name: 'Projects', url: pageUrl }
      ])
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${pageUrl}#itemlist`,
      itemListElement: listedEntries.map((entry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: absolutePageUrlForFile(siteUrl, withHtml(entry.slug)),
        name: stripHtml(entry.title || entry.slug)
      }))
    }
  ];
};

const buildInsightsStructuredData = ({ siteUrl, pageUrl, siteConfig, description, notesEntries }) => {
  const listedEntries = notesEntries.map((entry, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: absolutePageUrlForFile(siteUrl, withHtml(entry.slug)),
    name: stripHtml(entry.title || entry.slug)
  }));

  return [
    ...buildSharedEntityGraph(
      siteUrl,
      siteConfig,
      absolutePageUrlForFile(siteUrl, 'assets/optimized/profile-portfolio-main-optimized.webp')
    ),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: 'Research Insights',
      description,
      isPartOf: { '@id': `${siteUrl}#website` },
      about: { '@id': `${siteUrl}#person` },
      ...(siteConfig.last_updated ? { dateModified: siteConfig.last_updated } : {})
    },
    {
      '@context': 'https://schema.org',
      ...buildBreadcrumbList(pageUrl, [
        { name: 'Home', url: siteUrl },
        { name: 'Insights', url: pageUrl }
      ])
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${pageUrl}#itemlist`,
      itemListElement: listedEntries
    }
  ];
};

const buildReferencesStructuredData = ({ siteUrl, pageUrl, siteConfig, description, imageUrl }) => {
  const referenceLinks = [
    ['GitHub profile', 'https://github.com/daichunghy-ben'],
    ['LinkedIn profile', 'https://www.linkedin.com/in/chung-hy-d-17792826b/'],
    ['ORCID record', 'https://orcid.org/0009-0009-6790-8981'],
    [
      'Swinburne Vietnam feature',
      'https://swinburne-vn.edu.vn/news/dai-chung-hy-nha-nghien-cuu-tre-voi-loat-thanh-tich-an-tuong-tai-swinburne-vietnam/'
    ],
    ['Projects archive', absolutePageUrlForFile(siteUrl, 'projects.html')]
  ];

  return [
    ...buildSharedEntityGraph(siteUrl, siteConfig, imageUrl),
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: 'Verified References',
      description,
      isPartOf: { '@id': `${siteUrl}#website` },
      about: { '@id': `${siteUrl}#person` },
      mainEntity: { '@id': `${siteUrl}#person` },
      primaryImageOfPage: imageUrl,
      ...(siteConfig.last_updated ? { dateModified: siteConfig.last_updated } : {})
    },
    {
      '@context': 'https://schema.org',
      ...buildBreadcrumbList(pageUrl, [
        { name: 'Home', url: siteUrl },
        { name: 'References', url: pageUrl }
      ])
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${pageUrl}#reference-links`,
      name: 'Public profile and reference links',
      itemListElement: referenceLinks.map(([name, url], index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url,
        name
      }))
    }
  ];
};

const buildNoteStructuredData = ({
  siteUrl,
  pageUrl,
  canonicalUrl,
  siteConfig,
  noteEntry,
  description,
  imageUrl,
  topicHub,
  relatedResearchEntries
}) => {
  const keywords = buildNoteKeywords(noteEntry, topicHub, relatedResearchEntries, siteConfig);
  const published = normalizeIsoDateTime(noteEntry.published_at);
  const modified = normalizeIsoDateTime(noteEntry.modified_at || noteEntry.published_at);

  return [
    ...buildSharedEntityGraph(
      siteUrl,
      siteConfig,
      absolutePageUrlForFile(siteUrl, 'assets/optimized/profile-portfolio-main-optimized.webp')
    ),
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${canonicalUrl}#main`,
      url: canonicalUrl,
      mainEntityOfPage: canonicalUrl,
      headline: noteEntry.title,
      name: noteEntry.title,
      description,
      image: imageUrl,
      author: { '@id': `${siteUrl}#person` },
      creator: { '@id': `${siteUrl}#person` },
      publisher: { '@id': `${siteUrl}#website` },
      isPartOf: { '@id': `${siteUrl}#website` },
      articleSection: topicHub?.name || 'Research Insights',
      keywords,
      ...(published ? { datePublished: published } : {}),
      ...(modified ? { dateModified: modified } : {})
    },
    {
      '@context': 'https://schema.org',
      ...buildBreadcrumbList(pageUrl, [
        { name: 'Home', url: siteUrl },
        { name: 'Insights', url: absolutePageUrlForFile(siteUrl, 'insights.html') },
        ...(topicHub
          ? [{ name: topicHub.name, url: absolutePageUrlForFile(siteUrl, topicHub.file) }]
          : []),
        { name: noteEntry.title, url: canonicalUrl }
      ])
    }
  ];
};

const buildResearchStructuredData = ({
  siteUrl,
  pageUrl,
  canonicalUrl,
  siteConfig,
  entry,
  description,
  imageUrl,
  topicHub
}) => {
  const breadcrumbItems = [
    { name: 'Home', url: siteUrl },
    { name: 'Projects', url: absolutePageUrlForFile(siteUrl, 'projects.html') },
    ...(topicHub
      ? [{
        name: topicHub.name,
        url: absolutePageUrlForFile(siteUrl, topicHub.file)
      }]
      : []),
    { name: stripHtml(entry.title || 'Research Detail'), url: canonicalUrl }
  ];

  if (entry?.deprecated) {
    return [
      ...buildSharedEntityGraph(
        siteUrl,
        siteConfig,
        absolutePageUrlForFile(siteUrl, 'assets/optimized/profile-portfolio-main-optimized.webp')
      ),
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: stripHtml(entry.title || 'Legacy Research Alias'),
        description,
        isPartOf: { '@id': `${siteUrl}#website` },
        about: { '@id': `${siteUrl}#person` }
      },
      {
        '@context': 'https://schema.org',
        ...buildBreadcrumbList(pageUrl, breadcrumbItems)
      }
    ];
  }

  const scholarly = isLikelyVerifiedPublication(entry);
  const identifier = scholarly ? extractIdentifier(entry) : '';
  const datePublished = extractDatePublished(entry);
  const externalCitations = (Array.isArray(entry.source_links) ? entry.source_links : [])
    .map((item) => item.url)
    .filter((value) => /^https?:\/\//i.test(value));

  return [
    ...buildSharedEntityGraph(
      siteUrl,
      siteConfig,
      absolutePageUrlForFile(siteUrl, 'assets/optimized/profile-portfolio-main-optimized.webp')
    ),
    {
      '@context': 'https://schema.org',
      '@type': scholarly ? 'ScholarlyArticle' : 'CreativeWork',
      '@id': `${canonicalUrl}#main`,
      url: canonicalUrl,
      mainEntityOfPage: canonicalUrl,
      headline: stripHtml(entry.title || ''),
      name: stripHtml(entry.title || ''),
      description,
      image: imageUrl,
      author: { '@id': `${siteUrl}#person` },
      creator: { '@id': `${siteUrl}#person` },
      isPartOf: { '@id': `${siteUrl}#website` },
      about: normalizeStudyTypeLabel(entry.study_type),
      keywords: buildKeywords(entry),
      ...(datePublished ? { datePublished } : {}),
      ...(entry.last_verified_at ? { dateModified: entry.last_verified_at } : {}),
      ...(identifier ? { identifier } : {}),
      ...(externalCitations.length ? { citation: externalCitations } : {})
    },
    {
      '@context': 'https://schema.org',
      ...buildBreadcrumbList(pageUrl, breadcrumbItems)
    }
  ];
};

const buildBreadcrumbNav = (items) => {
  const listItems = items
    .map((item, index) => {
      const content = item.href
        ? `<a href="${escapeHtml(item.href)}">${escapeHtml(item.name)}</a>`
        : `<span aria-current="page">${escapeHtml(item.name)}</span>`;
      return `<li>${index === items.length - 1 ? content : content}</li>`;
    })
    .join('');

  return `<!-- SEO-GENERATED:breadcrumbs:START -->
<nav class="seo-breadcrumbs" aria-label="Breadcrumb">
  <ol>${listItems}</ol>
</nav>
<!-- SEO-GENERATED:breadcrumbs:END -->`;
};

const dedupeRelatedEntries = (entries) => {
  const seen = new Set();
  return entries.filter((entry) => {
    if (!entry?.slug || seen.has(entry.slug)) return false;
    seen.add(entry.slug);
    return true;
  });
};

const pickRelatedEntries = (entry, researchEntries) => {
  if (!entry || entry.deprecated) return [];
  const sameType = researchEntries.filter(
    (candidate) =>
      candidate &&
      !candidate.deprecated &&
      candidate.slug !== entry.slug &&
      candidate.study_type === entry.study_type
  );
  const featured = FEATURED_RESEARCH_IDS
    .map((id) => researchEntries.find((candidate) => candidate?.id === id))
    .filter(Boolean)
    .filter((candidate) => candidate.slug !== entry.slug && !candidate.deprecated);

  return dedupeRelatedEntries([...sameType, ...featured]).slice(0, 3);
};

const buildRelatedLinksSection = (entry, relatedEntries, topicHub) => {
  if (!entry || !relatedEntries.length) return '';

  const items = relatedEntries
    .map((relatedEntry) => {
      const summary = clampText(normalizeSummaryPrefix(relatedEntry.card_summary || ''), 130);
      return `<li class="seo-related-links__item">
  <a class="seo-related-links__link" href="${escapeHtml(withHtml(relatedEntry.slug))}">
    <span class="seo-related-links__name">${escapeHtml(stripHtml(relatedEntry.title || relatedEntry.slug))}</span>
    <span class="seo-related-links__summary">${escapeHtml(summary)}</span>
  </a>
</li>`;
    })
    .join('\n');
  const hubLink = topicHub
    ? `<a class="seo-related-links__hub-link" href="${escapeHtml(topicHub.file)}">Browse the ${escapeHtml(topicHub.name)} topic page</a>`
    : '';

  return `<!-- SEO-GENERATED:related-links:START -->
<section class="section seo-related-links" aria-labelledby="seo-related-links-heading">
  <div class="section-container">
    <div class="seo-related-links__panel">
      <p class="seo-related-links__kicker">Related Research</p>
      <h2 class="seo-related-links__title" id="seo-related-links-heading">Explore adjacent research paths</h2>
      <p class="seo-related-links__intro">Use these links to move between connected studies instead of landing on a single isolated case page.</p>
      ${hubLink}
      <ul class="seo-related-links__list">
${items}
      </ul>
    </div>
  </div>
</section>
<!-- SEO-GENERATED:related-links:END -->`;
};

export function deriveGitHubPagesSiteUrl(env = process.env) {
  const repository = String(env.GITHUB_REPOSITORY || '').trim();
  const owner = String(env.GITHUB_REPOSITORY_OWNER || repository.split('/')[0] || '').trim();
  const repoName = String(repository.split('/')[1] || env.GITHUB_REPOSITORY_NAME || '').trim();

  if (!owner || !repoName) return '';
  if (repoName.toLowerCase() === `${owner.toLowerCase()}.github.io`) {
    return `https://${owner}.github.io/`;
  }
  return `https://${owner}.github.io/${repoName}/`;
}

export async function loadSeoData(root) {
  const siteConfig = normalizeSiteConfig(
    await readJson(path.join(root, 'assets', 'data', 'site-config.json'), {})
  );
  const manifest = await readJson(path.join(root, 'assets', 'data', 'research-manifest.json'), { research: [] });
  const notesManifest = await readJson(path.join(root, 'assets', 'data', 'notes-manifest.json'), { notes: [] });
  const researchEntries = Array.isArray(manifest?.research) ? manifest.research : [];
  const notesEntries = Array.isArray(notesManifest?.notes)
    ? notesManifest.notes.map((entry) => normalizeNoteEntry(entry)).filter(Boolean)
    : [];
  const researchBySlug = new Map();
  const notesBySlug = new Map();
  researchEntries.forEach((entry) => {
    if (entry?.slug) researchBySlug.set(entry.slug, entry);
  });
  notesEntries.forEach((entry) => {
    if (entry?.slug) notesBySlug.set(entry.slug, entry);
  });
  return { siteConfig, researchEntries, researchBySlug, notesEntries, notesBySlug };
}

export function applyPageSeo({ htmlFile, html, siteUrl, legacyHosts, seoData }) {
  const { siteConfig, researchEntries, researchBySlug, notesEntries, notesBySlug } = seoData;
  const language = getLanguageForHtmlFile(htmlFile);
  const sourceHtmlFile = sourceHtmlFileForLocalizedFile(htmlFile);
  const pageUrl = absolutePageUrlForFile(siteUrl, htmlFile);
  const pageSlug = path.posix.basename(sourceHtmlFile).replace(/\.html$/i, '');
  const researchEntry = researchBySlug.get(pageSlug) || null;
  const noteEntry = notesBySlug.get(pageSlug) || null;
  const specialPage = getSpecialPageConfig(sourceHtmlFile);
  const is404Page = path.posix.basename(sourceHtmlFile).toLowerCase() === '404.html';
  const authoredTitle = extractTitleText(html);
  const authoredDescription = extractMetaDescription(html);
  const existingCanonical = extractCanonicalHref(html);
  let canonicalUrl = language === 'vi' ? pageUrl : existingCanonical ? new URL(existingCanonical, pageUrl).href : pageUrl;

  if (path.posix.basename(sourceHtmlFile).toLowerCase() === 'index.html') {
    const explicitIndexUrl = resolveWithinSite(siteUrl, 'index.html');
    if (canonicalUrl === explicitIndexUrl) {
      canonicalUrl = pageUrl;
    }
  }

  if (researchEntry?.deprecated && researchEntry.redirect_to) {
    canonicalUrl = absolutePageUrlForFile(
      siteUrl,
      localizedHtmlFileForLanguage(withHtml(researchEntry.redirect_to), language)
    );
  }

  const isCanonicalPage = canonicalUrl === pageUrl;
  const forceNoindexPage = is404Page || (researchEntry && SUPPORT_CONTENT_NOINDEX_IDS.has(researchEntry.id));
  const defaultImageUrl = resolveAbsoluteUrl(siteConfig.default_og_image, siteUrl, legacyHosts);
  const personImageUrl = resolveAbsoluteUrl('./assets/optimized/profile-portfolio-main-optimized.webp', siteUrl, legacyHosts);
  const feedUrl = resolveWithinSite(siteUrl, 'feed.xml');
  let title = `${siteConfig.site_name} | ${siteConfig.owner.job_title}`;
  let description = siteConfig.site_description;
  let ogType = 'website';
  let imageUrl = defaultImageUrl;
  let breadcrumbItems = [];
  let structuredData = [];
  let relatedEntries = [];
  let topicHub = null;
  let articleSection = '';
  let articlePublishedDate = '';
  let articleModifiedDate = '';

  if (is404Page) {
    title = `Page Not Found | ${siteConfig.site_name}`;
    description =
      'The page you requested is unavailable. Use the homepage or projects archive to continue browsing the portfolio.';
    structuredData = [];
  } else if (sourceHtmlFile === 'index.html') {
    description = siteConfig.site_description;
    title = `${siteConfig.site_name} | ${siteConfig.owner.job_title}`;
    structuredData = buildHomeStructuredData({
      siteUrl,
      siteConfig,
      description,
      imageUrl: defaultImageUrl,
      personImageUrl,
      researchEntries
    });
  } else if (sourceHtmlFile === 'projects.html') {
    title = `Projects Archive | ${siteConfig.site_name}`;
    description = clampText(
      'Research projects by Chung Hy Dai across hospitality segmentation, EV choice, policy acceptance, influencer retention, buffet nudging, nutrition, and organizational behavior.',
      175
    );
    breadcrumbItems = [
      { name: 'Home', href: 'index.html' },
      { name: 'Projects' }
    ];
    structuredData = buildProjectsStructuredData({
      siteUrl,
      pageUrl,
      siteConfig,
      description,
      researchEntries,
      personImageUrl
    });
  } else if (specialPage?.type === 'about') {
    title = specialPage.title;
    description = specialPage.description;
    imageUrl = resolveAbsoluteUrl(specialPage.image, siteUrl, legacyHosts) || defaultImageUrl;
    breadcrumbItems = [
      { name: 'Home', href: 'index.html' },
      { name: 'About' }
    ];
    structuredData = buildAboutStructuredData({
      siteUrl,
      pageUrl,
      siteConfig,
      description,
      imageUrl,
      researchEntries
    });
  } else if (specialPage?.type === 'insights') {
    title = specialPage.title;
    description = specialPage.description;
    imageUrl = defaultImageUrl;
    breadcrumbItems = [
      { name: 'Home', href: 'index.html' },
      { name: 'Insights' }
    ];
    structuredData = buildInsightsStructuredData({
      siteUrl,
      pageUrl,
      siteConfig,
      description,
      notesEntries
    });
  } else if (specialPage?.type === 'references') {
    title = specialPage.title;
    description = specialPage.description;
    imageUrl = resolveAbsoluteUrl(specialPage.image, siteUrl, legacyHosts) || defaultImageUrl;
    breadcrumbItems = [
      { name: 'Home', href: 'index.html' },
      { name: 'References' }
    ];
    structuredData = buildReferencesStructuredData({
      siteUrl,
      pageUrl,
      siteConfig,
      description,
      imageUrl
    });
  } else if (specialPage?.type === 'hub' && specialPage.hub) {
    title = specialPage.title;
    description = specialPage.description;
    imageUrl = resolveAbsoluteUrl(specialPage.image, siteUrl, legacyHosts) || defaultImageUrl;
    breadcrumbItems = [
      { name: 'Home', href: 'index.html' },
      { name: 'Projects', href: 'projects.html#research' },
      { name: specialPage.hub.name }
    ];
    structuredData = buildHubStructuredData({
      siteUrl,
      pageUrl,
      siteConfig,
      description,
      hub: specialPage.hub,
      researchEntries,
      personImageUrl
    });
  } else if (noteEntry) {
    const relatedResearchEntries = findRelatedResearchEntriesByIds(noteEntry.related_research_ids, researchEntries);
    topicHub = TOPIC_HUBS[noteEntry.hub_id] || null;
    title = `${noteEntry.title} | Insights | ${siteConfig.site_name}`;
    description = noteEntry.description;
    ogType = 'article';
    imageUrl = pickNoteImage(noteEntry, siteUrl, siteConfig, legacyHosts) || defaultImageUrl;
    articleSection = topicHub?.name || 'Research Insights';
    articlePublishedDate = normalizeIsoDateTime(noteEntry.published_at);
    articleModifiedDate = normalizeIsoDateTime(noteEntry.modified_at || noteEntry.published_at);
    breadcrumbItems = [
      { name: 'Home', href: 'index.html' },
      { name: 'Insights', href: 'insights.html' },
      ...(topicHub ? [{ name: topicHub.name, href: topicHub.file }] : []),
      { name: noteEntry.title }
    ];
    structuredData = buildNoteStructuredData({
      siteUrl,
      pageUrl,
      canonicalUrl,
      siteConfig,
      noteEntry,
      description,
      imageUrl,
      topicHub,
      relatedResearchEntries
    });
  } else if (researchEntry) {
    topicHub = getTopicHubByStudyType(researchEntry.study_type);
    title = `${stripHtml(researchEntry.title || pageSlug)} | ${siteConfig.site_name}`;
    description = deriveResearchDescription(researchEntry);
    ogType = researchEntry.deprecated ? 'website' : 'article';
    imageUrl = pickResearchImage(researchEntry, siteUrl, siteConfig, legacyHosts);
    articleSection = topicHub?.name || normalizeStudyTypeLabel(researchEntry.study_type || '');
    articlePublishedDate = normalizeIsoDateTime(extractDatePublished(researchEntry));
    articleModifiedDate = normalizeIsoDateTime(researchEntry.last_verified_at);
    breadcrumbItems = [
      { name: 'Home', href: 'index.html' },
      { name: 'Projects', href: 'projects.html#research' },
      ...(topicHub ? [{ name: topicHub.name, href: topicHub.file }] : []),
      { name: stripHtml(researchEntry.title || pageSlug) }
    ];
    structuredData = buildResearchStructuredData({
      siteUrl,
      pageUrl,
      canonicalUrl,
      siteConfig,
      entry: researchEntry,
      description,
      imageUrl,
      topicHub,
      personImageUrl
    });
    relatedEntries = pickRelatedEntries(researchEntry, researchEntries);
  } else {
    title = authoredTitle || `${stripHtml(pageSlug)} | ${siteConfig.site_name}`;
    description = authoredDescription || clampText(siteConfig.site_description, 170);
  }

  const robotsContent = !isCanonicalPage || forceNoindexPage
    ? 'noindex,follow,max-image-preview:large'
    : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
  if (language === 'vi') {
    title = translatePlainText(title);
    description = translatePlainText(description);
    articleSection = translatePlainText(articleSection);
    breadcrumbItems = breadcrumbItems.map((item) => ({
      ...item,
      name: translatePlainText(item.name)
    }));
  }

  const imageAlt =
    noteEntry?.title ||
    researchEntry?.title ||
    `${siteConfig.site_name} ${siteConfig.site_tagline.replace(/\s+Portfolio$/i, '').trim()}`.trim();
  let metaKeywords = noteEntry
    ? buildNoteKeywords(
      noteEntry,
      topicHub,
      findRelatedResearchEntriesByIds(noteEntry.related_research_ids, researchEntries),
      siteConfig
    )
    : buildMetaKeywords({ htmlFile: sourceHtmlFile, siteConfig, researchEntry, specialPage, topicHub });
  if (language === 'vi') {
    metaKeywords = translateKeywordList(metaKeywords);
  }

  let nextHtml = html;
  nextHtml = upsertTitleTag(nextHtml, title);
  nextHtml = upsertMetaTag(nextHtml, 'name', 'description', { content: description });
  nextHtml = upsertMetaTag(nextHtml, 'name', 'keywords', { content: metaKeywords });
  nextHtml = upsertMetaTag(nextHtml, 'name', 'robots', { content: robotsContent });
  nextHtml = upsertMetaTag(nextHtml, 'name', 'googlebot', { content: robotsContent });
  nextHtml = upsertMetaTag(nextHtml, 'name', 'language', { content: language });
  nextHtml = upsertMetaTag(nextHtml, 'name', 'author', { content: siteConfig.owner.name });
  nextHtml = upsertLinkTag(nextHtml, 'canonical', { href: canonicalUrl });
  nextHtml = upsertLinkTag(nextHtml, 'alternate', {
    href: feedUrl,
    type: 'application/atom+xml',
    title: siteConfig.feed_title
  });
  nextHtml = stripGeneratedBlock(nextHtml, 'hreflang');
  nextHtml = insertBeforeClosingTag(nextHtml, 'head', buildHreflangBlock({ siteUrl, htmlFile: sourceHtmlFile }));
  nextHtml = upsertMetaTag(nextHtml, 'property', 'og:type', { content: ogType });
  nextHtml = upsertMetaTag(nextHtml, 'property', 'og:locale', { content: language === 'vi' ? 'vi_VN' : 'en_US' });
  nextHtml = upsertMetaTag(nextHtml, 'property', 'og:site_name', { content: siteConfig.site_name });
  nextHtml = upsertMetaTag(nextHtml, 'property', 'og:title', { content: title });
  nextHtml = upsertMetaTag(nextHtml, 'property', 'og:description', { content: description });
  nextHtml = upsertMetaTag(nextHtml, 'property', 'og:url', { content: canonicalUrl });
  nextHtml = upsertMetaTag(nextHtml, 'property', 'og:image', { content: imageUrl });
  nextHtml = upsertMetaTag(nextHtml, 'property', 'og:image:secure_url', { content: imageUrl });
  nextHtml = upsertMetaTag(nextHtml, 'property', 'og:image:alt', { content: language === 'vi' ? translatePlainText(imageAlt) : imageAlt });
  nextHtml = upsertMetaTag(nextHtml, 'name', 'twitter:card', { content: 'summary_large_image' });
  nextHtml = upsertMetaTag(nextHtml, 'name', 'twitter:title', { content: title });
  nextHtml = upsertMetaTag(nextHtml, 'name', 'twitter:description', { content: description });
  nextHtml = upsertMetaTag(nextHtml, 'name', 'twitter:image', { content: imageUrl });
  nextHtml = upsertMetaTag(nextHtml, 'name', 'twitter:image:alt', { content: language === 'vi' ? translatePlainText(imageAlt) : imageAlt });
  nextHtml = stripGeneratedBlock(nextHtml, 'profile-me-links');

  const profileMeLinks = buildProfileMeLinks(siteConfig);
  if (profileMeLinks) {
    nextHtml = insertBeforeClosingTag(nextHtml, 'head', profileMeLinks);
  }

  const articleMetaSelectors = [
    ['property', 'article:author'],
    ['property', 'article:section'],
    ['property', 'article:published_time'],
    ['property', 'article:modified_time'],
    ['property', 'article:tag']
  ];
  for (const [selectorAttr, selectorValue] of articleMetaSelectors) {
    nextHtml = stripMetaTag(nextHtml, selectorAttr, selectorValue);
  }

  if ((researchEntry && !researchEntry.deprecated) || noteEntry) {
    nextHtml = upsertMetaTag(nextHtml, 'property', 'article:author', { content: siteConfig.owner.name });
    if (articleSection) {
      nextHtml = upsertMetaTag(nextHtml, 'property', 'article:section', { content: articleSection });
    }
    if (articlePublishedDate) {
      nextHtml = upsertMetaTag(nextHtml, 'property', 'article:published_time', { content: articlePublishedDate });
    }
    if (articleModifiedDate) {
      nextHtml = upsertMetaTag(nextHtml, 'property', 'article:modified_time', { content: articleModifiedDate });
    }
    nextHtml = upsertMetaTag(nextHtml, 'property', 'article:tag', { content: metaKeywords });
  }

  nextHtml = stripJsonLd(nextHtml);

  if (language === 'vi') {
    structuredData = localizeStructuredDataForVietnamese(structuredData, siteUrl);
  }

  if (structuredData.length && !is404Page) {
    nextHtml = insertBeforeClosingTag(
      nextHtml,
      'head',
      `<script type="application/ld+json">\n${JSON.stringify(structuredData, null, 2)}\n</script>`
    );
  }

  nextHtml = stripGeneratedBlock(nextHtml, 'breadcrumbs');
  if (breadcrumbItems.length && /<main\b[^>]*>/i.test(nextHtml)) {
    nextHtml = insertAfterOpeningMain(nextHtml, buildBreadcrumbNav(breadcrumbItems));
  }

  nextHtml = stripGeneratedBlock(nextHtml, 'related-links');
  if (relatedEntries.length && /<\/main>/i.test(nextHtml)) {
    nextHtml = nextHtml.replace(
      /<\/main>/i,
      `${buildRelatedLinksSection(researchEntry, relatedEntries, topicHub)}\n</main>`
    );
  }

  nextHtml = stripGeneratedBlock(nextHtml, 'site-routes');

  if (language === 'vi') {
    nextHtml = translateHtmlVisibleText(nextHtml);
  }

  return nextHtml;
}
