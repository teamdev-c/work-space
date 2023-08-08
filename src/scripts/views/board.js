import { boardConfig, tetrominoConfig } from "../config";
import { BlockView } from "./block";
import { ctx, canvas, entrance } from "./canvas";

export class BoardView {
  /**
   * ゲームボードの準備処理
   */
  static prepare() {
    canvas.width = boardConfig.W;
    canvas.height = boardConfig.H;
    canvas.classList.add("game_canvas");
    entrance.classList.add("hidden");
  }

  /**
   *ボード全体を描画する処理
   * @param {number[][]} board
   * @param {number[][]} currentShape
   * @param {number} currentX
   * @param {number} currentY
   */
  static render(board, currentShape, currentX, currentY) {
    ctx.clearRect(0, 0, boardConfig.W, boardConfig.H);

    ctx.strokeStyle = "dimgray";
    for (let y = 0; y < boardConfig.ROWS; y++) {
      for (let x = 0; x < boardConfig.COLS; x++) {
        if (board[y][x]) {
          ctx.fillStyle = tetrominoConfig.colors[board[y][x] - 1];
          BlockView.drawBlock(x, y);
        }
      }
    }

    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (currentShape[y][x]) {
          ctx.fillStyle = tetrominoConfig.colors[currentShape[y][x] - 1];
          BlockView.drawBlock(x + currentX, y + currentY);
        }
      }
    }
  }

  /**
   * 予想落下位置を描画する処理
   * @param {number[][]} currentShape
   * @param {number} currentX
   * @param {number} currentY
   */
  static renderEstimatedFallPos(currentShape, currentX, currentY) {
    // TODO:別のcanvas要素にして透明度を下げないとstrokeStyleが目立つ

    // let shiftY = 0;
    // while (valid(0, shiftY + 1)) {
    //   shiftY++;
    // }
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (currentShape[y][x]) {
          ctx.fillStyle = tetrominoConfig.translucentColors[currentShape[y][x] - 1];
          BlockView.drawBlock(x + currentX, y + currentY + shiftY);
        }
      }
    }
  }
}
