/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const GameView = __webpack_require__(6);
	
	document.addEventListener("DOMContentLoaded", function(){
	  const canvasEl = document.getElementById("gameView");
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  const ctx = canvasEl.getContext("2d");
	  const game = new Game();
	  new GameView(game, ctx);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Ship = __webpack_require__(2);
	const Clone = __webpack_require__(8);
	const Coin = __webpack_require__(7);
	const Util = __webpack_require__(4);
	const ScoreBoard = __webpack_require__(5);
	
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(3);
	const Util = __webpack_require__(4);
	const Coin = __webpack_require__(7);
	
	function randomColor() {
	  const hexDigits = "0123456789ABCDEF";
	
	  let color = "#";
	  for (let i = 0; i < 3; i ++) {
	    color += hexDigits[Math.floor((Math.random() * 16))];
	  }
	
	  return color;
	}
	
	class Ship extends MovingObject {
	  constructor(options) {
	    options.color = options.color || '#fff',
	    options.radius = Ship.RADIUS,
	    options.vel = options.vel || [0, -2];
	    super(options);
	
	    this.path = [];
	    this.counter = 0;
	  }
	
	  draw(ctx, ogShip = true) {
	    if (ogShip) {
	      let dashes = this.path.slice(Math.max(this.path.length - 50, 1));
	      dashes = dashes.filter((x, idx) => { return x.vissible; });
	      dashes.forEach((point, idx) => {
	        ctx.fillStyle = `#000`;
	        ctx.globalAlpha = (idx) / dashes.length;
	        ctx.beginPath();
	        ctx.moveTo(...point.pos);
	        ctx.lineTo(point.pos[0] + point.vel[0], point.pos[1] + point.vel[1] );
	        ctx.stroke();
	      });
	    }
	
	    super.draw(ctx);
	  }
	
	  move(timeDelta) {
	    if (this.counter === 5) {
	      this.path.push({pos: this.pos,
	                      vel:this.vel,
	                      vissible: true});
	      this.counter = 0;
	    } else {
	      this.path.push({pos: this.pos,
	                      vel:this.vel,
	                      vissible: false});
	      this.counter++;
	    }
	    super.move(timeDelta);
	  }
	
	  changeDirection(delta) {
	    this.vel = Util.rotate(this.vel, delta);
	  }
	
	  collideWith(object) {
	    if (object instanceof Coin ) {
	      this.game.pathPos = this.path.length - 1;
	      this.game.remove(object);
	    } else {
	      this.game.over = true;
	    }
	  }
	
	}
	
	Ship.RADIUS = 10;
	module.exports = Ship;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(4);
	
	class MovingObject {
	  constructor(options) {
	    this.pos = options.pos;
	    this.vel = options.vel || [0,0];
	    this.radius = options.radius;
	    this.color = options.color;
	    this.game = options.game;
	    this.isWrappable = true;
	  }
	
	  collideWith(otherObject) {
	    // default do nothing
	  }
	
	  draw(ctx) {
	    ctx.fillStyle = this.color;
	    ctx.globalAlpha = 1;
	    ctx.beginPath();
	    ctx.arc(
	      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
	    );
	    ctx.fill();
	  }
	
	  isCollidedWith(otherObject) {
	    const centerDist = Util.dist(this.pos, otherObject.pos);
	    return centerDist < (this.radius + otherObject.radius);
	  }
	
	  move(timeDelta) {
	    this.pos = [this.pos[0] + this.vel[0],
	                this.pos[1] + this.vel[1]];
	
	    if (this.game.isOutOfBounds(this.pos)) {
	      if (this.isWrappable) {
	        this.pos = this.game.wrap(this.pos);
	      } else {
	        this.remove();
	      }
	    }
	  }
	
	  remove() {
	    this.game.remove(this);
	  }
	}
	
	const NORMAL_FRAME_TIME_DELTA = 1000/60;
	
	module.exports = MovingObject;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const ScoreBoard = __webpack_require__(5);
	
	const Util = {
	
	  // Normalize the length of the vector to 1, maintaining direction.
	  dir (vec) {
	    var norm = Util.norm(vec);
	    return Util.scale(vec, 1 / norm);
	  },
	
	  // Find distance between two points.
	  dist (pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  },
	
	  // Find the length of the vector.
	  norm (vec) {
	    return Util.dist([0, 0], vec);
	  },
	
	  // Return a randomly oriented vector with the given length.
	  randomVec (length) {
	    var deg = 2 * Math.PI * Math.random();
	    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
	  },
	
	  // Scale the length of a vector by the given amount.
	  scale (vec, m) {
	    return [vec[0] * m, vec[1] * m];
	  },
	
	  // Rotate a vector
	  rotate (ventor, angle) {
	    let newVector = ventor.slice(0);
	    let vec0 = newVector[0];
	    let vec1 = newVector[1];
	    newVector[0] = (vec0 * Math.cos(angle)) - (vec1 * Math.sin(angle));
	    newVector[1] = (vec0 * Math.sin(angle)) + (vec1 * Math.cos(angle));
	    return newVector;
	  },
	
	  // Generate odd size grid of n x n
	  oddSizeGrid (n) {
	    n = Math.floor(n - (n / 3) - 1);
	    let center = [500 / 2 , 500 / 2];
	    let grid = [];
	    for (let i = -(ScoreBoard.BLOCK_SIZE + ScoreBoard.PADDING) * n;
	             i < ((ScoreBoard.BLOCK_SIZE + ScoreBoard.PADDING) * n) + 1;
	             i += ScoreBoard.BLOCK_SIZE + ScoreBoard.PADDING) {
	      for (let j = -(ScoreBoard.BLOCK_SIZE + ScoreBoard.PADDING) * n;
	               j < ((ScoreBoard.BLOCK_SIZE + ScoreBoard.PADDING) * n) + 1;
	               j += ScoreBoard.BLOCK_SIZE + ScoreBoard.PADDING) {
	        grid.push([center[0] + i,center[1] + j]);
	      }
	    }
	    return grid;
	  },
	
	  // Generate even size grid of n x n
	  evenSizeGrid(n) {
	    n = Math.floor(n - (n / 4) - 1);
	    let center = [500 / 2 + (ScoreBoard.PADDING / 2) + (ScoreBoard.BLOCK_SIZE) / 2,
	                  500 / 2 + (ScoreBoard.PADDING / 2) + (ScoreBoard.BLOCK_SIZE / 2)];
	    let grid = [];
	    for (let i = -(ScoreBoard.BLOCK_SIZE + ScoreBoard.PADDING) * n;
	             i < ((ScoreBoard.BLOCK_SIZE + ScoreBoard.PADDING) * n);
	             i += ScoreBoard.BLOCK_SIZE + ScoreBoard.PADDING) {
	      for (let j = -(ScoreBoard.BLOCK_SIZE + ScoreBoard.PADDING) * n;
	               j < ((ScoreBoard.BLOCK_SIZE + ScoreBoard.PADDING) * n);
	               j += ScoreBoard.BLOCK_SIZE + ScoreBoard.PADDING) {
	        grid.push([center[0] + i,center[1] + j]);
	      }
	    }
	    return grid;
	  },
	
	  wrap (coord, max) {
	    if (coord < 0) {
	      return max - (coord % max);
	    } else if (coord > max) {
	      return coord % max;
	    } else {
	      return coord;
	    }
	  }
	};
	
	module.exports = Util;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	
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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(3);
	
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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	const Ship = __webpack_require__(2);
	const Util = __webpack_require__(4);
	const MovingObject = __webpack_require__(3);
	
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map