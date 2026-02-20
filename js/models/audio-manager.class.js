class AudioManager {
    bgMusic = new Audio();
    coinSound = new Audio();
    failSound = new Audio();
    potionSound = new Audio();
    isPlaying = false;
    sfxVolume = 0.6;
    
    constructor() {
        this.loadAudio();
    }
    
    loadAudio() {
        this.bgMusic.src = 'audio/Super Mario 64 Soundtrack - Dire, Dire Docks.mp3';
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.5;

        this.coinSound.src = 'audio/Coin Sound.mp3';
        this.coinSound.volume = this.sfxVolume;

        this.failSound.src = 'audio/Fail.mp3';
        this.failSound.volume = this.sfxVolume;

        this.potionSound.src = 'audio/Potion.mp3';
        this.potionSound.volume = this.sfxVolume;
    }
    
    play() {
        if (this.isPlaying) return;
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
}
