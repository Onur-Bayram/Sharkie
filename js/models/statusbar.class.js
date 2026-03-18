/**
 * Player health display as image bar (6 states from 0% to 100%).
 */
class StatusBar extends MovableObject {
    percentage = 100;

    IMAGES = [
        '4. Marcadores/green/Life/0_  copia 3.png',
        '4. Marcadores/green/Life/20_ copia 4.png',
        '4. Marcadores/green/Life/40_  copia 3.png',
        '4. Marcadores/green/Life/60_  copia 3.png',
        '4. Marcadores/green/Life/80_  copia 3.png',
        '4. Marcadores/green/Life/100_  copia 2.png'
    ];

    /**
     * Creates the status bar and positions it in the top left.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = 10;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Sets the displayed percentage value and selects the appropriate image.
     * @param {number} percentage Health energy in percent (0–100).
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
