import { boardConfig } from "../config";
import { BoardModel, JudgeModel, ScoreModel, ShapeModel } from "../models";
import { BoardView, ScoreView, canvas, GameHandlerView } from "../views";

export class GameController {
  intervalId;
  intervalRenderId;
  shapeModel;
  boardModel;
  judgeModel;
  scoreModel;

  constructor() {
    this.shapeModel = new ShapeModel();
    this.boardModel = new BoardModel();
    this.judgeModel = new JudgeModel();
    this.scoreModel = new ScoreModel();
    this.gameStart();
    this.updatePastScore();
  }

  gameStart() {
    const gameStartButton = document.getElementById("js-game-start-button");
    gameStartButton.addEventListener("click", () => {
      this.prepareGameControllerView();
      this.newGame();
    });
  }

  newGame() {
    this.initializeStates();
    this.initializeViews();
    this.clearAllIntervals(this.intervalId, this.intervalRenderId);
    this.keyEventAttach();
    this.shapeModel.createNewShape();
    this.intervalRenderId = setInterval(() => {
      const board = this.boardModel.getBoard();
      const currentShape = this.shapeModel.getCurrentShape();
      const currentX = this.shapeModel.getCurrentX();
      const currentY = this.shapeModel.getCurrentY();

      BoardView.renderBase(board, currentShape, currentX, currentY);
      let shiftY = 0;
      while (this.valid(0, shiftY + 1)) {
        shiftY++;
      }
      BoardView.renderEstimatedFallingPos(currentShape, currentX, currentY, shiftY);
    }, 30);
    // 参考: https://engineering.webstudio168.jp/2022/04/bind-method/
    this.intervalId = setInterval(this.tick.bind(this), 1000);
  }

  initializeStates() {
    this.shapeModel.resetCurrentShape();
    this.judgeModel.resetLose();
    this.scoreModel.resetTotal();
    this.boardModel.resetBoard();
  }

  initializeViews() {
    GameHandlerView.restartButtonDisabled();
    ScoreView.update(this.scoreModel.getTotal());
  }

  clearAllIntervals(intervalId, intervalRenderId) {
    clearInterval(intervalId);
    clearInterval(intervalRenderId);
  }

  prepareGameControllerView() {
    BoardView.prepare();

    const game = document.getElementById("js-game");
    const gameController = document.createElement("div");
    gameController.classList.add("game_controller");

    const { scoreBox } = ScoreView.prepare();
    const { buttonContainer, restartButton, backToTopButton } = GameHandlerView.prepare();
    restartButton.addEventListener("click", () => {
      this.newGame();
    });

    backToTopButton.addEventListener("click", () => {
      window.location.reload();
    });

    gameController.append(scoreBox, buttonContainer);
    game.classList.add("game");
    game.append(canvas);
    game.append(gameController);
  }

  freeze() {
    const currentShape = this.shapeModel.getCurrentShape();
    const currentX = this.shapeModel.getCurrentX();
    const currentY = this.shapeModel.getCurrentY();
    this.boardModel.appendCurrentShapeToBoard(currentShape, currentX, currentY);
    this.shapeModel.setIsFreezed();
  }

  valid(shiftX = 0, shiftY = 0, newCurrentShape) {
    const currentX = this.shapeModel.getCurrentX();
    const currentY = this.shapeModel.getCurrentY();
    shiftX = currentX + shiftX;
    shiftY = currentY + shiftY;

    const currentShape = this.shapeModel.getCurrentShape();
    const board = this.boardModel.getBoard();
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
            const isFreezed = this.shapeModel.getIsFreezed();
            if (shiftY == 1 && isFreezed) {
              this.judgeModel.makeLoser();
            }
            return false;
          }
        }
      }
    }
    return true;
  }

  async tick() {
    if (this.valid(0, 1)) {
      this.shapeModel.addCurrentY();
    } else {
      this.freeze();
      this.valid(0, 1);
      const isLost = this.judgeModel.getLose();
      if (isLost) {
        this.clearAllIntervals(this.intervalId, this.intervalRenderId);
        GameHandlerView.restartButtonNotDisabled();
        this.keyEventDestroy();
        let totalScore = this.scoreModel.getTotal();
        let pastBestScore = this.scoreModel.updatePastBest(totalScore);
        ScoreView.updatePastBest(pastBestScore);
        return;
      }
      const rows = await this.boardModel.clearLines();
      if (rows > 0) {
        this.renderNewScore(rows);
      }
      this.shapeModel.createNewShape();
    }
  }

  renderNewScore(rows) {
    const computedTotalScore = this.scoreModel.computeTotal(rows);
    ScoreView.update(computedTotalScore);
  }

  updatePastScore() {
    const pastBestScore = this.scoreModel.getPastBest();
    ScoreView.updatePastBest(pastBestScore);
  }

  // ゲームのキーボードアクションを定義
  keys = {
    ArrowLeft: "left",
    ArrowRight: "right",
    ArrowDown: "down",
    ArrowUp: "rotate",
    Space: "drop",
  };
  body = document.body;

  keyEventAttach() {
    this.body.addEventListener("keydown", this.boundKeyHandler);
  }

  keyEventDestroy() {
    this.body.removeEventListener("keydown", this.boundKeyHandler);
  }

  boundKeyHandler = this.keyHandler.bind(this);
  keyHandler(e) {
    if (typeof this.keys[e.code] === "string") {
      this.keyPress(this.keys[e.code]);
    }
  }

  keyPress(key) {
    switch (key) {
      case "left":
        if (this.valid(-1)) {
          this.shapeModel.subtractCurrentX();
        }
        break;
      case "right":
        if (this.valid(1)) {
          this.shapeModel.addCurrentX();
        }
        break;
      case "down":
        if (this.valid(0, 1)) {
          this.shapeModel.addCurrentY();
        }
        break;
      case "rotate":
        const currentShape = this.shapeModel.getCurrentShape();
        const newCurrentShape = this.shapeModel.rotate(currentShape);
        if (this.valid(0, 0, newCurrentShape)) {
          this.shapeModel.updateCurrentShape(newCurrentShape);
        }
        break;
      case "drop":
        while (this.valid(0, 1)) {
          this.shapeModel.addCurrentY();
        }
        this.tick();
        break;
    }
  }
}
