class BubbleAnimation extends MovableObject {
    
    constructor(x, y, direction, isPoison = false) {
        super();
        

        let imagePath = isPoison ? 
            '1.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png' :
            '1.Sharkie/4.Attack/Bubble trap/Bubble.png';
        
        this.loadImage(imagePath);
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.speed = 4;
        this.direction = direction;
        this.isPoison = isPoison;
        this.pulseScale = 1;
        this.pulseSpeed = 0.02;
        this.throw();
        this.animate();
    }

    throw() {
        setInterval(() => {
            this.x += this.speed * this.direction;
        }, 1000 / 60);
    }

    animate() {
        setInterval(() => {
            // Pulsing Animation für die Blase
            this.pulseScale += this.pulseSpeed;
            if (this.pulseScale > 1.2 || this.pulseScale < 0.95) {
                this.pulseSpeed *= -1;
            }
        }, 50);
    }

    draw(ctx, cameraX) {
        if (this.img && this.img.complete && this.img.naturalHeight !== 0) {
            ctx.save();
            ctx.translate(this.x - cameraX + this.width / 2, this.y + this.height / 2);
            ctx.scale(this.pulseScale, this.pulseScale);
            ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        }
    }
}
