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
        const safeMax = Math.max(this.maxHp, 1);
        const percentage = Math.min(Math.max(this.currentHp / safeMax, 0), 1);
        const borderWidth = 3;
        const padding = borderWidth + 2; // Platz für Rahmen + extra Abstand
        const innerWidth = this.width - (padding * 2);
        const innerHeight = this.height - (padding * 2);
        const barWidth = innerWidth * percentage;

        // Äußerer Rahmen zuerst (Hintergrund)
        ctx.fillStyle = '#333333';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Border (weißer Rahmen)
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = borderWidth;
        ctx.strokeRect(this.x + borderWidth/2, this.y + borderWidth/2, this.width - borderWidth, this.height - borderWidth);

        // Lebensbalken (grün bei voll, rot bei wenig) - innerhalb des Rahmens
        if (percentage > 0.5) {
            ctx.fillStyle = '#00FF00'; // Grün
        } else if (percentage > 0.25) {
            ctx.fillStyle = '#FFFF00'; // Gelb
        } else {
            ctx.fillStyle = '#FF0000'; // Rot
        }
        ctx.fillRect(this.x + padding, this.y + padding, barWidth, innerHeight);

        // Text mit HP
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Boss HP: ${Math.ceil(this.currentHp)} / ${this.maxHp}`, this.x + this.width / 2, this.y + this.height - 8);
    }
}
