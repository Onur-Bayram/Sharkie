class FullscreenButton {
    ctx = null;
    canvas = null;
    
    // Button-Position (unten rechts)
    buttonX = 0;
    buttonY = 0;
    buttonSize = 40;
    padding = 15;
    
    // Farben
    bgColor = 'rgba(40, 90, 150, 0.9)';
    bgHoverColor = 'rgba(70, 130, 180, 0.95)';
    iconColor = '#e0f7ff';
    borderColor = '#00d4ff';
    shadowColor = 'rgba(0, 150, 200, 0.3)';

    constructor() {
        this.updatePosition();
    }

    setCanvasContext(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.updatePosition();
    }

    updatePosition() {
        // Position basiert immer auf 800x540 (Original-Größe)
        const ORIGINAL_WIDTH = 800;
        const ORIGINAL_HEIGHT = 540;
        
        this.buttonX = ORIGINAL_WIDTH - this.buttonSize - this.padding;
        this.buttonY = ORIGINAL_HEIGHT - this.buttonSize - this.padding;
    }

    draw() {
        if (!this.ctx) return;

        const isHovered = this.isButtonHovered();
        const isFullscreen = this.isFullscreen();

        // Button-Schatten
        this.ctx.shadowColor = this.shadowColor;
        this.ctx.shadowBlur = 12;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 4;

        // Button-Hintergrund
        this.ctx.fillStyle = isHovered ? this.bgHoverColor : this.bgColor;
        this.ctx.strokeStyle = this.borderColor;
        this.ctx.lineWidth = 2;

        // Abgerundetes Rechteck
        const r = 8;
        this.ctx.beginPath();
        this.ctx.moveTo(this.buttonX + r, this.buttonY);
        this.ctx.lineTo(this.buttonX + this.buttonSize - r, this.buttonY);
        this.ctx.quadraticCurveTo(
            this.buttonX + this.buttonSize, this.buttonY,
            this.buttonX + this.buttonSize, this.buttonY + r
        );
        this.ctx.lineTo(this.buttonX + this.buttonSize, this.buttonY + this.buttonSize - r);
        this.ctx.quadraticCurveTo(
            this.buttonX + this.buttonSize, this.buttonY + this.buttonSize,
            this.buttonX + this.buttonSize - r, this.buttonY + this.buttonSize
        );
        this.ctx.lineTo(this.buttonX + r, this.buttonY + this.buttonSize);
        this.ctx.quadraticCurveTo(
            this.buttonX, this.buttonY + this.buttonSize,
            this.buttonX, this.buttonY + this.buttonSize - r
        );
        this.ctx.lineTo(this.buttonX, this.buttonY + r);
        this.ctx.quadraticCurveTo(this.buttonX, this.buttonY, this.buttonX + r, this.buttonY);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Schatten zurücksetzen
        this.ctx.shadowColor = 'transparent';

        // Icon zeichnen
        this.ctx.strokeStyle = this.iconColor;
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';

        const centerX = this.buttonX + this.buttonSize / 2;
        const centerY = this.buttonY + this.buttonSize / 2;
        const iconSize = 16;

        if (isFullscreen) {
            // Vollbild-Verlassen-Icon 
            // Pfeil oben links
            this.ctx.beginPath();
            this.ctx.moveTo(centerX - iconSize/2, centerY - iconSize/2 + 5);
            this.ctx.lineTo(centerX - iconSize/2, centerY - iconSize/2);
            this.ctx.lineTo(centerX - iconSize/2 + 5, centerY - iconSize/2);
            this.ctx.stroke();

            // Pfeil oben rechts
            this.ctx.beginPath();
            this.ctx.moveTo(centerX + iconSize/2 - 5, centerY - iconSize/2);
            this.ctx.lineTo(centerX + iconSize/2, centerY - iconSize/2);
            this.ctx.lineTo(centerX + iconSize/2, centerY - iconSize/2 + 5);
            this.ctx.stroke();

            // Pfeil unten links
            this.ctx.beginPath();
            this.ctx.moveTo(centerX - iconSize/2, centerY + iconSize/2 - 5);
            this.ctx.lineTo(centerX - iconSize/2, centerY + iconSize/2);
            this.ctx.lineTo(centerX - iconSize/2 + 5, centerY + iconSize/2);
            this.ctx.stroke();

            // Pfeil unten rechts
            this.ctx.beginPath();
            this.ctx.moveTo(centerX + iconSize/2 - 5, centerY + iconSize/2);
            this.ctx.lineTo(centerX + iconSize/2, centerY + iconSize/2);
            this.ctx.lineTo(centerX + iconSize/2, centerY + iconSize/2 - 5);
            this.ctx.stroke();
        } else {
            // Vollbild-Aktivieren-Icon (Pfeile zeigen nach außen)
            // Pfeil oben links
            this.ctx.beginPath();
            this.ctx.moveTo(centerX - iconSize/2 + 5, centerY - iconSize/2);
            this.ctx.lineTo(centerX - iconSize/2, centerY - iconSize/2);
            this.ctx.lineTo(centerX - iconSize/2, centerY - iconSize/2 + 5);
            this.ctx.stroke();

            // Pfeil oben rechts
            this.ctx.beginPath();
            this.ctx.moveTo(centerX + iconSize/2, centerY - iconSize/2 + 5);
            this.ctx.lineTo(centerX + iconSize/2, centerY - iconSize/2);
            this.ctx.lineTo(centerX + iconSize/2 - 5, centerY - iconSize/2);
            this.ctx.stroke();

            // Pfeil unten links
            this.ctx.beginPath();
            this.ctx.moveTo(centerX - iconSize/2 + 5, centerY + iconSize/2);
            this.ctx.lineTo(centerX - iconSize/2, centerY + iconSize/2);
            this.ctx.lineTo(centerX - iconSize/2, centerY + iconSize/2 - 5);
            this.ctx.stroke();

            // Pfeil unten rechts
            this.ctx.beginPath();
            this.ctx.moveTo(centerX + iconSize/2, centerY + iconSize/2 - 5);
            this.ctx.lineTo(centerX + iconSize/2, centerY + iconSize/2);
            this.ctx.lineTo(centerX + iconSize/2 - 5, centerY + iconSize/2);
            this.ctx.stroke();
        }
    }

    isButtonHovered() {
        if (!window.mousePos) return false;
        const x = window.mousePos.x;
        const y = window.mousePos.y;
        return x >= this.buttonX && x <= this.buttonX + this.buttonSize &&
               y >= this.buttonY && y <= this.buttonY + this.buttonSize;
    }

    handleClick(x, y) {
        console.log('handleClick called:', {x, y, buttonX: this.buttonX, buttonY: this.buttonY, buttonSize: this.buttonSize});
        if (x >= this.buttonX && x <= this.buttonX + this.buttonSize &&
            y >= this.buttonY && y <= this.buttonY + this.buttonSize) {
            console.log('Button clicked! Toggling fullscreen...');
            this.toggleFullscreen();
            return true;
        }
        console.log('Click outside button');
        return false;
    }

    toggleFullscreen() {
        if (!this.isFullscreen()) {
            // Vollbild aktivieren
            this.canvas.requestFullscreen();
            console.log('Vollbild aktiviert');
        } else {
            // Vollbild verlassen
            document.exitFullscreen();
            console.log('Vollbild verlassen');
        }
    }

    isFullscreen() {
        return !!document.fullscreenElement;
    }
}
