/**
 * Giftvorrat-Anzeige des Spielers als Bildleiste (6 Zustände von 0% bis 100%).
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
     * Erstellt die Giftleiste und positioniert sie unter der Lebensanzeige.
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
     * Setzt den angezeigten Prozentwert und wählt das passende Bild.
     * @param {number} percentage Giftvorrat in Prozent (0–100).
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
