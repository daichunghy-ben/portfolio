(function () {
    function initCarouselFallback(carousel) {
        if (!carousel || carousel.dataset.fallbackInit === 'true') return;

        const section = carousel.closest('section') || document;
        const prevBtn = section.querySelector('.carousel-btn-prev');
        const nextBtn = section.querySelector('.carousel-btn-next');
        if (!prevBtn || !nextBtn) return;

        const track = carousel.querySelector('.carousel-track');

        const getScrollStep = function () {
            const firstCard = carousel.querySelector('.research-card');
            if (!firstCard) return Math.max(carousel.clientWidth * 0.75, 280);
            const styles = track ? window.getComputedStyle(track) : null;
            const gap = styles ? parseFloat(styles.columnGap || styles.gap || '0') : 0;
            return firstCard.getBoundingClientRect().width + gap;
        };

        const getMaxScrollLeft = function () {
            const trackWidth = track
                ? Math.max(track.scrollWidth, track.getBoundingClientRect().width)
                : carousel.scrollWidth;
            return Math.max(trackWidth - carousel.clientWidth, 0);
        };

        const getScrollState = function () {
            const maxScrollLeft = getMaxScrollLeft();
            return {
                canScroll: maxScrollLeft > 4,
                atStart: carousel.scrollLeft <= 2,
                atEnd: carousel.scrollLeft >= maxScrollLeft - 2
            };
        };

        const syncButtonState = function () {
            const state = getScrollState();
            prevBtn.disabled = false;
            nextBtn.disabled = false;
            prevBtn.setAttribute('aria-disabled', String(!state.canScroll || state.atStart));
            nextBtn.setAttribute('aria-disabled', String(!state.canScroll || state.atEnd));
        };

        const scrollByCard = function (direction) {
            const delta = getScrollStep() * direction;
            const targetLeft = Math.min(
                Math.max(carousel.scrollLeft + delta, 0),
                getMaxScrollLeft()
            );

            if (typeof carousel.scrollTo === 'function') {
                try {
                    carousel.scrollTo({
                        left: targetLeft,
                        behavior: 'smooth'
                    });
                } catch (error) {
                    carousel.scrollLeft = targetLeft;
                }
            } else {
                carousel.scrollLeft = targetLeft;
            }

            window.requestAnimationFrame(syncButtonState);
            window.setTimeout(syncButtonState, 260);
        };

        prevBtn.addEventListener('click', function (event) {
            event.preventDefault();
            const state = getScrollState();
            if (!state.canScroll || state.atStart) return;
            scrollByCard(-1);
        });

        nextBtn.addEventListener('click', function (event) {
            event.preventDefault();
            const state = getScrollState();
            if (!state.canScroll || state.atEnd) return;
            scrollByCard(1);
        });

        carousel.addEventListener('scroll', syncButtonState, { passive: true });
        window.addEventListener('resize', syncButtonState, { passive: true });
        syncButtonState();
        carousel.dataset.fallbackInit = 'true';
    }

    function bootFallback() {
        if (window.__portfolioMainModuleLoaded) return;
        document.querySelectorAll('.research-carousel').forEach(initCarouselFallback);
    }

    if (document.readyState === 'complete') {
        bootFallback();
        return;
    }

    window.addEventListener('load', bootFallback, { once: true });
})();
