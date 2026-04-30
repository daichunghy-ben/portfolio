const LANGUAGE_STORAGE_KEY = 'portfolio.languageChoice.v1';
const LANGUAGE_COOKIE_NAME = 'portfolio_language';
const VALID_LANGUAGES = new Set(['en', 'vi']);

const normalizeLanguage = (value) => {
    const normalized = String(value || '').toLowerCase();
    return VALID_LANGUAGES.has(normalized) ? normalized : '';
};

const readCookie = (name) => {
    const prefix = `${encodeURIComponent(name)}=`;
    return document.cookie
        .split(';')
        .map((part) => part.trim())
        .find((part) => part.startsWith(prefix))
        ?.slice(prefix.length) || '';
};

const writeCookie = (name, value) => {
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Max-Age=31536000; Path=/; SameSite=Lax`;
};

const readStoredLanguage = () => {
    try {
        const stored = normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
        if (stored) return stored;
    } catch {
        // Cookie fallback covers private browsing or restricted storage contexts.
    }

    try {
        return normalizeLanguage(decodeURIComponent(readCookie(LANGUAGE_COOKIE_NAME)));
    } catch {
        return '';
    }
};

const writeStoredLanguage = (language) => {
    const normalized = normalizeLanguage(language);
    if (!normalized) return false;

    let wroteStorage = false;
    try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
        wroteStorage = true;
    } catch {
        wroteStorage = false;
    }

    try {
        writeCookie(LANGUAGE_COOKIE_NAME, normalized);
        return true;
    } catch {
        return wroteStorage;
    }
};

let languageSwitcherBound = false;

const bindLanguageSwitcher = () => {
    if (languageSwitcherBound) return;
    languageSwitcherBound = true;

    document.addEventListener('click', (event) => {
        const link = event.target.closest('.language-switcher__link[hreflang]');
        if (!link) return;

        const language = normalizeLanguage(link.getAttribute('hreflang'));
        if (!language) return;

        writeStoredLanguage(language);
    });
};

const getCurrentLanguage = () => {
    const htmlLanguage = normalizeLanguage(document.documentElement.getAttribute('lang'));
    if (htmlLanguage) return htmlLanguage;

    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    return pathSegments.includes('vi') ? 'vi' : 'en';
};

const buildLanguageUrl = (language) => {
    const targetLanguage = normalizeLanguage(language) || 'en';
    const target = new URL(window.location.href);
    const segments = target.pathname.split('/');
    const viIndex = segments.indexOf('vi');

    if (targetLanguage === 'vi') {
        if (viIndex === -1) {
            const insertAt = Math.max(segments.length - 1, 1);
            segments.splice(insertAt, 0, 'vi');
            target.pathname = segments.join('/').replace(/\/{2,}/g, '/');
        }
        return target;
    }

    if (viIndex !== -1) {
        segments.splice(viIndex, 1);
        target.pathname = segments.join('/').replace(/\/{2,}/g, '/') || '/';
    }

    return target;
};

const redirectToLanguage = (language, replace = false) => {
    const targetLanguage = normalizeLanguage(language);
    if (!targetLanguage || getCurrentLanguage() === targetLanguage) return false;

    const targetUrl = buildLanguageUrl(targetLanguage);
    if (targetUrl.href === window.location.href) return false;

    if (replace) {
        window.location.replace(targetUrl.href);
    } else {
        window.location.assign(targetUrl.href);
    }
    return true;
};

const removeGate = (gate) => {
    document.body.classList.remove('language-gate-open');
    gate.classList.add('is-closing');
    window.setTimeout(() => gate.remove(), 160);
};

const trapFocus = (gate, event) => {
    if (event.key === 'Escape') {
        event.preventDefault();
        return;
    }

    if (event.key !== 'Tab') return;

    const focusable = Array.from(gate.querySelectorAll('button:not([disabled])'));
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
};

const renderLanguageGate = () => {
    if (document.getElementById('language-choice-gate')) return;

    const gate = document.createElement('div');
    gate.className = 'language-gate';
    gate.id = 'language-choice-gate';
    gate.innerHTML = `
        <section class="language-choice-frame" role="dialog" aria-modal="true" aria-labelledby="language-choice-title" aria-describedby="language-choice-summary" tabindex="-1">
            <div class="language-choice-map" aria-hidden="true"></div>
            <div class="language-choice-icon" aria-hidden="true">
                <svg viewBox="0 0 64 64" focusable="false">
                    <circle cx="32" cy="32" r="27"></circle>
                    <path d="M7 32h50M32 5c7 8 11 17 11 27S39 51 32 59M32 5C25 13 21 22 21 32s4 19 11 27M11 22c6 3 13 4 21 4s15-1 21-4M11 42c6-3 13-4 21-4s15 1 21 4"></path>
                </svg>
                <span>A文</span>
            </div>
            <p class="language-choice-kicker">Language required</p>
            <h2 class="language-choice-title" id="language-choice-title">Chọn ngôn ngữ</h2>
            <p class="language-choice-summary" id="language-choice-summary">Vui lòng chọn ngôn ngữ để tiếp tục sử dụng website.</p>
            <div class="language-choice-options" aria-label="Language options">
                <button class="language-choice-option language-choice-option--vi" type="button" data-language-choice="vi">
                    <span class="language-choice-flag language-choice-flag--vi" aria-hidden="true"></span>
                    <span class="language-choice-copy">
                        <strong>Tiếng Việt</strong>
                        <small>Ngôn ngữ mặc định</small>
                    </span>
                    <span class="language-choice-arrow" aria-hidden="true"></span>
                </button>
                <button class="language-choice-option language-choice-option--en" type="button" data-language-choice="en">
                    <span class="language-choice-flag language-choice-flag--en" aria-hidden="true"></span>
                    <span class="language-choice-copy">
                        <strong>English</strong>
                        <small>English language</small>
                    </span>
                    <span class="language-choice-arrow" aria-hidden="true"></span>
                </button>
            </div>
            <p class="language-choice-note">
                <span aria-hidden="true">✓</span>
                Ngôn ngữ có thể thay đổi bất kỳ lúc nào bằng nút EN/VI.
            </p>
        </section>
    `;

    gate.addEventListener('click', (event) => {
        const button = event.target.closest('[data-language-choice]');
        if (!button) return;

        const language = normalizeLanguage(button.getAttribute('data-language-choice'));
        if (!language) return;

        writeStoredLanguage(language);
        gate.querySelectorAll('[data-language-choice]').forEach((option) => {
            option.disabled = true;
        });
        button.classList.add('is-selected');

        if (!redirectToLanguage(language)) {
            removeGate(gate);
        }
    });

    gate.addEventListener('keydown', (event) => trapFocus(gate, event));
    document.body.appendChild(gate);
    document.body.classList.add('language-gate-open');

    window.requestAnimationFrame(() => {
        const firstChoice = gate.querySelector('[data-language-choice]');
        if (firstChoice) {
            firstChoice.focus();
        } else {
            gate.querySelector('.language-choice-frame')?.focus();
        }
    });
};

export function initLanguageGate() {
    bindLanguageSwitcher();

    const storedLanguage = readStoredLanguage();
    if (storedLanguage) {
        return {
            redirecting: redirectToLanguage(storedLanguage, true),
            shown: false
        };
    }

    writeStoredLanguage(getCurrentLanguage() || 'en');
    return {
        redirecting: false,
        shown: false
    };
}
