class Character extends MovableObject{

    otherDirection = false;

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
    
    constructor() {
        super();
        this.loadImage('1.Sharkie/1.IDLE/1.png');
        this.loadImages(this.IMAGES_IDLE);
        this.width = 200;
        this.height = 140;
        this.speed = 5;
        this.animate();
        this.handleKeyboard();
    }

    animate() {
        setInterval(() => {
            let path = this.IMAGES_IDLE[this.currentImage % this.IMAGES_IDLE.length];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 100);
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
            
            // Begrenzung - Hai darf nicht aus dem Bild schwimmen
            if (this.x < 0) {
                this.x = 0;
            }
            if (this.x > 760) { // 960 - 200 (Canvas-Breite minus Hai-Breite)
                this.x = 760;
            }
            if (this.y < 0) {
                this.y = 0;
            }
            if (this.y > 400) { // 540 - 140 (Canvas-Höhe minus Hai-Höhe)
                this.y = 400;
            }
        }, 1000 / 60);
    }

    jump() {

    }


}