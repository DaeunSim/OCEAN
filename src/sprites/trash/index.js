import Phaser from 'phaser';
import eventCenter from '../../plugins/eventCenter';

const TRASH_IMAGES = ['pet', 'papers', 'bottle', 'can'];
const TRASH_LIFESPAN = 15000; // 기본 15초

export default class Trash extends Phaser.Physics.Arcade.Sprite {
  constructor({ scene, x, y, lifespan = TRASH_LIFESPAN, }) {
    // use random image
    const image = TRASH_IMAGES[Phaser.Math.Between(0, TRASH_IMAGES.length-1)];
    super(scene, x, y, image);

    this.scene = scene;
    this.lifespan = lifespan - (2*scene.stage); // 스테이지가 오를 때 마다 2초씩 삭감

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(0.8);
    this.setBounce(1, 1);

    this.create();
  }

  preload() {
  }

  catched() {
    // 잡히면 타이머 이벤트 제거
    this.timer.destroy();
    this.destroy();
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
