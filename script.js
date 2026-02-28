const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
const enablePointerEffects = hasFinePointer && !prefersReducedMotion && window.innerWidth >= 1024;

document.addEventListener('DOMContentLoaded', () => {

    // --- Fast Smooth Scroll for Nav Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();

            const end = target.getBoundingClientRect().top + window.scrollY - 70;
            if (prefersReducedMotion) {
                window.scrollTo(0, end);
                return;
            }

            const start = window.scrollY;
            const distance = end - start;
            const duration = 300; // ms — fast scroll
            let startTime = null;
            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                window.scrollTo(0, start + distance * ease);
                if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        });
    });

    // --- Magnetic Elements Interaction ---
    if (enablePointerEffects) {
        const magnets = document.querySelectorAll('.magnetic');

        magnets.forEach(magnet => {
            magnet.addEventListener('mousemove', (e) => {
                const position = magnet.getBoundingClientRect();
                const x = e.clientX - position.left - position.width / 2;
                const y = e.clientY - position.top - position.height / 2;

                // Get strength from attribute, default to 20
                const strength = magnet.getAttribute('data-strength') || 20;
                magnet.style.transform = `translate(${x * (strength / 100)}px, ${y * (strength / 100)}px)`;
            });

            magnet.addEventListener('mouseleave', () => {
                // Reset to original position
                magnet.style.transform = 'translate(0px, 0px)';
                magnet.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
            });

            magnet.addEventListener('mouseenter', () => {
                // Remove transition for instant follow feeling
                magnet.style.transition = 'none';
            });
        });
    }

    // --- Smooth Scroll Reveal Animation (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal');
    if (prefersReducedMotion) {
        revealElements.forEach((el) => el.classList.add('active'));
    } else {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: "0px 0px -60px 0px"
        });

        revealElements.forEach((el) => {
            if (!el.classList.contains('active')) {
                revealObserver.observe(el);
            }
        });
    }

    // --- Keyword Cloud Floating Animation Init ---
    if (!prefersReducedMotion) {
        const kwTags = document.querySelectorAll('.kw-tag');
        kwTags.forEach((tag, i) => {
            const floatX = parseFloat(tag.getAttribute('data-float-x')) || 1;
            const floatY = parseFloat(tag.getAttribute('data-float-y')) || 1;

            // Randomized float distance (8-18px), duration (5-9s), and delay
            const dx = floatX * (8 + Math.random() * 10);
            const dy = floatY * (6 + Math.random() * 10);
            const dur = 5 + Math.random() * 4;
            const delay = i * 0.3 + Math.random() * 1.5;

            tag.style.setProperty('--kw-dx', `${dx}px`);
            tag.style.setProperty('--kw-dy', `${dy}px`);
            tag.style.setProperty('--kw-dur', `${dur}s`);
            tag.style.setProperty('--kw-delay', `${delay}s`);
        });
    }

    // --- Counter Animation ---
    const counters = document.querySelectorAll('.counter');
    if (prefersReducedMotion) {
        counters.forEach((counter) => {
            const endVal = parseInt(counter.getAttribute('data-target'), 10);
            if (!Number.isNaN(endVal)) {
                counter.innerText = endVal.toLocaleString();
            }
        });
    } else {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const endVal = parseInt(target.getAttribute('data-target'), 10);
                    if (Number.isNaN(endVal)) {
                        observer.unobserve(target);
                        return;
                    }

                    // Animate from 0 to target
                    let startTimestamp = null;
                    const duration = 1200; // 1.2 seconds

                    const step = (timestamp) => {
                        if (!startTimestamp) startTimestamp = timestamp;
                        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

                        // Ease out expo for snappy start and slow end
                        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

                        target.innerText = Math.floor(easeProgress * endVal).toLocaleString();

                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        } else {
                            target.innerText = endVal.toLocaleString(); // Ensure exact final value
                        }
                    };

                    window.requestAnimationFrame(step);
                    observer.unobserve(target); // Only animate once per reload
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // --- Research Carousel Controls / Drag / Wheel Scroll ---
    const carousel = document.querySelector('.research-carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const prevBtn = document.querySelector('.carousel-btn-prev');
        const nextBtn = document.querySelector('.carousel-btn-next');

        const getScrollStep = () => {
            const firstCard = carousel.querySelector('.research-card');
            if (!firstCard) return Math.max(carousel.clientWidth * 0.75, 280);
            const styles = track ? window.getComputedStyle(track) : null;
            const gap = styles ? parseFloat(styles.columnGap || styles.gap || '0') : 0;
            return firstCard.getBoundingClientRect().width + gap;
        };

        const getMaxScrollLeft = () => {
            const trackWidth = track
                ? Math.max(track.scrollWidth, track.getBoundingClientRect().width)
                : carousel.scrollWidth;
            return Math.max(trackWidth - carousel.clientWidth, 0);
        };

        const scrollByCard = (direction) => {
            const delta = getScrollStep() * direction;
            const targetLeft = Math.min(
                Math.max(carousel.scrollLeft + delta, 0),
                getMaxScrollLeft()
            );

            let didScroll = false;
            if (!prefersReducedMotion && typeof carousel.scrollTo === 'function') {
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
        };

        const updateCarouselButtons = () => {
            if (!prevBtn || !nextBtn) return;
            const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
            prevBtn.disabled = carousel.scrollLeft <= 2;
            nextBtn.disabled = carousel.scrollLeft >= maxScrollLeft - 2;
        };

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => scrollByCard(-1));
            nextBtn.addEventListener('click', () => scrollByCard(1));
            carousel.addEventListener('scroll', updateCarouselButtons, { passive: true });
            window.addEventListener('resize', updateCarouselButtons);
            updateCarouselButtons();
        }

        carousel.addEventListener('wheel', (e) => {
            if (e.ctrlKey || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
            const atStart = carousel.scrollLeft <= 0;
            const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1;
            const movingRight = e.deltaY > 0;

            if ((movingRight && atEnd) || (!movingRight && atStart)) return;
            e.preventDefault();
            carousel.scrollLeft += e.deltaY;
        }, { passive: false });

        if (!hasFinePointer) return;

        let isDown = false;
        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;
        carousel.querySelectorAll('img').forEach((img) => {
            img.setAttribute('draggable', 'false');
        });

        carousel.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            isDown = true;
            isDragging = false;
            carousel.classList.add('is-dragging');
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });

        const stopDrag = () => {
            isDown = false;
            carousel.classList.remove('is-dragging');
        };

        carousel.addEventListener('mouseleave', stopDrag);
        carousel.addEventListener('mouseup', stopDrag);

        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 1.5;

            // Only enter drag mode after a small threshold so normal clicks still work.
            if (Math.abs(walk) > 4) {
                isDragging = true;
            }

            if (isDragging) {
                e.preventDefault();
                carousel.scrollLeft = scrollLeft - walk;
            }
        });

        // If the pointer action was a drag, suppress the click navigation.
        carousel.addEventListener('click', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            e.stopPropagation();
            isDragging = false;
        }, true);
    }

});

