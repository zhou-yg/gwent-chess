'use strict';
const _ = require('lodash');
const types = require('../types');
const struct = require('../config').struct;
const transformAction = require('../config').transformAction;

const reducer = {
  [types.CHESS_ADD](state,a){
    if(a.isSelf){
      const chess = a.chess;
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
  },
  [types.CHANGE_CHESS] (state, a){
    if(a.isSelf){
      return a.chesses;
    }
    return state;
  },
  [types.KILL_CHESS](state, a){
    if(!a.isSelf){
      const who = transformAction(a.who);
      return state.filter((item,i) => {
        console.log('我的',i,':',item,who);
        return !(item.x === who.x && item.y === who.y);
      });
    }
    return state;
  },
  [types.RESET_GAME](state, a){
    return [];
  },
  [types.CHANGE_VISION_DISTANCE](state, a){
    if(a.isSelf){
      return state.map((item, i)=>{
        if(i === a.index){
          return Object.assign({},item,{
            visionDistance:a.visionDistance,
          });
        }
        return item;
      });
    }
    return state;
  },
  [types.SPELL_02](state,a){
    if(!a.isSelf){
      return state.map((item, i)=>{
        if(a.index === -1){
          return Object.assign({},item,{
            visionDistance:a.visionDistance,
          });
        }
        return item;
      });
    }
    return state;
  }
};


module.exports = struct(reducer,[]);
