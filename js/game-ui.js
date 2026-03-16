/**
 * Startet ein neues Spiel aus dem HTML-Startbildschirm heraus.
 * Bricht ab wenn das Gerät im Hochformat-Telefon-Layout ist.
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
 * Zeigt den Options-Bildschirm an und blendet den Spielbereich aus.
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
 * Aktualisiert die Zurück-Buttons je nachdem ob das Spiel pausiert ist oder nicht.
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
 * Wechselt zum angegebenen Options-Untermenü und versteckt alle anderen.
 * @param {'menu'|'language'|'help'|'audio'|'impressum'} submenu Zu zeigendes Untermenü.
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
 * Kehrt zum Options-Hauptmenü zurück.
 * @returns {void}
 */
function backToOptionsMenu() {
    showOptionsSubmenu('menu');
}

/**
 * Schließt den Options-Bildschirm ohne laufendes Spiel und zeigt den Startbildschirm.
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
 * Beendet das laufende Spiel und kehrt zum Startbildschirm zurück (verlässt auch Vollbild).
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
 * Startet das Spiel neu ohne zum Startbildschirm zurückzukehren.
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
 * Blendet den Options-Bildschirm aus und setzt das laufende Spiel fort.
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
 * Pausiert das Spiel und öffnet den Options-Bildschirm (in-game Pause-Menü).
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
 * Bindet alle globalen UI-Event-Listener (Resize, Orientierung, Fullscreen, Klicks, Slider).
 * Wird nur einmal ausgeführt (Guard via `uiBound`).
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
 * Wechselt die Spielsprache, speichert sie im localStorage und wendet alle Übersetzungen an.
 * @param {string} lang Sprachcode (z.B. 'de', 'en', 'es').
 * @param {HTMLElement|null} button Der angeklickte Sprachbutton (oder null).
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
 * Aktualisiert die Beschriftung des Stummschaltungs-Buttons je nach aktuellem Zustand.
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
 * Setzt die Musik-Lautstärke über den HTML-Slider und aktualisiert den AudioManager.
 * @param {string|number} value Lautstärkewert in Prozent (0–100).
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
 * Setzt die Soundeffekt-Lautstärke über den HTML-Slider und aktualisiert den AudioManager.
 * @param {string|number} value Lautstärkewert in Prozent (0–100).
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
