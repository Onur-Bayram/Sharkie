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

updateFrameState() {
    this.checkCollisions();
    this.updateCameraX();
    this.handleDarkZoneAudio();
},

updateCameraX() {
    this.cameraX = this.character.x - this.GAME_WIDTH / 2 + this.character.width / 2;
    if (this.cameraX < 0) this.cameraX = 0;
    if (this.cameraX > this.mapWidth - this.GAME_WIDTH) this.cameraX = this.mapWidth - this.GAME_WIDTH;
},

handleDarkZoneAudio() {
    if (this.darkZoneVoicePlayed || this.character.x < this.bossZoneStart) return;
    this.audioManager.setBackgroundMusicEnabled(false);
    this.audioManager.playDarkZoneVoiceSound();
    this.darkZoneVoicePlayed = true;
},

renderWorldLayer(now) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(-Math.round(this.cameraX), 0);
    this.drawBackground(now);
    this.drawCharacter();
    this.drawWorldActors();
    this.ctx.restore();
},

drawBackground(now) {
    this.backgroundObjects.forEach((background) => {
        if (!this.canDrawSprite(background)) return;
        const isLightLayer = this.lightLayers.includes(background);
        const layerOffset = isLightLayer ? Math.sin(now * 0.0008) * 25 : 0;
        this.ctx.drawImage(background.img, Math.round(background.x + layerOffset), background.y, background.width + 4, background.height);
    });
},

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

drawWorldActors() {
    this.drawSpriteList(this.enemies);
    this.drawSpriteList(this.jellyfishes);
    this.drawSpriteList(this.poisonBottles);
    this.drawSpriteList(this.animatedPoisonBottles);
    this.drawSpriteList(this.coins);
    if (this.finalBoss && this.canDrawSprite(this.finalBoss)) {
        this.ctx.drawImage(this.finalBoss.img, this.finalBoss.x, this.finalBoss.y, this.finalBoss.width, this.finalBoss.height);
    }
},

drawSpriteList(list) {
    list.forEach((item) => {
        if (!this.canDrawSprite(item)) return;
        this.ctx.drawImage(item.img, item.x, item.y, item.width, item.height);
    });
},

canDrawSprite(item) {
    return !!(item && item.img && item.img.complete && item.img.naturalHeight !== 0);
},

renderEffectsAndUi() {
    this.drawBubbleEffects();
    this.drawFinSlapEffects();
    this.drawHudBars();
    this.drawBossBar();
    this.drawEndScreens();
},

drawBubbleEffects() {
    this.bubbleAnimations.forEach((bubble) => bubble.draw(this.ctx, this.cameraX));
},

drawFinSlapEffects() {
    this.finSlaps.forEach((finSlap) => {
        finSlap.draw(this.ctx, this.cameraX);
        finSlap.animate();
    });
},

drawHudBars() {
    this.drawHudBar(this.statusBar);
    this.drawHudBar(this.poisonBar);
    this.drawHudBar(this.coinBar);
},

drawHudBar(bar) {
    if (!this.canDrawSprite(bar)) return;
    this.ctx.drawImage(bar.img, bar.x, bar.y, bar.width, bar.height);
},

drawBossBar() {
    if (this.finalBoss && this.finalBoss.isActive) this.bossBar.draw(this.ctx);
},

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

scheduleNextFrame() {
    this.animationFrameId = requestAnimationFrame(() => this.draw());
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
