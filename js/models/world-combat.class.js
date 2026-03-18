Object.assign(World.prototype, {
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

updateBossCombatState() {
    if (!this.finalBoss) return;
    const hadStartedIntro = this.finalBoss.hasStartedIntro;
    this.finalBoss.checkVisibility(this.cameraX, this.GAME_WIDTH);
    if (!hadStartedIntro && this.finalBoss.hasStartedIntro && !this.bossIntroSoundPlayed) {
        this.audioManager.playBossIntroSound();
        this.bossIntroSoundPlayed = true;
    }
    if (this.finalBoss.isActive) this.bossBar.setPercentage(this.finalBoss.hp, this.finalBoss.maxHp);
    this.finalBoss.checkProximityAttack(this.character);
},

checkEnemyBodyCollisions() {
    this.enemies.forEach((enemy) => {
        if (enemy.isDead || this.character.isDead || !this.character.isColliding(enemy)) return;
        if (!this.canCharacterTakeContactDamage()) return;
        this.character.hit('poison');
        this.statusBar.setPercentage(this.character.energy);
    });
},

checkJellyfishBodyCollisions() {
    this.jellyfishes.forEach((jellyfish) => {
        if (jellyfish.isDead || this.character.isDead || !this.character.isColliding(jellyfish)) return;
        if (!this.canCharacterTakeContactDamage()) return;
        const damage = jellyfish.isElectric ? 30 : 10;
        this.character.hit('electric', damage);
        this.statusBar.setPercentage(this.character.energy);
    });
},

checkBossBodyCollision() {
    if (!this.finalBoss || this.finalBoss.isDead || this.character.isDead) return;
    if (!this.isCollidingBoss(this.character, this.finalBoss)) return;
    if (!this.canCharacterTakeContactDamage()) return;
    this.character.hit('poison', 20);
    this.statusBar.setPercentage(this.character.energy);
},

canCharacterTakeContactDamage() {
    const currentTime = Date.now();
    return !this.character.isHurt || (currentTime - this.character.lastHitTime > 600);
},

handleBossEndState() {
    if (!this.finalBoss || !this.finalBoss.isDead || !this.finalBoss.deadAnimationFinished) return;
    if (this.character.isDead) return;
    if (this.winScreen) this.winScreen.show(this.audioManager);
    if (this.restartButton) this.restartButton.show();
},

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

collectStaticPoisonBottles() {
    for (let i = this.poisonBottles.length - 1; i >= 0; i--) {
        const bottle = this.poisonBottles[i];
        if (!this.character.isCollidingCollect(bottle)) continue;
        this.poisonBar.setPercentage(this.character.poison);
        this.audioManager.playPotionSound();
        this.poisonBottles.splice(i, 1);
    }
},

collectAnimatedPoisonBottles() {
    for (let i = this.animatedPoisonBottles.length - 1; i >= 0; i--) {
        const bottle = this.animatedPoisonBottles[i];
        if (bottle.collected || !this.character.isCollidingCollect(bottle)) continue;
        bottle.collected = true;
        this.character.poison = Math.min(this.character.poison + 50, 100);
        this.poisonBar.setPercentage(this.character.poison);
        this.audioManager.playPotionSound();
        this.animatedPoisonBottles.splice(i, 1);
    }
},

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

handlePoisonBubbleHit(bubble) {
    const damage = 100;
    if (this.hitEnemyListWithBubble(this.enemies, bubble, damage, (enemy) => enemy.die())) return true;
    if (this.hitEnemyListWithBubble(this.jellyfishes, bubble, damage, (jellyfish) => jellyfish.die())) return true;
    if (!this.finalBoss || this.finalBoss.isDead || !this.isCollidingBubble(bubble, this.finalBoss)) return false;
    this.finalBoss.hit(damage);
    this.bossBar.setPercentage(this.finalBoss.hp, this.finalBoss.maxHp);
    return true;
},

handleNormalBubbleHit(bubble) {
    const damage = 50;
    return this.hitEnemyListWithBubble(this.jellyfishes, bubble, damage, (jellyfish) => jellyfish.die());
},

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

handleFinSlapHit(finSlap) {
    if (this.hitEnemyListWithFinSlap(this.enemies, finSlap, (enemy) => enemy.die('finSlap', finSlap.direction))) return true;
    if (this.hitEnemyListWithFinSlap(this.jellyfishes, finSlap, (jellyfish) => jellyfish.die())) return true;
    if (!this.finalBoss || this.finalBoss.isDead || !this.isCollidingFinSlap(finSlap, this.finalBoss)) return false;
    this.finalBoss.hit(finSlap.damage);
    this.bossBar.setPercentage(this.finalBoss.hp, this.finalBoss.maxHp);
    return true;
},

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
