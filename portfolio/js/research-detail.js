import {
    getResearchLabState,
    requestResearchLabRestore
} from './research-nav-state.js';

export function initResearchDetail(page) {
    if (page !== 'research') return;

    const pageName = window.location.pathname.split('/').pop() || '';
    const isResearchDetailPage = /^research-.+\.html$/i.test(pageName);
    if (!isResearchDetailPage) return;

    const body = document.body;
    const main = document.querySelector('main');
    const hero = main ? main.querySelector('.research-detail-hero') : null;
    if (!body || !main || !hero) return;

    body.classList.add('page-research-detail');

    // Keep authored section order intact to avoid AI-like reshuffling and CLS.
    // Only de-duplicate repeated back buttons in lower sections.
    main.querySelectorAll(
        'a.btn-outline.large[href="projects.html"],'
        + 'a.btn-outline.large[href="./projects.html"],'
        + 'a.btn-outline.large[href="projects.html#research"],'
        + 'a.btn-outline.large[href="./projects.html#research"]'
    ).forEach((link) => {
        const container = link.closest('.text-center');
        if (container) {
            container.classList.add('rd-back-duplicate');
        } else {
            link.classList.add('rd-back-duplicate');
        }
    });

    const backLinks = main.querySelectorAll(
        'a[href="projects.html"],'
        + 'a[href="./projects.html"],'
        + 'a[href="projects.html#research"],'
        + 'a[href="./projects.html#research"]'
    );

    const pageResearchId = body.getAttribute('data-research-id') || '';
    backLinks.forEach((link) => {
        link.setAttribute('href', 'projects.html#research');
        link.addEventListener('click', () => {
            const previousState = getResearchLabState() || {};
            requestResearchLabRestore({
                researchId: pageResearchId || previousState.researchId || '',
                sectionId: previousState.sectionId || 'research'
            });
        });
    });

    window.requestAnimationFrame(() => {
        main.querySelectorAll('.reveal').forEach((element) => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.9) {
                element.classList.add('active');
            }
        });
    });
}
