Object.assign(Character.prototype, {
  /**
   * Starts the high-frequency input processing loop.
   *
   * @returns {void}
   */
  handleKeyboard() {
    setInterval(() => this.updateMovementFromInput(), 1000 / 60);
  },

  /**
   * Updates movement, state, and bounds from current input.
   *
   * @returns {void}
   */
  updateMovementFromInput() {
    if (this.isDead) {
      return;
    }
    let moved = this.applyDirectionalInput();
    moved = moved || this.isActionInputActive();
    this.updateSwimmingState(moved);
    this.updateIdleState(moved);
    this.clampToWorldBounds();
  },

  /**
   * Applies directional movement keys and returns whether movement occurred.
   *
   * @returns {boolean} True if any directional movement was applied.
   */
  applyDirectionalInput() {
    let moved = false;
    if (keyboard && keyboard.RIGHT) {
      this.moveRight();
      this.otherDirection = false;
      moved = true;
    }
    if (keyboard && keyboard.LEFT) {
      this.moveLeft();
      this.otherDirection = true;
      moved = true;
    }
    if (keyboard && keyboard.UP) {
      this.moveUp();
      moved = true;
    }
    if (keyboard && keyboard.DOWN) {
      this.moveDown();
      moved = true;
    }
    return moved;
  },

  /**
   * Returns whether any action input is currently active.
   *
   * @returns {boolean} True if any action keys are pressed.
   */
  isActionInputActive() {
    return !!(keyboard && (keyboard.D || keyboard.F || keyboard.SPACE));
  },

  /**
   * Updates the swimming animation state from current movement/activity.
   *
   * @param {boolean} moved Whether the character moved this frame.
   * @returns {void}
   */
  updateSwimmingState(moved) {
    const wasSwimming = this.isSwimming;
    this.isSwimming =
      moved && !this.isAttacking && !this.isFinSlapping && !this.isHurt;
    if (this.isSwimming && !wasSwimming) {
      this.currentImage = 0;
    }
  },

  /**
   * Tracks idle duration and switches to long-idle when appropriate.
   *
   * @param {boolean} moved Whether the character moved this frame.
   * @returns {void}
   */
  updateIdleState(moved) {
    if (moved) {
      this.lastActivity = Date.now();
      this.isLongIdle = false;
      return;
    }
    const idleTime = Date.now() - this.lastActivity;
    this.isLongIdle = idleTime > 5000;
  },

  /**
   * Keeps the character inside the playable world area.
   *
   * @returns {void}
   */
  clampToWorldBounds() {
    const { minX, maxX, maxY } = this.getWorldBounds();
    if (this.x < minX) this.x = minX;
    if (this.x > maxX) this.x = maxX;
    if (this.y < 0) this.y = 0;
    if (this.y > maxY) this.y = maxY;
  },

  /**
   * Computes world edge boundaries and locks player from entering boss zone.
   *
   * @returns {{minX: number, maxX: number, maxY: number}} World boundary coordinates.
   */
  getWorldBounds() {
    const mapWidth = this.world?.mapWidth ?? 960;
    const gameHeight = this.world?.GAME_HEIGHT ?? 540;
    if (
      this.world &&
      !this.world.bossLevelLocked &&
      this.x >= this.world.bossZoneStart
    ) {
      this.world.bossLevelLocked = true;
    }
    const minX = this.world?.bossLevelLocked ? this.world.bossZoneStart : 0;
    return {
      minX,
      maxX: Math.max(0, mapWidth - this.width),
      maxY: Math.max(0, gameHeight - this.height),
    };
  },
});
