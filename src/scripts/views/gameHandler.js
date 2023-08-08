export class GameHandlerView {
  static gameHandler = document.createElement("div");
  static restartButton = document.createElement("button");
  static backToTopButton = document.createElement("button");

  static prepare() {
    GameHandlerView.gameHandler.classList.add("game_controller");

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("game_controller_buttons");

    GameHandlerView.restartButton.classList.add("game_controller_buttons_button");
    GameHandlerView.restartButton.innerText = "りすたーと";

    GameHandlerView.backToTopButton.classList.add("game_controller_buttons_button");
    GameHandlerView.backToTopButton.innerText = "とっぷへもどる";

    buttonContainer.append(GameHandlerView.restartButton, GameHandlerView.backToTopButton);

    return {
      buttonContainer: buttonContainer,
      restartButton: GameHandlerView.restartButton,
      backToTopButton: GameHandlerView.backToTopButton,
    };
  }

  static restartButtonDisabled() {
    GameHandlerView.restartButton.disabled = true;
  }

  static restartButtonNotDisabled() {
    GameHandlerView.restartButton.disabled = false;
  }
}
