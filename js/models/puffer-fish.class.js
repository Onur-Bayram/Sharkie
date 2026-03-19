/**
 * Pufferfish enemy - alternates between swimming, transition, and inflated states.
 * Can be killed by bubbles or fin slap; knockback is triggered by fin slap.
 */
class Pufferfish extends MovableObject{

    IMAGES_SWIM = [];
    IMAGES_TRANSITION = [];
    IMAGES_BUBBLESWIM = [];
    IMAGES_DEAD = [];
    IMAGES_DEAD_FINSLAP = [];
    hp = 30;
    isDead = false;
    state = 'swim';
    deadAnimationFinished = false;
    deadCause = null;
    knockbackVX = 0;
    knockbackVY = 0;
    knockbackGravity = 0.30;

    /**
     * Creates a pufferfish with random color variant and position.
     * @param {number|null} [x=null] X-start position (random if null).
     * @param {number|null} [y=null] Y-start position (random if null).
     */
    constructor(x = null, y = null){
        super();
        this.randomizePufferColor();
        this.loadPufferImages();
        this.initPufferPosition(x, y);
        this.initPufferPhysics();
        this.animate();
    }

    /**
     * Randomizes puffer color variant.
     */
    randomizePufferColor() {
        this.colorVariant = Math.floor(Math.random() * 3) + 1;
    }

