Object.assign(World.prototype, {
/**
 * Renders the entire game frame, updates camera position, draws all objects
 * and schedules the next frame via requestAnimationFrame.
 * @returns {void}
 */
draw() {
    if (this.isPaused) {
        return;
    }

    const now = performance.now();

    this.checkCollisions();
    this.cameraX = this.character.x - this.GAME_WIDTH / 2 + this.character.width / 2;
    if (this.cameraX < 0) {
        this.cameraX = 0;
    }
    if (this.cameraX > this.mapWidth - this.GAME_WIDTH) {
        this.cameraX = this.mapWidth - this.GAME_WIDTH;
    }

    if (!this.darkZoneVoicePlayed && this.character.x >= this.bossZoneStart) {
        this.audioManager.setBackgroundMusicEnabled(false);
        this.audioManager.playDarkZoneVoiceSound();
        this.darkZoneVoicePlayed = true;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(-Math.round(this.cameraX), 0);

    this.backgroundObjects.forEach((background) => {
        if (background.img && background.img.complete && background.img.naturalHeight !== 0) {
            const isLightLayer = this.lightLayers.includes(background);
            const layerOffset = isLightLayer ? Math.sin(now * 0.0008) * 25 : 0;
            this.ctx.drawImage(
                background.img,
                Math.round(background.x + layerOffset),
                background.y,
                background.width + 4,
                background.height
            );
        }
    });
    if (this.character.img && this.character.img.complete && this.character.img.naturalHeight !== 0) {
        if (this.character.otherDirection) {
            this.ctx.save();
            this.ctx.translate(this.character.x + this.character.width, this.character.y);
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(this.character.img, 0, 0, this.character.width, this.character.height);
            this.ctx.restore();
        } else {
            this.ctx.drawImage(this.character.img, this.character.x, this.character.y, this.character.width, this.character.height);
        }
    }
    this.enemies.forEach((enemy) => {
        if (enemy.img && enemy.img.complete && enemy.img.naturalHeight !== 0) {
            this.ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
        }
    });
    this.jellyfishes.forEach((jellyfish) => {
        if (jellyfish.img && jellyfish.img.complete && jellyfish.img.naturalHeight !== 0) {
            this.ctx.drawImage(jellyfish.img, jellyfish.x, jellyfish.y, jellyfish.width, jellyfish.height);
        }
    });
    this.poisonBottles.forEach((bottle) => {
        if (bottle.img && bottle.img.complete && bottle.img.naturalHeight !== 0) {
            this.ctx.drawImage(bottle.img, bottle.x, bottle.y, bottle.width, bottle.height);
        }
    });
    this.animatedPoisonBottles.forEach((bottle) => {
        if (bottle.img && bottle.img.complete && bottle.img.naturalHeight !== 0) {
            this.ctx.drawImage(bottle.img, bottle.x, bottle.y, bottle.width, bottle.height);
        }
    });
    this.coins.forEach((coin) => {
        if (coin.img && coin.img.complete && coin.img.naturalHeight !== 0) {
            this.ctx.drawImage(coin.img, coin.x, coin.y, coin.width, coin.height);
        }
    });
    if (this.finalBoss && this.finalBoss.img && this.finalBoss.img.complete && this.finalBoss.img.naturalHeight !== 0) {
        this.ctx.drawImage(this.finalBoss.img, this.finalBoss.x, this.finalBoss.y, this.finalBoss.width, this.finalBoss.height);
    }
    this.ctx.restore();
    this.bubbleAnimations.forEach((bubble) => {
        bubble.draw(this.ctx, this.cameraX);
    });
    this.finSlaps.forEach((finSlap) => {
        finSlap.draw(this.ctx, this.cameraX);
        finSlap.animate();
    });
    if (this.statusBar && this.statusBar.img && this.statusBar.img.complete && this.statusBar.img.naturalHeight !== 0) {
        this.ctx.drawImage(this.statusBar.img, this.statusBar.x, this.statusBar.y, this.statusBar.width, this.statusBar.height);
    }
    if (this.poisonBar && this.poisonBar.img && this.poisonBar.img.complete && this.poisonBar.img.naturalHeight !== 0) {
        this.ctx.drawImage(this.poisonBar.img, this.poisonBar.x, this.poisonBar.y, this.poisonBar.width, this.poisonBar.height);
    }
    if (this.coinBar && this.coinBar.img && this.coinBar.img.complete && this.coinBar.img.naturalHeight !== 0) {
        this.ctx.drawImage(this.coinBar.img, this.coinBar.x, this.coinBar.y, this.coinBar.width, this.coinBar.height);
    }
    if (this.finalBoss && this.finalBoss.isActive) {
        this.bossBar.draw(this.ctx);
    }
    if (this.character.isDead) {
        this.gameOverScreen.draw(this.ctx);
        this.restartButton.draw(this.ctx);
    }
    else if (this.finalBoss && this.finalBoss.isDead && this.finalBoss.deadAnimationFinished) {
        this.winScreen.draw(this.ctx);
        this.restartButton.draw(this.ctx);
    }

    let self = this;
    this.animationFrameId = requestAnimationFrame(function() {
        self.draw();
    });
},

/**
 * Pauses the game – stops the animation frame and background music.
 * @returns {void}
 */
pauseGame() {
    this.isPaused = true;
    if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
    }
    if (this.audioManager) {
        this.audioManager.pause();
    }
},

/**
 * Resumes the game – reactivates music and restarts the animation loop.
 * @returns {void}
 */
resumeGame() {
    if (!this.isPaused) {
        return;
    }
    this.isPaused = false;
    if (this.audioManager) {
        this.audioManager.play();
    }
    this.draw();
},

/**
 * Checks collision between character and boss with generous hitbox distance.
 * @param {Character} character Player character.
 * @param {FinalBoss} boss Final boss enemy.
 * @returns {boolean}
 */
isCollidingBoss(character, boss) {
    const characterInset = 36;
    const bossSideInset = 32;
    const bossTopInset = 185;
    const bossBottomInset = 32;

    return character.x + characterInset < boss.x + boss.width - bossSideInset &&
           character.x + character.width - characterInset > boss.x + bossSideInset &&
           character.y + characterInset < boss.y + boss.height - bossBottomInset &&
           character.y + character.height - characterInset > boss.y + bossTopInset;
}
});
