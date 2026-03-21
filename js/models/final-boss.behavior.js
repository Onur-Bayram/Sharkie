/**
 * Final Boss movement and combat behavior mixin.
 * Extends FinalBoss prototype with AI, movement, targeting, damage, and visibility logic.
 */
Object.assign(FinalBoss.prototype, {
    /** Updates movement and handles attack dash separately. */
    updateMovementFrame() {
        this.recoverStuckTransientState();
        if (!this.isActive || !this.introduced || this.isDead) return;
        if (this.state === 'attacking') {
            this.updateAttackMovement();
            return;
        }
        this.updateFloatingBehavior();
    },

    /** Moves the boss toward the current attack target during dash state. */
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

    /** Recovers from stale transient states and sanitizes invalid coordinates. */
    recoverStuckTransientState() {
        const now = Date.now();

        if (this.state === 'hurt' && now >= this.hurtUntil) {
            this.isHurt = false;
            this.state = 'floating';
            this.currentImage = 0;
            this.stateStartedAt = now;
        }

        if (this.state === 'hurt' && now - this.stateStartedAt > 1200) {
            this.isHurt = false;
            this.state = 'floating';
            this.currentImage = 0;
            this.stateStartedAt = now;
        }

        if (this.state === 'attacking' && now - this.stateStartedAt > 1800) {
            this.isAttacking = false;
            this.state = 'floating';
            this.currentImage = 0;
            this.stateStartedAt = now;
        }

        // Keep booleans aligned with the canonical state to avoid stale lockups.
        this.isHurt = this.state === 'hurt';
        this.isAttacking = this.state === 'attacking';

        if (!Number.isFinite(this.x) || !Number.isFinite(this.y)) {
            this.x = 6000;
            this.y = 80;
            this.state = 'floating';
            this.isHurt = false;
            this.isAttacking = false;
            this.currentImage = 0;
            this.stateStartedAt = now;
        }
    },

    /** Returns the sprite sequence that matches the current boss state. */
    getCurrentImages() {
        if (this.isDead) return this.IMAGES_DEAD;
        if (this.state === 'introduce') return this.IMAGES_INTRODUCE;
        if (this.state === 'attacking') return this.IMAGES_ATTACK;
        if (this.state === 'hurt') return this.IMAGES_HURT;
        return this.IMAGES_FLOATING;
    },

    /** Updates floating AI state and movement while not attacking/hurt. */
    updateFloatingBehavior() {
        if (this.isAttacking || this.isHurt) return;
        this.updateSwimStyle();
        this.updateFloatingSpeed();
        this.applyMovement();
    },

    /** Switches swim style at a fixed interval for varied boss behavior. */
    updateSwimStyle() {
        const currentTime = Date.now();
        if (currentTime - this.lastStyleChangeTime <= this.styleChangeDuration) return;
        const styles = ['aggressive', 'aggressive', 'aggressive', 'normal', 'circle'];
        this.swimStyle = styles[Math.floor(Math.random() * styles.length)];
        this.lastStyleChangeTime = currentTime;
    },

    /** Derives movement speed from the currently active swim style. */
    updateFloatingSpeed() {
        if (this.swimStyle === 'aggressive') this.floatingSpeed = 2.8;
        else if (this.swimStyle === 'defensive') this.floatingSpeed = 1.9;
        else if (this.swimStyle === 'circle') this.floatingSpeed = 2.3;
        else this.floatingSpeed = 2.1;
    },

    /** Applies movement relative to character position or idle drift fallback. */
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

    /** Updates facing direction based on horizontal distance to the target. */
    updateFacingDirectionFromX(distX) {
        if (Math.abs(distX) < 2) return;
        this.facingLeft = distX < 0;
    },

    /** Applies a simple vertical idle drift when no character target is valid. */
    applyIdleDriftMovement() {
        const direction = Math.random() > 0.5 ? 1 : -1;
        this.y += this.floatingSpeed * 0.9 * direction;
    },

    /** Builds normalized distance data from boss to character. */
    getCharacterVector() {
        const distX = this.character.x - this.x;
        const distY = this.character.y - this.y;
        const distance = Math.max(Math.sqrt(distX * distX + distY * distY), 0.001);
        return { distX, distY, distance };
    },

    /** Selects movement logic based on swim style. */
    applyStyleMovement(vector) {
        if (this.swimStyle === 'aggressive') this.applyAggressiveMovement(vector);
        else if (this.swimStyle === 'defensive') this.applyDefensiveMovement(vector);
        else if (this.swimStyle === 'circle') this.applyCircleMovement(vector);
        else this.applyNormalMovement(vector);
        this.applyVerticalTracking(vector);
    },

    /** Adds vertical tracking so the boss keeps pressure on player altitude. */
    applyVerticalTracking(vector) {
        const verticalDistance = Math.abs(vector.distY);
        if (verticalDistance < 20) return;
        const upwardBoost = vector.distY < 0 ? 1.35 : 1;
        const verticalStep = Math.min(this.floatingSpeed * 1.2 * upwardBoost, verticalDistance * 0.26);
        this.y += Math.sign(vector.distY) * verticalStep;
    },

    /** Aggressive style: pressure the player with close-range pursuit/wobble. */
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

    /** Defensive style: retreat at short range and re-approach from distance. */
    applyDefensiveMovement(vector) {
        if (vector.distance < 800) {
            this.x -= (vector.distX / vector.distance) * this.floatingSpeed;
            this.y -= (vector.distY / vector.distance) * this.floatingSpeed;
            return;
        }
        this.x += (vector.distX / vector.distance) * this.floatingSpeed * 1.1;
    },

    /** Circle style: orbit around the character using a moving target point. */
    applyCircleMovement(vector) {
        const angle = Math.atan2(vector.distY, vector.distX);
        const desiredDistance = 600;
        this.floatingTargetX = this.character.x + Math.cos(angle + 0.05) * desiredDistance;
        this.floatingTargetY = this.character.y + Math.sin(angle + 0.05) * desiredDistance;
        this.moveToFloatingTarget();
    },

    /** Moves the boss toward the current floating target. */
    moveToFloatingTarget() {
        const targetDistX = this.floatingTargetX - this.x;
        const targetDistY = this.floatingTargetY - this.y;
        const targetDist = Math.sqrt(targetDistX * targetDistX + targetDistY * targetDistY);
        if (targetDist <= 10) return;
        this.x += (targetDistX / targetDist) * this.floatingSpeed;
        this.y += (targetDistY / targetDist) * this.floatingSpeed;
    },

    /** Normal style: approach when far, retreat when too close, idle bob in mid-range. */
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

    /** Clamps boss coordinates to the defined boss arena. */
    clampPositionToBossArea() {
        const mapBounds = 6720;
        const minY = -55;
        if (this.x < 4800) this.x = 4800;
        if (this.x > mapBounds - this.width) this.x = mapBounds - this.width;
        if (this.y < minY) this.y = minY;
        if (this.y > 540 - this.height) this.y = 540 - this.height;
    },

    /** Checks distance and cooldown to trigger boss attack. */
    checkProximityAttack(character) {
        this.character = character;
        if (this.isDead || !this.isActive || !this.introduced || this.isAttacking || this.isHurt) {
            return;
        }
        const distanceX = this.x - character.x;
        const distanceY = this.y - character.y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        const currentTime = Date.now();
        if (distance < this.attackRadius && currentTime - this.lastAttackTime > 2600) {
            this.attack();
        }
    },

    /** Switches to attack state and sets dash target. */
    attack() {
        this.isAttacking = true;
        this.state = 'attacking';
        this.currentImage = 0;
        this.stateStartedAt = Date.now();
        this.lastAttackTime = this.stateStartedAt;
        const targetOffsetX = this.facingLeft ? -120 : 120;
        this.attackTargetX = this.character ? this.character.x + targetOffsetX : this.x;
        this.attackTargetY = this.getAttackTargetY();
    },

    /** Calculates vertical target position of boss mouth for bite. */
    getAttackTargetY() {
        if (!this.character) return this.y;
        const characterCenterY = this.character.y + this.character.height / 2;
        const mouthOffsetY = this.height * 0.34;
        const rawTargetY = characterCenterY - mouthOffsetY;
        const minY = -55;
        const maxY = 540 - this.height;
        return Math.max(minY, Math.min(maxY, rawTargetY));
    },

    /** Processes damage and switches to hurt or dead state. */
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
    },

    /** Applies hurt state timing and resets state animation frame. */
    applyBossHurt() {
        this.isHurt = true;
        this.state = 'hurt';
        this.currentImage = 0;
        this.stateStartedAt = Date.now();
        this.hurtUntil = this.stateStartedAt + 550;
    },

    /** Starts death sequence once and pins dead animation state. */
    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.state = 'dead';
        this.currentImage = 0;
        this.deadAnimationFinished = false;
        this.stateStartedAt = Date.now();
    },

    /** Updates boss visibility/activity relative to camera and starts intro on first sight. */
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
});
