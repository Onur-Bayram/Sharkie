/**
 * Options-Bildschirm (Canvas-Version) – zeigt Menü, Sprachen, Hilfe, Audio und Impressum.
 * Wird hauptsächlich als Legacy-Fallback genutzt; die aktive UI läuft über HTML-Overlays.
 */
class OptionsScreen {
    isVisible = false;
    backgroundImg = new Image();
    currentMode = 'menu';
    languageButtonX = 275;
    languageButtonY = 100;
    languageButtonWidth = 250;
    languageButtonHeight = 70;
    
    helpButtonX = 275;
    helpButtonY = 185;
    helpButtonWidth = 250;
    helpButtonHeight = 70;
    
    audioButtonX = 275;
    audioButtonY = 270;
    audioButtonWidth = 250;
    audioButtonHeight = 70;
    
    impressumButtonX = 275;
    impressumButtonY = 355;
    impressumButtonWidth = 250;
    impressumButtonHeight = 70;
    musicSliderX = 200;
    musicSliderY = 200;
    sfxSliderX = 200;
    sfxSliderY = 300;
    sliderWidth = 400;
    sliderHeight = 20;
    musicVolume = 0.3;
    sfxVolume = 0.5;
    draggingMusic = false;
    draggingSFX = false;
    backButtonX = 300;
    backButtonY = 450;
    backButtonWidth = 200;
    backButtonHeight = 60;
    
    constructor() {
        this.backgroundImg.src = '3. Background/Mesa de trabajo 1.png';
    }
    
    /**
     * Startet das Drücken eines Sliders (Musik oder SFX) wenn der Zeiger in der Nähe des Schiebers liegt.
     * @param {number} x X-Zeiger-Koordinate.
     * @param {number} y Y-Zeiger-Koordinate.
     * @returns {boolean} true wenn ein Slider aktiviert wurde.
     */
    handleMouseDown(x, y) {
        if (!this.isVisible) return false;
        if (this.currentMode !== 'audio') return false;
        const musicHandleX = this.musicSliderX + this.musicVolume * this.sliderWidth;
        if (Math.abs(x - musicHandleX) < 30 && Math.abs(y - this.musicSliderY) < 30) {
            this.draggingMusic = true;
            return true;
        }
        const sfxHandleX = this.sfxSliderX + this.sfxVolume * this.sliderWidth;
        if (Math.abs(x - sfxHandleX) < 30 && Math.abs(y - this.sfxSliderY) < 30) {
            this.draggingSFX = true;
            return true;
        }
        
        return false;
    }
    
    /**
     * Aktualisiert einen aktiven Slider bei Zeigerbewegung.
     * @param {number} x X-Zeiger-Koordinate.
     * @param {number} y Y-Zeiger-Koordinate.
     * @returns {boolean} true wenn ein Slider verändert wurde.
     */
    handleMouseMove(x, y) {
        if (!this.isVisible) return false;
        if (this.currentMode !== 'audio') return false;
        
        if (this.draggingMusic) {
            const newVolume = (x - this.musicSliderX) / this.sliderWidth;
            this.musicVolume = Math.max(0, Math.min(1, newVolume));
            window.gameSettings = window.gameSettings || {};
            window.gameSettings.musicVolume = this.musicVolume;
            if (window.world && window.world.audioManager) {
                window.world.audioManager.setMusicVolume(this.musicVolume);
            }
            return true;
        }
        
        if (this.draggingSFX) {
            const newVolume = (x - this.sfxSliderX) / this.sliderWidth;
            this.sfxVolume = Math.max(0, Math.min(1, newVolume));
            window.gameSettings = window.gameSettings || {};
            window.gameSettings.sfxVolume = this.sfxVolume;
            if (window.world && window.world.audioManager) {
                window.world.audioManager.setSFXVolume(this.sfxVolume);
            }
            return true;
        }
        
        return false;
    }
    
    /**
     * Beendet das Drücken aller Slider.
     * @returns {void}
     */
    handleMouseUp() {
        this.draggingMusic = false;
        this.draggingSFX = false;
    }
    
