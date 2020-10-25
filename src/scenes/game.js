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
    if (this.input.mousePointer.isDown) {
      this.physics.moveToObject(this.player, this.input.activePointer, 60);

      if (this.input.activePointer.x > this.player.x
        && (this.input.activePointer.y > this.player.y - 10
        && this.input.activePointer.y < this.player.y + 10)) {
        // move right
        this.player.anims.play('right', true);
      } else if (this.input.activePointer.x < this.player.x
        && (this.input.activePointer.y > this.player.y - 10
        && this.input.activePointer.y < this.player.y + 10)) {
        // move left
        this.player.anims.play('left', true);
      } else if (this.input.activePointer.y < this.player.y
        && (this.input.activePointer.x > this.player.x - 10
        && this.input.activePointer.x < this.player.x + 100 + 10)) {
        // move up
        this.player.anims.play('turn');
      } else if (this.input.activePointer.y > this.player.y
        && (this.input.activePointer.x >= this.player.x - 10
        && this.input.activePointer.x <= this.player.x + 100 + 10)) {
        // move down
        this.player.anims.play('turn');
      }

      if (this.player.getBounds().contains(this.input.x, this.input.y)) {
        this.player.setVelocity(0);
        this.player.anims.play('turn');
      }
    } else {
      this.player.setVelocity(0);
      this.player.anims.play('turn');
    }
  }
}

export default Game;
