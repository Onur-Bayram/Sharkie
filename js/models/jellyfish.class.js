class Jellyfish extends MovableObject {
    
    IMAGES_SWIM = [];
    IMAGES_DEAD = [];
    hp = 30;
    isDead = false;
    state = 'swim';
    deadAnimationFinished = false;
    type = 'regular'; // 'regular' or 'dangerous'
    color = 'yellow'; // 'yellow', 'lila', 'green', 'pink'

    constructor(x = null, y = null) {
        super();
        
        // Random type and color
        this.type = Math.random() > 0.7 ? 'dangerous' : 'regular';
        
        if (this.type === 'regular') {
            this.color = Math.random() > 0.5 ? 'yellow' : 'lila';
            this.hp = 30;
            this.isElectric = false;
        } else {
            this.color = Math.random() > 0.5 ? 'green' : 'pink';
            this.hp = 40;
            this.isElectric = true;
        }

        this.loadSwimImages();
        this.loadDeadImages();
        
        this.loadImage(this.IMAGES_SWIM[0]);
        this.loadImages(this.IMAGES_SWIM);
        this.loadImages(this.IMAGES_DEAD);
        
        this.x = x !== null ? x : 200 + Math.random() * 300;
        this.y = y !== null ? y : 150 + Math.random() * 200;
        this.width = 80;
        this.height = 80;
        
        this.speed = 0.15 + Math.random() * 0.2;
        this.verticalSpeed = 0.5 + Math.random() * 0.5;
        this.targetY = this.y;
        
        this.animate();
    }

    loadSwimImages() {
        const folder = this.type === 'regular' ? 'Regular damage' : 'Súper dangerous';
        const colorCode = this.getColorCode();
        
        this.IMAGES_SWIM = [
            `2.Enemy/2 Jelly fish/${folder}/${colorCode} 1.png`,
            `2.Enemy/2 Jelly fish/${folder}/${colorCode} 2.png`,
            `2.Enemy/2 Jelly fish/${folder}/${colorCode} 3.png`,
            `2.Enemy/2 Jelly fish/${folder}/${colorCode} 4.png`
        ];
    }

    loadDeadImages() {
        const colorFolder = this.getColorFolder();
        const colorCode = this.getDeadColorCode();
        
        this.IMAGES_DEAD = [
            `2.Enemy/2 Jelly fish/Dead/${colorFolder}/${colorCode}1.png`,
            `2.Enemy/2 Jelly fish/Dead/${colorFolder}/${colorCode}2.png`,
            `2.Enemy/2 Jelly fish/Dead/${colorFolder}/${colorCode}3.png`,
            `2.Enemy/2 Jelly fish/Dead/${colorFolder}/${colorCode}4.png`
        ];
    }

    getColorCode() {
        switch (this.color) {
            case 'yellow':
                return 'Yellow';
            case 'lila':
                return 'Lila';
            case 'green':
                return 'Green';
            case 'pink':
                return 'Pink';
            default:
                return 'Yellow';
        }
    }

    getColorFolder() {
        switch (this.color) {
            case 'yellow':
                return 'Yellow';
            case 'lila':
                return 'Lila';
            case 'green':
                return 'green';
            case 'pink':
                return 'Pink';
            default:
                return 'Yellow';
        }
    }

    getDeadColorCode() {
        switch (this.color) {
            case 'yellow':
                return 'y';
            case 'lila':
                return 'L';
            case 'green':
                return 'g';
            case 'pink':
                return 'P';
            default:
                return 'y';
        }
    }

    animate() {
        setInterval(() => {
            const images = this.getCurrentImages();

            if (this.isDead && this.deadAnimationFinished) {
                this.img = this.imageCache[images[images.length - 1]];
                return;
            }

            let path = images[this.currentImage % images.length];
            this.img = this.imageCache[path];
            this.currentImage++;

            if (this.isDead && this.currentImage >= images.length) {
                this.deadAnimationFinished = true;
                this.currentImage = images.length - 1;
                return;
            }
        }, 150);
        
        setInterval(() => {
            if (this.isDead) {
                return;
            }

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
            if (!this.isDead) {
                this.targetY = 50 + Math.random() * 400;
            }
        }, 3000);
    }

    getCurrentImages() {
        if (this.isDead) {
            return this.IMAGES_DEAD;
        }
        return this.IMAGES_SWIM;
    }

    die() {
        if (this.isDead) {
            return;
        }
        this.isDead = true;
        this.state = 'dead';
        this.currentImage = 0;
        this.deadAnimationFinished = false;
    }
}
