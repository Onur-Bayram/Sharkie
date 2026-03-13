class RestartButton {
    buttonX = 0;
    buttonY = 0;
    buttonWidth = 200;
    buttonHeight = 66;
    isVisible = false;
    ctx = null;
    buttonImage = null;
    hoverScale = 1.0;
    floatOffset = 0;
    animationTime = 0;
    isHovered = false;

    constructor() {
        this.loadImage();
        this.updatePosition();
    }

    setCanvasContext(ctx) {
        this.ctx = ctx;
    }

    loadImage() {
        this.buttonImage = new Image();
        this.buttonImage.src = encodeURI('6.Botones/Try again/Recurso 17.png');
    }

    updatePosition() {
        // Button zentriert unter der Game Over Animation mit mehr Abstand
        this.buttonX = (800 - this.buttonWidth) / 2;
        this.buttonY = 360;
    }

    draw(ctx) {
        if (!this.isVisible) return;

        // Animation: Schwebe-Effekt und Hover
        this.animationTime += 0.05;
        this.floatOffset = Math.sin(this.animationTime) * 8;
        
        // Smooth Hover-Animation
        const targetScale = this.isHovered ? 1.1 : 1.0;
        this.hoverScale += (targetScale - this.hoverScale) * 0.15;

        // Zeichne das Try Again Bild mit Animation
        if (this.buttonImage && this.buttonImage.complete) {
            ctx.save();
            
            // Bessere Bildqualität
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            // Glow-Effekt beim Hover
            if (this.isHovered) {
                ctx.shadowColor = 'rgba(0, 255, 255, 0.6)';
                ctx.shadowBlur = 20;
            }
            
            // Zentriere für Scale-Transformation
            const centerX = this.buttonX + this.buttonWidth / 2;
            const centerY = this.buttonY + this.buttonHeight / 2 + this.floatOffset;
            
            ctx.translate(centerX, centerY);
            ctx.scale(this.hoverScale, this.hoverScale);
            ctx.translate(-centerX, -centerY);
            
            ctx.drawImage(
                this.buttonImage, 
                this.buttonX, 
                this.buttonY + this.floatOffset, 
                this.buttonWidth, 
                this.buttonHeight
            );
            
            ctx.restore();
        }
    }

    isButtonHovered(x, y) {
        const adjustedY = this.buttonY + this.floatOffset;
        return x >= this.buttonX && x <= this.buttonX + this.buttonWidth &&
               y >= adjustedY && y <= adjustedY + this.buttonHeight;
    }

    updateHoverState(x, y) {
        if (!this.isVisible) {
            this.isHovered = false;
            return;
        }
        this.isHovered = this.isButtonHovered(x, y);
    }

    handleClick(x, y) {
        if (!this.isVisible) {
            return false;
        }
        if (this.isButtonHovered(x, y)) {
            if (typeof window.restartGame === 'function') {
                window.restartGame();
            }
            return true;
        }
        return false;
    }

    show() {
        this.isVisible = true;
    }

    hide() {
        this.isVisible = false;
    }
}
