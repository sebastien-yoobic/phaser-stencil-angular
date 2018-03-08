import { AbstractGame, AbstractGameEntry } from './abstract.game';

export const GAME_NAME_CARD = 'Card';

export interface CardGameEntry extends AbstractGameEntry {
  inputCard: Array<boolean>;
}

export class CardGame extends AbstractGame {
  private gameOptions = {
    cardScale: 1,
    cardWidth: 167,
    cardHeight: 243,
    flipSpeed: 190,
    flipZoom: 1.5,
    initViewDuration: 2000,
    backgroundColor: '#fff',
    mainLabelColor: '#41307c',
    cardTextColor: '#1d1f35',
    correctAnswerColor: '#44C3AA'
  };
  private REVEALED_FRAME = 1;

  private cards = [];
  private texts = [];

  private flippingCards = [];
  private lastPickedCards = [];
  private mainLabel;

  constructor() {
    super();
  }

  getPreloadGame() {
    this.gameInstance.load.spritesheet(
      'card',
      'assets/stencil-build/game-assets/card_sprite.png',
      this.gameOptions.cardWidth,
      this.gameOptions.cardHeight
    );
  }

  getCreateGame() {
    console.log('CreateGame Card');
    this.gameInstance.stage.backgroundColor = this.gameOptions.backgroundColor;
    this.resetGameData();
    this.initDeck();
    this.initHUD();
  }

  initDeck() {
    this.gameOptions.cardScale =
      Math.min(
        this.gameInstance.world.width / 2 / this.gameOptions.cardWidth,
        this.gameInstance.world.height / 2 / this.gameOptions.cardHeight
      ) - 0.05;
    this.gameOptions.flipZoom = this.gameOptions.cardScale * 1.5;

    let positions = [
      { x: 10, y: 15 },
      {
        x:
          this.gameInstance.world.width -
          this.gameOptions.cardWidth * this.gameOptions.cardScale -
          5,
        y: 15
      },
      {
        x: 10,
        y:
          this.gameInstance.world.height -
          this.gameOptions.cardHeight * this.gameOptions.cardScale -
          15
      },
      {
        x:
          this.gameInstance.world.width -
          this.gameOptions.cardWidth * this.gameOptions.cardScale -
          5,
        y:
          this.gameInstance.world.height -
          this.gameOptions.cardHeight * this.gameOptions.cardScale -
          15
      }
    ];
    AbstractGame.shuffle(positions);

    for (let i = 0; i < this.values.length; i++) {
      this.cards[i] = this.createCard(i, positions[i], true);
      this.texts[i] = this.createCardText(this.cards[i]);
      this.createFlippingTweens(i, this.cards[i], this.texts[i]);
    }

    setTimeout(() => {
      this.hideAllCards();
      this.mainLabel.setText('');
    }, this.gameOptions.initViewDuration);
  }

  initHUD() {
    let fontSize = Math.round(
      Math.min(
        this.gameInstance.world.height * 0.05,
        this.gameInstance.world.width * 0.05
      )
    );
    //this.mainLabel = this.gameInstance.add.text(0, 0, this.translate.get('MEMORY-GAME-INSTRUCTIONS'), { fontSize: fontSize + 'px', fontWeight: 'bold', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle', backgroundColor: this.gameOptions.mainLabelColor });
    this.mainLabel = this.gameInstance.add.text(
      0,
      0,
      'MEMORY-GAME-INSTRUCTIONS',
      {
        fontSize: fontSize + 'px',
        fontWeight: 'bold',
        fill: '#fff',
        boundsAlignH: 'center',
        boundsAlignV: 'middle',
        backgroundColor: this.gameOptions.mainLabelColor
      }
    );
    this.mainLabel.setTextBounds(
      0,
      this.gameInstance.world.height / 2 - 15,
      this.gameInstance.world.width,
      30
    );
  }

  playerHasWon() {
    let hasWon = true;
    this.cards.forEach(card => {
      if (!card.data.solved) {
        hasWon = false;
      }
    });
    return hasWon;
  }

  createCard(cardIndex, pos, initRevealed) {
    let card = this.gameInstance.add.sprite(
      this.gameOptions.cardScale * this.gameOptions.cardWidth / 2 + pos.x,
      this.gameOptions.cardScale * this.gameOptions.cardHeight / 2 + pos.y,
      'card'
    );
    if (initRevealed) {
      card.frame = 1;
    }
    card.data = {
      idx: cardIndex,
      text: this.values[cardIndex],
      revealed: initRevealed === true,
      solved: false
    };
    card.anchor.set(0.5); // setting card anchor points to its center
    card.scale.set(this.gameOptions.cardScale);
    return card;
  }

  createCardText(sprite) {
    let style = {
      fontSize: '20px',
      fill: this.gameOptions.cardTextColor,
      wordWrap: true,
      wordWrapWidth: sprite.width,
      align: 'center',
      backgroundColor: 'transparent'
    };
    let text = this.gameInstance.add.text(
      sprite.x,
      sprite.y,
      sprite.data.revealed ? sprite.data.text : '',
      style
    );
    text.anchor.set(0.5);
    return text;
  }

