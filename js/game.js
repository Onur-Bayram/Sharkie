/** @type {HTMLCanvasElement} Reference to the main canvas element. */
let canvas;

/** @type {World} The active game world instance. */
let world;

/** Native timer functions saved before patching to allow cleanup tracking. */
const nativeSetInterval = setInterval;
const nativeClearInterval = clearInterval;
const nativeSetTimeout = setTimeout;
const nativeClearTimeout = clearTimeout;
const nativeRequestAnimationFrame = requestAnimationFrame;
const nativeCancelAnimationFrame = cancelAnimationFrame;

/** @type {Set<number>} All active setInterval IDs for later cleanup. */
const trackedIntervals = new Set();

/** @type {Set<number>} All active setTimeout IDs for later cleanup. */
const trackedTimeouts = new Set();

/** @type {Set<number>} All active requestAnimationFrame IDs for later cleanup. */
const trackedAnimationFrames = new Set();

/**
 * Keyboard state of the player.
 * Each property corresponds to a control key (true = pressed).
 */
let keyboard = {
  LEFT: false,
  RIGHT: false,
  UP: false,
  DOWN: false,
  D: false,
  F: false,
  SPACE: false,
};

/** Returns a DOM element by its ID. @param {string} id @returns {HTMLElement} */
const $ = (id) => document.getElementById(id);

/** Shows an element by removing the 'is-hidden' class. @param {string} id */
const showEl = (id) => $(id).classList.remove("is-hidden");

/** Hides an element by adding the 'is-hidden' class. @param {string} id */
const hideEl = (id) => $(id).classList.add("is-hidden");

/** Hides the mobile on-screen controls. */
const hideMobileControls = () => {
  const controls = $("mobile-controls");
  if (!controls) return;
  controls.classList.add("is-hidden");
};

/** Shows the mobile on-screen controls. */
const showMobileControls = () => {
  const controls = $("mobile-controls");
  if (!controls) return;
  controls.classList.remove("is-hidden");
};

/** @type {boolean} Guards against binding UI event listeners more than once. */
let uiBound = false;

/** @type {boolean} Whether the game is currently paused. */
let isGamePaused = false;

/** @type {boolean} Whether the game was paused due to a device orientation change. */
let wasPausedByOrientation = false;

/** @type {Map<number, string>} Maps active pointer IDs to their corresponding control keys (mobile). */
const activeMobilePointers = new Map();

/** @type {{x: number, y: number}} Current mouse position in the viewport. */
let mousePos = { x: 0, y: 0 };

const savedLanguage = localStorage.getItem("sharkieLanguage") || "de";
const savedMuted = localStorage.getItem("sharkieMuted") === "true";

/**
 * Global game settings (volume, language, mute state).
 * Loaded from localStorage on startup.
 */
let gameSettings = {
  musicVolume: 0.3,
  sfxVolume: 0.5,
  language: savedLanguage,
  muted: savedMuted,
};

const TRANSLATIONS = {
  de: {
    start: "START",
    options: "OPTIONEN",
    menu_languages: "SPRACHEN",
    menu_help: "HILFE",
    menu_audio: "AUDIO",
    menu_impressum: "IMPRESSUM",
    back_start: "ZURÜCK ZUM START",
    to_title: "ZUM TITEL",
    back_game: "ZURÜCK ZUM SPIEL",
    submenu_languages: "SPRACHEN",
    submenu_controls: "STEUERUNG",
    submenu_audio: "AUDIO",
    submenu_impressum: "IMPRESSUM",
    help_move: "Sharkie bewegen",
    help_bubble: "Normale Blasen werfen",
    help_poison: "Gift-Blasen werfen",
    help_attack: "Flossen-Schlag Angriff",
    help_tip: "Sammle Münzen • Weiche Feinden aus • Besiege den Boss!",
    audio_music: "Hintergrundmusik",
    audio_sfx: "Sound-Effekte",
    audio_mute: "🔇 STUMM SCHALTEN",
    audio_unmute: "🔊 TON AKTIVIEREN",
    back: "Zurück",
  },
  en: {
    start: "START",
    options: "OPTIONS",
    menu_languages: "LANGUAGES",
    menu_help: "HELP",
    menu_audio: "AUDIO",
    menu_impressum: "LEGAL NOTICE",
    back_start: "BACK TO START",
    to_title: "TO TITLE",
    back_game: "BACK TO GAME",
    submenu_languages: "LANGUAGES",
    submenu_controls: "CONTROLS",
    submenu_audio: "AUDIO",
    submenu_impressum: "LEGAL NOTICE",
    help_move: "Move Sharkie",
    help_bubble: "Throw normal bubbles",
    help_poison: "Throw poison bubbles",
    help_attack: "Fin-slap attack",
    help_tip: "Collect coins • Dodge enemies • Defeat the boss!",
    audio_music: "Background music",
    audio_sfx: "Sound effects",
    audio_mute: "🔇 MUTE ALL",
    audio_unmute: "🔊 UNMUTE",
    back: "Back",
  },
};
/** @type {number} Original game width in pixels. */
const ORIGINAL_WIDTH = 800;

/** @type {number} Original game height in pixels. */
const ORIGINAL_HEIGHT = 540;

/**
 * Overrides setInterval to track all IDs centrally for later cleanup.
 * @param {Function|string} handler Callback function or code string.
 * @param {number} timeout Interval duration in milliseconds.
 * @returns {number} ID of the created interval.
 */
