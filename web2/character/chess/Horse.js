'use strict';

const Chess = require('./Chess.js');

class Horse extends Chess{

  constructor(config){
    if(!config){
      config = {};
    }
    super(Object.assign(config,{
      name: '千里马',
      chessType: 'Horse',
      textureName: 'Prince',
    }));
  }
}

Horse.checkMoveFn = function(x0,y0,x1,y1){

  return (Math.abs(x0 - x1) === 1 && Math.abs(y0 - y1) === 2) ||
  (Math.abs(x0 - x1) === 2 && Math.abs(y0 - y1) === 1) ||
  Chess.basicCheckMoveFn(...arguments);
}

module.exports = Horse;
