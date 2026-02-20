class StartScreen {
    isVisible = true;
    
    startButtonImg = new Image();
    sharkieImg = new Image();
    backgroundImg = new Image();
    
    buttonX = 0;
    buttonY = 0;
    buttonWidth = 0;
    buttonHeight = 0;
    
    constructor() {
        this.loadImages();
        this.setupClickHandler();
    }
    
    loadImages() {
        this.startButtonImg.src = '6.Botones/Start/1.png';
        this.sharkieImg.src = '1.Sharkie/1.IDLE/1.png';
        this.backgroundImg.src = '3. Background/Mesa de trabajo 1.png';
    }
    
    setupClickHandler() {
        const canvas = document.getElementById('canvas');
        canvas.addEventListener('click', (e) => {
            if (!this.isVisible) return;
            
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            // start button klicken
            if (clickX >= this.buttonX && clickX <= this.buttonX + this.buttonWidth &&
                clickY >= this.buttonY && clickY <= this.buttonY + this.buttonHeight) {
                this.hide();
                if (window.startGame) {
                    window.startGame();
                }
            }
        });
    }
    
    draw(ctx) {
        if (!this.isVisible) return;
        
        const canvasWidth = 800;
        const canvasHeight = 540;
        
        // Hintergrund bild
        if (this.backgroundImg.complete) {
            ctx.drawImage(this.backgroundImg, 0, 0, canvasWidth, canvasHeight);
        } else {
            // fallback
            ctx.fillStyle = '#1a6fa9';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }
        
       
        
        // start button
        if (this.startButtonImg.complete) {
            this.buttonWidth = 280;
            this.buttonHeight = 80;
            this.buttonX = (canvasWidth - this.buttonWidth) / 2;
            this.buttonY = 420;
            
            ctx.drawImage(this.startButtonImg, this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);
        }
    }
    
    show() {
        this.isVisible = true;
    }
    
    hide() {
        this.isVisible = false;
    }
}
