import Phaser from 'phaser';

import sky from '../assets/sky.png';
import dude from '../assets/dude.png';
import trash from '../assets/trash.png';
import Trash from '../sprites/trash';

// constants
import {
  WIDTH as MAX_WINDOW_WIDTH,
  HEIGHT as MAX_WINDOW_HEIGHT
} from '../config/constants';

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  preload() {
    // load images
    this.load.image('sky', sky);
    this.load.image('trash', trash);
    this.load.spritesheet('dude', dude, { frameWidth: 32, frameHeight: 48 });
  }

  create() {
    // background sprit
    this.add.image(400, 300, 'sky');

    // Create Player
    this.player = this.physics.add.sprite(100, 450, 'dude');
    this.player.body.setGravityY(300);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // Create player animation
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    // create trashs
    let trashCount = 10;
    for(let i = 0; i < 10; i++) {
      this.time.delayedCall(
        Phaser.Math.Between(0,10000),
        () => new Trash({
          scene: this,
          x: Phaser.Math.Between(10, 790),
          y: Phaser.Math.Between(10, 590),
        })
        ,
        [],
        this
      );
    }

    // set collides between Player and grounds
    // this.physics.add.collider(this.player, this.platforms);
  }

  update() {
    // Create movement controller
    this.cursors = this.input.keyboard.createCursorKeys();
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-450);
    }
  }
}

export default Game;