// ==========================================
// 3D Tilt Effect
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const tiltElements = document.querySelectorAll('[data-tilt="true"]');

    // Only apply tilt on desktop pointers without motion reduction preference.
    if (enablePointerEffects) {
        tiltElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Keep tilt subtle to avoid jittery layouts.
                const rotateX = ((y - centerY) / centerY) * -6;
                const rotateY = ((x - centerX) / centerX) * 6;

                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                el.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)';
            });

            el.addEventListener('mouseenter', () => {
                el.style.transition = 'transform 0.08s ease-out';
            });
        });
    }
});


// ==========================================
// Accordion & Modal Logic Additions
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Accordion Logic
    const interactiveCards = document.querySelectorAll('.interactive-card');
    interactiveCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('is-expanded');
        });
    });

    // Lightbox Modal Logic
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');

    if (modal && modalImg) {
        const closeBtn = modal.querySelector('.modal-close');
        const modalTriggers = document.querySelectorAll('[data-modal-img]');
        const MODAL_TRANSITION_MS = prefersReducedMotion ? 0 : 220;
        let cleanupTimer = null;
        let lockedScrollY = 0;
        let openRequestId = 0;

        const clearCleanupTimer = () => {
            if (cleanupTimer) {
                window.clearTimeout(cleanupTimer);
                cleanupTimer = null;
            }
        };

        const lockBackgroundScroll = () => {
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

        const unlockBackgroundScroll = () => {
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
            unlockBackgroundScroll();
            clearCleanupTimer();

            cleanupTimer = window.setTimeout(() => {
                modalImg.removeAttribute('src');
                modalImg.alt = '';
            }, MODAL_TRANSITION_MS);
        };

        const openModal = (src, altText = '') => {
            if (!src) return;
            const requestId = ++openRequestId;
            clearCleanupTimer();
            lockBackgroundScroll();
            modal.classList.add('show');
            modalImg.removeAttribute('src');
            modalImg.alt = altText || 'Expanded image';

            const showModalImage = () => {
                if (requestId !== openRequestId) return;
                modalImg.src = src;
            };

            const preloadImg = new Image();
            preloadImg.decoding = 'async';
            preloadImg.src = src;

            if (typeof preloadImg.decode === 'function') {
                preloadImg.decode().then(showModalImage).catch(showModalImage);
            } else {
                preloadImg.onload = showModalImage;
                preloadImg.onerror = showModalImage;
            }
        };

        const activateTrigger = (event, trigger) => {
            const src = trigger.getAttribute('data-modal-img');
            if (!src) return;
            event.preventDefault();
            const altText = trigger.getAttribute('data-modal-alt')
                || trigger.getAttribute('aria-label')
                || trigger.getAttribute('alt')
                || '';
            openModal(src, altText);
        };

        modalTriggers.forEach((trigger) => {
            if (!trigger.getAttribute('data-modal-img')) return;
            trigger.classList.add('modal-trigger');

            if (trigger.tagName !== 'A' && trigger.tagName !== 'BUTTON' && !trigger.hasAttribute('tabindex')) {
                trigger.setAttribute('tabindex', '0');
                trigger.setAttribute('role', 'button');
            }

            trigger.addEventListener('click', (event) => activateTrigger(event, trigger));
            trigger.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    activateTrigger(event, trigger);
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
            const isTouchImageTap = event.target === modalImg && !hasFinePointer;
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
});

// ==========================================
// SVGs Parallax Rigging for Creative Graphics
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const svgs = document.querySelectorAll('.creative-svg');
    if (!svgs.length) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        svgs.forEach(svg => {
            const rect = svg.getBoundingClientRect();
            // Check if in viewport
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                // Calculate visible progress
                const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                // Map progress to transform values
                const offset = (progress - 0.5) * 100; // -50 to 50
                
                const layers1 = svg.querySelectorAll('.layer-1');
                const layers2 = svg.querySelectorAll('.layer-2');
                const layers3 = svg.querySelectorAll('.layer-3');
                const layers4 = svg.querySelectorAll('.layer-4');
                const layers5 = svg.querySelectorAll('.layer-5');
                
                layers1.forEach(el => el.style.transform = `translateY(${offset * -0.2}px)`);
                layers2.forEach(el => el.style.transform = `translateY(${offset * -0.6}px)`);
                layers3.forEach(el => el.style.transform = `translateY(${offset * 0.4}px)`);
                layers4.forEach(el => el.style.transform = `translateY(${offset * 0.8}px)`);
                layers5.forEach(el => el.style.transform = `translateY(${offset * 1.5}px)`);
            }
        });
    }, { passive: true });
});

