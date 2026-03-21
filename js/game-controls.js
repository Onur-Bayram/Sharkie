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

function isInsideDrawArea(relativeX, relativeY, drawArea) {
    return !(relativeX < 0 || relativeY < 0 || relativeX > drawArea.drawWidth || relativeY > drawArea.drawHeight);
}

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
    if (!canvas) {
        return;
    }

    const position = getCanvasPointerPosition(clientX, clientY);
    if (!position) {
        return;
    }

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
 * Checks if the current device is a smartphone in portrait mode, in which
 * the game should be locked.
 *
 * @returns {boolean}
 */
function isPortraitPhoneLayout() {
    return window.matchMedia('(max-width: 768px) and (orientation: portrait) and (hover: none) and (pointer: coarse)').matches;
}

/**
 * Applies orientation lock behavior and pauses or
 * resumes the game as needed.
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

function handleOrientationLockPause() {
    if (world && !isGamePaused && canvas && !canvas.classList.contains('hidden')) {
        if (typeof world.pauseGame === 'function') world.pauseGame();
        wasPausedByOrientation = true;
    }
    resetKeyboardState();
    hideMobileControls();
}

function resumeIfPausedByOrientation() {
    if (!canResumeFromOrientationLock()) return;
    world.resumeGame();
}

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
 * Shows or hides the options back icon depending on the current state.
 *
 * @returns {void}
 */
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
    backIconButton.classList.add('is-visible');
}

/**
 * Detects whether the current device is primarily controlled by touch.
 *
 * @returns {boolean}
 */
function isTouchGameplayDevice() {
    return navigator.maxTouchPoints > 0 || window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

/**
 * Updates the visibility of mobile controls and fullscreen button
 * based on current UI and device state.
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

function isBaseGameplayVisible() {
    const isGameVisible = !canvas.classList.contains('hidden');
    const isStartHidden = $('start-screen').classList.contains('is-hidden');
    const isOptionsHidden = $('options-screen').classList.contains('is-hidden');
    return !isPortraitPhoneLayout() && isGameVisible && isStartHidden && isOptionsHidden;
}

function toggleMobileControls(baseGameplayVisible) {
    if (isTouchGameplayDevice() && baseGameplayVisible) showMobileControls();
    else hideMobileControls();
}

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
 * Requests fullscreen again from a user gesture if mobile gameplay is visible.
 * @returns {void}
 */
function ensureMobileFullscreenFromGesture() {
    if (!isTouchGameplayDevice() || document.fullscreenElement) return;
    if (isPortraitPhoneLayout()) return;
    if (!canvas || canvas.classList.contains('hidden')) return;
    requestTouchFullscreenIfNeeded();
}

/**
 * aktiv the mobile controls by adding the 'visible' class.
 * @returns {void}
 */
function requestTouchFullscreenIfNeeded() {
    if (!isTouchGameplayDevice() || document.fullscreenElement) return;
    const container = document.body;
    if (!container || typeof container.requestFullscreen !== 'function') return;
    container.requestFullscreen().catch(() => {});
}

/**
 * Updates the icon and tooltip of the HTML fullscreen button.
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
 * Binds pointer-based mobile controls and synchronizes them with
 * keyboard state.
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

function bindMobilePointerDown(controls) {
    controls.addEventListener('pointerdown', (event) => {
        const button = event.target.closest('[data-key]');
        if (!button) return;
        event.preventDefault();
        activateMobileKey(button, event.pointerId);
        if (button.setPointerCapture) button.setPointerCapture(event.pointerId);
    });
}

function activateMobileKey(button, pointerId) {
    const key = button.dataset.key;
    if (!Object.prototype.hasOwnProperty.call(keyboard, key)) return;
    keyboard[key] = true;
    activeMobilePointers.set(pointerId, key);
}

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

function bindMobileSystemResetHandlers(controls) {
    controls.addEventListener('contextmenu', (event) => event.preventDefault());
    window.addEventListener('blur', resetKeyboardState);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) resetKeyboardState();
    });
}
