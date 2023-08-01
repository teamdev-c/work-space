const entrance = document.getElementById("js-entrance");
const explanationButton = document.getElementById("js-explanation");
const layout = document.getElementById("js-layout");
const layoutExplanation = document.getElementById("js-layout-explanation");

explanationButton.addEventListener("click", () => {
  entrance.classList.add("hidden");
  layoutExplanation.classList.add("explanation");
  layoutExplanation.innerHTML = `
    <div class="explanation_header">
      <button id="js-back">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <h1 class="explanation_header_title">説明</h1>
    </div>
    <div class="explanation_text">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptas tempore repellat molestiae recusandae esse saepe hic unde sequi temporibus distinctio, nesciunt alias incidunt nostrum iusto voluptatibus. Nihil, quis in! Debitis.</div>
  `;

  const backButton = document.getElementById("js-back");
  backButton.addEventListener("click", () => {
    layoutExplanation.innerHTML = "";
    layoutExplanation.classList.remove("explanation");
    entrance.classList.remove("hidden");
  });
});
