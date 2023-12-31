import { boardConfig } from "../config";
import { makeArrayOfZero, sleep } from "../utils";

export class BoardModel {
  #board;

  constructor() {
    this.#board = [];
  }

  getBoard() {
    return this.#board;
  }

  appendCurrentShapeToBoard(currentShape, currentX, currentY) {
    for (let y = 0; y < 4; ++y) {
      for (let x = 0; x < 4; ++x) {
        if (currentShape[y][x]) {
          this.#board[y + currentY][x + currentX] = currentShape[y][x];
        }
      }
    }
  }

  async clearLines() {
    let rows = 0;
    for (let y = boardConfig.ROWS - 1; y >= 0; --y) {
      let ok = true;
      for (let x = 0; x < boardConfig.COLS; ++x) {
        if (!this.#board[y][x]) {
          ok = false;
        }
      }

      if (ok) {
        await sleep(100);
        this.#board.splice(y, 1);
        const arr = makeArrayOfZero(boardConfig.COLS);
        this.#board.unshift(arr);
        ++y;
        rows++;
      }
    }

    return rows;
  }

  /**
   * ボードの初期化処理
   */
  resetBoard() {
    this.#board = [];
    for (let y = 0; y < boardConfig.ROWS; y++) {
      const arr = makeArrayOfZero(boardConfig.COLS);
      this.#board.push(arr);
    }
  }
}
