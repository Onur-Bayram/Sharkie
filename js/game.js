let canvas;
let world;
let character = new MovableObject();


function init() {
    canvas = document.getElementById("canvas");
    world = new World (canvas);

    
    console.log('My Charakter is', world.character);
}

