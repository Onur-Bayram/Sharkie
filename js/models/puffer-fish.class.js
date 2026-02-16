class Pufferfish extends MovableObject{

    IMAGES_SWIM = [];
    hp = 30;
    isDead = false;

    constructor(x = null, y = null){
        super();
        
    
        this.colorVariant = Math.floor(Math.random() * 3) + 1;
        
      
        this.IMAGES_SWIM = [
            `2.Enemy/1.Puffer fish (3 color options)/1.Swim/${this.colorVariant}.swim1.png`,
            `2.Enemy/1.Puffer fish (3 color options)/1.Swim/${this.colorVariant}.swim2.png`,
            `2.Enemy/1.Puffer fish (3 color options)/1.Swim/${this.colorVariant}.swim3.png`,
            `2.Enemy/1.Puffer fish (3 color options)/1.Swim/${this.colorVariant}.swim4.png`,
            `2.Enemy/1.Puffer fish (3 color options)/1.Swim/${this.colorVariant}.swim5.png`
        ];
        
        this.loadImage(this.IMAGES_SWIM[0]);
        this.loadImages(this.IMAGES_SWIM);
        
        this.x = x !== null ? x : 200 + Math.random() * 300;
        this.y = y !== null ? y : 150 + Math.random() * 200;
        this.width = 80;
        this.height = 60;
        
    
        this.speed = 0.15 + Math.random() * 0.2;
        this.verticalSpeed = 0.5 + Math.random() * 0.5;
        this.targetY = this.y;
        
        this.animate();
    }

    animate() {
        setInterval(() => {
            let path = this.IMAGES_SWIM[this.currentImage % this.IMAGES_SWIM.length];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 150);
        
    
        setInterval(() => {
            this.moveLeft();
            
            // Smooth vertikale Bewegung zu Ziel-Y
            if (Math.abs(this.y - this.targetY) > 1) {
                if (this.y < this.targetY) {
                    this.y += this.verticalSpeed;
                } else {
                    this.y -= this.verticalSpeed;
                }
            }
        }, 1000 / 60);
        
        // Neues Ziel-Y setzen
        setInterval(() => {
            this.targetY = 50 + Math.random() * 400;
        }, 3000);
    }

}