    /**
     * Verarbeitet Klicks auf Menü-Buttons und wechselt den aktuellen Modus.
     * @param {number} x X-Zeiger-Koordinate.
     * @param {number} y Y-Zeiger-Koordinate.
     * @returns {boolean} true wenn ein Button geklickt wurde.
     */
    handleClick(x, y) {
        if (!this.isVisible) return false;
        if (this.currentMode === 'menu') {
            if (x >= this.languageButtonX && x <= this.languageButtonX + this.languageButtonWidth &&
                y >= this.languageButtonY && y <= this.languageButtonY + this.languageButtonHeight) {
                this.currentMode = 'language';
                return true;
            }
            if (x >= this.helpButtonX && x <= this.helpButtonX + this.helpButtonWidth &&
                y >= this.helpButtonY && y <= this.helpButtonY + this.helpButtonHeight) {
                this.currentMode = 'help';
                return true;
            }
            if (x >= this.audioButtonX && x <= this.audioButtonX + this.audioButtonWidth &&
                y >= this.audioButtonY && y <= this.audioButtonY + this.audioButtonHeight) {
                this.currentMode = 'audio';
                return true;
            }
            if (x >= this.impressumButtonX && x <= this.impressumButtonX + this.impressumButtonWidth &&
                y >= this.impressumButtonY && y <= this.impressumButtonY + this.impressumButtonHeight) {
                this.currentMode = 'impressum';
                return true;
            }
            
            return true;
        }
        const hitboxPadding = 20;
        if (x >= this.backButtonX - hitboxPadding && 
            x <= this.backButtonX + this.backButtonWidth + hitboxPadding &&
            y >= this.backButtonY - hitboxPadding && 
            y <= this.backButtonY + this.backButtonHeight + hitboxPadding) {
            if (this.currentMode !== 'volume') {
                this.currentMode = 'menu';
            } else {
                this.hide();
            }
            return true;
        }
        return true;
    }
    
    /**
     * Zeichnet den aktuellen Options-Bildschirm (Menü, Sprachen, Audio, etc.) auf den Canvas.
     * @param {CanvasRenderingContext2D} ctx Zeichenkontext.
     * @returns {void}
     */
    draw(ctx) {
        if (!this.isVisible) return;
        
        const canvasWidth = 800;
        const canvasHeight = 540;
        if (this.backgroundImg.complete) {
            ctx.drawImage(this.backgroundImg, 0, 0, canvasWidth, canvasHeight);
        }
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        if (this.currentMode === 'menu') {
            this.drawMenuScreen(ctx, canvasWidth, canvasHeight);
        } else if (this.currentMode === 'language') {
            this.drawLanguageScreen(ctx, canvasWidth, canvasHeight);
        } else if (this.currentMode === 'help') {
            this.drawHelpScreen(ctx, canvasWidth, canvasHeight);
        } else if (this.currentMode === 'audio') {
            this.drawAudioScreen(ctx, canvasWidth, canvasHeight);
        } else if (this.currentMode === 'impressum') {
            this.drawImpressumScreen(ctx, canvasWidth, canvasHeight);
        } else {
            this.drawVolumeScreen(ctx, canvasWidth, canvasHeight);
        }
    }
    
    /**
     * Zeichnet das Hauptmenü mit den vier Optionsbuttons.
     * @param {CanvasRenderingContext2D} ctx Zeichenkontext.
     * @param {number} canvasWidth Breite des Canvas.
     * @param {number} canvasHeight Höhe des Canvas.
     * @returns {void}
     */
    drawMenuScreen(ctx, canvasWidth, canvasHeight) {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('OPTIONS', canvasWidth / 2, 50);
        this.drawButton(ctx, this.languageButtonX, this.languageButtonY, 
                       this.languageButtonWidth, this.languageButtonHeight, 'SPRACHEN');
        this.drawButton(ctx, this.helpButtonX, this.helpButtonY, 
                       this.helpButtonWidth, this.helpButtonHeight, 'HILFE');
        this.drawButton(ctx, this.audioButtonX, this.audioButtonY, 
                       this.audioButtonWidth, this.audioButtonHeight, 'AUDIO');
        this.drawButton(ctx, this.impressumButtonX, this.impressumButtonY, 
                       this.impressumButtonWidth, this.impressumButtonHeight, 'IMPRESSUM');
    }
    
