/**
 * Player character model for Sharkie.
 * Handles animation state, input-driven movement, combat states, and world bounds.
 */
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
    poisonPerShot = 20;
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
        this.loadCharacterImages();
        this.initCharacterSize();
        this.animate();
        this.handleKeyboard();
    }

    loadCharacterImages() {
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
    }

    initCharacterSize() {
        this.width = 200;
        this.height = 140;
        this.speed = 5;
    }

    animate() {
        setInterval(() => this.updateAnimationFrame(), 100);
    }

    updateAnimationFrame() {
        if (this.renderDeathFrame()) {
            return;
        }
        if (this.isLongIdle) {
            this.renderLongIdleFrame();
            return;
        }
        this.playImageSequence(this.getCurrentActionImages());
    }

    renderDeathFrame() {
        if (!this.isDead) return false;
        const images = this.getDeathImages();
        if (this.deadAnimationFinished) {
            this.img = this.imageCache[images[images.length - 1]];
            return true;
        }
        this.advanceDeathFrame(images);
        return true;
    }

    advanceDeathFrame(images) {
        this.playImageSequence(images);
        if (this.currentImage >= images.length) {
            this.deadAnimationFinished = true;
            this.currentImage = images.length - 1;
        }
    }

    renderLongIdleFrame() {
        let path = '';
        if (this.currentImage < this.IMAGES_LONG_IDLE.length) {
            path = this.IMAGES_LONG_IDLE[this.currentImage];
        } else {
            const sleepIndex = (this.currentImage - this.IMAGES_LONG_IDLE.length) % this.IMAGES_SLEEP_LOOP.length;
            path = this.IMAGES_SLEEP_LOOP[sleepIndex];
        }
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    getCurrentActionImages() {
        if (this.isHurt) {
            return this.lastDamageType === 'electric' ? this.IMAGES_HURT : this.IMAGES_HURT_POISON;
        }
        if (this.isFinSlapping) {
            return this.IMAGES_FIN_SLAP;
        }
        if (this.isAttacking) {
            return this.IMAGES_ATTACK;
        }
        if (this.isSwimming) {
            return this.IMAGES_SWIM;
        }
        return this.IMAGES_IDLE;
    }

    playImageSequence(images) {
        const path = images[this.currentImage % images.length];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    hit(damageType, damage = 10) {
        if (this.shouldIgnoreHit()) {
            return;
        }
        this.applyHitType(damageType);
        this.startHurtState();
        this.playHitSound();
        this.applyDamage(damage);
        if (this.energy <= 0) {
            this.die();
            return;
        }
        this.scheduleHurtRecovery();
    }

    shouldIgnoreHit() {
        if (this.isDead) {
            return true;
        }
        if (this.energy > 0) {
            return false;
        }
        this.die();
        return true;
    }

    applyHitType(damageType) {
        if (damageType) {
            this.lastDamageType = damageType;
        }
    }

    startHurtState() {
        this.isHurt = true;
        this.lastHitTime = Date.now();
        this.currentImage = 0;
    }

    playHitSound() {
        if (!this.world || !this.world.audioManager) {
            return;
        }
        if (this.lastDamageType === 'electric') {
            this.world.audioManager.playElectricSound();
            return;
        }
        this.world.audioManager.playHurtSound();
    }

    applyDamage(damage) {
        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
        }
    }

    scheduleHurtRecovery() {
        setTimeout(() => {
            if (this.isDead) {
                return;
            }
            this.isHurt = false;
            this.currentImage = 0;
        }, 500);
    }

    handleKeyboard() {
        setInterval(() => this.updateMovementFromInput(), 1000 / 60);
    }

    updateMovementFromInput() {
        if (this.isDead) {
            return;
        }
        let moved = this.applyDirectionalInput();
        moved = moved || this.isActionInputActive();
        this.updateSwimmingState(moved);
        this.updateIdleState(moved);
        this.clampToWorldBounds();
    }

    applyDirectionalInput() {
        let moved = false;
        if (window.keyboard && window.keyboard.RIGHT) { this.moveRight(); this.otherDirection = false; moved = true; }
        if (window.keyboard && window.keyboard.LEFT) { this.moveLeft(); this.otherDirection = true; moved = true; }
        if (window.keyboard && window.keyboard.UP) { this.moveUp(); moved = true; }
        if (window.keyboard && window.keyboard.DOWN) { this.moveDown(); moved = true; }
        return moved;
    }

    isActionInputActive() {
        return !!(window.keyboard && (window.keyboard.D || window.keyboard.F || window.keyboard.SPACE));
    }

    updateSwimmingState(moved) {
        const wasSwimming = this.isSwimming;
        this.isSwimming = moved && !this.isAttacking && !this.isFinSlapping && !this.isHurt;
        if (this.isSwimming && !wasSwimming) {
            this.currentImage = 0;
        }
    }

    updateIdleState(moved) {
        if (moved) {
            this.lastActivity = Date.now();
            this.isLongIdle = false;
            return;
        }
        const idleTime = Date.now() - this.lastActivity;
        this.isLongIdle = idleTime > 5000;
    }

    clampToWorldBounds() {
        const mapWidth = this.world && Number.isFinite(this.world.mapWidth) ? this.world.mapWidth : 960;
        const rawGameHeight = this.world && Number.isFinite(this.world.GAME_HEIGHT) ? this.world.GAME_HEIGHT : 540;
        const canvasHeight = Number.isFinite(rawGameHeight) && rawGameHeight > 0 ? rawGameHeight : 540;
        if (this.world && !this.world.bossLevelLocked && this.x >= this.world.bossZoneStart) {
            this.world.bossLevelLocked = true;
        }
        const minX = this.world && this.world.bossLevelLocked ? this.world.bossZoneStart : 0;
        const maxX = Math.max(0, mapWidth - this.width);
        const maxY = Math.max(0, canvasHeight - this.height);
        if (this.x < minX) { this.x = minX; }
        if (this.x > maxX) { this.x = maxX; }
        if (this.y < 0) { this.y = 0; }
        if (this.y > maxY) { this.y = maxY; }
    }

}

