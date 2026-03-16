/**
 * Statische Giftflasche zum Einsammeln – wählt zufällig Variante (links/rechts, dunkel/hell).
 */
class PoisonBottle extends MovableObject {
    
    width = 50;
    height = 50;
    collected = false;

    /**
     * Erstellt eine Giftflasche an der angegebenen Position.
     * @param {number} x X-Position.
     * @param {number} y Y-Position.
     */
    constructor(x, y) {
        super();
        const variant = Math.random() > 0.5 ? 'Left' : 'Right';
        const lightness = Math.random() > 0.5 ? 'Light' : 'Dark';
        
        this.loadImage(`4. Marcadores/Posión/${lightness} - ${variant}.png`);
        
        this.x = x;
        this.y = y;
    }
}
