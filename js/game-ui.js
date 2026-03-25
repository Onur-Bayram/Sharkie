/**
 * Starts a new game from the HTML start screen.
 * Aborts if the device is in portrait phone layout.
 * @returns {void}
 */
function startGameFromHTML() {
    if (isPortraitPhoneLayout()) {
        updateOrientationLock();
        return;
    }
    hideEl('start-screen');
    $('canvas').classList.add('hidden');
    hideEl('game-menu-button');
    init();
    requestTouchFullscreenIfNeeded();
    if (typeof startAssetLoadingGate === 'function') startAssetLoadingGate(activateGameplayAfterLoading);
    else activateGameplayAfterLoading();
}

/**
 * Makes gameplay visible and interactive once loading has completed.
 * @returns {void}
 */
function activateGameplayAfterLoading() {
    $('canvas').classList.remove('hidden');
    showEl('game-menu-button');
    if (world && typeof world.resumeGame === 'function') world.resumeGame();
    updateMobileControlsVisibility();
}

/**
 * Displays the options screen and hides the game area.
 * @returns {void}
 */
function showOptionsScreen() {
    hideEl('game-menu-button');
    hideEl('start-screen');
    showEl('options-screen');
    showOptionsSubmenu('menu');
    updateBackButtons();
    hideMobileControls();
}

/**
 * Updates the back buttons depending on whether the game is paused or not.
 * @returns {void}
 */
function updateBackButtons() {
    const backToStartButton = $('back-to-start-button');
    const returnToTitleButton = $('return-to-title-button');
    if (isGamePaused) updatePausedBackButtons(backToStartButton, returnToTitleButton);
    else updateUnpausedBackButtons(backToStartButton);
    updateBackIconVisibility();
}

/** Updates back-button labels and visibility when the game is paused. */
function updatePausedBackButtons(backToStartButton, returnToTitleButton) {
    const strings = getLanguageStrings(gameSettings.language || 'de');
    hideEl('back-to-start-button');
    showEl('return-to-title-button');
    if (backToStartButton) {
        backToStartButton.dataset.i18n = 'to_title';
        backToStartButton.textContent = strings.to_title;
    }
    if (returnToTitleButton) returnToTitleButton.textContent = strings.to_title;
    if (isResponsiveLayout()) hideEl('back-to-game-button');
    else showEl('back-to-game-button');
}

/** Updates back-button state for non-paused screens. */
function updateUnpausedBackButtons(backToStartButton) {
    showEl('back-to-start-button');
    hideEl('return-to-title-button');
    if (backToStartButton) {
        backToStartButton.dataset.i18n = 'back_start';
        backToStartButton.textContent = getLanguageStrings(gameSettings.language || 'de').back_start;
    }
    hideEl('back-to-game-button');
}

/**
 * Switches to the specified options submenu and hides all others.
 * @param {'menu'|'language'|'help'|'audio'|'impressum'} submenu Submenu to display.
 * @returns {void}
 */
function showOptionsSubmenu(submenu) {
    hideAllOptionsSubmenus();
    showRequestedOptionsSubmenu(submenu);
    updateBackIconVisibility();
}

/** Hides all options submenus before showing a target submenu. */
function hideAllOptionsSubmenus() {
    hideEl('options-menu');
    hideEl('options-language');
    hideEl('options-help');
    hideEl('options-audio');
    hideEl('options-impressum');
}

/** Shows exactly one options submenu by key. */
function showRequestedOptionsSubmenu(submenu) {
    if (submenu === 'menu') showEl('options-menu');
    else if (submenu === 'language') showEl('options-language');
    else if (submenu === 'help') showEl('options-help');
    else if (submenu === 'audio') showEl('options-audio');
    else if (submenu === 'impressum') showEl('options-impressum');
}

/**
 * Returns to the options main menu.
 * @returns {void}
 */
function backToOptionsMenu() {
    showOptionsSubmenu('menu');
}

/**
 * Closes the options screen without running game and shows start screen.
 * @returns {void}
 */
function hideOptionsScreen() {
    hideEl('options-screen');
    $('canvas').classList.add('hidden');
    hideEl('game-menu-button');
    hideMobileControls();
    $('options-screen').querySelector('.back-icon-button')?.classList.remove('is-visible');
    showEl('start-screen');
    isGamePaused = false;
}

/**
 * Terminates the running game and returns to the start screen (also exits fullscreen).
 * @returns {void}
 */
function returnToTitle() {
    if (document.fullscreenElement) {
        document.exitFullscreen().catch((error) => {
            console.warn('Fullscreen exit failed:', error);
        });
    }

    teardownCurrentGame();
    $('canvas').classList.add('hidden');
    hideEl('game-menu-button');
    hideEl('options-screen');
    showStartScreen();
    updateHtmlFullscreenButton();
    updateMobileControlsVisibility();
}

/**
 * Restarts the game without returning to the start screen.
 * @returns {void}
 */
function restartGame() {
    teardownCurrentGame();
    hideEl('start-screen');
    hideEl('options-screen');
    $('canvas').classList.add('hidden');
    hideEl('game-menu-button');
    init();
    requestTouchFullscreenIfNeeded();
    if (typeof startAssetLoadingGate === 'function') startAssetLoadingGate(activateGameplayAfterLoading);
    else activateGameplayAfterLoading();
    updateHtmlFullscreenButton();
}

