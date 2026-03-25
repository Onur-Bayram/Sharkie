class FinalBoss extends MovableObject {
    IMAGES_FLOATING = FINAL_BOSS_IMAGES.FLOATING;
    IMAGES_INTRODUCE = FINAL_BOSS_IMAGES.INTRODUCE;
    IMAGES_ATTACK = FINAL_BOSS_IMAGES.ATTACK;
    IMAGES_HURT = FINAL_BOSS_IMAGES.HURT;
    IMAGES_DEAD = FINAL_BOSS_IMAGES.DEAD;
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
    stateStartedAt = 0;
    hurtUntil = 0;
    floatingSpeed = 0.5;
    floatingTargetX = 0;
    floatingTargetY = 0;
    swimStyle = 'aggressive'; // normal, aggressive, defensive, circle
    lastStyleChangeTime = 0;
    styleChangeDuration = 3000; 
    activityRadius = 900;
    attackRadius = 420;
    facingLeft = true;
    attackTargetX = 0;
    attackTargetY = 0;
    attackMoveSpeed = 8;

    /**
     * Creates the boss and starts animation and movement loops.
     *
     * @param {number} x Start position X.
     * @param {number} y Start position Y.
     * @returns {void}
     */
    constructor(x, y) {
        super();
        this.loadBossImages();
        this.initBossPosition(x, y);
        this.animate();
    }

    /**
     * Loads all image sequences for boss states.
     * @returns {void}
     */
    loadBossImages() {
        this.loadImage(this.IMAGES_INTRODUCE[0]);
        this.loadImages(this.IMAGES_INTRODUCE);
        this.loadImages(this.IMAGES_FLOATING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
    }

    /**
     * Initializes base position, size, and floating targets.
     *
     * @param {number} x Start position X.
     * @param {number} y Start position Y.
     * @returns {void}
     */
    initBossPosition(x, y) {
        this.x = x;
        this.y = y;
        this.width = 450;
        this.height = 450;
        this.speed = 0.5;
        this.floatingTargetX = x;
        this.floatingTargetY = y;
        this.lastStyleChangeTime = Date.now();
        this.stateStartedAt = Date.now();
    }

    /**
     * Starts animation and movement update loops.
     * @returns {void}
     */
    animate() {
        setInterval(() => this.updateAnimationFrame(), 150);
        setInterval(() => this.updateMovementFrame(), 1000 / 60);
    }

    /**
     * Updates current animation frame based on boss state.
     * @returns {void}
     */
    updateAnimationFrame() {
        if (world && world.isPaused) return;
        if (!this.canAnimateNow()) return;
        const images = this.getCurrentImages();
        if (this.renderDeadLastFrame(images)) return;
        this.playCurrentFrame(images);
        this.syncStateAfterFrame();
    }

    /**
     * Returns whether the boss should animate in the current frame.
     * @returns {boolean}
     */
    canAnimateNow() {
        if (this.state === 'introduce' && !this.hasStartedIntro) return false;
        // Let transient states finish even if the boss is briefly outside the active range.
        if (this.isDead || this.state === 'hurt' || this.state === 'attacking') return true;
        return this.isActive;
    }

    /**
     * Keeps the final death frame visible after death animation ends.
     *
     * @param {string[]} images Active image sequence.
     * @returns {boolean}
     */
    renderDeadLastFrame(images) {
        if (!this.isDead || !this.deadAnimationFinished) return false;
        this.img = this.imageCache[images[images.length - 1]];
        return true;
    }

    /**
     * Draws the next frame from the current animation sequence.
     *
     * @param {string[]} images Active image sequence.
     * @returns {void}
     */
    playCurrentFrame(images) {
        const path = images[this.currentImage % images.length];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Applies post-frame state transition checks.
     * @returns {void}
     */
    syncStateAfterFrame() {
        this.finishIntroIfNeeded();
        this.finishAttackIfNeeded();
        this.finishHurtIfNeeded();
        this.finishDeathIfNeeded();
    }

    /**
     * Ends intro and switches to floating state when intro frames are done.
     * @returns {void}
     */
    finishIntroIfNeeded() {
        if (this.state !== 'introduce' || this.currentImage < this.IMAGES_INTRODUCE.length) return;
        this.introduced = true;
        this.state = 'floating';
        this.currentImage = 0;
        this.stateStartedAt = Date.now();
    }

    /**
     * Ends attack and returns to floating state when attack frames finish.
     * @returns {void}
     */
    finishAttackIfNeeded() {
        if (this.state !== 'attacking' || this.currentImage < this.IMAGES_ATTACK.length) return;
        this.isAttacking = false;
        this.state = 'floating';
        this.currentImage = 0;
        this.stateStartedAt = Date.now();
    }

    /**
     * Ends hurt and returns to floating state when hurt frames finish.
     * @returns {void}
     */
    finishHurtIfNeeded() {
        if (this.state !== 'hurt' || this.currentImage < this.IMAGES_HURT.length) return;
        this.isHurt = false;
        this.state = 'floating';
        this.currentImage = 0;
        this.stateStartedAt = Date.now();
    }

    /**
     * Marks death animation as complete and pins last frame index.
     * @returns {void}
     */
    finishDeathIfNeeded() {
        if (!this.isDead || this.currentImage < this.IMAGES_DEAD.length) return;
        this.deadAnimationFinished = true;
        this.currentImage = this.IMAGES_DEAD.length - 1;
    }
}
 