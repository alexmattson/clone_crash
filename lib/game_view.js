const Game = require('./game');

class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.level = null;
    this.paused = false;

    this.selectLevel();
  }

  bindKeyHandlers() {
    const ship = this.game.ship;

    key('space', ()=> { this.pause(); });

    Object.keys(GameView.MOVES).forEach((k) => {
      let move = GameView.MOVES[k];
      key(k, () => { ship.changeDirection(move); });
    });
  }

  pause() {
    this.paused = this.paused ? false : true;
  }

  selectLevel() {
    let $buttons = $('.buttons');
    let $easyButton = $(`<button class="easy-btn btn">Easy</button>`);
    let $mediumButton = $(`<button class="medium-btn btn">Medium</button>`);
    let $hardButton = $(`<button class="hard-btn btn">Hard</button>`);

    $buttons.append($easyButton);
    $buttons.append($mediumButton);
    $buttons.append($hardButton);

    let thisView = this;

    let setLevel = function (level) {
      thisView.level = level;
      $("button").remove();
      thisView.makeMove();
    };

    $(".easy-btn").click((event) => {
      this.level = 'easy';
      document.body.style.background = '#c0dfd9';
      document.getElementById('homeScreen').style.display = "none";
      this.start();
    });

    $(".medium-btn").click((event) => {
      this.level = 'medium';
      document.body.style.background = '#babdb7';
      document.getElementById('homeScreen').style.display = "none";
      this.start();
    });

    $(".hard-btn").click((event) => {
      this.level = 'hard';
      document.body.style.background = '#b3c2bf';
      document.getElementById('homeScreen').style.display = "none";
      this.start();
    });
  }

  start() {
    this.bindKeyHandlers();
    this.lastTime = 0;

    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    const timeDelta = time - this.lastTime;

    if ( this.paused ) {
      document.getElementById('pauseScreen').style.display = "flex";
    } else {
      if (this.won() || this.game.over) {
        this.renderResetScreen();
        return;
      } else {
        document.getElementById('pauseScreen').style.display = "none";
        this.game.step(timeDelta);
        this.game.draw(this.ctx, this.level);
      }
    }

    this.lastTime = time;
    requestAnimationFrame(this.animate.bind(this));
  }

  won(){
    switch (this.level) {
      case 'easy':
        if ( this.game.coins === 9 ) { return true; }
      case 'medium':
        if ( this.game.coins === 16 ) { return true; }
      case 'hard':
        if ( this.game.coins === 25 ) { return true; }
      default:
        false;
    }
  }

  renderResetScreen() {
    let $endScreen = $('#endScreen');
    if (this.won()) {
      let $winMessage = $('<h1>You Win</h1>');
      $endScreen.append($winMessage);
    } else {
      let $loseMessage = $('<h1>You Lose</h1>');
      $endScreen.append($loseMessage);
    }
    let $reset = $('<button class="reset-btn btn">Main Menu</button>');
    $endScreen.append($reset);

    document.getElementById('endScreen').style.display = 'flex';
    $('.reset-btn').click(()=> {
      $('.buttons').empty();
      $('#endScreen').empty();
      document.getElementById('endScreen').style.display = 'none';
      document.getElementById('homeScreen').style.display = 'flex';

      document.body.style.background = '#daf9f2';

      const canvasEl = document.getElementById("gameView");
      canvasEl.width = Game.DIM_X;
      canvasEl.height = Game.DIM_Y;

      const ctx = canvasEl.getContext("2d");
      const game = new Game();
      new GameView(game, ctx);
    });
  }

}

GameView.MOVES = {
  "a": -(20 * Math.PI / 360),
  "d": (20 * Math.PI / 360),
  "left": -(20 * Math.PI / 360),
  "right": (20 * Math.PI / 360),
};

module.exports = GameView;
