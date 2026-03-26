Object.assign(World.prototype, {
  /**
   * Checks collisions between bubbles and possible targets.
   *
   * @returns {void}
   */
  checkBubbleCollisions() {
    for (let i = this.bubbleAnimations.length - 1; i >= 0; i--) {
      const bubble = this.bubbleAnimations[i];
      const bubbleHit = bubble.isPoison
        ? this.handlePoisonBubbleHit(bubble)
        : this.handleNormalBubbleHit(bubble);
      if (bubbleHit || bubble.x < -100 || bubble.x > this.mapWidth + 100)
        this.bubbleAnimations.splice(i, 1);
    }
  },

  /**
   * Handles poison bubble hit.
   * @param {BubbleAnimation} bubble Bubble object.
   * @returns {boolean}
   */
  handlePoisonBubbleHit(bubble) {
    const damage = 100;
    if (
      this.hitEnemyListWithBubble(this.enemies, bubble, damage, (enemy) =>
        enemy.die(),
      )
    )
      return true;
    if (
      this.hitEnemyListWithBubble(
        this.jellyfishes,
        bubble,
        damage,
        (jellyfish) => jellyfish.die(),
      )
    )
      return true;
    if (
      !this.finalBoss ||
      this.finalBoss.isDead ||
      !this.isCollidingBubble(bubble, this.finalBoss)
    )
      return false;
    this.finalBoss.hit(damage);
    this.bossBar.setPercentage(this.finalBoss.hp, this.finalBoss.maxHp);
    return true;
  },

  /**
   * Handles normal bubble hit.
   * @param {BubbleAnimation} bubble Bubble object.
   * @returns {boolean}
   */
  handleNormalBubbleHit(bubble) {
    const damage = 50;
    return this.hitEnemyListWithBubble(
      this.jellyfishes,
      bubble,
      damage,
      (jellyfish) => jellyfish.die(),
    );
  },

  /**
   * Handles enemy list hit with bubble.
   * @param {MovableObject[]} list Enemy list.
   * @param {BubbleAnimation} bubble Bubble object.
   * @param {number} damage Damage amount.
   * @param {Function} dieCallback Death callback function.
   * @returns {boolean}
   */
  hitEnemyListWithBubble(list, bubble, damage, dieCallback) {
    for (let j = list.length - 1; j >= 0; j--) {
      const target = list[j];
      if (this.cleanupIfDeadTarget(list, j, target)) continue;
      if (!this.isCollidingBubble(bubble, target)) continue;
      target.hp -= damage;
      if (target.hp <= 0) dieCallback(target);
      return true;
    }
    return false;
  },

  /**
   * Cleans up dead target.
   * @param {MovableObject[]} list Enemy list.
   * @param {number} index Index in list.
   * @param {MovableObject} target Target object.
   * @returns {boolean}
   */
  cleanupIfDeadTarget(list, index, target) {
    if (!target.isDead) return false;
    if (target.deadAnimationFinished) list.splice(index, 1);
    return true;
  },

  /**
   * Checks collisions between fin slap attacks and possible targets.
   *
   * @returns {void}
   */
  checkFinSlapCollisions() {
    for (let i = this.finSlaps.length - 1; i >= 0; i--) {
      const finSlap = this.finSlaps[i];
      const finSlapHit = this.handleFinSlapHit(finSlap);
      if (!finSlap.isAlive()) this.finSlaps.splice(i, 1);
      if (finSlapHit) continue;
    }
  },

  /**
   * Handles fin slap hit.
   * @param {FinSlap} finSlap Fin slap object.
   * @returns {boolean}
   */
  handleFinSlapHit(finSlap) {
    if (
      this.hitEnemyListWithFinSlap(this.enemies, finSlap, (enemy) =>
        enemy.die("finSlap", finSlap.direction),
      )
    )
      return true;
    if (
      this.hitEnemyListWithFinSlap(this.jellyfishes, finSlap, (jellyfish) =>
        jellyfish.die(),
      )
    )
      return true;
    if (
      !this.finalBoss ||
      this.finalBoss.isDead ||
      !this.isCollidingFinSlap(finSlap, this.finalBoss)
    )
      return false;
    this.finalBoss.hit(finSlap.damage);
    this.bossBar.setPercentage(this.finalBoss.hp, this.finalBoss.maxHp);
    return true;
  },

  /**
   * Handles enemy list hit with fin slap.
   * @param {MovableObject[]} list Enemy list.
   * @param {FinSlap} finSlap Fin slap object.
   * @param {Function} dieCallback Death callback function.
   * @returns {boolean}
   */
  hitEnemyListWithFinSlap(list, finSlap, dieCallback) {
    for (let j = list.length - 1; j >= 0; j--) {
      const target = list[j];
      if (this.cleanupIfDeadTarget(list, j, target)) continue;
      if (!this.isCollidingFinSlap(finSlap, target)) continue;
      target.hp -= finSlap.damage;
      if (target.hp <= 0) dieCallback(target);
      return true;
    }
    return false;
  },

  /**
   * Checks collision between a fin slap and an object with hitbox distance.
   *
   * @param {MovableObject} finSlap Fin slap attack.
   * @param {MovableObject} obj Target object.
   * @returns {boolean}
   */
  isCollidingFinSlap(finSlap, obj) {
    const offset = 20;
    return (
      finSlap.x + offset < obj.x + obj.width - offset &&
      finSlap.x + finSlap.width - offset > obj.x + offset &&
      finSlap.y + offset < obj.y + obj.height - offset &&
      finSlap.y + finSlap.height - offset > obj.y + offset
    );
  },

  /**
   * Checks collision between a bubble and an object with hitbox distance.
   *
   * @param {MovableObject} bubble Bubble projectile.
   * @param {MovableObject} obj Target object.
   * @returns {boolean}
   */
  isCollidingBubble(bubble, obj) {
    const offset = 10;
    return (
      bubble.x + offset < obj.x + obj.width - offset &&
      bubble.x + bubble.width - offset > obj.x + offset &&
      bubble.y + offset < obj.y + obj.height - offset &&
      bubble.y + bubble.height - offset > obj.y + offset
    );
  },
});
