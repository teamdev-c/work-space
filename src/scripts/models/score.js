export class ScoreModel {
  total;

  constructor() {
    this.total = 0;
  }

  getTotal() {
    return this.total;
  }

  resetTotal() {
    this.total = 0;
    return this.total;
  }

  /**
   * @param {number} x
   * @returns {number} score
   */
  computeTotal(x) {
    let score = 20 * (x - 1) + 10;
    this.total += score;
    return this.total;
  }

  /**
   * 過去のベストスコア表示を取得する処理
   * */
  getPastBest() {
    let pastBestScore = localStorage.getItem("bestScore");
    if (!pastBestScore) {
      localStorage.setItem("bestScore", "0");
      pastBestScore = localStorage.getItem("bestScore");
    }
    return pastBestScore;
  }

  /**
   * 過去のベストスコア表示を更新する処理
   * @param {number} totalScore
   * @returns {number} totalScore or pastBestScore
   */
  updatePastBest(totalScore) {
    const pastBestScore = localStorage.getItem(`bestScore`);
    if (totalScore > pastBestScore) {
      localStorage.setItem("bestScore", `${totalScore}`);
      return totalScore;
    }
    return pastBestScore;
  }
}
