class AudioManager {
    bgMusic = new Audio();
    isPlaying = false;
    
    constructor() {
        this.loadAudio();
    }
    
    loadAudio() {
        this.bgMusic.src = 'audio/Super Mario 64 Soundtrack - Dire, Dire Docks.mp3';
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.5;
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
}
