import { boardConfig } from "./board";
/**
 * ブロックの大きさや形状の設定
 */
export const tetrominoConfig = {
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
  translucentColors: [
    "rgba(0,137,167,0.2)",
    "rgba(191,103,102,0.2)",
    "rgba(125,185,222,0.2)",
    "rgba(250,214,137,0.2)",
    "rgba(254,223,225,0.2)",
    "rgba(93,172,129,0.2)",
    "rgba(139,129,195,0.2)",
  ],
};