// ==========================================
// Multi-Layer Parallax (Background + Hero Depth)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    if (prefersReducedMotion) return;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const isProjectsPage = document.body.classList.contains('page-projects');
    const pointerParallaxEnabled = enablePointerEffects && !isProjectsPage;
    const backgroundSmoothing = isProjectsPage ? 0.1 : 0.16;
    const scrollIntensity = isProjectsPage ? -0.12 : -0.2;
    const settleEpsilon = 0.12;

    const parallaxBackgrounds = Array.from(document.querySelectorAll('.parallax-bg')).map((layer, index) => {
        const speed = Number.parseFloat(layer.getAttribute('data-speed'));
        return {
            el: layer,
            speed: Number.isFinite(speed) ? speed : 0.08 + index * 0.06,
            baseScale: isProjectsPage ? 1.08 + index * 0.02 : 1.14 + index * 0.04,
            targetX: 0,
            targetY: 0,
            currentX: 0,
            currentY: 0
        };
    });

    const parallaxScenes = Array.from(document.querySelectorAll('[data-parallax-scene]'))
        .map((scene) => {
            const layers = Array.from(scene.querySelectorAll('[data-parallax-depth]'))
                .map((layer) => {
                    const depth = Number.parseFloat(layer.getAttribute('data-parallax-depth'));
                    return {
                        el: layer,
                        depth: Number.isFinite(depth) ? depth : 0
                    };
                })
                .filter((layer) => layer.depth !== 0);

            if (!layers.length) return null;

            const pointerEnabledAttr = scene.getAttribute('data-parallax-pointer');
            const pointerEnabled = pointerEnabledAttr !== 'false';

            return { scene, layers, pointerX: 0, pointerY: 0, pointerEnabled };
        })
        .filter(Boolean);

    if (!parallaxBackgrounds.length && !parallaxScenes.length) return;

    let viewportCenterY = window.innerHeight * 0.5;
    let globalPointerX = 0;
    let globalPointerY = 0;
    let frameRequested = false;

    const requestFrame = () => {
        if (frameRequested) return;
        frameRequested = true;
        window.requestAnimationFrame(render);
    };

    const render = () => {
        frameRequested = false;
        const scrollY = window.scrollY;
        let keepAnimating = false;

        parallaxBackgrounds.forEach((layer, index) => {
            const pointerYInfluence = pointerParallaxEnabled ? globalPointerY * layer.speed * 18 : 0;
            const pointerXInfluence = pointerParallaxEnabled ? globalPointerX * layer.speed * (60 + index * 14) : 0;

            layer.targetY = scrollY * layer.speed * scrollIntensity + pointerYInfluence;
            layer.targetX = pointerXInfluence;

            layer.currentX += (layer.targetX - layer.currentX) * backgroundSmoothing;
            layer.currentY += (layer.targetY - layer.currentY) * backgroundSmoothing;

            if (Math.abs(layer.targetX - layer.currentX) > settleEpsilon || Math.abs(layer.targetY - layer.currentY) > settleEpsilon) {
                keepAnimating = true;
            }

            layer.el.style.transform = `translate3d(${layer.currentX.toFixed(2)}px, ${layer.currentY.toFixed(2)}px, 0) scale(${layer.baseScale})`;
        });

        parallaxScenes.forEach((sceneData) => {
            const rect = sceneData.scene.getBoundingClientRect();
            const sceneCenter = rect.top + rect.height * 0.5;
            const progress = clamp((viewportCenterY - sceneCenter) / Math.max(window.innerHeight * 0.9, 1), -1, 1);

            sceneData.layers.forEach((layer) => {
                const pointerShiftEnabled = pointerParallaxEnabled && sceneData.pointerEnabled;
                const sceneShiftX = pointerShiftEnabled ? sceneData.pointerX * layer.depth * 30 : 0;
                const sceneShiftY = pointerShiftEnabled ? sceneData.pointerY * layer.depth * 20 : 0;
                const scrollShift = progress * layer.depth * 64;
                const globalShift = pointerShiftEnabled ? globalPointerX * layer.depth * 10 : 0;
                const roll = pointerShiftEnabled ? sceneData.pointerX * layer.depth * 3.4 : 0;
                layer.el.style.transform = `translate3d(${(sceneShiftX + globalShift).toFixed(2)}px, ${(sceneShiftY + scrollShift).toFixed(2)}px, 0) rotate(${roll.toFixed(2)}deg)`;
            });
        });

        if (keepAnimating) requestFrame();
    };

    parallaxScenes.forEach((sceneData) => {
        if (!pointerParallaxEnabled || !sceneData.pointerEnabled) return;

        sceneData.scene.addEventListener('pointermove', (event) => {
            if (event.pointerType && event.pointerType !== 'mouse') return;
            const rect = sceneData.scene.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
            const y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;
            sceneData.pointerX = clamp(x, -1, 1);
            sceneData.pointerY = clamp(y, -1, 1);
            requestFrame();
        }, { passive: true });

        sceneData.scene.addEventListener('pointerleave', () => {
            sceneData.pointerX = 0;
            sceneData.pointerY = 0;
            requestFrame();
        });
    });

    if (pointerParallaxEnabled) {
        window.addEventListener('pointermove', (event) => {
            if (event.pointerType && event.pointerType !== 'mouse') return;
            const x = (event.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
            const y = (event.clientY / Math.max(window.innerHeight, 1)) * 2 - 1;
            globalPointerX = clamp(x, -1, 1);
            globalPointerY = clamp(y, -1, 1);
            requestFrame();
        }, { passive: true });

        window.addEventListener('blur', () => {
            globalPointerX = 0;
            globalPointerY = 0;
            parallaxScenes.forEach((sceneData) => {
                sceneData.pointerX = 0;
                sceneData.pointerY = 0;
            });
            requestFrame();
        });
    }

    window.addEventListener('scroll', requestFrame, { passive: true });
    window.addEventListener('resize', () => {
        viewportCenterY = window.innerHeight * 0.5;
        requestFrame();
    });

    requestFrame();
});

