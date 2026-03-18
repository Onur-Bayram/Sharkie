/**
 * Restart button - shown after game-over or victory, with hover and float animation.
 */
class RestartButton {
    buttonX = 0;
    buttonY = 0;
    buttonWidth = 200;
    buttonHeight = 66;
    isVisible = false;
    buttonImage = null;
    hoverScale = 1.0;
    floatOffset = 0;
    animationTime = 0;
    isHovered = false;

    constructor() {
        this.loadImage();
        this.updatePosition();
    }

    /**
     * Loads the button image.
     * @returns {void}
     */
    loadImage() {
        this.buttonImage = new Image();
        this.buttonImage.src = encodeURI('6.Botones/Try again/Recurso 17.png');
    }

    /**
     * Calculates and sets the centered button position.
     * @returns {void}
     */
    updatePosition() {
        this.buttonX = (800 - this.buttonWidth) / 2;
        this.buttonY = 360;
    }

    /**
     * Draws the button with float and hover scaling effects on canvas.
     * @param {CanvasRenderingContext2D} ctx Drawing context.
     * @returns {void}
     */
    draw(ctx) {
        if (!this.isVisible) return;
        this.animationTime += 0.05;
        this.floatOffset = Math.sin(this.animationTime) * 8;
        const targetScale = this.isHovered ? 1.1 : 1.0;
        this.hoverScale += (targetScale - this.hoverScale) * 0.15;
        if (this.buttonImage && this.buttonImage.complete) {
            ctx.save();
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            if (this.isHovered) {
                ctx.shadowColor = 'rgba(0, 255, 255, 0.6)';
                ctx.shadowBlur = 20;
            }
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

    /**
     * Returns whether coordinates are within the (shifted) button area.
     * @param {number} x X-coordinate.
     * @param {number} y Y-coordinate.
     * @returns {boolean}
     */
    isButtonHovered(x, y) {
        const adjustedY = this.buttonY + this.floatOffset;
        return x >= this.buttonX && x <= this.buttonX + this.buttonWidth &&
               y >= adjustedY && y <= adjustedY + this.buttonHeight;
    }

    /**
     * Updates the hover state based on pointer position.
     * @param {number} x X-coordinate.
     * @param {number} y Y-coordinate.
     * @returns {void}
     */
    updateHoverState(x, y) {
        if (!this.isVisible) {
            this.isHovered = false;
            return;
        }
        this.isHovered = this.isButtonHovered(x, y);
    }

    /**
     * Processes a click and triggers `window.restartGame()` if the button was hit.
     * @param {number} x X-coordinate.
     * @param {number} y Y-coordinate.
     * @returns {boolean} true if the button was clicked.
     */
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

    /**
     * show the button (called when game-over or victory screen is shown).
     * @returns {void}
     */
    show() {
        this.isVisible = true;
    }

    /**
     * secrect button hide method (not used in current flow, but could be called to hide the button).
     * @returns {void}
     */
    hide() {
        this.isVisible = false;
    }
}
