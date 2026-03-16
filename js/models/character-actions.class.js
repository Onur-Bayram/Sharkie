Object.assign(Character.prototype, {
    /**
     * Prüft ob eine normale Blase geworfen werden darf (Cooldown und kein laufender Angriff).
     * @returns {boolean}
     */
    canThrowNormalBubble() {
        const currentTime = Date.now();
        return !this.isDead && currentTime - this.lastThrowTime > 1200 && !this.isAttacking;
    },

    /**
     * Prüft ob eine Giftblase geworfen werden darf (Cooldown, Giftvorrat ≥30 und kein laufender Angriff).
     * @returns {boolean}
     */
    canThrowPoisonBubble() {
        const currentTime = Date.now();
        return !this.isDead && this.poison >= 30 && (currentTime - this.lastThrowTime > 1200) && !this.isAttacking;
    },

    /**
     * Wirft eine normale Blase und startet die Angriffsanimation.
     * @returns {BubbleAnimation|null} Erstelle Animation oder null bei Cooldown.
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
     * Wirft eine Giftblase (kostet 30 Giftpunkte) und startet die Angriffsanimation.
     * @returns {BubbleAnimation|null} Erstelle Animation oder null bei Cooldown.
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
     * Prüft ob ein Flossenschlag ausgeführt werden darf.
     * @returns {boolean}
     */
    canThrowFinSlap() {
        const currentTime = Date.now();
        return !this.isDead && currentTime - this.lastThrowTime > 1200 && !this.isAttacking && !this.isFinSlapping;
    },

    /**
     * Führt einen Flossenschlag aus und erstellt das FinSlap-Projektil.
     * @returns {FinSlap|null} Das erstellte Projektil oder null bei Cooldown.
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
     * Gibt die passenden Sterbebilder abhängig vom letzten Schadenstyp zurück.
     * @returns {string[]}
     */
    getDeathImages() {
        return this.lastDamageType === 'electric'
            ? this.IMAGES_DEAD_ELECTRIC
            : this.IMAGES_DEAD_POISON;
    },

    /**
     * Leitet den Tod des Charakters ein, zeigt den Game-Over-Bildschirm und spielt den Fail-Sound ab.
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