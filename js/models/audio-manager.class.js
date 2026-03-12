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
    isPlaying = false;
    isBackgroundMusicEnabled = true;
    sfxVolume = 0.6;
    
    constructor() {
        this.loadAudio();
    }
    
    loadAudio() {
        this.bgMusic.src = 'audio/Super Mario 64 Soundtrack - Dire, Dire Docks.mp3';
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.5;

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
    }
    
    play() {
        if (!this.isBackgroundMusicEnabled || this.isPlaying) return;
        this.bgMusic.play();
        this.isPlaying = true;
    }
    
    pause() {
        this.bgMusic.pause();
        this.isPlaying = false;
    }
    
    stop() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
        this.isPlaying = false;
    }
    
    setVolume(volume) {
        this.bgMusic.volume = Math.max(0, Math.min(1, volume));
    }

    setMusicVolume(volume) {
        this.bgMusic.volume = Math.max(0, Math.min(1, volume));
    }

    setBackgroundMusicEnabled(enabled) {
        this.isBackgroundMusicEnabled = !!enabled;

        if (!this.isBackgroundMusicEnabled) {
            this.pause();
            return;
        }

        this.play();
    }

    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.coinSound.volume = this.sfxVolume;
        this.failSound.volume = this.sfxVolume;
        this.potionSound.volume = this.sfxVolume;
        this.victorySound.volume = this.sfxVolume;
        this.finSlapSound.volume = this.sfxVolume;
        this.electricSound.volume = this.sfxVolume;
        this.hurtSound.volume = this.sfxVolume;
        this.bubbleShootSound.volume = this.sfxVolume;
        this.poisonShootSound.volume = this.sfxVolume;
        this.darkZoneVoiceSound.volume = this.sfxVolume;
    }

    playCoinSound() {
        const coin = this.coinSound.cloneNode();
        coin.volume = this.sfxVolume;
        coin.play();
    }

    playFailSound() {
        const fail = this.failSound.cloneNode();
        fail.volume = this.sfxVolume;
        fail.play();
    }

    playPotionSound() {
        const potion = this.potionSound.cloneNode();
        potion.volume = this.sfxVolume;
        potion.play();
    }

    playVictorySound() {
        const victory = this.victorySound.cloneNode();
        victory.volume = this.sfxVolume;
        victory.play();
    }

    playFinSlapSound() {
        const fin = this.finSlapSound.cloneNode();
        fin.volume = this.sfxVolume;
        fin.play();
    }

    playElectricSound() {
        const elec = this.electricSound.cloneNode();
        elec.volume = this.sfxVolume;
        elec.play();
    }

    playHurtSound() {
        const hurt = this.hurtSound.cloneNode();
        hurt.volume = this.sfxVolume;
        hurt.play();
    }

    playBubbleShootSound() {
        const bubble = this.bubbleShootSound.cloneNode();
        bubble.volume = this.sfxVolume;
        bubble.play();
    }

    playPoisonShootSound() {
        const poison = this.poisonShootSound.cloneNode();
        poison.volume = this.sfxVolume;
        poison.play();
    }

    playDarkZoneVoiceSound() {
        const voice = this.darkZoneVoiceSound.cloneNode();
        voice.volume = this.sfxVolume;
        voice.play();
    }
}
