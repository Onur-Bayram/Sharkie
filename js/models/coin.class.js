class Coin extends MovableObject {
    IMAGES = [
        '4. Marcadores/1. Coins/1.png',
        '4. Marcadores/1. Coins/2.png',
        '4. Marcadores/1. Coins/3.png',
        '4. Marcadores/1. Coins/4.png'
    ];

    collected = false;
    currentImage = 0;

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
