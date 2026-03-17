/**
 * Basisklasse für alle beweglichen Spielobjekte.
 * Verwaltet Position, Bild, gemeinsamen Bildcache und grundlegende Bewegungslogik.
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
 * Gibt ein Bild aus dem gemeinsamen Cache zurück oder erstellt es neu.
 * @param {string} path Relativer Bildpfad.
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
 * Setzt das aktuelle Hauptbild des Objekts.
 * @param {string} path Relativer Bildpfad.
 * @returns {void}
 */
loadImage(path) {
    this.img = this.getSharedImage(path);
}

/**
 * Lädt ein Array von Bildpfaden in den lokalen Bildcache.
 * @param {string[]} arr Array mit Bildpfaden.
 * @returns {void}
 */
loadImages(arr) {
    arr.forEach(path => {
        this.imageCache[path] = this.getSharedImage(path);
    });
}

/**
 * Bewegt das Objekt um `speed` Einheiten nach rechts.
 * @returns {void}
 */
moveRight() {
    this.x += this.speed;
}

/**
 * Bewegt das Objekt um `speed` Einheiten nach links.
 * @returns {void}
 */
moveLeft() {
    this.x -= this.speed;
}

/**
 * Bewegt das Objekt um `speed` Einheiten nach oben.
 * @returns {void}
 */
moveUp() {
    this.y -= this.speed;
}

/**
 * Bewegt das Objekt um `speed` Einheiten nach unten.
 * @returns {void}
 */
moveDown() {
    this.y += this.speed;
}

/**
 * Prüft ob dieses Objekt mit einem anderen kollidiert (mit Hitbox-Einzug).
 * @param {MovableObject} obj Zu prüfendes Objekt.
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
 * Prüft ob dieses Objekt ein Sammelobjekt berührt (großzügigerer Radius als isColliding).
 * @param {MovableObject} obj Zu prüfendes Sammelobjekt.
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
 * Prüft eine strengere Kollision für Münzen.
 * Die Überlappung muss deutlich sichtbar sein, bevor gesammelt wird.
 * @param {MovableObject} obj Zu prüfende Münze.
 * @returns {boolean}
 */
isCollidingCoin(obj) {
    const characterBackInsetX = 56;
    const characterFrontInsetX = 40;
    const characterInsetY = 34;
    const coinInset = 4;

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
    const overlapArea = overlapWidth * overlapHeight;
    const coinWidth = obj.width - coinInset * 2;
    const coinHeight = obj.height - coinInset * 2;
    const coinArea = coinWidth * coinHeight;

    // Kombination aus Fläche + Achsen-Überlappung: präzise, aber im Spielgefühl nicht zu streng.
    return overlapArea >= coinArea * 0.22 &&
           overlapWidth >= coinWidth * 0.30 &&
           overlapHeight >= coinHeight * 0.30;
}

}

