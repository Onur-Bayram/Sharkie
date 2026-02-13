class World {

 character = new Character();
 enemies = [
    new Pufferfish(),
    new Pufferfish(),
    new Pufferfish(),
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



        let self = this; 
        requestAnimationFrame(function() {
            self.draw();
        }); 

    }
}