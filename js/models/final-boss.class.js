/**
 * Final boss with intro, swimming, attack, damage, and death states.
 */
class FinalBoss extends MovableObject {

    IMAGES_FLOATING = [
        "2.Enemy/3 Final Enemy/2.floating/1.png",
        "2.Enemy/3 Final Enemy/2.floating/2.png",
        "2.Enemy/3 Final Enemy/2.floating/3.png",
        "2.Enemy/3 Final Enemy/2.floating/4.png",
        "2.Enemy/3 Final Enemy/2.floating/5.png",
        "2.Enemy/3 Final Enemy/2.floating/6.png",
        "2.Enemy/3 Final Enemy/2.floating/7.png",
        "2.Enemy/3 Final Enemy/2.floating/8.png",
        "2.Enemy/3 Final Enemy/2.floating/9.png",
        "2.Enemy/3 Final Enemy/2.floating/10.png",
        "2.Enemy/3 Final Enemy/2.floating/11.png",
        "2.Enemy/3 Final Enemy/2.floating/12.png",
        "2.Enemy/3 Final Enemy/2.floating/13.png"
    ];

    IMAGES_INTRODUCE = [
        "2.Enemy/3 Final Enemy/1.Introduce/1.png",
        "2.Enemy/3 Final Enemy/1.Introduce/2.png",
        "2.Enemy/3 Final Enemy/1.Introduce/3.png",
        "2.Enemy/3 Final Enemy/1.Introduce/4.png",
        "2.Enemy/3 Final Enemy/1.Introduce/5.png",
        "2.Enemy/3 Final Enemy/1.Introduce/6.png",
        "2.Enemy/3 Final Enemy/1.Introduce/7.png",
        "2.Enemy/3 Final Enemy/1.Introduce/8.png",
        "2.Enemy/3 Final Enemy/1.Introduce/9.png",
        "2.Enemy/3 Final Enemy/1.Introduce/10.png"
    ];

    IMAGES_ATTACK = [
        "2.Enemy/3 Final Enemy/Attack/1.png",
        "2.Enemy/3 Final Enemy/Attack/2.png",
        "2.Enemy/3 Final Enemy/Attack/3.png",
        "2.Enemy/3 Final Enemy/Attack/4.png",
        "2.Enemy/3 Final Enemy/Attack/5.png",
        "2.Enemy/3 Final Enemy/Attack/6.png"
    ];

    IMAGES_HURT = [
        "2.Enemy/3 Final Enemy/Hurt/1.png",
        "2.Enemy/3 Final Enemy/Hurt/2.png",
        "2.Enemy/3 Final Enemy/Hurt/3.png",
        "2.Enemy/3 Final Enemy/Hurt/4.png"
    ];

    IMAGES_DEAD = [
        "2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2.png",
        "2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 6.png",
        "2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 7.png",
        "2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 8.png",
        "2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 9.png",
        "2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 10.png"
    ];

    introduced = false;
    maxHp = 1000;
    hp = 1000;
    isDead = false;
    isVisible = false;
    isActive = false;
    hasStartedIntro = false;
    isHurt = false;
    isAttacking = false;
    lastAttackTime = 0;
    deadAnimationFinished = false;
    state = 'introduce'; // introduce, floating, attacking, hurt, dead
    floatingSpeed = 0.5;
    floatingTargetX = 0;
    floatingTargetY = 0;
    swimStyle = 'aggressive'; // normal, aggressive, defensive, circle
    lastStyleChangeTime = 0;
    styleChangeDuration = 3000; // 3 Sekunden pro Stil
    activityRadius = 900;
    attackRadius = 900;

    /**
     * @param {number} x Startposition auf der X-Achse.
     * @param {number} y Startposition auf der Y-Achse.
     */
    constructor(x, y) {
        super();
        this.loadBossImages();
        this.initBossPosition(x, y);
        this.animate();
    }

