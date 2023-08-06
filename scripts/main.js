"use strict";

/**
 * canvasの大きさや行と列の設定
 */
const boardConfig = {
  H: 600,
  W: 300,
  ROWS: 20,
  COLS: 10,
};

/**
 * ブロックの大きさや形状の設定
 */
const tetrominoConfig = {
  BLOCK_H: boardConfig.H / boardConfig.ROWS,
  BLOCK_W: boardConfig.W / boardConfig.COLS,
  shapes: [
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
  ],
  // 新橋, 薄香, 勿忘草, 薄黄, 桜, 若竹, 藤
  colors: ["#0089A7", "#BF6766", "#7DB9DE", "#FAD689", "#FEDFE1", "#5DAC81", "#8B81C3"],
};

const entrance = document.getElementById("js-entrance");
const game = document.getElementById("js-game");
const gameStartButton = document.getElementById("js-game-start-button");

const canvas = document.createElement("canvas");
canvas.width = boardConfig.W;
canvas.height = boardConfig.H;
canvas.classList.add("game_canvas");
const ctx = canvas.getContext("2d");

let board;
let currentShape;
let freezed = false;
let currentX = 3;
let currentY = 0;
let lose = false;
let intervalRenderId;
let intervalId;
let totalScore;

/**
 * ゲームの初期化
 */
gameStartButton.addEventListener("click", () => {
  prepareBoard();
  prepareGameController();
  GameKeyController.attach();
  newGame();
});

/**
 * ゲームボードの準備処理
 */
function prepareBoard() {
  entrance.classList.add("hidden");
}

/**
 * ゲームコントローラーの準備処理
 */
const gameController = document.createElement("div");
const restartButton = document.createElement("button");
const backToTopButton = restartButton.cloneNode();
const scoreBox = gameController.cloneNode();
function prepareGameController() {
  gameController.classList.add("game_controller");
  scoreBox.classList.add("game_controller_score");
  scoreBox.innerHTML = "0 てん";

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("game_controller_buttons");

  restartButton.classList.add("game_controller_buttons_button");
  restartButton.innerText = "りすたーと";
  restartButton.addEventListener("click", () => {
    newGame();
  });

  backToTopButton.classList.add("game_controller_buttons_button");
  backToTopButton.innerText = "とっぷへもどる";
  backToTopButton.addEventListener("click", () => {
    window.location.reload();
  });

  buttonContainer.append(restartButton, backToTopButton);
  gameController.append(scoreBox, buttonContainer);

  game.classList.add("game");
  game.append(canvas);
  game.append(gameController);
}

/**
 * ユーザーのキーボードアクションを定義
 */
class GameKeyController {
  static keys = {
    ArrowLeft: "left",
    ArrowRight: "right",
    ArrowDown: "down",
    ArrowUp: "rotate",
    Space: "drop",
  };
  static body = document.body;

  constructor() {
    GameKeyController.attach();
  }

  static attach() {
    GameKeyController.body.addEventListener("keydown", GameKeyController.keyHandler);
  }

  static destroy() {
    GameKeyController.body.removeEventListener("keydown", GameKeyController.keyHandler);
  }

  static keyHandler = (e) => {
    if (typeof GameKeyController.keys[e.code] === "string") {
      keyPress(GameKeyController.keys[e.code]);
      renderBoard();
    }
  };
}

/**
 * ゲームのスタート処理
 */
function newGame() {
  initializeState();
  GameKeyController.attach();
  generateNewShape();
  renderBoard();
  intervalRenderId = setInterval(renderBoard, 30);
  intervalId = setInterval(tick, 1000);
}

function endGame() {
  initializeState();
  game.innerHTML = "";
  entrance.classList.remove("hidden");
}

/**
 * 状態の初期化をする処理
 */
function initializeState() {
  currentShape = [];
  lose = false;
  totalScore = 0;
  restartButton.disabled = true;
  clearAllIntervals(intervalId, intervalRenderId);
  clearBoard();
}

function clearAllIntervals(intervalId, intervalRenderId) {
  clearInterval(intervalId);
  clearInterval(intervalRenderId);
}

/**
 * ボードの初期化処理
 */
function clearBoard() {
  board = [];
  for (let y = 0; y < boardConfig.ROWS; y++) {
    const a = [];
    for (let x = 0; x < boardConfig.COLS; x++) {
      a.push(0);
    }
    board.push(a);
  }
}

/**
 * ボード全体を描画する処理
 */
function renderBoard() {
  ctx.clearRect(0, 0, boardConfig.W, boardConfig.H);

  ctx.strokeStyle = "black";
  for (let y = 0; y < boardConfig.ROWS; y++) {
    for (let x = 0; x < boardConfig.COLS; x++) {
      if (board[y][x]) {
        ctx.fillStyle = tetrominoConfig.colors[board[y][x] - 1];
        drawBlock(x, y);
      }
    }
  }

  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      if (currentShape[y][x]) {
        ctx.fillStyle = tetrominoConfig.colors[currentShape[y][x] - 1];
        drawBlock(x + currentX, y + currentY);
      }
    }
  }
}

