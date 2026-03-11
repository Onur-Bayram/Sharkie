let canvas;
let world;
let fullscreenButton;
let character = new MovableObject();
let keyboard = {
    LEFT: false,
    RIGHT: false,
    UP: false,
    DOWN: false,
    D: false,
    F: false,
    SPACE: false
};

const $ = (id) => document.getElementById(id);
const showEl = (id) => $(id).classList.remove('is-hidden');
const hideEl = (id) => $(id).classList.add('is-hidden');
let uiBound = false;
let isGamePaused = false;
let wasPausedByOrientation = false;

window.keyboard = keyboard;
window.mousePos = { x: 0, y: 0 };

const savedLanguage = localStorage.getItem('sharkieLanguage') || 'de';
window.gameSettings = {
    musicVolume: 0.3,
    sfxVolume: 0.5,
    language: savedLanguage
};

const TRANSLATIONS = {
    de: {
        start: 'START',
        options: 'OPTIONEN',
        menu_languages: 'SPRACHEN',
        menu_help: 'HILFE',
        menu_audio: 'AUDIO',
        menu_impressum: 'IMPRESSUM',
        back_start: 'ZURÜCK ZUM START',
        back_game: 'ZURÜCK ZUM SPIEL',
        submenu_languages: 'SPRACHEN',
        submenu_controls: 'STEUERUNG',
        submenu_audio: 'AUDIO',
        submenu_impressum: 'IMPRESSUM',
        help_move: 'Sharkie bewegen',
        help_bubble: 'Normale Blasen werfen',
        help_poison: 'Gift-Blasen werfen',
        help_attack: 'Flossen-Schlag Angriff',
        help_tip: 'Sammle Münzen • Weiche Feinden aus • Besiege den Boss!',
        audio_music: 'Hintergrundmusik',
        audio_sfx: 'Sound-Effekte',
        back: 'Zurück'
    },
    en: {
        start: 'START',
        options: 'OPTIONS',
        menu_languages: 'LANGUAGES',
        menu_help: 'HELP',
        menu_audio: 'AUDIO',
        menu_impressum: 'LEGAL NOTICE',
        back_start: 'BACK TO START',
        back_game: 'BACK TO GAME',
        submenu_languages: 'LANGUAGES',
        submenu_controls: 'CONTROLS',
        submenu_audio: 'AUDIO',
        submenu_impressum: 'LEGAL NOTICE',
        help_move: 'Move Sharkie',
        help_bubble: 'Throw normal bubbles',
        help_poison: 'Throw poison bubbles',
        help_attack: 'Fin-slap attack',
        help_tip: 'Collect coins • Dodge enemies • Defeat the boss!',
        audio_music: 'Background music',
        audio_sfx: 'Sound effects',
        back: 'Back'
    }
};

// Original Canvas-Größe
const ORIGINAL_WIDTH = 800;
const ORIGINAL_HEIGHT = 540;

function getLanguageStrings(lang) {
    return TRANSLATIONS[lang] || TRANSLATIONS.de;
}

function setActiveLanguageButton(lang) {
    document.querySelectorAll('.lang-button').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

function applyLanguage(lang) {
    const strings = getLanguageStrings(lang);

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.dataset.i18n;
        if (strings[key]) {
            element.textContent = strings[key];
        }
    });

    document.querySelectorAll('[data-i18n-title]').forEach((element) => {
        const key = element.dataset.i18nTitle;
        if (strings[key]) {
            element.setAttribute('title', strings[key]);
        }
    });

    document.documentElement.lang = lang === 'en' ? 'en' : 'de';
    setActiveLanguageButton(lang);
}

