const MovingObject = require("./moving_object");

class Coin extends MovingObject {
  constructor(options) {
    options.radius = 7;
    options.color = '#fff';
    super(options);
  }

  draw(ctx) {
    for (let i = 3; i < 7; i += 2) {
      ctx.strokeStyle="#fff";
      ctx.beginPath();
      ctx.arc(
        this.pos[0], this.pos[1], this.radius + i, 0, 2 * Math.PI, true
      );
      ctx.stroke();
    }

    super.draw(ctx);
  }

}

module.exports = Coin;
