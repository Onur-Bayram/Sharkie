/**
 * Player health display as image bar (6 states from 0% to 100%).
 */
class HealthBar extends StatusBar {
  IMAGES = [
    "4. Marcadores/green/Life/0_  copia 3.png",
    "4. Marcadores/green/Life/20_ copia 4.png",
    "4. Marcadores/green/Life/40_  copia 3.png",
    "4. Marcadores/green/Life/60_  copia 3.png",
    "4. Marcadores/green/Life/80_  copia 3.png",
    "4. Marcadores/green/Life/100_  copia 2.png",
  ];

  /**
   * Creates the status bar and positions it in the top left.
   */
  constructor() {
    super(10, 10, 200, 60);
    this.initializeBar(100);
  }
}
