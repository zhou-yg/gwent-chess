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

  [types.START_TURN](state,obj){
    return obj.to;
  },
  [types.CHANGE_TURN](state,obj){
    // if(obj.isSelf){
    //   return !state;
    // }
    return !state;
  }
};

module.exports = struct(reducer, true);
