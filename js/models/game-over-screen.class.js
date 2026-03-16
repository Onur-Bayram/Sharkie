/**
 * Game-Over-Bildschirm – blendet nach dem Tod des Spielers mit Einblend-Animation ein.
 */
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

    /**
     * Lädt alle Game-Over-Animationsbilder in den internen Array.
     * @returns {void}
     */
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

    /**
     * Zeichnet den Game-Over-Bildschirm mit Einblend-Effekt auf den Canvas.
     * @param {CanvasRenderingContext2D} ctx Zeichenkontext.
     * @returns {void}
     */
    draw(ctx) {
        if (!this.isVisible) {
            return;
        }
        if (this.opacity < 1) {
            this.opacity += this.fadeInSpeed;
            if (this.opacity > 1) this.opacity = 1;
        }

        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 800, 540);
        const currentImg = this.gameOverImages[this.currentImage];
        if (currentImg && currentImg.complete) {
            const x = (800 - this.gameOverWidth) / 2;
            const y = (540 - this.gameOverHeight) / 2 - 80;
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
            ctx.shadowBlur = 10;
            
            ctx.drawImage(currentImg, x, y, this.gameOverWidth, this.gameOverHeight);
        }
        
        ctx.restore();
    }

    /**
     * Zeigt den Game-Over-Bildschirm an und spielt den Fail-Sound ab.
     * @param {AudioManager} audioManager Audio-Manager für den Fail-Sound.
     * @returns {void}
     */
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

    /**
     * Startet die Animations-Schleife für das Durchblenden der Bilder.
     * @returns {void}
     */
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

    /**
     * Stoppt die Bildwechsel-Animation.
     * @returns {void}
     */
    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    /**
     * Versteckt den Game-Over-Bildschirm und setzt alle Zustände zurück.
     * @returns {void}
     */
    hide() {
        this.isVisible = false;
        this.soundPlayed = false;
        this.opacity = 0;
        this.stopAnimation();
    }
}
