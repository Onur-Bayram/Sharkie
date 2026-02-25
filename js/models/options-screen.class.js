class OptionsScreen {
    isVisible = false;
    backgroundImg = new Image();
    
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
        
        // Vergrößerte Hitbox für Back Button (20px Toleranz auf allen Seiten)
        const hitboxPadding = 20;
        if (x >= this.backButtonX - hitboxPadding && 
            x <= this.backButtonX + this.backButtonWidth + hitboxPadding &&
            y >= this.backButtonY - hitboxPadding && 
            y <= this.backButtonY + this.backButtonHeight + hitboxPadding) {
            this.hide();
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
        
        // Titel
        ctx.fillStyle = 'white';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('OPTIONS', canvasWidth / 2, 100);
        
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
        ctx.fillStyle = 'rgba(100, 150, 200, 0.9)';
        ctx.fillRect(this.backButtonX, this.backButtonY, this.backButtonWidth, this.backButtonHeight);
        ctx.strokeStyle = 'rgba(150, 200, 255, 1)';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.backButtonX, this.backButtonY, this.backButtonWidth, this.backButtonHeight);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 22px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ZURÜCK', this.backButtonX + this.backButtonWidth / 2, this.backButtonY + this.backButtonHeight / 2 + 8);
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
    }
    
    hide() {
        this.isVisible = false;
    }
}