// ==========================================
// Research Detail Focus Mode (Method + Skills First)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const pageName = window.location.pathname.split('/').pop() || '';
    const isResearchDetailPage = /^research-.+\.html$/i.test(pageName);
    if (!isResearchDetailPage) return;

    const body = document.body;
    const main = document.querySelector('main');
    const hero = main ? main.querySelector('.research-detail-hero') : null;
    if (!body || !main || !hero) return;

    body.classList.add('page-research-detail');

    const sections = Array.from(main.children).filter((node) => {
        return node.tagName === 'SECTION' && node !== hero;
    });
    if (!sections.length) return;

    const scoreText = (text, keywords) => {
        return keywords.reduce((score, keyword) => score + (text.includes(keyword) ? 1 : 0), 0);
    };

    const classifySection = (section) => {
        const labels = Array.from(section.querySelectorAll('.badge, .section-heading, h2, h3'))
            .map((el) => (el.textContent || '').trim().toLowerCase())
            .join(' ');
        const preview = (section.textContent || '').trim().toLowerCase().slice(0, 600);
        const corpus = `${labels} ${preview}`;

        const methodLabel = /(method|methodology|pipeline|approach|framework|design|modeling|analysis was built|research pipeline|dce structure|econometric)/.test(labels);
        const skillLabel = /(skill|skills|toolkit|applied skills|practical use|how teams can apply|research toolkit)/.test(labels);
        const contextLabel = /(context|challenge|overview|abstract|background|dilemma|focus|objective|snapshot)/.test(labels);
        const insightLabel = /(finding|findings|result|visualization|dashboard|implication|insight|highlights)/.test(labels);

        const methodScore = scoreText(corpus, [
            'method',
            'methodology',
            'framework',
            'pipeline',
            'approach',
            'design',
            'model',
            'modeling',
            'regression',
            'anova',
            'mixed logit',
            'experiment'
        ]);
        const skillScore = scoreText(corpus, [
            'skill',
            'skills',
            'toolkit',
            'applied',
            'practical use',
            'how teams can apply',
            'competenc',
            'capability'
        ]);
        const contextScore = scoreText(corpus, [
            'context',
            'challenge',
            'overview',
            'abstract',
            'background',
            'dilemma',
            'focus',
            'objective',
            'snapshot'
        ]);
        const insightScore = scoreText(corpus, [
            'finding',
            'findings',
            'result',
            'visualization',
            'dashboard',
            'implication',
            'policy',
            'insight',
            'highlights'
        ]);

        let type = 'secondary';
        if (methodLabel || methodScore >= 2) {
            type = 'method';
        } else if (skillLabel || (skillScore > 0 && skillScore >= methodScore && skillScore >= contextScore)) {
            type = 'skill';
        } else if (contextLabel || (contextScore > 0 && contextScore >= methodScore && contextScore >= skillScore)) {
            type = 'context';
        } else if (insightLabel || insightScore > 0) {
            type = 'insight';
        }

        section.classList.add('rd-block', `rd-${type}`);
        if (skillLabel && type === 'method') {
            section.classList.add('rd-skill');
        }
        return type;
    };

    const typeMap = new Map();
    sections.forEach((section) => {
        typeMap.set(section, classifySection(section));
    });

    const ordered = [];
    const pushUnique = (list) => {
        list.forEach((section) => {
            if (!ordered.includes(section)) ordered.push(section);
        });
    };

    pushUnique(sections.filter((section) => typeMap.get(section) === 'method'));
    pushUnique(sections.filter((section) => typeMap.get(section) === 'skill'));
    pushUnique(sections.filter((section) => typeMap.get(section) === 'context'));
    pushUnique(sections.filter((section) => typeMap.get(section) === 'insight'));
    pushUnique(sections.filter((section) => typeMap.get(section) === 'secondary'));

    ordered.forEach((section) => {
        main.appendChild(section);
    });

    const focusSections = ordered.filter((section) => {
        const type = typeMap.get(section);
        return type === 'method' || type === 'skill';
    });
    const supplementarySections = ordered.filter((section) => !focusSections.includes(section));

    // Keep one support section visible; collapse the rest behind a toggle.
    supplementarySections.forEach((section, index) => {
        if (index > 0) section.classList.add('rd-collapsed');
    });

    if (supplementarySections.length > 1) {
        const firstCollapsed = supplementarySections[1];
        const toggleSection = document.createElement('section');
        toggleSection.className = 'section rd-toggle-zone';
        toggleSection.innerHTML = `
            <div class="section-container">
                <button type="button" class="rd-toggle-btn" aria-expanded="false">
                    <span class="rd-toggle-btn-label">Show Full Research Case</span>
                    <i class="ph ph-caret-down" aria-hidden="true"></i>
                </button>
            </div>
        `;

        main.insertBefore(toggleSection, firstCollapsed);

        const toggleButton = toggleSection.querySelector('.rd-toggle-btn');
        const toggleLabel = toggleSection.querySelector('.rd-toggle-btn-label');
        if (toggleButton && toggleLabel) {
            const syncRevealStates = () => {
                if (!body.classList.contains('rd-expanded')) return;
                document.querySelectorAll('.rd-collapsed .reveal').forEach((el) => {
                    el.classList.add('active');
                });
            };

            toggleButton.addEventListener('click', () => {
                const expanded = !body.classList.contains('rd-expanded');
                body.classList.toggle('rd-expanded', expanded);
                toggleButton.setAttribute('aria-expanded', expanded ? 'true' : 'false');
                toggleLabel.textContent = expanded ? 'Collapse Supporting Sections' : 'Show Full Research Case';
                if (expanded) syncRevealStates();
            });
        }
    }

    // Remove duplicated bottom back buttons to keep the layout cleaner.
    const duplicateBackLinks = main.querySelectorAll('a.btn-outline.large[href="projects.html"]');
    duplicateBackLinks.forEach((link) => {
        const container = link.closest('.text-center');
        if (container) {
            container.classList.add('rd-back-duplicate');
            return;
        }
        link.classList.add('rd-back-duplicate');
    });
});
