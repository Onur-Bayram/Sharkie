/**
 * Final Boss combat and state behavior mixin.
 * Extends FinalBoss prototype with combat, damage, and visibility logic.
 */
Object.assign(FinalBoss.prototype, {
  /**
   * Checks distance and cooldown to trigger boss attack.
   *
   * @param {Character} character The character to check proximity to.
   * @returns {void}
   */
  checkProximityAttack(character) {
    this.character = character;
    if (
      this.isDead ||
      !this.isActive ||
      !this.introduced ||
      this.isAttacking ||
      this.isHurt
    ) {
      return;
    }
    const distanceX = this.x - character.x;
    const distanceY = this.y - character.y;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    const currentTime = Date.now();
    if (
      distance < this.attackRadius &&
      currentTime - this.lastAttackTime > 2600
    ) {
      this.attack();
    }
  },

  /**
   * Switches to attack state and sets dash target.
   *
   * @returns {void}
   */
  attack() {
    this.isAttacking = true;
    this.state = "attacking";
    this.currentImage = 0;
    this.stateStartedAt = Date.now();
    this.lastAttackTime = this.stateStartedAt;
    const targetOffsetX = this.facingLeft ? -120 : 120;
    this.attackTargetX = this.character
      ? this.character.x + targetOffsetX
      : this.x;
    this.attackTargetY = this.getAttackTargetY();
  },

  /**
   * Calculates vertical target position of boss mouth for bite.
   *
   * @returns {number} The calculated Y coordinate.
   */
  getAttackTargetY() {
    if (!this.character) return this.y;
    const characterCenterY = this.character.y + this.character.height / 2;
    const mouthOffsetY = this.height * 0.34;
    const rawTargetY = characterCenterY - mouthOffsetY;
    const minY = -55;
    const maxY = 540 - this.height;
    return Math.max(minY, Math.min(maxY, rawTargetY));
  },

  /**
   * Processes damage and switches to hurt or dead state.
   *
   * @param {number} damage The damage amount to apply.
   * @returns {void}
   */
  hit(damage) {
    if (this.isDead) return;
    if (!this.introduced || this.state === "introduce") return;
    this.hp -= damage;
    if (this.hp <= 0) {
      this.hp = 0;
      this.die();
    } else {
      this.applyBossHurt();
    }
  },

  /**
   * Applies hurt state timing and resets state animation frame.
   *
   * @returns {void}
   */
  applyBossHurt() {
    this.isHurt = true;
    this.state = "hurt";
    this.currentImage = 0;
    this.stateStartedAt = Date.now();
    this.hurtUntil = this.stateStartedAt + 550;
  },

  /**
   * Starts death sequence once and pins dead animation state.
   *
   * @returns {void}
   */
  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.state = "dead";
    this.currentImage = 0;
    this.deadAnimationFinished = false;
    this.stateStartedAt = Date.now();
  },

  /**
   * Updates boss visibility/activity relative to camera and starts intro on first sight.
   *
   * @param {number} cameraX The current camera X position.
   * @param {number} canvasWidth The canvas width for visibility calculation.
   * @returns {void}
   */
  checkVisibility(cameraX, canvasWidth = 960) {
    const bossRightEdge = this.x + this.width;
    const cameraRight = cameraX + canvasWidth;
    const activityPuffer = this.activityRadius;
    this.isActive =
      bossRightEdge > cameraX - activityPuffer &&
      this.x < cameraRight + activityPuffer;
    this.isVisible = bossRightEdge > cameraX && this.x < cameraRight;
    if (!this.hasStartedIntro && this.isVisible) {
      this.hasStartedIntro = true;
      this.currentImage = 0;
    }
  },
});
