import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
    constructor() {
        super("Game");
        this.platforms = null;
        this.player = null;
        this.cursors = null;
        this.moustaches = null;
        this.scoreText = null;
        this.bombs = null;
        this.score = 0;
        this.WASD = null;
    }

    create() {
        this.bombs = this.physics.add.group();
        this.add.image(512, 384, "background").setScale(3);
        this.platforms = this.physics.add.staticGroup();
        this.createPlatforms();

        this.player = this.createPlayer();
        this.scoreText = this.createScoreText();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.WASD = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            jump: Phaser.Input.Keyboard.KeyCodes.SPACE
        });

        this.moustaches = this.createMoustaches();

        this.addColliders();
        this.addAnimations();

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        this.handlePlayerMovement();
    }

    createPlatforms() {
        this.platforms.create(400, 568, "ground").setScale(2).refreshBody();
        this.platforms.create(600, 400, "ground");
        this.platforms.create(50, 250, "ground");
        this.platforms.create(750, 220, "ground");
    }

    createPlayer() {
        const player = this.physics.add.sprite(100, 450, "dude");
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.body.setGravityY(50);
        return player;
    }

    createScoreText() {
        return this.add.text(16, 16, "Score: 0", {
            fontSize: "32px",
            fill: "#000",
        });
    }

    createMoustaches() {
        const moustaches = this.physics.add.group({
            key: "moustache",
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        moustaches.children.iterate(child => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            child.setScale(5);
        });

        return moustaches;
    }

    addColliders() {
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.moustaches, this.platforms);
        this.physics.add.overlap(this.player, this.moustaches, this.collectMoustache, null, this);

        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    }

    addAnimations() {
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
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
            frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1,
        });
    }

    handlePlayerMovement() {
        const isLeftPressed = this.cursors.left.isDown || this.WASD.left.isDown;
        const isRightPressed = this.cursors.right.isDown || this.WASD.right.isDown;
        const isJumpPressed = this.cursors.up.isDown || this.WASD.up.isDown || this.WASD.jump.isDown;
        const isDownPressed = this.cursors.down.isDown || this.WASD.down.isDown;

        if (isLeftPressed) {
            this.player.setVelocityX(-160);
            this.player.anims.play("left", true);
        } else if (isRightPressed) {
            this.player.setVelocityX(160);
            this.player.anims.play("right", true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play("turn");
        }

        if (isJumpPressed && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }

        if (isDownPressed && !this.player.body.touching.down) {
            this.player.setVelocityY(330);
        }
    }

    hitBomb(player, bomb) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play("turn");
        this.scene.start("GameOver");
    }

    collectMoustache(player, moustache) {
        moustache.disableBody(true, true);
        this.score += 50;
        this.scoreText.setText("Score: " + this.score);

        if (this.moustaches.countActive(true) === 0) {
            this.moustaches.children.iterate(child => {
                child.enableBody(true, child.x, 0, true, true);
            });

            const x = player.x < 400
                ? Phaser.Math.Between(400, 800)
                : Phaser.Math.Between(0, 400);

            const bomb = this.bombs.create(x, 16, "bomb");
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
