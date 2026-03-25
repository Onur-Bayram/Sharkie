/**
 * Final Boss movement behavior mixin.
 * Extends FinalBoss prototype with movement, targeting, and floating AI logic.
 */
Object.assign(FinalBoss.prototype, {
    /**
     * Updates movement and handles attack dash separately.
     * @returns {void}
     */
    updateMovementFrame() {
        if (world && world.isPaused) return;
        this.recoverStuckTransientState();
        if (!this.isActive || !this.introduced || this.isDead) return;
        if (this.state === 'attacking') {
            this.updateAttackMovement();
            return;
        }
        this.updateFloatingBehavior();
    },

    /**
     * Moves the boss toward the current attack target during dash state.
     * @returns {void}
     */
    updateAttackMovement() {
        const distX = this.attackTargetX - this.x;
        const distY = this.attackTargetY - this.y;
        const distance = Math.max(Math.sqrt(distX * distX + distY * distY), 0.001);
        if (distance > 10) {
            this.x += (distX / distance) * this.attackMoveSpeed;
            this.y += (distY / distance) * this.attackMoveSpeed;
        }
        this.updateFacingDirectionFromX(distX);
        this.clampPositionToBossArea();
    },

    /**
     * Recovers from stale transient states and sanitizes invalid coordinates.
     * @returns {void}
     */
    recoverStuckTransientState() {
        const now = Date.now();
        this.recoverStuckHurt(now);
        this.recoverStuckAttack(now);
        this.isHurt = this.state === 'hurt';
        this.isAttacking = this.state === 'attacking';
        this.sanitizeBossCoordinates(now);
    },

    /**
     * Resets hurt state if it lasted beyond the allowed duration.
     *
     * @param {number} now Current timestamp.
     * @returns {void}
     */
    recoverStuckHurt(now) {
        if (this.state !== 'hurt') return;
        if (now >= this.hurtUntil || now - this.stateStartedAt > 1200) {
            this.isHurt = false;
            this.state = 'floating';
            this.currentImage = 0;
            this.stateStartedAt = now;
        }
    },

    /**
     * Resets attacking state if it lasted beyond the allowed duration.
     *
     * @param {number} now Current timestamp.
     * @returns {void}
     */
    recoverStuckAttack(now) {
        if (this.state !== 'attacking') return;
        if (now - this.stateStartedAt > 1800) {
            this.isAttacking = false;
            this.state = 'floating';
            this.currentImage = 0;
            this.stateStartedAt = now;
        }
    },

    /**
     * Resets position and state if coordinates are non-finite.
     *
     * @param {number} now Current timestamp.
     * @returns {void}
     */
    sanitizeBossCoordinates(now) {
        if (Number.isFinite(this.x) && Number.isFinite(this.y)) return;
        this.x = 6000;
        this.y = 80;
        this.state = 'floating';
        this.isHurt = false;
        this.isAttacking = false;
        this.currentImage = 0;
        this.stateStartedAt = now;
    },

    /**
     * Returns the sprite sequence that matches the current boss state.
     * @returns {string[]}
     */
    getCurrentImages() {
        if (this.isDead) return this.IMAGES_DEAD;
        if (this.state === 'introduce') return this.IMAGES_INTRODUCE;
        if (this.state === 'attacking') return this.IMAGES_ATTACK;
        if (this.state === 'hurt') return this.IMAGES_HURT;
        return this.IMAGES_FLOATING;
    },

    /**
     * Updates floating AI state and movement while not attacking/hurt.
     * @returns {void}
     */
    updateFloatingBehavior() {
        if (this.isAttacking || this.isHurt) return;
        this.updateSwimStyle();
        this.updateFloatingSpeed();
        this.applyMovement();
    },

    /**
     * Switches swim style at a fixed interval for varied boss behavior.
     * @returns {void}
     */
    updateSwimStyle() {
        const currentTime = Date.now();
        if (currentTime - this.lastStyleChangeTime <= this.styleChangeDuration) return;
        const styles = ['aggressive', 'aggressive', 'aggressive', 'normal', 'circle'];
        this.swimStyle = styles[Math.floor(Math.random() * styles.length)];
        this.lastStyleChangeTime = currentTime;
    },

    /**
     * Derives movement speed from the currently active swim style.
     * @returns {void}
     */
    updateFloatingSpeed() {
        if (this.swimStyle === 'aggressive') this.floatingSpeed = 2.8;
        else if (this.swimStyle === 'defensive') this.floatingSpeed = 1.9;
        else if (this.swimStyle === 'circle') this.floatingSpeed = 2.3;
        else this.floatingSpeed = 2.1;
    },

    /**
     * Applies movement relative to character position or idle drift fallback.
     * @returns {void}
     */
    applyMovement() {
        if (!this.character || !Number.isFinite(this.character.x) || !Number.isFinite(this.character.y)) {
            this.applyIdleDriftMovement();
            return;
        }
        const vector = this.getCharacterVector();
        this.updateFacingDirectionFromX(vector.distX);
        this.applyStyleMovement(vector);
        this.clampPositionToBossArea();
    },

    /**
     * Updates facing direction based on horizontal distance to the target.
     *
     * @param {number} distX Horizontal distance to target.
     * @returns {void}
     */
    updateFacingDirectionFromX(distX) {
        if (Math.abs(distX) < 2) return;
        this.facingLeft = distX < 0;
    },

    /**
     * Applies a simple vertical idle drift when no character target is valid.
     * @returns {void}
     */
    applyIdleDriftMovement() {
        const direction = Math.random() > 0.5 ? 1 : -1;
        this.y += this.floatingSpeed * 0.9 * direction;
    },

    /**
     * Builds normalized distance data from boss to character.
     * @returns {{distX: number, distY: number, distance: number}}
     */
    getCharacterVector() {
        const distX = this.character.x - this.x;
        const distY = this.character.y - this.y;
        const distance = Math.max(Math.sqrt(distX * distX + distY * distY), 0.001);
        return { distX, distY, distance };
    },

    /**
     * Selects movement logic based on swim style.
     *
     * @param {{distX: number, distY: number, distance: number}} vector Movement vector.
     * @returns {void}
     */
    applyStyleMovement(vector) {
        if (this.swimStyle === 'aggressive') this.applyAggressiveMovement(vector);
        else if (this.swimStyle === 'defensive') this.applyDefensiveMovement(vector);
        else if (this.swimStyle === 'circle') this.applyCircleMovement(vector);
        else this.applyNormalMovement(vector);
        this.applyVerticalTracking(vector);
    },

    /**
     * Adds vertical tracking so the boss keeps pressure on player altitude.
     *
     * @param {{distX: number, distY: number, distance: number}} vector Movement vector.
     * @returns {void}
     */
    applyVerticalTracking(vector) {
        const verticalDistance = Math.abs(vector.distY);
        if (verticalDistance < 20) return;
        const upwardBoost = vector.distY < 0 ? 1.35 : 1;
        const verticalStep = Math.min(this.floatingSpeed * 1.2 * upwardBoost, verticalDistance * 0.26);
        this.y += Math.sign(vector.distY) * verticalStep;
    },

    /**
     * Aggressive style: pressure the player with close-range pursuit and wobble.
     *
     * @param {{distX: number, distY: number, distance: number}} vector Movement vector.
     * @returns {void}
     */
    applyAggressiveMovement(vector) {
        const desiredDistance = 220;
        if (vector.distance < desiredDistance) {
            this.x -= (vector.distX / vector.distance) * this.floatingSpeed * 0.9;
            this.y -= (vector.distY / vector.distance) * this.floatingSpeed * 0.6;
            return;
        }
        const wobble = Math.sin(Date.now() * 0.01) * 0.8;
        this.x += (vector.distX / vector.distance) * this.floatingSpeed;
        this.y += (vector.distY / vector.distance) * this.floatingSpeed + wobble;
    },

    /**
     * Defensive style: retreat at short range and re-approach from distance.
     *
     * @param {{distX: number, distY: number, distance: number}} vector Movement vector.
     * @returns {void}
     */
    applyDefensiveMovement(vector) {
        if (vector.distance < 800) {
            this.x -= (vector.distX / vector.distance) * this.floatingSpeed;
            this.y -= (vector.distY / vector.distance) * this.floatingSpeed;
            return;
        }
        this.x += (vector.distX / vector.distance) * this.floatingSpeed * 1.1;
    },

    /**
     * Circle style: orbit around the character using a moving target point.
     *
     * @param {{distX: number, distY: number, distance: number}} vector Movement vector.
     * @returns {void}
     */
    applyCircleMovement(vector) {
        const angle = Math.atan2(vector.distY, vector.distX);
        const desiredDistance = 600;
        this.floatingTargetX = this.character.x + Math.cos(angle + 0.05) * desiredDistance;
        this.floatingTargetY = this.character.y + Math.sin(angle + 0.05) * desiredDistance;
        this.moveToFloatingTarget();
    },

    /**
     * Moves the boss toward the current floating target.
     *
     * @returns {void}
     */
    moveToFloatingTarget() {
        const targetDistX = this.floatingTargetX - this.x;
        const targetDistY = this.floatingTargetY - this.y;
        const targetDist = Math.sqrt(targetDistX * targetDistX + targetDistY * targetDistY);
        if (targetDist <= 10) return;
        this.x += (targetDistX / targetDist) * this.floatingSpeed;
        this.y += (targetDistY / targetDist) * this.floatingSpeed;
    },

    /**
     * Normal style: approach when far, retreat when too close, idle bob in mid-range.
     *
     * @param {{distX: number, distY: number, distance: number}} vector Movement vector.
     * @returns {void}
     */
    applyNormalMovement(vector) {
        if (vector.distance > 460) {
            this.x += (vector.distX / vector.distance) * this.floatingSpeed * 1.1;
            this.y += (vector.distY / vector.distance) * this.floatingSpeed * 1.1;
            return;
        }
        if (vector.distance < 280) {
            this.x -= (vector.distX / vector.distance) * this.floatingSpeed * 1.0;
            this.y -= (vector.distY / vector.distance) * this.floatingSpeed * 1.0;
            return;
        }
        this.y += Math.sin(Date.now() * 0.009) * 0.7;
    },

    /**
     * Clamps boss coordinates to the defined boss arena.
     *
     * @returns {void}
     */
    clampPositionToBossArea() {
        const mapBounds = 6720;
        const minY = -55;
        if (this.x < 4800) this.x = 4800;
        if (this.x > mapBounds - this.width) this.x = mapBounds - this.width;
        if (this.y < minY) this.y = minY;
        if (this.y > 540 - this.height) this.y = 540 - this.height;
    }
});