// Funktion zum Anpassen der Canvas-Auflösung
function updateCanvasResolution(isFullscreen) {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    if (isFullscreen) {
        // Hochauflösendes Canvas für Vollbild (2x oder 3x)
        const scale = window.devicePixelRatio || 2;
        const multiplier = Math.min(scale, 3); // Max 3x für Performance
        
        canvas.width = ORIGINAL_WIDTH * multiplier;
        canvas.height = ORIGINAL_HEIGHT * multiplier;
        
        // Context skalieren, damit Spiel-Koordinaten gleich bleiben
        ctx.scale(multiplier, multiplier);
        
        console.log(`Canvas-Auflösung erhöht: ${canvas.width}x${canvas.height} (${multiplier}x)`);
    } else {
        // Zurück zur Original-Auflösung
        canvas.width = ORIGINAL_WIDTH;
        canvas.height = ORIGINAL_HEIGHT;
        
        console.log(`Canvas-Auflösung zurückgesetzt: ${canvas.width}x${canvas.height}`);
    }
    
    // Glatte Darstellung
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
}

function showStartScreen() {
    canvas = $("canvas");
    const ctx = canvas.getContext('2d');
    fullscreenButton = new FullscreenButton();
    fullscreenButton.setCanvasContext(canvas, ctx);
    
    // Canvas-basierte Ansichten für Start und Optionen hier nicht mehr verwenden
    // HTML-Startbildschirm und HTML-Optionsbildschirm werden stattdessen verwendet
    // Startbildschirm wird über die Oberfläche gesteuert
    // Optionsbildschirm wird über die Oberfläche gesteuert
    
    // HTML-Startbildschirm anzeigen
    showEl('start-screen');
    hideEl('options-screen');
    
    // Audio-Slider mit gespeicherten Werten initialisieren
    const musicSlider = $('music-slider');
    const sfxSlider = $('sfx-slider');
    if (window.gameSettings) {
        if (window.gameSettings.musicVolume !== undefined) {
            musicSlider.value = window.gameSettings.musicVolume * 100;
            $('music-value').textContent = Math.round(window.gameSettings.musicVolume * 100) + '%';
        }
        if (window.gameSettings.sfxVolume !== undefined) {
            sfxSlider.value = window.gameSettings.sfxVolume * 100;
            $('sfx-value').textContent = Math.round(window.gameSettings.sfxVolume * 100) + '%';
        }
    }
    
    bindUI();
    applyLanguage(window.gameSettings.language || 'de');
    updateOrientationLock();

    // startGame global verfügbar machen
    window.startGame = init;
}

function init() {
    if (!canvas) {
        canvas = $("canvas");
    }
    if (!fullscreenButton) {
        const ctx = canvas.getContext('2d');
        fullscreenButton = new FullscreenButton();
        fullscreenButton.setCanvasContext(canvas, ctx);
    }
    world = new World(canvas, fullscreenButton);
    
    // Wende gespeicherte Audio-Einstellungen an
    if (window.gameSettings) {
        if (window.gameSettings.musicVolume !== undefined && world.audioManager) {
            world.audioManager.setMusicVolume(window.gameSettings.musicVolume);
        }
        if (window.gameSettings.sfxVolume !== undefined && world.audioManager) {
            world.audioManager.setSFXVolume(window.gameSettings.sfxVolume);
        }
    }
    
    // Restart-Button initialisieren
    if (world.restartButton) {
        world.restartButton.setCanvasContext(canvas.getContext('2d'));
    }
    
    console.log('My Charakter is', world.character);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') keyboard.LEFT = true;
    if (e.key === 'ArrowRight') keyboard.RIGHT = true;
    if (e.key === 'ArrowUp') keyboard.UP = true;
    if (e.key === 'ArrowDown') keyboard.DOWN = true;
    if (e.key === 'd' || e.key === 'D') keyboard.D = true;
    if (e.key === 'f' || e.key === 'F') keyboard.F = true;
    if (e.key === ' ') keyboard.SPACE = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') keyboard.LEFT = false;
    if (e.key === 'ArrowRight') keyboard.RIGHT = false;
    if (e.key === 'ArrowUp') keyboard.UP = false;
    if (e.key === 'ArrowDown') keyboard.DOWN = false;
    if (e.key === 'd' || e.key === 'D') keyboard.D = false;
    if (e.key === 'f' || e.key === 'F') keyboard.F = false;
    if (e.key === ' ') keyboard.SPACE = false;
});

