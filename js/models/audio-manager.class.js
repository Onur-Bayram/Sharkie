/**
 * Manages all audio resources of the game - background music, sound effects,
 * volume settings, and muting.
 */
class AudioManager {
  bgMusic = new Audio();
  coinSound = new Audio();
  failSound = new Audio();
  potionSound = new Audio();
  victorySound = new Audio();
  finSlapSound = new Audio();
  electricSound = new Audio();
  hurtSound = new Audio();
  bubbleShootSound = new Audio();
  poisonShootSound = new Audio();
  darkZoneVoiceSound = new Audio();
  bossIntroSound = new Audio();
  isPlaying = false;
  isBackgroundMusicEnabled = true;
  isMuted = false;
  musicVolume = 0.5;
  sfxVolume = 0.6;

  /**
   * Creates a new instance.
   */
  constructor() {
    this.loadAudio();
  }

  /**
   * Starts audio playback and suppresses harmless interruption errors.
   * @param {HTMLAudioElement} audio Audio element to play.
   * @returns {void}
   */
  playAudio(audio) {
    const playPromise = audio.play();
    if (!playPromise || typeof playPromise.catch !== "function") {
      return;
    }
    playPromise.catch((error) => {
      if (error && error.name === "AbortError") {
        return;
      }
    });
  }

  /**
   * Loads all audio file paths and sets initial volumes.
   * @returns {void}
   */
  loadAudio() {
    this.loadMusicTracks();
    this.loadSfxTracks();
    this.loadVoiceTracks();
  }

  /**
   * Loads music tracks.
   * @returns {void}
   */
  loadMusicTracks() {
    this.bgMusic.src = "audio/Super Mario 64 Soundtrack - Dire, Dire Docks.mp3";
    this.bgMusic.loop = true;
    this.bgMusic.volume = this.musicVolume;
  }

  /**
   * Loads SFX tracks.
   * @returns {void}
   */
  loadSfxTracks() {
    this.coinSound.src = "audio/Gold.mp3";
    this.failSound.src = "audio/Fail.mp3";
    this.potionSound.src = "audio/Potion.mp3";
    this.victorySound.src = "audio/8 BIT Victory sound effect.mp3";
    this.finSlapSound.src = "audio/Punch.mp3";
    this.electricSound.src = "audio/Electricity.mp3";
    this.hurtSound.src = "audio/confusion.mp3";
    this.bubbleShootSound.src = "audio/Bubbleshoot.mp3";
    this.poisonShootSound.src = "audio/Poisenshoot.mp3";
    this.applySfxVolumes();
  }

  /**
   * Applies SFX volumes.
   * @returns {void}
   */
  applySfxVolumes() {
    this.getSfxSounds().forEach((sound) => {
      sound.volume = this.sfxVolume;
    });
  }

  /**
   * Returns all sound effect audio elements.
   * @returns {HTMLAudioElement[]}
   */
  getSfxSounds() {
    return [
      this.coinSound,
      this.failSound,
      this.potionSound,
      this.victorySound,
      this.finSlapSound,
      this.electricSound,
      this.hurtSound,
      this.bubbleShootSound,
      this.poisonShootSound,
      this.darkZoneVoiceSound,
      this.bossIntroSound,
    ];
  }

  /**
   * Returns a sound element by logical key.
   * @param {string} name Logical SFX name.
   * @returns {HTMLAudioElement|null}
   */
  getSfxSoundByName(name) {
    const soundMap = {
      coin: this.coinSound,
      fail: this.failSound,
      potion: this.potionSound,
      victory: this.victorySound,
      finSlap: this.finSlapSound,
      electric: this.electricSound,
      hurt: this.hurtSound,
      bubbleShoot: this.bubbleShootSound,
      poisonShoot: this.poisonShootSound,
      darkZoneVoice: this.darkZoneVoiceSound,
      bossIntro: this.bossIntroSound,
    };
    return soundMap[name] || null;
  }

  /**
   * Loads voice tracks.
   * @returns {void}
   */
  loadVoiceTracks() {
    this.darkZoneVoiceSound.src = "audio/DU KANNST NICHT VORBEI!!!.mp3";
    this.darkZoneVoiceSound.volume = this.sfxVolume;
    this.bossIntroSound.src = "audio/chiiri-monster.mp3";
    this.bossIntroSound.volume = this.sfxVolume;
  }

  /**
   * Starts background music (if not muted and music is enabled).
   * @returns {void}
   */
  play() {
    if (this.isMuted || !this.isBackgroundMusicEnabled || this.isPlaying)
      return;
    this.playAudio(this.bgMusic);
    this.isPlaying = true;
  }

  /**
   * Pauses background music.
   * @returns {void}
   */
  pause() {
    this.bgMusic.pause();
    this.isPlaying = false;
  }

  /**
   * Stops background music and resets playback position to the beginning.
   * @returns {void}
   */
  stop() {
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
    this.isPlaying = false;
  }

  /**
   * Sets music volume and applies it immediately.
   * @param {number} volume Volume (0-1).
   * @returns {void}
   */
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.bgMusic.volume = this.isMuted ? 0 : this.musicVolume;
  }

  /**
   * Enables or disables muting for all sounds.
   * @param {boolean} muted true = mute.
   * @returns {void}
   */
  setMuted(muted) {
    this.isMuted = !!muted;

    if (this.isMuted) {
      this.pause();
      this.bgMusic.volume = 0;
      return;
    }

    this.bgMusic.volume = this.musicVolume;
    if (this.isBackgroundMusicEnabled) {
      this.play();
    }
  }

  /**
   * Enables or disables background music separately from muting.
   * @param {boolean} enabled true = enable music.
   * @returns {void}
   */
  setBackgroundMusicEnabled(enabled) {
    this.isBackgroundMusicEnabled = !!enabled;

    if (!this.isBackgroundMusicEnabled) {
      this.pause();
      return;
    }

    this.play();
  }

  /**
   * Sets the volume for all sound effects.
   * @param {number} volume Volume (0-1).
   * @returns {void}
   */
  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.getSfxSounds().forEach((sound) => {
      sound.volume = this.sfxVolume;
    });
  }

  /**
   * Plays a cloned SFX instance so overlapping playback is possible.
   * @param {HTMLAudioElement} sound Source sound element.
   * @returns {void}
   */
  playClonedSfx(sound) {
    if (this.isMuted) return;
    const clone = sound.cloneNode();
    clone.volume = this.sfxVolume;
    this.playAudio(clone);
  }

  /**
   * Plays a SFX by logical key.
   *
   * @param {'coin'|'fail'|'potion'|'victory'|'finSlap'|'electric'|'hurt'|'bubbleShoot'|'poisonShoot'|'darkZoneVoice'|'bossIntro'} name Sound key.
   * @returns {void}
   */
  playSfx(name) {
    const sound = this.getSfxSoundByName(name);
    if (!sound) return;
    this.playClonedSfx(sound);
  }
}
