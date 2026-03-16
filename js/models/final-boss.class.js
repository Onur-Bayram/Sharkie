/**
 * Endgegner mit Intro-, Schwimm-, Angriffs-, Schaden- und Todeszuständen.
 */
class FinalBoss extends MovableObject {

    IMAGES_FLOATING = [
        "2.Enemy/3 Final Enemy/2.floating/1.png",
        "2.Enemy/3 Final Enemy/2.floating/2.png",
        "2.Enemy/3 Final Enemy/2.floating/3.png",
        "2.Enemy/3 Final Enemy/2.floating/4.png",
        "2.Enemy/3 Final Enemy/2.floating/5.png",
        "2.Enemy/3 Final Enemy/2.floating/6.png",
        "2.Enemy/3 Final Enemy/2.floating/7.png",
        "2.Enemy/3 Final Enemy/2.floating/8.png",
        "2.Enemy/3 Final Enemy/2.floating/9.png",
        "2.Enemy/3 Final Enemy/2.floating/10.png",
        "2.Enemy/3 Final Enemy/2.floating/11.png",
        "2.Enemy/3 Final Enemy/2.floating/12.png",
        "2.Enemy/3 Final Enemy/2.floating/13.png"
    ];

    IMAGES_INTRODUCE = [
        "2.Enemy/3 Final Enemy/1.Introduce/1.png",
        "2.Enemy/3 Final Enemy/1.Introduce/2.png",
        "2.Enemy/3 Final Enemy/1.Introduce/3.png",
        "2.Enemy/3 Final Enemy/1.Introduce/4.png",
        "2.Enemy/3 Final Enemy/1.Introduce/5.png",
        "2.Enemy/3 Final Enemy/1.Introduce/6.png",
        "2.Enemy/3 Final Enemy/1.Introduce/7.png",
        "2.Enemy/3 Final Enemy/1.Introduce/8.png",
        "2.Enemy/3 Final Enemy/1.Introduce/9.png",
        "2.Enemy/3 Final Enemy/1.Introduce/10.png"
    ];

    IMAGES_ATTACK = [
        "2.Enemy/3 Final Enemy/Attack/1.png",
        "2.Enemy/3 Final Enemy/Attack/2.png",
        "2.Enemy/3 Final Enemy/Attack/3.png",
        "2.Enemy/3 Final Enemy/Attack/4.png",
        "2.Enemy/3 Final Enemy/Attack/5.png",
        "2.Enemy/3 Final Enemy/Attack/6.png"
    ];

    IMAGES_HURT = [
        "2.Enemy/3 Final Enemy/Hurt/1.png",
        "2.Enemy/3 Final Enemy/Hurt/2.png",
        "2.Enemy/3 Final Enemy/Hurt/3.png",
        "2.Enemy/3 Final Enemy/Hurt/4.png"
    ];

    IMAGES_DEAD = [
        "2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2.png",
        "2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 6.png",
        "2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 7.png",
        "2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 8.png",
        "2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 9.png",
        "2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 10.png"
    ];

    introduced = false;
    maxHp = 1000;
    hp = 1000;
    isDead = false;
    isVisible = false;
    isActive = false;
    hasStartedIntro = false;
    isHurt = false;
    isAttacking = false;
    lastAttackTime = 0;
    deadAnimationFinished = false;
    state = 'introduce'; // introduce, floating, attacking, hurt, dead
    floatingSpeed = 0.5;
    floatingTargetX = 0;
    floatingTargetY = 0;
    swimStyle = 'aggressive'; // normal, aggressive, defensive, circle
    lastStyleChangeTime = 0;
    styleChangeDuration = 3000; // 3 Sekunden pro Stil
    activityRadius = 900;
    attackRadius = 900;

