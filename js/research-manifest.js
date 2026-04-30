const MANIFEST_PATH = './assets/data/research-manifest.json';

let manifestPromise = null;

function getManifest() {
    if (!manifestPromise) {
        manifestPromise = fetch(MANIFEST_PATH, { cache: 'no-store' })
            .then((response) => {
                if (!response.ok) throw new Error(`Manifest fetch failed: ${response.status}`);
                return response.json();
            })
            .catch((error) => {
                console.warn('[research-manifest] Unable to load manifest.', error);
                return null;
            });
    }

    return manifestPromise;
}

function slugFromHref(href) {
    if (!href) return '';
    const clean = href.split('#')[0].split('?')[0].replace(/^\.\//, '');
    return clean.replace(/\.html$/i, '').trim();
}

function withHtml(slug) {
    return `${slug}.html`;
}

function makeBadgeLabel(studyType) {
    switch (studyType) {
    case 'hospitality':
        return 'Hospitality';
    case 'policy':
        return 'Policy';
    case 'creator':
        return 'Creator Economy';
    case 'health':
        return 'Health & Behavior';
    case 'organizational':
        return 'Organizational';
    default:
        return 'Research';
    }
}

function indexManifest(manifest) {
    const list = Array.isArray(manifest?.research) ? manifest.research : [];
    const byId = new Map();
    const bySlug = new Map();

    list.forEach((entry) => {
        if (!entry || !entry.id || !entry.slug) return;
        byId.set(entry.id, entry);
        bySlug.set(entry.slug, entry);
    });

    return { byId, bySlug };
}

function resolveEntry(cardLink, maps) {
    const cardId = cardLink.getAttribute('data-research-id');
    if (cardId && maps.byId.has(cardId)) return maps.byId.get(cardId);

    const hrefSlug = slugFromHref(cardLink.getAttribute('href'));
    if (hrefSlug && maps.bySlug.has(hrefSlug)) return maps.bySlug.get(hrefSlug);

    return null;
}

function normalizeProjectsCardSummary(summary) {
    if (typeof summary !== 'string') return '';
    return summary
        .replace(
            /^\s*(?:Reported(?:\s*\(self-reported\))?|Derived interpretation|Conceptual framework)\s*:\s*/i,
            ''
        )
        .trim();
}

function applyCardContent(cardLink, entry, options = {}) {
    cardLink.setAttribute('data-research-id', entry.id);
    cardLink.setAttribute('href', withHtml(entry.slug));

    const card = cardLink.querySelector('.research-card');
    if (card) {
        card.setAttribute('data-research-id', entry.id);
    }

    const title = cardLink.querySelector('.rc-content h3');
    if (title && entry.title) title.textContent = entry.title;

    const summary = cardLink.querySelector('.rc-content p');
    if (summary && entry.card_summary) {
        const rawSummary = String(entry.card_summary).trim();
        const normalizedSummary = options.normalizeSummary
            ? normalizeProjectsCardSummary(rawSummary)
            : rawSummary;
        summary.textContent = normalizedSummary || rawSummary;
    }

    const badge = cardLink.querySelector('.rc-badge');
    if (badge) badge.textContent = makeBadgeLabel(entry.study_type);

    const image = cardLink.querySelector('.rc-image img');
    if (image && entry.card_image) {
        image.setAttribute('src', entry.card_image);
        const currentAlt = image.getAttribute('alt') || '';
        if (!currentAlt || /research|visual|map|analysis/i.test(currentAlt)) {
            image.setAttribute('alt', entry.title);
        }
    }
}

function applyCards(manifestMaps, options = {}) {
    const cardLinks = document.querySelectorAll('.research-card-link');
    if (!cardLinks.length) return;

    cardLinks.forEach((cardLink) => {
        const entry = resolveEntry(cardLink, manifestMaps);
        if (!entry) return;

        if (entry.deprecated && entry.redirect_to && manifestMaps.bySlug.has(entry.redirect_to)) {
            const redirectEntry = manifestMaps.bySlug.get(entry.redirect_to);
            applyCardContent(cardLink, redirectEntry, options);
            return;
        }

        applyCardContent(cardLink, entry, options);
    });
}

function addTierBadge(element, tierValue) {
    if (!element || !tierValue) return;

    const tier = tierValue.trim().toLowerCase();
    if (!tier) return;

    element.setAttribute('data-evidence-tier', tier);

    // Remove any stale tier badges from older deployments.
    element.querySelectorAll(':scope > .evidence-tier-badge').forEach((badge) => badge.remove());
}

function renderSourceNote(header, entry) {
    if (!header || !entry) return;

    const existing = header.querySelector('.research-source-note');
    if (existing) return;

    const sourceLinks = Array.isArray(entry.source_links) ? entry.source_links : [];
    if (!sourceLinks.length) return;

    const note = document.createElement('p');
    note.className = 'research-source-note';

    const prefix = document.createElement('strong');
    prefix.textContent = 'Source notes: ';
    note.appendChild(prefix);

    sourceLinks.slice(0, 3).forEach((source, index) => {
        const link = document.createElement('a');
        link.href = source.url;
        link.textContent = source.label || 'Source';
        const isExternal = /^https?:\/\//i.test(source.url);
        if (isExternal) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }
        note.appendChild(link);

        if (index < Math.min(sourceLinks.length, 3) - 1) {
            note.appendChild(document.createTextNode(' · '));
        }
    });

    const target = header.querySelector('.research-meta-tags');
    if (target?.nextSibling) {
        target.parentNode.insertBefore(note, target.nextSibling);
    } else {
        header.appendChild(note);
    }
}

function applyDetail(manifestMaps, pathname) {
    const body = document.body;
    if (!body || body.getAttribute('data-page') !== 'research') return;

    const slug = pathname.split('/').pop().replace(/\.html$/i, '');
    let entry = manifestMaps.bySlug.get(slug) || null;

    if (entry?.deprecated && entry.redirect_to) {
        entry = manifestMaps.bySlug.get(entry.redirect_to) || entry;
    }

    if (!entry) return;

    body.setAttribute('data-research-id', entry.id);
    if (entry.study_type) {
        body.setAttribute('data-study-type', entry.study_type);
        body.classList.add(`dialect-${entry.study_type}`);
    }

    const detailHeader = document.querySelector('.research-detail-header');
    renderSourceNote(detailHeader, entry);

    const kpiTier = entry.default_tiers?.kpi || entry.status || 'conceptual';
    const figureDefault = entry.default_tiers?.figure || entry.status || 'conceptual';
    const figureTiers = Array.isArray(entry.figure_tiers) ? entry.figure_tiers : [];

    document.querySelectorAll('.research-kpi-strip').forEach((strip) => {
        addTierBadge(strip, strip.getAttribute('data-evidence-tier') || kpiTier);
    });

    document.querySelectorAll('figure.research-figure-stage').forEach((figure, index) => {
        const tier = figure.getAttribute('data-evidence-tier') || figureTiers[index] || figureDefault;
        addTierBadge(figure, tier);
    });
}

export async function initResearchManifest(page) {
    const manifest = await getManifest();
    if (!manifest) return;

    const maps = indexManifest(manifest);

    if (page === 'home' || page === 'projects') {
        applyCards(maps, { normalizeSummary: page === 'projects' });
    }

    if (page === 'research') {
        applyDetail(maps, window.location.pathname || '');
    }
}
