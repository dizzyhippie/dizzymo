import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(512, 384, 'scene-background');
        this.add.text(512, 300, 'Adventures of DizzyMo', {
            fontFamily: 'droog', fontSize: 38, color: '#ffffff',
            stroke: '#000000',
            align: 'center'
        }).setDepth(100).setOrigin(0.5);
        
        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('Game');
    }
}
