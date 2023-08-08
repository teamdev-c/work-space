import { boardConfig, tetrominoConfig } from "./config";
import { BoardView, ScoreView, canvas } from "./views";
import { sleep } from "./utils";
import { ScoreModel, JudgeModel, ShapeModel } from "./models";

// const entrance = document.getElementById("js-entrance");
const game = document.getElementById("js-game");
const gameStartButton = document.getElementById("js-game-start-button");

let board;
let currentShape;
let freezed = false;
let currentX = 3;
let currentY = 0;
let intervalRenderId;
let intervalId;

const shapeModel = new ShapeModel();
const scoreModel = new ScoreModel();
const judgeModel = new JudgeModel();

/**
 * ゲームの初期化
 */
gameStartButton.addEventListener("click", () => {
  BoardView.prepare();
  prepareGameController();
  GameKeyController.attach();
  newGame();
});

/**
 * ゲームコントローラーの準備処理
 */
const gameController = document.createElement("div");
const restartButton = document.createElement("button");
const backToTopButton = restartButton.cloneNode();
function prepareGameController() {
  gameController.classList.add("game_controller");
  ScoreView.prepare();

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
  gameController.append(ScoreView.scoreBox, buttonContainer);

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

  static attach() {
    GameKeyController.body.addEventListener("keydown", GameKeyController.keyHandler);
  }

  static destroy() {
    GameKeyController.body.removeEventListener("keydown", GameKeyController.keyHandler);
  }

  static keyHandler = (e) => {
    if (typeof GameKeyController.keys[e.code] === "string") {
      keyPress(GameKeyController.keys[e.code]);
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
  intervalRenderId = setInterval(() => {
    // let currentShape = shapeModel.getCurrent()
    BoardView.render(board, currentShape, currentX, currentY);
  }, 30);
  intervalId = setInterval(tick, 1000);
}

/**
 * 状態の初期化をする処理
 */
function initializeState() {
  currentShape = [];
  // shapeModel.resetCurrent()
  judgeModel.resetLose();
  scoreModel.resetTotal();
  renderNewScore(0);
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
 * ランダムに新しいテトロミノを生成する処理
 */
function generateNewShape() {
  const randomIndex = Math.floor(Math.random() * tetrominoConfig.shapes.length);
  const newShape = tetrominoConfig.shapes[randomIndex];
  // shapeModel.updateCurrent(newShape)
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
    // let currentShape = shapeModel.getCurrent()
    freeze(currentShape);
    valid(0, 1);
    let lose = judgeModel.getLose();
    if (lose) {
      clearAllIntervals(intervalId, intervalRenderId);
      restartButton.disabled = false;
      GameKeyController.destroy();
      let totalScore = scoreModel.getTotal();
      let pastBestScore = scoreModel.updatePastBest(totalScore);
      ScoreView.updatePastBest(pastBestScore);
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
  let pastBestScore = scoreModel.getPastBest();
  ScoreView.updatePastBest(pastBestScore);
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
            judgeModel.makeLoser();
          }
          return false;
        }
      }
    }
  }
  return true;
}

function freeze(currentShape) {
  for (let y = 0; y < 4; ++y) {
    for (let x = 0; x < 4; ++x) {
      if (currentShape[y][x]) {
        board[y + currentY][x + currentX] = currentShape[y][x];
      }
    }
  }

  freezed = true;
}

async function clearLines() {
  let x = 0;
  for (let y = 0; y < boardConfig.ROWS; ++y) {
    let ok = true;
    for (let x = 0; x < boardConfig.COLS; ++x) {
      if (!board[y][x]) {
        ok = false;
      }
    }

    console.log("ss");

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
 * @param {number} x
 * @returns {void}
 */
function renderNewScore(x) {
  const computedTotalScore = scoreModel.computeTotal(x);
  ScoreView.update(computedTotalScore);
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
      // let currentShape = shapeModel.getCurrent()
      let newCurrentShape = rotate(currentShape);
      if (valid(0, 0, newCurrentShape)) {
        // shapeModel.updateCurrent(newCurrentShape)
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
