const FALLBACK_DIET_DATA = [
    {
        key: 'processed-meats',
        label: 'Processed Meats',
        reported: {
            consumed_pct: 65.0,
            mean: 0.65,
            sd: 0.48,
            source_ref: 'FCBEM nutrition slide snapshot (diet quality overview table)'
        },
        derived: {
            note: 'Highest reported consumption share in this table, indicating frequent processed meat exposure.'
        }
    }
];

const FALLBACK_PATHWAY_DATA = {
    'nutrition-knowledge': {
        title: 'Nutrition Knowledge',
        captured: 'Validated nutrition literacy and food-decision understanding items from the student survey instrument.',
        why: 'Clarifies whether diet quality limitations are linked to decision literacy rather than only access or routine constraints.',
        action: 'Prioritize first-wave literacy curriculum, label-reading practice, and decision prompts in student settings.'
    },
    'physical-activity': {
        title: 'Physical Activity',
        captured: 'Routine movement behavior indicators captured alongside nutrition responses to contextualize student health habits.',
        why: 'Distinguishes isolated food guidance needs from broader behavior-pattern reinforcement opportunities.',
        action: 'Pair meal planning prompts with movement programs to reinforce sustained behavior loops.'
    },
    'control-factors': {
        title: 'Control Factors',
        captured: 'Demographic and schedule-related context variables used for covariate adjustment in model interpretation.',
        why: 'Prevents over-attribution to knowledge alone by accounting for structural constraints affecting eating behavior.',
        action: 'Segment delivery intensity by readiness and constraints instead of uniform campus-wide rollout.'
    }
};

const DEFAULT_STATE = {
    sortKey: 'consumed',
    sortDirection: 'desc',
    selectedFoodKey: 'processed-meats',
    knowledgeFocus: 'nutrition-knowledge'
};

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function formatPercent(value) {
    return `${Number(value).toFixed(1)}%`;
}

function formatMeanSd(mean, sd) {
    return `${Number(mean).toFixed(2)} (${Number(sd).toFixed(2)})`;
}

function parseJsonScript(id, fallbackValue) {
    const node = document.getElementById(id);
    if (!node) return fallbackValue;

    try {
        return JSON.parse(node.textContent || '');
    } catch (error) {
        console.warn(`Failed to parse ${id}:`, error);
        return fallbackValue;
    }
}

function normalizeDietData(rawData) {
    if (!Array.isArray(rawData)) return [];

    return rawData
        .map((item) => {
            const key = typeof item?.key === 'string' ? item.key.trim() : '';
            const label = typeof item?.label === 'string' ? item.label.trim() : '';
            const consumed = Number(item?.reported?.consumed_pct);
            const mean = Number(item?.reported?.mean);
            const sd = Number(item?.reported?.sd);
            const sourceRef = typeof item?.reported?.source_ref === 'string'
                ? item.reported.source_ref.trim()
                : '';
            const note = typeof item?.derived?.note === 'string'
                ? item.derived.note.trim()
                : '';

            if (!key || !label) return null;
            if (!Number.isFinite(consumed) || !Number.isFinite(mean) || !Number.isFinite(sd)) return null;

            return {
                key,
                label,
                reported: {
                    consumed_pct: clamp(consumed, 0, 100),
                    mean,
                    sd,
                    source_ref: sourceRef || 'FCBEM nutrition slide snapshot (diet quality overview table)'
                },
                derived: {
                    note: note || 'Interpretation is qualitative and derived from the reported table context.'
                }
            };
        })
        .filter(Boolean);
}

function normalizePathwayData(rawData) {
    if (!rawData || typeof rawData !== 'object') {
        return { ...FALLBACK_PATHWAY_DATA };
    }

    const normalized = {};

    Object.entries(rawData).forEach(([key, value]) => {
        if (!value || typeof value !== 'object') return;

        const title = typeof value.title === 'string' ? value.title.trim() : '';
        const captured = typeof value.captured === 'string' ? value.captured.trim() : '';
        const why = typeof value.why === 'string' ? value.why.trim() : '';
        const action = typeof value.action === 'string' ? value.action.trim() : '';

        if (!title || !captured || !why || !action) return;

        normalized[key] = { title, captured, why, action };
    });

    if (Object.keys(normalized).length === 0) {
        return { ...FALLBACK_PATHWAY_DATA };
    }

    return normalized;
}

