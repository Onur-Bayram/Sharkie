/**
 * Returns translations for the desired language or German as fallback.
 *
 * @param {string} lang Language code.
 * @returns {Record<string, string>}
 */
function getLanguageStrings(lang) {
    return TRANSLATIONS[lang] || TRANSLATIONS.de;
}

/**
 * Marks the active language button in the interface.
 *
 * @param {string} lang Language code of the active button.
 * @returns {void}
 */
function setActiveLanguageButton(lang) {
    document.querySelectorAll('.lang-button').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

/**
 * Applies the selected language to interface texts and tooltips.
 *
 * @param {string} lang Language code.
 * @returns {void}
 */
function applyLanguage(lang) {
    const strings = getLanguageStrings(lang);
    applyTextTranslations(strings);
    applyTitleTranslations(strings);
    document.documentElement.lang = lang === 'en' ? 'en' : 'de';
    setActiveLanguageButton(lang);
}

/**
 * Applies translated text to all elements using data-i18n keys.
 *
 * @param {Record<string, string>} strings The language strings object.
 * @returns {void}
 */
function applyTextTranslations(strings) {
    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.dataset.i18n;
        if (strings[key]) element.textContent = strings[key];
    });
}

/**
 * Applies translated title attributes to elements using data-i18n-title keys.
 *
 * @param {Record<string, string>} strings The language strings object.
 * @returns {void}
 */
function applyTitleTranslations(strings) {
    document.querySelectorAll('[data-i18n-title]').forEach((element) => {
        const key = element.dataset.i18nTitle;
        if (strings[key]) element.setAttribute('title', strings[key]);
    });
}

/**
 * Adjusts canvas resolution for fullscreen mode.
 *
 * @param {boolean} isFullscreen Indicates whether the game is running in fullscreen.
 * @returns {void}
 */
function updateCanvasResolution(isFullscreen) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    setCanvasResolutionForMode(ctx, isFullscreen);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
}

/**
 * Sets internal canvas resolution for normal or fullscreen rendering.
 *
 * @param {CanvasRenderingContext2D} ctx The 2D rendering context.
 * @param {boolean} isFullscreen Indicates whether the game is running in fullscreen.
 * @returns {void}
 */
function setCanvasResolutionForMode(ctx, isFullscreen) {
    if (!isFullscreen) {
        canvas.width = ORIGINAL_WIDTH;
        canvas.height = ORIGINAL_HEIGHT;
        return;
    }
    const scale = devicePixelRatio || 2;
    const multiplier = Math.min(scale, 2);
    canvas.width = ORIGINAL_WIDTH * multiplier;
    canvas.height = ORIGINAL_HEIGHT * multiplier;
    ctx.scale(multiplier, multiplier);
}