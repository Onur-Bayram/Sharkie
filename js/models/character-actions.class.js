Object.assign(Character.prototype, {
    /**
     * Checks if a normal bubble can be thrown (cooldown and no current attack).
     * @returns {boolean}
     */
    canThrowNormalBubble() {
        const currentTime = Date.now();
        return !this.isDead && currentTime - this.lastThrowTime > 1200 && !this.isAttacking;
    },

    /**
     * Checks if a poison bubble can be thrown (cooldown, enough poison and no current attack).
     * @returns {boolean}
     */
    canThrowPoisonBubble() {
        const currentTime = Date.now();
        return !this.isDead && this.poison >= this.poisonPerShot && (currentTime - this.lastThrowTime > 1200) && !this.isAttacking;
    },

    /**
     * Throws a normal bubble and starts the attack animation.
     * @returns {void}
     */
    throwNormalBubble() {
        if (!this.canThrowNormalBubble()) return;
        this.lastThrowTime = Date.now();
        this.startAttackState();
        const direction = this.otherDirection ? -1 : 1;
        const offsetX = this.otherDirection ? 0 : this.width;
        this.scheduleNormalBubble(offsetX, direction);
        this.scheduleAttackReset(800);
    },

    /**
     * Schedules normal bubble.
     * @param {any} offsetX Parameter.
     * @param {any} direction Parameter.
     * @returns {void} Return value.
     */
    scheduleNormalBubble(offsetX, direction) {
        setTimeout(() => {
            const bubble = new BubbleAnimation(this.x + offsetX, this.y + 50, direction, false);
            this.registerBubbleInWorld(bubble, false);
        }, 800);
    },

    /**
     * Registers bubble in world.
     * @param {any} bubble Parameter.
     * @param {any} isPoison Parameter.
     * @returns {void} Return value.
     */
    registerBubbleInWorld(bubble, isPoison) {
        if (!this.world) return;
        this.world.bubbleAnimations.push(bubble);
        if (!this.world.audioManager) return;
        if (isPoison) this.world.audioManager.playPoisonShootSound();
        else this.world.audioManager.playBubbleShootSound();
    },

    /**
     * Schedules attack reset.
     * @param {any} delay Parameter.
     * @returns {void} Return value.
     */
    scheduleAttackReset(delay) {
        setTimeout(() => {
            this.isAttacking = false;
            this.currentImage = 0;
        }, delay);
    },

    /**
     * Starts attack state.
     * @returns {void} Return value.
     */
    startAttackState() {
        this.isAttacking = true;
        this.currentImage = 0;
    },

    /**
        * Throws a poison bubble (costs poisonPerShot points) and starts the attack animation.
     * @returns {void}
     */
    throwPoisonBubble() {
        if (!this.canThrowPoisonBubble()) return;
        this.lastThrowTime = Date.now();
        this.deductPoison();
        this.startAttackState();
        const direction = this.otherDirection ? -1 : 1;
        const offsetX = this.otherDirection ? 0 : this.width;
        this.schedulePoisonBubble(offsetX, direction);
        this.scheduleAttackReset(800);
    },

    /**
     * Deducts poison.
     * @returns {void} Return value.
     */
    deductPoison() {
        this.poison = Math.max(0, this.poison - this.poisonPerShot);
    },

    /**
     * Schedules poison bubble.
     * @param {any} offsetX Parameter.
     * @param {any} direction Parameter.
     * @returns {void} Return value.
     */
    schedulePoisonBubble(offsetX, direction) {
        setTimeout(() => {
            const bubble = new BubbleAnimation(this.x + offsetX, this.y + 50, direction, true);
            this.registerBubbleInWorld(bubble, true);
        }, 800);
    },

    /**
     * Checks if a fin slap can be executed.
     * @returns {boolean}
     */
    canThrowFinSlap() {
        const currentTime = Date.now();
        return !this.isDead && currentTime - this.lastThrowTime > 1200 && !this.isAttacking && !this.isFinSlapping;
    },

    /**
     * Executes a fin slap and creates the FinSlap projectile.
     * @returns {void}
     */
    throwFinSlap() {
        if (!this.canThrowFinSlap()) return;
        this.lastThrowTime = Date.now();
        this.isFinSlapping = true;
        this.currentImage = 0;
        const direction = this.otherDirection ? -1 : 1;
        const offsetX = this.otherDirection ? 0 : 120;
        this.scheduleFinSlap(offsetX, direction);
        this.scheduleFinSlapReset(600);
    },

    /**
     * Schedules fin slap.
     * @param {any} offsetX Parameter.
     * @param {any} direction Parameter.
     * @returns {void} Return value.
     */
    scheduleFinSlap(offsetX, direction) {
        setTimeout(() => {
            const finSlap = new FinSlap(this.x + offsetX, this.y + 50, direction);
            if (this.world) {
                this.world.finSlaps.push(finSlap);
                if (this.world.audioManager) this.world.audioManager.playFinSlapSound();
            }
        }, 300);
    },

    /**
     * Schedules fin slap reset.
     * @param {any} delay Parameter.
     * @returns {void} Return value.
     */
    scheduleFinSlapReset(delay) {
        setTimeout(() => {
            this.isFinSlapping = false;
            this.currentImage = 0;
        }, delay);
    },

    /**
     * Returns the appropriate death images based on the last damage type.
     * @returns {string[]}
     */
    getDeathImages() {
        return this.lastDamageType === 'electric'
            ? this.IMAGES_DEAD_ELECTRIC
            : this.IMAGES_DEAD_POISON;
    },

    /**
     * Initiates the character's death, displays the game-over screen and plays the fail sound.
     * @returns {void}
     */
    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.isHurt = false;
        this.isAttacking = false;
        this.isFinSlapping = false;
        this.currentImage = 0;
        this.deadAnimationFinished = false;
        this.triggerDeathScreens();
    },

    /**
     * Triggers death screens.
     * @returns {void} Return value.
     */
    triggerDeathScreens() {
        if (this.world && this.world.gameOverScreen) {
            this.world.gameOverScreen.show(this.world.audioManager);
        }
        if (this.world && this.world.restartButton) {
            this.world.restartButton.show();
        }
        if (this.world && this.world.audioManager) {
            this.world.audioManager.playFailSound();
        }
    }
});
