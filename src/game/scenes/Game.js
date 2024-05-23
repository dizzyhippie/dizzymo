import { EventBus } from "../EventBus";
import { Scene } from "phaser";

var platforms, player, cursors, stars, moustache;

export class Game extends Scene {
    constructor() {
        super("Game");
    }

    create() {
        this.add.image(512, 384, "background").setScale(3);
        platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, "ground").setScale(2).refreshBody();
        platforms.create(600, 400, "ground");
        platforms.create(50, 250, "ground");
        platforms.create(750, 220, "ground");

        player = this.physics.add.sprite(100, 450, "dude");
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.body.setGravityY(50);

        cursors = this.input.keyboard.createCursorKeys();

        moustache = this.physics.add.group({
            key: "moustache",
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 },
        });

        moustache.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(player, platforms);
        this.physics.add.collider(moustache, platforms);
        this.physics.add.overlap(player, moustache, collectMoustache, null, this);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });

        function collectMoustache(player, moustache) {
            moustache.disableBody(true, true);
        }

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        if (cursors.left.isDown) {
            player.setVelocityX(-160);

            player.anims.play("left", true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);

            player.anims.play("right", true);
        } else {
            player.setVelocityX(0);

            player.anims.play("turn");
        }

        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
        }
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
