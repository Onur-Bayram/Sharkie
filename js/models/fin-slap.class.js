class FinSlap extends MovableObject {
    IMAGES = [
        '1.Sharkie/4.Attack/Fin slap/1.png',
        '1.Sharkie/4.Attack/Fin slap/2.png',
        '1.Sharkie/4.Attack/Fin slap/3.png',
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
    lifetime = 800; 

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

    draw(ctx, cameraX) {
        let drawX = this.x - cameraX;
        let drawY = this.y;

        // Horizontal spiegeln wenn nach links bewegt
        if (this.direction === -1) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(this.img, -drawX - this.width, drawY, this.width, this.height);
            ctx.restore();
        } else {
            ctx.drawImage(this.img, drawX, drawY, this.width, this.height);
        }
    }

    animate() {
        if (this.currentImage < this.IMAGES.length) {
            let path = this.IMAGES[this.currentImage];
            this.img = this.imageCache[path];
            this.currentImage++;
        }
    }

    isAlive() {
        return this.currentImage < this.IMAGES.length;
    }
}
