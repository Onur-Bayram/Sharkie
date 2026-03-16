/**
 * Hintergrundobjekt – lädt ein Hintergrundbild und setzt Position und Größe.
 */
class BackgroundObject extends MovableObject {
    /**
     * Erstellt ein Hintergrundobjekt mit dem angegebenen Bild und Koordinaten.
     * @param {string} imagePath Pfad zum Hintergrundbild.
     * @param {number} x X-Position.
     * @param {number} y Y-Position.
     */
    constructor(imagePath, x, y) {  
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = y;
        this.width = 960;
        this.height = 540;


    }

}