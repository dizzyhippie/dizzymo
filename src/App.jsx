import { useRef, useState } from "react";
import Phaser from "phaser";
import { PhaserGame } from "./game/PhaserGame";

function App() {
    // The sprite can only be moved in the MainMenu Scene
    const [canMoveSprite, setCanMoveSprite] = useState(true);

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();

    const changeScene = (sceneKey) => {
        const scene = phaserRef.current.scene;

        if (scene) {
            scene.changeScene(sceneKey);
        }
    };

    // Event emitted from the PhaserGame component
    const currentScene = (scene) => {
        setCanMoveSprite(scene.scene.key !== "MainMenu");
    };

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            <div>
            <button className="button" onClick={() => changeScene('MainMenu')}>
                    Home
                </button>
                <button className="button" onClick={() => changeScene('Game')}>
                    Game
                </button>
                <button className="button" onClick={() => changeScene('Settings')}>
                    Settings
                </button>
                <button className="button" onClick={() => changeScene('GameOver')}>
                    Game Over
                </button>
            </div>
        </div>
    );
}

export default App;
