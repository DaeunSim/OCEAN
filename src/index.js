import Phaser from "phaser";

import constants from "./config/constants";
import TitleScene from "./scenes/title";
import GameScene from "./scenes/game";
import GameoverScene from "./scenes/gameover";
import OceanDebris from "./scenes/oceandebris";

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
  scene: [TitleScene, GameScene, GameoverScene, OceanDebris]
};

// eslint-disable-next-line no-new
new Phaser.Game(config);

if (module.hot) {
  module.hot.accept(() => {});

  module.hot.dispose(() => {
    window.location.reload();
  });
}
