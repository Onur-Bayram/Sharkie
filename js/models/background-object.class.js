class BackgroundObject extends MovableObject {
    constructor(imagePath, x, y) {  
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = y;
        this.width = 720;
        this.height = 480;


    }

}