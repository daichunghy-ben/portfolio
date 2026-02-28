import {
    consumeResearchLabRestoreState,
    saveResearchLabState
} from './research-nav-state.js';

export function initResearchCarousel(env) {
    const carousel = document.querySelector('.research-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const carouselSection = carousel.closest('section');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');

    const getResearchIdFromCardLink = (cardLink) => {
        if (!cardLink) return '';
        return (
            cardLink.getAttribute('data-research-id')
            || cardLink.querySelector('.research-card')?.getAttribute('data-research-id')
            || ''
        );
    };

    const saveCarouselSnapshot = (researchId = '') => {
        const nextState = {
            pageScrollY: Math.round(window.scrollY),
            carouselScrollLeft: Math.round(carousel.scrollLeft),
            sectionId: carouselSection?.id || 'research'
        };
        if (researchId) {
            nextState.researchId = researchId;
        }
        saveResearchLabState(nextState);
    };

    const getScrollStep = () => {
        const firstCard = carousel.querySelector('.research-card');
        if (!firstCard) return Math.max(carousel.clientWidth * 0.75, 280);
        const styles = track ? window.getComputedStyle(track) : null;
        const gap = styles ? Number.parseFloat(styles.columnGap || styles.gap || '0') : 0;
        return firstCard.getBoundingClientRect().width + gap;
    };

    const getMaxScrollLeft = () => {
        const trackWidth = track
            ? Math.max(track.scrollWidth, track.getBoundingClientRect().width)
            : carousel.scrollWidth;
        return Math.max(trackWidth - carousel.clientWidth, 0);
    };

    const scheduleUpdate = () => {
        window.requestAnimationFrame(updateButtons);
    };

    const scrollByCard = (direction) => {
        const delta = getScrollStep() * direction;
        const targetLeft = Math.min(
            Math.max(carousel.scrollLeft + delta, 0),
            getMaxScrollLeft()
        );

        let didScroll = false;
        if (!env.prefersReducedMotion && typeof carousel.scrollTo === 'function') {
            try {
                carousel.scrollTo({
                    left: targetLeft,
                    behavior: 'smooth'
                });
                didScroll = true;
            } catch (error) {
                didScroll = false;
            }
        }

        if (!didScroll) {
            carousel.scrollLeft = targetLeft;
        }

        if (env.prefersReducedMotion) {
            scheduleUpdate();
            return;
        }
        scheduleUpdate();
        window.setTimeout(scheduleUpdate, 260);
    };

    const getScrollState = () => {
        const maxScrollLeft = getMaxScrollLeft();
        const canScroll = maxScrollLeft > 4;
        const atStart = carousel.scrollLeft <= 2;
        const atEnd = carousel.scrollLeft >= maxScrollLeft - 2;
        return { canScroll, atStart, atEnd };
    };

    const syncButtonState = (button, isDisabled) => {
        if (!button) return;
        button.disabled = false;
        button.setAttribute('aria-disabled', String(isDisabled));
    };

    const updateButtons = () => {
        if (!prevBtn || !nextBtn) return;
        const { canScroll, atStart, atEnd } = getScrollState();
        syncButtonState(prevBtn, !canScroll || atStart);
        syncButtonState(nextBtn, !canScroll || atEnd);
    };

    const findCardLinkByResearchId = (researchId) => {
        if (!researchId) return null;
        const escaped = window.CSS && typeof window.CSS.escape === 'function'
            ? window.CSS.escape(researchId)
            : researchId.replace(/["\\]/g, '\\$&');

        const linkedCard = carousel.querySelector(`.research-card-link[data-research-id="${escaped}"]`);
        if (linkedCard) return linkedCard;

        const nestedCard = carousel.querySelector(`.research-card[data-research-id="${escaped}"]`);
        return nestedCard ? nestedCard.closest('.research-card-link') : null;
    };

    const getCardCenteredScrollLeft = (researchId) => {
        const cardLink = findCardLinkByResearchId(researchId);
        if (!cardLink) return null;

        const maxScrollLeft = Math.max(carousel.scrollWidth - carousel.clientWidth, 0);
        const target =
            cardLink.offsetLeft
            - Math.max((carousel.clientWidth - cardLink.offsetWidth) / 2, 0);
        return Math.min(Math.max(target, 0), maxScrollLeft);
    };

    const restoreState = consumeResearchLabRestoreState();
    if (restoreState) {
        const pageScrollY = Number(restoreState.pageScrollY);
        const carouselScrollLeft = Number(restoreState.carouselScrollLeft);
        const sectionId = typeof restoreState.sectionId === 'string' ? restoreState.sectionId : '';
        const researchId = typeof restoreState.researchId === 'string' ? restoreState.researchId : '';

        const applyRestore = () => {
            if (Number.isFinite(pageScrollY)) {
                window.scrollTo(0, Math.max(pageScrollY, 0));
            } else {
                const targetSection = sectionId
                    ? document.getElementById(sectionId)
                    : carouselSection;
                if (targetSection) {
                    const sectionTop = targetSection.getBoundingClientRect().top + window.scrollY - 70;
                    window.scrollTo(0, Math.max(sectionTop, 0));
                }
            }

            const maxScrollLeft = Math.max(carousel.scrollWidth - carousel.clientWidth, 0);
            if (Number.isFinite(carouselScrollLeft)) {
                carousel.scrollLeft = Math.min(Math.max(carouselScrollLeft, 0), maxScrollLeft);
            } else if (researchId) {
                const centeredLeft = getCardCenteredScrollLeft(researchId);
                if (Number.isFinite(centeredLeft)) {
                    carousel.scrollLeft = centeredLeft;
                }
            }

            scheduleUpdate();
        };

        window.requestAnimationFrame(applyRestore);
        window.setTimeout(applyRestore, 160);
        window.setTimeout(applyRestore, 360);
        window.addEventListener('load', applyRestore, { once: true });
    }

    carousel.querySelectorAll('.research-card-link').forEach((cardLink) => {
        cardLink.addEventListener('click', () => {
            saveCarouselSnapshot(getResearchIdFromCardLink(cardLink));
        });
    });

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const { canScroll, atStart } = getScrollState();
            if (!canScroll || atStart) return;
            scrollByCard(-1);
        });
        nextBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const { canScroll, atEnd } = getScrollState();
            if (!canScroll || atEnd) return;
            scrollByCard(1);
        });
        carousel.addEventListener('scroll', updateButtons, { passive: true });
        window.addEventListener('resize', scheduleUpdate, { passive: true });
        prevBtn.addEventListener('pointerenter', scheduleUpdate, { passive: true });
        nextBtn.addEventListener('pointerenter', scheduleUpdate, { passive: true });
        scheduleUpdate();
    }

    if ('ResizeObserver' in window) {
        const resizeObserver = new ResizeObserver(() => scheduleUpdate());
        resizeObserver.observe(carousel);
        if (track) resizeObserver.observe(track);
    }

    if ('IntersectionObserver' in window && carouselSection) {
        const visibilityObserver = new IntersectionObserver((entries) => {
            const isVisible = entries.some((entry) => entry.isIntersecting);
            if (!isVisible) return;
            scheduleUpdate();
            visibilityObserver.disconnect();
        }, { threshold: 0.12 });
        visibilityObserver.observe(carouselSection);
    }

    carousel.querySelectorAll('img').forEach((img) => {
        if (img.complete) return;
        img.addEventListener('load', scheduleUpdate, { once: true });
        img.addEventListener('error', scheduleUpdate, { once: true });
    });
    window.addEventListener('load', scheduleUpdate, { once: true });

    carousel.addEventListener('wheel', (event) => {
        if (event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

        const atStart = carousel.scrollLeft <= 0;
        const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1;
        const movingRight = event.deltaY > 0;

        if ((movingRight && atEnd) || (!movingRight && atStart)) return;
        event.preventDefault();
        carousel.scrollLeft += event.deltaY;
    }, { passive: false });

    if (!env.hasFinePointer) return;

    let isDown = false;
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    carousel.querySelectorAll('img').forEach((img) => {
        img.setAttribute('draggable', 'false');
    });

    carousel.addEventListener('mousedown', (event) => {
        if (event.button !== 0) return;
        isDown = true;
        isDragging = false;
        carousel.classList.add('is-dragging');
        startX = event.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    const stopDrag = () => {
        isDown = false;
        carousel.classList.remove('is-dragging');
    };

    carousel.addEventListener('mouseleave', stopDrag);
    carousel.addEventListener('mouseup', stopDrag);

    carousel.addEventListener('mousemove', (event) => {
        if (!isDown) return;
        const x = event.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 1.5;

        if (Math.abs(walk) > 4) {
            isDragging = true;
        }

        if (isDragging) {
            event.preventDefault();
            carousel.scrollLeft = scrollLeft - walk;
        }
    });

    carousel.addEventListener('click', (event) => {
        if (!isDragging) return;
        event.preventDefault();
        event.stopPropagation();
        isDragging = false;
    }, true);
}
