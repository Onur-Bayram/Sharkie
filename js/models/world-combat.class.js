Object.assign(World.prototype, {
/**
 * Führt alle Kollisionsprüfungen des aktuellen Frames aus und aktualisiert
 * dabei Boss-, Sammel- und Kampflogik.
 *
 * @returns {void}
 */
checkCollisions() {
    if (this.finalBoss) {
        const hadStartedIntro = this.finalBoss.hasStartedIntro;
        this.finalBoss.checkVisibility(this.cameraX, this.GAME_WIDTH);

        if (!hadStartedIntro && this.finalBoss.hasStartedIntro && !this.bossIntroSoundPlayed) {
            this.audioManager.playBossIntroSound();
            this.bossIntroSoundPlayed = true;
        }
        if (this.finalBoss.isActive) {
            this.bossBar.setPercentage(this.finalBoss.hp, this.finalBoss.maxHp);
        }
        this.finalBoss.checkProximityAttack(this.character);
    }

    this.enemies.forEach((enemy) => {
        if (!enemy.isDead && !this.character.isDead && this.character.isColliding(enemy)) {
            const currentTime = Date.now();
            if (!this.character.isHurt || (currentTime - this.character.lastHitTime > 600)) {
                this.character.hit('poison');
                this.statusBar.setPercentage(this.character.energy);
            }
        }
    });
    this.jellyfishes.forEach((jellyfish) => {
        if (!jellyfish.isDead && !this.character.isDead && this.character.isColliding(jellyfish)) {
            const currentTime = Date.now();
            if (!this.character.isHurt || (currentTime - this.character.lastHitTime > 600)) {
                const damage = jellyfish.isElectric ? 30 : 10;
                this.character.hit('electric', damage);
                this.statusBar.setPercentage(this.character.energy);
            }
        }
    });
    if (this.finalBoss && !this.finalBoss.isDead && !this.character.isDead && this.isCollidingBoss(this.character, this.finalBoss)) {
        const currentTime = Date.now();
        if (!this.character.isHurt || (currentTime - this.character.lastHitTime > 600)) {
            this.character.hit('poison', 20);
            this.statusBar.setPercentage(this.character.energy);
        }
    }
    if (this.finalBoss && this.finalBoss.isDead && this.finalBoss.deadAnimationFinished && !this.character.isDead) {
        if (this.winScreen) this.winScreen.show(this.audioManager);
        if (this.restartButton) this.restartButton.show();
    }
    this.animatedPoisonBottles.forEach((bottle) => {
        bottle.checkVisibility(this.character.x);
    });
    this.cleanupDeadEnemies();
    this.checkPoisonCollection();
    this.checkBubbleCollisions();
    this.checkFinSlapCollisions();
},

/**
 * Verarbeitet das Einsammeln von Giftflaschen und Münzen.
 *
 * @returns {void}
 */
checkPoisonCollection() {
    for (let i = this.poisonBottles.length - 1; i >= 0; i--) {
        const bottle = this.poisonBottles[i];
        if (this.character.isCollidingCollect(bottle)) {
            this.poisonBar.setPercentage(this.character.poison);
            this.audioManager.playPotionSound();
            this.poisonBottles.splice(i, 1);
        }
    }
    for (let i = this.animatedPoisonBottles.length - 1; i >= 0; i--) {
        const bottle = this.animatedPoisonBottles[i];
        if (!bottle.collected && this.character.isCollidingCollect(bottle)) {
            bottle.collected = true;
            this.character.poison = Math.min(this.character.poison + 50, 100);
            this.poisonBar.setPercentage(this.character.poison);
            this.audioManager.playPotionSound();
            this.animatedPoisonBottles.splice(i, 1);
        }
    }
    for (let i = this.coins.length - 1; i >= 0; i--) {
        const coin = this.coins[i];
        if (!coin.collected && this.character.isCollidingCoin(coin)) {
            coin.collected = true;
            this.collectedCoins++;
            this.coinBar.setPercentage(this.collectedCoins, this.totalCoins);
            this.audioManager.playCoinSound();
            this.coins.splice(i, 1);
        }
    }
},

/**
 * Entfernt Gegner und Quallen, deren Todesanimation bereits abgeschlossen ist.
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
 * Prüft Kollisionen zwischen Blasen und möglichen Zielen.
 *
 * @returns {void}
 */
checkBubbleCollisions() {
    for (let i = this.bubbleAnimations.length - 1; i >= 0; i--) {
        const bubble = this.bubbleAnimations[i];
        let bubbleHit = false;

        if (bubble.isPoison) {
            const damage = 100;
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                if (enemy.isDead) {
                    if (enemy.deadAnimationFinished) {
                        this.enemies.splice(j, 1);
                    }
                    continue;
                }

                if (this.isCollidingBubble(bubble, enemy)) {
                    enemy.hp -= damage;
                    if (enemy.hp <= 0) {
                        enemy.die();
                    }
                    bubbleHit = true;
                    break;
                }
            }
            if (!bubbleHit) {
                for (let j = this.jellyfishes.length - 1; j >= 0; j--) {
                    const jellyfish = this.jellyfishes[j];
                    if (jellyfish.isDead) {
                        if (jellyfish.deadAnimationFinished) {
                            this.jellyfishes.splice(j, 1);
                        }
                        continue;
                    }

                    if (this.isCollidingBubble(bubble, jellyfish)) {
                        jellyfish.hp -= damage;
                        if (jellyfish.hp <= 0) {
                            jellyfish.die();
                        }
                        bubbleHit = true;
                        break;
                    }
                }
            }
            if (!bubbleHit && this.finalBoss && !this.finalBoss.isDead && this.isCollidingBubble(bubble, this.finalBoss)) {
                this.finalBoss.hit(damage);
                this.bossBar.setPercentage(this.finalBoss.hp, this.finalBoss.maxHp);
                bubbleHit = true;
            }
        } else {
            const damage = 50;
            for (let j = this.jellyfishes.length - 1; j >= 0; j--) {
                const jellyfish = this.jellyfishes[j];
                if (jellyfish.isDead) {
                    if (jellyfish.deadAnimationFinished) {
                        this.jellyfishes.splice(j, 1);
                    }
                    continue;
                }

                if (this.isCollidingBubble(bubble, jellyfish)) {
                    jellyfish.hp -= damage;
                    if (jellyfish.hp <= 0) {
                        jellyfish.die();
                    }
                    bubbleHit = true;
                    break;
                }
            }
        }
        if (bubbleHit || bubble.x < -100 || bubble.x > this.mapWidth + 100) {
            this.bubbleAnimations.splice(i, 1);
        }
    }
},

/**
 * Prüft Kollisionen zwischen Fin-Slap-Angriffen und möglichen Zielen.
 *
 * @returns {void}
 */
checkFinSlapCollisions() {
    for (let i = this.finSlaps.length - 1; i >= 0; i--) {
        const finSlap = this.finSlaps[i];
        let finSlapHit = false;
        for (let j = this.enemies.length - 1; j >= 0; j--) {
            const enemy = this.enemies[j];
            if (enemy.isDead) {
                if (enemy.deadAnimationFinished) {
                    this.enemies.splice(j, 1);
                }
                continue;
            }

            if (this.isCollidingFinSlap(finSlap, enemy)) {
                enemy.hp -= finSlap.damage;
                if (enemy.hp <= 0) {
                    enemy.die('finSlap', finSlap.direction);
                }
                finSlapHit = true;
                break;
            }
        }
        if (!finSlapHit) {
            for (let j = this.jellyfishes.length - 1; j >= 0; j--) {
                const jellyfish = this.jellyfishes[j];
                if (jellyfish.isDead) {
                    if (jellyfish.deadAnimationFinished) {
                        this.jellyfishes.splice(j, 1);
                    }
                    continue;
                }

                if (this.isCollidingFinSlap(finSlap, jellyfish)) {
                    jellyfish.hp -= finSlap.damage;
                    if (jellyfish.hp <= 0) {
                        jellyfish.die();
                    }
                    finSlapHit = true;
                    break;
                }
            }
        }
        if (!finSlapHit && this.finalBoss && !this.finalBoss.isDead && this.isCollidingFinSlap(finSlap, this.finalBoss)) {
            this.finalBoss.hit(finSlap.damage);
            this.bossBar.setPercentage(this.finalBoss.hp, this.finalBoss.maxHp);
            finSlapHit = true;
        }
        if (!finSlap.isAlive()) {
            this.finSlaps.splice(i, 1);
        }
    }
},

/**
 * Prüft die Kollision zwischen einem Fin-Slap und einem Objekt mit Hitbox-Abstand.
 *
 * @param {MovableObject} finSlap Fin-Slap-Angriff.
 * @param {MovableObject} obj Zielobjekt.
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
 * Prüft die Kollision zwischen einer Blase und einem Objekt mit Hitbox-Abstand.
 *
 * @param {MovableObject} bubble Blasenprojektil.
 * @param {MovableObject} obj Zielobjekt.
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
