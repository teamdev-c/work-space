import { BoardView } from "./board";
import { GameHandlerView } from "./gameHandler";
import { ScoreView } from "./score";

export class GameView {
  static prepare() {
    const { canvas } = BoardView.prepare();
    const { scoreContainer } = ScoreView.prepare();
    const { buttonContainer, restartButton, backToTopButton } = GameHandlerView.prepare();

    const game = document.getElementById("js-game");
    const gameController = document.createElement("div");
    gameController.classList.add("game_controller");
    gameController.append(scoreContainer, buttonContainer);

    game.classList.add("game");
    game.append(canvas);
    game.append(gameController);

    return {
      restartButton,
      backToTopButton,
    };
  }
}
