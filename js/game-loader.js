let isAssetLoading = false;
let assetLoadingIntervalId = null;

/**
 * Starts the loading gate and unlocks gameplay only after assets are ready.
 * @param {Function} onReady Callback executed after loading finishes.
 * @returns {void}
 */
function startAssetLoadingGate(onReady) {
  stopAssetLoadingGate();
  isAssetLoading = true;
  showLoadingOverlay();
  renderLoadingProgress(0);
  if (world && typeof world.pauseGame === "function") world.pauseGame();
  const startedAt = Date.now();
  assetLoadingIntervalId = setInterval(
    () => tickAssetLoading(onReady, startedAt),
    120,
  );
}

/**
 * Stops loading gate timers and hides loading UI.
 * @returns {void}
 */
function stopAssetLoadingGate() {
  if (assetLoadingIntervalId) {
    clearInterval(assetLoadingIntervalId);
    assetLoadingIntervalId = null;
  }
  isAssetLoading = false;
  hideLoadingOverlay();
}

/**
 * Advances loading progress and resolves the loading gate when ready.
 * @param {Function} onReady Callback executed after loading finishes.
 * @param {number} startedAt Timestamp when loading started.
 * @returns {void}
 */
function tickAssetLoading(onReady, startedAt) {
  const progress = getAssetLoadingProgress();
  renderLoadingProgress(progress);
  const timeoutReached = Date.now() - startedAt > 12000;
  if (progress < 0.995 && !timeoutReached) return;
  if (assetLoadingIntervalId) clearInterval(assetLoadingIntervalId);
  assetLoadingIntervalId = null;
  isAssetLoading = false;
  renderLoadingProgress(1);
  setTimeout(() => {
    hideLoadingOverlay();
    if (typeof onReady === "function") onReady();
  }, 140);
}

/**
 * Computes loading progress from cached images and preloaded audio elements.
 * @returns {number} Progress between 0 and 1.
 */
function getAssetLoadingProgress() {
  const images = getTrackedImageAssets();
  const audios = getTrackedAudioAssets();
  if (images.length + audios.length === 0) return 1;
  const loadedImages = images.filter(
    (img) => img.complete && img.naturalWidth > 0,
  ).length;
  const loadedAudios = countReadyAudios(audios);
  return (loadedImages + loadedAudios) / (images.length + audios.length);
}

/**
 * Returns all tracked image assets from the shared movable-object cache.
 * @returns {HTMLImageElement[]}
 */
function getTrackedImageAssets() {
  const cache =
    MovableObject && MovableObject.sharedImageCache
      ? MovableObject.sharedImageCache
      : {};
  return Object.values(cache);
}

/**
 * Returns all audio elements used by the game's audio manager.
 * @returns {HTMLAudioElement[]}
 */
function getTrackedAudioAssets() {
  if (!world || !world.audioManager) return [];
  const a = world.audioManager;
  return [
    a.bgMusic,
    a.coinSound,
    a.failSound,
    a.potionSound,
    a.victorySound,
    a.finSlapSound,
    a.electricSound,
    a.hurtSound,
    a.bubbleShootSound,
    a.poisonShootSound,
    a.darkZoneVoiceSound,
    a.bossIntroSound,
  ].filter(Boolean);
}

/**
 * Ensures audios are preloading and counts ready elements.
 * @param {HTMLAudioElement[]} audios Audio elements.
 * @returns {number}
 */
function countReadyAudios(audios) {
  audios.forEach((audio) => {
    if (audio.preload !== "auto") audio.preload = "auto";
    if (audio.readyState === 0 && audio.src) audio.load();
  });
  return audios.filter((audio) => audio.readyState >= 1).length;
}

/**
 * Renders loading progress text and bar.
 * @param {number} progress Value between 0 and 1.
 * @returns {void}
 */
function renderLoadingProgress(progress) {
  const p = Math.max(0, Math.min(1, progress));
  const percent = Math.round(p * 100);
  const fill = $("loading-bar-fill");
  const text = $("loading-bar-text");
  const track = document.querySelector(".loading-bar-track");
  if (fill) fill.value = percent;
  if (text) text.textContent = percent + "%";
  if (track) track.setAttribute("aria-valuenow", String(percent));
}

/**
 * Shows the loading overlay.
 * @returns {void}
 */
function showLoadingOverlay() {
  const overlay = $("loading-overlay");
  if (!overlay) return;
  overlay.classList.remove("is-hidden");
}

/**
 * Hides the loading overlay.
 * @returns {void}
 */
function hideLoadingOverlay() {
  const overlay = $("loading-overlay");
  if (!overlay) return;
  overlay.classList.add("is-hidden");
}
