class OptionsScreen {
    isVisible = false;
    backgroundImg = new Image();
    
    // Bildschirmmodus: `menu` oder `volume`
    currentMode = 'menu';
    
    // Positionen der Menü-Buttons
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
    
    // Slider-Positionen
    musicSliderX = 200;
    musicSliderY = 200;
    sfxSliderX = 200;
    sfxSliderY = 300;
    sliderWidth = 400;
    sliderHeight = 20;
    
    // Slider-Werte (0 bis 1)
    musicVolume = 0.3;
    sfxVolume = 0.5;
    
    // Welcher Slider wird gerade gezogen
    draggingMusic = false;
    draggingSFX = false;
    
    // Zurück-Button
    backButtonX = 300;
    backButtonY = 450;
    backButtonWidth = 200;
    backButtonHeight = 60;
    
    constructor() {
        this.backgroundImg.src = '3. Background/Mesa de trabajo 1.png';
    }
    
    handleMouseDown(x, y) {
        if (!this.isVisible) return false;
        
        // Maus-Ereignisse nur im Audio-Modus
        if (this.currentMode !== 'audio') return false;
        
        // Musik-Regler prüfen
        const musicHandleX = this.musicSliderX + this.musicVolume * this.sliderWidth;
        if (Math.abs(x - musicHandleX) < 30 && Math.abs(y - this.musicSliderY) < 30) {
            this.draggingMusic = true;
            return true;
        }
        
        // SFX-Regler prüfen
        const sfxHandleX = this.sfxSliderX + this.sfxVolume * this.sliderWidth;
        if (Math.abs(x - sfxHandleX) < 30 && Math.abs(y - this.sfxSliderY) < 30) {
            this.draggingSFX = true;
            return true;
        }
        
        return false;
    }
    
    handleMouseMove(x, y) {
        if (!this.isVisible) return false;
        
        // Maus-Ereignisse nur im Audio-Modus aktivieren
        if (this.currentMode !== 'audio') return false;
        
        if (this.draggingMusic) {
            const newVolume = (x - this.musicSliderX) / this.sliderWidth;
            this.musicVolume = Math.max(0, Math.min(1, newVolume));
            // Speichere global
            window.gameSettings = window.gameSettings || {};
            window.gameSettings.musicVolume = this.musicVolume;
            // Wende direkt an falls Spiel läuft
            if (window.world && window.world.audioManager) {
                window.world.audioManager.setMusicVolume(this.musicVolume);
            }
            return true;
        }
        
        if (this.draggingSFX) {
            const newVolume = (x - this.sfxSliderX) / this.sliderWidth;
            this.sfxVolume = Math.max(0, Math.min(1, newVolume));
            // Speichere global 
            window.gameSettings = window.gameSettings || {};
            window.gameSettings.sfxVolume = this.sfxVolume;
            // Wende direkt an falls Spiel läuft
            if (window.world && window.world.audioManager) {
                window.world.audioManager.setSFXVolume(this.sfxVolume);
            }
            return true;
        }
        
        return false;
    }
    
    handleMouseUp() {
        this.draggingMusic = false;
        this.draggingSFX = false;
    }
    
    handleClick(x, y) {
        if (!this.isVisible) return false;
        
        // Menümodus: Hauptmenü mit den vier Buttons
        if (this.currentMode === 'menu') {
            // Sprach-Button anklicken
            if (x >= this.languageButtonX && x <= this.languageButtonX + this.languageButtonWidth &&
                y >= this.languageButtonY && y <= this.languageButtonY + this.languageButtonHeight) {
                console.log('Sprachen Button geklickt');
                this.currentMode = 'language';
                return true;
            }
            
            // Hilfe-Button anklicken
            if (x >= this.helpButtonX && x <= this.helpButtonX + this.helpButtonWidth &&
                y >= this.helpButtonY && y <= this.helpButtonY + this.helpButtonHeight) {
                console.log('Hilfe Button geklickt');
                this.currentMode = 'help';
                return true;
            }
            
            // Audio-Button anklicken
            if (x >= this.audioButtonX && x <= this.audioButtonX + this.audioButtonWidth &&
                y >= this.audioButtonY && y <= this.audioButtonY + this.audioButtonHeight) {
                console.log('Audio Button geklickt');
                this.currentMode = 'audio';
                return true;
            }
            
            // Impressum-Button anklicken
            if (x >= this.impressumButtonX && x <= this.impressumButtonX + this.impressumButtonWidth &&
                y >= this.impressumButtonY && y <= this.impressumButtonY + this.impressumButtonHeight) {
                console.log('Impressum Button geklickt');
                this.currentMode = 'impressum';
                return true;
            }
            
            return true;
        }
        
        // Lautstärke-Modus oder andere Untermenüs: Regler und Zurück-Button
        // Vergrößerte Trefferfläche für den Zurück-Button (20 px Toleranz auf allen Seiten)
        const hitboxPadding = 20;
        if (x >= this.backButtonX - hitboxPadding && 
            x <= this.backButtonX + this.backButtonWidth + hitboxPadding &&
            y >= this.backButtonY - hitboxPadding && 
            y <= this.backButtonY + this.backButtonHeight + hitboxPadding) {
            
            // Wenn ein Untermenü offen ist, zurück zum Hauptmenü
            if (this.currentMode !== 'volume') {
                this.currentMode = 'menu';
            } else {
                // Wenn der Lautstärke-Modus offen ist, komplett schließen
                this.hide();
            }
            return true;
        }
        
        // Auch wenn nicht auf ZURÜCK geklickt wurde, blockiere andere Klicks
        // solange der Optionsbildschirm sichtbar ist
        return true;
    }
    
