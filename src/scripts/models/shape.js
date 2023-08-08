export class ShapeModel {
  currentShape;
  currentX;
  currentY;
  freezed;

  constructor() {
    this.currentShape = [];
    this.currentX = 3;
    this.currentY = 0;
    this.freezed = false;
  }

  getCurrentShape() {
    return this.currentShape;
  }

  updateCurrentShape(newShape) {
    this.currentShape = newShape;
  }

  resetCurrentShape() {
    this.currentShape = [];
  }

  getCurrentX() {
    return this.currentX;
  }

  getCurrentY() {
    return this.currentY;
  }

  addCurrentX() {
    this.currentX++;
  }

  subtractCurrentX() {
    this.currentX--;
  }

  addCurrentY() {
    this.currentY++;
  }

  resetCurrentXY() {
    this.currentX = 3;
    this.currentY = 0;
  }

  getFreezed() {
    return this.freezed;
  }

  makeFreezed() {
    this.freezed = true;
  }

  resetFreezed() {
    this.freezed = false;
  }
}
