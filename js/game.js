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
let isGamePaused = false;

window.keyboard = keyboard;
window.mousePos = { x: 0, y: 0 };

const savedLanguage = localStorage.getItem('sharkieLanguage') || 'de';
window.gameSettings = {
    musicVolume: 0.3,
    sfxVolume: 0.5,
    language: savedLanguage
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
        back: 'Back'
    }
};

// Original Canvas-Größe
const ORIGINAL_WIDTH = 800;
const ORIGINAL_HEIGHT = 540;

function getLanguageStrings(lang) {
    return TRANSLATIONS[lang] || TRANSLATIONS.de;
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
    
    // HTML-Startbildschirm anzeigen
    showEl('start-screen');
    hideEl('options-screen');
    
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

// Event-Listener für Vollbildwechsel (z.B. wenn ESC gedrückt wird)
document.addEventListener('fullscreenchange', () => {
    const isFullscreen = !!document.fullscreenElement;
    updateCanvasResolution(isFullscreen);
    console.log('Fullscreen changed:', isFullscreen);
});


function startGameFromHTML() {
    // Startbildschirm ausblenden
    hideEl('start-screen');
    // Canvas anzeigen
    $('canvas').classList.remove('hidden');
    // Menübutton anzeigen
    showEl('game-menu-button');
    // Spiel starten
    init();
}

function showOptionsScreen() {
    // Ingame-Menübutton ausblenden, solange Optionen geöffnet sind
    hideEl('game-menu-button');
    // Startbildschirm ausblenden
    hideEl('start-screen');
    // Optionen-Bildschirm anzeigen
    showEl('options-screen');
    // Hauptmenü anzeigen
    showOptionsSubmenu('menu');
    // Untere Buttons je nach Spielstatus umschalten
    updateBackButtons();
}

function updateBackButtons() {
    if (isGamePaused) {
        // "Zurück zum Spiel" anzeigen, wenn aus dem laufenden Spiel pausiert wurde
        hideEl('back-to-start-button');
        showEl('back-to-game-button');
    } else {
        // "Zurück zum Start" aus dem Hauptmenü anzeigen
        showEl('back-to-start-button');
        hideEl('back-to-game-button');
    }
}

function showOptionsSubmenu(submenu) {
    // Alle Untermenüs ausblenden
    hideEl('options-menu');
    hideEl('options-language');
    hideEl('options-help');
    hideEl('options-audio');
    hideEl('options-impressum');
    
    // Gewähltes Untermenü anzeigen
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
    $('canvas').classList.add('hidden');
    hideEl('game-menu-button');
    showEl('start-screen');
    isGamePaused = false;
}

function backToGame() {
    // Optionen-Bildschirm ausblenden
    hideEl('options-screen');
    // Canvas und Menübutton anzeigen
    $('canvas').classList.remove('hidden');
    showEl('game-menu-button');
    // Spiel fortsetzen
    if (world && typeof world.resumeGame === 'function') {
        world.resumeGame();
    }
    isGamePaused = false;
}

function pauseAndReturnToMenu() {
    // Markieren, dass das Spiel pausiert ist
    isGamePaused = true;
    // Spiel-Loop/Audio pausieren und Eingaben zurücksetzen
    if (world) {
        if (typeof world.pauseGame === 'function') {
            world.pauseGame();
        }
    }
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.D = false;
    keyboard.F = false;
    keyboard.SPACE = false;

    // Optionen-Panel öffnen (wie bei Klick auf OPTIONS)
    showOptionsScreen();
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
        } else if (action === 'back-game') {
            backToGame();
        } else if (action === 'game-menu') {
            pauseAndReturnToMenu();
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
    if (!TRANSLATIONS[lang]) {
        lang = 'de';
    }

    if (button) {
        setActiveLanguageButton(lang);
    }

    console.log('Language changed to:', lang);

    window.gameSettings = window.gameSettings || {};
    window.gameSettings.language = lang;

    localStorage.setItem('sharkieLanguage', lang);
    applyLanguage(lang);
}

function updateMusicVolume(value) {
    $('music-value').textContent = value + '%';
    const volume = value / 100;
    
    // Global speichern
    window.gameSettings = window.gameSettings || {};
    window.gameSettings.musicVolume = volume;
    
    // Anwenden falls das Spiel läuft
    if (window.world && window.world.audioManager) {
        window.world.audioManager.setMusicVolume(volume);
    }
}

function updateSFXVolume(value) {
    $('sfx-value').textContent = value + '%';
    const volume = value / 100;
    
    // Global speichern
    window.gameSettings = window.gameSettings || {};
    window.gameSettings.sfxVolume = volume;
    
    // Anwenden, falls das Spiel läuft
    if (window.world && window.world.audioManager) {
        window.world.audioManager.setSFXVolume(volume);
    }
}