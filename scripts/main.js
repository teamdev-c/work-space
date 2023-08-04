"use strict";

// board rendering config
const H = 600;
const W = 300;

// block rendering config
const ROWS = 20;
const COLS = 10;
const BLOCK_H = H / ROWS;
const BLOCK_W = W / COLS;
const shapes = [
  [
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [2, 2, 2, 0],
    [2, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [3, 3, 3, 0],
    [0, 0, 3, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [4, 4, 0, 0],
    [4, 4, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [5, 5, 0, 0],
    [0, 5, 5, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 6, 6, 0],
    [6, 6, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 7, 0, 0],
    [7, 7, 7, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
];
const colors = ["cyan", "orange", "blue", "yellow", "red", "green", "purple"];

const entrance = document.getElementById("js-entrance");
const game = document.getElementById("js-game");
const gameStartButton = document.getElementById("js-game-start-button");

const canvas = document.createElement("canvas");
canvas.width = W;
canvas.height = H;
canvas.classList.add("canvas");
const ctx = canvas.getContext("2d");

let board = [];
const randomIndex = Math.floor(Math.random() * shapes.length);
let currentShape = shapes[randomIndex];

gameStartButton.addEventListener("click", () => {
  newGame();
});

function prepareBoard() {
  entrance.classList.add("hidden");
  game.append(canvas);

  // clear board by filling 0
  for (let y = 0; y < ROWS; y++) {
    const a = [];
    for (let x = 0; x < COLS; x++) {
      a.push(0);
    }
    board.push(a);
  }
}
function newGame() {
  const userGameController = new UserGameController();
  prepareBoard();
  renderBoard();
  let intervalId = setInterval(tick, 1000);
}

let currentX = 0;
let currentY = 0;

function drawBlock(x, y) {
  ctx.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
  ctx.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
}

function renderBoard() {
  ctx.clearRect(0, 0, W, H);

  ctx.strokeStyle = "black";
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (board[y][x]) {
        ctx.fillStyle = colors[board[y][x] - 1];
        drawBlock(x, y);
      }
    }
  }

  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      if (currentShape[y][x]) {
        ctx.fillStyle = colors[currentShape[y][x] - 1];
        drawBlock(x + currentX, y + currentY);
      }
    }
  }
}

function tick() {
  if (valid(0, 1)) {
    currentY++;
  } else {
    freeze();
  }
  
  renderBoard();
}

function rotate(current) {
  let newCurrent = [];
  for (let y = 0; y < 4; ++y) {
    newCurrent[y] = [];
    for (let x = 0; x < 4; ++x) {
      newCurrent[y][x] = current[3 - x][y];
    }
  }

  console.log(newCurrent);

  return newCurrent;
}

// TODO freeze処理の実装
function valid(shiftX = 0, shiftY = 0, newCurrentShape) {
  shiftX = currentX + shiftX;
  shiftY = currentY + shiftY;
  newCurrentShape = newCurrentShape || currentShape;

  for (let y = 0; y < 4; ++y) {
    for (let x = 0; x < 4; ++x) {
      if (newCurrentShape[y][x]) {
        if (typeof board[ y + shiftY ] === 'undefined'
        || typeof board[ y + shiftY][ x + shiftX ] === 'undefined'
        || board[ y + shiftY ][ x + shiftX ]
        || x + shiftX < 0
        || y + shiftY < 0
        || x + shiftX >= COLS
        || y + shiftY >= ROWS
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

function freeze() {
//   const colors = ["cyan", "orange", "blue", "yellow", "red", "green", "purple"];
//   const ROWS = 20;
// const COLS = 10;
// const BLOCK_H = H / ROWS;
// const BLOCK_W = W / COLS;
// const shapes = [
//   [
//     [1, 1, 1, 1],

  for (let y = 0; y < 4; ++y) {
    for (let x = 0; x < 4; ++x) {
      board[y + currentY][x + currentX] = currentShape[y][x];
    }
  }
}

function keyPress(key) {
  switch (key) {
    case "left":
      if (valid( -1 )) {
        currentX--;
      }
      break;
    case "right":
      if (valid( 1 )) {
        currentX++;
      }
      break;
    case "down":
      if (valid( 0, 1 )) {
        currentY++;
      }
      break;
    case "rotate":
      let newCurrentShape = rotate(currentShape);
      if (valid( 0, 0, newCurrentShape )) {
        currentShape = newCurrentShape;
      }
      break;
    case "drop":
      while(valid( 0, 1 )) {
        currentY++;
      }
      tick();
      break;
  }
}

/**
 * ユーザーのキーボードアクションを定義
 */
class UserGameController {
  keys = {
    ArrowLeft: "left",
    ArrowRight: "right",
    ArrowDown: "down",
    ArrowUp: "rotate",
    Space: "drop",
  };
  body = document.body;

  constructor() {
    this.body.addEventListener("keydown", this.keyHandler);
  }

  destroy() {
    this.body.removeEventListener("keydown", this.keyHandler);
  }

  keyHandler = (e) => {
    if (typeof this.keys[e.code] === "string") {
      keyPress(this.keys[e.code]);
      renderBoard();
    }
  };
}
