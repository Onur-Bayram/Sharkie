let canvas;
let world;
let startScreen;
let optionsScreen;
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
    canvas = document.getElementById("canvas");
    const ctx = canvas.getContext('2d');
    fullscreenButton = new FullscreenButton();
    fullscreenButton.setCanvasContext(canvas, ctx);
    startScreen = new StartScreen();
    optionsScreen = new OptionsScreen();
    
    // optionsScreen global verfügbar machen
    window.optionsScreen = optionsScreen;
    
    // Zentraler Event Handler für Start Screen
    const getCanvasCoords = (e) => {
        const rect = canvas.getBoundingClientRect();
        const canvasRatio = 800 / 540;
        const rectRatio = rect.width / rect.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (rectRatio > canvasRatio) {
            drawHeight = rect.height;
            drawWidth = rect.height * canvasRatio;
            offsetX = (rect.width - drawWidth) / 2;
            offsetY = 0;
        } else {
            drawWidth = rect.width;
            drawHeight = rect.width / canvasRatio;
            offsetX = 0;
            offsetY = (rect.height - drawHeight) / 2;
        }
        
        const mouseX = e.clientX - rect.left - offsetX;
        const mouseY = e.clientY - rect.top - offsetY;
        const x = (mouseX / drawWidth) * 800;
        const y = (mouseY / drawHeight) * 540;
        
        return { x, y };
    };
    
    canvas.addEventListener('click', (e) => {
        const { x, y } = getCanvasCoords(e);
        // Prüfe Options Screen ZUERST (hat Vorrang)
        if (optionsScreen.handleClick(x, y)) {
            return; // Wenn Options Screen den Klick verarbeitet hat, nicht weitermachen
        }
        // Nur wenn Options Screen nicht sichtbar oder Klick nicht verarbeitet
        startScreen.handleClick(x, y);
    });
    
    canvas.addEventListener('mousedown', (e) => {
        const { x, y } = getCanvasCoords(e);
        optionsScreen.handleMouseDown(x, y);
    });
    
    canvas.addEventListener('mousemove', (e) => {
        const { x, y } = getCanvasCoords(e);
        optionsScreen.handleMouseMove(x, y);
    });
    
    canvas.addEventListener('mouseup', () => {
        optionsScreen.handleMouseUp();
    });
    
    // Animations-Schleife für Startbildschirm
    function drawStartScreen() {
        startScreen.draw(ctx);
        optionsScreen.draw(ctx);
        if (startScreen.isVisible || optionsScreen.isVisible) {
            requestAnimationFrame(drawStartScreen);
        }
    }
    drawStartScreen();
    
    // startGame global verfügbar machen
    window.startGame = init;
}

function init() {
    if (!canvas) {
        canvas = document.getElementById("canvas");
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
    console.log('Fullscreen changed:', isFullscreen);});