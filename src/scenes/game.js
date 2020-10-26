import Phaser from 'phaser';

// images
import sky from '../assets/sky.png';
import anne from '../assets/anne.png';
import trash from '../assets/trash.png';
import life_on from '../assets/life_on.png';
import life_off from '../assets/life_off.png';
import tileImage from '../assets/tilemaps/mapPack_tilesheet.png';
import tilemapJson from '../assets/tilemaps/map.json';

// sprites
import Trash from '../sprites/trash';

// constants
import {
  WIDTH as MAX_WINDOW_WIDTH,
  HEIGHT as MAX_WINDOW_HEIGHT
} from '../config/constants';

// plugins
import eventCenter from '../plugins/eventCenter';

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  preload() {
    // load images
    this.load.image('sky', sky);
    this.load.image('trash', trash);
    this.load.image('life_on', life_on);
    this.load.image('life_off', life_off);
    this.load.spritesheet('anne', anne, { frameWidth: 32, frameHeight: 48 });

    // load tile map
    this.load.image('tileImage', tileImage);
    this.load.tilemapTiledJSON('tilemap', tilemapJson);
  }

  drawBackground() {
    const sky = this.add.image(400, 300, 'sky');
    sky.setScale(2);

    const map = this.make.tilemap({ key: 'tilemap' });
    const tileset = map.addTilesetImage('mapPack_tilesheet', 'tileImage'); // fullTiles : tile map name
    const baseLayer = map.createStaticLayer('baselayer', tileset, 40, 30); // baseLayer : layer name
    // const stage1 = map.createStaticLayer('stage1', tileset, 30, 30);
    // const stage2 = map.createStaticLayer('stage2', tileset, 30, 30);
    // const stage3 = map.createStaticLayer('stage3', tileset, 30, 30);
  }

  create() {
    // background sprit
    this.drawBackground();

    // set score variable
    this.score = 0;
    this.life = 5;
    this.drawScoreBoard();

    // Create Player
    this.player = this.physics.add.sprite(100, 450, 'anne');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // Create player animation
    this.anims.create({
      key: 'idle',
      frames: [{ key: 'anne', frame: 0 }],
      frameRate: 20,
    });
		
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('anne', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
		
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('anne', { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });
		
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('anne', { start: 8, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('anne', { start: 12, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });
		

    // create trashs
    let trashCount = 10;
    for(let i = 0; i < 10; i++) {
      this.time.delayedCall(
        Phaser.Math.Between(0,10000),
        () => {
          // 150, 60 점수판 영역을 피해서 생성
          const x = Phaser.Math.Between(10, 790);
          const y = Phaser.Math.Between( x < 150 ? 60 : 10, 590);
          new Trash({ scene: this, x, y, });
        },
        [],
        this
      );
    }

    // set collides between Player and grounds
    // this.physics.add.collider(this.player, this.platforms);

    // miass trash => lose life
    eventCenter.on('miss-trash', this.lossLife, this);
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
        this.player.anims.play('up', true);
      } else if (this.input.activePointer.y > this.player.y
        && (this.input.activePointer.x >= this.player.x - 10
        && this.input.activePointer.x <= this.player.x + 100 + 10)) {
        // move down
        this.player.anims.play('down', true);
      }

      if (this.player.getBounds().contains(this.input.x, this.input.y)) {
        this.player.setVelocity(0);
        this.player.anims.play('idle');
      }
    } else {
      this.player.setVelocity(0);
      this.player.anims.play('idle');
    }
  }

  updateScore(_score) {
		this.score = _score;
	}

  setCamera(map) {
    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }

  drawScoreBoard() {
    if (!this.scoreBoard) {
      this.scoreBoard = this.add.text(10, 10, `SCORE: ${this.score}`, { fontSize: 20 });
    }
    // set score board
    this.scoreBoard.setText(`SCORE: ${this.score}`);
    let lives = this.add.group();
    for(let i = 0; i < 5; i++) {
      const life = lives.create(i*30 + 20, 50, i < this.life ? 'life_on' : 'life_off');
      life.setScale(0.4);
    }
  }

  lossLife() {
		this.life = this.life - 1;

    if (!this.life) {
      // game over
    }
	}
}

export default Game;
