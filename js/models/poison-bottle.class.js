class PoisonBottle extends MovableObject {
    
    width = 60;
    height = 60;
    collected = false;

    constructor(x, y) {
        super();
        
        // Zufällige Flaschen-Variante (links oder rechts schauend)
        const variant = Math.random() > 0.5 ? 'Left' : 'Right';
        const lightness = Math.random() > 0.5 ? 'Light' : 'Dark';
        
        this.loadImage(`4. Marcadores/Posión/${lightness} - ${variant}.png`);
        
        this.x = x;
        this.y = y;
    }
}
