/**
 * Converts mouse or touch coordinates from viewport to game canvas coordinates,
 * accounting for possible borders.
 *
 * @param {number} clientX X-coordinate of the pointer in the viewport.
 * @param {number} clientY Y-coordinate of the pointer in the viewport.
 * @returns {{x: number, y: number} | null} Canvas position or null outside the play area.
 */
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
        hideMobileControls();
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
    updateMobileControlsVisibility();
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
    if (!controls || !canvas) {
        return;
    }
    const isGameVisible = !canvas.classList.contains('hidden');
    const isStartHidden = $('start-screen').classList.contains('is-hidden');
    const isOptionsHidden = $('options-screen').classList.contains('is-hidden');
    const baseGameplayVisible = !isPortraitPhoneLayout() && isGameVisible && isStartHidden && isOptionsHidden;
    const shouldShowControls = isTouchGameplayDevice() && baseGameplayVisible;
    const shouldShowFullscreenButton = baseGameplayVisible;

    if (shouldShowControls) {
        showMobileControls();
    } else {
        hideMobileControls();
    }

    if (htmlFullscreenButton) {
        htmlFullscreenButton.style.display = shouldShowFullscreenButton ? 'flex' : 'none';
    }
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
    if (!controls) {
        return;
    }

    const getButtonFromEvent = (event) => event.target.closest('[data-key]');

    controls.addEventListener('pointerdown', (event) => {
        const button = getButtonFromEvent(event);
        if (!button) {
            return;
        }

        event.preventDefault();
        const key = button.dataset.key;
        if (!Object.prototype.hasOwnProperty.call(keyboard, key)) {
            return;
        }

        keyboard[key] = true;
        activeMobilePointers.set(event.pointerId, key);

        if (button.setPointerCapture) {
            button.setPointerCapture(event.pointerId);
        }
    });

    const releasePointerKey = (event) => {
        const key = activeMobilePointers.get(event.pointerId);
        if (!key) {
            return;
        }

        keyboard[key] = false;
        activeMobilePointers.delete(event.pointerId);
    };

    controls.addEventListener('pointerup', releasePointerKey);
    controls.addEventListener('pointercancel', releasePointerKey);

    controls.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });

    window.addEventListener('blur', resetKeyboardState);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            resetKeyboardState();
        }
    });
}