setInterval = (handler, timeout, ...args) => {
  const intervalId = nativeSetInterval(handler, timeout, ...args);
  trackedIntervals.add(intervalId);
  return intervalId;
};

/**
 * Overrides clearInterval and removes the ID from the tracking set.
 * @param {number} intervalId The ID of the interval to clear.
 */
clearInterval = (intervalId) => {
  trackedIntervals.delete(intervalId);
  nativeClearInterval(intervalId);
};

/**
 * Overrides setTimeout to track all IDs centrally for later cleanup.
 * @param {Function|string} handler Callback function or code string.
 * @param {number} timeout Delay in milliseconds.
 * @returns {number} ID of the created timeout.
 */
setTimeout = (handler, timeout, ...args) => {
  const timeoutId = nativeSetTimeout(() => {
    trackedTimeouts.delete(timeoutId);
    if (typeof handler === "function") {
      handler(...args);
      return;
    }
    Function(handler)();
  }, timeout);
  trackedTimeouts.add(timeoutId);
  return timeoutId;
};

/**
 * Overrides clearTimeout and removes the ID from the tracking set.
 * @param {number} timeoutId The ID of the timeout to clear.
 */
clearTimeout = (timeoutId) => {
  trackedTimeouts.delete(timeoutId);
  nativeClearTimeout(timeoutId);
};

/**
 * Overrides requestAnimationFrame to track all frame IDs centrally.
 * @param {FrameRequestCallback} callback Callback for the next animation frame.
 * @returns {number} ID of the created animation frame.
 */
requestAnimationFrame = (callback) => {
  const frameId = nativeRequestAnimationFrame((timestamp) => {
    trackedAnimationFrames.delete(frameId);
    callback(timestamp);
  });
  trackedAnimationFrames.add(frameId);
  return frameId;
};

/**
 * Overrides cancelAnimationFrame and removes the frame ID from the tracking set.
 * @param {number} frameId The ID of the animation frame to cancel.
 */
cancelAnimationFrame = (frameId) => {
  trackedAnimationFrames.delete(frameId);
  nativeCancelAnimationFrame(frameId);
};

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

  trackedAnimationFrames.forEach((frameId) =>
    nativeCancelAnimationFrame(frameId),
  );
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
  if (!canvas) canvas = $("canvas");
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
  const ctx = canvas.getContext("2d");
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
}

/**
 * Cleans up the current game instance and resets global states.
 *
 * @returns {void}
 */
function teardownCurrentGame() {
  if (world && typeof world.pauseGame === "function") {
    world.pauseGame();
  }
  if (typeof stopAssetLoadingGate === "function") {
    stopAssetLoadingGate();
  }

  clearTrackedGameLoops();
  resetKeyboardState();
  resetCanvasState();

  world = null;
  isGamePaused = false;
}

/**
 * Displays the start screen and synchronizes the UI with saved settings.
 *
 * @returns {void}
 */
function showStartScreen() {
  canvas = $("canvas");
  showStartUiShell();
  syncAudioSliderValues();
  bindUI();
  applyLanguage(gameSettings.language || "de");
  updateMuteButtonLabel();
  updateOrientationLock();
}

/**
 * Shows start UI shell and hides gameplay-only controls.
 *
 * @returns {void}
 */
function showStartUiShell() {
  showEl("start-screen");
  hideEl("options-screen");
  hideMobileControls();
}

/**
 * Synchronizes audio sliders with persisted settings values.
 *
 * @returns {void}
 */
function syncAudioSliderValues() {
  if (!gameSettings) return;
  syncSingleSlider("music-slider", "music-value", gameSettings.musicVolume);
  syncSingleSlider("sfx-slider", "sfx-value", gameSettings.sfxVolume);
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
  $(labelId).textContent = Math.round(value * 100) + "%";
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

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") keyboard.LEFT = true;
  if (e.key === "ArrowRight") keyboard.RIGHT = true;
  if (e.key === "ArrowUp") keyboard.UP = true;
  if (e.key === "ArrowDown") keyboard.DOWN = true;
  if (e.key === "d" || e.key === "D") keyboard.D = true;
  if (e.key === "f" || e.key === "F") keyboard.F = true;
  if (e.key === " ") keyboard.SPACE = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") keyboard.LEFT = false;
  if (e.key === "ArrowRight") keyboard.RIGHT = false;
  if (e.key === "ArrowUp") keyboard.UP = false;
  if (e.key === "ArrowDown") keyboard.DOWN = false;
  if (e.key === "d" || e.key === "D") keyboard.D = false;
  if (e.key === "f" || e.key === "F") keyboard.F = false;
  if (e.key === " ") keyboard.SPACE = false;
});

document.addEventListener("mousemove", (e) => {
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

document.addEventListener("click", (e) => {
  if (e.target.closest("#mobile-controls")) return;
  handleCanvasPointer(e.clientX, e.clientY);
});

document.addEventListener(
  "touchstart",
  (e) => {
    if (!e.touches || e.touches.length === 0) return;
    if (e.target.closest("#mobile-controls")) return;
    const touch = e.touches[0];
    handleCanvasPointer(touch.clientX, touch.clientY);
  },
  { passive: true },
);
document.addEventListener("fullscreenchange", () => {
  const isFullscreen = !!document.fullscreenElement;
  updateCanvasResolution(isFullscreen);
});
