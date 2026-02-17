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
    fallSpeed = 0.3; 
    isVisible = false;
    visibilityRange = 300; 

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

    animate() {
        setInterval(() => {
            let path = this.IMAGES_ANIMATED[this.currentImage % this.IMAGES_ANIMATED.length];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 100);
    }

    fall() {
        setInterval(() => {
            // nur fallen lassen, wenn sichtbar, unter maxY und nicht gesammelt
            if (this.isVisible && this.y < this.maxY && !this.collected) {
                this.y += this.fallSpeed;
            }
        }, 1000 / 60);
    }

    checkVisibility(characterX) {
        // sichtbarkeit der pflasche basierend auf der position des characters
        this.isVisible = Math.abs(this.x - characterX) < this.visibilityRange;
    }
}

