class MovableObject {
x = 50;
y = 250;
img;
height = 150;
width = 100;
imageCache = {};
currentImage = 0;


loadImage(path) {
    this.img = new Image();
    this.img.src = encodeURI(path);
}

loadImages(arr) {
    arr.forEach(path => {
        let img = new Image();
        img.src = encodeURI(path);
        this.imageCache[path] = img;
    });
}


moveRight() {
    console.log('Moving right');
 }

    moveLeft(){
        console.log('Moving left');


    }

 }

