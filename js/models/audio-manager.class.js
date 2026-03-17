/**
 * Verwaltet alle Audio-Ressourcen des Spiels – Hintergrundmusik, Soundeffekte,
 * Lautstärke-Einstellungen und Stummschaltung.
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
    
    constructor() {
        this.loadAudio();
    }
    
    /**
     * Lädt alle Audio-Dateipfade und setzt initiale Lautstärken.
     * @returns {void}
     */
    loadAudio() {
        this.bgMusic.src = 'audio/Super Mario 64 Soundtrack - Dire, Dire Docks.mp3';
        this.bgMusic.loop = true;
        this.bgMusic.volume = this.musicVolume;

        this.coinSound.src = 'audio/Gold.mp3';
        this.coinSound.volume = this.sfxVolume;

        this.failSound.src = 'audio/Fail.mp3';
        this.failSound.volume = this.sfxVolume;

        this.potionSound.src = 'audio/Potion.mp3';
        this.potionSound.volume = this.sfxVolume;

        this.victorySound.src = 'audio/8 BIT Victory sound effect.mp3';
        this.victorySound.volume = this.sfxVolume;
        
        this.finSlapSound.src = 'audio/Punch.mp3';
        this.finSlapSound.volume = this.sfxVolume;

        this.electricSound.src = 'audio/Electricity.mp3';
        this.electricSound.volume = this.sfxVolume;

        this.hurtSound.src = 'audio/confusion.mp3';
        this.hurtSound.volume = this.sfxVolume;

        this.bubbleShootSound.src = 'audio/Bubbleshoot.mp3';
        this.bubbleShootSound.volume = this.sfxVolume;

        this.poisonShootSound.src = 'audio/Poisenshoot.mp3';
        this.poisonShootSound.volume = this.sfxVolume;

        this.darkZoneVoiceSound.src = 'audio/DU KANNST NICHT VORBEI!!!.mp3';
        this.darkZoneVoiceSound.volume = this.sfxVolume;

        this.bossIntroSound.src = 'audio/chiiri-monster.mp3';
        this.bossIntroSound.volume = this.sfxVolume;
    }
    
    /**
     * Startet die Hintergrundmusik (wenn nicht stummgeschaltet und Musik aktiviert).
     * @returns {void}
     */
    play() {
        if (this.isMuted || !this.isBackgroundMusicEnabled || this.isPlaying) return;
        this.bgMusic.play();
        this.isPlaying = true;
    }
    
    /**
     * Pausiert die Hintergrundmusik.
     * @returns {void}
     */
    pause() {
        this.bgMusic.pause();
        this.isPlaying = false;
    }
    
    /**
     * Stoppt die Hintergrundmusik und setzt die Abspielposition auf den Anfang zurück.
     * @returns {void}
     */
    stop() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
        this.isPlaying = false;
    }
    
    /**
     * Setzt die Musik-Lautstärke und wendet sie sofort an.
     * @param {number} volume Lautstärke (0–1).
     * @returns {void}
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.bgMusic.volume = this.isMuted ? 0 : this.musicVolume;
    }

    /**
     * Aktiviert oder deaktiviert die Stummschaltung für alle Sounds.
     * @param {boolean} muted true = stummschalten.
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
     * Aktiviert oder deaktiviert die Hintergrundmusik separat von der Stummschaltung.
     * @param {boolean} enabled true = Musik aktivieren.
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
     * Setzt die Lautstärke aller Soundeffekte.
     * @param {number} volume Lautstärke (0–1).
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
     * Spielt den Münz-Sound ab (geklont, damit überlappend möglich).
     * @returns {void}
     */
    playCoinSound() {
        if (this.isMuted) return;
        const coin = this.coinSound.cloneNode();
        coin.volume = this.sfxVolume;
        coin.play();
    }

    /**
     * Spielt den Fail-Sound beim Tod des Spielers ab.
     * @returns {void}
     */
    playFailSound() {
        if (this.isMuted) return;
        const fail = this.failSound.cloneNode();
        fail.volume = this.sfxVolume;
        fail.play();
    }

    /**
     * Spielt den Trank-Sound beim Einsammeln einer Giftflasche ab.
     * @returns {void}
     */
    playPotionSound() {
        if (this.isMuted) return;
        const potion = this.potionSound.cloneNode();
        potion.volume = this.sfxVolume;
        potion.play();
    }

    /**
     * Spielt den Victory-Sound beim Besiegen des Bosses ab.
     * @returns {void}
     */
    playVictorySound() {
        if (this.isMuted) return;
        const victory = this.victorySound.cloneNode();
        victory.volume = this.sfxVolume;
        victory.play();
    }

    /**
     * Spielt den Flossenschlag-Sound ab.
     * @returns {void}
     */
    playFinSlapSound() {
        if (this.isMuted) return;
        const fin = this.finSlapSound.cloneNode();
        fin.volume = this.sfxVolume;
        fin.play();
    }

    /**
     * Spielt den Elektro-Schock-Sound ab (Treffer durch elektrische Qualle).
     * @returns {void}
     */
    playElectricSound() {
        if (this.isMuted) return;
        const elec = this.electricSound.cloneNode();
        elec.volume = this.sfxVolume;
        elec.play();
    }

    /**
     * Spielt den Treffer-Sound bei normalen Giftangriffen ab.
     * @returns {void}
     */
    playHurtSound() {
        if (this.isMuted) return;
        const hurt = this.hurtSound.cloneNode();
        hurt.volume = this.sfxVolume;
        hurt.play();
    }

    /**
     * Spielt den Sound beim Abfeuern einer normalen Blase ab.
     * @returns {void}
     */
    playBubbleShootSound() {
        if (this.isMuted) return;
        const bubble = this.bubbleShootSound.cloneNode();
        bubble.volume = this.sfxVolume;
        bubble.play();
    }

    /**
     * Spielt den Sound beim Abfeuern einer Giftblase ab.
     * @returns {void}
     */
    playPoisonShootSound() {
        if (this.isMuted) return;
        const poison = this.poisonShootSound.cloneNode();
        poison.volume = this.sfxVolume;
        poison.play();
    }

    /**
     * Spielt die Sprachausgabe beim Betreten der dunklen Bosszone ab.
     * @returns {void}
     */
    playDarkZoneVoiceSound() {
        if (this.isMuted) return;
        const voice = this.darkZoneVoiceSound.cloneNode();
        voice.volume = this.sfxVolume;
        voice.play();
    }

    /**
     * Spielt den Boss-Intro-Sound beim ersten Erscheinen des Bosses ab.
     * @returns {void}
     */
    playBossIntroSound() {
        if (this.isMuted) return;
        const intro = this.bossIntroSound.cloneNode();
        intro.volume = this.sfxVolume;
        intro.play();
    }
}
