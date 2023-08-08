import { boardConfig } from "../config";

export class BoardModel {
  board;

  constructor() {
    this.board = [];
  }

  getBoard() {
    return this.board;
  }

  /**
   * ボードの初期化処理
   */
  resetBoard() {
    this.board = [];
    for (let y = 0; y < boardConfig.ROWS; y++) {
      const a = [];
      for (let x = 0; x < boardConfig.COLS; x++) {
        a.push(0);
      }
      this.board.push(a);
    }
  }
}
