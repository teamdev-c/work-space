"use strict";

// keydownイベントの数字と動作の紐づけを行います
// 例えば、{ 37: 'left' }のように定義します
// HTMLのbodyタグに紐づけておきます
// 参考:https://developer.mozilla.org/ja/docs/Web/API/Element/keydown_event



// canvas要素を活用して、描画する各関数を定義します
// 参考:https://developer.mozilla.org/ja/docs/Web/HTML/Element/canvas#%E4%BE%8B

// 1つのブロックを描画する関数を作成します
// (x, y)を引数としてとりその位置に表示するようにします

// canvas上にテトロミノを描画します
// controller.jsから呼び出して、描画の部分だけ切り出すようにします
// 描画するかどうかは、tetris.jsで配列などで管理して、受け渡します

// 各テトロミノを定義します

var shape = [
  [0,0,1,1],
  [0,0,0,1],
  [0,0,0,1],
  [0,0,0,0]
]







var H = 600, W = 300;
var ROWS = 20, COLS = 10;
var BLOCK_H = H / ROWS, BLOCK_W = W / COLS;

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var board = [];

function init() {
  for ( var y = 0; y < ROWS; ++y ) {
    var a = [];
    for ( var x = 0; x < COLS; ++x ) {
      a.push(0);
    }
    board.push(a);
  }
}

init()
var currentX = 0, currentY = 0;

function drawBlock( x, y ) {
  ctx.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
  ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
}
ctx.strokeStyle = 'black';
var colors = [
  'cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple'
];
function render() {
  ctx.clearRect( 0, 0, W, H );

  ctx.strokeStyle = 'black';
  for ( var y = 0; y < ROWS; ++y ) {
      for ( var x = 0; x < COLS; ++x ) {
          if ( board[ y ][ x ] ) {
              ctx.fillStyle = colors[ board[ y ][ x ] - 1 ];
              drawBlock( x, y );
          }
      }
  }

  for ( var y = 0; y < 4; ++y ) {
    for (var x = 0; x < 4; ++x ) {
      if ( currentShape[y][x] ) {
        ctx.fillStyle = colors[ currentShape[ y ][ x ] - 1 ];
        drawBlock( x, y );
      }
    }
  }
}
render();

function tick() {
  
  for ( var y = 0; y < ROWS; ++y ) {
    for ( var x = 0; x < COLS; ++x ) {
      board[y][x] = 0;
    }
  }
}
tick();
render();

var ii = 1
function count() {
  console.log(ii)
  ii++;
}

var interval = setInterval( count, 1000 )


// var y = 10

// board = [[1, 0], [0, 1]]
// for (let i = 0; i < 2; i++) {
//   for (let j = 0; j < 2; j++) {
//     ctx.fillStyle = 'green';
//     ctx.fillRect(j*100, i*100, board[i][j]*100, board[i][j]*100);
//   }
// }

// function square(number) {
//   // y += 10
//   // ctx.fillRect(10, 10, 100, 100);
// }

// setInterval(square, )
// // 