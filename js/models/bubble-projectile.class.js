class BubbleProjectile extends MovableObject {
    
    IMAGES_BUBBLE = [
        '1.Sharkie/4.Attack/Bubble trap/For Whale/1.png',
        '1.Sharkie/4.Attack/Bubble trap/For Whale/2.png',
        '1.Sharkie/4.Attack/Bubble trap/For Whale/3.png',
        '1.Sharkie/4.Attack/Bubble trap/For Whale/4.png',
        '1.Sharkie/4.Attack/Bubble trap/For Whale/5.png',
        '1.Sharkie/4.Attack/Bubble trap/For Whale/6.png',
        '1.Sharkie/4.Attack/Bubble trap/For Whale/7.png',
        '1.Sharkie/4.Attack/Bubble trap/For Whale/8.png'
    ];

    constructor(x, y, direction) {
        super();
        this.loadImage(this.IMAGES_BUBBLE[0]);
        this.loadImages(this.IMAGES_BUBBLE);
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.speed = 7;
        this.direction = direction; // 1 = rechts, -1 = links
        this.animate();
        this.throw();
    }

    throw() {
        setInterval(() => {
            this.x += this.speed * this.direction;
        }, 1000 / 60);
    }

    animate() {
        setInterval(() => {
            let path = this.IMAGES_BUBBLE[this.currentImage % this.IMAGES_BUBBLE.length];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 100);
    }
}