    /**
     * Loads puffer images.
     */
    loadPufferImages() {
        const v = this.colorVariant;
        const base = '2.Enemy/1.Puffer fish (3 color options)';
        this.IMAGES_SWIM = Array.from({length: 5}, (_, i) => `${base}/1.Swim/${v}.swim${i+1}.png`);
        this.IMAGES_TRANSITION = Array.from({length: 5}, (_, i) => `${base}/2.transition/${v}.transition${i+1}.png`);
        this.IMAGES_BUBBLESWIM = Array.from({length: 5}, (_, i) => `${base}/3.Bubbleeswim/${v}.bubbleswim${i+1}.png`);
        this.IMAGES_DEAD = this.getDeadImages();
        this.IMAGES_DEAD_FINSLAP = this.getDeadImagesFinSlap();
        this.loadImage(this.IMAGES_SWIM[0]);
        this.loadImages(this.IMAGES_SWIM);
        this.loadImages(this.IMAGES_TRANSITION);
        this.loadImages(this.IMAGES_BUBBLESWIM);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_DEAD_FINSLAP);
    }

    /**
     * Initializes puffer position.
     */
    initPufferPosition(x, y) {
        this.x = x !== null ? x : 200 + Math.random() * 300;
        this.y = y !== null ? y : 150 + Math.random() * 200;
        this.width = 80;
        this.height = 60;
    }

    /**
     * Initializes puffer physics.
     */
    initPufferPhysics() {
        this.speed = 0.15 + Math.random() * 0.2;
        this.verticalSpeed = 0.5 + Math.random() * 0.5;
        this.targetY = this.y;
    }

    /**
     * Starts animation, movement and bubble cycle loops.
     * @returns {void}
     */
    animate() {
        this.runPufferAnimationLoop();
        this.runPufferMovementLoop();
        this.runPufferTargetLoop();
        this.scheduleBubbleCycle();
    }

    /**
     * Runs puffer animation loop.
     */
    runPufferAnimationLoop() {
        setInterval(() => this.tickPufferAnimation(), 150);
    }

    /**
     * Processes puffer animation tick.
     */
    tickPufferAnimation() {
        const images = this.getCurrentImages();
        if (this.showDeadLastPufferFrame(images)) return;
        this.img = this.imageCache[images[this.currentImage % images.length]];
        this.currentImage++;
        this.checkPufferDeadOrTransition(images);
    }

    /**
     * Shows final dead puffer frame.
     */
    showDeadLastPufferFrame(images) {
        if (!this.isDead || !this.deadAnimationFinished) return false;
        this.img = this.imageCache[images[images.length - 1]];
        return true;
    }

    /**
     * Checks dead and transition states.
     */
    checkPufferDeadOrTransition(images) {
        if (this.isDead && this.currentImage >= images.length) {
            this.deadAnimationFinished = true;
            this.currentImage = images.length - 1;
            return;
        }
        if (!this.isDead && this.isTransitionState() && this.currentImage >= images.length) {
            this.finishTransition();
        }
    }

    /**
     * Runs puffer movement loop.
     */
    runPufferMovementLoop() {
        setInterval(() => this.tickPufferMovement(), 1000 / 60);
    }

    /**
     * Processes puffer movement tick.
     */
    tickPufferMovement() {
        if (this.isDead) {
            if (this.deadCause === 'finSlap') this.applyFinSlapKnockback();
            return;
        }
        this.moveLeft();
        if (Math.abs(this.y - this.targetY) > 1) {
            this.y += this.y < this.targetY ? this.verticalSpeed : -this.verticalSpeed;
        }
    }

    /**
     * Runs puffer target loop.
     */
    runPufferTargetLoop() {
        setInterval(() => {
            if (!this.isDead) this.targetY = 50 + Math.random() * 400;
        }, 3000);
    }

    /**
     * Schedules a regular bubble inflation cycle with random interval.
     * @returns {void}
     */
    scheduleBubbleCycle() {
        const cycleDelay = 4000 + Math.random() * 2000;
        setInterval(() => this.tickBubbleCycle(), cycleDelay);
    }

    /**
     * Processes bubble cycle tick.
     */
    tickBubbleCycle() {
        if (this.isDead) return;
        if (this.state === 'swim') {
            this.startTransitionToBubble();
            setTimeout(() => {
                if (this.state === 'bubble') this.startTransitionToSwim();
            }, 2000);
        }
    }

    /**
     * Starts the transition state to inflated swimming.
     * @returns {void}
     */
    startTransitionToBubble() {
        this.state = 'transitionToBubble';
        this.currentImage = 0;
    }

    /**
     * Starts the transition state back to normal swimming.
     * @returns {void}
     */
    startTransitionToSwim() {
        this.state = 'transitionToSwim';
        this.currentImage = 0;
    }

    /**
     * Completes the current transition state and switches to the target state.
     * @returns {void}
     */
    finishTransition() {
        if (this.state === 'transitionToBubble') {
            this.state = 'bubble';
        } else if (this.state === 'transitionToSwim') {
            this.state = 'swim';
        }
        this.currentImage = 0;
    }

    /**
     * Checks if the pufferfish is currently in a transition state.
     * @returns {boolean}
     */
    isTransitionState() {
        return this.state === 'transitionToBubble' || this.state === 'transitionToSwim';
    }

    /**
     * Returns the currently appropriate image sequence depending on state.
     * @returns {string[]}
     */
    getCurrentImages() {
        if (this.isDead) {
            if (this.deadCause === 'finSlap' && this.IMAGES_DEAD_FINSLAP.length > 0) {
                return this.IMAGES_DEAD_FINSLAP;
            }
            return this.IMAGES_DEAD;
        }
        if (this.state === 'bubble') {
            return this.IMAGES_BUBBLESWIM;
        }
        if (this.isTransitionState()) {
            return this.IMAGES_TRANSITION;
        }
        return this.IMAGES_SWIM;
    }

    /**
     * Returns death images for the current color type (normal death).
     * @returns {string[]}
     */
    getDeadImages() {
        return this.getPufferDeadImagesByVariant();
    }

    /**
     * Returns death images for fin slap death.
     * @returns {string[]}
     */
    getDeadImagesFinSlap() {
        return this.getPufferDeadImagesByVariant();
    }

    /**
     * Gets dead images by variant.
     */
    getPufferDeadImagesByVariant() {
        const base = '2.Enemy/1.Puffer fish (3 color options)/4.DIE';
        if (this.colorVariant === 1) {
            return [
                `${base}/1.Dead 1 (can animate by going up).png`,
                `${base}/1.Dead 2 (can animate by going down to the floor after the Fin Slap attack).png`,
                `${base}/1.Dead 3 (can animate by going down to the floor after the Fin Slap attack).png`
            ];
        }
        if (this.colorVariant === 2) {
            return [`${base}/2.png`, `${base}/2.2.png`, `${base}/2.3.png`];
        }
        return [`${base}/3.png`, `${base}/3.2.png`, `${base}/3.3.png`];
    }

    /**
     * Initiates puffer fish death; knockback is activated on fin slap.
     * @param {'default'|'finSlap'} [cause='default'] Cause of death.
     * @param {number} [direction=1] Direction for knockback (1 = right, -1 = left).
     * @returns {void}
     */
    die(cause = 'default', direction = 1) {
        if (this.isDead) {
            return;
        }
        this.isDead = true;
        this.state = 'dead';
        this.deadCause = cause;
        if (cause === 'finSlap') {
            this.knockbackVX = 6 * direction;
            this.knockbackVY = -4.0;
        }
        this.currentImage = 0;
        this.deadAnimationFinished = false;
    }

    /**
     * Applies the knockback vector and simulates gravity after a fin slap.
     * @returns {void}
     */
    applyFinSlapKnockback() {
        this.x += this.knockbackVX;
        this.y += this.knockbackVY;
        this.knockbackVY += this.knockbackGravity;
    }

}