  createFlippingTweens(cardIndex, card, text) {
    // waiting for player input
    card.inputEnabled = true;
    card.events.onInputDown.add(() => {
      this.onTapCard(cardIndex, card);
    });

    // first tween: we raise and flip the card and text
    card.flipCardTween = this.gameInstance.add
      .tween(card.scale)
      .to(
        { x: 0, y: this.gameOptions.flipZoom },
        this.gameOptions.flipSpeed / 2,
        AbstractGame._phaser.Easing.Linear.None
      );
    card.flipTextTween = this.gameInstance.add
      .tween(text.scale)
      .to(
        { x: 0, y: this.gameOptions.flipZoom },
        this.gameOptions.flipSpeed / 2,
        AbstractGame._phaser.Easing.Linear.None
      );

    // once the card and text are flipped, we change the card's frame and call the second tween
    card.flipCardTween.onComplete.add(() => {
      card.frame = 1 - card.frame;
      if (card.frame === this.REVEALED_FRAME) {
        card.data.revealed = true;
        text.setText(this.values[cardIndex]);
      } else {
        card.data.revealed = false;
        text.setText('');
      }
      card.backflipCardTween.start();
      card.backflipTextTween.start();
    });

    // second tween: we complete the flip and lower the card
    card.backflipCardTween = this.gameInstance.add
      .tween(card.scale)
      .to(
        { x: this.gameOptions.cardScale, y: this.gameOptions.cardScale },
        this.gameOptions.flipSpeed / 2,
        AbstractGame._phaser.Easing.Linear.None
      );
    card.backflipTextTween = this.gameInstance.add
      .tween(text.scale)
      .to(
        { x: this.gameOptions.cardScale, y: this.gameOptions.cardScale },
        this.gameOptions.flipSpeed / 2,
        AbstractGame._phaser.Easing.Linear.None
      );

    card.backflipCardTween.onComplete.add(() => {
      this.flippingCards[cardIndex] = false;
      this.computeGameState();
    }, this); // once the card has been placed down on the table, we can flip it again
  }

  onTapCard(cardIndex, card) {
    if (
      !this.isSomeCardFlipping() &&
      !card.data.revealed &&
      this.canFlipAnotherCard()
    ) {
      this.flippingCards[cardIndex] = true;
      this.lastPickedCards.push(card.data.idx);
      card.flipCardTween.start();
      card.flipTextTween.start();
    }
  }

  isSomeCardFlipping() {
    return this.flippingCards.indexOf(true) >= 0;
  }

  canFlipAnotherCard() {
    return (
      this.cards.reduce((nbRevealedCards, card) => {
        if (card.data.revealed === true && card.data.solved === false) {
          nbRevealedCards++;
        }
        return nbRevealedCards;
      }, 0) < 2
    );
  }

  hideAllCards() {
    for (let i = 0; i < this.values.length; i++) {
      if (
        this.cards[i].data.revealed === true &&
        this.cards[i].data.solved === false
      ) {
        this.flippingCards[i] = true;
        this.cards[i].flipCardTween.start();
        this.cards[i].flipTextTween.start();
      }
    }
  }

  computeGameState() {
    let isGameOver = false;
    if (this.lastPickedCards.length === 2) {
      if (
        this.lastPickedCards.indexOf(0) >= 0 &&
        this.lastPickedCards.indexOf(1) >= 0
      ) {
        this.cards[0].data.solved = true;
        this.cards[1].data.solved = true;
        this.texts[0].addColor(this.gameOptions.correctAnswerColor, 0);
        this.texts[1].addColor(this.gameOptions.correctAnswerColor, 0);
      }

      if (
        this.lastPickedCards.indexOf(2) >= 0 &&
        this.lastPickedCards.indexOf(3) >= 0
      ) {
        this.cards[2].data.solved = true;
        this.cards[3].data.solved = true;
        this.texts[2].addColor(this.gameOptions.correctAnswerColor, 0);
        this.texts[3].addColor(this.gameOptions.correctAnswerColor, 0);
      }

      isGameOver = this.playerHasWon();
    }

    if (this.lastPickedCards.length >= 2) {
      this.lastPickedCards = [];
      setTimeout(() => this.hideAllCards(), 800);
    }

    if (isGameOver) {
      //this.mainLabel.setText(this.translate.get('GAMEOVER'));
      this.mainLabel.setText('GAMEOVER');
      // this.mainLabel.addColor(this.gameOptions.correctAnswerColor, 0);
      //this.gameover.emit(this.score);
      this.gameover.next(true);
    }
  }

  resetGameData() {
    this.cards = [];
    this.texts = [];

    this.flippingCards = [];
    this.lastPickedCards = [];
  }
}
