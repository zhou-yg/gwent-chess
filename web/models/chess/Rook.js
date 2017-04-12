'use strict'

const Chess = require( './Chess.js');
const Spell = require('./Spell.js');
class Rook extends Chess{

  constructor(config){
    if(!config){
      config = {};
    }
    super(Object.assign(config,{
      chessType:'Rook',
    }));

    this.spells = [
      new Spell({
        id:'spell00',
        name: '加视野',
        spell: 'spell1',
        self:this,
        style:{
          background:'red',
        },
      }),
      new Spell({
        id:'spell01',
        name: '减速全体',
        spell: 'spellx',
        self:this,
        style:{
          background:'blue',
        },
      }),
    ]
  }
}

Rook.checkMoveFn = function(x0,y0,x1,y1,visionDistance){
  var d = visionDistance || 2;
  return (y0 === y1 && Math.abs(x0 - x1) <= d) || (x0 === x1 && Math.abs(y0 - y1) <= d);
}

module.exports = Rook;
