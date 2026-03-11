class GameOverScreen {
    gameOverImages = [];
    currentImage = 0;
    isVisible = false;
    gameOverWidth = 280;
    gameOverHeight = 189;
    soundPlayed = false;
    animationInterval = null;
    opacity = 0;
    fadeInSpeed = 0.03;

    constructor() {
        this.loadImages();
    }

    loadImages() {
        const imagePaths = [
            '6.Botones/Tittles/Game Over/Recurso 9.png',
            '6.Botones/Tittles/Game Over/Recurso 10.png',
            '6.Botones/Tittles/Game Over/Recurso 11.png',
            '6.Botones/Tittles/Game Over/Recurso 12.png',
            '6.Botones/Tittles/Game Over/Recurso 13.png'
        ];

        imagePaths.forEach(path => {
            const img = new Image();
            img.src = encodeURI(path);
            this.gameOverImages.push(img);
        });
    }

    draw(ctx) {
        if (!this.isVisible) {
            return;
        }

        // Einblende-Effekt
        if (this.opacity < 1) {
            this.opacity += this.fadeInSpeed;
            if (this.opacity > 1) this.opacity = 1;
        }

        ctx.save();
        
        // Vollständig schwarzer Hintergrund mit Fade
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 800, 540);

        // Bild für das Spielende mit Einblende-Effekt und leichtem Leuchten
        const currentImg = this.gameOverImages[this.currentImage];
        if (currentImg && currentImg.complete) {
            const x = (800 - this.gameOverWidth) / 2;
            const y = (540 - this.gameOverHeight) / 2 - 80;
            
            // Bessere Bildqualität beim Skalieren
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            // Leichter Glow-Effekt
            ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
            ctx.shadowBlur = 10;
            
            ctx.drawImage(currentImg, x, y, this.gameOverWidth, this.gameOverHeight);
        }
        
        ctx.restore();
    }

    show(audioManager) {
        if (!this.isVisible && !this.soundPlayed) {
            this.opacity = 0;
            this.soundPlayed = true;
            if (audioManager) {
                audioManager.playFailSound();
            }
        }
        this.isVisible = true;
        this.startAnimation();
    }

    startAnimation() {
        if (this.animationInterval) {
            return; 
        }
        
        this.currentImage = 0;
        this.animationInterval = setInterval(() => {
            this.currentImage++;
            if (this.currentImage >= this.gameOverImages.length) {
                this.currentImage = 0;
            }
        }, 150); //MS pro Bild
    }

    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    hide() {
        this.isVisible = false;
        this.soundPlayed = false;
        this.opacity = 0;
        this.stopAnimation();
    }
}
