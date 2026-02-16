class PoisonBar extends MovableObject {
    percentage = 100;

    IMAGES = [
        '4. Marcadores/green/poisoned bubbles/0_ copia 2.png',
        '4. Marcadores/green/poisoned bubbles/20_ copia 3.png',
        '4. Marcadores/green/poisoned bubbles/40_ copia 2.png',
        '4. Marcadores/green/poisoned bubbles/60_ copia 2.png',
        '4. Marcadores/green/poisoned bubbles/80_ copia 2.png',
        '4. Marcadores/green/poisoned bubbles/100_ copia 3.png'
    ];

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = 80;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        if (percentage === 100) {
            this.img = this.imageCache['4. Marcadores/green/poisoned bubbles/100_ copia 3.png'];
        } else if (percentage >= 80) {
            this.img = this.imageCache['4. Marcadores/green/poisoned bubbles/80_ copia 2.png'];
        } else if (percentage >= 60) {
            this.img = this.imageCache['4. Marcadores/green/poisoned bubbles/60_ copia 2.png'];
        } else if (percentage >= 40) {
            this.img = this.imageCache['4. Marcadores/green/poisoned bubbles/40_ copia 2.png'];
        } else if (percentage >= 20) {
            this.img = this.imageCache['4. Marcadores/green/poisoned bubbles/20_ copia 3.png'];
        } else {
            this.img = this.imageCache['4. Marcadores/green/poisoned bubbles/0_ copia 2.png'];
        }
    }
}
