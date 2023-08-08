import { tetrominoConfig } from "../config";
import { ctx } from "./board";

export class BlockView {
  /**
   * ブロックを描画する処理
   * @param {number} x
   * @param {number} y
   */
  static drawBlock(x, y) {
    const BLOCK_W = tetrominoConfig.BLOCK_W;
    const BLOCK_H = tetrominoConfig.BLOCK_H;
    ctx.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
    ctx.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
  }
}
