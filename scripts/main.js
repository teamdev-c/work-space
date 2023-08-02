"use strict";

// keydownイベントの数字と動作の紐づけを行います
// 例えば、{ 37: 'left' }のように定義します
// HTMLのbodyタグに紐づけておきます
// 参考:https://developer.mozilla.org/ja/docs/Web/API/Element/keydown_event



// canvas要素を活用して、描画する各関数を定義します
// 参考:https://developer.mozilla.org/ja/docs/Web/HTML/Element/canvas#%E4%BE%8B

const H = 600, W = 300;
const ROWS = 20, COLS = 10;
const BLOCK_H = H / ROWS, BLOCK_W = W / COLS;

// 1つのブロックを描画する関数を作成します
// (x, y)を引数としてとりその位置に表示するようにします

// canvas上にテトロミノを描画します
// controller.jsから呼び出して、描画の部分だけ切り出すようにします
// 描画するかどうかは、tetris.jsで配列などで管理して、受け渡します



// 各テトロミノを定義します

// 