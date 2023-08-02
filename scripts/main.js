"use strict";

var shape = [
  [0,0,1,1],
  [0,0,0,1],
  [0,0,0,1],
  [0,0,0,0]
]

var currentShape = shape



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
        drawBlock( x + currentX, y + currentY );
      }
    }
  }
}

function tick() {
  currentY++;
  console.log(currentY)
  render();
}

var interval = setInterval( tick, 1000 )
