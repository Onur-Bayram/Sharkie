/**
 * Converts mouse or touch coordinates from viewport to game canvas coordinates,
 * accounting for possible borders.
 *
 * @param {number} clientX X-coordinate of the pointer in the viewport.
 * @param {number} clientY Y-coordinate of the pointer in the viewport.
 * @returns {{x: number, y: number} | null} Canvas position or null outside the play area.
 */
function getCanvasPointerPosition(clientX, clientY) {
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const drawArea = getCanvasDrawArea(rect);
    const relativeX = clientX - rect.left - drawArea.offsetX;
    const relativeY = clientY - rect.top - drawArea.offsetY;
    if (!isInsideDrawArea(relativeX, relativeY, drawArea)) return null;
    return toCanvasCoordinates(relativeX, relativeY, drawArea);
}

/**
 * Calculates drawable canvas area inside the element box.
 * @param {{width: number, height: number}} rect Bounding rectangle of the canvas.
 * @returns {{drawWidth: number, drawHeight: number, offsetX: number, offsetY: number}} Draw area data.
 */
function getCanvasDrawArea(rect) {
    const canvasRatio = ORIGINAL_WIDTH / ORIGINAL_HEIGHT;
    const rectRatio = rect.width / rect.height;
    if (rectRatio > canvasRatio) {
        const drawWidth = rect.height * canvasRatio;
        return { drawWidth, drawHeight: rect.height, offsetX: (rect.width - drawWidth) / 2, offsetY: 0 };
    }
    const drawHeight = rect.width / canvasRatio;
    return { drawWidth: rect.width, drawHeight, offsetX: 0, offsetY: (rect.height - drawHeight) / 2 };
}

/**
 * Returns whether a pointer is inside the drawable game area.
 * @param {number} relativeX Relative X in draw area space.
 * @param {number} relativeY Relative Y in draw area space.
 * @param {{drawWidth: number, drawHeight: number}} drawArea Draw area data.
 * @returns {boolean} True when inside draw area.
 */
function isInsideDrawArea(relativeX, relativeY, drawArea) {
    return !(relativeX < 0 || relativeY < 0 || relativeX > drawArea.drawWidth || relativeY > drawArea.drawHeight);
}

/**
 * Converts draw-area coordinates to game-world coordinates.
 * @param {number} relativeX Relative X in draw area space.
 * @param {number} relativeY Relative Y in draw area space.
 * @param {{drawWidth: number, drawHeight: number}} drawArea Draw area data.
 * @returns {{x: number, y: number}} Canvas/game coordinates.
 */
function toCanvasCoordinates(relativeX, relativeY, drawArea) {
    return {
        x: (relativeX / drawArea.drawWidth) * ORIGINAL_WIDTH,
        y: (relativeY / drawArea.drawHeight) * ORIGINAL_HEIGHT
    };
}

/**
 * Processes a pointer interaction on the canvas and forwards hits to
 * the restart button.
 *
 * @param {number} clientX X-coordinate of the pointer in the viewport.
 * @param {number} clientY Y-coordinate of the pointer in the viewport.
 * @returns {void}
 */
function handleCanvasPointer(clientX, clientY) {
    if (!canvas) return;
    const position = getCanvasPointerPosition(clientX, clientY);
    if (!position) return;
    if (world && world.restartButton) {
        world.restartButton.handleClick(position.x, position.y);
    }
}

/**
 * Resets all keyboard states and active mobile pointer inputs.
 *
 * @returns {void}
 */
function resetKeyboardState() {
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.D = false;
    keyboard.F = false;
    keyboard.SPACE = false;
    activeMobilePointers.clear();
}

/**
 * Checks if the current device is a smartphone in portrait mode,
 * where gameplay should be locked.
 *
 * @returns {boolean}
 */
function isPortraitPhoneLayout() {
    return window.matchMedia('(max-width: 768px) and (orientation: portrait) and (hover: none) and (pointer: coarse)').matches;
}

/**
 * Applies orientation lock behavior and pauses or resumes the game.
 *
 * @returns {void}
 */
