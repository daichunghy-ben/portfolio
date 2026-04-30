/*
 * Motorbike interaction fallback for file:// usage.
 * Preferred local run mode for development remains: python3 -m http.server
 */
(function initMotorbikeFallbackIIFE() {
    if (window.__portfolioMainModuleLoaded) return;

    const MOTORBIKE_PRESETS = {
        pushFirst: {
            push: 82,
            pull: 25,
            support: 20,
            trust: 30
        },
        pullSupport: {
            push: 39,
            pull: 74,
            support: 74,
            trust: 68
        },
        supportCalibrated: {
            push: 61,
            pull: 60,
            support: 67,
            trust: 60
        },
        alternativesFirst: {
            push: 51,
            pull: 68,
            support: 64,
            trust: 68
        }
    };

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function formatPercent(value) {
        return `${Math.round(value)}%`;
    }

    function formatSignedPoints(value) {
        const rounded = Math.round(value);
        const sign = rounded > 0 ? '+' : '';
        return `${sign}${rounded} pts`;
    }

    function formatDeltaU(value) {
        const sign = value > 0 ? '+' : '';
        return `ΔU = ${sign}${value.toFixed(2)}`;
    }

    function acceptanceLabel(score) {
        if (score >= 75) return 'High';
        if (score >= 60) return 'Moderate';
        if (score >= 45) return 'Fragile';
        return 'Resistant';
    }

    function samePreset(state, preset) {
        return state.push === preset.push
            && state.pull === preset.pull
            && state.support === preset.support
            && state.trust === preset.trust;
    }

    function phaseStatus(score) {
        if (score >= 75) return 'ready';
        if (score >= 60) return 'watch';
        return 'weak';
    }

    function pickPrimaryLever(state) {
        const leverCandidates = [
            { label: 'Reduce push intensity', gain: (state.push / 100) * 1.967 },
            { label: 'Improve pull quality', gain: ((100 - state.pull) / 100) * 2.093 },
            { label: 'Expand support depth', gain: ((100 - state.support) / 100) * 1.271 },
            { label: 'Increase trust credibility', gain: ((100 - state.trust) / 100) * 0.281 }
        ];

        leverCandidates.sort((a, b) => b.gain - a.gain);
        return leverCandidates[0].label;
    }

    function buildGuidance({
        state,
        deltaU,
        acceptanceScore,
        alternativeReadiness,
        burdenPressure,
        transitionTrust,
        readinessGap,
        compensationGap,
        trustBuffer,
        phaseScores
    }) {
        let headline = 'Increase pull and support before stronger restrictions.';

        if (phaseScores.restrict >= 75 && readinessGap >= 8 && trustBuffer >= 0 && compensationGap >= 0) {
            headline = 'Current conditions allow a calibrated restriction increase with monitoring.';
        } else if (phaseScores.calibrate >= 65 && deltaU > 0.6) {
            headline = 'Current sequence is workable; keep pull and support ahead of restrictions.';
        }

        const risks = [];
        if (state.push > state.pull + 12) {
            risks.push('Push level is higher than pull readiness.');
        }
        if (state.push > state.support + 10) {
            risks.push('Support level is lower than burden from restrictions.');
        }
        if (state.trust < 50 && state.push > 50) {
            risks.push('Low trust with high push may increase resistance.');
        }
        if (alternativeReadiness < 62) {
            risks.push('Alternative readiness is below the transition threshold.');
        }
        if (acceptanceScore < 55 || deltaU < 0) {
            risks.push('Utility shift is weak; improve pull and support first.');
        }
        if (burdenPressure > 72 && transitionTrust < 62) {
            risks.push('High burden with modest trust signals backlash risk.');
        }
        if (!risks.length) {
            risks.push('No major risk flags in this scenario.');
        }

        return {
            headline,
            risks: risks.slice(0, 3)
        };
    }

    function initMotorbikePolicyFallback() {
        const pageRoot = document.querySelector('.page-research-motorbike-ban');
        if (!pageRoot) return;

        const shell = pageRoot.querySelector('.mb-lab-shell');
        const stage = pageRoot.querySelector('#mb-stage');
        const scoreNode = pageRoot.querySelector('#mb-score');
        const likelihoodNode = pageRoot.querySelector('#mb-likelihood');

        if (!shell || !stage || !scoreNode || !likelihoodNode) return;

        const inputs = {
            push: pageRoot.querySelector('#mb-push'),
            pull: pageRoot.querySelector('#mb-pull'),
            support: pageRoot.querySelector('#mb-support'),
            trust: pageRoot.querySelector('#mb-trust')
        };

        const outputs = {
            push: pageRoot.querySelector('#mb-push-output'),
            pull: pageRoot.querySelector('#mb-pull-output'),
            support: pageRoot.querySelector('#mb-support-output'),
            trust: pageRoot.querySelector('#mb-trust-output')
        };

        const metricBars = {
            alternativeReadiness: pageRoot.querySelector('[data-impact="alternativeReadiness"]'),
            burdenPressure: pageRoot.querySelector('[data-impact="burdenPressure"]'),
            transitionTrust: pageRoot.querySelector('[data-impact="transitionTrust"]')
        };

        const metricLabels = {
            alternativeReadiness: pageRoot.querySelector('[data-impact-label="alternativeReadiness"]'),
            burdenPressure: pageRoot.querySelector('[data-impact-label="burdenPressure"]'),
            transitionTrust: pageRoot.querySelector('[data-impact-label="transitionTrust"]')
        };

            const diagnosticNodes = {
                readinessGap: pageRoot.querySelector('#mb-readiness-gap'),
                compensationGap: pageRoot.querySelector('#mb-comp-gap'),
                trustBuffer: pageRoot.querySelector('#mb-trust-buffer'),
                deltaU: pageRoot.querySelector('#mb-delta-u'),
                highChance: pageRoot.querySelector('#mb-high-chance'),
                primaryLever: pageRoot.querySelector('#mb-primary-lever')
            };

        const phaseRows = {
            pull: pageRoot.querySelector('[data-phase-row="pull"]'),
            support: pageRoot.querySelector('[data-phase-row="support"]'),
            calibrate: pageRoot.querySelector('[data-phase-row="calibrate"]'),
            restrict: pageRoot.querySelector('[data-phase-row="restrict"]')
        };

        const phaseBars = {
            pull: pageRoot.querySelector('[data-phase-score="pull"]'),
            support: pageRoot.querySelector('[data-phase-score="support"]'),
            calibrate: pageRoot.querySelector('[data-phase-score="calibrate"]'),
            restrict: pageRoot.querySelector('[data-phase-score="restrict"]')
        };

        const phaseLabels = {
            pull: pageRoot.querySelector('[data-phase-label="pull"]'),
            support: pageRoot.querySelector('[data-phase-label="support"]'),
            calibrate: pageRoot.querySelector('[data-phase-label="calibrate"]'),
            restrict: pageRoot.querySelector('[data-phase-label="restrict"]')
        };

        const guidanceHeadline = pageRoot.querySelector('#mb-guidance-headline');
        const riskList = pageRoot.querySelector('#mb-risk-list');
        const presetButtons = Array.from(pageRoot.querySelectorAll('.mb-preset'));

        if (Object.values(inputs).some((input) => !input)) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function readState() {
            return {
                push: Number(inputs.push.value),
                pull: Number(inputs.pull.value),
                support: Number(inputs.support.value),
                trust: Number(inputs.trust.value)
            };
        }

        function syncPresetState(state) {
            let matched = false;
            presetButtons.forEach((button) => {
                const presetName = button.dataset.preset || '';
                const preset = MOTORBIKE_PRESETS[presetName];
                const isMatch = Boolean(preset && samePreset(state, preset));
                button.classList.toggle('is-active', isMatch);
                if (isMatch) matched = true;
            });

            if (matched) return;
            presetButtons.forEach((button) => button.classList.remove('is-active'));
        }

        function render(state) {
            Object.entries(state).forEach(([key, value]) => {
                const output = outputs[key];
                if (output) output.textContent = formatPercent(value);
            });

            const pushN = state.push / 100;
            const pullN = state.pull / 100;
            const supportN = state.support / 100;
            const trustN = state.trust / 100;

            // Coefficient-linked utility proxy from reported signs and magnitudes.
            const betaPush = -1.967;
            const betaPull = 2.093;
            const betaSupport = 1.271;
            const betaTrust = 0.281;

            const deltaU = (
                (betaPush * pushN)
                + (betaPull * pullN)
                + (betaSupport * supportN)
                + (betaTrust * trustN)
            );

            const acceptanceScore = clamp(
                Math.round(50 + (18 * deltaU)),
                0,
                100
            );

            const alternativeReadiness = clamp(
                Math.round((((2.093 * state.pull) + (1.271 * state.support)) / (2.093 + 1.271))),
                0,
                100
            );
            const burdenPressure = clamp(
                Math.round((0.78 * state.push) + (0.22 * (100 - state.support))),
                0,
                100
            );
            const transitionTrust = clamp(
                Math.round((0.72 * state.trust) + (0.28 * state.support)),
                0,
                100
            );
            const readinessGap = alternativeReadiness - burdenPressure;
            const compensationGap = state.support - state.push;
            const trustBuffer = transitionTrust - Math.round(burdenPressure * 0.60);

            scoreNode.textContent = String(acceptanceScore);
            likelihoodNode.textContent = acceptanceLabel(acceptanceScore);

            const metrics = {
                alternativeReadiness,
                burdenPressure,
                transitionTrust
            };

            Object.entries(metrics).forEach(([key, value]) => {
                const rounded = clamp(Math.round(value), 0, 100);
                if (metricBars[key]) metricBars[key].style.width = `${rounded}%`;
                if (metricLabels[key]) metricLabels[key].textContent = `${rounded}%`;
            });

            const phaseScores = {
                pull: clamp(Math.round((0.78 * state.pull) + (0.22 * state.trust)), 0, 100),
                support: clamp(Math.round((0.76 * state.support) + (0.24 * state.trust)), 0, 100),
                calibrate: clamp(
                    Math.round(
                        (0.48 * alternativeReadiness)
                        + (0.26 * transitionTrust)
                        - (0.22 * burdenPressure)
                        + 24
                    ),
                    0,
                    100
                ),
                restrict: clamp(
                    Math.round(
                        (0.50 * acceptanceScore)
                        + (0.30 * alternativeReadiness)
                        + (0.20 * transitionTrust)
                        - (0.28 * burdenPressure)
                        + 15
                    ),
                    0,
                    100
                )
            };

            Object.entries(phaseScores).forEach(([key, value]) => {
                if (phaseBars[key]) phaseBars[key].style.width = `${value}%`;
                if (phaseLabels[key]) phaseLabels[key].textContent = `${value}%`;
                if (phaseRows[key]) phaseRows[key].dataset.status = phaseStatus(value);
            });

            const highChance = clamp(
                Math.round(100 / (1 + Math.exp(-((deltaU - 0.25) * 2.7)))),
                1,
                99
            );

            if (diagnosticNodes.readinessGap) {
                diagnosticNodes.readinessGap.textContent = formatSignedPoints(readinessGap);
                diagnosticNodes.readinessGap.classList.toggle('is-negative', readinessGap < 0);
                diagnosticNodes.readinessGap.classList.toggle('is-positive', readinessGap >= 0);
            }
            if (diagnosticNodes.compensationGap) {
                diagnosticNodes.compensationGap.textContent = formatSignedPoints(compensationGap);
                diagnosticNodes.compensationGap.classList.toggle('is-negative', compensationGap < 0);
                diagnosticNodes.compensationGap.classList.toggle('is-positive', compensationGap >= 0);
            }
            if (diagnosticNodes.trustBuffer) {
                diagnosticNodes.trustBuffer.textContent = formatSignedPoints(trustBuffer);
                diagnosticNodes.trustBuffer.classList.toggle('is-negative', trustBuffer < 0);
                diagnosticNodes.trustBuffer.classList.toggle('is-positive', trustBuffer >= 0);
            }
            if (diagnosticNodes.deltaU) {
                diagnosticNodes.deltaU.textContent = formatDeltaU(deltaU);
                diagnosticNodes.deltaU.classList.toggle('is-negative', deltaU < 0);
                diagnosticNodes.deltaU.classList.toggle('is-positive', deltaU >= 0);
            }
            if (diagnosticNodes.highChance) diagnosticNodes.highChance.textContent = `${highChance}%`;
            if (diagnosticNodes.primaryLever) diagnosticNodes.primaryLever.textContent = pickPrimaryLever(state);

            const guidance = buildGuidance({
                state,
                deltaU,
                acceptanceScore,
                alternativeReadiness,
                burdenPressure,
                transitionTrust,
                readinessGap,
                compensationGap,
                trustBuffer,
                phaseScores
            });
            if (guidanceHeadline) guidanceHeadline.textContent = guidance.headline;
            if (riskList) {
                riskList.textContent = '';
                guidance.risks.forEach((item) => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    riskList.appendChild(li);
                });
            }

            const progress = 12 + (acceptanceScore * 0.76);
            const hue = clamp(8 + Math.round(acceptanceScore * 1.2), 8, 130);
            const warning = clamp((burdenPressure / 100) * 0.56, 0.08, 0.62);
            const lane = clamp(alternativeReadiness / 100, 0, 1);
            const trust = clamp(transitionTrust / 100, 0, 1);
            const speed = clamp(1.85 - (lane * 0.95), 0.7, 1.85);
            const lift = Math.round((lane * 8) - (warning * 6));

            shell.style.setProperty('--mb-progress', `${progress}%`);
            shell.style.setProperty('--mb-hue', String(hue));
            shell.style.setProperty('--mb-warning', warning.toFixed(2));
            shell.style.setProperty('--mb-lane', lane.toFixed(2));
            shell.style.setProperty('--mb-trust', trust.toFixed(2));
            shell.style.setProperty('--mb-speed', `${speed.toFixed(2)}s`);
            shell.style.setProperty('--mb-lift', `${lift}px`);
            shell.style.setProperty('--mb-acceptance', (acceptanceScore / 100).toFixed(2));
            shell.style.setProperty('--mb-burden-ratio', (burdenPressure / 100).toFixed(2));

            syncPresetState(state);
        }

        presetButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const presetName = button.dataset.preset || '';
                const preset = MOTORBIKE_PRESETS[presetName];
                if (!preset) return;

                Object.entries(preset).forEach(([key, value]) => {
                    if (inputs[key]) inputs[key].value = String(value);
                });

                render(readState());
            });
        });

        Object.values(inputs).forEach((input) => {
            input.addEventListener('input', () => {
                render(readState());
            });
        });

        if (!reducedMotion) {
            let stageRect = null;
            let pointerClientX = 0;
            let pointerClientY = 0;
            let pointerRafId = 0;

            const measureRect = () => {
                stageRect = stage.getBoundingClientRect();
            };

            const renderPointer = () => {
                pointerRafId = 0;
                if (!stageRect) measureRect();
                if (!stageRect || !stageRect.width || !stageRect.height) return;

                const relX = (pointerClientX - stageRect.left) / stageRect.width;
                const relY = (pointerClientY - stageRect.top) / stageRect.height;
                const tiltY = clamp((relX - 0.5) * 8, -5, 5);
                const tiltX = clamp((0.5 - relY) * 7, -4, 4);

                shell.style.setProperty('--mb-tilt-y', `${tiltY.toFixed(2)}deg`);
                shell.style.setProperty('--mb-tilt-x', `${tiltX.toFixed(2)}deg`);
                shell.style.setProperty('--mb-pointer-x', `${(relX * 100).toFixed(2)}%`);
                shell.style.setProperty('--mb-pointer-y', `${(relY * 100).toFixed(2)}%`);
            };

            const queuePointerRender = () => {
                if (pointerRafId) return;
                pointerRafId = window.requestAnimationFrame(renderPointer);
            };

            stage.addEventListener('pointerenter', (event) => {
                if (event.pointerType && event.pointerType !== 'mouse') return;
                pointerClientX = event.clientX;
                pointerClientY = event.clientY;
                measureRect();
                queuePointerRender();
            });

            stage.addEventListener('pointermove', (event) => {
                if (event.pointerType && event.pointerType !== 'mouse') return;
                pointerClientX = event.clientX;
                pointerClientY = event.clientY;
                queuePointerRender();
            }, { passive: true });

            stage.addEventListener('pointerleave', () => {
                if (pointerRafId) {
                    window.cancelAnimationFrame(pointerRafId);
                    pointerRafId = 0;
                }
                shell.style.setProperty('--mb-tilt-y', '0deg');
                shell.style.setProperty('--mb-tilt-x', '0deg');
                shell.style.setProperty('--mb-pointer-x', '62%');
                shell.style.setProperty('--mb-pointer-y', '38%');
            });

            window.addEventListener('resize', () => {
                stageRect = null;
            }, { passive: true });

            window.addEventListener('scroll', () => {
                stageRect = null;
            }, { passive: true });
        }

        render(readState());
        window.__motorbikeFallbackLoaded = true;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMotorbikePolicyFallback);
    } else {
        initMotorbikePolicyFallback();
    }
}());
