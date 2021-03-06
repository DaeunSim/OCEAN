import Phaser from 'phaser';

// images
import anne from '../assets/anne.png';
import pet from '../assets/pet.png';
import papers from '../assets/papers.png';
import can from '../assets/can.png';
import bottle from '../assets/bottle.png';
import life_on from '../assets/Terran.png';
import life_off from '../assets/Baren.png';
import boom from '../assets/boom.png';
import oceanTileImage from '../assets/tilemaps/ocean.png';
import objectTileImage from '../assets/tilemaps/objects.png';
import collidersTileImage from '../assets/tilemaps/colliders.png';
import tilemapJson from '../assets/tilemaps/map.json';

// sprites
import Trash from '../sprites/trash';

// audio
import scoreSound from '../assets/audio/coin.mp3'
import crushSound from '../assets/audio/crush.mp3'
import playSound from '../assets/audio/gameplay.mp3'

// plugins
import eventCenter from '../plugins/eventCenter';

const STAGE_SCORE = [50, 100, 200];
// const STAGE_SCORE = [10, 20, 30];

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  preload() {
    // load images
    // trashs
    this.load.image('pet', pet);
    this.load.image('papers', papers);
    this.load.image('can', can);
    this.load.image('bottle', bottle);

    this.load.image('life_on', life_on);
    this.load.image('life_off', life_off);
    this.load.spritesheet('anne', anne, { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('boom', boom, { frameWidth: 100, frameHeight: 100 });

    // load tile map
    this.load.image('oceanTileImage', oceanTileImage);
    this.load.image('objectTileImage', objectTileImage);
    this.load.image('collidersTileImage', collidersTileImage);
    this.load.tilemapTiledJSON('tilemap', tilemapJson);
		
    // load score sound
    this.load.audio('scoreSound', scoreSound);
    this.load.audio('crushSound', crushSound);
    this.load.audio('playSound', playSound);
  }

  drawBackground() {
    this.tilemap = this.make.tilemap({ key: 'tilemap' });

    // tile set
    const oceanTileset = this.tilemap.addTilesetImage('ocean', 'oceanTileImage'); // first argument : tile map name
    const objectTileset = this.tilemap.addTilesetImage('objects', 'objectTileImage');

    // layers
    const baseLayer = this.tilemap.createStaticLayer('baselayer/ocean', oceanTileset, 0, 0); // baseLayer : layer name
    const baseObjectLayer = this.tilemap.createStaticLayer('baselayer/object', objectTileset, 0, 0);
  }

  create() {
    // background sprit
    this.drawBackground();

    // set score variable
    this.scoreBoard = null;
    this.score = 0;
    this.life = 5;
    this.stage = 0;
    this.drawScoreBoard();
		
    // set background music
    this.sound.stopAll();
    this.sound.setVolume(1);
    this.sound.play('playSound', { seek: 1.5, volume: 0.5, loop: true });

    // life lose 효과
    this.anims.create({
      key: 'boom',
      frameRate: 100,
      frames: this.anims.generateFrameNumbers('boom', { start: 0, end: 64 }),
      repeat: 0,
    });

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

    let trashs = [];
    // 쓰레기는 무한 증식
    var timer = this.time.addEvent({
      delay: Phaser.Math.Between(0, 5000 - (this.stage*10)), // 5초 이내, 스테이지가 오르면 더 빨리 생성 됨
      callback: () => {
        // 170, 90 점수판 영역을 피해서 생성
        const x = Phaser.Math.Between(10, 790);
        const y = Phaser.Math.Between( x < 170 ? 90 : 10, 590);
        trashs.push(new Trash({ scene: this, x, y, }));
      },
      callbackScope: [],
      loop: true
    });
		
    // add collision handler
    this.physics.add.collider(this.player, trashs, this.removeTrash, null, this);

    // miass trash => lose life
    eventCenter.on('miss-trash', this.lossLife, this);
  }

  update() {
    // create movement controller
    if (this.input.mousePointer.isDown) {
      
      if (this.input.activePointer.x > this.player.x
        && (this.input.activePointer.y > this.player.y - 10
        && this.input.activePointer.y < this.player.y + 10)) {
					
        // move right
        this.player.setVelocity(100, 0);
        this.player.anims.play('right', true);
				
      } else if (this.input.activePointer.x < this.player.x
        && (this.input.activePointer.y > this.player.y - 10
        && this.input.activePointer.y < this.player.y + 10)) {
					
        // move left
        this.player.setVelocity(-100, 0);
        this.player.anims.play('left', true);
				
      } else if (this.input.activePointer.y < this.player.y
        && (this.input.activePointer.x > this.player.x - 10
        && this.input.activePointer.x < this.player.x + 10)) {
					
        // move up
        this.player.setVelocity(0, -100);
        this.player.anims.play('up', true);
				
      } else if (this.input.activePointer.y > this.player.y
        && (this.input.activePointer.x >= this.player.x - 10
        && this.input.activePointer.x <= this.player.x + 10)) {
					
        // move down
        this.player.setVelocity(0, 100);
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

    this.drawScoreBoard();
  }
	
  removeTrash(player, trash) {
    trash.catched();
    this.sound.play('scoreSound');
    this.updateScore(10);
	}

  updateScore(_score) {
    this.score += _score;
	}

  // setCamera(map) {
  //   const camera = this.cameras.main;
  //   camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  // }

  drawScoreBoard() {
    if (!this.scoreBoard) {
      this.scoreBoard = this.add.text(20, 10, `SCORE: ${this.score}`, { fontSize: 20, fontFamily: 'round', });
    }
    // set score board
    this.scoreBoard.setText(`SCORE: ${this.score}`);
    this.lives = this.add.group();
    for(let i = 0; i < 5; i++) {
      const life = this.lives.create(i*35 + 30, 50, i < this.life ? 'life_on' : 'life_off');
      life.setScale(0.6);
    }

    // 사전에 정의한 STAGE_SCORE 를 넘으면 스테이지 업
    if (STAGE_SCORE[this.stage] <= this.score && STAGE_SCORE.length - 1 > this.stage) {
      this.stageUp();
    }
  }

  stageUp() {
    this.stage++;

    // stage change effect
    const beforeStage = this.add.text(300, 270, `STAGE ${this.stage}`, { fontSize: 18, fill: '#fff', fontFamily: 'round' }).setAlpha(0.3);
    const afterStage = this.add.text(300, 270, `STAGE ${this.stage + 1}`, { fontSize: 18, fill: '#fff', fontFamily: 'round' });
    this.tweens.add({
      targets: afterStage,
      x: 500,
      ease: 'Power2',
      duration: 1000,
      repeat: 0,
      onComplete: () => {
        this.time.delayedCall(
          700,
          () => { 
            beforeStage.destroy();
            afterStage.destroy();
          });
      }
    });

    if (this.stage === 1 || this.stage === 2) {
      const collidersTileset = this.tilemap.addTilesetImage('colliders', 'collidersTileImage');
      const collidersLayer = this.tilemap.createStaticLayer(`baselayer/stage${this.stage}`, collidersTileset, 0, 0);
      collidersLayer.setCollisionByProperty({ collides: true, });

      // collision debugging
      // const debugGraphics = this.add.graphics().setAlpha(0.75);
      // collidersLayer.renderDebug(debugGraphics, {
      //   tileColor: null, // Color of non-colliding tiles
      //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
      // });

      this.physics.add.collider(this.player, collidersLayer);
    }
  }

  lossLife() {
    this.life = this.life - 1;
    if (this.life >= 0) {
      this.sound.play('crushSound', { volume: 0.3 });

      // 삭제 될 지구 아이콘 위치를 가져와서 폭발 효과를 추가
      const target = this.add.sprite(
        this.lives.children.entries[this.life].x,
        this.lives.children.entries[this.life].y,
      ).setDepth(999)
      .play('boom')
      .once('animationcomplete', () => { target.destroy(); });
    }

    // game over
    if (!this.life) {
      this.cameras.main.fadeOut(2000, 0, 0, 0);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
          this.sound.setVolume(0.3);
          this.scene.stop('Game');
          this.scene.start('Gameover');
      });
    }
	}
}

export default Game;
