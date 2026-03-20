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
        if (!playPromise || typeof playPromise.catch !== 'function') {
            return;
        }
        playPromise.catch((error) => {
            if (error && error.name === 'AbortError') {
                return;
            }
            console.error(error);
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
     */
    loadMusicTracks() {
        this.bgMusic.src = 'audio/Super Mario 64 Soundtrack - Dire, Dire Docks.mp3';
        this.bgMusic.loop = true;
        this.bgMusic.volume = this.musicVolume;
    }

    /**
     * Loads SFX tracks.
     */
    loadSfxTracks() {
        this.coinSound.src = 'audio/Gold.mp3';
        this.failSound.src = 'audio/Fail.mp3';
        this.potionSound.src = 'audio/Potion.mp3';
        this.victorySound.src = 'audio/8 BIT Victory sound effect.mp3';
        this.finSlapSound.src = 'audio/Punch.mp3';
        this.electricSound.src = 'audio/Electricity.mp3';
        this.hurtSound.src = 'audio/confusion.mp3';
        this.bubbleShootSound.src = 'audio/Bubbleshoot.mp3';
        this.poisonShootSound.src = 'audio/Poisenshoot.mp3';
        this.applySfxVolumes();
    }

    /**
     * Applies SFX volumes.
     */
    applySfxVolumes() {
        const sfx = [this.coinSound, this.failSound, this.potionSound, this.victorySound,
            this.finSlapSound, this.electricSound, this.hurtSound,
            this.bubbleShootSound, this.poisonShootSound];
        sfx.forEach(s => { s.volume = this.sfxVolume; });
    }

    /**
     * Loads voice tracks.
     */
    loadVoiceTracks() {
        this.darkZoneVoiceSound.src = 'audio/DU KANNST NICHT VORBEI!!!.mp3';
        this.darkZoneVoiceSound.volume = this.sfxVolume;
        this.bossIntroSound.src = 'audio/chiiri-monster.mp3';
        this.bossIntroSound.volume = this.sfxVolume;
    }
    
    /**
     * Starts background music (if not muted and music is enabled).
     * @returns {void}
     */
    play() {
        if (this.isMuted || !this.isBackgroundMusicEnabled || this.isPlaying) return;
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
        this.coinSound.volume = this.sfxVolume;
        this.failSound.volume = this.sfxVolume;
        this.potionSound.volume = this.sfxVolume;
        this.victorySound.volume = this.sfxVolume;
        this.finSlapSound.volume = this.sfxVolume;
        this.electricSound.volume = this.sfxVolume;
        this.hurtSound.volume = this.sfxVolume;
        this.bossIntroSound.volume = this.sfxVolume;
        this.bubbleShootSound.volume = this.sfxVolume;
        this.poisonShootSound.volume = this.sfxVolume;
        this.darkZoneVoiceSound.volume = this.sfxVolume;
    }

    /**
     * Plays the coin sound (cloned so overlapping is possible).
     * @returns {void}
     */
    playCoinSound() {
        if (this.isMuted) return;
        const coin = this.coinSound.cloneNode();
        coin.volume = this.sfxVolume;
        this.playAudio(coin);
    }

    /**
     * Plays the fail sound when the player dies.
     * @returns {void}
     */
    playFailSound() {
        if (this.isMuted) return;
        const fail = this.failSound.cloneNode();
        fail.volume = this.sfxVolume;
        this.playAudio(fail);
    }

    /**
     * Plays the potion sound when collecting a poison bottle.
     * @returns {void}
     */
    playPotionSound() {
        if (this.isMuted) return;
        const potion = this.potionSound.cloneNode();
        potion.volume = this.sfxVolume;
        this.playAudio(potion);
    }

    /**
     * Plays the victory sound when defeating the boss.
     * @returns {void}
     */
    playVictorySound() {
        if (this.isMuted) return;
        const victory = this.victorySound.cloneNode();
        victory.volume = this.sfxVolume;
        this.playAudio(victory);
    }

    /**
     * Plays the fin slap sound.
     * @returns {void}
     */
    playFinSlapSound() {
        if (this.isMuted) return;
        const fin = this.finSlapSound.cloneNode();
        fin.volume = this.sfxVolume;
        this.playAudio(fin);
    }

    /**
     * Plays the electric shock sound (hit by electric jellyfish).
     * @returns {void}
     */
    playElectricSound() {
        if (this.isMuted) return;
        const elec = this.electricSound.cloneNode();
        elec.volume = this.sfxVolume;
        this.playAudio(elec);
    }

    /**
     * Plays the hurt sound for normal poison attacks.
     * @returns {void}
     */
    playHurtSound() {
        if (this.isMuted) return;
        const hurt = this.hurtSound.cloneNode();
        hurt.volume = this.sfxVolume;
        this.playAudio(hurt);
    }

    /**
     * Plays the sound when firing a normal bubble.
     * @returns {void}
     */
    playBubbleShootSound() {
        if (this.isMuted) return;
        const bubble = this.bubbleShootSound.cloneNode();
        bubble.volume = this.sfxVolume;
        this.playAudio(bubble);
    }

    /**
     * Plays the sound when firing a poison bubble.
     * @returns {void}
     */
    playPoisonShootSound() {
        if (this.isMuted) return;
        const poison = this.poisonShootSound.cloneNode();
        poison.volume = this.sfxVolume;
        this.playAudio(poison);
    }

    /**
     * Plays voice output when entering the dark boss zone.
     * @returns {void}
     */
    playDarkZoneVoiceSound() {
        if (this.isMuted) return;
        const voice = this.darkZoneVoiceSound.cloneNode();
        voice.volume = this.sfxVolume;
        this.playAudio(voice);
    }

    /**
     * Plays the boss intro sound when the boss first appears.
     * @returns {void}
     */
    playBossIntroSound() {
        if (this.isMuted) return;
        const intro = this.bossIntroSound.cloneNode();
        intro.volume = this.sfxVolume;
        this.playAudio(intro);
    }
}