function updateOrientationLock() {
    const isLocked = isPortraitPhoneLayout();
    document.body.classList.toggle('portrait-lock', isLocked);
    if (!canvas) canvas = $('canvas');
    if (isLocked) {
        handleOrientationLockPause();
        return;
    }
    resumeIfPausedByOrientation();
    wasPausedByOrientation = false;
    updateMobileControlsVisibility();
}

/**
 * Pauses gameplay and hides controls while portrait lock is active.
 * @returns {void}
 */
function handleOrientationLockPause() {
    if (world && !isGamePaused && canvas && !canvas.classList.contains('hidden')) {
        if (typeof world.pauseGame === 'function') world.pauseGame();
        wasPausedByOrientation = true;
    }
    resetKeyboardState();
    hideMobileControls();
}

/**
 * Resumes gameplay if portrait-lock pause state allows it.
 * @returns {void}
 */
function resumeIfPausedByOrientation() {
    if (!canResumeFromOrientationLock()) return;
    world.resumeGame();
}

/**
 * Returns whether the game can resume after orientation lock.
 * @returns {boolean}
 */
function canResumeFromOrientationLock() {
    if (!wasPausedByOrientation || !world || isGamePaused) return false;
    if (!$('options-screen').classList.contains('is-hidden')) return false;
    if (!canvas || canvas.classList.contains('hidden')) return false;
    return typeof world.resumeGame === 'function';
}

/**
 * Checks if a responsive breakpoint is currently active.
 *
 * @returns {boolean}
 */
function isResponsiveLayout() {
    return window.matchMedia('(max-width: 1024px)').matches;
}

/**
 * Shows or hides the options back icon depending on current state.
 *
 * @returns {void}
 */
function updateBackIconVisibility() {
    const optionsScreen = $('options-screen');
    const backIconButton = optionsScreen?.querySelector('.back-icon-button');
    if (!optionsScreen || !backIconButton) return;
    if (optionsScreen.classList.contains('is-hidden')) {
        backIconButton.classList.remove('is-visible');
        return;
    }
    backIconButton.classList.add('is-visible');
}

/**
 * Detects whether the current device is primarily touch-driven.
 *
 * @returns {boolean}
 */