    /**
     * @param {number} x Startposition auf der X-Achse.
     * @param {number} y Startposition auf der Y-Achse.
     */
    constructor(x, y) {
        super();
        this.loadImage(this.IMAGES_INTRODUCE[0]);
        this.loadImages(this.IMAGES_INTRODUCE);
        this.loadImages(this.IMAGES_FLOATING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.x = x;
        this.y = y;
        this.width = 450;
        this.height = 450;
        this.speed = 0.5;
        this.floatingTargetX = x;
        this.floatingTargetY = y;
        this.lastStyleChangeTime = Date.now();

        this.animate();
    }

    /**
     * Startet die Animations- und Bewegungs-Schleifen des Bosses.
     *
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            if (!this.isActive) {
                return;
            }
            if (this.state === 'introduce' && !this.hasStartedIntro) {
                return;
            }

            const images = this.getCurrentImages();
            
            if (this.isDead && this.deadAnimationFinished) {
                this.img = this.imageCache[images[images.length - 1]];
                return;
            }

            let path = images[this.currentImage % images.length];
            this.img = this.imageCache[path];
            this.currentImage++;
            if (this.state === 'introduce' && this.currentImage >= this.IMAGES_INTRODUCE.length) {
                this.introduced = true;
                this.state = 'floating';
                this.currentImage = 0;
            }

            if (this.state === 'attacking' && this.currentImage >= this.IMAGES_ATTACK.length) {
                this.isAttacking = false;
                this.state = 'floating';
                this.currentImage = 0;
            }

            if (this.state === 'hurt' && this.currentImage >= this.IMAGES_HURT.length) {
                this.isHurt = false;
                this.state = 'floating';
                this.currentImage = 0;
            }

            if (this.isDead && this.currentImage >= this.IMAGES_DEAD.length) {
                this.deadAnimationFinished = true;
                this.currentImage = this.IMAGES_DEAD.length - 1;
            }
        }, 150);
        setInterval(() => {
            if (!this.isActive || !this.introduced || this.isDead) {
                return;
            }
            this.updateFloatingBehavior();
        }, 1000 / 60);
    }

    /**
     * Liefert die Bildsequenz passend zum aktuellen Boss-Zustand.
     *
     * @returns {string[]}
     */
    getCurrentImages() {
        if (this.isDead) {
            return this.IMAGES_DEAD;
        }
        if (this.state === 'introduce') {
            return this.IMAGES_INTRODUCE;
        }
        if (this.state === 'attacking') {
            return this.IMAGES_ATTACK;
        }
        if (this.state === 'hurt') {
            return this.IMAGES_HURT;
        }
        return this.IMAGES_FLOATING;
    }

    /**
     * Aktualisiert Schwimmstil und Bewegung des Bosses.
     *
     * @returns {void}
     */
    updateFloatingBehavior() {
        if (this.isAttacking || this.isHurt) {
            return;
        }
        const currentTime = Date.now();
        if (currentTime - this.lastStyleChangeTime > this.styleChangeDuration) {
            const styles = ['aggressive', 'aggressive', 'aggressive', 'normal', 'circle'];
            this.swimStyle = styles[Math.floor(Math.random() * styles.length)];
            this.lastStyleChangeTime = currentTime;
        }
        if (this.swimStyle === 'aggressive') {
            this.floatingSpeed = 5.5;
        } else if (this.swimStyle === 'defensive') {
            this.floatingSpeed = 3.5;
        } else if (this.swimStyle === 'circle') {
            this.floatingSpeed = 4.8;
        } else {
            this.floatingSpeed = 3.8;
        }

        this.applyMovement();
    }

    /**
     * Bewegt den Boss abhängig vom aktuellen Schwimmstil und der Character-Position.
     *
     * @returns {void}
     */
    applyMovement() {
        if (!this.character) {
            if (Math.random() > 0.5) {
                this.y += this.floatingSpeed * 2.5;
            } else {
                this.y -= this.floatingSpeed * 2.5;
            }
            return;
        }

        const charX = this.character.x;
        const charY = this.character.y;
        const distX = charX - this.x;
        const distY = charY - this.y;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (this.swimStyle === 'aggressive') {
            if (distance > 50) {
                this.x += (distX / distance) * this.floatingSpeed;
                this.y += (distY / distance) * this.floatingSpeed;
            }
        } else if (this.swimStyle === 'defensive') {
            if (distance < 800) {
                this.x -= (distX / distance) * this.floatingSpeed;
                this.y -= (distY / distance) * this.floatingSpeed;
            } else {
                this.x += (distX / distance) * this.floatingSpeed * 1.7;
            }
        } else if (this.swimStyle === 'circle') {
            const angle = Math.atan2(distY, distX);
            const desiredDistance = 600;
            
            this.floatingTargetX = charX + Math.cos(angle + 0.05) * desiredDistance;
            this.floatingTargetY = charY + Math.sin(angle + 0.05) * desiredDistance;
            
            const targetDist = Math.sqrt(Math.pow(this.floatingTargetX - this.x, 2) + Math.pow(this.floatingTargetY - this.y, 2));
            if (targetDist > 10) {
                const targetDistX = this.floatingTargetX - this.x;
                const targetDistY = this.floatingTargetY - this.y;
                this.x += (targetDistX / targetDist) * this.floatingSpeed;
                this.y += (targetDistY / targetDist) * this.floatingSpeed;
            }
        } else {
            if (distance > 400) {
                this.x += (distX / distance) * this.floatingSpeed * 1.8;
                this.y += (distY / distance) * this.floatingSpeed * 1.8;
            } else if (distance < 300) {
                this.x -= (distX / distance) * this.floatingSpeed * 1.6;
                this.y -= (distY / distance) * this.floatingSpeed * 1.6;
            }
        }
        const mapBounds = 6720;
        if (this.x < 4800) this.x = 4800;
        if (this.x > mapBounds - this.width) this.x = mapBounds - this.width;
        if (this.y < 50) this.y = 50;
        if (this.y > 540 - this.height) this.y = 540 - this.height;
    }

    /**
     * Prüft, ob der Boss nah genug für einen Angriff ist.
     *
     * @param {Character} character Spielerfigur.
     * @returns {void}
     */
    checkProximityAttack(character) {
        this.character = character;
        
        if (this.isDead || !this.isActive || !this.introduced || this.isAttacking || this.isHurt) {
            return;
        }

        const distance = Math.abs(this.x - character.x);
        const currentTime = Date.now();
        
        
        if (distance < this.attackRadius && currentTime - this.lastAttackTime > 3000) {
            this.attack();
        }
    }

    /**
     * Versetzt den Boss in den Angriffs-Zustand.
     *
     * @returns {void}
     */
    attack() {
        this.isAttacking = true;
        this.state = 'attacking';
        this.currentImage = 0;
        this.lastAttackTime = Date.now();
    }

    /**
     * Fügt dem Boss Schaden zu und wechselt bei Bedarf in Hurt- oder Dead-Zustand.
     *
     * @param {number} damage Schadenswert.
     * @returns {void}
     */
    hit(damage) {
        if (this.isDead) {
            return;
        }

        this.hp -= damage;
        
        if (this.hp <= 0) {
            this.hp = 0;
            this.die();
        } else {
            this.isHurt = true;
            this.state = 'hurt';
            this.currentImage = 0;
        }
    }

    /**
     * Startet die Todesanimation des Bosses.
     *
     * @returns {void}
     */
    die() {
        if (this.isDead) {
            return;
        }
        this.isDead = true;
        this.state = 'dead';
        this.currentImage = 0;
        this.deadAnimationFinished = false;
    }

    /**
     * Aktualisiert Sichtbarkeit und Aktivität des Bosses relativ zur Kamera.
     *
     * @param {number} cameraX Aktuelle X-Position der Kamera.
     * @param {number} [canvasWidth=960] Breite des sichtbaren Bereichs.
     * @returns {void}
     */
    checkVisibility(cameraX, canvasWidth = 960) {
        const bossRightEdge = this.x + this.width;
        const cameraRight = cameraX + canvasWidth;
        const activityPuffer = this.activityRadius;

        this.isActive = bossRightEdge > cameraX - activityPuffer && this.x < cameraRight + activityPuffer;
        this.isVisible = bossRightEdge > cameraX && this.x < cameraRight;
        
        if (!this.hasStartedIntro && this.isVisible) {
            this.hasStartedIntro = true;
            this.currentImage = 0;
        }
    }
}

