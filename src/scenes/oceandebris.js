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

    // info
    const constants = [
      { x: 300, y: 115, fontSize: '50px', fill: '#fff', text: '8', },
      { x: 520, y: 183, fontSize: '36px', fill: '#fff', text: '1', },
      { x: 290, y: 275, fontSize: '48px', fill: '#ad2248', text: '1,000,000', },
      { x: 250, y: 330, fontSize: '48px', fill: '#ad2248', text: '100,000', },
      { x: 220, y: 400, fontSize: '50px', fill: '#123dbb', text: '2050', },
    ];

    for (let i = 0; i < constants.length; i++) {
      this.add.text(
        constants[i].x,
        constants[i].y,
        constants[i].text,
        {
          fontSize: constants[i].fontSize,
          fill: constants[i].fill,
          fontFamily: 'round',
        },
      )
      .setOrigin(0)
      .setInteractive({ useHandCursor: true  })
      .on('pointerdown', () => { this.showText(i); });
    }
    
    this.information = [];
    // 사전 정의
    const information = [
      { x: 260, y: 145, text: '매년          톤의 플라스틱 쓰레기가 바다에 버려집니다.' },
      { x: 330, y: 200, text: '이는 가득 채운 덤프 트럭이           분에 한 번씩\n바다에 쓰레기 더미를 들이붓는 것과 동일한 양입니다.' },
      { x: 190, y: 305, text: '해마다 바다새                                                       마리와' },
      { x: 175, y: 355, text: '해양 동물                                             마리가 해양 쓰레기 때문에 죽어가고 있습니다.' },
      { x: 350, y: 425, text: '년 바다에는 물고기보다 플라스틱이 더 많을지도 모릅니다.' },
    ];
      information.forEach((info) => {
        this.information.push(
          this.add.text(info.x, info.y, info.text, { fontSize: '18px', fill: '#fff', fontFamily: 'Do Hyeon'}).setAlpha(0)
        );
      });
  }

  showText(index) {
    this.tweens.add({
      targets: this.information[index],
      alpha: 1,
      duration: 3000,
      ease: 'Power2'
    });
  }

  update() {
    this.background.tilePositionX += 0.05;
    this.midground.tilePositionX += 0.2;
    this.foreground.tilePositionX += 0.45;
  }
}

export default OceanDebris;