function isTouchGameplayDevice() {
    return navigator.maxTouchPoints > 0 || window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

/**
 * Updates visibility of mobile controls and fullscreen button.
 *
 * @returns {void}
 */
function updateMobileControlsVisibility() {
    const controls = $('mobile-controls');
    const htmlFullscreenButton = $('html-fullscreen-button');
    if (!controls || !canvas) return;
    const baseGameplayVisible = isBaseGameplayVisible();
    toggleMobileControls(baseGameplayVisible);
    toggleHtmlFullscreenButton(htmlFullscreenButton, baseGameplayVisible);
    enforceMobileFullscreen(baseGameplayVisible);
}

/**
 * Returns whether core gameplay UI is currently visible.
 * @returns {boolean}
 */
function isBaseGameplayVisible() {
    const isGameVisible = !canvas.classList.contains('hidden');
    const isStartHidden = $('start-screen').classList.contains('is-hidden');
    const isOptionsHidden = $('options-screen').classList.contains('is-hidden');
    return !isPortraitPhoneLayout() && isGameVisible && isStartHidden && isOptionsHidden;
}

/**
 * Shows or hides mobile controls based on gameplay visibility.
 * @param {boolean} baseGameplayVisible Core gameplay visibility flag.
 * @returns {void}
 */
function toggleMobileControls(baseGameplayVisible) {
    if (isTouchGameplayDevice() && baseGameplayVisible) showMobileControls();
    else hideMobileControls();
}

/**
 * Shows desktop fullscreen button only when relevant.
 * @param {HTMLElement|null} button Fullscreen button element.
 * @param {boolean} baseGameplayVisible Core gameplay visibility flag.
 * @returns {void}
 */
function toggleHtmlFullscreenButton(button, baseGameplayVisible) {
    if (!button) return;
    if (isTouchGameplayDevice()) {
        button.style.display = 'none';
        return;
    }
    button.style.display = baseGameplayVisible ? 'flex' : 'none';
}

/**
 * Keeps mobile gameplay in fullscreen when possible.
 * @param {boolean} [baseGameplayVisible] Precomputed gameplay visibility.
 * @returns {void}
 */
function enforceMobileFullscreen(baseGameplayVisible) {
    const gameplayVisible = baseGameplayVisible ?? isBaseGameplayVisible();
    if (!isTouchGameplayDevice() || !gameplayVisible || document.fullscreenElement) return;
    requestTouchFullscreenIfNeeded();
}

/**
 * Requests fullscreen again from a user gesture when gameplay is visible.
 * @returns {void}
 */
function ensureMobileFullscreenFromGesture() {
    if (!isTouchGameplayDevice() || document.fullscreenElement) return;
    if (isPortraitPhoneLayout()) return;
    if (!canvas || canvas.classList.contains('hidden')) return;
    requestTouchFullscreenIfNeeded();
}

/**
 * Requests fullscreen mode on touch devices if currently not fullscreen.
 * @returns {void}
 */
function requestTouchFullscreenIfNeeded() {
    if (!isTouchGameplayDevice() || document.fullscreenElement) return;
    const container = document.body;
    if (!container || typeof container.requestFullscreen !== 'function') return;
    container.requestFullscreen().catch(() => {});
}

/**
 * Updates icon and tooltip text of the HTML fullscreen button.
 *
 * @returns {void}
 */
function updateHtmlFullscreenButton() {
    const btn = $('html-fullscreen-button');
    if (!btn) return;
    btn.textContent = document.fullscreenElement ? '✕' : '⛶';
    btn.title = document.fullscreenElement ? 'Vollbild verlassen' : 'Vollbild';
}

/**
 * Binds pointer-based mobile controls and syncs them with keyboard state.
 *
 * @returns {void}
 */
function bindMobileControls() {
    const controls = $('mobile-controls');
    if (!controls) return;
    bindMobilePointerDown(controls);
    bindMobilePointerRelease(controls);
    bindMobileSystemResetHandlers(controls);
}

/**
 * Binds pointerdown handling for mobile control buttons.
 * @param {HTMLElement} controls Mobile controls container.
 * @returns {void}
 */
function bindMobilePointerDown(controls) {
    controls.addEventListener('pointerdown', (event) => {
        const button = event.target.closest('[data-key]');
        if (!button) return;
        event.preventDefault();
        activateMobileKey(button, event.pointerId);
        if (button.setPointerCapture) button.setPointerCapture(event.pointerId);
    });
}

/**
 * Activates keyboard state for a touched mobile control button.
 * @param {HTMLElement} button Button element with data-key.
 * @param {number} pointerId Pointer identifier.
 * @returns {void}
 */
function activateMobileKey(button, pointerId) {
    const key = button.dataset.key;
    if (!Object.prototype.hasOwnProperty.call(keyboard, key)) return;
    keyboard[key] = true;
    activeMobilePointers.set(pointerId, key);
}

/**
 * Binds pointer release/cancel to clear active mobile key states.
 * @param {HTMLElement} controls Mobile controls container.
 * @returns {void}
 */
function bindMobilePointerRelease(controls) {
    const releasePointerKey = (event) => {
        const key = activeMobilePointers.get(event.pointerId);
        if (!key) return;
        keyboard[key] = false;
        activeMobilePointers.delete(event.pointerId);
    };
    controls.addEventListener('pointerup', releasePointerKey);
    controls.addEventListener('pointercancel', releasePointerKey);
}

/**
 * Binds system-level handlers to reset mobile input safely.
 * @param {HTMLElement} controls Mobile controls container.
 * @returns {void}
 */
function bindMobileSystemResetHandlers(controls) {
    controls.addEventListener('contextmenu', (event) => event.preventDefault());
    window.addEventListener('blur', resetKeyboardState);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) resetKeyboardState();
    });
}
