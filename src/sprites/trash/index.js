import Phaser from 'phaser';

const TRASH_LIFESPAN = 5000;

export default class Trash extends Phaser.Physics.Arcade.Sprite {
  constructor({ scene, x, y, lifespan }) {
    super(scene, x, y, 'trash');

    console.log('trash constructor: ', x, y);

    this.scene = scene;
    this.lifespan = lifespan || TRASH_LIFESPAN;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(1);
    this.setBounce(1, 1);

    this.create();
  }

  preload() {
  }

  create() {
    const { scene } = this;

    // 생명주기가 끝나면 사라짐
    this.timer = scene.time.delayedCall(this.lifespan, () => this.destroy(), [], this);
  }

  update() {
  }
}
