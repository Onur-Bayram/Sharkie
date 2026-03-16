/**
 * Basiswurfobjekt – wird in Bewegungsrichtung geschossen und animiert (Giftflaschen-Bilder).
 */
class ThrowableObject extends MovableObject {
    
    IMAGES_BUBBLE = [
        '4. Marcadores/Posión/Animada/1.png',
        '4. Marcadores/Posión/Animada/2.png',
        '4. Marcadores/Posión/Animada/3.png',
        '4. Marcadores/Posión/Animada/4.png',
        '4. Marcadores/Posión/Animada/5.png',
        '4. Marcadores/Posión/Animada/6.png',
        '4. Marcadores/Posión/Animada/7.png',
        '4. Marcadores/Posión/Animada/8.png'
    ];

    /**
     * Erstellt ein Wurfobjekt und startet Animation und Bewegung.
     * @param {number} x X-Startposition.
     * @param {number} y Y-Startposition.
     * @param {1|-1} direction Flugrichtung (1 = rechts, -1 = links).
     */
    constructor(x, y, direction) {
        super();
        this.loadImage(this.IMAGES_BUBBLE[0]);
        this.loadImages(this.IMAGES_BUBBLE);
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.speed = 7;
        this.direction = direction; // 1 = rechts, -1 = links
        this.animate();
        this.throw();
    }

    /**
     * Startet die Bewegungsschleife in Flugrichtung.
     * @returns {void}
     */
    throw() {
        setInterval(() => {
            this.x += this.speed * this.direction;
        }, 1000 / 60);
    }

    /**
     * Startet die Animations-Schleife für die Bildsequenz.
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            let path = this.IMAGES_BUBBLE[this.currentImage % this.IMAGES_BUBBLE.length];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 100);
    }
}
