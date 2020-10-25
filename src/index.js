import Phaser from "phaser";

import constants from "./config/constants";
import GameScene from "./scenes/game";

const config = {
  type: Phaser.AUTO,
  width: constants.WIDTH,
  height: constants.HEIGHT,
  physics: {
    default: "arcade",
    arcade: {
      debug: true
    }
  },
  scene: [GameScene]
};

// eslint-disable-next-line no-new
new Phaser.Game(config);

if (module.hot) {
  module.hot.accept(() => {});

  module.hot.dispose(() => {
    window.location.reload();
  });
}