    loadBossImages() {
        this.loadImage(this.IMAGES_INTRODUCE[0]);
        this.loadImages(this.IMAGES_INTRODUCE);
        this.loadImages(this.IMAGES_FLOATING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
    }

    initBossPosition(x, y) {
        this.x = x;
        this.y = y;
        this.width = 450;
        this.height = 450;
        this.speed = 0.5;
        this.floatingTargetX = x;
        this.floatingTargetY = y;
        this.lastStyleChangeTime = Date.now();
    }

    /**
     * Starts animation and movement loops of the boss.
     *
     * @returns {void}
     */
    animate() {
        setInterval(() => this.updateAnimationFrame(), 150);
        setInterval(() => this.updateMovementFrame(), 1000 / 60);
    }

    updateAnimationFrame() {
        if (!this.canAnimateNow()) return;
        const images = this.getCurrentImages();
        if (this.renderDeadLastFrame(images)) return;
        this.playCurrentFrame(images);
        this.syncStateAfterFrame();
    }

    canAnimateNow() {
        if (!this.isActive) return false;
        if (this.state === 'introduce' && !this.hasStartedIntro) return false;
        return true;
    }

    renderDeadLastFrame(images) {
        if (!this.isDead || !this.deadAnimationFinished) return false;
        this.img = this.imageCache[images[images.length - 1]];
        return true;
    }

    playCurrentFrame(images) {
        const path = images[this.currentImage % images.length];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    syncStateAfterFrame() {
        this.finishIntroIfNeeded();
        this.finishAttackIfNeeded();
        this.finishHurtIfNeeded();
        this.finishDeathIfNeeded();
    }

    finishIntroIfNeeded() {
        if (this.state !== 'introduce' || this.currentImage < this.IMAGES_INTRODUCE.length) return;
        this.introduced = true;
        this.state = 'floating';
        this.currentImage = 0;
    }

    finishAttackIfNeeded() {
        if (this.state !== 'attacking' || this.currentImage < this.IMAGES_ATTACK.length) return;
        this.isAttacking = false;
        this.state = 'floating';
        this.currentImage = 0;
    }

    finishHurtIfNeeded() {
        if (this.state !== 'hurt' || this.currentImage < this.IMAGES_HURT.length) return;
        this.isHurt = false;
        this.state = 'floating';
        this.currentImage = 0;
    }

    finishDeathIfNeeded() {
        if (!this.isDead || this.currentImage < this.IMAGES_DEAD.length) return;
        this.deadAnimationFinished = true;
        this.currentImage = this.IMAGES_DEAD.length - 1;
    }

    updateMovementFrame() {
        if (!this.isActive || !this.introduced || this.isDead) return;
        this.updateFloatingBehavior();
    }

    /**
     * Returns the image sequence appropriate to the current boss state.
     *
     * @returns {string[]}
     */
    getCurrentImages() {
        if (this.isDead) {
            return this.IMAGES_DEAD;
        }
        if (this.state === 'introduce') {
            return this.IMAGES_INTRODUCE;
        }
        if (this.state === 'attacking') {
            return this.IMAGES_ATTACK;
        }
        if (this.state === 'hurt') {
            return this.IMAGES_HURT;
        }
        return this.IMAGES_FLOATING;
    }

    /**
     * Updates swimming style and movement of the boss.
     *
     * @returns {void}
     */
    updateFloatingBehavior() {
        if (this.isAttacking || this.isHurt) return;
        this.updateSwimStyle();
        this.updateFloatingSpeed();
        this.applyMovement();
    }

    updateSwimStyle() {
        const currentTime = Date.now();
        if (currentTime - this.lastStyleChangeTime <= this.styleChangeDuration) return;
        const styles = ['aggressive', 'aggressive', 'aggressive', 'normal', 'circle'];
        this.swimStyle = styles[Math.floor(Math.random() * styles.length)];
        this.lastStyleChangeTime = currentTime;
    }

    updateFloatingSpeed() {
        if (this.swimStyle === 'aggressive') this.floatingSpeed = 5.5;
        else if (this.swimStyle === 'defensive') this.floatingSpeed = 3.5;
        else if (this.swimStyle === 'circle') this.floatingSpeed = 4.8;
        else this.floatingSpeed = 3.8;
    }

    /**
     * Moves the boss based on current swimming style and character position.
     *
     * @returns {void}
     */
    applyMovement() {
        if (!this.character) {
            this.applyIdleDriftMovement();
            return;
        }
        const vector = this.getCharacterVector();
        this.applyStyleMovement(vector);
        this.clampPositionToBossArea();
    }

    applyIdleDriftMovement() {
        const direction = Math.random() > 0.5 ? 1 : -1;
        this.y += this.floatingSpeed * 2.5 * direction;
    }

    getCharacterVector() {
        const distX = this.character.x - this.x;
        const distY = this.character.y - this.y;
        const distance = Math.sqrt(distX * distX + distY * distY);
        return { distX, distY, distance };
    }

    applyStyleMovement(vector) {
        if (this.swimStyle === 'aggressive') this.applyAggressiveMovement(vector);
        else if (this.swimStyle === 'defensive') this.applyDefensiveMovement(vector);
        else if (this.swimStyle === 'circle') this.applyCircleMovement(vector);
        else this.applyNormalMovement(vector);
    }

    applyAggressiveMovement(vector) {
        if (vector.distance <= 50) return;
        this.x += (vector.distX / vector.distance) * this.floatingSpeed;
        this.y += (vector.distY / vector.distance) * this.floatingSpeed;
    }

    applyDefensiveMovement(vector) {
        if (vector.distance < 800) {
            this.x -= (vector.distX / vector.distance) * this.floatingSpeed;
            this.y -= (vector.distY / vector.distance) * this.floatingSpeed;
            return;
        }
        this.x += (vector.distX / vector.distance) * this.floatingSpeed * 1.7;
    }

    applyCircleMovement(vector) {
        const angle = Math.atan2(vector.distY, vector.distX);
        const desiredDistance = 600;
        this.floatingTargetX = this.character.x + Math.cos(angle + 0.05) * desiredDistance;
        this.floatingTargetY = this.character.y + Math.sin(angle + 0.05) * desiredDistance;
        this.moveToFloatingTarget();
    }

    moveToFloatingTarget() {
        const targetDistX = this.floatingTargetX - this.x;
        const targetDistY = this.floatingTargetY - this.y;
        const targetDist = Math.sqrt(targetDistX * targetDistX + targetDistY * targetDistY);
        if (targetDist <= 10) return;
        this.x += (targetDistX / targetDist) * this.floatingSpeed;
        this.y += (targetDistY / targetDist) * this.floatingSpeed;
    }

    applyNormalMovement(vector) {
        if (vector.distance > 400) {
            this.x += (vector.distX / vector.distance) * this.floatingSpeed * 1.8;
            this.y += (vector.distY / vector.distance) * this.floatingSpeed * 1.8;
            return;
        }
        if (vector.distance < 300) {
            this.x -= (vector.distX / vector.distance) * this.floatingSpeed * 1.6;
            this.y -= (vector.distY / vector.distance) * this.floatingSpeed * 1.6;
        }
    }

    clampPositionToBossArea() {
        const mapBounds = 6720;
        if (this.x < 4800) this.x = 4800;
        if (this.x > mapBounds - this.width) this.x = mapBounds - this.width;
        if (this.y < 50) this.y = 50;
        if (this.y > 540 - this.height) this.y = 540 - this.height;
    }

    /**
     * Checks if the boss is close enough for an attack.
     *
     * @param {Character} character Player character.
     * @returns {void}
     */
    checkProximityAttack(character) {
        this.character = character;
        
        if (this.isDead || !this.isActive || !this.introduced || this.isAttacking || this.isHurt) {
            return;
        }

        const distance = Math.abs(this.x - character.x);
        const currentTime = Date.now();
        
        
        if (distance < this.attackRadius && currentTime - this.lastAttackTime > 3000) {
            this.attack();
        }
    }

    /**
     * Puts the boss in attack state.
     *
     * @returns {void}
     */
    attack() {
        this.isAttacking = true;
        this.state = 'attacking';
        this.currentImage = 0;
        this.lastAttackTime = Date.now();
    }

    /**
     * Deals damage to the boss and switches to hurt or dead state if needed.
     *
     * @param {number} damage Damage amount.
     * @returns {void}
     */
    hit(damage) {
        if (this.isDead) return;
        if (!this.introduced || this.state === 'introduce') return;
        this.hp -= damage;
        if (this.hp <= 0) {
            this.hp = 0;
            this.die();
        } else {
            this.applyBossHurt();
        }
    }

    applyBossHurt() {
        this.isHurt = true;
        this.state = 'hurt';
        this.currentImage = 0;
    }

    /**
     * Starts the death animation of the boss.
     *
     * @returns {void}
     */
    die() {
        if (this.isDead) {
            return;
        }
        this.isDead = true;
        this.state = 'dead';
        this.currentImage = 0;
        this.deadAnimationFinished = false;
    }

    /**
     * Updates visibility and activity of the boss relative to the camera.
     *
     * @param {number} cameraX Current camera X-position.
     * @param {number} [canvasWidth=960] Width of the visible area.
     * @returns {void}
     */
    checkVisibility(cameraX, canvasWidth = 960) {
        const bossRightEdge = this.x + this.width;
        const cameraRight = cameraX + canvasWidth;
        const activityPuffer = this.activityRadius;

        this.isActive = bossRightEdge > cameraX - activityPuffer && this.x < cameraRight + activityPuffer;
        this.isVisible = bossRightEdge > cameraX && this.x < cameraRight;
        
        if (!this.hasStartedIntro && this.isVisible) {
            this.hasStartedIntro = true;
            this.currentImage = 0;
        }
    }
}

