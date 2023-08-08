export const scoreBox = document.createElement("div");
export const pastBestScoreBox = document.getElementById("js-score");

export class ScoreView {
  static scoreBox = scoreBox;
  static pastBestScoreBox = pastBestScoreBox;

  static prepare() {
    ScoreView.scoreBox.classList.add("game_controller_score");
    ScoreView.scoreBox.innerHTML = "0 てん";
  }
  /**
   * @param {number} totalScore
   */
  static update(totalScore) {
    ScoreView.scoreBox.innerHTML = `${totalScore} てん`;
  }

  /**
   * @param {number} pastBestScore
   */
  static updatePastBest(pastBestScore) {
    ScoreView.pastBestScoreBox.innerHTML = `過去のべすとすこあ ${pastBestScore} てん`;
  }
}
