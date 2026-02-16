class World {

 cameraX = 0;
 character = new Character();
 enemies = [];
 jellyfishes = [];
 finalBoss = null;
 statusBar = new StatusBar();
 poisonBar = new PoisonBar();
 throwableObjects = [];

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
    this.finalBoss = new FinalBoss(this.mapWidth - 500, 80);
    this.handleThrow();
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

handleThrow() {
    setInterval(() => {
        if (window.keyboard && window.keyboard.D) {
            const bubble = this.character.throw();
            if (bubble) {
                this.throwableObjects.push(bubble);
                this.poisonBar.setPercentage(this.character.poison);
            }
        }
    }, 100);
}

checkCollisions() {
    this.enemies.forEach((enemy) => {
        if (!enemy.isDead && this.character.isColliding(enemy)) {
            const currentTime = Date.now();
            if (!this.character.isHurt || (currentTime - this.character.lastHitTime > 600)) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
        }
    });
    this.jellyfishes.forEach((jellyfish) => {
        if (!jellyfish.isDead && this.character.isColliding(jellyfish)) {
            const currentTime = Date.now();
            if (!this.character.isHurt || (currentTime - this.character.lastHitTime > 600)) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
        }
    });
    this.cleanupDeadEnemies();
    this.checkBubbleCollisions();
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
    for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
        const bubble = this.throwableObjects[i];
        let bubbleHit = false;

        // Check collision with enemies (with small offset for bubbles)
        for (let j = this.enemies.length - 1; j >= 0; j--) {
            const enemy = this.enemies[j];
            if (enemy.isDead) {
                if (enemy.deadAnimationFinished) {
                    this.enemies.splice(j, 1);
                }
                continue;
            }

            if (this.isCollidingBubble(bubble, enemy)) {
                enemy.hp -= 50;
                if (enemy.hp <= 0) {
                    enemy.die();
                }
                bubbleHit = true;
                break;
            }
        }

        // Check collision with jellyfishes
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
                    jellyfish.hp -= 50;
                    if (jellyfish.hp <= 0) {
                        jellyfish.die();
                    }
                    bubbleHit = true;
                    break;
                }
            }
        }

        // Check collision with boss
        if (!bubbleHit && this.finalBoss && !this.finalBoss.isDead && this.isCollidingBubble(bubble, this.finalBoss)) {
            this.finalBoss.hp -= 50;
            if (this.finalBoss.hp <= 0) {
                this.finalBoss.isDead = true;
                console.log('Boss defeated!');
            }
            bubbleHit = true;
        }

        // Remove bubble if it hit something or flew off-screen
        if (bubbleHit || bubble.x < -100 || bubble.x > this.mapWidth + 100) {
            this.throwableObjects.splice(i, 1);
        }
    }
}

isCollidingBubble(bubble, obj) {
    const offset = 10; // Smaller offset for bubbles
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

    // Jellyfishes
    this.jellyfishes.forEach((jellyfish) => {
        if (jellyfish.img && jellyfish.img.complete && jellyfish.img.naturalHeight !== 0) {
            this.ctx.drawImage(jellyfish.img, jellyfish.x, jellyfish.y, jellyfish.width, jellyfish.height);
        }
    });
    
    // Boss
    if (this.finalBoss && this.finalBoss.img && this.finalBoss.img.complete && this.finalBoss.img.naturalHeight !== 0) {
        this.ctx.drawImage(this.finalBoss.img, this.finalBoss.x, this.finalBoss.y, this.finalBoss.width, this.finalBoss.height);
    }

    // Throwable objects (bubbles)
    this.throwableObjects.forEach((bubble) => {
        if (bubble.img && bubble.img.complete && bubble.img.naturalHeight !== 0) {
            this.ctx.drawImage(bubble.img, bubble.x, bubble.y, bubble.width, bubble.height);
        }
    });
    
    // Stelle den Kontext wieder her
    this.ctx.restore(); 

    // Draw status bar (fixed position, not affected by camera)
    if (this.statusBar && this.statusBar.img && this.statusBar.img.complete && this.statusBar.img.naturalHeight !== 0) {
        this.ctx.drawImage(this.statusBar.img, this.statusBar.x, this.statusBar.y, this.statusBar.width, this.statusBar.height);
    }

    // Draw poison bar (fixed position, below status bar)
    if (this.poisonBar && this.poisonBar.img && this.poisonBar.img.complete && this.poisonBar.img.naturalHeight !== 0) {
        this.ctx.drawImage(this.poisonBar.img, this.poisonBar.x, this.poisonBar.y, this.poisonBar.width, this.poisonBar.height);
    } 

    let self = this;
    requestAnimationFrame(function() {
        self.draw();
    });
}
}