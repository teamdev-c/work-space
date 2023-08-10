import { boardConfig } from "../config";
import { BoardModel, JudgeModel, ScoreModel, ShapeModel, SoundModel } from "../models";
import { BoardView, ScoreView, GameHandlerView, SoundView } from "../views";
import { GameView } from "../views/game";

export class GameController {
  intervalId;
  intervalRenderId;
  shapeModel;
  boardModel;
  judgeModel;
  scoreModel;
  soundModel;

  constructor() {
    this.shapeModel = new ShapeModel();
    this.boardModel = new BoardModel();
    this.judgeModel = new JudgeModel();
    this.scoreModel = new ScoreModel();
    this.soundModel = new SoundModel();
    this.gameStart();
    this.updatePastScore();
  }

  gameStart() {
    this.playSound();
    const gameStartButton = document.getElementById("js-game-start-button");
    gameStartButton.addEventListener("click", () => {
      this.prepareGameView();
      this.newGame();
    });
  }

  playSound() {
    document.getElementById("js-audio-button").addEventListener("click", () => {
      this.soundModel.updateSound();
      const soundIsAllowed = this.soundModel.getIsAllowed();
      if (soundIsAllowed) {
        this.soundModel.playBgm();
        SoundView.switchToVolumeOn();
      } else {
        this.soundModel.stopBgm();
        SoundView.switchToVolumeOff();
      }
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
    ScoreView.updateScore(this.scoreModel.getTotal());
  }

  clearAllIntervals(intervalId, intervalRenderId) {
    clearInterval(intervalId);
    clearInterval(intervalRenderId);
  }

  prepareGameView() {
    const { restartButton, backToTopButton } = GameView.prepare();
    restartButton.addEventListener("click", () => {
      this.newGame();
    });
    backToTopButton.addEventListener("click", () => {
      window.location.reload();
    });
  }

  freeze() {
    const currentShape = this.shapeModel.getCurrentShape();
    const currentX = this.shapeModel.getCurrentX();
    const currentY = this.shapeModel.getCurrentY();
    this.boardModel.appendCurrentShapeToBoard(currentShape, currentX, currentY);
    this.shapeModel.setIsFreezed();
    const soundIsAllowed = this.soundModel.getIsAllowed();
    if (soundIsAllowed) this.soundModel.playSoundEffect();
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
        let pastBestScore = this.scoreModel.updatePastBestScore(totalScore);
        ScoreView.updatePastBestScore(pastBestScore);
        return;
      }
      const rows = await this.boardModel.clearLines();
      if (rows > 0) {
        const soundIsAllowed = this.soundModel.getIsAllowed();
        if (soundIsAllowed) {
          this.soundModel.playDisappearEffect();
        }
        this.renderNewScore(rows);
      }
      this.shapeModel.createNewShape();
    }
  }

  renderNewScore(rows) {
    const computedTotalScore = this.scoreModel.computeTotal(rows);
    ScoreView.updateScore(computedTotalScore);
  }

  updatePastScore() {
    const pastBestScore = this.scoreModel.getPastBest();
    ScoreView.updatePastBestScore(pastBestScore);
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
