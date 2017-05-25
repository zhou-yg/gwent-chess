/**
 * Created by zyg on 17/3/13.
 */
const _ = require('lodash');
const types = require('../types');
const struct = require('../config').struct;

const reducer = {

  [types.START_TURN](state,obj){
    return obj.to;
  },
  [types.CHANGE_TURN](state,obj){
    // if(obj.isSelf){
    //   return !state;
    // }
    if(state === -1){
      return state;
    }
    return !state;
  }
};

module.exports = struct(reducer, -1);
