class MovableObject {
x = 50;
y = 250;
img;
height = 150;
width = 100;
imageCache = {};
currentImage = 0;
speed = 0.15;

static sharedImageCache = {};

getSharedImage(path) {
    if (!MovableObject.sharedImageCache[path]) {
        const img = new Image();
        img.src = encodeURI(path);
        MovableObject.sharedImageCache[path] = img;
    }
    return MovableObject.sharedImageCache[path];
}


loadImage(path) {
    this.img = this.getSharedImage(path);
}

loadImages(arr) {
    arr.forEach(path => {
        this.imageCache[path] = this.getSharedImage(path);
    });
}

moveRight() {
    this.x += this.speed;
}

moveLeft() {
    this.x -= this.speed;
}

moveUp() {
    this.y -= this.speed;
}

moveDown() {
    this.y += this.speed;
}

isColliding(obj) {
    const offset = 40;
    return this.x + offset < obj.x + obj.width - offset &&
           this.x + this.width - offset > obj.x + offset &&
           this.y + offset < obj.y + obj.height - offset &&
           this.y + this.height - offset > obj.y + offset;
}

 }

