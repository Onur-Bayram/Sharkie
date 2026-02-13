class World {

 character = new Character();
 enemies = [
    new Pufferfish(),
    new Pufferfish(),
    new Pufferfish(),
];

backgroundObjects = [
    new BackgroundObject('3. Background/Layers/1. Light/1.png', 0, 0),
    new BackgroundObject('3. Background/Layers/2. Floor/1.png', 0, 0),
    new BackgroundObject('3. Background/Layers/5. Water/1.png', 0, 0),
];  
canvas; 
ctx; 

    
constructor(canvas) {
    this.ctx = canvas.getContext('2d');
    this.draw();
}


    draw() {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.backgroundObjects.forEach((background) => {
        if (background.img.complete) {
            this.ctx.drawImage(background.img, background.x, background.y, background.width, background.height);
        }
    });
    if (this.character.img.complete) {
        this.ctx.drawImage(this.character.img, this.character.x, this.character.y, this.character.width, this.character.height);
    }
    this.enemies.forEach((enemy) => {
        if (enemy.img.complete) {
            this.ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
        }
    }); 

        let self = this; 
        requestAnimationFrame(function() {
            self.draw();
        }); 

    }
}