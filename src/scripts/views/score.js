export class ScoreView {
  static prepare() {
    const scoreContainer = document.createElement("div");
    scoreContainer.classList.add("game_controller_score", "js-score-container");
    scoreContainer.innerHTML = "0 てん";
    return {
      scoreContainer,
    };
  }

  /**
   * @param {number} totalScore
   */
  static updateScore(totalScore) {
    const scoreContainer = document.querySelector(".js-score-container");
    scoreContainer.innerHTML = `${totalScore} てん`;
  }

  /**
   * @param {number} pastBestScore
   */
  static updatePastBestScore(pastBestScore) {
    const pastBestScoreContainer = document.getElementById("js-past-best-score");
    pastBestScoreContainer.innerHTML = `過去のべすとすこあ ${pastBestScore} てん`;
  }
}
