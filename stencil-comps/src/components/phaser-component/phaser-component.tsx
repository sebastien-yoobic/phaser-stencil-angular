import {
  Component,
  Prop,
  Event,
  EventEmitter,
  State,
  Listen
} from '@stencil/core';

import * as fromGame from '../../lib/game';

@Component({
  tag: 'phaser-component',
  styleUrl: 'phaser-component.css',
  scoped: true
})
export class PhaserComponent {
  private gameProps: fromGame.AbstractGameEntry = null; // test purpuse
  private game: fromGame.AbstractGame;
  private fieldId: string = 'game-div';

  @Prop() name: string = fromGame.GAME_NAME_CARD;
  @Prop() phaser: any; // Phaser instance imported by the framework

  @State() b: boolean;

  @Event() gameOver: EventEmitter<boolean>;

  @Listen('gameover')
  handleGameOver() {
    console.log('gameover listened');
  }

  setGameProps() {
    this.gameProps = {
      gameHeight: 500,
      gameWidth: 500,
      fieldId: this.fieldId,
      values: [],
      correctValues: [],
      wrongValues: []
    };
    console.log('gameProps', this.gameProps);
  }

  init() {
    this.game = fromGame.gameFactory(this.name);
    console.log('game', this.game);
    this.setGameProps();
    this.game.initWithPhaser(this.gameProps, this.phaser);
  }

  tick() {
    setTimeout(() => {
      this.b = !this.b;
      console.log('tick');
      this.tick();
    }, 1000);
  }

  componentDidLoad() {
    setTimeout(() => this.init(), 300);
  }

  render() {
    return (
      <div>
        YooFormInputGame needs a proper template
        <div class="container" id={this.fieldId} />
      </div>
    );
  }
}
