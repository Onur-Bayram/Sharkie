class Character extends MovableObject{

    otherDirection = false;
    isHurt = false;
    isAttacking = false;
    isFinSlapping = false;
    isDead = false;
    deadAnimationFinished = false;
    lastDamageType = 'poison';
    isLongIdle = false;
    lastActivity = Date.now();
    isSwimming = false;
    lastHitTime = 0;
    energy = 100;
    maxEnergy = 100;
    poison = 100;
    maxPoison = 100;
    lastThrowTime = 0;

    IMAGES_IDLE = [
        '1.Sharkie/1.IDLE/1.png',
        '1.Sharkie/1.IDLE/2.png',
        '1.Sharkie/1.IDLE/3.png',
        '1.Sharkie/1.IDLE/4.png',
        '1.Sharkie/1.IDLE/5.png',
        '1.Sharkie/1.IDLE/6.png',
        '1.Sharkie/1.IDLE/7.png',
        '1.Sharkie/1.IDLE/8.png',
        '1.Sharkie/1.IDLE/9.png',
        '1.Sharkie/1.IDLE/10.png',
        '1.Sharkie/1.IDLE/11.png',
        '1.Sharkie/1.IDLE/12.png',
        '1.Sharkie/1.IDLE/13.png',
        '1.Sharkie/1.IDLE/14.png',
        '1.Sharkie/1.IDLE/15.png',
        '1.Sharkie/1.IDLE/16.png',
        '1.Sharkie/1.IDLE/17.png',
        '1.Sharkie/1.IDLE/18.png'
    ];

    IMAGES_LONG_IDLE = [
        '1.Sharkie/2.Long_IDLE/i1.png',
        '1.Sharkie/2.Long_IDLE/I2.png',
        '1.Sharkie/2.Long_IDLE/I3.png',
        '1.Sharkie/2.Long_IDLE/I4.png',
        '1.Sharkie/2.Long_IDLE/I5.png',
        '1.Sharkie/2.Long_IDLE/I6.png',
        '1.Sharkie/2.Long_IDLE/I7.png',
        '1.Sharkie/2.Long_IDLE/I8.png',
        '1.Sharkie/2.Long_IDLE/I9.png',
        '1.Sharkie/2.Long_IDLE/I10.png',
        '1.Sharkie/2.Long_IDLE/I11.png',
        '1.Sharkie/2.Long_IDLE/I12.png',
        '1.Sharkie/2.Long_IDLE/I13.png',
        '1.Sharkie/2.Long_IDLE/I14.png'
    ];

    IMAGES_SLEEP_LOOP = [
        '1.Sharkie/2.Long_IDLE/I11.png',
        '1.Sharkie/2.Long_IDLE/I12.png',
        '1.Sharkie/2.Long_IDLE/I13.png',
        '1.Sharkie/2.Long_IDLE/I14.png'
    ];

    IMAGES_SWIM = [
        '1.Sharkie/3.Swim/1.png',
        '1.Sharkie/3.Swim/2.png',
        '1.Sharkie/3.Swim/3.png',
        '1.Sharkie/3.Swim/4.png',
        '1.Sharkie/3.Swim/5.png',
        '1.Sharkie/3.Swim/6.png'
    ];

    IMAGES_ATTACK = [
        '1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/1.png',
        '1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/2.png',
        '1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/3.png',
        '1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/4.png',
        '1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/5.png',
        '1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/6.png',
        '1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/7.png',
        '1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/8.png'
    ];

    IMAGES_HURT = [
        '1.Sharkie/5.Hurt/2.Electric shock/1.png',
        '1.Sharkie/5.Hurt/2.Electric shock/2.png',
        '1.Sharkie/5.Hurt/2.Electric shock/3.png'
    ];

    IMAGES_HURT_POISON = [
        '1.Sharkie/5.Hurt/1.Poisoned/1.png',
        '1.Sharkie/5.Hurt/1.Poisoned/2.png',
        '1.Sharkie/5.Hurt/1.Poisoned/3.png',
        '1.Sharkie/5.Hurt/1.Poisoned/4.png',
        '1.Sharkie/5.Hurt/1.Poisoned/5.png'
    ];

    IMAGES_DEAD_POISON = [
        '1.Sharkie/6.dead/1.Poisoned/1.png',
        '1.Sharkie/6.dead/1.Poisoned/2.png',
        '1.Sharkie/6.dead/1.Poisoned/3.png',
        '1.Sharkie/6.dead/1.Poisoned/4.png',
        '1.Sharkie/6.dead/1.Poisoned/5.png',
        '1.Sharkie/6.dead/1.Poisoned/6.png',
        '1.Sharkie/6.dead/1.Poisoned/7.png',
        '1.Sharkie/6.dead/1.Poisoned/8.png',
        '1.Sharkie/6.dead/1.Poisoned/9.png',
        '1.Sharkie/6.dead/1.Poisoned/10.png',
        '1.Sharkie/6.dead/1.Poisoned/11.png',
        '1.Sharkie/6.dead/1.Poisoned/12.png'
    ];

    IMAGES_DEAD_ELECTRIC = [
        '1.Sharkie/6.dead/2.Electro_shock/1.png',
        '1.Sharkie/6.dead/2.Electro_shock/2.png',
        '1.Sharkie/6.dead/2.Electro_shock/3.png',
        '1.Sharkie/6.dead/2.Electro_shock/4.png',
        '1.Sharkie/6.dead/2.Electro_shock/5.png',
        '1.Sharkie/6.dead/2.Electro_shock/6.png',
        '1.Sharkie/6.dead/2.Electro_shock/7.png',
        '1.Sharkie/6.dead/2.Electro_shock/8.png',
        '1.Sharkie/6.dead/2.Electro_shock/9.png',
        '1.Sharkie/6.dead/2.Electro_shock/10.png'
    ];

    IMAGES_FIN_SLAP = [
        '1.Sharkie/4.Attack/Fin slap/1.png',
        '1.Sharkie/4.Attack/Fin slap/2.png',
        '1.Sharkie/4.Attack/Fin slap/3.png',
        '1.Sharkie/4.Attack/Fin slap/4.png',
        '1.Sharkie/4.Attack/Fin slap/5.png',
        '1.Sharkie/4.Attack/Fin slap/6.png',
        '1.Sharkie/4.Attack/Fin slap/7.png',
        '1.Sharkie/4.Attack/Fin slap/8.png'
    ];
    
    constructor() {
        super();
        this.loadImage('1.Sharkie/1.IDLE/1.png');
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_SLEEP_LOOP);
        this.loadImages(this.IMAGES_SWIM);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_HURT_POISON);
        this.loadImages(this.IMAGES_DEAD_POISON);
        this.loadImages(this.IMAGES_DEAD_ELECTRIC);
        this.loadImages(this.IMAGES_FIN_SLAP);
        this.width = 200;
        this.height = 140;
        this.speed = 5;
        this.animate();
        this.handleKeyboard();
    }

    animate() {
        setInterval(() => {
            if (this.isDead) {
                const images = this.getDeathImages();
                if (this.deadAnimationFinished) {
                    this.img = this.imageCache[images[images.length - 1]];
                    return;
                }

                let path = images[this.currentImage % images.length];
                this.img = this.imageCache[path];
                this.currentImage++;

                if (this.currentImage >= images.length) {
                    this.deadAnimationFinished = true;
                    this.currentImage = images.length - 1;
                }
                return;
            }
            if (this.isHurt) {
                const hurtImages = this.lastDamageType === 'electric'
                    ? this.IMAGES_HURT
                    : this.IMAGES_HURT_POISON;
                let path = hurtImages[this.currentImage % hurtImages.length];
                this.img = this.imageCache[path];
                this.currentImage++;
            } else if (this.isFinSlapping) {
                let path = this.IMAGES_FIN_SLAP[this.currentImage % this.IMAGES_FIN_SLAP.length];
                this.img = this.imageCache[path];
                this.currentImage++;
            } else if (this.isAttacking) {
                let path = this.IMAGES_ATTACK[this.currentImage % this.IMAGES_ATTACK.length];
                this.img = this.imageCache[path];
                this.currentImage++;
            } else if (this.isLongIdle) {
                // Schlafanimation - durchlaufe zuerst bis Frame 10, dann loope die Sleep-Frames (I11, I12, I13)
                if (this.currentImage < this.IMAGES_LONG_IDLE.length) {
                    // Spielabspiel bis zur Sleep-Animation
                    let path = this.IMAGES_LONG_IDLE[this.currentImage];
                    this.img = this.imageCache[path];
                    this.currentImage++;
                } else {
                    // Loope die Sleep-Frames (I11, I12, I13)
                    const sleepIndex = (this.currentImage - this.IMAGES_LONG_IDLE.length) % this.IMAGES_SLEEP_LOOP.length;
                    let path = this.IMAGES_SLEEP_LOOP[sleepIndex];
                    this.img = this.imageCache[path];
                    this.currentImage++;
                }
            } else if (this.isSwimming) {
                let path = this.IMAGES_SWIM[this.currentImage % this.IMAGES_SWIM.length];
                this.img = this.imageCache[path];
                this.currentImage++;
            } else {
                let path = this.IMAGES_IDLE[this.currentImage % this.IMAGES_IDLE.length];
                this.img = this.imageCache[path];
                this.currentImage++;
            }
        }, 100);
    }

    hit(damageType, damage = 10) {
        if (this.isDead) {
            return;
        }
        if (this.energy <= 0) {
            this.die();
            return;
        }
        if (damageType) {
            this.lastDamageType = damageType;
        }
        this.isHurt = true;
        
        // Sound abspielen je nach Schadenstyp
        if (this.world && this.world.audioManager) {
            if (this.lastDamageType === 'electric') {
                this.world.audioManager.playElectricSound();
            } else {
                this.world.audioManager.playHurtSound();
            }
        }
        
        this.lastHitTime = Date.now();
        this.currentImage = 0;
        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
        }

        if (this.energy <= 0) {
            this.die();
            return;
        }
        
        setTimeout(() => {
            if (!this.isDead) {
                this.isHurt = false;
                this.currentImage = 0;
            }
        }, 500);
    }

    handleKeyboard() {
        setInterval(() => {
            if (this.isDead) {
                return;
            }
            let moved = false;
            if (window.keyboard && window.keyboard.RIGHT) {
                this.moveRight();
                this.otherDirection = false;
                moved = true;
            }
            if (window.keyboard && window.keyboard.LEFT) {
                this.moveLeft();
                this.otherDirection = true;
                moved = true;
            }
            if (window.keyboard && window.keyboard.UP) {
                this.moveUp();
                moved = true;
            }
            if (window.keyboard && window.keyboard.DOWN) {
                this.moveDown();
                moved = true;
            }
            if (window.keyboard && window.keyboard.D) {
                moved = true;
            }
            if (window.keyboard && window.keyboard.F) {
                moved = true;
            }
            if (window.keyboard && window.keyboard.SPACE) {
                moved = true;
            }

            // Merke den bisherigen Swim-Status
            const wasSwimming = this.isSwimming;
            
            // Setze Swim-Animation wenn sich der Hai bewegt 
            this.isSwimming = moved && !this.isAttacking && !this.isFinSlapping && !this.isHurt;

            if (moved) {
                this.lastActivity = Date.now();
                this.isLongIdle = false;
                // zurücksetzen wenn wir gerade ZU Schwimmen wechseln
                if (this.isSwimming && !wasSwimming) {
                    this.currentImage = 0;
                }
            } else {
                const idleTime = Date.now() - this.lastActivity;    
                if (idleTime > 5000) {
                    this.isLongIdle = true;
                } else {
                    this.isLongIdle = false;
                }
            }
            
            // Begrenzung der Hai darf nicht aus dem Bild schwimmen
            const mapWidth = this.world ? this.world.mapWidth : 960;
            const canvasHeight = this.world ? this.world.canvas.height : 540;
            const maxX = Math.max(0, mapWidth - this.width);
            const maxY = Math.max(0, canvasHeight - this.height);
            if (this.x < 0) {
                this.x = 0;
            }
            if (this.x > maxX) {
                this.x = maxX;
            }
            if (this.y < 0) {
                this.y = 0;
            }
            if (this.y > maxY) {
                this.y = maxY;
            }
        }, 1000 / 60);
    }

    jump() {

    }
}