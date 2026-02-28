export function createEnv() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const enablePointerEffects = hasFinePointer && !prefersReducedMotion && window.innerWidth >= 1024;

    return {
        prefersReducedMotion,
        hasFinePointer,
        enablePointerEffects
    };
}

const toAbsoluteUrl = (raw, baseUrl) => {
    if (!raw) return null;
    try {
        return new URL(raw, baseUrl).href;
    } catch {
        return null;
    }
};

export function initSeoMetaNormalization() {
    const baseUrl = window.location.href;
    const pageUrl = new URL(baseUrl);
    pageUrl.hash = '';
    pageUrl.search = '';

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
        const canonicalHref = canonical.getAttribute('href');
        const absoluteCanonical = toAbsoluteUrl(canonicalHref, baseUrl);
        canonical.setAttribute('href', absoluteCanonical || pageUrl.href);
    } else if (document.head) {
        const link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', pageUrl.href);
        document.head.appendChild(link);
    }

    const canonicalHref = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || pageUrl.href;

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
        ogUrl.setAttribute('content', canonicalHref);
    }

    const imageMetaSelectors = [
        'meta[property="og:image"]',
        'meta[property="og:image:secure_url"]',
        'meta[name="twitter:image"]'
    ];

    imageMetaSelectors.forEach((selector) => {
        const meta = document.querySelector(selector);
        if (!meta) return;
        const value = meta.getAttribute('content');
        const absoluteValue = toAbsoluteUrl(value, baseUrl);
        if (absoluteValue) {
            meta.setAttribute('content', absoluteValue);
        }
    });
}

export function initSmoothScroll(env) {
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            const end = target.getBoundingClientRect().top + window.scrollY - 70;
            if (env.prefersReducedMotion) {
                window.scrollTo(0, end);
                return;
            }

            const start = window.scrollY;
            const distance = end - start;
            const duration = 320;
            let startTime = null;

            const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                window.scrollTo(0, start + distance * ease);
                if (progress < 1) window.requestAnimationFrame(step);
            };

            window.requestAnimationFrame(step);
        });
    });
}

export function initMagnetic(env) {
    if (!env.enablePointerEffects) return;

    const magnets = document.querySelectorAll('.magnetic');
    if (!magnets.length) return;

    const states = Array.from(magnets).map((magnet) => {
        const state = {
            magnet,
            rect: null,
            rafId: 0,
            pointerX: 0,
            pointerY: 0,
            strength: Number.parseFloat(magnet.getAttribute('data-strength') || '20')
        };

        const measureRect = () => {
            state.rect = magnet.getBoundingClientRect();
        };

        const render = () => {
            state.rafId = 0;
            if (!state.rect) measureRect();
            const rect = state.rect;
            if (!rect) return;
            const x = state.pointerX - rect.left - rect.width / 2;
            const y = state.pointerY - rect.top - rect.height / 2;
            const strengthRatio = Number.isFinite(state.strength) ? state.strength / 100 : 0.2;
            magnet.style.transform = `translate(${x * strengthRatio}px, ${y * strengthRatio}px)`;
        };

        const requestRender = () => {
            if (state.rafId) return;
            state.rafId = window.requestAnimationFrame(render);
        };

        magnet.addEventListener('mouseenter', (event) => {
            state.pointerX = event.clientX;
            state.pointerY = event.clientY;
            measureRect();
            magnet.style.transition = 'none';
            requestRender();
        });

        magnet.addEventListener('mousemove', (event) => {
            state.pointerX = event.clientX;
            state.pointerY = event.clientY;
            requestRender();
        }, { passive: true });

        magnet.addEventListener('mouseleave', () => {
            if (state.rafId) {
                window.cancelAnimationFrame(state.rafId);
                state.rafId = 0;
            }
            magnet.style.transform = 'translate(0px, 0px)';
            magnet.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
        });

        return state;
    });

    const invalidateRects = () => {
        states.forEach((state) => {
            state.rect = null;
        });
    };

    window.addEventListener('resize', invalidateRects, { passive: true });
    window.addEventListener('scroll', invalidateRects, { passive: true });
}

export function initTilt(env) {
    if (!env.enablePointerEffects) return;

    const tiltElements = document.querySelectorAll('[data-tilt="true"]');
    if (!tiltElements.length) return;

    const states = Array.from(tiltElements).map((element) => {
        const state = {
            element,
            rect: null,
            rafId: 0,
            pointerX: 0,
            pointerY: 0
        };

        const measureRect = () => {
            state.rect = element.getBoundingClientRect();
        };

        const render = () => {
            state.rafId = 0;
            if (!state.rect) measureRect();
            const rect = state.rect;
            if (!rect) return;
            const x = state.pointerX - rect.left;
            const y = state.pointerY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / Math.max(centerY, 1)) * -6;
            const rotateY = ((x - centerX) / Math.max(centerX, 1)) * 6;
            element.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
        };

        const requestRender = () => {
            if (state.rafId) return;
            state.rafId = window.requestAnimationFrame(render);
        };

        element.addEventListener('mouseenter', (event) => {
            state.pointerX = event.clientX;
            state.pointerY = event.clientY;
            measureRect();
            element.style.transition = 'transform 0.08s ease-out';
            requestRender();
        });

        element.addEventListener('mousemove', (event) => {
            state.pointerX = event.clientX;
            state.pointerY = event.clientY;
            requestRender();
        }, { passive: true });

        element.addEventListener('mouseleave', () => {
            if (state.rafId) {
                window.cancelAnimationFrame(state.rafId);
                state.rafId = 0;
            }
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            element.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)';
        });

        return state;
    });

    const invalidateRects = () => {
        states.forEach((state) => {
            state.rect = null;
        });
    };

    window.addEventListener('resize', invalidateRects, { passive: true });
    window.addEventListener('scroll', invalidateRects, { passive: true });
}

export function initReveal(env) {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    if (env.prefersReducedMotion) {
        revealElements.forEach((element) => element.classList.add('active'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach((element) => {
        if (!element.classList.contains('active')) {
            observer.observe(element);
        }
    });
}

export function initImageDefaults(page) {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
        if (!img.getAttribute('decoding')) {
            img.setAttribute('decoding', 'async');
        }

        if (!img.getAttribute('loading')) {
            const inHero = Boolean(img.closest('.hero, .research-detail-hero, .cv-header'));
            img.setAttribute('loading', inHero ? 'eager' : 'lazy');
        }

        // If fallback target exists, show it when image fails.
        const fallbackSelector = img.getAttribute('data-fallback-selector');
        if (fallbackSelector) {
            img.addEventListener('error', () => {
                img.style.display = 'none';
                const fallback = document.querySelector(fallbackSelector);
                if (fallback) fallback.style.display = 'flex';
            }, { once: true });
        }

        // Replace prior inline onerror behavior for EV asset gracefully.
        if (page === 'research' && img.classList.contains('js-ev-fallback')) {
            img.addEventListener('error', () => {
                img.alt = 'EV choice experiment visual unavailable';
                img.style.background = '#f1f5f9';
            }, { once: true });
        }
    });
}

export function initPrintButtons() {
    document.querySelectorAll('.js-print').forEach((button) => {
        button.addEventListener('click', () => window.print());
    });
}

export function initLinkSecurity() {
    document.querySelectorAll('a[target="_blank"]').forEach((anchor) => {
        const rel = anchor.getAttribute('rel') || '';
        const tokens = new Set(rel.split(/\s+/).filter(Boolean));
        tokens.add('noopener');
        tokens.add('noreferrer');
        anchor.setAttribute('rel', Array.from(tokens).join(' '));
    });
}
