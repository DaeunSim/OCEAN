import Phaser from "phaser";

import constants from "./config/constants";
import GameScene from "./scenes/game";
import GameoverScene from "./scenes/gameover";

const config = {
  type: Phaser.AUTO,
  width: constants.WIDTH,
  height: constants.HEIGHT,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    }
  },
  scene: [GameScene, GameoverScene]
};

// eslint-disable-next-line no-new
new Phaser.Game(config);

if (module.hot) {
  module.hot.accept(() => {});

  module.hot.dispose(() => {
    window.location.reload();
  });
}
