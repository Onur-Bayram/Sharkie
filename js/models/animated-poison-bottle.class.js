/**
 * Animierte (fallende) Giftflasche – wird erst sichtbar wenn der Charakter in der Nähe ist,
 * dann fällt sie langsam nach unten und kann eingesammelt werden.
 */
class AnimatedPoisonBottle extends MovableObject {
    
    IMAGES_ANIMATED = [
        '4. Marcadores/Posión/Animada/1.png',
        '4. Marcadores/Posión/Animada/2.png',
        '4. Marcadores/Posión/Animada/3.png',
        '4. Marcadores/Posión/Animada/4.png',
        '4. Marcadores/Posión/Animada/5.png',
        '4. Marcadores/Posión/Animada/6.png',
        '4. Marcadores/Posión/Animada/7.png',
        '4. Marcadores/Posión/Animada/8.png'
    ];
    width = 80;
    height = 80;
    collected = false;
    fallSpeed = 0.7;
    isVisible = false;
    visibilityRange = 300; 

    /**
     * Erstellt eine animierte Giftflasche mit optionalem Start-Y-Wert.
     * @param {number} x X-Position.
     * @param {number} [startY=-100] Y-Startposition (standard außerhalb des Sichtfeldes).
     */
    constructor(x, startY = -100) {
        super();
        
        this.loadImage(this.IMAGES_ANIMATED[0]);
        this.loadImages(this.IMAGES_ANIMATED);
        
        this.x = x;
        this.y = startY;
        this.maxY = 400; 
        
        this.animate();
        this.fall();
    }

    /**
     * Startet die Animations-Schleife für die Dreh-Animation der Flasche.
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            let path = this.IMAGES_ANIMATED[this.currentImage % this.IMAGES_ANIMATED.length];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 100);
    }

    /**
     * Startet die Fall-Schleife – bewegt die Flasche nach unten wenn sichtbar und nicht eingesammelt.
     * @returns {void}
     */
    fall() {
        setInterval(() => {
            if (this.isVisible && this.y < this.maxY && !this.collected) {
                this.y += this.fallSpeed;
            }
        }, 1000 / 60);
    }

    /**
     * Aktiviert die Sichtbarkeit wenn der Charakter sich innerhalb der Sichtweite befindet.
     * @param {number} characterX X-Position des Charakters.
     * @returns {void}
     */
    checkVisibility(characterX) {
        this.isVisible = Math.abs(this.x - characterX) < this.visibilityRange;
    }
}

