'use strict'

const Chess = require( './Chess.js');
const Skill = require('./Skill.js');
class Rook extends Chess{

  constructor(config){
    if(!config){
      config = {};
    }
    super(Object.assign(config,{
      chessType:'Rook',
    }));

    this.skills = [
      new Skill({
        id:'skill00',
        name: '加速',
        skill: 'skill1',
        self:this,
        style:{
          background:'red',
        },
      }),
      new Skill({
        id:'skill01',
        name: '减速全体',
        skill: 'skillx',
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
