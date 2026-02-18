class BossBar {
    x = 320;
    y = 10;
    width = 320;
    height = 40;
    currentHp = 500;
    maxHp = 500;

    constructor() {
    }

    setPercentage(currentHp, maxHp = 500) {
        this.currentHp = currentHp;
        this.maxHp = maxHp;
    }

    draw(ctx) {
        const percentage = this.currentHp / this.maxHp;
        const barWidth = this.width * percentage;

        // Hintergrund (dunkelgrau)
        ctx.fillStyle = '#333333';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Lebensbalken (grün bei voll, rot bei wenig)
        if (percentage > 0.5) {
            ctx.fillStyle = '#00FF00'; // Grün
        } else if (percentage > 0.25) {
            ctx.fillStyle = '#FFFF00'; // Gelb
        } else {
            ctx.fillStyle = '#FF0000'; // Rot
        }
        ctx.fillRect(this.x, this.y, barWidth, this.height);

        // Border
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Text mit HP
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Boss HP: ${Math.ceil(this.currentHp)} / ${this.maxHp}`, this.x + this.width / 2, this.y + this.height - 8);
    }
}
