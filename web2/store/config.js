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


function transformAction (action){
  if((action.x || action.x ===0) && (action.y || action.y === 0)){
    action.x = WIDTH - action.x;
    action.y = HEIGHT - action.y;
  }
  return action
}

module.exports.HEIGHT = 6;
module.exports.WIDTH = 6;
module.exports.struct = struct;
module.exports.transformAction = transformAction;
