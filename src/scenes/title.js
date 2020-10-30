import SETTINGS from '../config/constants';
const WIDTH = SETTINGS.WIDTH;
const HEIGHT = SETTINGS.HEIGHT;

import Phaser from 'phaser';

import pet from '../assets/pet2.png';
import pointer from '../assets/pointer.png';
import characterFrame from '../assets/anne.png';
import infoFrame from '../assets/gameover/emotes.png';

import startSound from '../assets/audio/gamestart.mp3'
import clickSound from '../assets/audio/click.wav'

class Title extends Phaser.Scene {
  constructor() {
    super({ key: 'Title' });
  }

  preload() {
    this.load.image('pet2', pet);
    this.load.image('pointer', pointer);
    this.load.spritesheet('info', infoFrame, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('character', characterFrame, { frameWidth: 32, frameHeight: 48 });
		
    this.load.audio('startSound', startSound);
    this.load.audio('clickSound', clickSound);
  }

  create() {
    this.scene.stop('Game');
		
    this.sound.setVolume(1);
    this.sound.play('startSound', { volume: 0.8, loop: true });

    this.add.text(
      WIDTH/2,
      HEIGHT/2 - 100,
      'OCEAN!',
      {
        fontSize: '88px',
        fill: '#fff',
        fontFamily: 'round',
       }
     ).setOrigin(0.5);

     this.cameras.main.fadeIn(2000, 0, 0, 0);
     this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
       this.add.text(
         WIDTH/2,
         HEIGHT/2 + 100,
         'Click and Drag to collect trash.\n     And save the EARTH!',
         {
           fontSize: '24px',
           fill: '#fff',
           fontFamily: 'Orbitron'
         }
       ).setOrigin(0.5);
       this.add.text(
         WIDTH/2,
         HEIGHT/2 + 150,
         'START',
         {
           fontSize: '24px',
           fill: '#fff',
           fontFamily: 'round'
         }
       ).setOrigin(0.5)
       .setInteractive({ useHandCursor: true  })
       .on('pointerdown', () => { 
          this.sound.setVolume(0.3);	
          this.sound.play('clickSound');
          this.scene.start('Game'); 
        });
     });

    // character
    this.anims.create({
      key: 'character',
      frameRate: 7,
      frames: this.anims.generateFrameNumbers('character', { start: 8, end: 11 }),
      repeat: -1
    });

    this.add.sprite(WIDTH/2 - 50, 350, 'character')
    .setOrigin(0.5)
    .play('character');

    this.add.image(WIDTH/2 + 50, 350, 'pet2').setScale(0.8);
    const pointer = this.add.image(WIDTH/2 + 60, 355, 'pointer').setScale(0.04).setDepth(999);
    var tween = this.tweens.add({
        targets: pointer,
        x: WIDTH/2 + 70,
        y: 350,
        ease: 'Power5',
        duration: 800,
        yoyo: true,
        repeat: -1
    });
  }

  update() {
    // if (this.input.mousePointer.isDown) {
    //   this.scene.stop('Title');
    //   this.scene.start('Game');
    // }
  }

  render() {}
}

export default Title;