/**
 * ブロックを描画する処理
 * @param {number} x
 * @param {number} y
 */
function drawBlock(x, y) {
  const BLOCK_W = tetrominoConfig.BLOCK_W;
  const BLOCK_H = tetrominoConfig.BLOCK_H;
  ctx.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
  ctx.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
}

/**
 * ランダムに新しいテトロミノを生成する処理
 */
function generateNewShape() {
  const randomIndex = Math.floor(Math.random() * tetrominoConfig.shapes.length);
  const newShape = tetrominoConfig.shapes[randomIndex];
  currentShape = newShape;

  freezed = false;
  currentX = 3;
  currentY = 0;
}

/**
 * テトロミノをY方向に動かす処理と着地時の処理
 */
function tick() {
  if (valid(0, 1)) {
    currentY++;
  } else {
    freeze();
    valid(0, 1);
    if (lose) {
      clearAllIntervals(intervalId, intervalRenderId);
      restartButton.disabled = false;
      GameKeyController.destroy();
      const pastBestScore = localStorage.getItem(`bestScore`);
      if (totalScore > pastBestScore) {
        const score = document.getElementById("js-score");
        score.innerHTML = `過去のべすとすこあ ${totalScore} てん`;
        localStorage.setItem("bestScore", `${totalScore}`);
      }
      return;
    }
    clearLines();
    generateNewShape();
  }
}

/**
 * 過去のベストスコア表示を更新する処理
 */
function updatePastScoreView() {
  let pastBestScore = localStorage.getItem("bestScore");
  if (!pastBestScore) {
    localStorage.setItem("bestScore", "0");
    pastBestScore = localStorage.getItem("bestScore");
  }
  const score = document.getElementById("js-score");
  score.innerHTML = `過去のべすとすこあ ${pastBestScore} てん`;
}

updatePastScoreView(); // ユーザーのページ訪問時

/**
 * テトロミノの回転処理
 * @param {number[][]} current
 * @returns{number[][]} newCurrent
 */
function rotate(current) {
  let newCurrent = [];
  for (let y = 0; y < 4; ++y) {
    newCurrent[y] = [];
    for (let x = 0; x < 4; ++x) {
      newCurrent[y][x] = current[3 - x][y];
    }
  }

  return newCurrent;
}

function valid(shiftX = 0, shiftY = 0, newCurrentShape) {
  shiftX = currentX + shiftX;
  shiftY = currentY + shiftY;
  newCurrentShape = newCurrentShape || currentShape;

  for (let y = 0; y < 4; ++y) {
    for (let x = 0; x < 4; ++x) {
      if (newCurrentShape[y][x]) {
        if (
          typeof board[y + shiftY] === "undefined" ||
          typeof board[y + shiftY][x + shiftX] === "undefined" ||
          board[y + shiftY][x + shiftX] ||
          x + shiftX < 0 ||
          y + shiftY < 0 ||
          x + shiftX >= boardConfig.COLS ||
          y + shiftY >= boardConfig.ROWS
        ) {
          // 敗北時は、currentY = 0, 引数のshiftY = 1の時 かつ freezed = true
          if (shiftY == 1 && freezed) {
            lose = true;
          }
          return false;
        }
      }
    }
  }
  return true;
}

function freeze() {
  for (let y = 0; y < 4; ++y) {
    for (let x = 0; x < 4; ++x) {
      if (currentShape[y][x]) {
        board[y + currentY][x + currentX] = currentShape[y][x];
      }
    }
  }

  freezed = true;
}

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function clearLines() {
  let x = 0;
  for (let y = 0; y < boardConfig.ROWS; ++y) {
    let ok = true;
    for (let x = 0; x < boardConfig.COLS; ++x) {
      if (!board[y][x]) {
        ok = false;
      }
    }

    if (ok) {
      await sleep(100);
      board.splice(y, 1);
      const a = [];
      for (let x = 0; x < boardConfig.COLS; x++) {
        a.push(0);
      }
      x++;
      board.unshift(a);
    }
  }

  if (x) {
    renderNewScore(x);
  }
}

/**
 *
 * @param {number} x
 * @returns {number} score
 */
function computeScore(x) {
  let score = 20 * (x - 1) + 10;
  return score;
}

/**
 * @param {number} x
 * @returns {void}
 */
function renderNewScore(x) {
  totalScore += computeScore(x);
  scoreBox.innerHTML = `${totalScore} てん`;
}

/**
 * ユーザーのキーボードアクションを受け取り、テトロミノを動かす
 * @param {string} key
 */
function keyPress(key) {
  switch (key) {
    case "left":
      if (valid(-1)) {
        currentX--;
      }
      break;
    case "right":
      if (valid(1)) {
        currentX++;
      }
      break;
    case "down":
      if (valid(0, 1)) {
        currentY++;
      }
      break;
    case "rotate":
      let newCurrentShape = rotate(currentShape);
      if (valid(0, 0, newCurrentShape)) {
        currentShape = newCurrentShape;
      }
      break;
    case "drop":
      while (valid(0, 1)) {
        currentY++;
      }
      tick();
      break;
  }
}