function sortFoods(foods, sortKey, sortDirection) {
    const sorted = [...foods].sort((a, b) => {
        let baseComparison = 0;

        if (sortKey === 'name') {
            baseComparison = a.label.localeCompare(b.label);
        } else if (sortKey === 'mean') {
            baseComparison = a.reported.mean - b.reported.mean;
        } else {
            baseComparison = a.reported.consumed_pct - b.reported.consumed_pct;
        }

        if (baseComparison === 0) {
            baseComparison = a.label.localeCompare(b.label);
        }

        return sortDirection === 'asc' ? baseComparison : -baseComparison;
    });

    return sorted;
}

function sortSummary(sortKey, sortDirection) {
    const keyLabel = sortKey === 'name'
        ? 'food group'
        : sortKey === 'mean'
            ? 'mean score'
            : 'percent consumed';
    const directionLabel = sortDirection === 'asc' ? 'low to high' : 'high to low';
    return `Diet outcomes sorted by ${keyLabel}, ${directionLabel}.`;
}

function announce(node, message) {
    if (!node) return;
    node.textContent = '';
    window.setTimeout(() => {
        node.textContent = message;
    }, 10);
}

function setLabeledCopy(node, label, value) {
    if (!node) return;
    node.textContent = '';

    const strong = document.createElement('strong');
    strong.textContent = `${label}:`;
    node.appendChild(strong);
    node.append(` ${value}`);
}

function buildFoodRow(food, isActive, sortKey) {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = `nutrition-food-row${isActive ? ' is-active' : ''}`;
    row.dataset.foodKey = food.key;
    row.setAttribute('aria-pressed', isActive ? 'true' : 'false');

    const top = document.createElement('span');
    top.className = 'nutrition-food-top';

    const name = document.createElement('span');
    name.className = 'nutrition-food-name';
    name.textContent = food.label;

    const value = document.createElement('span');
    value.className = `nutrition-food-value${sortKey === 'consumed' ? ' is-sort-metric' : ''}`;
    value.textContent = formatPercent(food.reported.consumed_pct);

    top.append(name, value);

    const meta = document.createElement('span');
    meta.className = 'nutrition-food-meta';

    const mean = document.createElement('span');
    mean.className = `nutrition-food-mean${sortKey === 'mean' ? ' is-sort-metric' : ''}`;
    mean.textContent = `Mean: ${formatMeanSd(food.reported.mean, food.reported.sd)}`;
    meta.appendChild(mean);

    const track = document.createElement('span');
    track.className = 'nutrition-food-track';

    const fill = document.createElement('span');
    fill.className = 'nutrition-food-fill';
    fill.style.width = `${food.reported.consumed_pct}%`;
    track.appendChild(fill);

    row.append(top, meta, track);

    const item = document.createElement('li');
    item.className = 'nutrition-food-item';
    item.appendChild(row);
    return item;
}

