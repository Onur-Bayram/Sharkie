class OptionsScreen {
    isVisible = false;
    backgroundImg = new Image();
    
    // Screen mode: 'menu' oder 'volume'
    currentMode = 'menu';
    
    // Menu Button Positionen
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
    
    // Back Button
    backButtonX = 300;
    backButtonY = 450;
    backButtonWidth = 200;
    backButtonHeight = 60;
    
    constructor() {
        this.backgroundImg.src = '3. Background/Mesa de trabajo 1.png';
    }
    
    handleMouseDown(x, y) {
        if (!this.isVisible) return false;
        
        // Mouse events nur im Audio-Mode
        if (this.currentMode !== 'audio') return false;
        
        // Check music slider
        const musicHandleX = this.musicSliderX + this.musicVolume * this.sliderWidth;
        if (Math.abs(x - musicHandleX) < 30 && Math.abs(y - this.musicSliderY) < 30) {
            this.draggingMusic = true;
            return true;
        }
        
        // Check SFX slider
        const sfxHandleX = this.sfxSliderX + this.sfxVolume * this.sliderWidth;
        if (Math.abs(x - sfxHandleX) < 30 && Math.abs(y - this.sfxSliderY) < 30) {
            this.draggingSFX = true;
            return true;
        }
        
        return false;
    }
    
    handleMouseMove(x, y) {
        if (!this.isVisible) return false;
        
        // Mouse events nur im Audio-Mode aktivieren
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
        
        // Menu Mode: Hauptmenü mit den 3 Buttons
        if (this.currentMode === 'menu') {
            // Language Button klicken
            if (x >= this.languageButtonX && x <= this.languageButtonX + this.languageButtonWidth &&
                y >= this.languageButtonY && y <= this.languageButtonY + this.languageButtonHeight) {
                console.log('Sprachen Button geklickt');
                this.currentMode = 'language';
                return true;
            }
            
            // Help Button klicken
            if (x >= this.helpButtonX && x <= this.helpButtonX + this.helpButtonWidth &&
                y >= this.helpButtonY && y <= this.helpButtonY + this.helpButtonHeight) {
                console.log('Hilfe Button geklickt');
                this.currentMode = 'help';
                return true;
            }
            
            // Audio Button klicken
            if (x >= this.audioButtonX && x <= this.audioButtonX + this.audioButtonWidth &&
                y >= this.audioButtonY && y <= this.audioButtonY + this.audioButtonHeight) {
                console.log('Audio Button geklickt');
                this.currentMode = 'audio';
                return true;
            }
            
            // Impressum Button klicken
            if (x >= this.impressumButtonX && x <= this.impressumButtonX + this.impressumButtonWidth &&
                y >= this.impressumButtonY && y <= this.impressumButtonY + this.impressumButtonHeight) {
                console.log('Impressum Button geklickt');
                this.currentMode = 'impressum';
                return true;
            }
            
            return true;
        }
        
        // Volume Mode oder andere: Slider und Back Button
        // Vergrößerte Hitbox für Back Button (20px Toleranz auf allen Seiten)
        const hitboxPadding = 20;
        if (x >= this.backButtonX - hitboxPadding && 
            x <= this.backButtonX + this.backButtonWidth + hitboxPadding &&
            y >= this.backButtonY - hitboxPadding && 
            y <= this.backButtonY + this.backButtonHeight + hitboxPadding) {
            
            // Wenn in einem Submenu, zurück zum Hauptmenü
            if (this.currentMode !== 'volume') {
                this.currentMode = 'menu';
            } else {
                // Wenn im Volume-Mode, komplett schließen
                this.hide();
            }
            return true;
        }
        
        // Auch wenn nicht auf ZURÜCK geklickt wurde, blockiere andere Klicks
        // während Options Screen sichtbar ist
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
        
        // Verschiedene Screens basierend auf currentMode
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
        
        // Language Button
        this.drawButton(ctx, this.languageButtonX, this.languageButtonY, 
                       this.languageButtonWidth, this.languageButtonHeight, 'SPRACHEN');
        
        // Help Button
        this.drawButton(ctx, this.helpButtonX, this.helpButtonY, 
                       this.helpButtonWidth, this.helpButtonHeight, 'HILFE');
        
        // Audio Button
        this.drawButton(ctx, this.audioButtonX, this.audioButtonY, 
                       this.audioButtonWidth, this.audioButtonHeight, 'AUDIO');
        
        // Impressum Button
        this.drawButton(ctx, this.impressumButtonX, this.impressumButtonY, 
                       this.impressumButtonWidth, this.impressumButtonHeight, 'IMPRESSUM');
    }
    
    drawButton(ctx, x, y, width, height, text) {
        // Button Hintergrund
        ctx.fillStyle = 'rgba(100, 150, 200, 0.9)';
        ctx.fillRect(x, y, width, height);
        
        // Button Border
        ctx.strokeStyle = 'rgba(150, 200, 255, 1)';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);
        
        // Button Text
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
        
        // Sprachen Opionen
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Deutsch', canvasWidth / 2, 200);
        ctx.fillText('English', canvasWidth / 2, 280);
        ctx.fillText('Español', canvasWidth / 2, 360);
        
        // Back Button
        this.drawButton(ctx, this.backButtonX, this.backButtonY, 
                       this.backButtonWidth, this.backButtonHeight, 'ZURÜCK');
    }
    
    drawHelpScreen(ctx, canvasWidth, canvasHeight) {
        // Titel
        ctx.fillStyle = 'white';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('HILFE', canvasWidth / 2, 80);
        
        // Hilfe Text
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Siehe Options Screen im HTML', canvasWidth / 2, 200);
        
        // Back Button
        this.drawButton(ctx, this.backButtonX, this.backButtonY, 
                       this.backButtonWidth, this.backButtonHeight, 'ZURÜCK');
    }
    
    drawAudioScreen(ctx, canvasWidth, canvasHeight) {
        // Titel
        ctx.fillStyle = 'white';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('AUDIO', canvasWidth / 2, 80);
        
        // Musik Label
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Hintergrundmusik', this.musicSliderX, this.musicSliderY - 30);
        
        // Musik Slider
        this.drawSlider(ctx, this.musicSliderX, this.musicSliderY, this.musicVolume);
        
        // SFX Label
        ctx.fillText('Sound-Effekte', this.sfxSliderX, this.sfxSliderY - 30);
        
        // SFX Slider
        this.drawSlider(ctx, this.sfxSliderX, this.sfxSliderY, this.sfxVolume);
        
        // Back Button
        this.drawButton(ctx, this.backButtonX, this.backButtonY, 
                       this.backButtonWidth, this.backButtonHeight, 'ZURÜCK');
    }
    
    drawImpressumScreen(ctx, canvasWidth, canvasHeight) {
        // Titel
        ctx.fillStyle = 'white';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('IMPRESSUM', canvasWidth / 2, 80);
        
        // Back Button
        this.drawButton(ctx, this.backButtonX, this.backButtonY, 
                       this.backButtonWidth, this.backButtonHeight, 'ZURÜCK');
    }
    
    drawVolumeScreen(ctx, canvasWidth, canvasHeight) {
        // Titel
        ctx.fillStyle = 'white';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('LAUTSTÄRKE', canvasWidth / 2, 100);
        
        // Musik Label
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Hintergrundmusik', this.musicSliderX, this.musicSliderY - 30);
        
        // Musik Slider
        this.drawSlider(ctx, this.musicSliderX, this.musicSliderY, this.musicVolume);
        
        // SFX Label
        ctx.fillText('Sound-Effekte', this.sfxSliderX, this.sfxSliderY - 30);
        
        // SFX Slider
        this.drawSlider(ctx, this.sfxSliderX, this.sfxSliderY, this.sfxVolume);
        
        // Back Button
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
        this.currentMode = 'menu'; // Always start with menu
    }
    
    hide() {
        this.isVisible = false;
        this.currentMode = 'menu'; // Reset to menu when hiding
    }
}
