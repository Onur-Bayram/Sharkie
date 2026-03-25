/**
 * Game-over screen - displays after player death with fade-in animation.
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

    /**
     * Creates a new instance.
     */
    constructor() {
        this.loadImages();
    }

    /**
     * Loads all game-over animation images into the internal array.
     * @returns {void}
     */
    loadImages() {
        this.getGameOverImagePaths().forEach(path => {
            const img = new Image();
            img.src = encodeURI(path);
            this.gameOverImages.push(img);
        });
    }

    /**
     * Returns the ordered list of game-over animation frame paths.
     * @returns {string[]}
     */
    getGameOverImagePaths() {
        const base = '6.Botones/Tittles/Game Over';
        return [9, 10, 11, 12, 13].map(n => `${base}/Recurso ${n}.png`);
    }

    /**
     * Draws the game-over screen with fade-in effect on canvas.
     * @param {CanvasRenderingContext2D} ctx Drawing context.
     * @returns {void}
     */
    draw(ctx) {
        if (!this.isVisible) return;
        this.advanceGameOverFade();
        ctx.save();
        ctx.globalAlpha = this.opacity;
        this.renderGameOverBackground(ctx);
        this.renderGameOverImage(ctx);
        ctx.restore();
    }

    /**
     * Advances game-over fade.
     * @returns {void}
     */
    advanceGameOverFade() {
        if (this.opacity < 1) {
            this.opacity = Math.min(1, this.opacity + this.fadeInSpeed);
        }
    }

    /**
     * Renders game-over background.
     * @param {CanvasRenderingContext2D} ctx Drawing context.
     * @returns {void}
     */
    renderGameOverBackground(ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 800, 540);
    }

    /**
     * Renders game-over image.
     * @param {CanvasRenderingContext2D} ctx Drawing context.
     * @returns {void}
     */
    renderGameOverImage(ctx) {
        const currentImg = this.gameOverImages[this.currentImage];
        if (!currentImg || !currentImg.complete) return;
        const x = (800 - this.gameOverWidth) / 2;
        const y = (540 - this.gameOverHeight) / 2 - 80;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
        ctx.shadowBlur = 10;
        ctx.drawImage(currentImg, x, y, this.gameOverWidth, this.gameOverHeight);
    }

    /**
     * Displays the game-over screen and plays the fail sound.
     * @param {AudioManager} audioManager Audio manager for the fail sound.
     * @returns {void}
     */
    show(audioManager) {
        if (!this.isVisible && !this.soundPlayed) {
            this.opacity = 0;
            this.soundPlayed = true;
            if (audioManager) {
                audioManager.playSfx('fail');
            }
        }
        this.isVisible = true;
        this.startAnimation();
    }

    /**
     * Starts the animation loop for transitioning between images.
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
     * Stops the image transition animation.
     * @returns {void}
     */
    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    /**
     * Hides the game-over screen and resets all states.
     * @returns {void}
     */
    hide() {
        this.isVisible = false;
        this.soundPlayed = false;
        this.opacity = 0;
        this.stopAnimation();
    }
}
