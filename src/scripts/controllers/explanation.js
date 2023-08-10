export class ExplanationController {
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
      <div class="explanation_text">
        <p>テトロミノは</p>
          <ul class="explanation_text_list">
            <li class="explanation_text_list_item">右矢印キー = 右方向へ</li>
            <li class="explanation_text_list_item">左矢印キー = 左方向へ</li>
            <li class="explanation_text_list_item">下矢印キー = 下方向へ</li>
            <li class="explanation_text_list_item">上矢印キー = 回転</li>
            <li class="explanation_text_list_item">スペース = 一気に落下</li>
          </ul>
        <p>というように操作できます。</p>
        <p>スコアは、</p>
          <ul>
            <li class="explanation_text_list_item">1列消すと10点</li>
            <li class="explanation_text_list_item">2列消すと30点</li>
            <li class="explanation_text_list_item">3列消すと50点</li>
            <li class="explanation_text_list_item">4列消すと70点</li>
          </ul>
        <p>というように加算されます。</p>
      </div>
    `;

    const backButton = document.getElementById("js-back");
    backButton.addEventListener("click", () => {
      this.explanation.innerHTML = "";
      this.explanation.classList.remove("explanation");
      this.entrance.classList.remove("hidden");
    });
  }
}
