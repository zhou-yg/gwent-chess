/**
 * Created by zyg on 17/3/13.
 */
const _ = require('lodash');
const types = require('../types');
const INIT_CODE = require('./chess').INIT_CODE;
const WIDTH = require('./chess').WIDTH - 1;
const HEIGHT = require('./chess').HEIGHT - 1;
const struct = require('./chess').struct;


const reducer = {

  [types.SELECT_CHESS](state,obj){
    
    return Object.assign({},state,{
      x:obj.x,
      y:obj.y
    });
  },
  [types.CLEAR_CHESS](state,obj){

    return null;
  }
};

module.exports = struct(reducer,{
  x:0,
  y:0,
});