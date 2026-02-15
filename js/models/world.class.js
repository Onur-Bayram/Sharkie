class World {

 cameraX = 0;
 character = new Character();
 enemies = [];
 finalBoss = null;

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
    this.finalBoss = new FinalBoss(this.mapWidth - 500, 80);
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

checkCollisions() {
    this.enemies.forEach((enemy) => {
        if (this.character.isColliding(enemy)) {
            if (!this.character.isHurt) {
                this.character.hit();
            }
        }
    });
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
    
    // Boss
    if (this.finalBoss && this.finalBoss.img && this.finalBoss.img.complete && this.finalBoss.img.naturalHeight !== 0) {
        this.ctx.drawImage(this.finalBoss.img, this.finalBoss.x, this.finalBoss.y, this.finalBoss.width, this.finalBoss.height);
    }
    
    // Stelle den Kontext wieder her
    this.ctx.restore(); 

    let self = this;
    requestAnimationFrame(function() {
        self.draw();
    });
}
}