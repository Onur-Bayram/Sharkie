/**
 * Sammelbare Münze mit Rotations-Animation.
 */
class Coin extends MovableObject {
    IMAGES = [
        '4. Marcadores/1. Coins/1.png',
        '4. Marcadores/1. Coins/2.png',
        '4. Marcadores/1. Coins/3.png',
        '4. Marcadores/1. Coins/4.png'
    ];

    collected = false;
    currentImage = 0;

    /**
     * Erstellt eine Münze an der angegebenen Position und startet die Animation.
     * @param {number} x X-Position.
     * @param {number} y Y-Position.
     */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.loadImages(this.IMAGES);
        this.loadImage(this.IMAGES[0]);
        this.animate();
    }

    /**
     * Startet die Animations-Schleife für die Münz-Rotation (solange nicht eingesammelt).
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            if (!this.collected) {
                let path = this.IMAGES[this.currentImage % this.IMAGES.length];
                this.img = this.imageCache[path];
                this.currentImage++;
            }
        }, 150);
    }
}
