class GameOverScreen {
    gameOverImages = [];
    currentImage = 0;
    isVisible = false;
    gameOverWidth = 500;
    gameOverHeight = 337;
    soundPlayed = false;
    animationInterval = null;

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

        // Vollständig schwarzer Hintergrund
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 800, 540);

        // GAME OVER Bild 
        const currentImg = this.gameOverImages[this.currentImage];
        if (currentImg && currentImg.complete) {
            const x = (800 - this.gameOverWidth) / 2;
            const y = (540 - this.gameOverHeight) / 2;
            ctx.drawImage(currentImg, x, y, this.gameOverWidth, this.gameOverHeight);
        }
    }

    show(audioManager) {
        if (!this.isVisible && !this.soundPlayed) {
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
        this.stopAnimation();
    }
}
