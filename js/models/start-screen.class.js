class StartScreen {
    isVisible = true;
    
    startButtonImg = new Image();
    optionsButtonImg = new Image();
    sharkieImg = new Image();
    backgroundImg = new Image();
    
    startButtonX = 0;
    startButtonY = 0;
    startButtonWidth = 0;
    startButtonHeight = 0;
    
    optionsButtonX = 0;
    optionsButtonY = 0;
    optionsButtonWidth = 0;
    optionsButtonHeight = 0;
    
    clickHandlerAdded = false;
    
    constructor() {
        this.loadImages();
    }
    
    loadImages() {
        this.startButtonImg.src = '6.Botones/Start/1.png';
        this.optionsButtonImg.src = '6.Botones/Start/option_button_pressed.png';
        this.sharkieImg.src = '1.Sharkie/1.IDLE/1.png';
        this.backgroundImg.src = '3. Background/Mesa de trabajo 1.png';
    }
    
    handleClick(x, y) {
        if (!this.isVisible) return false;
        
        console.log('Start Screen Click:', x, y);
        console.log('Start Button:', this.startButtonX, this.startButtonY, this.startButtonWidth, this.startButtonHeight);
        console.log('Options Button:', this.optionsButtonX, this.optionsButtonY, this.optionsButtonWidth, this.optionsButtonHeight);
        
        // Start Button klicken
        if (x >= this.startButtonX && x <= this.startButtonX + this.startButtonWidth &&
            y >= this.startButtonY && y <= this.startButtonY + this.startButtonHeight) {
            this.hide();
            if (window.startGame) {
                window.startGame();
            }
            return true;
        }
        
        // Options Button klicken
        if (x >= this.optionsButtonX && x <= this.optionsButtonX + this.optionsButtonWidth &&
            y >= this.optionsButtonY && y <= this.optionsButtonY + this.optionsButtonHeight) {
            console.log('Options button clicked!');
            if (window.optionsScreen) {
                window.optionsScreen.show();
            }
            return true;
        }
        
        return false;
    }
    
    draw(ctx) {
        if (!this.isVisible) return;
        
        const canvasWidth = 800;
        const canvasHeight = 540;
        
        // Hintergrund Bild
        if (this.backgroundImg.complete) {
            ctx.drawImage(this.backgroundImg, 0, 0, canvasWidth, canvasHeight);
        } else {
            // fallback
            ctx.fillStyle = '#1a6fa9';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }
        
        // Start Button (höher positioniert)
        if (this.startButtonImg.complete) {
            this.startButtonWidth = 280;
            this.startButtonHeight = 80;
            this.startButtonX = (canvasWidth - this.startButtonWidth) / 2;
            this.startButtonY = 340;
            
            ctx.drawImage(this.startButtonImg, this.startButtonX, this.startButtonY, this.startButtonWidth, this.startButtonHeight);
        }
        
        // Options Button (unter dem Start Button)
        this.optionsButtonWidth = 280;
        this.optionsButtonHeight = 80;
        this.optionsButtonX = (canvasWidth - this.optionsButtonWidth) / 2;
        this.optionsButtonY = 440;
        
        if (this.optionsButtonImg.complete) {
            ctx.drawImage(this.optionsButtonImg, this.optionsButtonX, this.optionsButtonY, this.optionsButtonWidth, this.optionsButtonHeight);
        }
    }
    
    show() {
        this.isVisible = true;
    }
    
    hide() {
        this.isVisible = false;
    }
}
