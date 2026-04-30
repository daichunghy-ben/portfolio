function initResearchChoreography(env) {
    const animatedBlocks = document.querySelectorAll(
        '.research-focus-shell, .research-figure-stage, .research-callout, .method-step, .phase, .evidence-text'
    );

    if (!animatedBlocks.length) return;

    if (env.prefersReducedMotion) {
        animatedBlocks.forEach((block) => block.classList.add('rm-revealed'));
        return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('rm-revealed');
            currentObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -8% 0px'
    });

    animatedBlocks.forEach((block) => observer.observe(block));
}

function initChartStates(env) {
    const chartFigures = Array.from(document.querySelectorAll('figure.research-figure-stage'))
        .filter((figure) => figure.querySelector('svg'));

    if (!chartFigures.length) return;

    if (env.prefersReducedMotion) {
        chartFigures.forEach((figure) => figure.classList.add('chart-active'));
        return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('chart-active');
            currentObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.35
    });

    chartFigures.forEach((figure) => observer.observe(figure));
}

export function initResearchMotion(env, page) {
    if (page !== 'research') return;

    initResearchChoreography(env);
    initChartStates(env);
}
