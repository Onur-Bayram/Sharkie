class World {

 cameraX = 0;
 character = new Character();
 enemies = [];
 jellyfishes = [];
 poisonBottles = [];
 animatedPoisonBottles = [];
 coins = [];
 totalCoins = 0;
 collectedCoins = 0;
 finalBoss = null;
 statusBar = new StatusBar();
 poisonBar = new PoisonBar();
 coinBar = new CoinBar();
 bossBar = new BossBar();
 winScreen = new WinScreen();
 audioManager = new AudioManager();
 bubbleAnimations = [];
 finSlaps = [];

backgroundObjectsLight = [
    new BackgroundObject('3. Background/Layers/5. Water/L.png', 0, 0),
    new BackgroundObject('3. Background/Layers/3.Fondo 1/L.png', 0, 0),
    new BackgroundObject('3. Background/Layers/4.Fondo 2/L.png', 0, 0),
    new BackgroundObject('3. Background/Layers/2. Floor/L.png', 0, 0),
    new BackgroundObject('3. Background/Layers/1. Light/COMPLETO.png', 0, 0),
    new BackgroundObject('3. Background/Layers/5. Water/L.png', 960, 0),
    new BackgroundObject('3. Background/Layers/3.Fondo 1/L.png', 960, 0),
    new BackgroundObject('3. Background/Layers/4.Fondo 2/L.png', 960, 0),
    new BackgroundObject('3. Background/Layers/2. Floor/L.png', 960, 0),
    new BackgroundObject('3. Background/Layers/1. Light/COMPLETO.png', 960, 0),
    new BackgroundObject('3. Background/Layers/5. Water/L.png', 1920, 0),
    new BackgroundObject('3. Background/Layers/3.Fondo 1/L.png', 1920, 0),
    new BackgroundObject('3. Background/Layers/4.Fondo 2/L.png', 1920, 0),
    new BackgroundObject('3. Background/Layers/2. Floor/L.png', 1920, 0),
    new BackgroundObject('3. Background/Layers/1. Light/COMPLETO.png', 1920, 0),
    new BackgroundObject('3. Background/Layers/5. Water/L.png', 2880, 0),
    new BackgroundObject('3. Background/Layers/3.Fondo 1/L.png', 2880, 0),
    new BackgroundObject('3. Background/Layers/4.Fondo 2/L.png', 2880, 0),
    new BackgroundObject('3. Background/Layers/2. Floor/L.png', 2880, 0),
    new BackgroundObject('3. Background/Layers/1. Light/COMPLETO.png', 2880, 0),
    new BackgroundObject('3. Background/Layers/5. Water/L.png', 3840, 0),
    new BackgroundObject('3. Background/Layers/3.Fondo 1/L.png', 3840, 0),
    new BackgroundObject('3. Background/Layers/4.Fondo 2/L.png', 3840, 0),
    new BackgroundObject('3. Background/Layers/2. Floor/L.png', 3840, 0),
    new BackgroundObject('3. Background/Layers/1. Light/COMPLETO.png', 3840, 0),
];
backgroundObjectsDark = [
    new BackgroundObject('3. Background/Dark/2.png', 4800, 0),
    new BackgroundObject('3. Background/Dark/1.png', 4800, 0),
    new BackgroundObject('3. Background/Dark/completo.png', 4800, 0),
    new BackgroundObject('3. Background/Dark/2.png', 5756, 0),
    new BackgroundObject('3. Background/Dark/1.png', 5756, 0),
    new BackgroundObject('3. Background/Dark/completo.png', 5756, 0),
];
mapWidth = 6720;
bossZoneStart = 4800;
canvas; 
ctx; 

    
constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.character.world = this;
    this.backgroundObjects = [...this.backgroundObjectsLight, ...this.backgroundObjectsDark];
    this.lightLayers = this.backgroundObjectsLight.filter((bg, index) => index % 5 === 4);
    this.enemies = this.createEnemies();
    this.jellyfishes = this.createJellyfishes();
    this.poisonBottles = this.createPoisonBottles();
    this.animatedPoisonBottles = this.createAnimatedPoisonBottles();
    this.coins = this.createCoins();
    this.totalCoins = this.coins.length;
    this.collectedCoins = 0;
    this.coinBar.setPercentage(0, this.totalCoins);
    this.finalBoss = new FinalBoss(this.mapWidth - 500, 80);
    this.bossBar.setPercentage(this.finalBoss.hp, this.finalBoss.maxHp);
    this.handleThrow();
    this.audioManager.play();
    this.draw();
}

