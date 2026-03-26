/**
 * Coin collection display as image bar (6 states proportional to collected coins).
 */
class CoinBar extends StatusBar {
  IMAGES = [
    "4. Marcadores/green/Coin/0_  copia 4.png",
    "4. Marcadores/green/Coin/20_  copia 2.png",
    "4. Marcadores/green/Coin/40_  copia 4.png",
    "4. Marcadores/green/Coin/60_  copia 4.png",
    "4. Marcadores/green/Coin/80_  copia 4.png",
    "4. Marcadores/green/Coin/100_ copia 4.png",
  ];

  coinCount = 0;
  maxCoins = 0;

  /**
   * Creates the coin bar and loads all images.
   */
  constructor() {
    super(10, 150, 200, 56);
    this.initializeBar(0);
  }

  /**
   * Updates the display status based on collected coins.
   * @param {number} coinCount Number of collected coins.
   * @param {number} [maxCoins=100] Total number of coins.
   * @returns {void}
   */
  setPercentage(coinCount, maxCoins = 100) {
    this.coinCount = coinCount;
    this.maxCoins = maxCoins;
    const safeMax = Math.max(1, maxCoins);
    const percent = (coinCount / safeMax) * 100;
    super.setPercentage(percent);
  }
}
