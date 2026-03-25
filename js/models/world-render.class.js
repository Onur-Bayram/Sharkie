Object.assign(World.prototype, {
/**
 * Renders the entire game frame, updates camera position, draws all objects
 * and schedules the next frame via requestAnimationFrame.
 * @returns {void}
 */
draw() {
    if (this.isPaused) return;
    const now = performance.now();
    this.updateFrameState();
    this.renderWorldLayer(now);
    this.renderEffectsAndUi();
    this.scheduleNextFrame();
},

/**
 * Updates frame state.
 * @returns {void}
 */
updateFrameState() {
    this.checkCollisions();
    this.updateCameraX();
    this.handleDarkZoneAudio();
},

/**
 * Updates camera X.
 * @returns {void}
 */
updateCameraX() {
    this.cameraX = this.character.x - this.GAME_WIDTH / 2 + this.character.width / 2;
    if (this.cameraX < 0) this.cameraX = 0;
    if (this.cameraX > this.mapWidth - this.GAME_WIDTH) this.cameraX = this.mapWidth - this.GAME_WIDTH;
},

/**
 * Handles dark zone audio.
 * @returns {void}
 */
handleDarkZoneAudio() {
    if (this.darkZoneVoicePlayed || this.character.x < this.bossZoneStart) return;
    this.audioManager.setBackgroundMusicEnabled(false);
    this.audioManager.playDarkZoneVoiceSound();
    this.darkZoneVoicePlayed = true;
},

/**
 * Renders world layer.
 * @param {number} now Current timestamp.
 * @returns {void}
 */
renderWorldLayer(now) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(-Math.round(this.cameraX), 0);
    this.drawBackground(now);
    this.drawCharacter();
    this.drawWorldActors();
    this.ctx.restore();
},

/**
 * Draws background.
 * @param {number} now Current timestamp.
 * @returns {void}
 */
drawBackground(now) {
    this.backgroundObjects.forEach((background) => {
        if (!this.canDrawSprite(background)) return;
        const isLightLayer = this.lightLayers.includes(background);
        const layerOffset = isLightLayer ? Math.sin(now * 0.0008) * 25 : 0;
        this.ctx.drawImage(background.img, Math.round(background.x + layerOffset), background.y, background.width + 4, background.height);
    });
},

/**
 * Draws character.
 * @returns {void}
 */
drawCharacter() {
    if (!this.canDrawSprite(this.character)) return;
    if (!this.character.otherDirection) {
        this.ctx.drawImage(this.character.img, this.character.x, this.character.y, this.character.width, this.character.height);
        return;
    }
    this.ctx.save();
    this.ctx.translate(this.character.x + this.character.width, this.character.y);
    this.ctx.scale(-1, 1);
    this.ctx.drawImage(this.character.img, 0, 0, this.character.width, this.character.height);
    this.ctx.restore();
},

/**
 * Draws world actors.
 * @returns {void}
 */
drawWorldActors() {
    this.drawSpriteList(this.enemies);
    this.drawSpriteList(this.jellyfishes);
    this.drawSpriteList(this.poisonBottles);
    this.drawSpriteList(this.animatedPoisonBottles);
    this.drawSpriteList(this.coins);
    if (this.finalBoss && this.canDrawSprite(this.finalBoss)) {
        this.drawFinalBoss();
    }
},

/**
 * Draws final boss and flips sprite based on movement direction.
 * @returns {void}
 */
drawFinalBoss() {
    const shouldFlip = this.finalBoss.facingLeft === false;
    if (!shouldFlip) {
        this.ctx.drawImage(this.finalBoss.img, this.finalBoss.x, this.finalBoss.y, this.finalBoss.width, this.finalBoss.height);
        return;
    }
    this.ctx.save();
    this.ctx.translate(this.finalBoss.x + this.finalBoss.width, this.finalBoss.y);
    this.ctx.scale(-1, 1);
    this.ctx.drawImage(this.finalBoss.img, 0, 0, this.finalBoss.width, this.finalBoss.height);
    this.ctx.restore();
},

/**
 * Draws sprite list.
 * @param {Object[]} list List to draw.
 * @returns {void}
 */
drawSpriteList(list) {
    list.forEach((item) => {
        if (!this.canDrawSprite(item)) return;
        this.ctx.drawImage(item.img, item.x, item.y, item.width, item.height);
    });
},

/**
 * Determines whether sprite can be drawn.
 * @param {Object} item Item to check.
 * @returns {boolean}
 */
canDrawSprite(item) {
    return !!(item && item.img && item.img.complete && item.img.naturalHeight !== 0);
},

/**
 * Renders effects and UI.
 * @returns {void}
 */
renderEffectsAndUi() {
    this.drawBubbleEffects();
    this.drawFinSlapEffects();
    this.drawHudBars();
    this.drawBossBar();
    this.drawEndScreens();
},

/**
 * Draws bubble effects.
 * @returns {void}
 */
drawBubbleEffects() {
    this.bubbleAnimations.forEach((bubble) => bubble.draw(this.ctx, this.cameraX));
},

/**
 * Draws fin slap effects.
 * @returns {void}
 */
drawFinSlapEffects() {
    this.finSlaps.forEach((finSlap) => {
        finSlap.draw(this.ctx, this.cameraX);
        finSlap.animate();
    });
},

/**
 * Draws HUD bars.
 * @returns {void}
 */
drawHudBars() {
    this.drawHudBar(this.statusBar);
    this.drawHudBar(this.poisonBar);
    this.drawHudBar(this.coinBar);
},

/**
 * Draws HUD bar.
 * @param {StatusBar} bar Bar to draw.
 * @returns {void}
 */
drawHudBar(bar) {
    if (!this.canDrawSprite(bar)) return;
    this.ctx.drawImage(bar.img, bar.x, bar.y, bar.width, bar.height);
},

/**
 * Draws boss bar.
 * @returns {void}
 */
drawBossBar() {
    if (this.finalBoss && this.finalBoss.isActive) this.bossBar.draw(this.ctx);
},

/**
 * Draws end screens.
 * @returns {void}
 */
drawEndScreens() {
    if (this.character.isDead) {
        this.gameOverScreen.draw(this.ctx);
        this.restartButton.draw(this.ctx);
        return;
    }
    if (this.finalBoss && this.finalBoss.isDead && this.finalBoss.deadAnimationFinished) {
        this.winScreen.draw(this.ctx);
        this.restartButton.draw(this.ctx);
    }
},

/**
 * Schedules next frame.
 * @returns {void}
 */
scheduleNextFrame() {
    this.animationFrameId = requestAnimationFrame(() => this.draw());
},

/**
 * Pauses the game - stops the animation frame and background music.
 * @returns {void}
 */
pauseGame() {
    this.isPaused = true;
    if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
    }
    if (this.throwIntervalId) {
        clearInterval(this.throwIntervalId);
        this.throwIntervalId = null;
    }
    if (this.audioManager) {
        this.audioManager.pause();
    }
},

/**
 * Resumes the game - reactivates music and restarts the animation loop.
 * @returns {void}
 */
resumeGame() {
    if (!this.isPaused) {
        return;
    }
    this.isPaused = false;
    this.handleThrow();
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
    const cBox = { left: character.x + 42, right: character.x + character.width - 42, top: character.y + 42, bottom: character.y + character.height - 42 };
    const bBox = { left: boss.x + 88, right: boss.x + boss.width - 88, top: boss.y + 238, bottom: boss.y + boss.height - 44 };
    const overlapX = Math.min(cBox.right, bBox.right) - Math.max(cBox.left, bBox.left);
    const overlapY = Math.min(cBox.bottom, bBox.bottom) - Math.max(cBox.top, bBox.top);
    return overlapX > 10 && overlapY > 10;
}
});
