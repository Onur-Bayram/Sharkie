class Pufferfish extends MovableObject{


    constructor(){
        super();
        this.loadImage('2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png');
        this.x = 200 + Math.random() * 300;
        this.y = 150 + Math.random() * 200;
        this.width = 80;
        this.height = 60;
    }

}