    draw(ctx) {
        if (!this.isVisible) return;
        
        const canvasWidth = 800;
        const canvasHeight = 540;
        
        // Hintergrund
        if (this.backgroundImg.complete) {
            ctx.drawImage(this.backgroundImg, 0, 0, canvasWidth, canvasHeight);
        }
        
        // Semi-transparenter Overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // Verschiedene Ansichten basierend auf `currentMode`
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
    
    drawMenuScreen(ctx, canvasWidth, canvasHeight) {
        // Titel
        ctx.fillStyle = 'white';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('OPTIONS', canvasWidth / 2, 50);
        
        // Sprach-Button
        this.drawButton(ctx, this.languageButtonX, this.languageButtonY, 
                       this.languageButtonWidth, this.languageButtonHeight, 'SPRACHEN');
        
        // Hilfe-Button
        this.drawButton(ctx, this.helpButtonX, this.helpButtonY, 
                       this.helpButtonWidth, this.helpButtonHeight, 'HILFE');
        
        // Audio-Button
        this.drawButton(ctx, this.audioButtonX, this.audioButtonY, 
                       this.audioButtonWidth, this.audioButtonHeight, 'AUDIO');
        
        // Impressum-Button
        this.drawButton(ctx, this.impressumButtonX, this.impressumButtonY, 
                       this.impressumButtonWidth, this.impressumButtonHeight, 'IMPRESSUM');
    }
    
    drawButton(ctx, x, y, width, height, text) {
        // Button-Hintergrund
        ctx.fillStyle = 'rgba(100, 150, 200, 0.9)';
        ctx.fillRect(x, y, width, height);
        
        // Button-Rand
        ctx.strokeStyle = 'rgba(150, 200, 255, 1)';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);
        
        // Button-Text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 22px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + width / 2, y + height / 2);
    }
    
    drawLanguageScreen(ctx, canvasWidth, canvasHeight) {
        // Titel
        ctx.fillStyle = 'white';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SPRACHEN', canvasWidth / 2, 80);
        
        // Sprachoptionen
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Deutsch', canvasWidth / 2, 200);
        ctx.fillText('Englisch', canvasWidth / 2, 280);
        ctx.fillText('Español', canvasWidth / 2, 360);
        
        // Zurück-Button
        this.drawButton(ctx, this.backButtonX, this.backButtonY, 
                       this.backButtonWidth, this.backButtonHeight, 'ZURÜCK');
    }
    
    drawHelpScreen(ctx, canvasWidth, canvasHeight) {
        // Titel
        ctx.fillStyle = 'white';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('HILFE', canvasWidth / 2, 80);
        
        // Hilfetext
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Siehe Options Screen im HTML', canvasWidth / 2, 200);
        
        // Zurück-Button
        this.drawButton(ctx, this.backButtonX, this.backButtonY, 
                       this.backButtonWidth, this.backButtonHeight, 'ZURÜCK');
    }
    
    drawAudioScreen(ctx, canvasWidth, canvasHeight) {
        // Titel
        ctx.fillStyle = 'white';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('AUDIO', canvasWidth / 2, 80);
        
        // Musik-Beschriftung
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Hintergrundmusik', this.musicSliderX, this.musicSliderY - 30);
        
        // Musik-Regler
        this.drawSlider(ctx, this.musicSliderX, this.musicSliderY, this.musicVolume);
        
        // SFX-Beschriftung
        ctx.fillText('Sound-Effekte', this.sfxSliderX, this.sfxSliderY - 30);
        
        // SFX-Regler
        this.drawSlider(ctx, this.sfxSliderX, this.sfxSliderY, this.sfxVolume);
        
        // Zurück-Button
        this.drawButton(ctx, this.backButtonX, this.backButtonY, 
                       this.backButtonWidth, this.backButtonHeight, 'ZURÜCK');
    }
    
    drawImpressumScreen(ctx, canvasWidth, canvasHeight) {
        // Titel
        ctx.fillStyle = 'white';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('IMPRESSUM', canvasWidth / 2, 80);
        
        // Zurück-Button
        this.drawButton(ctx, this.backButtonX, this.backButtonY, 
                       this.backButtonWidth, this.backButtonHeight, 'ZURÜCK');
    }
    
    drawVolumeScreen(ctx, canvasWidth, canvasHeight) {
        // Titel
        ctx.fillStyle = 'white';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('LAUTSTÄRKE', canvasWidth / 2, 100);
        
        // Musik-Beschriftung
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Hintergrundmusik', this.musicSliderX, this.musicSliderY - 30);
        
        // Musik-Regler
        this.drawSlider(ctx, this.musicSliderX, this.musicSliderY, this.musicVolume);
        
        // SFX-Beschriftung
        ctx.fillText('Sound-Effekte', this.sfxSliderX, this.sfxSliderY - 30);
        
        // SFX-Regler
        this.drawSlider(ctx, this.sfxSliderX, this.sfxSliderY, this.sfxVolume);
        
        // Zurück-Button
        this.drawButton(ctx, this.backButtonX, this.backButtonY, 
                       this.backButtonWidth, this.backButtonHeight, 'ZURÜCK');
    }
    
    drawSlider(ctx, x, y, volume) {
        // Slider-Hintergrund (Grau)
        ctx.fillStyle = 'rgba(100, 100, 100, 0.8)';
        ctx.fillRect(x, y - this.sliderHeight / 2, this.sliderWidth, this.sliderHeight);
        
        // Gefüllter Teil (Cyan)
        ctx.fillStyle = 'rgba(0, 200, 255, 0.9)';
        ctx.fillRect(x, y - this.sliderHeight / 2, this.sliderWidth * volume, this.sliderHeight);
        
        // Handle (Kreis)
        const handleX = x + volume * this.sliderWidth;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(handleX, y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 200, 255, 1)';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Prozent-Anzeige
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
