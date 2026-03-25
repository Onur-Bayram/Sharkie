/**
 * Binds input listeners for music and SFX range sliders.
 *
 * @returns {void}
 */
function bindAudioSliderHandlers() {
    const musicSlider = $('music-slider');
    if (musicSlider) musicSlider.addEventListener('input', (event) => updateMusicVolume(event.target.value));
    const sfxSlider = $('sfx-slider');
    if (sfxSlider) sfxSlider.addEventListener('input', (event) => updateSFXVolume(event.target.value));
}

/**
 * Changes the game language, saves it to localStorage, and applies all translations.
 * @param {string} lang Language code (e.g. 'de', 'en', 'es').
 * @param {HTMLElement|null} button The clicked language button (or null).
 * @returns {void}
 */
function changeLanguage(lang, button) {
    const nextLang = resolveLanguageCode(lang);
    if (button) setActiveLanguageButton(nextLang);
    persistLanguageSetting(nextLang);
    applyLanguage(nextLang);
    updateMuteButtonLabel();
}

/**
 * Resolves a valid language code with German fallback.
 *
 * @param {string} lang The language code to validate.
 * @returns {string} Valid language code ('de' or 'en').
 */
function resolveLanguageCode(lang) {
    if (TRANSLATIONS[lang]) return lang;
    return 'de';
}

/**
 * Persists the selected language in settings and local storage.
 *
 * @param {string} lang The language code to persist.
 * @returns {void}
 */
function persistLanguageSetting(lang) {
    gameSettings = gameSettings || {};
    gameSettings.language = lang;
    localStorage.setItem('sharkieLanguage', lang);
}

/**
 * Updates the label of the mute button based on the current state.
 * @returns {void}
 */
function updateMuteButtonLabel() {
    const muteButton = $('mute-toggle-button');
    if (!muteButton) {
        return;
    }

    const muted = !!gameSettings?.muted;
    const i18nKey = muted ? 'audio_unmute' : 'audio_mute';
    muteButton.dataset.i18n = i18nKey;
    muteButton.textContent = getLanguageStrings(gameSettings.language || 'de')[i18nKey];
}

/**
 * sound toggle handler: toggles muting for all sounds, saves the setting to localStorage, and updates the AudioManager and button label.
 * @returns {void}
 */
function toggleMute() {
    gameSettings = gameSettings || {};
    gameSettings.muted = !gameSettings.muted;
    localStorage.setItem('sharkieMuted', String(gameSettings.muted));

    if (world && world.audioManager) {
        world.audioManager.setMuted(gameSettings.muted);
    }

    updateMuteButtonLabel();
}

/**
 * Sets the music volume via the HTML slider and updates the AudioManager.
 * @param {string|number} value Volume value in percent (0–100).
 * @returns {void}
 */
function updateMusicVolume(value) {
    $('music-value').textContent = value + '%';
    const volume = value / 100;
    gameSettings = gameSettings || {};
    gameSettings.musicVolume = volume;
    if (world && world.audioManager) {
        world.audioManager.setMusicVolume(volume);
    }
}

/**
 * Sets the sound effects volume via the HTML slider and updates the AudioManager.
 * @param {string|number} value Volume value in percent (0–100).
 * @returns {void}
 */
function updateSFXVolume(value) {
    $('sfx-value').textContent = value + '%';
    const volume = value / 100;
    gameSettings = gameSettings || {};
    gameSettings.sfxVolume = volume;
    if (world && world.audioManager) {
        world.audioManager.setSFXVolume(volume);
    }
}