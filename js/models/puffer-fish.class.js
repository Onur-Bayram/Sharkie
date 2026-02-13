class Pufferfish extends MovableObject{


    constructor(){
        super();
        this.loadImage('2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png');
        this.x = 100 + Math.random() * 100;
        this.y = 200 + Math.random() * 100;
    }

}