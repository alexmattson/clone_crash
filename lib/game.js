const Ship = require('./ship');
const Clone = require('./clone');
const Coin = require('./coin');
const Util = require('./util');
const ScoreBoard = require('./score_board');

class Game {
  constructor() {
    this.ship = this.addShip();
    this.coin = this.addCoin();

    this.over = false;
    this.scoreBoard = new ScoreBoard({game: this}, Util);
    this.coins = 0;

    // for clones
    this.pathPos = null;
    this.cloneTimer = 0;
    this.clones = [];
  }

  addShip() {
    return new Ship({
      pos: [Game.DIM_X / 2, Game.DIM_Y / 2],
      game: this
    });
  }

  addClone() {
    return new Clone({
      pos: [Game.DIM_X / 2, Game.DIM_Y / 2],
      game: this,
      ogShip: this.ship,
      pathPos: this.pathPos
    });
  }

  addCoin() {
    return new Coin({
      pos: this.randomPosition(),
      game: this
    });
  }

  allObjects() {
    let objects = [];
    objects.push(this.coin);
    objects = objects.concat(this.clones);
    return objects;
  }

  checkCollisions() {
    this.allObjects().forEach(object => {
      if (this.ship.isCollidedWith(object)) {
        this.ship.collideWith(object);
      }
    });
  }

  draw(ctx, level) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    if (level === 'hard') {
      ctx.fillStyle = Game.HARD_BG_COLOR;
    } else if (level === 'medium') {
      ctx.fillStyle = Game.MEDIUM_BG_COLOR;
    } else {
      ctx.fillStyle = Game.EASY_BG_COLOR;
    }
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    switch(level) {
      case 'hard':
        this.scoreBoard.hard(ctx, this.coins);
        break;
      case 'medium':
        this.scoreBoard.medium(ctx, this.coins);
        break;
      default:
        this.scoreBoard.easy(ctx, this.coins);
    }

    this.ship.draw(ctx);
    this.allObjects().forEach((object) => {
      object.draw(ctx);
    });
  }

  isOutOfBounds(pos) {
    return (pos[0] < 0) || (pos[1] < 0) ||
      (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
  }

  moveObjects(delta) {
    this.ship.move(delta);
    this.allObjects().forEach((object) => {
      object.move(delta);
    });
  }

  randomPosition() {
    return [
      Game.DIM_X * Math.random(),
      Game.DIM_Y * Math.random()
    ];
  }

  remove(object) {
    if (object instanceof Coin) {
      this.coins++;
      this.coin = this.addCoin();
    } else if (object instanceof Clone) {
      let idx = this.clones.indexOf(object);
      this.clones.splice(idx, 1);
    }
  }

  manageClones(){
    if (this.coins > 0) {
      if (this.cloneTimer == Game.CLONE_SPLIT) {
        this.clones.push(this.addClone());
        this.cloneTimer = 0;
      } else {
        this.cloneTimer++;
      }
    }
  }

  step(delta) {
    this.manageClones();
    this.moveObjects(delta);
    this.checkCollisions();
  }

  wrap(pos) {
    return [
      Util.wrap(pos[0], Game.DIM_X), Util.wrap(pos[1], Game.DIM_Y)
    ];
  }
}

Game.CLONE_SPLIT = 60;
Game.EASY_BG_COLOR = "#c0dfd9";
Game.MEDIUM_BG_COLOR = "#babdb7";
Game.HARD_BG_COLOR = "#b3c2bf";
Game.DIM_X = 500;
Game.DIM_Y = 500;
Game.FPS = 32;

module.exports = Game;
