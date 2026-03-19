/**
 * Collectible coin with rotation animation.
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
     * Creates a coin at the given position and starts the animation.
     * @param {number} x X-position.
     * @param {number} y Y-position.
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
     * Starts the animation loop for coin rotation (as long as not collected).
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
