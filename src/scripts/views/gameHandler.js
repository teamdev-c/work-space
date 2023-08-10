export class GameHandlerView {
  static prepare() {
    const gameHandler = document.createElement("div");
    gameHandler.classList.add("game_controller");

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("game_controller_buttons");

    const restartButton = document.createElement("button");
    restartButton.classList.add("game_controller_buttons_button", "js-restartButton");
    restartButton.innerText = "りすたーと";

    const backToTopButton = document.createElement("button");
    backToTopButton.classList.add("game_controller_buttons_button");
    backToTopButton.innerText = "とっぷへもどる";

    buttonContainer.append(restartButton, backToTopButton);

    return {
      buttonContainer,
      restartButton,
      backToTopButton,
    };
  }

  static restartButtonDisabled() {
    const restartButton = document.querySelector(".js-restartButton");
    restartButton.disabled = true;
  }

  static restartButtonNotDisabled() {
    const restartButton = document.querySelector(".js-restartButton");
    restartButton.disabled = false;
  }
}
