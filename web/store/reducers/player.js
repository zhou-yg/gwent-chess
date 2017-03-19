'use strict';
const _ = require('lodash');
const types = require('../types');
const INIT_CODE = require('./chess').INIT_CODE;
const WIDTH = require('./chess').WIDTH - 1;
const HEIGHT = require('./chess').HEIGHT - 1;
const struct = require('./chess').struct;

const reducer = {
  [types.CHESS_ADD](state,a){
    if(a.isSelf){
      const chess = a.chess;
      chess.camp = (chess.name).toLowerCase();
      return state.concat(chess);
    }
    return state;
  },
  [types.CHESS_MOVE](state,a){
    if(a.isSelf){
      const selectChess = state[a.selectChess.index];

      selectChess.x = a.to.x;
      selectChess.y = a.to.y;

      return state.slice();
    }
    return state;
  }
};


module.exports = struct(reducer,[]);