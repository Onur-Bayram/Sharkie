/**
 * Animated (falling) poison bottle - becomes visible when character is nearby,
 * then falls slowly downward and can be collected.
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
     * Creates an animated poison bottle with optional start Y value.
     * @param {number} x X-position.
     * @param {number} [startY=-100] Y-start position (default outside view).
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
     * Starts the animation loop for the bottle's rotation animation.
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
    * Starts the fall loop - moves the bottle down if visible and not collected.
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
     * Activates visibility if the character is within view range.
     * @param {number} characterX Character's X-position.
     * @returns {void}
     */
    checkVisibility(characterX) {
        this.isVisible = Math.abs(this.x - characterX) < this.visibilityRange;
    }
}

