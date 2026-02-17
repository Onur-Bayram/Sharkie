class PoisonBubbleProjectile extends MovableObject {
    
    IMAGES_BUBBLE = [
        '1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/1.png',
        '1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/2.png',
        '1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/3.png',
        '1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/4.png',
        '1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/5.png',
        '1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/6.png',
        '1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/7.png',
        '1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/8.png'
    ];

    constructor(x, y, direction) {
        super();
        this.loadImage(this.IMAGES_BUBBLE[0]);
        this.loadImages(this.IMAGES_BUBBLE);
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.speed = 6;
        this.direction = direction; // 1 = rechts, -1 = links
        this.currentImage = 0;
        this.isMoving = false;
        this.animate();
    }

    throw() {
        // Starte die Animation ab Frame 0
        this.currentImage = 0;
        
        //  fang an zu schießen
        setTimeout(() => {
            this.isMoving = true;
        }, 800);

        // Movement Loop
        this.moveInterval = setInterval(() => {
            if (this.isMoving) {
                this.x += this.speed * this.direction;
            }
        }, 1000 / 60);
    }

    animate() {
        this.animateInterval = setInterval(() => {
            if (this.currentImage < this.IMAGES_BUBBLE.length) {
                let path = this.IMAGES_BUBBLE[this.currentImage];
                this.img = this.imageCache[path];
                this.currentImage++;
            }
        }, 100);
    }

    stopMoving() {
        clearInterval(this.moveInterval);
        clearInterval(this.animateInterval);
    }
}
