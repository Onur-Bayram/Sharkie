class FinalBoss extends MovableObject {

    IMAGES_FLOATING = [
        '2.Enemy/3 Final Enemy/2.floating/1.png',
        '2.Enemy/3 Final Enemy/2.floating/2.png',
        '2.Enemy/3 Final Enemy/2.floating/3.png',
        '2.Enemy/3 Final Enemy/2.floating/4.png',
        '2.Enemy/3 Final Enemy/2.floating/5.png',
        '2.Enemy/3 Final Enemy/2.floating/6.png',
        '2.Enemy/3 Final Enemy/2.floating/7.png',
        '2.Enemy/3 Final Enemy/2.floating/8.png',
        '2.Enemy/3 Final Enemy/2.floating/9.png',
        '2.Enemy/3 Final Enemy/2.floating/10.png',
        '2.Enemy/3 Final Enemy/2.floating/11.png',
        '2.Enemy/3 Final Enemy/2.floating/12.png',
        '2.Enemy/3 Final Enemy/2.floating/13.png'
    ];

    IMAGES_INTRODUCE = [
        '2.Enemy/3 Final Enemy/1.Introduce/1.png',
        '2.Enemy/3 Final Enemy/1.Introduce/2.png',
        '2.Enemy/3 Final Enemy/1.Introduce/3.png',
        '2.Enemy/3 Final Enemy/1.Introduce/4.png',
        '2.Enemy/3 Final Enemy/1.Introduce/5.png',
        '2.Enemy/3 Final Enemy/1.Introduce/6.png',
        '2.Enemy/3 Final Enemy/1.Introduce/7.png',
        '2.Enemy/3 Final Enemy/1.Introduce/8.png',
        '2.Enemy/3 Final Enemy/1.Introduce/9.png',
        '2.Enemy/3 Final Enemy/1.Introduce/10.png'
    ];

    introduced = false;

    constructor(x, y) {
        super();
        this.loadImage(this.IMAGES_INTRODUCE[0]);
        this.loadImages(this.IMAGES_INTRODUCE);
        this.loadImages(this.IMAGES_FLOATING);

        this.x = x;
        this.y = y;
        this.width = 450;
        this.height = 450;
        this.speed = 0.5;

        this.animate();
    }

    animate() {
        // Intro Animation dann zu floating wechseln
        let introInterval = setInterval(() => {
            if (!this.introduced) {
                let path = this.IMAGES_INTRODUCE[this.currentImage % this.IMAGES_INTRODUCE.length];
                this.img = this.imageCache[path];
                this.currentImage++;

                if (this.currentImage >= this.IMAGES_INTRODUCE.length) {
                    this.introduced = true;
                    this.currentImage = 0;
                    clearInterval(introInterval);
                }
            }
        }, 150);

        // Floating Animation startet nach Intro
        setTimeout(() => {
            setInterval(() => {
                if (this.introduced) {
                    let path = this.IMAGES_FLOATING[this.currentImage % this.IMAGES_FLOATING.length];
                    this.img = this.imageCache[path];
                    this.currentImage++;
                }
            }, 150);
        }, this.IMAGES_INTRODUCE.length * 150);
    }

}
