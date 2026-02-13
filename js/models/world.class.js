class World {

 character = new Character();
 enemies = [
    new Pufferfish(),
    new Pufferfish(),
    new Pufferfish(),
];

backgroundObjects = [
    new BackgroundObject('3. Background/Layers/5. Water/L.png', 0, 0),
    new BackgroundObject('3. Background/Layers/4.Fondo 2/L.png', 0, 0),
    new BackgroundObject('3. Background/Layers/3.Fondo 1/L.png', 0, 0),
    new BackgroundObject('3. Background/Layers/2. Floor/L.png', 0, 0),
    new BackgroundObject('3. Background/Layers/1. Light/COMPLETO.png', 0, 0),
];  
canvas; 
ctx; 

    
constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.draw();
}

draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.backgroundObjects.forEach((background) => {
        if (background.img && background.img.complete && background.img.naturalHeight !== 0) {
            this.ctx.drawImage(background.img, background.x, background.y, background.width, background.height);
        }
    });
    if (this.character.img && this.character.img.complete && this.character.img.naturalHeight !== 0) {
        this.ctx.drawImage(this.character.img, this.character.x, this.character.y, this.character.width, this.character.height);
    }
    this.enemies.forEach((enemy) => {
        if (enemy.img && enemy.img.complete && enemy.img.naturalHeight !== 0) {
            this.ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
        }
    }); 

    let self = this;
    requestAnimationFrame(function() {
        self.draw();
    });
}
}