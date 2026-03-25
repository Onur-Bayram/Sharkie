/**
 * Player poison supply display as image bar (6 states from 0% to 100%).
 */
class PoisonBar extends ImageBar {
    IMAGES = [
        '4. Marcadores/green/poisoned bubbles/0_ copia 2.png',
        '4. Marcadores/green/poisoned bubbles/20_ copia 3.png',
        '4. Marcadores/green/poisoned bubbles/40_ copia 2.png',
        '4. Marcadores/green/poisoned bubbles/60_ copia 2.png',
        '4. Marcadores/green/poisoned bubbles/80_ copia 2.png',
        '4. Marcadores/green/poisoned bubbles/100_ copia 3.png'
    ];

    /**
     * Creates the poison bar and positions it below the health display.
     */
    constructor() {
        super(10, 80, 200, 60, 100);
    }
}
