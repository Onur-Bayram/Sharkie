/**
 * Player poison supply display as image bar (6 states from 0% to 100%).
 */
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

    /**
     * Creates the poison bar and positions it below the health display.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = 80;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Sets the displayed percentage value and selects the appropriate image.
    * @param {number} percentage Poison supply in percent (0-100).
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let index = Math.ceil((percentage / 100) * (this.IMAGES.length - 1));
        if (index >= this.IMAGES.length) {
            index = this.IMAGES.length - 1;
        }
        this.img = this.imageCache[this.IMAGES[index]];
    }
}
