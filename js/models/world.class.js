/**
 * Main game world - initializes all game objects, manages state variables,
 * and starts the render and collision loop.
 */
class World {

 cameraX = 0;
 GAME_WIDTH = 800;  // Spiel-Koordinaten bleiben immer 800x540
 GAME_HEIGHT = 540;
 character = new Character();
 enemies = [];
 jellyfishes = [];
 poisonBottles = [];
 animatedPoisonBottles = [];
 coins = [];
 totalCoins = 0;
 collectedCoins = 0;
 finalBoss = null;
 statusBar = new HealthBar();
 poisonBar = new PoisonBar();
 coinBar = new CoinBar();
 bossBar = new BossBar();
 winScreen = new WinScreen();
 gameOverScreen = new GameOverScreen();
 restartButton = new RestartButton();
 audioManager = new AudioManager();
 bubbleAnimations = [];
 finSlaps = [];
 isPaused = false;
 animationFrameId = null;
 throwIntervalId = null;
 darkZoneVoicePlayed = false;
 bossIntroSoundPlayed = false;
 bossLevelLocked = false;
 lastBossBottleDropAt = 0;
 bossBottleDropCooldown = 5500;
 maxBossFightBottles = 4;

backgroundObjectsLight = [
    new BackgroundObject('3. Background/Layers/5. Water/L.png', 0, 0),
    new BackgroundObject('3. Background/Layers/3.Fondo 1/L.png', 0, 0),
    new BackgroundObject('3. Background/Layers/4.Fondo 2/L.png', 0, 0),
    new BackgroundObject('3. Background/Layers/2. Floor/L.png', 0, 0),
    new BackgroundObject('3. Background/Layers/1. Light/COMPLETO.png', 0, 0),
    new BackgroundObject('3. Background/Layers/5. Water/L.png', 960, 0),
    new BackgroundObject('3. Background/Layers/3.Fondo 1/L.png', 960, 0),
    new BackgroundObject('3. Background/Layers/4.Fondo 2/L.png', 960, 0),
    new BackgroundObject('3. Background/Layers/2. Floor/L.png', 960, 0),
    new BackgroundObject('3. Background/Layers/1. Light/COMPLETO.png', 960, 0),
    new BackgroundObject('3. Background/Layers/5. Water/L.png', 1920, 0),
    new BackgroundObject('3. Background/Layers/3.Fondo 1/L.png', 1920, 0),
    new BackgroundObject('3. Background/Layers/4.Fondo 2/L.png', 1920, 0),
    new BackgroundObject('3. Background/Layers/2. Floor/L.png', 1920, 0),
    new BackgroundObject('3. Background/Layers/1. Light/COMPLETO.png', 1920, 0),
    new BackgroundObject('3. Background/Layers/5. Water/L.png', 2880, 0),
    new BackgroundObject('3. Background/Layers/3.Fondo 1/L.png', 2880, 0),
    new BackgroundObject('3. Background/Layers/4.Fondo 2/L.png', 2880, 0),
    new BackgroundObject('3. Background/Layers/2. Floor/L.png', 2880, 0),
    new BackgroundObject('3. Background/Layers/1. Light/COMPLETO.png', 2880, 0),
    new BackgroundObject('3. Background/Layers/5. Water/L.png', 3840, 0),
    new BackgroundObject('3. Background/Layers/3.Fondo 1/L.png', 3840, 0),
    new BackgroundObject('3. Background/Layers/4.Fondo 2/L.png', 3840, 0),
    new BackgroundObject('3. Background/Layers/2. Floor/L.png', 3840, 0),
    new BackgroundObject('3. Background/Layers/1. Light/COMPLETO.png', 3840, 0),
];
backgroundObjectsDark = [
    new BackgroundObject('3. Background/Dark/2.png', 4800, 0),
    new BackgroundObject('3. Background/Dark/1.png', 4800, 0),
    new BackgroundObject('3. Background/Dark/completo.png', 4800, 0),
    new BackgroundObject('3. Background/Dark/2.png', 5756, 0),
    new BackgroundObject('3. Background/Dark/1.png', 5756, 0),
    new BackgroundObject('3. Background/Dark/completo.png', 5756, 0),
];
mapWidth = 6720;
bossZoneStart = 4800;
canvas; 
ctx; 

    
    /**
     * Creates the game world on the given canvas and starts the game loop.
     *
     * @param {HTMLCanvasElement} canvas The target canvas element.
     * @returns {void}
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.initWorldObjects();
        this.initWorldScreens();
        this.startWorld();
    }

    /**
     * Initializes all world objects: character ref, background, and entities.
     *
     * @returns {void}
     */
    initWorldObjects() {
        this.character.world = this;
        this.initBackground();
        this.initEntities();
    }

