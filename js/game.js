let canvas;
let world;
let character = new MovableObject();
const nativeSetInterval = window.setInterval.bind(window);
const nativeClearInterval = window.clearInterval.bind(window);
const nativeSetTimeout = window.setTimeout.bind(window);
const nativeClearTimeout = window.clearTimeout.bind(window);
const nativeRequestAnimationFrame = window.requestAnimationFrame.bind(window);
const nativeCancelAnimationFrame = window.cancelAnimationFrame.bind(window);
const trackedIntervals = new Set();
const trackedTimeouts = new Set();
const trackedAnimationFrames = new Set();
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
const hideMobileControls = () => {
    const controls = $('mobile-controls');
    if (!controls) return;
    controls.classList.add('is-hidden');
    controls.style.display = 'none';
};
const showMobileControls = () => {
    const controls = $('mobile-controls');
    if (!controls) return;
    controls.classList.remove('is-hidden');
    controls.style.display = 'flex';
};
let uiBound = false;
let isGamePaused = false;
let wasPausedByOrientation = false;
const activeMobilePointers = new Map();

window.keyboard = keyboard;
window.mousePos = { x: 0, y: 0 };

const savedLanguage = localStorage.getItem('sharkieLanguage') || 'de';
const savedMuted = localStorage.getItem('sharkieMuted') === 'true';
window.gameSettings = {
    musicVolume: 0.3,
    sfxVolume: 0.5,
    language: savedLanguage,
    muted: savedMuted
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
        to_title: 'ZUM TITEL',
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
        audio_mute: '🔇 STUMM SCHALTEN',
        audio_unmute: '🔊 TON AKTIVIEREN',
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
        to_title: 'TO TITLE',
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
        audio_mute: '🔇 MUTE ALL',
        audio_unmute: '🔊 UNMUTE',
        back: 'Back'
    }
};

// Original Canvas-Größe
const ORIGINAL_WIDTH = 800;
const ORIGINAL_HEIGHT = 540;

window.setInterval = (handler, timeout, ...args) => {
    const intervalId = nativeSetInterval(handler, timeout, ...args);
    trackedIntervals.add(intervalId);
    return intervalId;
};

window.clearInterval = (intervalId) => {
    trackedIntervals.delete(intervalId);
    nativeClearInterval(intervalId);
};

window.setTimeout = (handler, timeout, ...args) => {
    const timeoutId = nativeSetTimeout(() => {
        trackedTimeouts.delete(timeoutId);
        if (typeof handler === 'function') {
            handler(...args);
            return;
        }
        Function(handler)();
    }, timeout);
    trackedTimeouts.add(timeoutId);
    return timeoutId;
};

window.clearTimeout = (timeoutId) => {
    trackedTimeouts.delete(timeoutId);
    nativeClearTimeout(timeoutId);
};

window.requestAnimationFrame = (callback) => {
    const frameId = nativeRequestAnimationFrame((timestamp) => {
        trackedAnimationFrames.delete(frameId);
        callback(timestamp);
    });
    trackedAnimationFrames.add(frameId);
    return frameId;
};

window.cancelAnimationFrame = (frameId) => {
    trackedAnimationFrames.delete(frameId);
    nativeCancelAnimationFrame(frameId);
};

function getLanguageStrings(lang) {
    return TRANSLATIONS[lang] || TRANSLATIONS.de;
}

function clearTrackedGameLoops() {
    trackedIntervals.forEach((intervalId) => nativeClearInterval(intervalId));
    trackedIntervals.clear();

    trackedTimeouts.forEach((timeoutId) => nativeClearTimeout(timeoutId));
    trackedTimeouts.clear();

    trackedAnimationFrames.forEach((frameId) => nativeCancelAnimationFrame(frameId));
    trackedAnimationFrames.clear();
}

function resetCanvasState() {
    if (!canvas) {
        canvas = $('canvas');
    }
    if (!canvas) {
        return;
    }

    canvas.width = ORIGINAL_WIDTH;
    canvas.height = ORIGINAL_HEIGHT;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
}

function teardownCurrentGame() {
    if (world && typeof world.pauseGame === 'function') {
        world.pauseGame();
    }

    clearTrackedGameLoops();
    resetKeyboardState();
    resetCanvasState();

    world = null;
    window.world = null;
    isGamePaused = false;
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
        const multiplier = Math.min(scale, 2); // Max 2x für stabilere Performance
        
        canvas.width = ORIGINAL_WIDTH * multiplier;
        canvas.height = ORIGINAL_HEIGHT * multiplier;
        
        // Context skalieren, damit Spiel-Koordinaten gleich bleiben
        ctx.scale(multiplier, multiplier);
    } else {
        // Zurück zur Original-Auflösung
        canvas.width = ORIGINAL_WIDTH;
        canvas.height = ORIGINAL_HEIGHT;
    }
    
    // Glatte Darstellung
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
}

function showStartScreen() {
    canvas = $("canvas");
    
    // Canvas-basierte Ansichten für Start und Optionen hier nicht mehr verwenden
    // HTML-Startbildschirm und HTML-Optionsbildschirm werden stattdessen verwendet
    // Startbildschirm wird über die Oberfläche gesteuert
    // Optionsbildschirm wird über die Oberfläche gesteuert
    
    // HTML-Startbildschirm anzeigen
    showEl('start-screen');
    hideEl('options-screen');
    hideMobileControls();
    
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
    updateMuteButtonLabel();
    updateOrientationLock();

    // startGame global verfügbar machen
    window.startGame = init;
    window.restartGame = restartGame;
}

function init() {
    teardownCurrentGame();

    if (!canvas) {
        canvas = $("canvas");
    }
    world = new World(canvas);
    window.world = world;
    
    // Wende gespeicherte Audio-Einstellungen an
    if (window.gameSettings) {
        if (window.gameSettings.musicVolume !== undefined && world.audioManager) {
            world.audioManager.setMusicVolume(window.gameSettings.musicVolume);
        }
        if (window.gameSettings.sfxVolume !== undefined && world.audioManager) {
            world.audioManager.setSFXVolume(window.gameSettings.sfxVolume);
        }
        if (world.audioManager) {
            world.audioManager.setMuted(!!window.gameSettings.muted);
        }
    }
    
    // Restart-Button initialisieren
    if (world.restartButton) {
        world.restartButton.setCanvasContext(canvas.getContext('2d'));
    }
    
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
    // Mobile-Controls nie als Canvas-Klick behandeln
    if (e.target.closest('#mobile-controls')) return;
    handleCanvasPointer(e.clientX, e.clientY);
});

document.addEventListener('touchstart', (e) => {
    if (!e.touches || e.touches.length === 0) return;
    // Mobile-Controls nie als Canvas-Touch behandeln
    if (e.target.closest('#mobile-controls')) return;
    const touch = e.touches[0];
    handleCanvasPointer(touch.clientX, touch.clientY);
}, { passive: true });

// Reagiert auf Wechsel zwischen Vollbild- und Fenstermodus
document.addEventListener('fullscreenchange', () => {
    const isFullscreen = !!document.fullscreenElement;
    updateCanvasResolution(isFullscreen);
});


// UI- und Input-Funktionen wurden aus Übersichtsgründen ausgelagert:
// `js/game-ui.js` und `js/game-controls.js`.