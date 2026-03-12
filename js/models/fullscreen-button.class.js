class FullscreenButton {
    ctx = null;
    canvas = null;
    fullscreenContainer = null;

    constructor() {}

    setCanvasContext(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.fullscreenContainer = canvas?.closest('.game-panel') || canvas;
    }

    
    draw() {}

    isFullscreen() {
        return !!document.fullscreenElement;
    }
}