    /**
     * Assembles the background layer arrays from light and dark objects.
     *
     * @returns {void}
     */
    initBackground() {
        this.backgroundObjects = [...this.backgroundObjectsLight, ...this.backgroundObjectsDark];
        this.lightLayers = this.backgroundObjectsLight.filter((bg, index) => index % 5 === 4);
    }

    /**
     * Creates all entities (enemies, items, coins, boss) and initializes bars.
     *
     * @returns {void}
     */
    initEntities() {
        this.enemies = this.createEnemies();
        this.jellyfishes = this.createJellyfishes();
        this.poisonBottles = this.createPoisonBottles();
        this.animatedPoisonBottles = this.createAnimatedPoisonBottles();
        this.coins = this.createCoins();
        this.totalCoins = this.coins.length;
        this.collectedCoins = 0;
        this.coinBar.setPercentage(0, this.totalCoins);
        this.finalBoss = new FinalBoss(this.mapWidth - 500, 80);
        this.bossBar.setPercentage(this.finalBoss.hp, this.finalBoss.maxHp);
    }

    /**
     * Initializes world screens.
     *
     * @returns {void}
     */
    initWorldScreens() {
        this.winScreen.hide();
        this.gameOverScreen.hide();
        this.restartButton.hide();
    }

    /**
     * Starts world loop and audio.
     *
     * @returns {void}
     */
    startWorld() {
        this.handleThrow();
        this.audioManager.play();
        this.draw();
    }

    /**
     * Creates randomly distributed pufferfish enemies on the map.
     * @returns {Pufferfish[]}
     */
    createEnemies() {
        return this.createRandomActors(10, 700, 4500, 80, this.canvas.height - 120,
            (x, y) => new Pufferfish(x, y));
    }

    /**
     * Creates randomly distributed jellyfish on the map.
     * @returns {Jellyfish[]}
     */
    createJellyfishes() {
        return this.createRandomActors(12, 700, 4500, 80, this.canvas.height - 120,
            (x, y) => new Jellyfish(x, y));
    }

    /**
     * Creates random actors.
     *
     * @param {number} count Number of actors to create.
     * @param {number} minX Minimum X coordinate.
     * @param {number} maxX Maximum X coordinate.
     * @param {number} minY Minimum Y coordinate.
     * @param {number} maxY Maximum Y coordinate.
     * @param {Function} factory Factory function to create actors.
     * @returns {any[]} Array of created actors.
     */
    createRandomActors(count, minX, maxX, minY, maxY, factory) {
        const safeMaxY = Math.max(minY, maxY);
        return Array.from({length: count}, () => {
            const x = minX + Math.random() * (maxX - minX);
            const y = minY + Math.random() * (safeMaxY - minY);
            return factory(x, y);
        });
    }

    /**
     * Creates static poison bottles on the map.
     * @returns {PoisonBottle[]}
     */
    createPoisonBottles() {
        return this.createRandomActors(12, 200, 4500, 400, 450,
            (x, y) => new PoisonBottle(x, y));
    }

    /**
     * Creates animated (falling) poison bottles on the map.
     * @returns {AnimatedPoisonBottle[]}
     */
    createAnimatedPoisonBottles() {
    const bottles = [];
    const count = 5;
    const minX = 500;
    const maxX = 4000;

    for (let i = 0; i < count; i++) {
        const x = minX + Math.random() * (maxX - minX);
        bottles.push(new AnimatedPoisonBottle(x));
    }

    return bottles;
}

    /**
     * Creates randomly distributed coins on the map.
     * @returns {Coin[]}
     */
    createCoins() {
        return this.createRandomActors(10, 200, 4500, 80, this.canvas.height - 120,
            (x, y) => new Coin(x, y));
    }

    /**
     * Starts the throw interval for keys F (normal bubble), D (poison bubble) and spacebar (fin slap).
     * @returns {void}
     */
    handleThrow() {
        if (this.throwIntervalId) {
            clearInterval(this.throwIntervalId);
        }
        this.throwIntervalId = setInterval(() => this.tickThrowInput(), 100);
    }

    /**
     * Processes throw input tick.
     *
     * @returns {void}
     */
    tickThrowInput() {
        if (this.isPaused) return;
        if (keyboard && keyboard.F) this.character.throwNormalBubble();
        if (keyboard && keyboard.D) {
            this.character.throwPoisonBubble();
            this.poisonBar.setPercentage(this.character.poison);
        }
        if (keyboard && keyboard.SPACE) this.character.throwFinSlap();
    }

}
