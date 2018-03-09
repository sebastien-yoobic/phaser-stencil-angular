import { AbstractGame, AbstractGameEntry } from './abstract.game';

export const GAME_NAME_EXAMPLE = 'Example';

// The custom entry of a game can be used to set-up different config in the initGameInstance
// You can see a basic example below
export interface ExampleEntry extends AbstractGameEntry {
  size?: string;
}

export class ExampleGame extends AbstractGame {
  config: any;
  scene: any;

  constructor() {
    super();
  }

  // Re implementation of the init game Instance to switch between game configs
  // config for small/large size for example
  initGameInstance(phaser: any, props: ExampleEntry) {
    let baseConfig = {
      type: phaser.AUTO,
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
    if (props.size == 'small') {
      this.config = {
        ...baseConfig,
        width: 400,
        height: 300
      };
    } else {
      this.config = {
        ...baseConfig,
        width: 800,
        height: 600
      };
    }
    this.gameInstance = new phaser.Game(this.config);
  }

  getPreloadGame() {
    // implement
    this.scene = this.gameInstance.scene.scenes[0];
  }

  getCreateGame() {
    // implement
  }

  emitGameOver() {
    this.gameover.next(true);
  }
}
