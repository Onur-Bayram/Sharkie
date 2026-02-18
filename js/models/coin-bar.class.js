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

    constructor() {
        this.loadImages(this.IMAGES);
        this.loadImage(this.IMAGES[0]);
    }

    loadImage(path) {
        if (!this.imageCache[path]) {
            this.imageCache[path] = new Image();
            this.imageCache[path].src = path;
        }
        this.img = this.imageCache[path];
    }

    loadImages(array) {
        array.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

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
