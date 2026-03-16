/**
 * Boss-HP-Anzeige als Canvas-gezeichneter Balken mit Farb-Feedback (grün/gelb/rot).
 */
class BossBar {
    x = 320;
    y = 10;
    width = 320;
    height = 40;
    currentHp = 500;
    maxHp = 500;

    /**
     * Setzt die aktuellen und maximalen HP des Bosses.
     * @param {number} currentHp Aktuelle HP.
     * @param {number} [maxHp=500] Maximale HP.
     * @returns {void}
     */
    setPercentage(currentHp, maxHp = 500) {
        this.currentHp = currentHp;
        this.maxHp = maxHp;
    }

    /**
     * Zeichnet den HP-Balken mit Rahmen, Füllfarbe und HP-Text auf den Canvas.
     * @param {CanvasRenderingContext2D} ctx Zeichenkontext.
     * @returns {void}
     */
    draw(ctx) {
        const safeMax = Math.max(this.maxHp, 1);
        const percentage = Math.min(Math.max(this.currentHp / safeMax, 0), 1);
        const borderWidth = 3;
        const padding = borderWidth + 2; // Platz für Rahmen + extra Abstand
        const innerWidth = this.width - (padding * 2);
        const innerHeight = this.height - (padding * 2);
        const barWidth = innerWidth * percentage;
        ctx.fillStyle = '#333333';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = borderWidth;
        ctx.strokeRect(this.x + borderWidth/2, this.y + borderWidth/2, this.width - borderWidth, this.height - borderWidth);
        if (percentage > 0.5) {
            ctx.fillStyle = '#00FF00'; // Grün
        } else if (percentage > 0.25) {
            ctx.fillStyle = '#FFFF00'; // Gelb
        } else {
            ctx.fillStyle = '#FF0000'; // Rot
        }
        ctx.fillRect(this.x + padding, this.y + padding, barWidth, innerHeight);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Boss HP: ${Math.ceil(this.currentHp)} / ${this.maxHp}`, this.x + this.width / 2, this.y + this.height - 8);
    }
}
