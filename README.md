
# Clone Crash

![screen shot](https://s15.postimg.org/aji1hna0r/Screen_Shot_2016_09_13_at_9_12_43_AM.png)

## Description

A javscript based game where you collect coins. As you do, clones spawn following the exact path you have taken. Don't crash into the clones!


## Demo

[Demo Link](https://amattson21.github.io/clone_crash/)


## Screen Shots

#### Easy
![screen shot](https://s3.postimg.org/4gn6s33lv/Screen_Shot_2016_09_13_at_9_33_25_AM.png)
#### Medium
![screen shot](https://s16.postimg.org/hurk32gt1/Screen_Shot_2016_09_13_at_9_35_27_AM.png)
#### Hard
![screen shot](https://s16.postimg.org/i0ky673tx/Screen_Shot_2016_09_13_at_9_48_52_AM.png)

## Some Interesting Features

#### Vector minipulation

Trigonometric matrix manipulation for vector calculations.

``` javascript
  rotate (ventor, angle) {
    let newVector = ventor.slice(0);
    let vec0 = newVector[0];
    let vec1 = newVector[1];
    newVector[0] = (vec0 * Math.cos(angle)) - (vec1 * Math.sin(angle));
    newVector[1] = (vec0 * Math.sin(angle)) + (vec1 * Math.cos(angle));
    return newVector;
  },
```

#### Dynamic Grid Generation

Custum built modular grid generation for scoreboard.

``` javascript
const Util {

	...

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

  	...

 }
```
---
Developed by [Alex Mattson](http://www.alexmattson.com)
