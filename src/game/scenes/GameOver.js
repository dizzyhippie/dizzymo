import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class GameOver extends Scene {
    constructor() {
        super("GameOver");
    }

    create() {
        this.add.image(512, 384, "main-menu-background");
        this.add
            .text(512, 384, "Game Over", {
                fontFamily: "Arial Black",
                fontSize: 64,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        const menuItems = [
            { text: "Run it Back", scene: "Game", y: 465 },
            { text: "Main Menu", scene: "MainMenu", y: 500 },
        ];

        menuItems.forEach((item) => this.createMenuItem(item));
        EventBus.emit("current-scene-ready", this);
    }

    createMenuItem({ text, action, scene, y }) {
        const menuItem = this.add
            .text(512, y, text, {
                fontFamily: "droog",
                fontSize: 24,
                color: "#ffffff",
                stroke: "#000000",
                align: "center",
            })
            .setDepth(100)
            .setOrigin(0.5);

        menuItem.setInteractive();
        menuItem.on("pointerdown", () => {
            if (action) {
                action.call(this);
            } else {
                this.changeScene(scene);
            }
        });
    }

    changeScene(scene) {
        this.scene.start(scene);
    }
}
