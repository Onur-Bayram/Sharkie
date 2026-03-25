/**
 * Boss HP display as canvas-drawn bar with color feedback (green/yellow/red).
 */
class BossBar {
    x = 320;
    y = 10;
    width = 320;
    height = 40;
    currentHp = 500;
    maxHp = 500;

    /**
     * Sets current and maximum HP of the boss.
     * @param {number} currentHp Current HP.
     * @param {number} [maxHp=500] Maximum HP.
     * @returns {void}
     */
    setPercentage(currentHp, maxHp = 500) {
        this.currentHp = currentHp;
        this.maxHp = maxHp;
    }

    /**
     * Draws the HP bar with frame, fill color and HP text on the canvas.
     * @param {CanvasRenderingContext2D} ctx Drawing context.
     * @returns {void}
     */
    draw(ctx) {
        const safeMax = Math.max(this.maxHp, 1);
        const percentage = Math.min(Math.max(this.currentHp / safeMax, 0), 1);
        this.drawBarBackground(ctx);
        this.drawBarBorder(ctx);
        this.drawBarFill(ctx, percentage);
        this.drawBarText(ctx);
    }

    /**
     * Draws bar background.
     * @param {any} ctx Parameter.
     * @returns {void}
     */
    drawBarBackground(ctx) {
        ctx.fillStyle = '#333333';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    /**
     * Draws bar border.
     * @param {any} ctx Parameter.
     * @returns {void}
     */
    drawBarBorder(ctx) {
        const borderWidth = 3;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = borderWidth;
        ctx.strokeRect(this.x + borderWidth / 2, this.y + borderWidth / 2, this.width - borderWidth, this.height - borderWidth);
    }

    /**
     * Draws bar fill.
     * @param {any} ctx Parameter.
     * @param {any} percentage Parameter.
     * @returns {void}
     */
    drawBarFill(ctx, percentage) {
        const borderWidth = 3;
        const padding = borderWidth + 2;
        const innerWidth = this.width - padding * 2;
        const innerHeight = this.height - padding * 2;
        if (percentage > 0.5) ctx.fillStyle = '#00FF00';
        else if (percentage > 0.25) ctx.fillStyle = '#FFFF00';
        else ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.x + padding, this.y + padding, innerWidth * percentage, innerHeight);
    }

    /**
     * Draws bar text.
     * @param {any} ctx Parameter.
     * @returns {void}
     */
    drawBarText(ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Boss HP: ${Math.ceil(this.currentHp)} / ${this.maxHp}`, this.x + this.width / 2, this.y + this.height - 8);
    }
}
