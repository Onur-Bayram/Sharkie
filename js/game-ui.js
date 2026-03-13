function startGameFromHTML() {
    if (isPortraitPhoneLayout()) {
        updateOrientationLock();
        return;
    }

    // Startbildschirm ausblenden
    hideEl('start-screen');
    // Canvas anzeigen
    $('canvas').classList.remove('hidden');
    // Menübutton anzeigen
    showEl('game-menu-button');
    // Spiel starten
    init();
    updateMobileControlsVisibility();
}

function showOptionsScreen() {
    // Ingame-Menübutton ausblenden, solange Optionen geöffnet sind
    hideEl('game-menu-button');
    // Startbildschirm ausblenden
    hideEl('start-screen');
    // Optionen-Bildschirm anzeigen
    showEl('options-screen');
    // Hauptmenü anzeigen
    showOptionsSubmenu('menu');
    // Untere Buttons je nach Spielstatus umschalten
    updateBackButtons();
    hideMobileControls();
}

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
        // "Zurück zum Start" aus dem Hauptmenü anzeigen
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

function showOptionsSubmenu(submenu) {
    // Alle Untermenüs ausblenden
    hideEl('options-menu');
    hideEl('options-language');
    hideEl('options-help');
    hideEl('options-audio');
    hideEl('options-impressum');

    // Gewähltes Untermenü einblenden
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

function backToOptionsMenu() {
    showOptionsSubmenu('menu');
}

function hideOptionsScreen() {
    hideEl('options-screen');
    $('canvas').classList.add('hidden');
    hideEl('game-menu-button');
    hideMobileControls();
    $('options-screen').querySelector('.back-icon-button')?.classList.remove('is-visible');
    showEl('start-screen');
    isGamePaused = false;
}

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

function backToGame() {
    // Optionen-Bildschirm ausblenden
    hideEl('options-screen');
    $('options-screen').querySelector('.back-icon-button')?.classList.remove('is-visible');
    // Canvas und Menübutton wieder anzeigen
    $('canvas').classList.remove('hidden');
    showEl('game-menu-button');
    updateMobileControlsVisibility();
    // Spiel fortsetzen
    if (world && typeof world.resumeGame === 'function') {
        world.resumeGame();
    }
    isGamePaused = false;
}

function pauseAndReturnToMenu() {
    // Markieren, dass das Spiel pausiert ist
    isGamePaused = true;
    // Spiel-Loop/Audio pausieren und Eingaben zurücksetzen
    if (world) {
        if (typeof world.pauseGame === 'function') {
            world.pauseGame();
        }
    }
    resetKeyboardState();
    hideMobileControls();

    // Optionen-Panel öffnen (wie bei Klick auf „Optionen“)
    showOptionsScreen();
}

function bindUI() {
    if (uiBound) return;
    uiBound = true;

    // Reagiert auf Größen- und Ausrichtungsänderungen des Geräts
    window.addEventListener('resize', updateOrientationLock);
    window.addEventListener('orientationchange', updateOrientationLock);
    window.addEventListener('resize', updateBackIconVisibility);
    window.addEventListener('orientationchange', updateBackIconVisibility);
    window.addEventListener('resize', updateMobileControlsVisibility);
    window.addEventListener('orientationchange', updateMobileControlsVisibility);
    document.addEventListener('fullscreenchange', updateMobileControlsVisibility);
    document.addEventListener('fullscreenchange', updateHtmlFullscreenButton);

    // HTML-Vollbild-Button für Touch-Geräte
    const htmlFsBtn = $('html-fullscreen-button');
    if (htmlFsBtn) {
        // Verhindert, dass Spieltasten den fokussierten Vollbild-Button erneut ausloesen.
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

            const container = document.body || $('canvas')?.closest('.game-panel');
            if (!container) return;
            if (!document.fullscreenElement) {
                container.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        });
    }

    // Zentrale Klicksteuerung für alle Elemente mit data-action
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

function toggleMute() {
    window.gameSettings = window.gameSettings || {};
    window.gameSettings.muted = !window.gameSettings.muted;
    localStorage.setItem('sharkieMuted', String(window.gameSettings.muted));

    if (world && world.audioManager) {
        world.audioManager.setMuted(window.gameSettings.muted);
    }

    updateMuteButtonLabel();
}

function updateMusicVolume(value) {
    $('music-value').textContent = value + '%';
    const volume = value / 100;

    // Global speichern
    window.gameSettings = window.gameSettings || {};
    window.gameSettings.musicVolume = volume;

    // Direkt anwenden, falls das Spiel bereits läuft
    if (world && world.audioManager) {
        world.audioManager.setMusicVolume(volume);
    }
}

function updateSFXVolume(value) {
    $('sfx-value').textContent = value + '%';
    const volume = value / 100;

    // Global speichern
    window.gameSettings = window.gameSettings || {};
    window.gameSettings.sfxVolume = volume;

    // Direkt anwenden, falls das Spiel bereits läuft
    if (world && world.audioManager) {
        world.audioManager.setSFXVolume(volume);
    }
}
