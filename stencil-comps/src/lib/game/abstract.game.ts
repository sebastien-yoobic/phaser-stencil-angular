import { Subject } from 'rxjs/Subject';

export interface AbstractGameEntry {
  // common props of phaser games needed in constructor
  gameWidth: number;
  gameHeight: number;
  fieldId: string;
  values: Array<string>;
  correctValues: Array<string>;
  wrongValues: Array<string>;
}

export class AbstractGame {
  protected static _phaser: any = null;
  protected static _p2: any = null;
  protected static _pixi: any = null;

  protected player;
  protected score = 0;
  protected gameWidth: number;
  protected gameHeight: number;

  protected values: Array<string> = [];
  protected correctValues: Array<string> = [];
  protected wrongValues: Array<string> = [];

  public gameInstance: any;

  //@Output() gameover = new EventEmitter<any>();
  public gameover: Subject<boolean>;

  constructor() {
    this.gameover = new Subject<boolean>();
  }

  static getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  static shuffle(array) {
    let i,
      j = 0,
      temp = null;

    for (i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  initWithPhaser(props: AbstractGameEntry, phaser: any) {
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

  initGameInstance(
    gameWidth: number,
    gameHeight: number,
    phaser: any,
    fieldId: string,
    values: Array<string>,
    correctValues: Array<string>,
    wrongValues: Array<string>
  ): any {
    this.gameHeight = gameHeight;
    this.gameWidth = gameWidth;

    this.values = values;
    this.correctValues = correctValues;
    this.wrongValues = wrongValues;

    this.gameInstance = new phaser.Game(
      this.gameWidth,
      this.gameHeight,
      phaser.AUTO,
      fieldId,
      {
        preload: () => this.getPreloadGame(),
        create: () => this.getCreateGame(),
        update: () => this.getUpdateGame()
      }
    );
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
