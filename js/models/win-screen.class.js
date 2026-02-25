class WinScreen {
    youWinImg = null;
    isVisible = false;
    youWinWidth = 800;
    youWinHeight = 540;
    soundPlayed = false;
    world = null;
    opacity = 0;
    fadeInSpeed = 0.03;

    constructor() {
        this.youWinImg = new Image();
        this.youWinImg.src = encodeURI('6.Botones/Tittles/You win/Mesa de trabajo 1.png');
    }

    draw(ctx) {
        // nicht zeichnen wenn nicht sichtbar
        if (!this.isVisible) {
            return;
        }

        // Fade-In Effekt
        if (this.opacity < 1) {
            this.opacity += this.fadeInSpeed;
            if (this.opacity > 1) this.opacity = 1;
        }

        ctx.save();
        
        // Vollständig schwarzer Hintergrund mit Fade
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 800, 540);

        // YOU WIN Bild mit Glow
        if (this.youWinImg && this.youWinImg.complete) {
            const x = (800 - this.youWinWidth) / 2;
            const y = (540 - this.youWinHeight) / 2 - 40;
            
            // Bessere Bildqualität
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            // Glow-Effekt
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 30;
            
            ctx.drawImage(this.youWinImg, x, y, this.youWinWidth, this.youWinHeight);
        }
        
        ctx.restore();
    }

    show(audioManager) {
        if (!this.isVisible && !this.soundPlayed) {
            this.opacity = 0;
            this.soundPlayed = true;
            if (audioManager) {
                audioManager.playVictorySound();
            }
        }
        this.isVisible = true;
    }

    hide() {
        this.isVisible = false;
        this.soundPlayed = false;
        this.opacity = 0;
    }
}
