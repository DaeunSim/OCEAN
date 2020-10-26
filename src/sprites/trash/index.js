import Phaser from 'phaser';
import eventCenter from '../../plugins/eventCenter';

const TRASH_IMAGES = ['pet', 'papers', 'bottle', 'can'];
const TRASH_LIFESPAN = 5000;

export default class Trash extends Phaser.Physics.Arcade.Sprite {
  constructor({ scene, x, y, lifespan }) {
    // use random image
    const image = TRASH_IMAGES[Phaser.Math.Between(0, TRASH_IMAGES.length-1)];
    super(scene, x, y, image);

    this.scene = scene;
    this.lifespan = lifespan || TRASH_LIFESPAN;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(0.8);
    this.setBounce(1, 1);

    this.create();
  }

  preload() {
  }

  create() {
    const { scene } = this;

    // 생명주기가 끝나면 사라짐
    this.timer = scene.time.delayedCall(
      this.lifespan,
        () => {
        eventCenter.emit('miss-trash');
        this.destroy();
      },
      [],
      this
    );
  }

  update() {
  }
}