createEnemies() {
    const enemies = [];
    const count = 10;
    const minX = 200;
    const maxX = 4500; 
    const minY = 80;
    const maxY = Math.max(minY, this.canvas.height - 120);

    for (let i = 0; i < count; i++) {
        const x = minX + Math.random() * (maxX - minX);
        const y = minY + Math.random() * (maxY - minY);
        enemies.push(new Pufferfish(x, y));
    }

    return enemies;
}

createJellyfishes() {
    const jellyfishes = [];
    const count = 12;
    const minX = 200;
    const maxX = 4500;
    const minY = 80;
    const maxY = Math.max(minY, this.canvas.height - 120);

    for (let i = 0; i < count; i++) {
        const x = minX + Math.random() * (maxX - minX);
        const y = minY + Math.random() * (maxY - minY);
        jellyfishes.push(new Jellyfish(x, y));
    }

    return jellyfishes;
}

createPoisonBottles() {
    const bottles = [];
    const count = 12;
    const minX = 200;
    const maxX = 4500;
    const minY = 400; 
    const maxY = 450;

    for (let i = 0; i < count; i++) {
        const x = minX + Math.random() * (maxX - minX);
        const y = minY + Math.random() * (maxY - minY);
        bottles.push(new PoisonBottle(x, y));
    }

    return bottles;
}

createAnimatedPoisonBottles() {
    const bottles = [];
    const count = 5;
    const minX = 500;
    const maxX = 4000;

    for (let i = 0; i < count; i++) {
        const x = minX + Math.random() * (maxX - minX);
        bottles.push(new AnimatedPoisonBottle(x));
    }

    return bottles;
}

createCoins() {
    const coins = [];
    const count = 10;
    const minX = 200;
    const maxX = 4500;
    const minY = 80;
    const maxY = Math.max(minY, this.canvas.height - 120);

    for (let i = 0; i < count; i++) {
        const x = minX + Math.random() * (maxX - minX);
        const y = minY + Math.random() * (maxY - minY);
        coins.push(new Coin(x, y));
    }

    return coins;
}

handleThrow() {
    setInterval(() => {
        if (window.keyboard && window.keyboard.F) {
            this.character.throwNormalBubble();
        }
        if (window.keyboard && window.keyboard.D) {
            this.character.throwPoisonBubble();
            this.poisonBar.setPercentage(this.character.poison);
        }
        if (window.keyboard && window.keyboard.SPACE) {
            this.character.throwFinSlap();
        }
    }, 100);
}

