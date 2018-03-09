import { AbstractGame, AbstractGameEntry } from './abstract.game';

export const GAME_NAME_JUMPER = 'Jumper';

export interface JumperEntry extends AbstractGameEntry {}

export class JumperGame extends AbstractGame {
  config: any;
  scene: any;
  platforms: any;
  player: any;
  stars: any;
  bombs: any;
  cursors: any;
  score: number = 0;
  scoreText: any;
  gameOver: boolean;

  constructor() {
    super();
  }

  // Re implementation of the init game Instance to use the proper config
  initGameInstance(phaser: any, props: JumperEntry) {
    this.config = {
      type: phaser.AUTO,
      width: 800,
      height: 600,
      parent: props.fieldId,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false
        }
      },
      scene: {
        preload: () => this.getPreloadGame(),
        create: () => this.getCreateGame(),
        update: () => this.getUpdateGame()
      }
    };
    this.gameInstance = new phaser.Game(this.config);
  }

  getPreloadGame() {
    // implement
    this.scene = this.gameInstance.scene.scenes[0];
    this.scene.load.image(
      'sky',
      'assets/stencil-build/game-assets/jumper/sky.png'
    );
    this.scene.load.image(
      'ground',
      'assets/stencil-build/game-assets/jumper/platform.png'
    );
    this.scene.load.image(
      'star',
      'assets/stencil-build/game-assets/jumper/star.png'
    );
    this.scene.load.image(
      'bomb',
      'assets/stencil-build/game-assets/jumper/bomb.png'
    );
    this.scene.load.spritesheet(
      'dude',
      'assets/stencil-build/game-assets/jumper/dude.png',
      { frameWidth: 32, frameHeight: 48 }
    );
  }

  getCreateGame() {
    // implement
    this.scene.add.image(400, 300, 'sky');
    this.platforms = this.scene.physics.add.staticGroup();

    this.platforms
      .create(400, 568, 'ground')
      .setScale(2)
      .refreshBody();

    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    this.player = this.scene.physics.add.sprite(100, 450, 'dude');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.scene.anims.create({
      key: 'left',
      frames: this.scene.anims.generateFrameNumbers('dude', {
        start: 0,
        end: 3
      }),
      frameRate: 10,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });

    this.scene.anims.create({
      key: 'right',
      frames: this.scene.anims.generateFrameNumbers('dude', {
        start: 5,
        end: 8
      }),
      frameRate: 10,
      repeat: -1
    });

    this.cursors = this.scene.input.keyboard.createCursorKeys();

    this.stars = this.scene.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    this.stars.children.iterate(function(child) {
      child.setBounceY(AbstractGame._phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.bombs = this.scene.physics.add.group();

    //  The score
    this.scoreText = this.scene.add.text(16, 16, 'score: 0', {
      fontSize: '32px',
      fill: '#000'
    });

    //  Collide the player and the stars with the platforms
    this.scene.physics.add.collider(this.player, this.platforms);
    this.scene.physics.add.collider(this.stars, this.platforms);
    this.scene.physics.add.collider(this.bombs, this.platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.scene.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );

    this.scene.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      null,
      this
    );
  }

  getUpdateGame() {
    if (this.gameOver) {
      return;
    }

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
      this.player.setVelocityY(-530);
    }
  }

  collectStar(player, star) {
    star.disableBody(true, true);

    //  Add and update the score
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);

    if (this.stars.countActive(true) === 0) {
      //  A new batch of stars to collect
      this.stars.children.iterate(function(child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      var x =
        player.x < 400
          ? AbstractGame._phaser.Math.Between(400, 800)
          : AbstractGame._phaser.Math.Between(0, 400);

      var bomb = this.bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(AbstractGame._phaser.Math.Between(-200, 200), 20);
      bomb.allowGravity = false;
    }
  }

  hitBomb(player) {
    this.scene.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    this.gameOver = true;
    this.emitGameOver();
  }

  emitGameOver() {
    this.gameover.next(true);
  }
}
