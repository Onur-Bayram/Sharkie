/**
 * Base class for all movable game objects.
 * Manages position, image, shared image cache, and basic movement logic.
 */
class MovableObject {
  x = 50;
  y = 250;
  img;
  height = 150;
  width = 100;
  imageCache = {};
  currentImage = 0;
  speed = 0.15;

  static sharedImageCache = {};

  /**
   * Retrieves an image from the shared cache or creates it if not present.
   * @param {string} path Relative image path.
   * @returns {HTMLImageElement}
   */
  getSharedImage(path) {
    if (!MovableObject.sharedImageCache[path]) {
      const img = new Image();
      img.src = encodeURI(path);
      MovableObject.sharedImageCache[path] = img;
    }
    return MovableObject.sharedImageCache[path];
  }

  /**
   * Sets the current main image of the object.
   * @param {string} path Relative image path.
   * @returns {void}
   */
  loadImage(path) {
    this.img = this.getSharedImage(path);
  }

  /**
   * Loads an array of image paths into the local image cache.
   * @param {string[]} arr Array of image paths.
   * @returns {void}
   */
  loadImages(arr) {
    arr.forEach((path) => {
      this.imageCache[path] = this.getSharedImage(path);
    });
  }

  /**
   * Moves the object `speed` units to the right.
   * @returns {void}
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object `speed` units to the left.
   * @returns {void}
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Moves the object `speed` units upward.
   * @returns {void}
   */
  moveUp() {
    this.y -= this.speed;
  }

  /**
   * Moves the object `speed` units downward.
   * @returns {void}
   */
  moveDown() {
    this.y += this.speed;
  }

  /**
   * Checks if this object collides with another (with hitbox inset).
   * @param {MovableObject} obj Object to check collision against.
   * @returns {boolean}
   */
  isColliding(obj) {
    const offset = 30;
    return (
      this.x + offset < obj.x + obj.width - offset &&
      this.x + this.width - offset > obj.x + offset &&
      this.y + offset < obj.y + obj.height - offset &&
      this.y + this.height - offset > obj.y + offset
    );
  }

  /**
   * Checks if this object touches a collectible (more generous radius than isColliding).
   * @param {MovableObject} obj Collectible object to check against.
   * @returns {boolean}
   */
  isCollidingCollect(obj) {
    const offsetX = 53;
    const offsetY = 62;
    const objInset = 8;

    return (
      this.x + offsetX < obj.x + obj.width - objInset &&
      this.x + this.width - offsetX > obj.x + objInset &&
      this.y + offsetY < obj.y + obj.height - objInset &&
      this.y + this.height - offsetY > obj.y + objInset
    );
  }

  /**
   * Checks precise contact collision for coins.
   * Collection only occurs on actual visible contact.
   * @param {MovableObject} obj Coin to check against.
   * @returns {boolean}
   */
  isCollidingCoin(obj) {
    const { left, right, top, bottom } = this.getCoinHitbox(obj);
    if (right <= left || bottom <= top) return false;
    return this.hasMinimumOverlap(left, right, top, bottom);
  }

  /**
   * Gets coin hitbox.
   * @param {MovableObject} obj Coin to check against.
   * @returns {Object}
   */
  getCoinHitbox(obj) {
    const { leftInset, rightInset, insetY, coinInset } = this.getCoinInsets();
    return {
      left: Math.max(this.x + leftInset, obj.x + coinInset),
      right: Math.min(
        this.x + this.width - rightInset,
        obj.x + obj.width - coinInset,
      ),
      top: Math.max(this.y + insetY, obj.y + coinInset),
      bottom: Math.min(
        this.y + this.height - insetY,
        obj.y + obj.height - coinInset,
      ),
    };
  }

  /**
   * Gets directional inset values for coin collision detection.
   * @returns {Object}
   */
  getCoinInsets() {
    const back = 36,
      front = 52,
      insetY = 40,
      coinInset = 5;
    const leftInset = !!this.otherDirection ? front : back;
    return {
      leftInset,
      rightInset: leftInset === front ? back : front,
      insetY,
      coinInset,
    };
  }

  /**
   * Checks minimum overlap.
   * @param {number} left Left boundary.
   * @param {number} right Right boundary.
   * @param {number} top Top boundary.
   * @param {number} bottom Bottom boundary.
   * @returns {boolean}
   */
  hasMinimumOverlap(left, right, top, bottom) {
    const minContactPixels = 4;
    return right - left >= minContactPixels && bottom - top >= minContactPixels;
  }
}
