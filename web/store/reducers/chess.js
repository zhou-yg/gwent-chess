/**
 * Created by zyg on 17/3/2.
 */
'use strict' 
const types = require('../types');
const Horse = require('../../models/chess/Horse');
const Rook = require('../../models/chess/Rook');

const INIT_CODE = 0;

function struct(handler, defaultState) {

  return function handlerFn(state, action) {

    if (state === undefined) {
      state = defaultState;
    }

    if (handler[action.type]) {
      return handler[action.type](state, action)
    }

    return state;
  }
}

const fnMap = {
  Horse: Horse.checkMoveFn,
  Rook : Rook.checkMoveFn,
}


function transformAction (action){
  if((action.x || action.x ===0) && (action.y || action.y === 0)){
    action.x = WIDTH - action.x;
    action.y = HEIGHT - action.y;
  }
  return action
}


const reducer = {
  [types.CHESS_MOVE](state, a){
    if(a.isSelf) {
      //消除移动标志
      return index();
    }
    return state;
  },
  [types.CLICK_ON_GRID](state, a){


  },
  [types.SELECT_CHESS](state,a){

    var selectChess = a.selectChess;

    var checkMoveFn = fnMap[selectChess.chessType];

    var arr = state.map((row,y)=>{
      return row.map((code,x)=>{
        if(checkMoveFn(x,y,selectChess.x,selectChess.y) ){
          return {
            type:'move'
          };
        }else{
          return INIT_CODE;
        }
      });
    });
    return arr;
  },
};

const index = () => [
  [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
  [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
  [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
  [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
  [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
  [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
  [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
  [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
  [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
];

const HEIGHT = index().length - 1;
const WIDTH = index()[0].length - 1;

function createReducer() {

  const structReducer = struct(reducer, index());

  return function(state,a){

    var r = structReducer.apply(this,arguments);
    return r;
  };
};

createReducer.INIT_CODE = INIT_CODE;
createReducer.HEIGHT = HEIGHT;
createReducer.WIDTH = WIDTH;
createReducer.struct = struct;
createReducer.transformAction = transformAction;

module.exports = createReducer;
