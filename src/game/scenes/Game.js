import { EventBus } from "../EventBus";
import { Scene } from "phaser";

var platforms, player, cursors, moustaches, scoreText, bombs;
var score = 0;

export class Game extends Scene {
    constructor() {
        super("Game");
    }

    create() {
        this.createBackground();
        this.createPlatforms();
        this.createPlayer();
        this.createScoreText();
        this.createCursors();
        this.createMoustaches();
        this.createBombs();
        this.createColliders();
        this.createAnimations();

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        this.handlePlayerMovement();
    }

    createBackground() {
        this.add.image(512, 384, "background").setScale(3);
    }

    createPlatforms() {
        platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, "ground").setScale(2).refreshBody();
        platforms.create(600, 400, "ground");
        platforms.create(50, 250, "ground");
        platforms.create(750, 220, "ground");
    }

    createPlayer() {
        player = this.physics.add.sprite(100, 450, "dude");
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.body.setGravityY(50);
    }

    createScoreText() {
        scoreText = this.add.text(16, 16, "Score: 0", {
            fontSize: "32px",
            fill: "#000",
        });
    }

    createCursors() {
        cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            jump: Phaser.Input.Keyboard.KeyCodes.SPACE
        });
    }

    createMoustaches() {
        moustaches = this.physics.add.group({
            key: "moustache",
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 },
        });

        moustaches.children.iterate(child => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
    }

    createBombs() {
        bombs = this.physics.add.group();
    }

    createColliders() {
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(moustaches, platforms);
        this.physics.add.collider(bombs, platforms);
        this.physics.add.collider(player, bombs, this.hitBomb, null, this);
        this.physics.add.overlap(player, moustaches, this.collectMoustache, null, this);
    }

    createAnimations() {
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
        const isLeftDown = cursors.left.isDown || this.wasd.left.isDown;
        const isRightDown = cursors.right.isDown || this.wasd.right.isDown;
        const isUpDown = cursors.up.isDown || this.wasd.up.isDown || this.wasd.jump.isDown;

        if (isLeftDown) {
            player.setVelocityX(-160);
            player.anims.play("left", true);
        } else if (isRightDown) {
            player.setVelocityX(160);
            player.anims.play("right", true);
        } else {
            player.setVelocityX(0);
            player.anims.play("turn");
        }

        if (isUpDown && player.body.touching.down) {
            player.setVelocityY(-330);
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
        score += 50;
        scoreText.setText("Score: " + score);

        if (moustaches.countActive(true) === 0) {
            moustaches.children.iterate(child => {
                child.enableBody(true, child.x, 0, true, true);
            });

            const x = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            const bomb = bombs.create(x, 16, "bomb");
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
