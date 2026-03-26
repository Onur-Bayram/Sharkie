/**
 * Shared base class for image-based HUD bars.
 * Handles image loading and percentage-to-frame mapping.
 */
class StatusBar extends MovableObject {
  percentage = 0;
  IMAGES = [];

  /**
   * Creates an image bar with predefined geometry and optional default percentage.
   *
   * @param {number} x Horizontal position.
   * @param {number} y Vertical position.
   * @param {number} width Render width.
   * @param {number} height Render height.
   */
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Initializes image resources and the initial frame after subclass fields exist.
   *
   * @param {number} [initialPercentage=0] Initial percentage value.
   * @returns {void}
   */
  initializeBar(initialPercentage = 0) {
    this.loadImages(this.IMAGES);
    this.setPercentage(initialPercentage);
  }

  /**
   * Sets the displayed percentage value and updates the shown image frame.
   *
   * @param {number} percentage Percentage value in range 0-100.
   * @returns {void}
   */
  setPercentage(percentage) {
    this.percentage = Math.max(0, Math.min(100, percentage));
    const index = this.calculateImageIndex(this.percentage);
    this.img = this.imageCache[this.IMAGES[index]];
  }

  /**
   * Calculates the image index for a percentage value.
   *
   * @param {number} percentage Percentage value in range 0-100.
   * @returns {number}
   */
  calculateImageIndex(percentage) {
    const maxIndex = this.IMAGES.length - 1;
    if (maxIndex <= 0) return 0;
    const rawIndex = Math.ceil((percentage / 100) * maxIndex);
    return Math.max(0, Math.min(maxIndex, rawIndex));
  }
}
