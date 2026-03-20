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
     * Creates the final boss, preloads all animation sprites, and starts
     * animation and movement loops.
     *
     * @param {number} x Initial X-position.
     * @param {number} y Initial Y-position.
     */
    constructor(x, y) {
        super();
        this.loadBossImages();
        this.initBossPosition(x, y);
        this.animate();
    }

    /**
     * Loads all image sequences needed for boss states.
     *
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
     * Initializes size, movement defaults, and initial patrol target.
     *
     * @param {number} x Initial X-position.
     * @param {number} y Initial Y-position.
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
     * Starts animation and movement loops of the boss.
     *
     * @returns {void}
     */
    animate() {
        setInterval(() => this.updateAnimationFrame(), 150);
        setInterval(() => this.updateMovementFrame(), 1000 / 60);
    }

    /**
     * Advances the current animation frame and applies state transitions.
     *
     * @returns {void}
     */
    updateAnimationFrame() {
        if (!this.canAnimateNow()) return;
        const images = this.getCurrentImages();
        if (this.renderDeadLastFrame(images)) return;
        this.playCurrentFrame(images);
        this.syncStateAfterFrame();
    }

    /**
     * Determines whether animation updates should run in the current frame.
     *
     * @returns {boolean}
     */
    canAnimateNow() {
        if (this.state === 'introduce' && !this.hasStartedIntro) return false;
        // Let transient states finish even if the boss is briefly outside the active range.
        if (this.isDead || this.state === 'hurt' || this.state === 'attacking') return true;
        return this.isActive;
    }

    /**
     * Keeps the final death frame visible once the death animation has completed.
     *
     * @param {string[]} images Current state image sequence.
     * @returns {boolean} True if the method already rendered the frame.
     */
    renderDeadLastFrame(images) {
        if (!this.isDead || !this.deadAnimationFinished) return false;
        this.img = this.imageCache[images[images.length - 1]];
        return true;
    }

    /**
     * Renders the next sprite in the given image sequence.
     *
     * @param {string[]} images Current state image sequence.
     * @returns {void}
     */
    playCurrentFrame(images) {
        const path = images[this.currentImage % images.length];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Applies post-frame state transitions.
     *
     * @returns {void}
     */
    syncStateAfterFrame() {
        this.finishIntroIfNeeded();
        this.finishAttackIfNeeded();
        this.finishHurtIfNeeded();
        this.finishDeathIfNeeded();
    }

    /**
     * Completes intro sequence and switches to floating behavior.
     *
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
     * Completes attack sequence and returns to floating behavior.
     *
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
     * Completes hurt sequence and returns to floating behavior.
     *
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
     * Marks death animation as finished when its sequence is complete.
     *
     * @returns {void}
     */
    finishDeathIfNeeded() {
        if (!this.isDead || this.currentImage < this.IMAGES_DEAD.length) return;
        this.deadAnimationFinished = true;
        this.currentImage = this.IMAGES_DEAD.length - 1;
    }

    /**
     * Updates movement and applies recovery guards for stuck transient states.
     *
     * @returns {void}
     */
    updateMovementFrame() {
        this.recoverStuckTransientState();
        if (!this.isActive || !this.introduced || this.isDead) return;
        if (this.state === 'attacking') {
            this.updateAttackMovement();
            return;
        }
        this.updateFloatingBehavior();
    }

    /**
     * Aktualisiert die Angriffsbewegung als kurzen Dash zum gespeicherten Zielpunkt.
     *
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
    }

    /**
     * Recovers from stuck hurt/attack states and sanitizes invalid coordinates.
     *
     * @returns {void}
     */
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

    /**
     * Updates current swim style on a timed interval.
     *
     * @returns {void}
     */
    updateSwimStyle() {
        const currentTime = Date.now();
        if (currentTime - this.lastStyleChangeTime <= this.styleChangeDuration) return;
        const styles = ['aggressive', 'aggressive', 'aggressive', 'normal', 'circle'];
        this.swimStyle = styles[Math.floor(Math.random() * styles.length)];
        this.lastStyleChangeTime = currentTime;
    }

    /**
     * Derives movement speed from the currently selected swim style.
     *
     * @returns {void}
     */
    updateFloatingSpeed() {
        if (this.swimStyle === 'aggressive') this.floatingSpeed = 2.8;
        else if (this.swimStyle === 'defensive') this.floatingSpeed = 1.9;
        else if (this.swimStyle === 'circle') this.floatingSpeed = 2.3;
        else this.floatingSpeed = 2.1;
    }

    /**
     * Moves the boss based on current swimming style and character position.
     *
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
    }

    /**
     * Setzt die Blickrichtung des Bosses anhand der X-Distanz zum Ziel.
     *
     * @param {number} distX X-Distanz zum Ziel.
     * @returns {void}
     */
    updateFacingDirectionFromX(distX) {
        if (Math.abs(distX) < 2) return;
        this.facingLeft = distX < 0;
    }

    /**
     * Applies idle vertical drift when no valid character target exists.
     *
     * @returns {void}
     */
    applyIdleDriftMovement() {
        const direction = Math.random() > 0.5 ? 1 : -1;
        this.y += this.floatingSpeed * 0.9 * direction;
    }

    /**
     * Builds a normalized vector from boss to character.
     *
     * @returns {{distX:number,distY:number,distance:number}}
     */
    getCharacterVector() {
        const distX = this.character.x - this.x;
        const distY = this.character.y - this.y;
        const distance = Math.max(Math.sqrt(distX * distX + distY * distY), 0.001);
        return { distX, distY, distance };
    }

    /**
     * Routes movement logic to the currently active swim style.
     *
     * @param {{distX:number,distY:number,distance:number}} vector Vector to character.
     * @returns {void}
     */
    applyStyleMovement(vector) {
        if (this.swimStyle === 'aggressive') this.applyAggressiveMovement(vector);
        else if (this.swimStyle === 'defensive') this.applyDefensiveMovement(vector);
        else if (this.swimStyle === 'circle') this.applyCircleMovement(vector);
        else this.applyNormalMovement(vector);
        this.applyVerticalTracking(vector);
    }

    /**
     * Hält den Boss auf der Y-Achse am Spieler, damit er auch am oberen Rand Druck macht.
     *
     * @param {{distX:number,distY:number,distance:number}} vector Vector to character.
     * @returns {void}
     */
    applyVerticalTracking(vector) {
        const verticalDistance = Math.abs(vector.distY);
        if (verticalDistance < 20) return;
        const upwardBoost = vector.distY < 0 ? 1.35 : 1;
        const verticalStep = Math.min(this.floatingSpeed * 1.2 * upwardBoost, verticalDistance * 0.26);
        this.y += Math.sign(vector.distY) * verticalStep;
    }

    /**
     * Moves aggressively toward the character.
     *
     * @param {{distX:number,distY:number,distance:number}} vector Vector to character.
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
    }

    /**
     * Moves defensively away from the character at short range.
     *
     * @param {{distX:number,distY:number,distance:number}} vector Vector to character.
     * @returns {void}
     */
    applyDefensiveMovement(vector) {
        if (vector.distance < 800) {
            this.x -= (vector.distX / vector.distance) * this.floatingSpeed;
            this.y -= (vector.distY / vector.distance) * this.floatingSpeed;
            return;
        }
        this.x += (vector.distX / vector.distance) * this.floatingSpeed * 1.1;
    }

    /**
     * Circles around the character by updating a moving target point.
     *
     * @param {{distX:number,distY:number,distance:number}} vector Vector to character.
     * @returns {void}
     */
    applyCircleMovement(vector) {
        const angle = Math.atan2(vector.distY, vector.distX);
        const desiredDistance = 600;
        this.floatingTargetX = this.character.x + Math.cos(angle + 0.05) * desiredDistance;
        this.floatingTargetY = this.character.y + Math.sin(angle + 0.05) * desiredDistance;
        this.moveToFloatingTarget();
    }

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
    }

    /**
     * Moves with normal behavior: approach when far, evade when too close.
     *
     * @param {{distX:number,distY:number,distance:number}} vector Vector to character.
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
    }

    /**
     * Keeps the boss within the defined boss-zone boundaries.
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

        const distanceX = this.x - character.x;
        const distanceY = this.y - character.y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        const currentTime = Date.now();
        
        
        if (distance < this.attackRadius && currentTime - this.lastAttackTime > 2600) {
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
        this.stateStartedAt = Date.now();
        this.lastAttackTime = this.stateStartedAt;
        const targetOffsetX = this.facingLeft ? -120 : 120;
        this.attackTargetX = this.character ? this.character.x + targetOffsetX : this.x;
        this.attackTargetY = this.getAttackTargetY();
    }

    /**
     * Berechnet die Y-Zielposition fuer den Biss, sodass das Maul auf Spielerhoehe landet.
     *
     * @returns {number}
     */
    getAttackTargetY() {
        if (!this.character) return this.y;
        const characterCenterY = this.character.y + this.character.height / 2;
        const mouthOffsetY = this.height * 0.34;
        const rawTargetY = characterCenterY - mouthOffsetY;
        const minY = -55;
        const maxY = 540 - this.height;
        return Math.max(minY, Math.min(maxY, rawTargetY));
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

    /**
     * Applies hurt state after receiving damage.
     *
     * @returns {void}
     */
    applyBossHurt() {
        this.isHurt = true;
        this.state = 'hurt';
        this.currentImage = 0;
        this.stateStartedAt = Date.now();
        this.hurtUntil = this.stateStartedAt + 550;
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
        this.stateStartedAt = Date.now();
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

