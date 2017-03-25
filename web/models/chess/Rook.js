'use strict'

const Chess = require( './Chess.js');

class Rook extends Chess{

  constructor(config){
    if(!config){
      config = {};
    }
    super(Object.assign(config,{
      chessType:'Rook',
    }))
  }

}

Rook.checkMoveFn = function(x0,y0,x1,y1){
  return (y0 === y1 && Math.abs(x0 - x1) <= 2) || (x0 === x1 && Math.abs(y0 - y1) <= 2);
}

module.exports = Rook;
