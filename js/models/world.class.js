class World {

 character = new Character();
 enemies = [
    new Pufferfish(),
    new Pufferfish(),
    new Pufferfish(),
];

clouds = [
    new Cloud(),

];  
backgrounds = [
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

    this.ctx.drawImage(this.character.img, this.character.x, this.character.y, this.character.width, this.character.height);
    this.enemies.forEach((enemy) => {
        this.ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
    }); 

      this.clouds.forEach((cloud) => {
        this.ctx.drawImage(cloud.img, cloud.x, cloud.y, cloud.width, cloud.height);
    }); 
      this.clouds.forEach((enemy) => {
        this.ctx.drawImage(Cloud.img, enemy.x, Cloud.y, Cloud.width, Cloud.height);
    }); 
       this.clouds.forEach((enemy) => {
        this.ctx.drawImage(Cloud.img, enemy.x, Cloud.y, Cloud.width, Cloud.height);
    }); 

        let self = this; 
        requestAnimationFrame(function() {
            self.draw();
        }); 

    }
}