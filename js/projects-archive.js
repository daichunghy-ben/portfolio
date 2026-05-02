export function initProjectsArchive(env) {
    const archiveRoot = document.querySelector('body[data-page="projects"] .archive-main');
    if (!archiveRoot) return;

    const cards = Array.from(document.querySelectorAll('[data-archive-card], .archive-card'));
    cards.forEach((card, index) => {
        card.style.setProperty('--reveal-delay', `${Math.min((index % 6) * 70, 350)}ms`);
    });

    const sections = Array.from(document.querySelectorAll('.archive-section-shell'));
    if ('IntersectionObserver' in window && sections.length) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-active');
                }
            });
        }, {
            threshold: 0.18,
            rootMargin: '0px 0px -12% 0px'
        });

        sections.forEach((section) => sectionObserver.observe(section));
    } else {
        sections.forEach((section) => section.classList.add('is-active'));
    }

    const sidebarLinks = Array.from(document.querySelectorAll('.sidebar-nav a[href^="#"]'));
    const sectionById = new Map(
        Array.from(document.querySelectorAll('header[id], section[id]'))
            .map((section) => [section.id, section])
    );

    if ('IntersectionObserver' in window && sidebarLinks.length) {
        const setCurrent = (id) => {
            sidebarLinks.forEach((link) => {
                const target = link.getAttribute('href')?.slice(1);
                link.classList.toggle('is-current', target === id);
            });
        };

        const navObserver = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (visible?.target?.id) {
                setCurrent(visible.target.id);
            }
        }, {
            threshold: [0.2, 0.4, 0.6],
            rootMargin: '-18% 0px -55% 0px'
        });

        sidebarLinks.forEach((link) => {
            const targetId = link.getAttribute('href')?.slice(1);
            const section = targetId ? sectionById.get(targetId) : null;
            if (section) navObserver.observe(section);
        });
    }

    const projectSection = document.querySelector('.archive-all-projects');
    const filterButtons = Array.from(projectSection?.querySelectorAll('[data-project-filter]') || []);
    const projectCards = Array.from(projectSection?.querySelectorAll('[data-project-domain]') || []);
    const clearFiltersButton = projectSection?.querySelector('.archive-clear-link');

    if (filterButtons.length && projectCards.length) {
        const applyProjectFilter = (activeFilter = 'all') => {
            filterButtons.forEach((button) => {
                const isActive = button.dataset.projectFilter === activeFilter;
                button.classList.toggle('is-active', isActive);
                button.setAttribute('aria-pressed', String(isActive));
            });

            projectCards.forEach((card) => {
                const matchesFilter = activeFilter === 'all' || card.dataset.projectDomain === activeFilter;
                card.hidden = !matchesFilter;
            });

            projectSection.dataset.activeFilter = activeFilter;
        };

        filterButtons.forEach((button) => {
            button.addEventListener('click', () => {
                applyProjectFilter(button.dataset.projectFilter || 'all');
            });
        });

        clearFiltersButton?.addEventListener('click', () => {
            applyProjectFilter('all');
        });

        applyProjectFilter('all');
    }

    if (!env.enablePointerEffects) return;

    const interactiveSurfaces = Array.from(document.querySelectorAll('[data-archive-card], [data-archive-visual]'));
    interactiveSurfaces.forEach((surface) => {
        let rafId = 0;
        let pointerX = 0;
        let pointerY = 0;

        const render = () => {
            rafId = 0;
            const rect = surface.getBoundingClientRect();
            const x = ((pointerX - rect.left) / Math.max(rect.width, 1)) * 100;
            const y = ((pointerY - rect.top) / Math.max(rect.height, 1)) * 100;
            surface.style.setProperty('--archive-pointer-x', `${Math.max(0, Math.min(100, x)).toFixed(1)}%`);
            surface.style.setProperty('--archive-pointer-y', `${Math.max(0, Math.min(100, y)).toFixed(1)}%`);
        };

        surface.addEventListener('pointermove', (event) => {
            if (event.pointerType && event.pointerType !== 'mouse') return;
            pointerX = event.clientX;
            pointerY = event.clientY;
            if (!rafId) {
                rafId = window.requestAnimationFrame(render);
            }
        }, { passive: true });

        surface.addEventListener('pointerleave', () => {
            if (rafId) {
                window.cancelAnimationFrame(rafId);
                rafId = 0;
            }
            surface.style.removeProperty('--archive-pointer-x');
            surface.style.removeProperty('--archive-pointer-y');
        });
    });
}
