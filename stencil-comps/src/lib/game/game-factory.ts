import * as fromGame from './index';

export function gameFactory(name: string): fromGame.AbstractGame {
  switch (name) {
    case fromGame.GAME_NAME_JUMPER:
      return new fromGame.JumperGame();
    case fromGame.GAME_NAME_EXAMPLE:
      return new fromGame.ExampleGame();
    default:
      return null;
  }
}