export function initNutritionInteraction() {
    const pageRoot = document.querySelector('.page-research-nutrition');
    if (!pageRoot) return;

    const shell = pageRoot.querySelector('.nutrition-lab-shell');
    if (!shell) return;

    const dietDataRaw = parseJsonScript('nutrition-diet-data', FALLBACK_DIET_DATA);
    const pathwayDataRaw = parseJsonScript('nutrition-pathway-data', FALLBACK_PATHWAY_DATA);

    const dietData = normalizeDietData(dietDataRaw);
    const pathwayData = normalizePathwayData(pathwayDataRaw);

    const foods = dietData.length ? dietData : FALLBACK_DIET_DATA;

    const state = {
        ...DEFAULT_STATE,
        selectedFoodKey: foods.some((food) => food.key === DEFAULT_STATE.selectedFoodKey)
            ? DEFAULT_STATE.selectedFoodKey
            : foods[0].key,
        knowledgeFocus: Object.prototype.hasOwnProperty.call(pathwayData, DEFAULT_STATE.knowledgeFocus)
            ? DEFAULT_STATE.knowledgeFocus
            : Object.keys(pathwayData)[0]
    };

    const sortKeyButtons = Array.from(shell.querySelectorAll('[data-sort-key]'));
    const sortDirectionButtons = Array.from(shell.querySelectorAll('[data-sort-direction]'));
    const foodList = shell.querySelector('[data-nutrition-food-list]');
    const detailName = shell.querySelector('[data-detail-field="name"]');
    const detailMean = shell.querySelector('[data-detail-field="mean"]');
    const detailConsumed = shell.querySelector('[data-detail-field="consumed"]');
    const detailSource = shell.querySelector('[data-detail-field="source"]');
    const detailNote = shell.querySelector('[data-detail-field="note"]');
    const knowledgeButtons = Array.from(shell.querySelectorAll('[data-knowledge-focus]'));
    const knowledgeTitle = shell.querySelector('[data-knowledge-field="title"]');
    const knowledgeCaptured = shell.querySelector('[data-knowledge-field="captured"]');
    const knowledgeWhy = shell.querySelector('[data-knowledge-field="why"]');
    const knowledgeAction = shell.querySelector('[data-knowledge-field="action"]');
    const liveRegion = shell.querySelector('[data-nutrition-live]');
    const methodDetails = shell.querySelector('[data-nutrition-method]');
    const methodSummaryState = shell.querySelector('.nutrition-method-summary-state');

    if (!foodList || !detailName || !detailMean || !detailConsumed || !detailSource || !detailNote) return;
    if (!knowledgeTitle || !knowledgeCaptured || !knowledgeWhy || !knowledgeAction) return;

    function getSortedFoods() {
        return sortFoods(foods, state.sortKey, state.sortDirection);
    }

    function ensureSelection(sortedFoods) {
        const selectedExists = sortedFoods.some((food) => food.key === state.selectedFoodKey);
        if (selectedExists) return;
        state.selectedFoodKey = sortedFoods[0] ? sortedFoods[0].key : '';
    }

    function renderSortControls() {
        sortKeyButtons.forEach((button) => {
            const isActive = button.dataset.sortKey === state.sortKey;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        sortDirectionButtons.forEach((button) => {
            const isActive = button.dataset.sortDirection === state.sortDirection;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    }

    function renderFoodList(sortedFoods) {
        foodList.textContent = '';

        sortedFoods.forEach((food) => {
            const row = buildFoodRow(food, food.key === state.selectedFoodKey, state.sortKey);
            foodList.appendChild(row);
        });
    }

    function renderFoodDetail(sortedFoods) {
        const selectedFood = foods.find((food) => food.key === state.selectedFoodKey)
            || sortedFoods[0]
            || foods[0];

        if (!selectedFood) return;

        detailName.textContent = selectedFood.label;
        detailMean.textContent = formatMeanSd(selectedFood.reported.mean, selectedFood.reported.sd);
        detailConsumed.textContent = formatPercent(selectedFood.reported.consumed_pct);
        detailSource.textContent = `Source: ${selectedFood.reported.source_ref}.`;
        detailNote.textContent = selectedFood.derived.note;
        shell.style.setProperty('--nutrition-selected-consumed', (selectedFood.reported.consumed_pct / 100).toFixed(2));
    }

    function renderMethodSummaryState() {
        if (!methodDetails || !methodSummaryState) return;
        methodSummaryState.textContent = methodDetails.open ? 'Collapse' : 'Expand';
    }

    function renderKnowledgeCard() {
        const knowledgeState = pathwayData[state.knowledgeFocus]
            || pathwayData[DEFAULT_STATE.knowledgeFocus]
            || Object.values(pathwayData)[0];

        if (!knowledgeState) return;

        knowledgeButtons.forEach((button) => {
            const isActive = button.dataset.knowledgeFocus === state.knowledgeFocus;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        knowledgeTitle.textContent = knowledgeState.title;
        setLabeledCopy(knowledgeCaptured, 'What was captured', knowledgeState.captured);
        setLabeledCopy(knowledgeWhy, 'Why it matters', knowledgeState.why);
        setLabeledCopy(knowledgeAction, 'Action domain', knowledgeState.action);
    }

    function focusFoodRow(foodKey) {
        if (!foodKey) return;
        const row = foodList.querySelector(`[data-food-key="${foodKey}"]`);
        if (!row) return;
        row.focus();
    }

    function renderDietPanel() {
        const sortedFoods = getSortedFoods();
        ensureSelection(sortedFoods);
        renderSortControls();
        renderFoodList(sortedFoods);
        renderFoodDetail(sortedFoods);
        return sortedFoods;
    }

    function selectFood(foodKey, shouldFocus = false) {
        if (!foodKey || foodKey === state.selectedFoodKey) return;

        const selected = foods.find((food) => food.key === foodKey);
        if (!selected) return;

        state.selectedFoodKey = foodKey;
        renderDietPanel();

        if (shouldFocus) {
            focusFoodRow(foodKey);
        }

        announce(
            liveRegion,
            `${selected.label} selected. ${formatPercent(selected.reported.consumed_pct)} consumed, mean ${formatMeanSd(selected.reported.mean, selected.reported.sd)}.`
        );
    }

    sortKeyButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const nextSortKey = button.dataset.sortKey || '';
            if (!nextSortKey || nextSortKey === state.sortKey) return;

            state.sortKey = nextSortKey;
            renderDietPanel();
            announce(liveRegion, sortSummary(state.sortKey, state.sortDirection));
        });
    });

    sortDirectionButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const nextSortDirection = button.dataset.sortDirection || '';
            if (!nextSortDirection || nextSortDirection === state.sortDirection) return;

            state.sortDirection = nextSortDirection;
            renderDietPanel();
            announce(liveRegion, sortSummary(state.sortKey, state.sortDirection));
        });
    });

    foodList.addEventListener('click', (event) => {
        const trigger = event.target.closest('[data-food-key]');
        if (!trigger) return;

        selectFood(trigger.dataset.foodKey || '');
    });

    foodList.addEventListener('keydown', (event) => {
        const trigger = event.target.closest('[data-food-key]');
        if (!trigger) return;

        const sortedFoods = getSortedFoods();
        const currentKey = trigger.dataset.foodKey || '';
        const currentIndex = sortedFoods.findIndex((food) => food.key === currentKey);
        if (currentIndex < 0) return;

        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            const delta = event.key === 'ArrowDown' ? 1 : -1;
            const nextIndex = (currentIndex + delta + sortedFoods.length) % sortedFoods.length;
            const nextFood = sortedFoods[nextIndex];
            if (nextFood) {
                focusFoodRow(nextFood.key);
            }
            return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            selectFood(currentKey, true);
        }
    });

    knowledgeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const nextFocus = button.dataset.knowledgeFocus || '';
            if (!nextFocus || nextFocus === state.knowledgeFocus) return;
            if (!Object.prototype.hasOwnProperty.call(pathwayData, nextFocus)) return;

            state.knowledgeFocus = nextFocus;
            renderKnowledgeCard();

            const focusData = pathwayData[nextFocus];
            announce(liveRegion, `${focusData.title} focus selected.`);
        });
    });

    if (methodDetails) {
        methodDetails.addEventListener('toggle', () => {
            renderMethodSummaryState();
            announce(liveRegion, methodDetails.open ? 'Method pathway expanded.' : 'Method pathway collapsed.');
        });
    }

    renderDietPanel();
    renderKnowledgeCard();
    renderMethodSummaryState();
}
