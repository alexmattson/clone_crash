const ScoreBoard = require('./score_board');

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


  // Generate n x n grid
  generateGrid (n) {
    return (n % 2 === 0 ? Util.evenSizeGrid(n) : Util.oddSizeGrid (n));
  },

  // Generate odd size grid of n x n
  oddSizeGrid (n) {
    n = Math.floor(n - (n / 3) - 1);
    let center = [500 / 2 , 500 / 2];
    return Util.generateGrid(n, center, 1);
  },

  // Generate even size grid of n x n
  evenSizeGrid(n) {
    n = Math.floor(n - (n / 4) - 1);
    let center = [500 / 2 + (ScoreBoard.PADDING / 2) + (ScoreBoard.BLOCK_SIZE) / 2,
                  500 / 2 + (ScoreBoard.PADDING / 2) + (ScoreBoard.BLOCK_SIZE / 2)];
    return Util.generateGrid(n, center, 0);
  },

  // Generate grid helper
  generateGridHelper(n, center, offset) {
    let grid = [];
    for (let i = -(ScoreBoard.BLOCK_SIZE + ScoreBoard.PADDING) * n;
             i < ((ScoreBoard.BLOCK_SIZE + ScoreBoard.PADDING) * n) + offset;
             i += ScoreBoard.BLOCK_SIZE + ScoreBoard.PADDING) {
      for (let j = -(ScoreBoard.BLOCK_SIZE + ScoreBoard.PADDING) * n;
               j < ((ScoreBoard.BLOCK_SIZE + ScoreBoard.PADDING) * n) + offset;
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
