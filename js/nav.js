export function initNav() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const toggle = navbar.querySelector('.nav-toggle');
    const links = navbar.querySelector('.nav-links');
    const overlay = document.querySelector('.nav-overlay');

    if (!toggle || !links || !overlay) return;

    const mobileQuery = window.matchMedia('(max-width: 900px)');

    const isMobile = () => mobileQuery.matches;

    const ensureCvLink = () => {
        const hasCvLink = links.querySelector('a[href="cv.html"], a[href="./cv.html"]');
        if (hasCvLink) return;

        const cvLink = document.createElement('a');
        cvLink.className = 'nav-link';
        cvLink.href = 'cv.html';
        cvLink.textContent = 'CV';

        const cta = links.querySelector('.nav-cta');
        if (cta) {
            links.insertBefore(cvLink, cta);
        } else {
            links.appendChild(cvLink);
        }
    };

    ensureCvLink();

    const setExpanded = (expanded) => {
        toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    };

    const closeMenu = () => {
        navbar.classList.remove('nav-open');
        document.body.classList.remove('nav-open');
        if (isMobile()) {
            links.hidden = true;
        }
        overlay.hidden = true;
        setExpanded(false);
    };

    const openMenu = () => {
        links.hidden = false;
        navbar.classList.add('nav-open');
        document.body.classList.add('nav-open');
        overlay.hidden = false;
        setExpanded(true);
    };

    const syncForViewport = () => {
        if (isMobile()) {
            if (!navbar.classList.contains('nav-open')) {
                links.hidden = true;
                overlay.hidden = true;
                setExpanded(false);
            } else {
                links.hidden = false;
            }
            return;
        }

        links.hidden = false;
        closeMenu();
    };

    toggle.addEventListener('click', () => {
        if (!isMobile()) return;
        if (navbar.classList.contains('nav-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    overlay.addEventListener('click', closeMenu);

    links.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            if (isMobile()) closeMenu();
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navbar.classList.contains('nav-open')) {
            closeMenu();
        }
    });

    if (mobileQuery.addEventListener) {
        mobileQuery.addEventListener('change', syncForViewport);
    } else if (mobileQuery.addListener) {
        mobileQuery.addListener(syncForViewport);
    }

    syncForViewport();
}