document.addEventListener('mousemove', (e) => {
    const position = getCanvasPointerPosition(e.clientX, e.clientY);
    if (!position) {
        return;
    }

    window.mousePos.x = position.x;
    window.mousePos.y = position.y;

    if (world && world.restartButton) {
        world.restartButton.updateHoverState(position.x, position.y);
    }
});

document.addEventListener('click', (e) => {
    handleCanvasPointer(e.clientX, e.clientY);
});

document.addEventListener('touchstart', (e) => {
    if (!e.touches || e.touches.length === 0) {
        return;
    }

    const touch = e.touches[0];
    handleCanvasPointer(touch.clientX, touch.clientY);
}, { passive: true });

// Reagiert auf Wechsel zwischen Vollbild- und Fenstermodus
document.addEventListener('fullscreenchange', () => {
    const isFullscreen = !!document.fullscreenElement;
    updateCanvasResolution(isFullscreen);
    console.log('Fullscreen changed:', isFullscreen);
});


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
}

function updateBackButtons() {
    if (isGamePaused) {
        // Im pausierten Spiel: zurück zum Start ausblenden
        hideEl('back-to-start-button');
        if (isResponsiveLayout()) {
            hideEl('back-to-game-button');
        } else {
            showEl('back-to-game-button');
        }
    } else {
        // "Zurück zum Start" aus dem Hauptmenü anzeigen
        showEl('back-to-start-button');
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
    $('options-screen').querySelector('.back-icon-button')?.classList.remove('is-visible');
    showEl('start-screen');
    isGamePaused = false;
}

function backToGame() {
    // Optionen-Bildschirm ausblenden
    hideEl('options-screen');
    $('options-screen').querySelector('.back-icon-button')?.classList.remove('is-visible');
    // Canvas und Menübutton wieder anzeigen
    $('canvas').classList.remove('hidden');
    showEl('game-menu-button');
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
            if (isInMainOptionsMenu && isGamePaused && isResponsiveLayout()) {
                backToGame();
            } else {
                backToOptionsMenu();
            }
        } else if (action === 'back-start') {
            hideOptionsScreen();
        } else if (action === 'back-game') {
            backToGame();
        } else if (action === 'game-menu') {
            pauseAndReturnToMenu();
        } else if (action === 'set-language') {
            changeLanguage(button.dataset.lang, button);
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
}

function changeLanguage(lang, button) {
    if (!TRANSLATIONS[lang]) {
        lang = 'de';
    }

    if (button) {
        setActiveLanguageButton(lang);
    }

    console.log('Language changed to:', lang);

    window.gameSettings = window.gameSettings || {};
    window.gameSettings.language = lang;

    localStorage.setItem('sharkieLanguage', lang);
    applyLanguage(lang);
}

function updateMusicVolume(value) {
    $('music-value').textContent = value + '%';
    const volume = value / 100;
    
    // Global speichern
    window.gameSettings = window.gameSettings || {};
    window.gameSettings.musicVolume = volume;
    
    // Direkt anwenden, falls das Spiel bereits läuft
    if (window.world && window.world.audioManager) {
        window.world.audioManager.setMusicVolume(volume);
    }
}

function updateSFXVolume(value) {
    $('sfx-value').textContent = value + '%';
    const volume = value / 100;
    
    // Global speichern
    window.gameSettings = window.gameSettings || {};
    window.gameSettings.sfxVolume = volume;
    
    // Direkt anwenden, falls das Spiel bereits läuft
    if (window.world && window.world.audioManager) {
        window.world.audioManager.setSFXVolume(volume);
    }
}

// Rechnet Maus- oder Touch-Koordinaten in Spielkoordinaten um
function getCanvasPointerPosition(clientX, clientY) {
    if (!canvas) {
        return null;
    }

    const rect = canvas.getBoundingClientRect();
    const canvasRatio = ORIGINAL_WIDTH / ORIGINAL_HEIGHT;
    const rectRatio = rect.width / rect.height;

    let drawWidth = rect.width;
    let drawHeight = rect.height;
    let offsetX = 0;
    let offsetY = 0;

    if (rectRatio > canvasRatio) {
        drawHeight = rect.height;
        drawWidth = rect.height * canvasRatio;
        offsetX = (rect.width - drawWidth) / 2;
    } else {
        drawWidth = rect.width;
        drawHeight = rect.width / canvasRatio;
        offsetY = (rect.height - drawHeight) / 2;
    }

    const relativeX = clientX - rect.left - offsetX;
    const relativeY = clientY - rect.top - offsetY;

    if (relativeX < 0 || relativeY < 0 || relativeX > drawWidth || relativeY > drawHeight) {
        return null;
    }

    const x = (relativeX / drawWidth) * ORIGINAL_WIDTH;
    const y = (relativeY / drawHeight) * ORIGINAL_HEIGHT;

    return {
        x,
        y
    };
}

// Verarbeitet Klicks und Touch-Eingaben auf dem Canvas
function handleCanvasPointer(clientX, clientY) {
    if (!canvas || !fullscreenButton || !world) {
        return;
    }

    const position = getCanvasPointerPosition(clientX, clientY);
    if (!position) {
        return;
    }

    fullscreenButton.handleClick(position.x, position.y);

    if (world.restartButton) {
        world.restartButton.handleClick(position.x, position.y);
    }
}

// Setzt alle aktuell gedrückten Tasten zurück
function resetKeyboardState() {
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.D = false;
    keyboard.F = false;
    keyboard.SPACE = false;
}

// Prüft, ob ein Smartphone im Hochformat verwendet wird
function isPortraitPhoneLayout() {
    return window.matchMedia('(max-width: 768px) and (orientation: portrait) and (hover: none) and (pointer: coarse)').matches;
}

// Sperrt das Spiel im Smartphone-Hochformat und pausiert es bei Bedarf
function updateOrientationLock() {
    const isLocked = isPortraitPhoneLayout();
    document.body.classList.toggle('portrait-lock', isLocked);

    if (!canvas) {
        canvas = $('canvas');
    }

    if (isLocked) {
        if (world && !isGamePaused && !canvas.classList.contains('hidden')) {
            if (typeof world.pauseGame === 'function') {
                world.pauseGame();
            }
            wasPausedByOrientation = true;
        }
        resetKeyboardState();
        return;
    }

    if (
        wasPausedByOrientation &&
        world &&
        !isGamePaused &&
        $('options-screen').classList.contains('is-hidden') &&
        canvas &&
        !canvas.classList.contains('hidden') &&
        typeof world.resumeGame === 'function'
    ) {
        world.resumeGame();
    }

    wasPausedByOrientation = false;
}

// Prüft, ob gerade ein responsiver Breakpoint aktiv ist
function isResponsiveLayout() {
    return window.matchMedia('(max-width: 1024px)').matches;
}

// Blendet das Zurück-Symbol abhängig vom aktuellen Menüstatus ein oder aus
function updateBackIconVisibility() {
    const optionsScreen = $('options-screen');
    const backIconButton = optionsScreen?.querySelector('.back-icon-button');
    if (!optionsScreen || !backIconButton) {
        return;
    }

    if (optionsScreen.classList.contains('is-hidden')) {
        backIconButton.classList.remove('is-visible');
        return;
    }

    const isInMainOptionsMenu = !$('options-menu').classList.contains('is-hidden');
    const shouldShowInResponsiveMainMenu = isInMainOptionsMenu && isGamePaused && isResponsiveLayout();
    const shouldShowInSubmenu = !isInMainOptionsMenu;

    backIconButton.classList.toggle('is-visible', shouldShowInResponsiveMainMenu || shouldShowInSubmenu);
}