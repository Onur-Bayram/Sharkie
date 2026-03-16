/**
 * Neustart-Button – wird nach Game-Over oder Sieg eingeblendet, mit Hover- und Float-Animation.
 */
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

    /**
     * Setzt den Zeichenkontext (optional, nicht aktiv benötigt).
     * @param {CanvasRenderingContext2D} ctx Zeichenkontext.
     * @returns {void}
     */
    setCanvasContext(ctx) {
        this.ctx = ctx;
    }

    /**
     * Lädt das Button-Bild.
     * @returns {void}
     */
    loadImage() {
        this.buttonImage = new Image();
        this.buttonImage.src = encodeURI('6.Botones/Try again/Recurso 17.png');
    }

    /**
     * Berechnet und setzt die zentrierte Button-Position.
     * @returns {void}
     */
    updatePosition() {
        this.buttonX = (800 - this.buttonWidth) / 2;
        this.buttonY = 360;
    }

    /**
     * Zeichnet den Button mit Float- und Hover-Skalierungseffekt auf den Canvas.
     * @param {CanvasRenderingContext2D} ctx Zeichenkontext.
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
     * Gibt zurück ob die Koordinaten innerhalb der (verschobenen) Button-Fläche liegen.
     * @param {number} x X-Koordinate.
     * @param {number} y Y-Koordinate.
     * @returns {boolean}
     */
    isButtonHovered(x, y) {
        const adjustedY = this.buttonY + this.floatOffset;
        return x >= this.buttonX && x <= this.buttonX + this.buttonWidth &&
               y >= adjustedY && y <= adjustedY + this.buttonHeight;
    }

    /**
     * Aktualisiert den Hover-Zustand basierend auf der Zeiger-Position.
     * @param {number} x X-Koordinate.
     * @param {number} y Y-Koordinate.
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
     * Verarbeitet einen Klick und löst `window.restartGame()` aus wenn der Button getroffen wurde.
     * @param {number} x X-Koordinate.
     * @param {number} y Y-Koordinate.
     * @returns {boolean} true wenn der Button geklickt wurde.
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
     * Macht den Button sichtbar.
     * @returns {void}
     */
    show() {
        this.isVisible = true;
    }

    /**
     * Versteckt den Button.
     * @returns {void}
     */
    hide() {
        this.isVisible = false;
    }
}
