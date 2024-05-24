import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('scene-background', 'assets/bg.png');
        this.load.image('main-menu-background', 'assets/main-menu-bg.png');
        this.load.image('ground', 'assets/platform.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('background', 'assets/bg.jpg');
        this.load.image('moustache', 'assets/dizzy-moustache.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.audio('backgroundMusic', 'assets/music/menu-2.mp3');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