/**
 * Hides the options screen and resumes the running game.
 * @returns {void}
 */
function backToGame() {
    hideEl('options-screen');
    $('options-screen').querySelector('.back-icon-button')?.classList.remove('is-visible');
    $('canvas').classList.remove('hidden');
    showEl('game-menu-button');
    requestTouchFullscreenIfNeeded();
    updateMobileControlsVisibility();
    if (world && typeof world.resumeGame === 'function') {
        world.resumeGame();
    }
    isGamePaused = false;
}

/**
 * Pauses the game and opens the options screen (in-game pause menu).
 * @returns {void}
 */
function pauseAndReturnToMenu() {
    isGamePaused = true;
    if (world) {
        if (typeof world.pauseGame === 'function') {
            world.pauseGame();
        }
    }
    resetKeyboardState();
    hideMobileControls();
    showOptionsScreen();
}

/**
 * Binds all global UI event listeners (resize, orientation, fullscreen, clicks, sliders).
 * Executed only once (guarded by `uiBound`).
 * @returns {void}
 */
function bindUI() {
    if (uiBound) return;
    uiBound = true;
    bindGlobalViewportListeners();
    bindHtmlFullscreenButtonHandlers();
    bindActionClickRouter();
    bindAudioSliderHandlers();
    bindMobileControls();
}

/** Binds global viewport/fullscreen listeners affecting UI state. */
function bindGlobalViewportListeners() {
    addEventListener('resize', updateOrientationLock);
    addEventListener('orientationchange', updateOrientationLock);
    addEventListener('resize', updateBackIconVisibility);
    addEventListener('orientationchange', updateBackIconVisibility);
    addEventListener('resize', updateMobileControlsVisibility);
    addEventListener('orientationchange', updateMobileControlsVisibility);
    document.addEventListener('fullscreenchange', updateMobileControlsVisibility);
    document.addEventListener('fullscreenchange', updateHtmlFullscreenButton);
    document.addEventListener('pointerdown', ensureMobileFullscreenFromGesture, { passive: true });
    document.addEventListener('touchstart', ensureMobileFullscreenFromGesture, { passive: true });
}

/** Binds key and click handlers for the HTML fullscreen button. */
function bindHtmlFullscreenButtonHandlers() {
    const htmlFsBtn = $('html-fullscreen-button');
    if (!htmlFsBtn) return;
    htmlFsBtn.addEventListener('keydown', handleFullscreenButtonKeydown);
    htmlFsBtn.addEventListener('click', handleFullscreenButtonClick);
}

/** Handles keyboard activation (Space/Enter) for fullscreen button. */
function handleFullscreenButtonKeydown(e) {
    const isSpace = e.code === 'Space' || e.key === ' ';
    const isEnter = e.key === 'Enter';
    if (!isSpace && !isEnter) return;
    e.preventDefault();
    e.stopPropagation();
    $('html-fullscreen-button')?.blur();
}

/** Toggles fullscreen mode from the HTML fullscreen button click. */
function handleFullscreenButtonClick(e) {
    e.preventDefault();
    e.stopPropagation();
    $('html-fullscreen-button')?.blur();
    const container = document.body;
    if (!container) return;
    if (!document.fullscreenElement) {
        container.requestFullscreen().catch((error) => {
            console.warn('Fullscreen request failed:', error);
        });
    } else {
        document.exitFullscreen().catch((error) => {
            console.warn('Fullscreen exit failed:', error);
        });
    }
}

/** Binds click delegation for all elements with data-action attributes. */
function bindActionClickRouter() {
    document.addEventListener('click', (event) => {
        const button = event.target.closest('[data-action]');
        if (!button) return;
        routeAction(button.dataset.action, button);
    });
}

/** Routes a UI action string to the matching handler. */
function routeAction(action, button) {
    if (action === 'start-game') startGameFromHTML();
    else if (action === 'open-options') showOptionsScreen();
    else if (action === 'open-submenu') showOptionsSubmenu(button.dataset.target);
    else if (action === 'back-options') handleBackOptionsAction();
    else if (action === 'back-start') (isGamePaused ? returnToTitle() : hideOptionsScreen());
    else if (action === 'back-game') backToGame();
    else if (action === 'game-menu') pauseAndReturnToMenu();
    else if (action === 'set-language') changeLanguage(button.dataset.lang, button);
    else if (action === 'toggle-mute') toggleMute();
}

/** Handles back navigation logic inside the options screen. */
function handleBackOptionsAction() {
    const isInMainOptionsMenu = !$('options-menu').classList.contains('is-hidden');
    if (!isInMainOptionsMenu) backToOptionsMenu();
    else if (isGamePaused) backToGame();
    else hideOptionsScreen();
}

/** Binds input listeners for music and SFX range sliders. */
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

/** Resolves a valid language code with German fallback. */
function resolveLanguageCode(lang) {
    if (TRANSLATIONS[lang]) return lang;
    return 'de';
}

/** Persists the selected language in settings and local storage. */
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
