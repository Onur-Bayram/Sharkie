/**
 * Bubble as projectile - flies in one direction and pulses visually.
 * Can be normal (blue) or poisonous (purple).
 */
class BubbleAnimation extends MovableObject {
    
    /**
     * Creates a bubble and starts movement and pulse animation.
     * @param {number} x Start X-position.
     * @param {number} y Start Y-position.
     * @param {1|-1} direction Flight direction (1 = right, -1 = left).
     * @param {boolean} [isPoison=false] Whether it's a poison bubble.
     */
    constructor(x, y, direction, isPoison = false) {
        super();
        this.initBubbleParams(x, y, direction, isPoison);
        this.loadBubbleImage(isPoison);
        this.throw();
        this.animate();
    }

    initBubbleParams(x, y, direction, isPoison) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.speed = 4;
        this.direction = direction;
        this.isPoison = isPoison;
        this.pulseScale = 1;
        this.pulseSpeed = 0.02;
    }

    loadBubbleImage(isPoison) {
        const path = isPoison
            ? '1.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png'
            : '1.Sharkie/4.Attack/Bubble trap/Bubble.png';
        this.loadImage(path);
    }

    /**
     * Starts the movement loop – moves the bubble in flight direction.
     * @returns {void}
     */
    throw() {
        setInterval(() => {
            this.x += this.speed * this.direction;
        }, 1000 / 60);
    }

    /**
     * Starts the pulse animation loop (toggles pulseScale between 0.95 and 1.2).
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            this.pulseScale += this.pulseSpeed;
            if (this.pulseScale > 1.2 || this.pulseScale < 0.95) {
                this.pulseSpeed *= -1;
            }
        }, 50);
    }

    /**
     * Draws the bubble on canvas with pulse scaling and camera offset.
     * @param {CanvasRenderingContext2D} ctx Drawing context.
     * @param {number} cameraX Current camera X-offset.
     * @returns {void}
     */
    draw(ctx, cameraX) {
        if (this.img && this.img.complete && this.img.naturalHeight !== 0) {
            ctx.save();
            ctx.translate(this.x - cameraX + this.width / 2, this.y + this.height / 2);
            ctx.scale(this.pulseScale, this.pulseScale);
            ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        }
    }
}
