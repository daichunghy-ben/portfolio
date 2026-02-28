import {
    createEnv,
    initSeoMetaNormalization,
    initSmoothScroll,
    initMagnetic,
    initTilt,
    initReveal,
    initImageDefaults,
    initPrintButtons,
    initLinkSecurity
} from './core.js';
import { initNav } from './nav.js';

window.__portfolioMainModuleLoaded = true;

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', async () => {
    const page = document.body.getAttribute('data-page') || 'home';
    const env = createEnv();

    initSeoMetaNormalization();
    initSmoothScroll(env);
    initMagnetic(env);
    initTilt(env);
    initReveal(env);
    initImageDefaults(page);
    initPrintButtons();
    initLinkSecurity();
    initNav(env);

    try {
        const { initResearchManifest } = await import('./research-manifest.js');
        await initResearchManifest(page);
    } catch (error) {
        console.warn('Research manifest init skipped due to error:', error);
    }

    if (page === 'home' || page === 'projects') {
        try {
            const { initResearchCarousel } = await import('./carousel.js');
            initResearchCarousel(env);
        } catch (error) {
            console.error('Carousel initialization failed:', error);
        }

        try {
            const { initModal } = await import('./modal.js');
            initModal(env);
        } catch (error) {
            console.error('Modal initialization failed:', error);
        }

        try {
            const { initParallax } = await import('./parallax.js');
            initParallax(env, page);
        } catch (error) {
            console.warn('Parallax initialization skipped due to error:', error);
        }

        return;
    }

    if (page === 'research') {
        const [detailModule, motionModule, evModule, motorbikeModule, nutritionModule] = await Promise.allSettled([
            import('./research-detail.js'),
            import('./research-motion.js'),
            import('./research-ev-interaction.js'),
            import('./research-motorbike-interaction.js'),
            import('./research-nutrition-interaction.js')
        ]);

        if (detailModule.status === 'fulfilled' && typeof detailModule.value.initResearchDetail === 'function') {
            const runDetailInit = () => detailModule.value.initResearchDetail(page);
            if ('requestIdleCallback' in window) {
                window.requestIdleCallback(runDetailInit, { timeout: 1500 });
            } else {
                window.setTimeout(runDetailInit, 320);
            }
        } else if (detailModule.status === 'rejected') {
            console.error('Research detail initialization failed:', detailModule.reason);
        }

        if (motionModule.status === 'fulfilled' && typeof motionModule.value.initResearchMotion === 'function') {
            motionModule.value.initResearchMotion(env, page);
        } else if (motionModule.status === 'rejected') {
            console.error('Research motion initialization failed:', motionModule.reason);
        }

        if (evModule.status === 'fulfilled' && typeof evModule.value.initEvChoiceInteraction === 'function') {
            evModule.value.initEvChoiceInteraction();
        } else if (evModule.status === 'rejected') {
            console.error('EV interaction initialization failed:', evModule.reason);
        }

        if (motorbikeModule.status === 'fulfilled' && typeof motorbikeModule.value.initMotorbikePolicyInteraction === 'function') {
            motorbikeModule.value.initMotorbikePolicyInteraction();
        } else if (motorbikeModule.status === 'rejected') {
            console.error('Motorbike interaction initialization failed:', motorbikeModule.reason);
        }

        if (nutritionModule.status === 'fulfilled' && typeof nutritionModule.value.initNutritionInteraction === 'function') {
            nutritionModule.value.initNutritionInteraction();
        } else if (nutritionModule.status === 'rejected') {
            console.error('Nutrition interaction initialization failed:', nutritionModule.reason);
        }
    }
});
