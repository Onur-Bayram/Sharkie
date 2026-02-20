class WinScreen {
    youWinImg = null;
    isVisible = false;
    youWinWidth = 800;
    youWinHeight = 540;
    soundPlayed = false;

    constructor() {
        this.youWinImg = new Image();
        this.youWinImg.src = encodeURI('6.Botones/Tittles/You win/Mesa de trabajo 1.png');
    }

    draw(ctx) {
        if (!this.isVisible) {
            return;
        }

        // Vollständig schwarzer Hintergrund
        ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
        ctx.fillRect(0, 0, 800, 540);

        // YOU WIN Bild 
        if (this.youWinImg && this.youWinImg.complete) {
            const x = (800 - this.youWinWidth) / 2;
            const y = (540 - this.youWinHeight) / 2;
            ctx.drawImage(this.youWinImg, x, y, this.youWinWidth, this.youWinHeight);
        }
    }

    show(audioManager) {
        if (!this.isVisible && !this.soundPlayed) {
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
    }
}
