const Game = require("./game");
// const Util = require('./util');

class ScoreBoard {
  constructor(options, Util) {
    this.Util = Util;
  }

  easy(ctx, coins) {
    let coinCount = 0;
    let grid = this.Util.oddSizeGrid(3);
    grid.forEach(block => {
      if (coins > coinCount) {
        this.draw(ctx, block, true, ScoreBoard.EASY_BLOCK_COLOR);
        coinCount++;
      } else {
        this.draw(ctx, block, false, ScoreBoard.EASY_BLOCK_COLOR);
      }
    });
  }

  medium(ctx, coins) {
    let coinCount = 0;
    let grid = this.Util.evenSizeGrid(4);
    grid.forEach(block => {
      if (coins > coinCount) {
        this.draw(ctx, block, true, ScoreBoard.MEDIUM_BLOCK_COLOR);
        coinCount++;
      } else {
        this.draw(ctx, block, false, ScoreBoard.MEDIUM_BLOCK_COLOR);
      }
    });
  }

  hard(ctx, coins) {
    let coinCount = 0;
    let grid = this.Util.oddSizeGrid(5);
    grid.forEach(block => {
      if (coins > coinCount) {
        this.draw(ctx, block, true, ScoreBoard.HARD_BLOCK_COLOR);
        coinCount++;
      } else {
        this.draw(ctx, block, false, ScoreBoard.HARD_BLOCK_COLOR);
      }
    });
  }

  draw(ctx, center, isHighlighted, background){
    if (isHighlighted) {
      ctx.fillStyle = '#f1d29a';
    } else {
      ctx.fillStyle = background;
    }
    ctx.beginPath();
    ctx.rect(center[0] - ScoreBoard.BLOCK_SIZE / 2,
             center[1] - ScoreBoard.BLOCK_SIZE / 2,
             ScoreBoard.BLOCK_SIZE, ScoreBoard.BLOCK_SIZE);
    ctx.fill();
  }
}

ScoreBoard.EASY_BLOCK_COLOR = '#d7f8f2';
ScoreBoard.MEDIUM_BLOCK_COLOR = '#e9ece5';
ScoreBoard.HARD_BLOCK_COLOR = '#d4e6e2';

ScoreBoard.BLOCK_SIZE = 30;
ScoreBoard.PADDING = 5;

module.exports = ScoreBoard;
