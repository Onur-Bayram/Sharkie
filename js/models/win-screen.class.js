/**
 * Sieg-Bildschirm – wird nach dem Tod des Bosses mit Einblend-Effekt angezeigt.
 */
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

    /**
     * Zeichnet den Sieg-Bildschirm mit Goldschein-Effekt auf den Canvas.
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
        if (this.youWinImg && this.youWinImg.complete) {
            const x = (800 - this.youWinWidth) / 2;
            const y = (540 - this.youWinHeight) / 2 - 40;
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 30;
            
            ctx.drawImage(this.youWinImg, x, y, this.youWinWidth, this.youWinHeight);
        }
        
        ctx.restore();
    }

    /**
     * Zeigt den Sieg-Bildschirm an und spielt den Victory-Sound ab.
     * @param {AudioManager} audioManager Audio-Manager für den Victory-Sound.
     * @returns {void}
     */
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

    /**
     * Versteckt den Sieg-Bildschirm und setzt alle Zustände zurück.
     * @returns {void}
     */
    hide() {
        this.isVisible = false;
        this.soundPlayed = false;
        this.opacity = 0;
    }
}
