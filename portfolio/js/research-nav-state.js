const STORAGE_KEY = 'researchLabNavigationState.v1';
const MAX_STATE_AGE_MS = 1000 * 60 * 60 * 3;

function storageAvailable() {
    try {
        return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
    } catch (error) {
        return false;
    }
}

function readState() {
    if (!storageAvailable()) return null;

    try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (error) {
        return null;
    }
}

function writeState(state) {
    if (!storageAvailable()) return;

    try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        // Ignore storage quota and serialization errors in runtime UX code.
    }
}

export function getResearchLabState() {
    return readState();
}

export function clearResearchLabState() {
    if (!storageAvailable()) return;

    try {
        window.sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        // No-op.
    }
}

export function saveResearchLabState(patch = {}) {
    const current = readState() || {};
    const next = {
        ...current,
        ...patch,
        savedAt: Date.now()
    };
    writeState(next);
    return next;
}

export function requestResearchLabRestore(patch = {}) {
    return saveResearchLabState({
        ...patch,
        restoreOnNextVisit: true
    });
}

export function consumeResearchLabRestoreState() {
    const state = readState();
    if (!state || !state.restoreOnNextVisit) return null;

    const savedAt = Number(state.savedAt);
    if (!Number.isFinite(savedAt) || Date.now() - savedAt > MAX_STATE_AGE_MS) {
        clearResearchLabState();
        return null;
    }

    writeState({
        ...state,
        restoreOnNextVisit: false
    });

    return state;
}
