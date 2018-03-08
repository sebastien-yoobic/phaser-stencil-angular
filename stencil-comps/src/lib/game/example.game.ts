import { AbstractGame, AbstractGameEntry } from './abstract.game';

export const GAME_NAME_EXAMPLE = 'Example';

export interface ExampleEntry extends AbstractGameEntry {}

export class ExampleGame extends AbstractGame {
  constructor() {
    super();
  }

  initWithPhaser(props: ExampleEntry, phaser: any) {
    // customise the game initiation with the derived ExampleEntry
    AbstractGame._phaser = phaser;
    this.initGameInstance(
      props.gameWidth,
      props.gameHeight,
      phaser,
      props.fieldId,
      props.values,
      props.correctValues,
      props.wrongValues
    );
    this.gameInstance = this.gameInstance;
  }

  getPreloadGame() {
    // implement
  }

  getCreateGame() {
    // implement
  }

  emitGameOver() {
    this.gameover.next(true);
  }
}
