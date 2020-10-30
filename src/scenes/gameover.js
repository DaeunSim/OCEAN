import SETTINGS from '../config/constants';
const WIDTH = SETTINGS.WIDTH;
const HEIGHT = SETTINGS.HEIGHT;

import Phaser from 'phaser';

import characterFrame from '../assets/anne.png';
import infoFrame from '../assets/gameover/emotes.png';

class Gameover extends Phaser.Scene {
  constructor() {
    super({ key: 'Gameover' });
  }

  preload() {
    this.load.spritesheet('info', infoFrame, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('character', characterFrame, { frameWidth: 32, frameHeight: 48 });
  }

  create() {
    // game over
    this.add.text(
      WIDTH/2,
      HEIGHT/2,
      'GAME OVER',
      {
        fontSize: '64px',
        fill: '#fff',
        fontFamily: 'Orbitron'
       }
     ).setOrigin(0.5);

     this.cameras.main.fadeIn(2000, 0, 0, 0);

     // 화면이 완전히 출력되면 재시작 버튼을 활성화
     this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
      this.add.text(
        WIDTH/2,
        HEIGHT - 50,
        'click here to restart',
        {
          fontSize: '24px',
          fill: '#fff',
          fontFamily: 'Orbitron'
         }
       ).setOrigin(0.5)
       .setInteractive({ useHandCursor: true  })
       .on('pointerdown', () => { this.scene.start('Game'); });
     });

     // info icon
     this.anims.create({
        key: 'info',
        frameRate: 7,
        frames: this.anims.generateFrameNumbers('info', { start: 96, end: 98 }),
        repeat: -1
    });
    this.add.sprite(WIDTH/2, 235, 'info')
    .setOrigin(0.5)
    .play('info')
    .setInteractive({ useHandCursor: true  })
    .on('pointerdown', () => {
      this.scene.start('OceanDebris');
    });

    // character
    this.anims.create({
        key: 'character',
        frameRate: 7,
        frames: this.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
        repeat: -1
    });
    this.add.sprite(WIDTH/2, 270, 'character')
    .setOrigin(0.5)
    .play('character')
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => {
      this.scene.start('OceanDebris');
    });
  }

  update() {
  }

  render() {}
}

export default Gameover;
