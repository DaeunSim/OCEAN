import SETTINGS from '../config/constants';

import Phaser from 'phaser';

import backgroundImage from '../assets/gameover/background.png';

class Gameover extends Phaser.Scene {
  constructor() {
    super({ key: 'Gameover' });
  }
  preload() {
    this.load.image('background', backgroundImage);
  }

  create() {
    // background
    this.background = this.add.image(0, 0, 'background');
    this.background.setScale(3);
    this.background.setOrigin(0, 0);

    // game over
    this.add.text(
      SETTINGS.WIDTH/2,
      SETTINGS.HEIGHT/2,
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
        SETTINGS.WIDTH/2,
        SETTINGS.HEIGHT - 50,
        'click here to start',
        {
          fontSize: '24px',
          fill: '#fff',
          fontFamily: 'Orbitron'
         }
       ).setOrigin(0.5)
       .setInteractive()
       .on('pointerdown', () => { this.scene.start('Game'); });
     });
  }

  update() {
  }
  render() {}
}

export default Gameover;
