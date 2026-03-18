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
    $('canvas').classList.remove('hidden');
    showEl('game-menu-button');
    init();
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

    if (isGamePaused) {
        hideEl('back-to-start-button');
        showEl('return-to-title-button');
        if (backToStartButton) {
            backToStartButton.dataset.i18n = 'to_title';
            backToStartButton.textContent = getLanguageStrings(window.gameSettings.language || 'de').to_title;
        }
        if (returnToTitleButton) {
            returnToTitleButton.textContent = getLanguageStrings(window.gameSettings.language || 'de').to_title;
        }
        if (isResponsiveLayout()) {
            hideEl('back-to-game-button');
        } else {
            showEl('back-to-game-button');
        }
    } else {
        showEl('back-to-start-button');
        hideEl('return-to-title-button');
        if (backToStartButton) {
            backToStartButton.dataset.i18n = 'back_start';
            backToStartButton.textContent = getLanguageStrings(window.gameSettings.language || 'de').back_start;
        }
        hideEl('back-to-game-button');
    }

    updateBackIconVisibility();
}

/**
 * Switches to the specified options submenu and hides all others.
 * @param {'menu'|'language'|'help'|'audio'|'impressum'} submenu Submenu to display.
 * @returns {void}
 */
function showOptionsSubmenu(submenu) {
    hideEl('options-menu');
    hideEl('options-language');
    hideEl('options-help');
    hideEl('options-audio');
    hideEl('options-impressum');
    if (submenu === 'menu') {
        showEl('options-menu');
    } else if (submenu === 'language') {
        showEl('options-language');
    } else if (submenu === 'help') {
        showEl('options-help');
    } else if (submenu === 'audio') {
        showEl('options-audio');
    } else if (submenu === 'impressum') {
        showEl('options-impressum');
    }

    updateBackIconVisibility();
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
        document.exitFullscreen().catch(() => {});
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
    $('canvas').classList.remove('hidden');
    showEl('game-menu-button');
    init();
    updateHtmlFullscreenButton();
    updateMobileControlsVisibility();
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
    window.addEventListener('resize', updateOrientationLock);
    window.addEventListener('orientationchange', updateOrientationLock);
    window.addEventListener('resize', updateBackIconVisibility);
    window.addEventListener('orientationchange', updateBackIconVisibility);
    window.addEventListener('resize', updateMobileControlsVisibility);
    window.addEventListener('orientationchange', updateMobileControlsVisibility);
    document.addEventListener('fullscreenchange', updateMobileControlsVisibility);
    document.addEventListener('fullscreenchange', updateHtmlFullscreenButton);
    const htmlFsBtn = $('html-fullscreen-button');
    if (htmlFsBtn) {
        htmlFsBtn.addEventListener('keydown', (e) => {
            const isSpace = e.code === 'Space' || e.key === ' ';
            const isEnter = e.key === 'Enter';
            if (!isSpace && !isEnter) return;

            e.preventDefault();
            e.stopPropagation();
            htmlFsBtn.blur();
        });

        htmlFsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            htmlFsBtn.blur();

            const container = $('canvas')?.closest('.game-panel') || document.body;
            if (!container) return;
            if (!document.fullscreenElement) {
                container.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        });
    }
    document.addEventListener('click', (event) => {
        const button = event.target.closest('[data-action]');
        if (!button) return;

        const action = button.dataset.action;
        if (action === 'start-game') {
            startGameFromHTML();
        } else if (action === 'open-options') {
            showOptionsScreen();
        } else if (action === 'open-submenu') {
            showOptionsSubmenu(button.dataset.target);
        } else if (action === 'back-options') {
            const isInMainOptionsMenu = !$('options-menu').classList.contains('is-hidden');
            if (!isInMainOptionsMenu) {
                backToOptionsMenu();
            } else if (isGamePaused) {
                backToGame();
            } else {
                hideOptionsScreen();
            }
        } else if (action === 'back-start') {
            if (isGamePaused) {
                returnToTitle();
            } else {
                hideOptionsScreen();
            }
        } else if (action === 'back-game') {
            backToGame();
        } else if (action === 'game-menu') {
            pauseAndReturnToMenu();
        } else if (action === 'set-language') {
            changeLanguage(button.dataset.lang, button);
        } else if (action === 'toggle-mute') {
            toggleMute();
        }
    });

    const musicSlider = $('music-slider');
    if (musicSlider) {
        musicSlider.addEventListener('input', (event) => updateMusicVolume(event.target.value));
    }

    const sfxSlider = $('sfx-slider');
    if (sfxSlider) {
        sfxSlider.addEventListener('input', (event) => updateSFXVolume(event.target.value));
    }

    bindMobileControls();
}

/**
 * Changes the game language, saves it to localStorage, and applies all translations.
 * @param {string} lang Language code (e.g. 'de', 'en', 'es').
 * @param {HTMLElement|null} button The clicked language button (or null).
 * @returns {void}
 */
function changeLanguage(lang, button) {
    if (!TRANSLATIONS[lang]) {
        lang = 'de';
    }

    if (button) {
        setActiveLanguageButton(lang);
    }

    window.gameSettings = window.gameSettings || {};
    window.gameSettings.language = lang;

    localStorage.setItem('sharkieLanguage', lang);
    applyLanguage(lang);
    updateMuteButtonLabel();
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

    const muted = !!window.gameSettings?.muted;
    const i18nKey = muted ? 'audio_unmute' : 'audio_mute';
    muteButton.dataset.i18n = i18nKey;
    muteButton.textContent = getLanguageStrings(window.gameSettings.language || 'de')[i18nKey];
}

/**
 * Schaltet den Ton des Spiels um (stumm / laut) und persistiert den Zustand.
 * @returns {void}
 */
function toggleMute() {
    window.gameSettings = window.gameSettings || {};
    window.gameSettings.muted = !window.gameSettings.muted;
    localStorage.setItem('sharkieMuted', String(window.gameSettings.muted));

    if (world && world.audioManager) {
        world.audioManager.setMuted(window.gameSettings.muted);
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
    window.gameSettings = window.gameSettings || {};
    window.gameSettings.musicVolume = volume;
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
    window.gameSettings = window.gameSettings || {};
    window.gameSettings.sfxVolume = volume;
    if (world && world.audioManager) {
        world.audioManager.setSFXVolume(volume);
    }
}
