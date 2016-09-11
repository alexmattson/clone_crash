const Ship = require("./ship");
const Util = require('./util');
const MovingObject = require("./moving_object");

class Clone extends Ship {
  constructor(options) {
    options.color = '#444',
    options.radius = Ship.RADIUS,
    options.vel = options.vel || [0, -2];
    super(options);

    this.ogShip = options.ogShip;
    this.path = this.ogShip.path.slice(0);
    this.lifeSpan = options.pathPos;
  }

  move() {
    if (this.lifeSpan > 0) {
      this.lifeSpan--;
      this.pos = this.path.shift().pos;
    } else {
      this.game.remove(this);
    }
  }

  draw (ctx) {
    super.draw(ctx, false);
  }

  changeDirection(delta) {
    this.vel = Util.rotate(this.vel, delta);
  }

}

module.exports = Clone;
