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
     * Checks if a poison bubble can be thrown (cooldown, poison supply ≥30 and no current attack).
     * @returns {boolean}
     */
    canThrowPoisonBubble() {
        const currentTime = Date.now();
        return !this.isDead && this.poison >= 30 && (currentTime - this.lastThrowTime > 1200) && !this.isAttacking;
    },

    /**
     * Throws a normal bubble and starts the attack animation.
     * @returns {BubbleAnimation|null} Created animation or null on cooldown.
     */
    throwNormalBubble() {
        if (this.canThrowNormalBubble()) {
            this.lastThrowTime = Date.now();
            this.isAttacking = true;
            this.currentImage = 0;

            const direction = this.otherDirection ? -1 : 1;
            const offsetX = this.otherDirection ? 0 : this.width;
            let bubbleAnimation = null;
            setTimeout(() => {
                bubbleAnimation = new BubbleAnimation(this.x + offsetX, this.y + 50, direction, false);
                if (this.world) {
                    this.world.bubbleAnimations.push(bubbleAnimation);
                    if (this.world.audioManager) {
                        this.world.audioManager.playBubbleShootSound();
                    }
                }
            }, 800);
            setTimeout(() => {
                this.isAttacking = false;
                this.currentImage = 0;
            }, 800);

            return bubbleAnimation;
        }
        return null;
    },

    /**
     * Throws a poison bubble (costs 30 poison points) and starts the attack animation.
     * @returns {BubbleAnimation|null} Created animation or null on cooldown.
     */
    throwPoisonBubble() {
        if (this.canThrowPoisonBubble()) {
            this.lastThrowTime = Date.now();
            this.poison -= 30;
            if (this.poison < 0) {
                this.poison = 0;
            }
            this.isAttacking = true;
            this.currentImage = 0;

            const direction = this.otherDirection ? -1 : 1;
            const offsetX = this.otherDirection ? 0 : this.width;
            let bubbleAnimation = null;
            setTimeout(() => {
                bubbleAnimation = new BubbleAnimation(this.x + offsetX, this.y + 50, direction, true);
                if (this.world) {
                    this.world.bubbleAnimations.push(bubbleAnimation);
                    if (this.world.audioManager) {
                        this.world.audioManager.playPoisonShootSound();
                    }
                }
            }, 800);
            setTimeout(() => {
                this.isAttacking = false;
                this.currentImage = 0;
            }, 800);

            return bubbleAnimation;
        }
        return null;
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
     * @returns {FinSlap|null} The created projectile or null on cooldown.
     */
    throwFinSlap() {
        if (this.canThrowFinSlap()) {
            this.lastThrowTime = Date.now();
            this.isFinSlapping = true;
            this.currentImage = 0;

            const direction = this.otherDirection ? -1 : 1;
            const offsetX = this.otherDirection ? 0 : 120;
            let finSlap = null;
            setTimeout(() => {
                finSlap = new FinSlap(this.x + offsetX, this.y + 50, direction);
                if (this.world) {
                    this.world.finSlaps.push(finSlap);
                    if (this.world.audioManager) {
                        this.world.audioManager.playFinSlapSound();
                    }
                }
            }, 300);
            setTimeout(() => {
                this.isFinSlapping = false;
                this.currentImage = 0;
            }, 600);

            return finSlap;
        }
        return null;
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
        if (this.isDead) {
            return;
        }
        this.isDead = true;
        this.isHurt = false;
        this.isAttacking = false;
        this.isFinSlapping = false;
        this.currentImage = 0;
        this.deadAnimationFinished = false;
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