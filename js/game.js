document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") keyboard.LEFT = true;
  if (e.key === "ArrowRight") keyboard.RIGHT = true;
  if (e.key === "ArrowUp") keyboard.UP = true;
  if (e.key === "ArrowDown") keyboard.DOWN = true;
  if (e.key === "d" || e.key === "D") keyboard.D = true;
  if (e.key === "f" || e.key === "F") keyboard.F = true;
  if (e.key === " ") keyboard.SPACE = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") keyboard.LEFT = false;
  if (e.key === "ArrowRight") keyboard.RIGHT = false;
  if (e.key === "ArrowUp") keyboard.UP = false;
  if (e.key === "ArrowDown") keyboard.DOWN = false;
  if (e.key === "d" || e.key === "D") keyboard.D = false;
  if (e.key === "f" || e.key === "F") keyboard.F = false;
  if (e.key === " ") keyboard.SPACE = false;
});

document.addEventListener("mousemove", (e) => {
  const position = getCanvasPointerPosition(e.clientX, e.clientY);
  if (!position) {
    return;
  }

  mousePos.x = position.x;
  mousePos.y = position.y;

  if (world && world.restartButton) {
    world.restartButton.updateHoverState(position.x, position.y);
  }
});

document.addEventListener("click", (e) => {
  if (e.target.closest("#mobile-controls")) return;
  handleCanvasPointer(e.clientX, e.clientY);
});

document.addEventListener(
  "touchstart",
  (e) => {
    if (!e.touches || e.touches.length === 0) return;
    if (e.target.closest("#mobile-controls")) return;
    const touch = e.touches[0];
    handleCanvasPointer(touch.clientX, touch.clientY);
  },
  { passive: true },
);
document.addEventListener("fullscreenchange", () => {
  const isFullscreen = !!document.fullscreenElement;
  updateCanvasResolution(isFullscreen);
});
