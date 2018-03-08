import * as fromGame from './index';

export function gameFactory(name: string): fromGame.AbstractGame {
    switch (name) {
        case fromGame.GAME_NAME_RUNNER:
            return new fromGame.RunnerGame();
        case fromGame.GAME_NAME_CARD:
            return new fromGame.CardGame();
    }
}