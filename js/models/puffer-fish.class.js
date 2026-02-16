class Pufferfish extends MovableObject{

    IMAGES_SWIM = [];
    IMAGES_TRANSITION = [];
    IMAGES_BUBBLESWIM = [];
    IMAGES_DEAD = [];
    hp = 30;
    isDead = false;
    state = 'swim';
    deadAnimationFinished = false;

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

        this.IMAGES_TRANSITION = [
            `2.Enemy/1.Puffer fish (3 color options)/2.transition/${this.colorVariant}.transition1.png`,
            `2.Enemy/1.Puffer fish (3 color options)/2.transition/${this.colorVariant}.transition2.png`,
            `2.Enemy/1.Puffer fish (3 color options)/2.transition/${this.colorVariant}.transition3.png`,
            `2.Enemy/1.Puffer fish (3 color options)/2.transition/${this.colorVariant}.transition4.png`,
            `2.Enemy/1.Puffer fish (3 color options)/2.transition/${this.colorVariant}.transition5.png`
        ];

        this.IMAGES_BUBBLESWIM = [
            `2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/${this.colorVariant}.bubbleswim1.png`,
            `2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/${this.colorVariant}.bubbleswim2.png`,
            `2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/${this.colorVariant}.bubbleswim3.png`,
            `2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/${this.colorVariant}.bubbleswim4.png`,
            `2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/${this.colorVariant}.bubbleswim5.png`
        ];

        this.IMAGES_DEAD = this.getDeadImages();
        
        this.loadImage(this.IMAGES_SWIM[0]);
        this.loadImages(this.IMAGES_SWIM);
        this.loadImages(this.IMAGES_TRANSITION);
        this.loadImages(this.IMAGES_BUBBLESWIM);
        this.loadImages(this.IMAGES_DEAD);
        
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

            if (!this.isDead && this.isTransitionState() && this.currentImage >= images.length) {
                this.finishTransition();
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

        this.scheduleBubbleCycle();
    }

    scheduleBubbleCycle() {
        const cycleDelay = 4000 + Math.random() * 2000;
        setInterval(() => {
            if (this.isDead) {
                return;
            }
            if (this.state === 'swim') {
                this.startTransitionToBubble();
                setTimeout(() => {
                    if (this.state === 'bubble') {
                        this.startTransitionToSwim();
                    }
                }, 2000);
            }
        }, cycleDelay);
    }

    startTransitionToBubble() {
        this.state = 'transitionToBubble';
        this.currentImage = 0;
    }

    startTransitionToSwim() {
        this.state = 'transitionToSwim';
        this.currentImage = 0;
    }

    finishTransition() {
        if (this.state === 'transitionToBubble') {
            this.state = 'bubble';
        } else if (this.state === 'transitionToSwim') {
            this.state = 'swim';
        }
        this.currentImage = 0;
    }

    isTransitionState() {
        return this.state === 'transitionToBubble' || this.state === 'transitionToSwim';
    }

    getCurrentImages() {
        if (this.isDead) {
            return this.IMAGES_DEAD;
        }
        if (this.state === 'bubble') {
            return this.IMAGES_BUBBLESWIM;
        }
        if (this.isTransitionState()) {
            return this.IMAGES_TRANSITION;
        }
        return this.IMAGES_SWIM;
    }

    getDeadImages() {
        if (this.colorVariant === 1) {
            return [
                '2.Enemy/1.Puffer fish (3 color options)/4.DIE/1.Dead 1 (can animate by going up).png',
                '2.Enemy/1.Puffer fish (3 color options)/4.DIE/1.Dead 2 (can animate by going down to the floor after the Fin Slap attack).png',
                '2.Enemy/1.Puffer fish (3 color options)/4.DIE/1.Dead 3 (can animate by going down to the floor after the Fin Slap attack).png'
            ];
        }
        if (this.colorVariant === 2) {
            return [
                '2.Enemy/1.Puffer fish (3 color options)/4.DIE/2.png',
                '2.Enemy/1.Puffer fish (3 color options)/4.DIE/2.2.png',
                '2.Enemy/1.Puffer fish (3 color options)/4.DIE/2.3.png'
            ];
        }
        return [
            '2.Enemy/1.Puffer fish (3 color options)/4.DIE/3.png',
            '2.Enemy/1.Puffer fish (3 color options)/4.DIE/3.2.png',
            '2.Enemy/1.Puffer fish (3 color options)/4.DIE/3.3.png'
        ];
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