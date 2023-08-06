"use strict";

{
  /**
   * 説明画面のレンダリング
   */
  class View {
    entrance = document.getElementById("js-entrance");
    explanation = document.getElementById("js-explanation");
    explanationButton = document.getElementById("js-explanation-button");

    constructor() {
      this.explanationButton.addEventListener("click", () => {
        this.render();
      });
    }

    render() {
      this.entrance.classList.add("hidden");
      this.explanation.classList.add("explanation");
      this.explanation.innerHTML = `
      <div class="explanation_header">
        <button id="js-back">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <h1 class="explanation_header_title">あそびかた</h1>
      </div>
      <div class="explanation_text">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptas tempore repellat molestiae recusandae esse saepe hic unde sequi temporibus distinctio, nesciunt alias incidunt nostrum iusto voluptatibus. Nihil, quis in! Debitis.</div>
    `;

      const backButton = document.getElementById("js-back");
      backButton.addEventListener("click", () => {
        this.explanation.innerHTML = "";
        this.explanation.classList.remove("explanation");
        this.entrance.classList.remove("hidden");
      });
    }
  }

  const view = new View();
}
