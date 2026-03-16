/**
 * Blase als Projektil – fliegt in eine Richtung und pulsiert visuell.
 * Kann normal (blau) oder giftig (lila) sein.
 */
class BubbleAnimation extends MovableObject {
    
    /**
     * Erstellt eine Blase und startet Bewegungs- und Puls-Animation.
     * @param {number} x X-Startposition.
     * @param {number} y Y-Startposition.
     * @param {1|-1} direction Flugrichtung (1 = rechts, -1 = links).
     * @param {boolean} [isPoison=false] Ob es sich um eine Giftblase handelt.
     */
    constructor(x, y, direction, isPoison = false) {
        super();
        

        let imagePath = isPoison ? 
            '1.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png' :
            '1.Sharkie/4.Attack/Bubble trap/Bubble.png';
        
        this.loadImage(imagePath);
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.speed = 4;
        this.direction = direction;
        this.isPoison = isPoison;
        this.pulseScale = 1;
        this.pulseSpeed = 0.02;
        this.throw();
        this.animate();
    }

    /**
     * Startet die Bewegungsschleife – verschiebt die Blase in Flugrichtung.
     * @returns {void}
     */
    throw() {
        setInterval(() => {
            this.x += this.speed * this.direction;
        }, 1000 / 60);
    }

    /**
     * Startet die Puls-Animations-Schleife (wechselt pulseScale zwischen 0.95 und 1.2).
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            this.pulseScale += this.pulseSpeed;
            if (this.pulseScale > 1.2 || this.pulseScale < 0.95) {
                this.pulseSpeed *= -1;
            }
        }, 50);
    }

    /**
     * Zeichnet die Blase auf den Canvas mit Pulsier-Skalierung und Kamera-Offset.
     * @param {CanvasRenderingContext2D} ctx Zeichenkontext.
     * @param {number} cameraX Aktueller Kamera-X-Offset.
     * @returns {void}
     */
    draw(ctx, cameraX) {
        if (this.img && this.img.complete && this.img.naturalHeight !== 0) {
            ctx.save();
            ctx.translate(this.x - cameraX + this.width / 2, this.y + this.height / 2);
            ctx.scale(this.pulseScale, this.pulseScale);
            ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        }
    }
}
