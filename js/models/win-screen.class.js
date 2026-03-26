/**
 * Win screen - displayed after boss death with fade-in effect.
 */
class WinScreen {
  youWinImg = null;
  isVisible = false;
  youWinWidth = 800;
  youWinHeight = 540;
  soundPlayed = false;
  world = null;
  opacity = 0;
  fadeInSpeed = 0.03;

  /**
   * Creates a new instance.
   */
  constructor() {
    this.youWinImg = new Image();
    this.youWinImg.src = encodeURI(
      "6.Botones/Tittles/You win/Mesa de trabajo 1.png",
    );
  }

  /**
   * Draws the win screen with gold glow effect on canvas.
   * @param {CanvasRenderingContext2D} ctx Drawing context.
   * @returns {void}
   */
  draw(ctx) {
    if (!this.isVisible) return;
    this.advanceFadeIn();
    ctx.save();
    ctx.globalAlpha = this.opacity;
    this.renderWinBackground(ctx);
    this.renderWinImage(ctx);
    ctx.restore();
  }

  /**
   * Advances fade-in.
   * @returns {void}
   */
  advanceFadeIn() {
    if (this.opacity < 1) {
      this.opacity = Math.min(1, this.opacity + this.fadeInSpeed);
    }
  }

  /**
   * Renders win background.
   * @param {CanvasRenderingContext2D} ctx Drawing context.
   * @returns {void}
   */
  renderWinBackground(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 800, 540);
  }

  /**
   * Renders win image.
   * @param {CanvasRenderingContext2D} ctx Drawing context.
   * @returns {void}
   */
  renderWinImage(ctx) {
    if (!this.youWinImg || !this.youWinImg.complete) return;
    const x = (800 - this.youWinWidth) / 2;
    const y = (540 - this.youWinHeight) / 2 - 40;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.shadowColor = "#FFD700";
    ctx.shadowBlur = 30;
    ctx.drawImage(this.youWinImg, x, y, this.youWinWidth, this.youWinHeight);
  }

  /**
   * Displays the win screen and plays the victory sound.
   * @param {AudioManager} audioManager Audio manager for the victory sound.
   * @returns {void}
   */
  show(audioManager) {
    if (!this.isVisible && !this.soundPlayed) {
      this.opacity = 0;
      this.soundPlayed = true;
      if (audioManager) {
        audioManager.playSfx("victory");
      }
    }
    this.isVisible = true;
  }

  /**
   * Hides the win screen and resets all states.
   * @returns {void}
   */
  hide() {
    this.isVisible = false;
    this.soundPlayed = false;
    this.opacity = 0;
  }
}