    /**
     * Zeichnet einen stilisierten Button mit Text.
     * @param {CanvasRenderingContext2D} ctx Zeichenkontext.
     * @param {number} x X-Position.
     * @param {number} y Y-Position.
     * @param {number} width Breite.
     * @param {number} height Höhe.
     * @param {string} text Beschriftung.
     * @returns {void}
     */
    drawButton(ctx, x, y, width, height, text) {
        ctx.fillStyle = 'rgba(100, 150, 200, 0.9)';
        ctx.fillRect(x, y, width, height);
        ctx.strokeStyle = 'rgba(150, 200, 255, 1)';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 22px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + width / 2, y + height / 2);
    }
    
    /**
     * Zeichnet den Sprachauswahl-Unterbildschirm.
     * @param {CanvasRenderingContext2D} ctx Zeichenkontext.
     * @param {number} canvasWidth Breite des Canvas.
     * @param {number} canvasHeight Höhe des Canvas.
     * @returns {void}
     */
    drawLanguageScreen(ctx, canvasWidth, canvasHeight) {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SPRACHEN', canvasWidth / 2, 80);
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Deutsch', canvasWidth / 2, 200);
        ctx.fillText('Englisch', canvasWidth / 2, 280);
        ctx.fillText('Español', canvasWidth / 2, 360);
        this.drawButton(ctx, this.backButtonX, this.backButtonY, 
                       this.backButtonWidth, this.backButtonHeight, 'ZURÜCK');
    }
    
    drawHelpScreen(ctx, canvasWidth, canvasHeight) {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('HILFE', canvasWidth / 2, 80);
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Siehe Options Screen im HTML', canvasWidth / 2, 200);
        this.drawButton(ctx, this.backButtonX, this.backButtonY, 
                       this.backButtonWidth, this.backButtonHeight, 'ZURÜCK');
    }
    
    drawAudioScreen(ctx, canvasWidth, canvasHeight) {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('AUDIO', canvasWidth / 2, 80);
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Hintergrundmusik', this.musicSliderX, this.musicSliderY - 30);
        this.drawSlider(ctx, this.musicSliderX, this.musicSliderY, this.musicVolume);
        ctx.fillText('Sound-Effekte', this.sfxSliderX, this.sfxSliderY - 30);
        this.drawSlider(ctx, this.sfxSliderX, this.sfxSliderY, this.sfxVolume);
        this.drawButton(ctx, this.backButtonX, this.backButtonY, 
                       this.backButtonWidth, this.backButtonHeight, 'ZURÜCK');
    }
    
    drawImpressumScreen(ctx, canvasWidth, canvasHeight) {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('IMPRESSUM', canvasWidth / 2, 80);
        this.drawButton(ctx, this.backButtonX, this.backButtonY, 
                       this.backButtonWidth, this.backButtonHeight, 'ZURÜCK');
    }
    
    drawVolumeScreen(ctx, canvasWidth, canvasHeight) {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('LAUTSTÄRKE', canvasWidth / 2, 100);
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Hintergrundmusik', this.musicSliderX, this.musicSliderY - 30);
        this.drawSlider(ctx, this.musicSliderX, this.musicSliderY, this.musicVolume);
        ctx.fillText('Sound-Effekte', this.sfxSliderX, this.sfxSliderY - 30);
        this.drawSlider(ctx, this.sfxSliderX, this.sfxSliderY, this.sfxVolume);
        this.drawButton(ctx, this.backButtonX, this.backButtonY, 
                       this.backButtonWidth, this.backButtonHeight, 'ZURÜCK');
    }
    
    drawSlider(ctx, x, y, volume) {
        ctx.fillStyle = 'rgba(100, 100, 100, 0.8)';
        ctx.fillRect(x, y - this.sliderHeight / 2, this.sliderWidth, this.sliderHeight);
        ctx.fillStyle = 'rgba(0, 200, 255, 0.9)';
        ctx.fillRect(x, y - this.sliderHeight / 2, this.sliderWidth * volume, this.sliderHeight);
        const handleX = x + volume * this.sliderWidth;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(handleX, y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 200, 255, 1)';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.font = '18px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(Math.round(volume * 100) + '%', x + this.sliderWidth + 20, y + 5);
    }
    
    show() {
        this.isVisible = true;
        this.currentMode = 'menu'; // Immer mit dem Hauptmenü starten
    }
    
    hide() {
        this.isVisible = false;
        this.currentMode = 'menu'; // Beim Ausblenden auf das Hauptmenü zurücksetzen
    }
}
