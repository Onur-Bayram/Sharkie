let canvas;
let world;
const nativeSetInterval = setInterval;
const nativeClearInterval = clearInterval;
const nativeSetTimeout = setTimeout;
const nativeClearTimeout = clearTimeout;
const nativeRequestAnimationFrame = requestAnimationFrame;
const nativeCancelAnimationFrame = cancelAnimationFrame;
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
};
const showMobileControls = () => {
    const controls = $('mobile-controls');
    if (!controls) return;
    controls.classList.remove('is-hidden');
};
let uiBound = false;
let isGamePaused = false;
let wasPausedByOrientation = false;
const activeMobilePointers = new Map();

let mousePos = { x: 0, y: 0 };

const savedLanguage = localStorage.getItem('sharkieLanguage') || 'de';
const savedMuted = localStorage.getItem('sharkieMuted') === 'true';
let gameSettings = {
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
const ORIGINAL_WIDTH = 800;
const ORIGINAL_HEIGHT = 540;

setInterval = (handler, timeout, ...args) => {
    const intervalId = nativeSetInterval(handler, timeout, ...args);
    trackedIntervals.add(intervalId);
    return intervalId;
};

clearInterval = (intervalId) => {
    trackedIntervals.delete(intervalId);
    nativeClearInterval(intervalId);
};

setTimeout = (handler, timeout, ...args) => {
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

clearTimeout = (timeoutId) => {
    trackedTimeouts.delete(timeoutId);
    nativeClearTimeout(timeoutId);
};

requestAnimationFrame = (callback) => {
    const frameId = nativeRequestAnimationFrame((timestamp) => {
        trackedAnimationFrames.delete(frameId);
        callback(timestamp);
    });
    trackedAnimationFrames.add(frameId);
    return frameId;
};

cancelAnimationFrame = (frameId) => {
    trackedAnimationFrames.delete(frameId);
    nativeCancelAnimationFrame(frameId);
};

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
 * Terminates all registered intervals, timeouts, and animation frames of the game.
 *
 * @returns {void}
 */
function clearTrackedGameLoops() {
    trackedIntervals.forEach((intervalId) => nativeClearInterval(intervalId));
    trackedIntervals.clear();

    trackedTimeouts.forEach((timeoutId) => nativeClearTimeout(timeoutId));
    trackedTimeouts.clear();

    trackedAnimationFrames.forEach((frameId) => nativeCancelAnimationFrame(frameId));
    trackedAnimationFrames.clear();
}

/**
 * Resets canvas size, transformation, and rendering state to default values.
 *
 * @returns {void}
 */
function resetCanvasState() {
    if (!ensureCanvasElement()) return;
    applyDefaultCanvasSize();
    resetCanvasRenderingState();
}

/**
 * Ensures the global canvas reference points to the DOM canvas element.
 *
 * @returns {boolean} Canvas element exists and is valid.
 */
function ensureCanvasElement() {
    if (!canvas) canvas = $('canvas');
    return !!canvas;
}

/**
 * Restores the base internal canvas resolution.
 *
 * @returns {void}
 */
function applyDefaultCanvasSize() {
    canvas.width = ORIGINAL_WIDTH;
    canvas.height = ORIGINAL_HEIGHT;
}

/**
 * Resets canvas transform and clears previous frame content.
 *
 * @returns {void}
 */
function resetCanvasRenderingState() {
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
}

/**
 * Cleans up the current game instance and resets global states.
 *
 * @returns {void}
 */
function teardownCurrentGame() {
    if (world && typeof world.pauseGame === 'function') {
        world.pauseGame();
    }
    if (typeof stopAssetLoadingGate === 'function') {
        stopAssetLoadingGate();
    }

    clearTrackedGameLoops();
    resetKeyboardState();
    resetCanvasState();

    world = null;
    isGamePaused = false;
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

/**
 * Displays the start screen and synchronizes the UI with saved settings.
 *
 * @returns {void}
 */
function showStartScreen() {
    canvas = $('canvas');
    showStartUiShell();
    syncAudioSliderValues();
    bindUI();
    applyLanguage(gameSettings.language || 'de');
    updateMuteButtonLabel();
    updateOrientationLock();
}

/**
 * Shows start UI shell and hides gameplay-only controls.
 *
 * @returns {void}
 */
function showStartUiShell() {
    showEl('start-screen');
    hideEl('options-screen');
    hideMobileControls();
}

/**
 * Synchronizes audio sliders with persisted settings values.
 *
 * @returns {void}
 */
function syncAudioSliderValues() {
    if (!gameSettings) return;
    syncSingleSlider('music-slider', 'music-value', gameSettings.musicVolume);
    syncSingleSlider('sfx-slider', 'sfx-value', gameSettings.sfxVolume);
}

/**
 * Applies a single slider value and updates its percentage label.
 *
 * @param {string} sliderId The slider element ID.
 * @param {string} labelId The label element ID.
 * @param {number} value The value to apply.
 * @returns {void}
 */
function syncSingleSlider(sliderId, labelId, value) {
    if (value === undefined) return;
    $(sliderId).value = value * 100;
    $(labelId).textContent = Math.round(value * 100) + '%';
}

/**
 * Initializes a new game world on the current canvas.
 *
 * @returns {void}
 */
function init() {
    teardownCurrentGame();
    ensureCanvasElement();
    world = new World(canvas);
    applySavedAudioSettings();
}

/**
 * Applies persisted music/SFX/mute settings to the active audio manager.
 *
 * @returns {void}
 */
function applySavedAudioSettings() {
    if (!gameSettings || !world.audioManager) return;
    if (gameSettings.musicVolume !== undefined) {
        world.audioManager.setMusicVolume(gameSettings.musicVolume);
    }
    if (gameSettings.sfxVolume !== undefined) {
        world.audioManager.setSFXVolume(gameSettings.sfxVolume);
    }
    world.audioManager.setMuted(!!gameSettings.muted);
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

    mousePos.x = position.x;
    mousePos.y = position.y;

    if (world && world.restartButton) {
        world.restartButton.updateHoverState(position.x, position.y);
    }
});

document.addEventListener('click', (e) => {
    if (e.target.closest('#mobile-controls')) return;
    handleCanvasPointer(e.clientX, e.clientY);
});

document.addEventListener('touchstart', (e) => {
    if (!e.touches || e.touches.length === 0) return;
    if (e.target.closest('#mobile-controls')) return;
    const touch = e.touches[0];
    handleCanvasPointer(touch.clientX, touch.clientY);
}, { passive: true });
document.addEventListener('fullscreenchange', () => {
    const isFullscreen = !!document.fullscreenElement;
    updateCanvasResolution(isFullscreen);
});