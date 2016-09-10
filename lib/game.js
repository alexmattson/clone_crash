const Ship = require('./ship');
const Util = require('./util');

class Game {
  constructor() {
    this.ship = new Ship({
      pos: this.randomPosition(),
      game: this,
      color: '#b3c2bf'
    });
  }

  add(object) {
  }

  addAsteroids() {
  }

  addShip() {
  }

  allObjects() {
  }

  checkCollisions() {
    // const allObjects = this.allObjects();
    // for (let i = 0; i < allObjects.length; i++) {
    //   for (let j = 0; j < allObjects.length; j++) {
    //     const obj1 = allObjects[i];
    //     const obj2 = allObjects[j];
    //
    //     if (obj1.isCollidedWith(obj2)) {
    //       const collision = obj1.collideWith(obj2);
    //       if (collision) return;
    //     }
    //   }
    // }
  }

  draw(ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.ship.draw(ctx);
    // this.allObjects().forEach((object) => {
    //   object.draw(ctx);
    // });
  }

  isOutOfBounds(pos) {
    return (pos[0] < 0) || (pos[1] < 0) ||
      (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
  }

  moveObjects(delta) {
    this.ship.move(delta);
    // this.allObjects().forEach((object) => {
    //   object.move(delta);
    // });
  }

  randomPosition() {
    return [
      Game.DIM_X * Math.random(),
      Game.DIM_Y * Math.random()
    ];
  }

  remove(object) {

  }

  step(delta) {
    this.moveObjects(delta);
    // this.checkCollisions();
  }

  wrap(pos) {
    return [
      Util.wrap(pos[0], Game.DIM_X), Util.wrap(pos[1], Game.DIM_Y)
    ];
  }
}

Game.BG_COLOR = "#c0dfd9";
Game.DIM_X = 500;
Game.DIM_Y = 500;
Game.FPS = 32;
Game.NUM_ASTEROIDS = 10;

module.exports = Game;
