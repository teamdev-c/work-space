"use strict";

// board rendering config
const H = 600;
const W = 300;
const ROWS = 20;
const COLS = 10;

// block rendering config
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

const board = [];
const randomIndex = Math.floor(Math.random() * shapes.length);
const currentShape = shapes[randomIndex];

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
  prepareBoard();
  renderBoard();
  var interval = setInterval(tick, 1000);
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
  currentY++;
  renderBoard();
}
