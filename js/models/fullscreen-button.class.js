/**
 * Vollbild-Button – verwaltet den Canvas-Kontext und den Vollbild-Zustand.
 */
class FullscreenButton {
    ctx = null;
    canvas = null;
    fullscreenContainer = null;

    /**
     * Speichert Canvas, Zeichenkontext und Vollbild-Container.
     * @param {HTMLCanvasElement} canvas Das Canvas-Element.
     * @param {CanvasRenderingContext2D} ctx Der Zeichenkontext.
     * @returns {void}
     */
    setCanvasContext(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.fullscreenContainer = canvas?.closest('.game-panel') || canvas;
    }

    /**
     * Gibt zurück ob sich das Dokument aktuell im Vollbildmodus befindet.
     * @returns {boolean}
     */
    isFullscreen() {
        return !!document.fullscreenElement;
    }
}
