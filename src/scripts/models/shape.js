import { tetrominoConfig } from "../config";

export class ShapeModel {
  #currentShape;
  #currentX;
  #currentY;
  #isFreezed;

  constructor() {
    this.#currentShape = [];
    this.#currentX = 3;
    this.#currentY = 0;
    this.#isFreezed = false;
  }

  createNewShape() {
    const randomIndex = Math.floor(Math.random() * tetrominoConfig.shapes.length);
    const newShape = tetrominoConfig.shapes[randomIndex];
    this.updateCurrentShape(newShape);
    this.resetIsFreezed();
    this.resetCurrentXY();
  }

  /**
   * テトロミノを回転したものを返す処理
   * @param {number[][]} current
   * @returns{number[][]} newCurrent
   */
  rotate(current) {
    let newCurrent = [];
    for (let y = 0; y < 4; ++y) {
      newCurrent[y] = [];
      for (let x = 0; x < 4; ++x) {
        newCurrent[y][x] = current[3 - x][y];
      }
    }

    return newCurrent;
  }

  getCurrentShape() {
    return this.#currentShape;
  }

  updateCurrentShape(newShape) {
    this.#currentShape = newShape;
  }

  resetCurrentShape() {
    this.#currentShape = [];
  }

  getCurrentX() {
    return this.#currentX;
  }

  getCurrentY() {
    return this.#currentY;
  }

  addCurrentX() {
    this.#currentX++;
  }

  subtractCurrentX() {
    this.#currentX--;
  }

  addCurrentY() {
    this.#currentY++;
  }

  resetCurrentXY() {
    this.#currentX = 3;
    this.#currentY = 0;
  }

  getIsFreezed() {
    return this.#isFreezed;
  }

  setIsFreezed() {
    this.#isFreezed = true;
  }

  resetIsFreezed() {
    this.#isFreezed = false;
  }
}
