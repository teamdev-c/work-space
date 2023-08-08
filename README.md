# work-space

- deployment url
  https://teamdev-c.github.io/work-space/

## 作業の流れ

1. issue を切る。
2. develop からブランチを切る。その際、ブランチ名は`feature-作業内容-名前`とする。例えば、`feature-create-game-logic-part1-seiya`みたいな感じ。
3. 作業が終わったら、add, commit, push でリモートに送る。

- コミットメッセージに prefix を付ける。  
  `feat:` .. 何か機能を実装した時  
  `wip:` .. 作業は途中だが一旦 push しておきたい時  
  `refac:` .. リファクタリング時  
  `fix:` .. 機能のバグの修正時  
  `chore:` .. ライブラリや補助ツールを導入したい時など  
  `docs:` .. ドキュメントの更新時

4. PR を作る！

## チームでのコーディングルール

1. CSS の記法について

- CSS の記法はスネークケースを採用したいと思います。
- 部品ごとにブロックとみて、中の要素ごとにネストしていくようにしましょう。

```html
<div class="card">
  <h2 class="card_title">テトリス</h2>
  <div class="card_content">
    <p class="card_content_text">テトリスはとっても楽しいゲームです！</p>
    <a class="card_content_link">リンクはこちらから</a>
  </div>
</div>
```

2. DOM 操作のための class や id について

- CSS のクラスと JS による DOM 操作のためのクラスや id を区別したいという意図があります。ですので、DOM 操作のためのクラスや id には`js-`という prefix を付けるようにします。

```html
<button id="js-button" class="button">クリック</button>
```

3. JS の定数や変数の命名について

- 基本的にはキャメルケースで統一でいいかなと思います。（相談）

```js
const buttonEl = document.getElementById("js-button");

function onClick() {
  // writing code...
}
```

4. JSDoc コメントについて(できれば)

- 関数や変数の型情報やパラメータなどに注釈をつけることで、可読性が高まります。
- なるべく書くようにしてみよう！

```js
/**
 * 足し算をします。
 * @param a {number} 一つめの値
 * @param b {number} 二つ目の値
 * @returns {number} 結果
 */
function add(a, b) {
  return a + b;
}
```

- 参考
  - https://www.typescriptlang.org/ja/docs/handbook/jsdoc-supported-types.html
  - https://ics.media/entry/6789/
