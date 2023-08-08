export class ShapeModel {
  currentShape;
  currentX;
  currentY;
  freezed;

  getCurrent() {
    return this.currentShape;
  }

  updateCurrent(newShape) {
    this.currentShape = newShape;
    return this.currentShape;
  }

  resetCurrent() {
    this.currentShape = [];
  }

  updateCurrentShape(shape) {
    this.currentShape = shape;
  }
}
