Object.assign(World.prototype, {
draw() {
    if (this.isPaused) {
        return;
    }

    const now = performance.now();

    this.checkCollisions();

    // Kamera folgt dem Hai  zentriere den Hai auf dem Bildschirm
    this.cameraX = this.character.x - this.GAME_WIDTH / 2 + this.character.width / 2;

    // Begrenzung der Kamera
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

    // Speichere den aktuellen Kontext und verschiebe um die Kamera
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

    // Quallen
    this.jellyfishes.forEach((jellyfish) => {
        if (jellyfish.img && jellyfish.img.complete && jellyfish.img.naturalHeight !== 0) {
            this.ctx.drawImage(jellyfish.img, jellyfish.x, jellyfish.y, jellyfish.width, jellyfish.height);
        }
    });

    // Giftflaschen
    this.poisonBottles.forEach((bottle) => {
        if (bottle.img && bottle.img.complete && bottle.img.naturalHeight !== 0) {
            this.ctx.drawImage(bottle.img, bottle.x, bottle.y, bottle.width, bottle.height);
        }
    });

    // Animierte Giftflaschen (fallend)
    this.animatedPoisonBottles.forEach((bottle) => {
        if (bottle.img && bottle.img.complete && bottle.img.naturalHeight !== 0) {
            this.ctx.drawImage(bottle.img, bottle.x, bottle.y, bottle.width, bottle.height);
        }
    });

    // Coins
    this.coins.forEach((coin) => {
        if (coin.img && coin.img.complete && coin.img.naturalHeight !== 0) {
            this.ctx.drawImage(coin.img, coin.x, coin.y, coin.width, coin.height);
        }
    });

    // Boss
    if (this.finalBoss && this.finalBoss.img && this.finalBoss.img.complete && this.finalBoss.img.naturalHeight !== 0) {
        this.ctx.drawImage(this.finalBoss.img, this.finalBoss.x, this.finalBoss.y, this.finalBoss.width, this.finalBoss.height);
    }

    // Stelle den Kontext wieder her
    this.ctx.restore();

    // Zeichne Bubble Animationen
    this.bubbleAnimations.forEach((bubble) => {
        bubble.draw(this.ctx, this.cameraX);
    });

    // Zeichne Fin Slap Attacken
    this.finSlaps.forEach((finSlap) => {
        finSlap.draw(this.ctx, this.cameraX);
        finSlap.animate();
    });

    // Zeichne Statusleiste (fixe Position, nicht von Kamera beeinflusst)
    if (this.statusBar && this.statusBar.img && this.statusBar.img.complete && this.statusBar.img.naturalHeight !== 0) {
        this.ctx.drawImage(this.statusBar.img, this.statusBar.x, this.statusBar.y, this.statusBar.width, this.statusBar.height);
    }

    // Zeichne Giftleiste (fixe Position, unter der Statusleiste)
    if (this.poisonBar && this.poisonBar.img && this.poisonBar.img.complete && this.poisonBar.img.naturalHeight !== 0) {
        this.ctx.drawImage(this.poisonBar.img, this.poisonBar.x, this.poisonBar.y, this.poisonBar.width, this.poisonBar.height);
    }

    // Zeichne Coin Leiste (fixe Position, rechts neben der Giftleiste)
    if (this.coinBar && this.coinBar.img && this.coinBar.img.complete && this.coinBar.img.naturalHeight !== 0) {
        this.ctx.drawImage(this.coinBar.img, this.coinBar.x, this.coinBar.y, this.coinBar.width, this.coinBar.height);
    }

    // Zeichne Boss Leiste (fixe Position, wenn Boss sichtbar ist)
    if (this.finalBoss && this.finalBoss.isActive) {
        this.bossBar.draw(this.ctx);
    }

    // Zeichne Game Over Screen wenn Character tot
    if (this.character.isDead) {
        this.gameOverScreen.draw(this.ctx);
        this.restartButton.draw(this.ctx);
    }
    // Zeichne Win Screen NUR wenn Boss tot UND Character NICHT tot
    else if (this.finalBoss && this.finalBoss.isDead && this.finalBoss.deadAnimationFinished) {
        this.winScreen.draw(this.ctx);
        this.restartButton.draw(this.ctx);
    }

    let self = this;
    this.animationFrameId = requestAnimationFrame(function() {
        self.draw();
    });
},

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

isCollidingBoss(character, boss) {
    //  Hitbox für Boss-Schaden
    const offset = 80;
    return character.x + offset < boss.x + boss.width - offset &&
           character.x + character.width - offset > boss.x + offset &&
           character.y + offset < boss.y + boss.height - offset &&
           character.y + character.height - offset > boss.y + offset;
}
});
