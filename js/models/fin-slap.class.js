/**
 * Fin slap projectile - brief melee animation, runs once through the image sequence.
 */
class FinSlap extends MovableObject {
  IMAGES = [
    "1.Sharkie/4.Attack/Fin slap/1.png",
    "1.Sharkie/4.Attack/Fin slap/4.png",
    "1.Sharkie/4.Attack/Fin slap/5.png",
    "1.Sharkie/4.Attack/Fin slap/6.png",
    "1.Sharkie/4.Attack/Fin slap/7.png",
    "1.Sharkie/4.Attack/Fin slap/8.png",
  ];

  damage = 50;
  speed = 7;
  direction = 1;
  currentImage = 0;
  createdTime = Date.now();

  /**
   * Creates the fin slap at the given position with direction.
   * @param {number} x X-position.
   * @param {number} y Y-position.
   * @param {1|-1} [direction=1] Attack direction (1 = right, -1 = left).
   */
  constructor(x, y, direction = 1) {
    super();
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.width = 80;
    this.height = 80;
    this.loadImages(this.IMAGES);
    this.loadImage(this.IMAGES[0]);
  }

  /**
   * Draws the fin slap on canvas, mirrored for left direction.
   * @param {CanvasRenderingContext2D} ctx Drawing context.
   * @param {number} cameraX Current camera X-offset.
   * @returns {void}
   */
  draw(ctx, cameraX) {
    let drawX = this.x - cameraX;
    let drawY = this.y;
    if (this.direction === -1) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(
        this.img,
        -drawX - this.width,
        drawY,
        this.width,
        this.height,
      );
      ctx.restore();
    } else {
      ctx.drawImage(this.img, drawX, drawY, this.width, this.height);
    }
  }

  /**
   * Sets the next image in the sequence (called once per frame).
   * @returns {void}
   */
  animate() {
    if (this.currentImage < this.IMAGES.length) {
      let path = this.IMAGES[this.currentImage];
      this.img = this.imageCache[path];
      this.currentImage++;
    }
  }

  /**
   * Returns whether the fin slap is still active (not all images cycled through).
   * @returns {boolean}
   */
  isAlive() {
    return this.currentImage < this.IMAGES.length;
  }
}
