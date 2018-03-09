import { Subject } from 'rxjs/Subject';

export interface AbstractGameEntry {
  // common props of phaser games needed in constructor
  fieldId: string;
}

export class AbstractGame {
  protected static _phaser: any = null;

  public gameInstance: any;

  public gameover: Subject<boolean>;

  constructor() {
    this.gameover = new Subject<boolean>();
  }

  initWithPhaser(props: AbstractGameEntry, phaser: any) {
    AbstractGame._phaser = phaser;
    this.initGameInstance(phaser, props);
    this.gameInstance = this.gameInstance;
  }

  // !!! Should be redefined by the child
  // This is an example with fixed height and width as default 800*600
  initGameInstance(phaser: any, props: AbstractGameEntry): any {
    // Config Phaser 3 for Jumper
    let config = {
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
    this.gameInstance = new phaser.Game(config);
  }

  protected getPreloadGame() {
    return null;
  }

  protected getCreateGame() {
    return null;
  }

  protected getUpdateGame() {
    return null;
  }
}
