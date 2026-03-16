/**
 * Münz-Sammelanzeige als Bildleiste (6 Zustände proportional zu gesammelten Münzen).
 */
class CoinBar {
    IMAGES = [
        '4. Marcadores/green/Coin/0_  copia 4.png',
        '4. Marcadores/green/Coin/20_  copia 2.png',
        '4. Marcadores/green/Coin/40_  copia 4.png',
        '4. Marcadores/green/Coin/60_  copia 4.png',
        '4. Marcadores/green/Coin/80_  copia 4.png',
        '4. Marcadores/green/Coin/100_ copia 4.png'
    ];

    x = 10;
    y = 150;
    width = 200;
    height = 56;
    img;
    imageCache = {};
    coinCount = 0;
    maxCoins = 0;

    /**
     * Erstellt die Münzleiste und lädt alle Bilder.
     */
    constructor() {
        this.loadImages(this.IMAGES);
        this.loadImage(this.IMAGES[0]);
    }

    /**
     * Lädt ein einzelnes Bild und setzt es als aktuelles Bild.
     * @param {string} path Bildpfad.
     * @returns {void}
     */
    loadImage(path) {
        if (!this.imageCache[path]) {
            this.imageCache[path] = new Image();
            this.imageCache[path].src = path;
        }
        this.img = this.imageCache[path];
    }

    /**
     * Lädt alle Bilder in den internen Cache.
     * @param {string[]} array Array von Bildpfaden.
     * @returns {void}
     */
    loadImages(array) {
        array.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Aktualisiert den Anzeigestatus basierend auf gesammelten Münzen.
     * @param {number} coinCount Anzahl gesammelter Münzen.
     * @param {number} [maxCoins=100] Gesamtzahl der Münzen.
     * @returns {void}
     */
    setPercentage(coinCount, maxCoins = 100) {
        this.coinCount = coinCount;
        this.maxCoins = maxCoins;
        let index = Math.round((coinCount / maxCoins) * (this.IMAGES.length - 1));
        if (index >= this.IMAGES.length) {
            index = this.IMAGES.length - 1;
        }
        this.loadImage(this.IMAGES[index]);
    }
}
