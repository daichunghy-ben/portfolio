/*
 * EV interaction fallback for file:// usage.
 * Preferred local run mode for development remains: python3 -m http.server
 */
(function initEvFallbackIIFE() {
    if (window.__portfolioMainModuleLoaded) return;

    const EV_PRESETS = {
        manuscript: {
            range: 150,
            charge: 30,
            stations: 100000,
            streamlined: false
        },
        'high-tech': {
            range: 300,
            charge: 45,
            stations: 150000,
            streamlined: false
        },
        'design-plus': {
            range: 150,
            charge: 30,
            stations: 100000,
            streamlined: true
        }
    };

    const MWTP_POINT = {
        pragmatic: {
            range: 133.9,
            charge: 96.0,
            stations: 43.7,
            body: 43.3
        },
        aesthetic: {
            range: 180.0,
            charge: 105.3,
            stations: 60.5,
            body: 67.9
        }
    };

    const MWTP_CI = {
        pragmatic: {
            range: [65.3, 202.5],
            charge: [-6.7, 198.7],
            stations: [-26.4, 113.8],
            body: [-21.8, 108.4]
        },
        aesthetic: {
            range: [100.2, 259.8],
            charge: [19.4, 191.2],
            stations: [21.8, 99.2],
            body: [-24.8, 160.7]
        }
    };

    function unitsFromState(state) {
        return {
            range: state.range / 100,
            charge: state.charge / 15,
            stations: state.stations / 50000,
            body: state.streamlined ? 1 : 0
        };
    }

    function computePoint(coeffs, units) {
        return (coeffs.range * units.range)
            + (coeffs.charge * units.charge)
            + (coeffs.stations * units.stations)
            + (coeffs.body * units.body);
    }

    function computeCi(bounds, units) {
        const lower = (bounds.range[0] * units.range)
            + (bounds.charge[0] * units.charge)
            + (bounds.stations[0] * units.stations)
            + (bounds.body[0] * units.body);

        const upper = (bounds.range[1] * units.range)
            + (bounds.charge[1] * units.charge)
            + (bounds.stations[1] * units.stations)
            + (bounds.body[1] * units.body);

        return [lower, upper];
    }

    function fmt1(value) {
        return Number(value).toFixed(1);
    }

    function fmtInt(value) {
        return Number(value).toLocaleString('en-US');
    }

    function sameState(a, b) {
        return a.range === b.range
            && a.charge === b.charge
            && a.stations === b.stations
            && a.streamlined === b.streamlined;
    }

    function initEvChoiceFallback() {
        const pageRoot = document.querySelector('.page-research-ev');
        if (!pageRoot) return;

        const inputs = {
            range: pageRoot.querySelector('#ev-range-delta'),
            charge: pageRoot.querySelector('#ev-charge-delta'),
            stations: pageRoot.querySelector('#ev-stations-delta'),
            streamlined: pageRoot.querySelector('#ev-streamlined')
        };

        if (Object.values(inputs).some((node) => !node)) return;

        const outputs = {
            range: pageRoot.querySelector('#ev-range-delta-output'),
            charge: pageRoot.querySelector('#ev-charge-delta-output'),
            stations: pageRoot.querySelector('#ev-stations-delta-output'),
            pragmaticPoint: pageRoot.querySelector('#ev-pragmatic-point'),
            aestheticPoint: pageRoot.querySelector('#ev-aesthetic-point'),
            pragmaticCi: pageRoot.querySelector('#ev-pragmatic-ci'),
            aestheticCi: pageRoot.querySelector('#ev-aesthetic-ci'),
            classGap: pageRoot.querySelector('#ev-class-gap'),
            scenarioNote: pageRoot.querySelector('#ev-scenario-note')
        };

        if (!outputs.pragmaticPoint || !outputs.aestheticPoint || !outputs.classGap) return;

        const presetButtons = Array.from(pageRoot.querySelectorAll('.ev-preset'));

        function readState() {
            return {
                range: Number(inputs.range.value),
                charge: Number(inputs.charge.value),
                stations: Number(inputs.stations.value),
                streamlined: Boolean(inputs.streamlined.checked)
            };
        }

        function writeState(state) {
            inputs.range.value = String(state.range);
            inputs.charge.value = String(state.charge);
            inputs.stations.value = String(state.stations);
            inputs.streamlined.checked = Boolean(state.streamlined);
        }

        function syncPreset(state) {
            let matched = false;
            presetButtons.forEach((button) => {
                const presetName = button.dataset.preset || '';
                const preset = EV_PRESETS[presetName];
                const isMatch = Boolean(preset && sameState(state, preset));
                button.classList.toggle('is-active', isMatch);
                if (isMatch) matched = true;
            });

            if (matched) return;
            presetButtons.forEach((button) => button.classList.remove('is-active'));
        }

        function scenarioLabel(state) {
            if (sameState(state, EV_PRESETS.manuscript)) {
                return 'Preloaded manuscript scenario: +150 km range, -30 min charge time, +100,000 stations, no streamlined premium.';
            }

            return `Scenario: +${fmtInt(state.range)} km range, -${fmtInt(state.charge)} min charge time, +${fmtInt(state.stations)} stations, streamlined ${state.streamlined ? 'included' : 'not included'}.`;
        }

        function render(state) {
            if (outputs.range) outputs.range.textContent = `${fmtInt(state.range)} km`;
            if (outputs.charge) outputs.charge.textContent = `${fmtInt(state.charge)} min`;
            if (outputs.stations) outputs.stations.textContent = fmtInt(state.stations);

            const units = unitsFromState(state);

            const pragmaticPoint = computePoint(MWTP_POINT.pragmatic, units);
            const aestheticPoint = computePoint(MWTP_POINT.aesthetic, units);
            const pragmaticCi = computeCi(MWTP_CI.pragmatic, units);
            const aestheticCi = computeCi(MWTP_CI.aesthetic, units);
            const classGap = aestheticPoint - pragmaticPoint;

            outputs.pragmaticPoint.textContent = fmt1(pragmaticPoint);
            outputs.aestheticPoint.textContent = fmt1(aestheticPoint);
            outputs.classGap.textContent = fmt1(classGap);

            if (outputs.pragmaticCi) {
                outputs.pragmaticCi.textContent = `Approx. 95% additive CI: [${fmt1(pragmaticCi[0])}, ${fmt1(pragmaticCi[1])}]`;
            }

            if (outputs.aestheticCi) {
                outputs.aestheticCi.textContent = `Approx. 95% additive CI: [${fmt1(aestheticCi[0])}, ${fmt1(aestheticCi[1])}]`;
            }

            if (outputs.scenarioNote) {
                outputs.scenarioNote.textContent = scenarioLabel(state);
            }

            syncPreset(state);
        }

        presetButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const presetName = button.dataset.preset || '';
                const preset = EV_PRESETS[presetName];
                if (!preset) return;
                writeState(preset);
                render(readState());
            });
        });

        [inputs.range, inputs.charge, inputs.stations].forEach((input) => {
            input.addEventListener('input', () => {
                render(readState());
            });
        });

        inputs.streamlined.addEventListener('change', () => {
            render(readState());
        });

        render(readState());
        window.__evFallbackLoaded = true;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEvChoiceFallback);
    } else {
        initEvChoiceFallback();
    }
}());
