export function initParallax(env, page) {
    if (env.prefersReducedMotion) return;

    const isProjectsPage = page === 'projects';
    const isResearchPage = page === 'research';
    const allowHeavyParallax = !(isProjectsPage || isResearchPage) && env.enablePointerEffects;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    const backgroundLayers = Array.from(document.querySelectorAll('.parallax-bg')).map((layer, index) => {
        const speed = Number.parseFloat(layer.getAttribute('data-speed'));
        return {
            el: layer,
            speed: Number.isFinite(speed) ? speed : 0.08 + index * 0.06,
            baseScale: isProjectsPage ? 1.08 + index * 0.02 : 1.12 + index * 0.04,
            targetX: 0,
            targetY: 0,
            currentX: 0,
            currentY: 0
        };
    });

    const scenes = Array.from(document.querySelectorAll('[data-parallax-scene]'))
        .map((scene) => {
            const layers = Array.from(scene.querySelectorAll('[data-parallax-depth]'))
                .map((layer) => {
                    const depth = Number.parseFloat(layer.getAttribute('data-parallax-depth'));
                    return { el: layer, depth: Number.isFinite(depth) ? depth : 0 };
                })
                .filter((layer) => layer.depth !== 0);

            if (!layers.length) return null;

            return {
                scene,
                layers,
                pointerEnabled: scene.getAttribute('data-parallax-pointer') !== 'false',
                pointerX: 0,
                pointerY: 0,
                pointerClientX: 0,
                pointerClientY: 0,
                pointerRafId: 0
            };
        })
        .filter(Boolean);

    const lightweightElements = Array.from(document.querySelectorAll('.parallax-element'))
        .map((element) => {
            const speed = Number.parseFloat(element.getAttribute('data-speed'));
            return {
                element,
                speed: Number.isFinite(speed) ? speed : 0.04
            };
        });

    if (!backgroundLayers.length && !scenes.length && !lightweightElements.length) return;

    let disableAdvanced = window.innerWidth < 900 || !allowHeavyParallax;
    let viewportCenterY = window.innerHeight * 0.5;
    let globalPointerX = 0;
    let globalPointerY = 0;
    let globalPointerClientX = 0;
    let globalPointerClientY = 0;
    let globalPointerRafId = 0;
    let frameRequested = false;
    const hasIntersectionObserver = 'IntersectionObserver' in window;

    const visibleScenes = new Set();
    const visibleLightweightElements = new Set();

    if (hasIntersectionObserver) {
        const sceneObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const sceneData = scenes.find((item) => item.scene === entry.target);
                if (!sceneData) return;
                if (entry.isIntersecting) {
                    visibleScenes.add(sceneData);
                } else {
                    visibleScenes.delete(sceneData);
                }
            });
            requestFrame();
        }, { threshold: 0, rootMargin: '20% 0px 20% 0px' });

        scenes.forEach((sceneData) => {
            sceneObserver.observe(sceneData.scene);
        });

        const lightweightObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const data = lightweightElements.find((item) => item.element === entry.target);
                if (!data) return;
                if (entry.isIntersecting) {
                    visibleLightweightElements.add(data);
                } else {
                    visibleLightweightElements.delete(data);
                }
            });
            requestFrame();
        }, { threshold: 0, rootMargin: '20% 0px 20% 0px' });

        lightweightElements.forEach((data) => {
            lightweightObserver.observe(data.element);
        });
    } else {
        scenes.forEach((sceneData) => visibleScenes.add(sceneData));
        lightweightElements.forEach((data) => visibleLightweightElements.add(data));
    }

    const requestFrame = () => {
        if (frameRequested) return;
        frameRequested = true;
        window.requestAnimationFrame(render);
    };

    const render = () => {
        frameRequested = false;

        const scrollY = window.scrollY;
        let keepAnimating = false;

        backgroundLayers.forEach((layer, index) => {
            const pointerYInfluence = disableAdvanced ? 0 : globalPointerY * layer.speed * 16;
            const pointerXInfluence = disableAdvanced ? 0 : globalPointerX * layer.speed * (50 + index * 10);
            const intensity = isProjectsPage ? -0.1 : -0.16;

            layer.targetY = scrollY * layer.speed * intensity + pointerYInfluence;
            layer.targetX = pointerXInfluence;

            const smoothing = isProjectsPage ? 0.12 : 0.16;
            layer.currentX += (layer.targetX - layer.currentX) * smoothing;
            layer.currentY += (layer.targetY - layer.currentY) * smoothing;

            if (Math.abs(layer.targetX - layer.currentX) > 0.1 || Math.abs(layer.targetY - layer.currentY) > 0.1) {
                keepAnimating = true;
            }

            layer.el.style.transform = `translate3d(${layer.currentX.toFixed(2)}px, ${layer.currentY.toFixed(2)}px, 0) scale(${layer.baseScale})`;
        });

        if (!disableAdvanced) {
            const scenesToRender = hasIntersectionObserver ? Array.from(visibleScenes) : scenes;
            scenesToRender.forEach((sceneData) => {
                const rect = sceneData.scene.getBoundingClientRect();
                const sceneCenter = rect.top + rect.height * 0.5;
                const progress = clamp((viewportCenterY - sceneCenter) / Math.max(window.innerHeight * 0.9, 1), -1, 1);

                sceneData.layers.forEach((layer) => {
                    const usePointer = allowHeavyParallax && sceneData.pointerEnabled;
                    const sceneShiftX = usePointer ? sceneData.pointerX * layer.depth * 28 : 0;
                    const sceneShiftY = usePointer ? sceneData.pointerY * layer.depth * 18 : 0;
                    const scrollShift = progress * layer.depth * 52;
                    const globalShift = usePointer ? globalPointerX * layer.depth * 8 : 0;
                    const roll = usePointer ? sceneData.pointerX * layer.depth * 2.6 : 0;
                    layer.el.style.transform = `translate3d(${(sceneShiftX + globalShift).toFixed(2)}px, ${(sceneShiftY + scrollShift).toFixed(2)}px, 0) rotate(${roll.toFixed(2)}deg)`;
                });
            });
        }

        const lightweightToRender = hasIntersectionObserver
            ? Array.from(visibleLightweightElements)
            : lightweightElements;
        if (lightweightToRender.length) {
            lightweightToRender.forEach(({ element, speed }) => {
                const rect = element.getBoundingClientRect();
                const center = rect.top + rect.height * 0.5;
                const offset = clamp((viewportCenterY - center) / Math.max(window.innerHeight, 1), -1, 1);
                const shift = offset * speed * 80;
                element.style.setProperty('--parallax-shift', `${shift.toFixed(2)}px`);
            });
        }

        if (keepAnimating) requestFrame();
    };

    if (!disableAdvanced) {
        scenes.forEach((sceneData) => {
            if (!sceneData.pointerEnabled) return;
            sceneData.scene.addEventListener('pointermove', (event) => {
                if (event.pointerType && event.pointerType !== 'mouse') return;
                sceneData.pointerClientX = event.clientX;
                sceneData.pointerClientY = event.clientY;
                if (sceneData.pointerRafId) return;

                sceneData.pointerRafId = window.requestAnimationFrame(() => {
                    sceneData.pointerRafId = 0;
                    const rect = sceneData.scene.getBoundingClientRect();
                    const x = ((sceneData.pointerClientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
                    const y = ((sceneData.pointerClientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;
                    sceneData.pointerX = clamp(x, -1, 1);
                    sceneData.pointerY = clamp(y, -1, 1);
                    requestFrame();
                });
            }, { passive: true });

            sceneData.scene.addEventListener('pointerleave', () => {
                if (sceneData.pointerRafId) {
                    window.cancelAnimationFrame(sceneData.pointerRafId);
                    sceneData.pointerRafId = 0;
                }
                sceneData.pointerX = 0;
                sceneData.pointerY = 0;
                requestFrame();
            });
        });

        window.addEventListener('pointermove', (event) => {
            if (event.pointerType && event.pointerType !== 'mouse') return;
            globalPointerClientX = event.clientX;
            globalPointerClientY = event.clientY;
            if (globalPointerRafId) return;

            globalPointerRafId = window.requestAnimationFrame(() => {
                globalPointerRafId = 0;
                const x = (globalPointerClientX / Math.max(window.innerWidth, 1)) * 2 - 1;
                const y = (globalPointerClientY / Math.max(window.innerHeight, 1)) * 2 - 1;
                globalPointerX = clamp(x, -1, 1);
                globalPointerY = clamp(y, -1, 1);
                requestFrame();
            });
        }, { passive: true });

        window.addEventListener('blur', () => {
            if (globalPointerRafId) {
                window.cancelAnimationFrame(globalPointerRafId);
                globalPointerRafId = 0;
            }
            globalPointerX = 0;
            globalPointerY = 0;
            scenes.forEach((sceneData) => {
                if (sceneData.pointerRafId) {
                    window.cancelAnimationFrame(sceneData.pointerRafId);
                    sceneData.pointerRafId = 0;
                }
                sceneData.pointerX = 0;
                sceneData.pointerY = 0;
            });
            requestFrame();
        });
    }

    window.addEventListener('scroll', requestFrame, { passive: true });
    window.addEventListener('resize', () => {
        disableAdvanced = window.innerWidth < 900 || !allowHeavyParallax;
        viewportCenterY = window.innerHeight * 0.5;
        requestFrame();
    });

    requestFrame();
}
