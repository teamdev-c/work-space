import { boardConfig } from "./config";
import { BoardView, ScoreView, canvas, GameHandlerView } from "./views";
import { ScoreModel, JudgeModel, ShapeModel, BoardModel } from "./models";

let intervalRenderId;
let intervalId;

const shapeModel = new ShapeModel();
const scoreModel = new ScoreModel();
const judgeModel = new JudgeModel();
const boardModel = new BoardModel();

/**
 * ゲームの初期化
 */
const gameStartButton = document.getElementById("js-game-start-button");
gameStartButton.addEventListener("click", () => {
  BoardView.prepare();
  prepareGameControllerView();
  GameKeyController.attach();
  newGame();
});

/**
 * ゲームコントローラーの準備処理
 */
const game = document.getElementById("js-game");
const gameController = document.createElement("div");

function prepareGameControllerView() {
  gameController.classList.add("game_controller");
  const { scoreBox } = ScoreView.prepare();
  const { buttonContainer, restartButton, backToTopButton } = GameHandlerView.prepare();
  restartButton.addEventListener("click", () => {
    newGame();
  });

  backToTopButton.addEventListener("click", () => {
    window.location.reload();
  });

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
  initializeView();
  GameKeyController.attach();
  shapeModel.createNewShape();
  intervalRenderId = setInterval(() => {
    let board = boardModel.getBoard();
    let currentShape = shapeModel.getCurrentShape();
    let currentX = shapeModel.getCurrentX();
    let currentY = shapeModel.getCurrentY();
    BoardView.render(board, currentShape, currentX, currentY);
  }, 30);
  intervalId = setInterval(tick, 1000);
}

/**
 * 状態の初期化をする処理
 */
function initializeState() {
  shapeModel.resetCurrentShape();
  judgeModel.resetLose();
  scoreModel.resetTotal();
  boardModel.resetBoard();
  clearAllIntervals(intervalId, intervalRenderId);
}

function initializeView() {
  ScoreView.update(scoreModel.getTotal());
}

function clearAllIntervals(intervalId, intervalRenderId) {
  clearInterval(intervalId);
  clearInterval(intervalRenderId);
}

/**
 * テトロミノをY方向に動かす処理と着地時の処理
 */
async function tick() {
  if (valid(0, 1)) {
    shapeModel.addCurrentY();
  } else {
    freeze();
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
    const rows = await boardModel.clearLines();
    if (rows > 0) {
      renderNewScore(rows);
    }
    shapeModel.createNewShape();
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

function valid(shiftX = 0, shiftY = 0, newCurrentShape) {
  let currentX = shapeModel.getCurrentX();
  let currentY = shapeModel.getCurrentY();
  shiftX = currentX + shiftX;
  shiftY = currentY + shiftY;

  let currentShape = shapeModel.getCurrentShape();
  let board = boardModel.getBoard();
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
          const freezed = shapeModel.getIsFreezed();
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

function freeze() {
  const currentShape = shapeModel.getCurrentShape();
  const currentX = shapeModel.getCurrentX();
  const currentY = shapeModel.getCurrentY();
  boardModel.appendCurrentShapeToBoard(currentShape, currentX, currentY);
  shapeModel.setIsFreezed();
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
        shapeModel.subtractCurrentX();
      }
      break;
    case "right":
      if (valid(1)) {
        shapeModel.addCurrentX();
      }
      break;
    case "down":
      if (valid(0, 1)) {
        shapeModel.addCurrentY();
      }
      break;
    case "rotate":
      const currentShape = shapeModel.getCurrentShape();
      const newCurrentShape = shapeModel.rotate(currentShape);
      if (valid(0, 0, newCurrentShape)) {
        shapeModel.updateCurrentShape(newCurrentShape);
      }
      break;
    case "drop":
      while (valid(0, 1)) {
        shapeModel.addCurrentY();
      }
      tick();
      break;
  }
}
