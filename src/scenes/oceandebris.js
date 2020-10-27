import SETTINGS from '../config/constants';
const WIDTH = SETTINGS.WIDTH;
const HEIGHT = SETTINGS.HEIGHT;

import Phaser from 'phaser';

import background from '../assets/gameover/far.png';
import midground from '../assets/gameover/sand.png';
import foreground from '../assets/gameover/foreground.png';
import backFrame from '../assets/gameover/emotes.png';

class OceanDebris extends Phaser.Scene {
  constructor() {
    super({ key: 'OceanDebris' });
  }

  preload() {
    /**
     * TODO 텍스트 또는 이미지 논의 해보자!
     * 매 해 1만 2천 톤의 플라스틱 쓰레기가 바다에 버려집니다.
     * 플라스틱 쓰레기가 완전히 분해되기 위해 소요되는 시간 약 500년. 
     * 썩지 않는 쓰레기는 해마다 쌓여, 매 해 1백만 마리의 바닷새를 죽이고 있습니다..
     */
    this.load.image('background', background);
    this.load.image('midground', midground);
    this.load.image('foreground', foreground);
    this.load.spritesheet('back', backFrame, { frameWidth: 16, frameHeight: 16 });
  }

  create() {
    this.cameras.main.setBackgroundColor('#3f79dd');
    this.background = this.add.tileSprite(0, HEIGHT - 198, WIDTH, 192, 'background').setOrigin(0);
    this.midground = this.add.tileSprite(0, HEIGHT - 192, WIDTH, 192, 'midground').setOrigin(0);
    this.foreground = this.add.tileSprite(0, HEIGHT - 192, WIDTH, 192, 'foreground').setOrigin(0).setScale(1);
    
    // back icon
    this.anims.create({
        key: 'back',
        frameRate: 5,
        frames: this.anims.generateFrameNumbers('back', { start: 63, end: 65 }),
        repeat: -1
    });
    let backIcon = this.add.sprite(30, 30, 'back').setOrigin(0.5);
    backIcon.play('back');
    backIcon.setInteractive({ useHandCursor: true  });
    backIcon.rotation = 60;
    backIcon.on('pointerdown', () => {
      this.scene.start('Gameover');
    });
  }

  update() {
    this.background.tilePositionX += 0.05;
    this.midground.tilePositionX += 0.2;
    this.foreground.tilePositionX += 0.45;
  }
}

export default OceanDebris;
