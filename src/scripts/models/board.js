import { boardConfig } from "../config";

export class BoardModel {
  board;

  reset() {
    this.board = [];
    for (let y = 0; y < boardConfig.ROWS; y++) {
      const a = [];
      for (let x = 0; x < boardConfig.COLS; x++) {
        a.push(0);
      }
      board.push(a);
    }
  }
}
