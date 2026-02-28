export function initModal(env) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    if (!modal || !modalImg) return;

    const closeBtn = modal.querySelector('.modal-close');
    const triggers = document.querySelectorAll('[data-modal-img]');

    const TRANSITION_MS = env.prefersReducedMotion ? 0 : 220;
    let cleanupTimer = null;
    let lockedScrollY = 0;
    let openRequestId = 0;

    const clearCleanupTimer = () => {
        if (!cleanupTimer) return;
        window.clearTimeout(cleanupTimer);
        cleanupTimer = null;
    };

    const lockScroll = () => {
        if (document.body.classList.contains('modal-open')) return;
        lockedScrollY = window.scrollY;
        document.body.classList.add('modal-open');
        document.body.style.position = 'fixed';
        document.body.style.top = `-${lockedScrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
    };

    const unlockScroll = () => {
        if (!document.body.classList.contains('modal-open')) return;
        document.body.classList.remove('modal-open');
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, lockedScrollY);
    };

    const closeModal = () => {
        if (!modal.classList.contains('show')) return;
        openRequestId += 1;
        modal.classList.remove('show');
        unlockScroll();
        clearCleanupTimer();
        cleanupTimer = window.setTimeout(() => {
            modalImg.removeAttribute('src');
            modalImg.alt = '';
        }, TRANSITION_MS);
    };

    const openModal = (src, altText = '') => {
        if (!src) return;
        const requestId = ++openRequestId;

        clearCleanupTimer();
        lockScroll();
        modal.classList.add('show');
        modalImg.removeAttribute('src');
        modalImg.alt = altText || 'Expanded image';

        const showImage = () => {
            if (requestId !== openRequestId) return;
            modalImg.src = src;
        };

        const preload = new Image();
        preload.decoding = 'async';
        preload.src = src;

        if (typeof preload.decode === 'function') {
            preload.decode().then(showImage).catch(showImage);
        } else {
            preload.onload = showImage;
            preload.onerror = showImage;
        }
    };

    const activate = (event, trigger) => {
        const src = trigger.getAttribute('data-modal-img');
        if (!src) return;
        event.preventDefault();
        const alt = trigger.getAttribute('data-modal-alt') || trigger.getAttribute('aria-label') || '';
        openModal(src, alt);
    };

    triggers.forEach((trigger) => {
        if (!trigger.getAttribute('data-modal-img')) return;
        trigger.classList.add('modal-trigger');

        if (trigger.tagName !== 'A' && trigger.tagName !== 'BUTTON' && !trigger.hasAttribute('tabindex')) {
            trigger.setAttribute('tabindex', '0');
            trigger.setAttribute('role', 'button');
        }

        trigger.addEventListener('click', (event) => activate(event, trigger));
        trigger.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                activate(event, trigger);
            }
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
        closeBtn.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                closeModal();
            }
        });
    }

    modal.addEventListener('click', (event) => {
        const isOverlayClick = event.target === modal;
        const isTouchImageTap = event.target === modalImg && !env.hasFinePointer;
        if (isOverlayClick || isTouchImageTap) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
}
