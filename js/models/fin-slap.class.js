/**
 * Flossenschlag-Projektil – kurze Nahkampfanimation, läuft einmalig durch den Bildvorrat.
 */
class FinSlap extends MovableObject {
    IMAGES = [
        '1.Sharkie/4.Attack/Fin slap/1.png',
        '1.Sharkie/4.Attack/Fin slap/4.png',
        '1.Sharkie/4.Attack/Fin slap/5.png',
        '1.Sharkie/4.Attack/Fin slap/6.png',
        '1.Sharkie/4.Attack/Fin slap/7.png',
        '1.Sharkie/4.Attack/Fin slap/8.png'
    ];

    damage = 50;
    speed = 7;
    direction = 1;
    currentImage = 0;
    createdTime = Date.now();

    /**
     * Erstellt den Flossenschlag an der angegebenen Position mit Richtungsangabe.
     * @param {number} x X-Position.
     * @param {number} y Y-Position.
     * @param {1|-1} [direction=1] Angriffsrichtung (1 = rechts, -1 = links).
     */
    constructor(x, y, direction = 1) {
        super();
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.width = 80;
        this.height = 80;
        this.loadImages(this.IMAGES);
        this.loadImage(this.IMAGES[0]);
    }

    /**
     * Zeichnet den Flossenschlag auf den Canvas, gespiegelt bei linker Richtung.
     * @param {CanvasRenderingContext2D} ctx Zeichenkontext.
     * @param {number} cameraX Aktueller Kamera-X-Offset.
     * @returns {void}
     */
    draw(ctx, cameraX) {
        let drawX = this.x - cameraX;
        let drawY = this.y;
        if (this.direction === -1) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(this.img, -drawX - this.width, drawY, this.width, this.height);
            ctx.restore();
        } else {
            ctx.drawImage(this.img, drawX, drawY, this.width, this.height);
        }
    }

    /**
     * Setzt das nächste Bild in der Sequenz (wird einmalig pro Frame aufgerufen).
     * @returns {void}
     */
    animate() {
        if (this.currentImage < this.IMAGES.length) {
            let path = this.IMAGES[this.currentImage];
            this.img = this.imageCache[path];
            this.currentImage++;
        }
    }

    /**
     * Gibt zurück ob der Flossenschlag noch aktiv ist (noch nicht alle Bilder durchgelaufen).
     * @returns {boolean}
     */
    isAlive() {
        return this.currentImage < this.IMAGES.length;
    }
}