checkCollisions() {
    // Boss Sichtbarkeit
    if (this.finalBoss) {
        this.finalBoss.checkVisibility(this.cameraX, this.canvas.width);
        // Aktualisiere BossBar wenn Boss sichtbar wird
        if (this.finalBoss.isVisible) {
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
    // Boss Kollision 
    if (this.finalBoss && !this.finalBoss.isDead && !this.character.isDead && this.isCollidingBoss(this.character, this.finalBoss)) {
        const currentTime = Date.now();
        if (!this.character.isHurt || (currentTime - this.character.lastHitTime > 600)) {
            this.character.hit('poison', 20);
            this.statusBar.setPercentage(this.character.energy);
        }
    }

    // Überprüfe ob Boss besiegt wurde
    if (this.finalBoss && this.finalBoss.isDead && this.finalBoss.deadAnimationFinished) {
        this.winScreen.show();
    }
    // animierte Giftflaschen in Sichtweite sind
    this.animatedPoisonBottles.forEach((bottle) => {
        bottle.checkVisibility(this.character.x);
    });
    this.cleanupDeadEnemies();
    this.checkPoisonCollection();
    this.checkBubbleCollisions();
    this.checkFinSlapCollisions();
}

checkPoisonCollection() {
    // Statische Bodenflaschen 
    for (let i = this.poisonBottles.length - 1; i >= 0; i--) {
        const bottle = this.poisonBottles[i];
        if (!bottle.collected && this.character.isColliding(bottle)) {
            bottle.collected = true;
            this.character.poison = Math.min(this.character.poison + 30, 100);
            this.poisonBar.setPercentage(this.character.poison);
            this.audioManager.playPotionSound();
            this.poisonBottles.splice(i, 1);
        }
    }

    // Animierte fallende Flaschen 
    for (let i = this.animatedPoisonBottles.length - 1; i >= 0; i--) {
        const bottle = this.animatedPoisonBottles[i];
        if (!bottle.collected && this.character.isColliding(bottle)) {
            bottle.collected = true;
            this.character.poison = Math.min(this.character.poison + 50, 100);
            this.poisonBar.setPercentage(this.character.poison);
            this.audioManager.playPotionSound();
            this.animatedPoisonBottles.splice(i, 1);
        }
    }

    // Coins sammeln
    for (let i = this.coins.length - 1; i >= 0; i--) {
        const coin = this.coins[i];
        if (!coin.collected && this.character.isColliding(coin)) {
            coin.collected = true;
            this.collectedCoins++;
            this.coinBar.setPercentage(this.collectedCoins, this.totalCoins);
            this.audioManager.playCoinSound();
            this.coins.splice(i, 1);
        }
    }
}

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
}

checkBubbleCollisions() {
    // Blase Animationen (sowohl F als auch D)
    for (let i = this.bubbleAnimations.length - 1; i >= 0; i--) {
        const bubble = this.bubbleAnimations[i];
        let bubbleHit = false;

        if (bubble.isPoison) {
            // GRÜNE Blase (D) - macht Schaden auf ALLE Gegner
            const damage = 100;

            // Kollision mit Feinden (Pufferfish)
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

            // Kollision mit Quallen
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

            //  Kollision mit Boss
            if (!bubbleHit && this.finalBoss && !this.finalBoss.isDead && this.isCollidingBubble(bubble, this.finalBoss)) {
                this.finalBoss.hit(damage);
                this.bossBar.setPercentage(this.finalBoss.hp, this.finalBoss.maxHp);
                bubbleHit = true;
            }
        } else {
            // WEISSE Blase (F)  macht Schaden NUR auf Quallen (Jellyfishes)
            const damage = 50;

            //  Kollision NUR mit Quallen
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

        // Entferne Bubble wenn sie etwas getroffen hat oder außerhalb des Bildschirms ist
        if (bubbleHit || bubble.x < -100 || bubble.x > this.mapWidth + 100) {
            this.bubbleAnimations.splice(i, 1);
        }
    }
}

checkFinSlapCollisions() {
    // Fin Slap treffen ALLE Gegner
    for (let i = this.finSlaps.length - 1; i >= 0; i--) {
        const finSlap = this.finSlaps[i];
        let finSlapHit = false;

        //  Kollision mit Pufferfish
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

        // Kollision mit Quallen
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

        // Kollision mit Boss
        if (!finSlapHit && this.finalBoss && !this.finalBoss.isDead && this.isCollidingFinSlap(finSlap, this.finalBoss)) {
            this.finalBoss.hit(finSlap.damage);
            this.bossBar.setPercentage(this.finalBoss.hp, this.finalBoss.maxHp);
            finSlapHit = true;
        }

        // Entferne Fin Slap wenn die Animation vorbei ist
        if (!finSlap.isAlive()) {
            this.finSlaps.splice(i, 1);
        }
    }
}

isCollidingFinSlap(finSlap, obj) {
    const offset = 20; 
    return finSlap.x + offset < obj.x + obj.width - offset &&
           finSlap.x + finSlap.width - offset > obj.x + offset &&
           finSlap.y + offset < obj.y + obj.height - offset &&
           finSlap.y + finSlap.height - offset > obj.y + offset;
}

isCollidingBubble(bubble, obj) {
    const offset = 10; 
    return bubble.x + offset < obj.x + obj.width - offset &&
           bubble.x + bubble.width - offset > obj.x + offset &&
           bubble.y + offset < obj.y + obj.height - offset &&
           bubble.y + bubble.height - offset > obj.y + offset;
}

draw() {
    const now = performance.now();
    
    this.checkCollisions();
    
    // Kamera folgt dem Hai  zentriere den Hai auf dem Bildschirm
    this.cameraX = this.character.x - this.canvas.width / 2 + this.character.width / 2;
    
    // Begrenzung der Kamera 
    if (this.cameraX < 0) {
        this.cameraX = 0;
    }
    if (this.cameraX > this.mapWidth - this.canvas.width) {
        this.cameraX = this.mapWidth - this.canvas.width;
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
    if (this.finalBoss && this.finalBoss.isVisible) {
        this.bossBar.draw(this.ctx);
    }

    // Zeichne Win Screen wenn boss besiegt
    this.winScreen.draw(this.ctx);

    let self = this;
    requestAnimationFrame(function() {
        self.draw();
    });
}

isCollidingBoss(character, boss) {
    //  Hitbox für Boss-Schaden
    const offset = 80;
    return character.x + offset < boss.x + boss.width - offset &&
           character.x + character.width - offset > boss.x + offset &&
           character.y + offset < boss.y + boss.height - offset &&
           character.y + character.height - offset > boss.y + offset;
}
}