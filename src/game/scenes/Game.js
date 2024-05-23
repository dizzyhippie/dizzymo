import { EventBus } from "../EventBus";
import { Scene } from "phaser";

var platforms, player, cursors, moustaches, scoreText, bombs;

var score = 0;

export class Game extends Scene {
    constructor() {
        super("Game");
    }

    create() {
        bombs = this.physics.add.group();
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

        scoreText = this.add.text(16, 16, "Score: 0", {
            fontSize: "32px",
            fill: "#000",
        });

        cursors = this.input.keyboard.createCursorKeys();

        moustaches = this.physics.add.group({
            key: "moustache",
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 },
        });

        moustaches.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(player, platforms);
        this.physics.add.collider(moustaches, platforms);
        this.physics.add.overlap(
            player,
            moustaches,
            collectMoustache,
            null,
            this
        );

            
        this.physics.add.collider(bombs, platforms);
        this.physics.add.collider(player, bombs, hitBomb, null, this);


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

        function hitBomb(player, bomb) {
            this.physics.pause();

            player.setTint(0xff0000);

            player.anims.play("turn");

            this.scene.start("GameOver");
        }

        function collectMoustache(player, moustache) {
            moustache.disableBody(true, true);
            score += 50;
            scoreText.setText("Score: " + score);

            if (moustaches.countActive(true) === 0) {
                moustaches.children.iterate(function (child) {
                    child.enableBody(true, child.x, 0, true, true);
                });

                var x =
                    player.x < 400
                        ? Phaser.Math.Between(400, 800)
                        : Phaser.Math.Between(0, 400);

                var bomb = bombs.create(x, 16, "bomb");
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            }
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
