const STORAGE_KEY = 'portfolio.homeLocale.v1';
const DEFAULT_LOCALE = 'en';
const LOCALES = new Set(['en', 'vi']);

const sidebarCopy = {
    en: {
        role: 'Market Researcher',
        education: 'Education',
        projects: 'Projects',
        honors: 'Honors & Awards',
        certificates: 'Certificates',
        skills: 'Skills',
        info: 'Info',
        quote: 'Work for a cause,<br>not for applause.<br>Live life to express,<br>not to impress.'
    },
    vi: {
        role: 'Market Researcher',
        education: 'Education',
        projects: 'Projects',
        honors: 'Honors & Awards',
        certificates: 'Certificates',
        skills: 'Skills',
        info: 'Info',
        quote: 'Work for a cause,<br>not for applause.<br>Live life to express,<br>not to impress.'
    }
};

function normalizeLocale(locale) {
    const value = String(locale || '').toLowerCase();
    return LOCALES.has(value) ? value : DEFAULT_LOCALE;
}

function getStoredLocale() {
    try {
        return normalizeLocale(window.localStorage.getItem(STORAGE_KEY));
    } catch {
        return DEFAULT_LOCALE;
    }
}

function storeLocale(locale) {
    try {
        window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
        // The switcher should still work when storage is blocked.
    }
}

function createResearchSwitcher() {
    const wrapper = document.createElement('div');
    wrapper.className = 'project-sidebar-language language-switcher';
    wrapper.setAttribute('aria-label', 'Project language');
    wrapper.innerHTML = `
        <button class="language-switcher__link" type="button" data-project-language="vi" aria-pressed="false">VI</button>
        <button class="language-switcher__link" type="button" data-project-language="en" aria-pressed="true">EN</button>
    `;
    return wrapper;
}

function ensureResearchSwitcher() {
    const sidebar = document.querySelector('.project-home-sidebar');
    if (!sidebar) return null;

    const existing = sidebar.querySelector('.project-sidebar-language');
    if (existing) return existing;

    const profile = sidebar.querySelector('.side-profile');
    const switcher = createResearchSwitcher();
    if (profile) {
        profile.insertAdjacentElement('afterend', switcher);
    } else {
        sidebar.prepend(switcher);
    }
    return switcher;
}

function navKeyFromHref(link) {
    const href = link.getAttribute('href') || '';
    if (href.includes('#education')) return 'education';
    if (href.includes('projects.html')) return 'projects';
    if (href.includes('#honors')) return 'honors';
    if (href.includes('#certificates')) return 'certificates';
    if (href.includes('#skills')) return 'skills';
    if (href.includes('#info') || href.includes('#contact')) return 'info';
    return '';
}

function applyResearchSidebarLocale(locale, persist = false) {
    const nextLocale = normalizeLocale(locale);
    const copy = sidebarCopy[nextLocale] || sidebarCopy[DEFAULT_LOCALE];

    document.documentElement.lang = nextLocale;
    document.documentElement.dataset.homeLocale = nextLocale;
    document.body?.setAttribute('data-home-locale', nextLocale);

    document.querySelectorAll('.project-home-sidebar .side-profile p').forEach((node) => {
        node.textContent = copy.role;
    });

    document.querySelectorAll('.project-home-sidebar .side-nav a').forEach((link) => {
        const key = navKeyFromHref(link);
        const label = key ? copy[key] : '';
        const span = link.querySelector('span');
        if (span && label) span.textContent = label;
    });

    const quote = document.querySelector('.project-home-sidebar .side-quote');
    if (quote) quote.innerHTML = copy.quote;

    document.querySelectorAll('[data-project-language]').forEach((button) => {
        const isActive = button.dataset.projectLanguage === nextLocale;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });

    if (persist) storeLocale(nextLocale);
}

export function initResearchSidebarLocale() {
    if (!document.body?.classList.contains('project-left-banner')) return;

    ensureResearchSwitcher();
    applyResearchSidebarLocale(getStoredLocale(), false);

    document.querySelectorAll('[data-project-language]').forEach((button) => {
        button.addEventListener('click', () => {
            applyResearchSidebarLocale(button.dataset.projectLanguage, true);
        });
    });
}
