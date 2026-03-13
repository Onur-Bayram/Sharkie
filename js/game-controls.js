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

// Setzt alle aktuell gedrückten Tasten zurück
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

    // Haelt das Zurueck-Symbol oben rechts in allen Optionsansichten verfuegbar.
    backIconButton.classList.add('is-visible');
}

function isTouchGameplayDevice() {
    return navigator.maxTouchPoints > 0 || window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

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

// Aktualisiert das Icon des HTML-Vollbild-Buttons je nach Modus
function updateHtmlFullscreenButton() {
    const btn = $('html-fullscreen-button');
    if (!btn) return;
    btn.textContent = document.fullscreenElement ? '✕' : '⛶';
    btn.title = document.fullscreenElement ? 'Vollbild verlassen' : 'Vollbild';
}

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

    window.addEventListener('blur', resetKeyboardState);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            resetKeyboardState();
        }
    });
}
