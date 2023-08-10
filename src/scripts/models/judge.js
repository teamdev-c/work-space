export class JudgeModel {
  #lose;
  constructor() {
    this.#lose = false;
  }

  getLose() {
    return this.#lose;
  }

  resetLose() {
    this.#lose = false;
  }

  makeLoser() {
    this.#lose = true;
  }
}
