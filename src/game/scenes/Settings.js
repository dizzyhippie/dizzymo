import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Settings extends Scene {
    constructor() {
        super('Settings');
        this.musicPaused = false;
    }

    create() {
        this.add.image(512, 384, 'main-menu-background');
        this.add.text(512, 225, 'Adventures of DizzyMo', {
            fontFamily: 'droog', fontSize: 38, color: '#ffffff',
            stroke: '#000000',
            align: 'center'
        }).setDepth(100).setOrigin(0.5);

        const menuItems = [
            { text: 'Toggle Music', action: this.toggleMusic, y: 400 },
            { text: 'Back to Game', scene: 'MainMenu', y: 500 }
        ];

        menuItems.forEach(item => this.createMenuItem(item));
        EventBus.emit('current-scene-ready', this);
    }

    createMenuItem({ text, action, scene, y }) {
        const menuItem = this.add.text(512, y, text, {
            fontFamily: 'droog', fontSize: 24, color: '#ffffff',
            stroke: '#000000',
            align: 'center'
        }).setDepth(100).setOrigin(0.5);

        menuItem.setInteractive();
        menuItem.on('pointerdown', () => {
            if (action) {
                action.call(this);
            } else {
                this.changeScene(scene);
            }
        });
    }

    toggleMusic() {
        const music = this.sound.get('backgroundMusic');
        if (music) {
            if (this.musicPaused) {
                music.resume();
                this.musicPaused = false;
            } else {
                music.pause();
                this.musicPaused = true;
            }
        }
    }

    changeScene(scene) {
        this.scene.start(scene);
    }
}
