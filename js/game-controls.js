/**
 * Wandelt Maus- oder Touch-Koordinaten aus dem Viewport in Spielkoordinaten
 * des Canvas um und berücksichtigt dabei mögliche Ränder.
 *
 * @param {number} clientX X-Koordinate des Pointers im Viewport.
 * @param {number} clientY Y-Koordinate des Pointers im Viewport.
 * @returns {{x: number, y: number} | null} Canvas-Position oder null außerhalb der Spielfläche.
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
 * Verarbeitet eine Pointer-Interaktion auf dem Canvas und leitet Treffer auf
 * den Neustart-Button weiter.
 *
 * @param {number} clientX X-Koordinate des Pointers im Viewport.
 * @param {number} clientY Y-Koordinate des Pointers im Viewport.
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
 * Setzt alle Tastaturzustände und aktiven mobilen Pointer-Eingaben zurück.
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
 * Prüft, ob das aktuelle Gerät ein Smartphone im Hochformat ist, bei dem
 * das Spiel gesperrt werden soll.
 *
 * @returns {boolean}
 */
function isPortraitPhoneLayout() {
    return window.matchMedia('(max-width: 768px) and (orientation: portrait) and (hover: none) and (pointer: coarse)').matches;
}

/**
 * Wendet das Verhalten für die Ausrichtungssperre an und pausiert oder
 * setzt das Spiel bei Bedarf fort.
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
 * Prüft, ob aktuell ein responsiver Breakpoint aktiv ist.
 *
 * @returns {boolean}
 */
function isResponsiveLayout() {
    return window.matchMedia('(max-width: 1024px)').matches;
}

/**
 * Blendet das Zurück-Symbol der Optionen abhängig vom aktuellen Zustand ein
 * oder aus.
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
 * Erkennt, ob das aktuelle Gerät hauptsächlich per Touch bedient wird.
 *
 * @returns {boolean}
 */
function isTouchGameplayDevice() {
    return navigator.maxTouchPoints > 0 || window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

/**
 * Aktualisiert die Sichtbarkeit der mobilen Steuerung und des Vollbild-Buttons
 * anhand des aktuellen UI- und Gerätezustands.
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
 * Aktualisiert das Symbol und den Tooltip des HTML-Vollbild-Buttons.
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
 * Bindet die Pointer-basierten Mobile-Controls und synchronisiert sie mit
 * dem Tastaturzustand.
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
