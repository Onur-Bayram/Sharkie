Object.assign(Character.prototype, {
    canThrowNormalBubble() {
        const currentTime = Date.now();
        return !this.isDead && currentTime - this.lastThrowTime > 1200 && !this.isAttacking;
    },

    canThrowPoisonBubble() {
        const currentTime = Date.now();
        return !this.isDead && this.poison >= 30 && (currentTime - this.lastThrowTime > 1200) && !this.isAttacking;
    },

    throwNormalBubble() {
        if (this.canThrowNormalBubble()) {
            this.lastThrowTime = Date.now();
            this.isAttacking = true;
            this.currentImage = 0;

            const direction = this.otherDirection ? -1 : 1;
            const offsetX = this.otherDirection ? 0 : this.width;

            // Schiesse die Blase nach 800ms ab (nach der Animation).
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

            // Beende die Attack-Animation nach 800ms.
            setTimeout(() => {
                this.isAttacking = false;
                this.currentImage = 0;
            }, 800);

            return bubbleAnimation;
        }
        return null;
    },

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

            // Schiesse die Blase nach 800ms ab (nach der Animation).
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

            // Beende die Attack-Animation nach 800ms.
            setTimeout(() => {
                this.isAttacking = false;
                this.currentImage = 0;
            }, 800);

            return bubbleAnimation;
        }
        return null;
    },

    canThrowFinSlap() {
        const currentTime = Date.now();
        return !this.isDead && currentTime - this.lastThrowTime > 1200 && !this.isAttacking && !this.isFinSlapping;
    },

    throwFinSlap() {
        if (this.canThrowFinSlap()) {
            this.lastThrowTime = Date.now();
            this.isFinSlapping = true;
            this.currentImage = 0;

            const direction = this.otherDirection ? -1 : 1;
            const offsetX = this.otherDirection ? 0 : 120;

            // Erstelle Fin-Slap-Attacke nach 300ms (Mittelpunkt der Animation).
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

            // Beende die Fin-Slap-Animation nach 600ms.
            setTimeout(() => {
                this.isFinSlapping = false;
                this.currentImage = 0;
            }, 600);

            return finSlap;
        }
        return null;
    },

    getDeathImages() {
        return this.lastDamageType === 'electric'
            ? this.IMAGES_DEAD_ELECTRIC
            : this.IMAGES_DEAD_POISON;
    },

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

        // Blendet den Game-Over-Zustand ein und spielt den Fail-Sound.
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