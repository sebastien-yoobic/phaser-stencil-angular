import * as fromGame from './index';
import { gameFactory } from './index';

describe('Games', () => {
  describe('Factory', () => {
    it('Should return null if the object can not be created', () => {
      let game = gameFactory(null);
      expect(game).toBeNull();
    });

    it('Should return a Jumper game', () => {
      let game = gameFactory(fromGame.GAME_NAME_JUMPER);
      expect(game).toEqual(new fromGame.JumperGame());
    });
  });
});
