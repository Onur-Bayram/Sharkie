class Character extends MovableObject{

    otherDirection = false;
    isHurt = false;
    lastHitTime = 0;

    IMAGES_IDLE = [
        '1.Sharkie/1.IDLE/1.png',
        '1.Sharkie/1.IDLE/2.png',
        '1.Sharkie/1.IDLE/3.png',
        '1.Sharkie/1.IDLE/4.png',
        '1.Sharkie/1.IDLE/5.png',
        '1.Sharkie/1.IDLE/6.png',
        '1.Sharkie/1.IDLE/7.png',
        '1.Sharkie/1.IDLE/8.png',
        '1.Sharkie/1.IDLE/9.png',
        '1.Sharkie/1.IDLE/10.png',
        '1.Sharkie/1.IDLE/11.png',
        '1.Sharkie/1.IDLE/12.png',
        '1.Sharkie/1.IDLE/13.png',
        '1.Sharkie/1.IDLE/14.png',
        '1.Sharkie/1.IDLE/15.png',
        '1.Sharkie/1.IDLE/16.png',
        '1.Sharkie/1.IDLE/17.png',
        '1.Sharkie/1.IDLE/18.png'
    ];

    IMAGES_HURT = [
        '1.Sharkie/5.Hurt/2.Electric shock/1.png',
        '1.Sharkie/5.Hurt/2.Electric shock/2.png',
        '1.Sharkie/5.Hurt/2.Electric shock/3.png'
    ];
    
    constructor() {
        super();
        this.loadImage('1.Sharkie/1.IDLE/1.png');
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_HURT);
        this.width = 200;
        this.height = 140;
        this.speed = 5;
        this.animate();
        this.handleKeyboard();
    }

    animate() {
        setInterval(() => {
            if (this.isHurt) {
                let path = this.IMAGES_HURT[this.currentImage % this.IMAGES_HURT.length];
                this.img = this.imageCache[path];
                this.currentImage++;
            } else {
                let path = this.IMAGES_IDLE[this.currentImage % this.IMAGES_IDLE.length];
                this.img = this.imageCache[path];
                this.currentImage++;
            }
        }, 100);
    }

    hit() {
        this.isHurt = true;
        this.lastHitTime = Date.now();
        this.currentImage = 0;
        
        setTimeout(() => {
            this.isHurt = false;
            this.currentImage = 0;
        }, 500);
    }

    handleKeyboard() {
        setInterval(() => {
            if (window.keyboard && window.keyboard.RIGHT) {
                this.moveRight();
                this.otherDirection = false;
            }
            if (window.keyboard && window.keyboard.LEFT) {
                this.moveLeft();
                this.otherDirection = true;
            }
            if (window.keyboard && window.keyboard.UP) {
                this.moveUp();
            }
            if (window.keyboard && window.keyboard.DOWN) {
                this.moveDown();
            }
            
            // Begrenzung der Hai darf nicht aus dem Bild schwimmen
            const mapWidth = this.world ? this.world.mapWidth : 960;
            const canvasHeight = this.world ? this.world.canvas.height : 540;
            const maxX = Math.max(0, mapWidth - this.width);
            const maxY = Math.max(0, canvasHeight - this.height);
            if (this.x < 0) {
                this.x = 0;
            }
            if (this.x > maxX) {
                this.x = maxX;
            }
            if (this.y < 0) {
                this.y = 0;
            }
            if (this.y > maxY) {
                this.y = maxY;
            }
        }, 1000 / 60);
    }

    jump() {

    }


}