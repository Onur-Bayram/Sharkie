/**
 * Jellyfish enemy - randomly created as 'regular' (yellow/purple) or 'dangerous' (green/pink).
 * Dangerous jellyfish cause electric damage.
 */
class Jellyfish extends MovableObject {
    
    IMAGES_SWIM = [];
    IMAGES_DEAD = [];
    hp = 30;
    isDead = false;
    state = 'swim';
    deadAnimationFinished = false;
    type = 'regular'; // 'regular' oder 'dangerous'
    color = 'yellow'; // 'yellow', 'lila', 'green', 'pink'

    /**
     * Creates a jellyfish with random type, color and position.
     * @param {number|null} [x=null] X-start position (random if null).
     * @param {number|null} [y=null] Y-start position (random if null).
     */
    constructor(x = null, y = null) {
        super();
        this.initJellyfishType();
        this.initJellyfishImages();
        this.initJellyfishPosition(x, y);
        this.initJellyfishPhysics();
        this.animate();
    }

    /**
     * Initializes jellyfish type.
     */
    initJellyfishType() {
        this.type = Math.random() > 0.7 ? 'dangerous' : 'regular';
        if (this.type === 'regular') {
            this.color = Math.random() > 0.5 ? 'yellow' : 'lila';
            this.hp = 30;
            this.isElectric = false;
        } else {
            this.color = Math.random() > 0.5 ? 'green' : 'pink';
            this.hp = 40;
            this.isElectric = true;
        }
    }

    /**
     * Initializes jellyfish images.
     */
    initJellyfishImages() {
        this.loadSwimImages();
        this.loadDeadImages();
        this.loadImage(this.IMAGES_SWIM[0]);
        this.loadImages(this.IMAGES_SWIM);
        this.loadImages(this.IMAGES_DEAD);
    }

    /**
     * Initializes jellyfish position.
     */
    initJellyfishPosition(x, y) {
        this.x = x !== null ? x : 200 + Math.random() * 300;
        this.y = y !== null ? y : 150 + Math.random() * 200;
        this.width = 80;
        this.height = 80;
    }

    /**
     * Initializes jellyfish physics.
     */
    initJellyfishPhysics() {
        this.speed = 0.15 + Math.random() * 0.2;
        this.verticalSpeed = 0.5 + Math.random() * 0.5;
        this.targetY = this.y;
    }

    /**
     * Loads swim image paths depending on type and color.
     * @returns {void}
     */
    loadSwimImages() {
        const folder = this.type === 'regular' ? 'Regular damage' : 'S\u00FAper dangerous';
        const colorCode = this.getColorCode();
        
        this.IMAGES_SWIM = [
            `2.Enemy/2 Jelly fish/${folder}/${colorCode} 1.png`,
            `2.Enemy/2 Jelly fish/${folder}/${colorCode} 2.png`,
            `2.Enemy/2 Jelly fish/${folder}/${colorCode} 3.png`,
            `2.Enemy/2 Jelly fish/${folder}/${colorCode} 4.png`
        ];
    }

    /**
     * Loads death image paths depending on color and color folder.
     * @returns {void}
     */
    loadDeadImages() {
        const colorFolder = this.getColorFolder();
        const colorCode = this.getDeadColorCode();
        
        this.IMAGES_DEAD = [
            `2.Enemy/2 Jelly fish/Dead/${colorFolder}/${colorCode}1.png`,
            `2.Enemy/2 Jelly fish/Dead/${colorFolder}/${colorCode}2.png`,
            `2.Enemy/2 Jelly fish/Dead/${colorFolder}/${colorCode}3.png`,
            `2.Enemy/2 Jelly fish/Dead/${colorFolder}/${colorCode}4.png`
        ];
    }

    /**
     * Returns the file name color code for the swim animation.
     * @returns {string}
     */
    getColorCode() {
        switch (this.color) {
            case 'yellow':
                return 'Yellow';
            case 'lila':
                return 'Lila';
            case 'green':
                return 'Green';
            case 'pink':
                return 'Pink';
            default:
                return 'Yellow';
        }
    }

    /**
     * Returns the folder name for death images (note case sensitivity).
     * @returns {string}
     */
    getColorFolder() {
        switch (this.color) {
            case 'yellow':
                return 'Yellow';
            case 'lila':
                return 'Lila';
            case 'green':
                return 'green';
            case 'pink':
                return 'Pink';
            default:
                return 'Yellow';
        }
    }

    /**
     * Returns the file prefix for death images.
     * @returns {string}
     */
    getDeadColorCode() {
        switch (this.color) {
            case 'yellow':
                return 'y';
            case 'lila':
                return 'L';
            case 'green':
                return 'g';
            case 'pink':
                return 'P';
            default:
                return 'y';
        }
    }

    /**
     * Starts animation and movement loops (swim left and vertical swinging).
     * @returns {void}
     */
    animate() {
        this.runJellyfishAnimationLoop();
        this.runJellyfishMovementLoop();
        this.runJellyfishTargetLoop();
    }

    /**
     * Runs jellyfish animation loop.
     */
    runJellyfishAnimationLoop() {
        setInterval(() => this.tickJellyfishAnimation(), 150);
    }

    /**
     * Processes jellyfish animation tick.
     */
    tickJellyfishAnimation() {
        if (world && world.isPaused) return;
        const images = this.getCurrentImages();
        if (this.isDead && this.deadAnimationFinished) {
            this.img = this.imageCache[images[images.length - 1]];
            return;
        }
        this.img = this.imageCache[images[this.currentImage % images.length]];
        this.currentImage++;
        if (this.isDead && this.currentImage >= images.length) {
            this.deadAnimationFinished = true;
            this.currentImage = images.length - 1;
        }
    }

    /**
     * Runs jellyfish movement loop.
     */
    runJellyfishMovementLoop() {
        setInterval(() => this.tickJellyfishMovement(), 1000 / 60);
    }

    /**
     * Processes jellyfish movement tick.
     */
    tickJellyfishMovement() {
        if (world && world.isPaused) return;
        if (this.isDead) return;
        this.moveLeft();
        if (Math.abs(this.y - this.targetY) > 1) {
            this.y += this.y < this.targetY ? this.verticalSpeed : -this.verticalSpeed;
        }
    }

    /**
     * Runs jellyfish target loop.
     */
    runJellyfishTargetLoop() {
        setInterval(() => {
            if (world && world.isPaused) return;
            if (!this.isDead) this.targetY = 50 + Math.random() * 400;
        }, 3000);
    }

    /**
     * Returns the currently appropriate image sequence (swimming or dead).
     * @returns {string[]}
     */
    getCurrentImages() {
        if (this.isDead) {
            return this.IMAGES_DEAD;
        }
        return this.IMAGES_SWIM;
    }

    /**
     * Initiates jellyfish death and resets the animation state.
     * @returns {void}
     */
    die() {
        if (this.isDead) {
            return;
        }
        this.isDead = true;
        this.state = 'dead';
        this.currentImage = 0;
        this.deadAnimationFinished = false;
    }
}
