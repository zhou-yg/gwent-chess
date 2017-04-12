/**
 * Created by zyg on 17/3/2.
 */
'use strict';
const _ = require('lodash');
const types = require('../types');
const INIT_CODE = require('./chess').INIT_CODE;
const WIDTH = require('./chess').WIDTH - 1;
const HEIGHT = require('./chess').HEIGHT - 1;
const transformAction = require('./chess').transformAction;

function struct(handler,defaultState) {

  return function handlerFn(state,action){

    if(state === undefined){
      state = defaultState;
    }

    if(handler[action.type]){
      return handler[action.type](state,action)
    }

    return state;
  }
}

function transformToPlayer (arr) {
  arr = arr.slice().map(arr=>{
    return arr.slice();
  });

  var result = [];

  while(arr.length > 0){
    let childArr = arr.pop();
    let copyChildArr = [];
    while(childArr.length > 0){
      copyChildArr.push(childArr.pop());
    }
    result.push(copyChildArr);
  }
  return result;
}

const reducer = {
  [types.CHESS_ADD](state, a){

    if(!a.isSelf){
      const chess = transformAction(a.chess);

      return state.concat(chess);
    }
    return state;
  },
  [types.FIND_PLAYER](state,a){
    return a.player.map(chessObj=>{
      chessObj.camp = 'enemy';
      return transformAction(chessObj);
    })
  },
  [types.CHESS_MOVE](state,a){

    if(!a.isSelf){
      const chess = state[a.selectChess.index];

      chess.x = a.to.x;
      chess.y = a.to.y;

      state[a.selectChess.index] = transformAction(chess);

      return state.slice();
    }
    return state;
  },
  [types.CHANGE_CHESS] (state, a){
    if(!a.isSelf){
      return a.chesses.map(chessObj=>{
        chessObj.camp = 'enemy';
        return transformAction(chessObj);
      });
    }
    return state;
  },

  [types.KILL_CHESS](state, a){
    if(a.isSelf){
      const who = a.who;
      return state.filter((item, i) => {
        console.log('敌人的',i,':',item,who);
        return !(item.x === who.x && item.y === who.y);
      });
    }
    return state;
  },
  [types.RESET_GAME](state, a){
    return [];
  },
  [types.CHANGE_VISION_DISTANCE](state, a){
    if(!a.isSelf){
      return state.map((item, i)=>{
        if(i === a.index || a.index === -1){
          return Object.assign({},item,{
            visionDistance:a.visionDistance,
          });
        }
        return item;
      })
    }
    return state;
  },
}

module.exports = struct(reducer,[]);
