Object.assign(World.prototype, {
SMALL_POISON_BOTTLE_VALUE: 20,
LARGE_POISON_BOTTLE_VALUE: 40,

/**
 * Performs all collision checks for the current frame and updates
 * boss, collection and combat logic.
 *
 * @returns {void}
 */
checkCollisions() {
    this.updateBossCombatState();
    this.checkEnemyBodyCollisions();
    this.checkJellyfishBodyCollisions();
    this.checkBossBodyCollision();
    this.handleBossEndState();
    this.updateAnimatedBottleVisibility();
    this.cleanupDeadEnemies();
    this.checkPoisonCollection();
    this.checkBubbleCollisions();
    this.checkFinSlapCollisions();
},

/**
 * Updates boss combat state: zone lock, intro, bar, attack, and bottle drop.
 * @returns {void}
 */
updateBossCombatState() {
    if (!this.finalBoss) return;
    if (!this.bossLevelLocked && this.character.x >= this.bossZoneStart) this.bossLevelLocked = true;
    const hadStartedIntro = this.finalBoss.hasStartedIntro;
    this.finalBoss.checkVisibility(this.cameraX, this.GAME_WIDTH);
    this.checkBossIntroSound(hadStartedIntro);
    if (this.finalBoss.isActive) this.bossBar.setPercentage(this.finalBoss.hp, this.finalBoss.maxHp);
    this.finalBoss.checkProximityAttack(this.character);
    this.spawnBossFightPoisonBottle();
},

/**
 * Plays the boss intro sound the first time the intro sequence starts.
 * @param {boolean} hadStartedIntro Whether the intro had already started.
 * @returns {void}
 */
checkBossIntroSound(hadStartedIntro) {
    if (!hadStartedIntro && this.finalBoss.hasStartedIntro && !this.bossIntroSoundPlayed) {
        this.audioManager.playBossIntroSound();
        this.bossIntroSoundPlayed = true;
    }
},

/**
 * Spawns a poison bottle drop during the boss fight at a random position near the character.
 * @returns {void}
 */
spawnBossFightPoisonBottle() {
    if (!this.canSpawnBossBottle()) return;
    const minX = this.bossZoneStart + 120;
    const maxX = this.mapWidth - 220;
    const spawnX = Math.max(minX, Math.min(maxX, this.character.x + (Math.random() * 420 - 210)));
    this.animatedPoisonBottles.push(this.createBossBottle(spawnX, -220 - Math.random() * 140));
    this.lastBossBottleDropAt = Date.now();
},

/**
 * Returns true if conditions allow a new boss bottle to be spawned.
 * @returns {boolean}
 */
canSpawnBossBottle() {
    if (!this.finalBoss || this.finalBoss.isDead || !this.bossLevelLocked) return false;
    if (Date.now() - this.lastBossBottleDropAt < this.bossBottleDropCooldown) return false;
    const active = this.animatedPoisonBottles.filter(b => b.fromBossFight && !b.collected).length;
    return active < this.maxBossFightBottles;
},

/**
 * Creates and configures a boss-fight poison bottle at the given position.
 * @param {number} spawnX X-position to spawn at.
 * @param {number} spawnY Y-position to spawn at.
 * @returns {AnimatedPoisonBottle}
 */
createBossBottle(spawnX, spawnY) {
    const bottle = new AnimatedPoisonBottle(spawnX, spawnY);
    bottle.maxY = 390;
    bottle.visibilityRange = 900;
    bottle.isVisible = true;
    bottle.fromBossFight = true;
    return bottle;
},

/**
 * Checks enemy body collisions.
 * @returns {void}
 */
checkEnemyBodyCollisions() {
    this.enemies.forEach((enemy) => {
        if (enemy.isDead || this.character.isDead || !this.character.isColliding(enemy)) return;
        if (!this.canCharacterTakeContactDamage()) return;
        this.character.hit('poison');
        this.statusBar.setPercentage(this.character.energy);
    });
},

/**
 * Checks jellyfish body collisions.
 * @returns {void}
 */
checkJellyfishBodyCollisions() {
    this.jellyfishes.forEach((jellyfish) => {
        if (jellyfish.isDead || this.character.isDead || !this.character.isColliding(jellyfish)) return;
        if (!this.canCharacterTakeContactDamage()) return;
        const damage = jellyfish.isElectric ? 30 : 10;
        this.character.hit('electric', damage);
        this.statusBar.setPercentage(this.character.energy);
    });
},

/**
 * Checks boss body collision.
 * @returns {void}
 */
checkBossBodyCollision() {
    if (!this.finalBoss || this.finalBoss.isDead || this.character.isDead) return;
    const bodyHit = this.isCollidingBoss(this.character, this.finalBoss);
    const biteHit = this.isBossBiteHit(this.character, this.finalBoss);
    if (!bodyHit && !biteHit) return;
    if (!this.canCharacterTakeContactDamage()) return;
    const damage = biteHit ? 38 : (this.finalBoss.state === 'attacking' ? 35 : 22);
    this.character.hit('poison', damage);
    this.statusBar.setPercentage(this.character.energy);
},

/**
 * Checks the boss bite hitbox so attacks connect near the upper screen edge.
 * @param {Character} character Character object.
 * @param {FinalBoss} boss Boss object.
 * @returns {boolean}
 */
isBossBiteHit(character, boss) {
    if (boss.state !== 'attacking') return false;
    const cBox = { left: character.x + 42, right: character.x + character.width - 42, top: character.y + 42, bottom: character.y + character.height - 42 };
    const mBox = this.getBossMouthBox(boss);
    const overlapX = Math.min(cBox.right, mBox.right) - Math.max(cBox.left, mBox.left);
    const overlapY = Math.min(cBox.bottom, mBox.bottom) - Math.max(cBox.top, mBox.top);
    return overlapX > 8 && overlapY > 8;
},

/**
 * Returns the directional mouth hitbox rectangle for the boss.
 * @param {FinalBoss} boss Boss object.
 * @returns {Object}
 */
getBossMouthBox(boss) {
    return boss.facingLeft
        ? { left: boss.x + 44, right: boss.x + 126, top: boss.y + 126, bottom: boss.y + 206 }
        : { left: boss.x + boss.width - 126, right: boss.x + boss.width - 44, top: boss.y + 126, bottom: boss.y + 206 };
},

/**
 * Determines whether character can take contact damage.
 * @returns {boolean}
 */
canCharacterTakeContactDamage() {
    const currentTime = Date.now();
    return !this.character.isHurt || (currentTime - this.character.lastHitTime > 600);
},

/**
 * Handles boss end state.
 * @returns {void}
 */
handleBossEndState() {
    if (!this.finalBoss || !this.finalBoss.isDead || !this.finalBoss.deadAnimationFinished) return;
    if (this.character.isDead) return;
    if (this.winScreen) this.winScreen.show(this.audioManager);
    if (this.restartButton) this.restartButton.show();
},

/**
 * Updates animated bottle visibility.
 * @returns {void}
 */
updateAnimatedBottleVisibility() {
    this.animatedPoisonBottles.forEach((bottle) => bottle.checkVisibility(this.character.x));
},

/**
 * Processes collection of poison bottles and coins.
 *
 * @returns {void}
 */
checkPoisonCollection() {
    this.collectStaticPoisonBottles();
    this.collectAnimatedPoisonBottles();
    this.collectCoins();
},

/**
 * Collects static poison bottles.
 * @returns {void}
 */
collectStaticPoisonBottles() {
    for (let i = this.poisonBottles.length - 1; i >= 0; i--) {
        const bottle = this.poisonBottles[i];
        if (!this.character.isCollidingCollect(bottle)) continue;
        this.character.poison = Math.min(this.character.poison + this.SMALL_POISON_BOTTLE_VALUE, this.character.maxPoison);
        this.poisonBar.setPercentage(this.character.poison);
        this.audioManager.playPotionSound();
        this.poisonBottles.splice(i, 1);
    }
},

/**
 * Collects animated poison bottles.
 * @returns {void}
 */
collectAnimatedPoisonBottles() {
    for (let i = this.animatedPoisonBottles.length - 1; i >= 0; i--) {
        const bottle = this.animatedPoisonBottles[i];
        if (bottle.collected || !this.character.isCollidingCollect(bottle)) continue;
        bottle.collected = true;
        this.character.poison = Math.min(this.character.poison + this.LARGE_POISON_BOTTLE_VALUE, this.character.maxPoison);
        this.poisonBar.setPercentage(this.character.poison);
        this.audioManager.playPotionSound();
        this.animatedPoisonBottles.splice(i, 1);
    }
},

/**
 * Collects coins.
 * @returns {void}
 */
collectCoins() {
    for (let i = this.coins.length - 1; i >= 0; i--) {
        const coin = this.coins[i];
        if (coin.collected || !this.character.isCollidingCoin(coin)) continue;
        coin.collected = true;
        this.collectedCoins++;
        this.coinBar.setPercentage(this.collectedCoins, this.totalCoins);
        this.audioManager.playCoinSound();
        this.coins.splice(i, 1);
    }
},

/**
 * Removes enemies and jellyfish whose death animation is already complete.
 *
 * @returns {void}
 */
cleanupDeadEnemies() {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
        const enemy = this.enemies[i];
        if (enemy.isDead && enemy.deadAnimationFinished) {
            this.enemies.splice(i, 1);
        }
    }
    for (let i = this.jellyfishes.length - 1; i >= 0; i--) {
        const jellyfish = this.jellyfishes[i];
        if (jellyfish.isDead && jellyfish.deadAnimationFinished) {
            this.jellyfishes.splice(i, 1);
        }
    }
},

/**
 * Checks collisions between bubbles and possible targets.
 *
 * @returns {void}
 */
checkBubbleCollisions() {
    for (let i = this.bubbleAnimations.length - 1; i >= 0; i--) {
        const bubble = this.bubbleAnimations[i];
        const bubbleHit = bubble.isPoison ? this.handlePoisonBubbleHit(bubble) : this.handleNormalBubbleHit(bubble);
        if (bubbleHit || bubble.x < -100 || bubble.x > this.mapWidth + 100) this.bubbleAnimations.splice(i, 1);
    }
},

/**
 * Handles poison bubble hit.
 * @param {BubbleAnimation} bubble Bubble object.
 * @returns {boolean}
 */
handlePoisonBubbleHit(bubble) {
    const damage = 100;
    if (this.hitEnemyListWithBubble(this.enemies, bubble, damage, (enemy) => enemy.die())) return true;
    if (this.hitEnemyListWithBubble(this.jellyfishes, bubble, damage, (jellyfish) => jellyfish.die())) return true;
    if (!this.finalBoss || this.finalBoss.isDead || !this.isCollidingBubble(bubble, this.finalBoss)) return false;
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
    return this.hitEnemyListWithBubble(this.jellyfishes, bubble, damage, (jellyfish) => jellyfish.die());
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
    if (this.hitEnemyListWithFinSlap(this.enemies, finSlap, (enemy) => enemy.die('finSlap', finSlap.direction))) return true;
    if (this.hitEnemyListWithFinSlap(this.jellyfishes, finSlap, (jellyfish) => jellyfish.die())) return true;
    if (!this.finalBoss || this.finalBoss.isDead || !this.isCollidingFinSlap(finSlap, this.finalBoss)) return false;
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
    return finSlap.x + offset < obj.x + obj.width - offset &&
           finSlap.x + finSlap.width - offset > obj.x + offset &&
           finSlap.y + offset < obj.y + obj.height - offset &&
           finSlap.y + finSlap.height - offset > obj.y + offset;
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
    return bubble.x + offset < obj.x + obj.width - offset &&
           bubble.x + bubble.width - offset > obj.x + offset &&
           bubble.y + offset < obj.y + obj.height - offset &&
           bubble.y + bubble.height - offset > obj.y + offset;
}
});
