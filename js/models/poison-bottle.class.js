/**
 * Static poison bottle for collection - randomly selects variant (left/right, dark/light).
 */
class PoisonBottle extends MovableObject {
    
    width = 50;
    height = 50;

    /**
     * Creates a poison bottle at the given position.
     * @param {number} x X-position.
     * @param {number} y Y-position.
     */
    constructor(x, y) {
        super();
        const variant = Math.random() > 0.5 ? 'Left' : 'Right';
        const lightness = Math.random() > 0.5 ? 'Light' : 'Dark';
        
        this.loadImage(`4. Marcadores/Posi\u00F3n/${lightness} - ${variant}.png`);
        
        this.x = x;
        this.y = y;
    }
}
