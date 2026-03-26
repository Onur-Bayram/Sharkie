/**
 * Background object - loads a background image and sets position and size.
 */
class BackgroundObject extends MovableObject {
  /**
   * Creates a background object with the given image and coordinates.
   * @param {string} imagePath Path to the background image.
   * @param {number} x X-position.
   * @param {number} y Y-position.
   */
  constructor(imagePath, x, y) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = y;
    this.width = 960;
    this.height = 540;
  }
}
