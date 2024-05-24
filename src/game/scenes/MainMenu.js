import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class MainMenu extends Scene {
    
    constructor () {
        super('MainMenu');
    }

    create () {
        this.add.image(512, 384, 'main-menu-background');
        this.add.text(512, 225, 'Adventures of DizzyMo', {
            fontFamily: 'droog', fontSize: 38, color: '#ffffff',
            stroke: '#000000',
            align: 'center'
        }).setDepth(100).setOrigin(0.5);
        
        const menuItems = [
            { text: 'Start Game', scene: 'Game', y: 400 },
            { text: 'Settings', scene: 'Settings', y: 435 }
        ];

        menuItems.forEach(item => this.createMenuItem(item));
        
        if (!this.sound.get('backgroundMusic')) {
            const music = this.sound.add('backgroundMusic', { loop: true });
            music.play();
            music.setVolume(0.02);
        }

        EventBus.emit('current-scene-ready', this);
    }

    createMenuItem({ text, scene, y }) {
        const menuItem = this.add.text(512, y, text, {
            fontFamily: 'droog', fontSize: 24, color: '#ffffff',
            stroke: '#000000',
            align: 'center'
        }).setDepth(100).setOrigin(0.5);

        menuItem.setInteractive();
        menuItem.on('pointerdown', () => {
            this.changeScene(scene);
        });
    }

    changeScene(scene) {
        this.scene.start(scene);
    }
}
