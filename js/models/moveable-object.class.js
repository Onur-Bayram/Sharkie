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
    arr.forEach(path => {
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
    return this.x + offset < obj.x + obj.width - offset &&
           this.x + this.width - offset > obj.x + offset &&
           this.y + offset < obj.y + obj.height - offset &&
           this.y + this.height - offset > obj.y + offset;
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

    return this.x + offsetX < obj.x + obj.width - objInset &&
           this.x + this.width - offsetX > obj.x + objInset &&
           this.y + offsetY < obj.y + obj.height - objInset &&
           this.y + this.height - offsetY > obj.y + objInset;
}

/**
 * Checks precise contact collision for coins.
 * Collection only occurs on actual visible contact.
 * @param {MovableObject} obj Coin to check against.
 * @returns {boolean}
 */
isCollidingCoin(obj) {
    const characterBackInsetX = 68;
    const characterFrontInsetX = 56;
    const characterInsetY = 44;
    const coinInset = 6;
    const minContactPixels = 8;

    const isFacingLeft = !!this.otherDirection;
    const characterLeftInset = isFacingLeft ? characterFrontInsetX : characterBackInsetX;
    const characterRightInset = isFacingLeft ? characterBackInsetX : characterFrontInsetX;

    const left = Math.max(this.x + characterLeftInset, obj.x + coinInset);
    const right = Math.min(this.x + this.width - characterRightInset, obj.x + obj.width - coinInset);
    const top = Math.max(this.y + characterInsetY, obj.y + coinInset);
    const bottom = Math.min(this.y + this.height - characterInsetY, obj.y + obj.height - coinInset);

    if (right <= left || bottom <= top) {
        return false;
    }

    const overlapWidth = right - left;
    const overlapHeight = bottom - top;

    return overlapWidth >= minContactPixels && overlapHeight >= minContactPixels;
}

}

