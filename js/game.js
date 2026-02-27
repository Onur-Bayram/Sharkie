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

window.keyboard = keyboard;
window.mousePos = { x: 0, y: 0 };
window.gameSettings = {
    musicVolume: 0.3,
    sfxVolume: 0.5
};

// Original Canvas-Größe
const ORIGINAL_WIDTH = 800;
const ORIGINAL_HEIGHT = 540;

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
    
    // Canvas-basierte Screens nicht mehr verwenden für Start/Options
    // startScreen = new StartScreen();
    // optionsScreen = new OptionsScreen();
    
    // Show HTML start screen
    showEl('start-screen');
    hideEl('options-screen');
    
    // Initialize audio sliders with saved values
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
    
    // Restart Button 
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
    if (canvas) {
        const rect = canvas.getBoundingClientRect();
        
        // Berechne das tatsächliche Seitenverhältnis
        const canvasRatio = canvas.width / canvas.height;
        const rectRatio = rect.width / rect.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        // Letterboxing berücksichtigen object-fit: contain
        if (rectRatio > canvasRatio) {
            // Schwarze Balken links und rechts
            drawHeight = rect.height;
            drawWidth = rect.height * canvasRatio;
            offsetX = (rect.width - drawWidth) / 2;
            offsetY = 0;
        } else {
            // Schwarze Balken oben und unten
            drawWidth = rect.width;
            drawHeight = rect.width / canvasRatio;
            offsetX = 0;
            offsetY = (rect.height - drawHeight) / 2;
        }
        
        // Mausposition relativ zum tatsächlichen Canvas-Bild
        const mouseX = e.clientX - rect.left - offsetX;
        const mouseY = e.clientY - rect.top - offsetY;
        
        // Skalierung auf Canvas-Koordinaten 
        window.mousePos.x = (mouseX / drawWidth) * ORIGINAL_WIDTH;
        window.mousePos.y = (mouseY / drawHeight) * ORIGINAL_HEIGHT;
        
        //  Hover-State des Restart Buttons
        if (world && world.restartButton) {
            world.restartButton.updateHoverState(window.mousePos.x, window.mousePos.y);
        }
    }
});

document.addEventListener('click', (e) => {
    if (canvas && fullscreenButton && world) {
        const rect = canvas.getBoundingClientRect();
        
        // Berechne das tatsächliche Seitenverhältnis
        const canvasRatio = canvas.width / canvas.height;
        const rectRatio = rect.width / rect.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        // Letterboxing berücksichtigen 
        if (rectRatio > canvasRatio) {
            // Schwarze Balken links und rechts
            drawHeight = rect.height;
            drawWidth = rect.height * canvasRatio;
            offsetX = (rect.width - drawWidth) / 2;
            offsetY = 0;
        } else {
            // Schwarze Balken oben und unten
            drawWidth = rect.width;
            drawHeight = rect.width / canvasRatio;
            offsetX = 0;
            offsetY = (rect.height - drawHeight) / 2;
        }
        
        // Mausposition relativ zum tatsächlichen Canvas-Bild
        const mouseX = e.clientX - rect.left - offsetX;
        const mouseY = e.clientY - rect.top - offsetY;
        
        // Skalierung auf Canvas-Koordinaten, immer auf ORIGINAL_WIDTH/HEIGHT
        const x = (mouseX / drawWidth) * ORIGINAL_WIDTH;
        const y = (mouseY / drawHeight) * ORIGINAL_HEIGHT;
        
        console.log('Click:', {
            x: x.toFixed(1), 
            y: y.toFixed(1), 
            buttonX: fullscreenButton.buttonX, 
            buttonY: fullscreenButton.buttonY,
            rectRatio: rectRatio.toFixed(2),
            canvasRatio: canvasRatio.toFixed(2),
            offsetX: offsetX.toFixed(1),
            offsetY: offsetY.toFixed(1)
        });
        fullscreenButton.handleClick(x, y);
        world.restartButton.handleClick(x, y);
    }
});

// Fullscreen change event listener (z.B. wenn ESC gedrückt wird)
document.addEventListener('fullscreenchange', () => {
    const isFullscreen = !!document.fullscreenElement;
    updateCanvasResolution(isFullscreen);
    console.log('Fullscreen changed:', isFullscreen);
});

// ========== HTML Screen Management ==========

function startGameFromHTML() {
    // Hide start screen
    hideEl('start-screen');
    // Show canvas
    $('canvas').classList.remove('hidden');
    // Start the actual game
    init();
}

function showOptionsScreen() {
    // Hide start screen
    hideEl('start-screen');
    // Show options screen
    showEl('options-screen');
    // Show main menu
    showOptionsSubmenu('menu');
}

function showOptionsSubmenu(submenu) {
    // Hide all submenus
    hideEl('options-menu');
    hideEl('options-language');
    hideEl('options-help');
    hideEl('options-audio');
    hideEl('options-impressum');
    
    // Show selected submenu
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
}

function backToOptionsMenu() {
    showOptionsSubmenu('menu');
}

function hideOptionsScreen() {
    hideEl('options-screen');
    showEl('start-screen');
}

function bindUI() {
    if (uiBound) return;
    uiBound = true;

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
            backToOptionsMenu();
        } else if (action === 'back-start') {
            hideOptionsScreen();
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
    // Remove active class from all language buttons
    document.querySelectorAll('.lang-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to the clicked button
    if (button) {
        button.classList.add('active');
    }
    
    console.log('Language changed to:', lang);
    // Save language preference
    window.gameSettings = window.gameSettings || {};
    window.gameSettings.language = lang;
}

function updateMusicVolume(value) {
    $('music-value').textContent = value + '%';
    const volume = value / 100;
    
    // Save globally
    window.gameSettings = window.gameSettings || {};
    window.gameSettings.musicVolume = volume;
    
    // Apply if game is running
    if (window.world && window.world.audioManager) {
        window.world.audioManager.setMusicVolume(volume);
    }
}

function updateSFXVolume(value) {
    $('sfx-value').textContent = value + '%';
    const volume = value / 100;
    
    // Save globally
    window.gameSettings = window.gameSettings || {};
    window.gameSettings.sfxVolume = volume;
    
    // Apply if game is running
    if (window.world && window.world.audioManager) {
        window.world.audioManager.setSFXVolume(volume);
    }
}