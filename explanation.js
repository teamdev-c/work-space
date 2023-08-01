{/* <div class="explanation">
      <div class="explanation_header">
        <button id="js-back">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <h1 class="explanation_header_title">説明</h1>
      </div>
      <div class="explanation_text">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptas tempore repellat molestiae recusandae esse saepe hic unde sequi temporibus distinctio, nesciunt alias incidunt nostrum iusto voluptatibus. Nihil, quis in! Debitis.</div>
    </div> */}

const explanationButton = document.getElementById("js-explanation");
const entrance = document.getElementById("js-entrance");
const layout = document.getElementById("js-layout");

explanationButton.addEventListener("click", () => {
  explanation = document.createElement('div');
  explanation.classList.add('explanation');
  explanation.innerHTML = `
    <div class="explanation_header">
      <button id="js-back">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <h1 class="explanation_header_title">説明</h1>
    </div>
    <div class="explanation_text">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptas tempore repellat molestiae recusandae esse saepe hic unde sequi temporibus distinctio, nesciunt alias incidunt nostrum iusto voluptatibus. Nihil, quis in! Debitis.</div>
  `;
  layout.append(explanation)
  entrance.classList.add('hidden');

  const backButton = document.getElementById("js-back");
  backButton.addEventListener("click", () => {
    layout.innerHTML = `
    <div class="entrance">
      <h1 class="entrance_title">テトリス</h1>
      <div class="entrance_buttons">
        <button class="entrance_buttons_button">ゲームスタート</button>
        <button id="js-explanation" class="entrance_buttons_button">説明</button>
      </div>
    </div>
    `
  })
})
