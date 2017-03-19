const redux = require('redux');

const reduxAssign = require('redux-assign');
const createStore = redux.createStore;
const combineReducers = redux.combineReducers;
const applyMiddleware = redux.applyMiddleware;

const chess = require('./reducers/chess');
const enemy = require('./reducers/enemy');
const player = require('./reducers/player');
const selectChess = require('./reducers/selectChess');


const middlewares = require('../../../middlewares');

module.exports = function createMyStore(socket,options) {
  if(!options){
    options = {};
  }
  // console.log('socket:',socket.socket && socket.socket.on);

  const browser = options.browser;

  var enhancer;
  if(browser){
    enhancer = applyMiddleware(
      reduxAssign(true),
      middlewares.receiveSocket(socket),
      middlewares.actionRedirect(socket)
    );
  }else{
    enhancer = applyMiddleware(
      reduxAssign(true),
      middlewares.actionRedirect(socket)
    );
  }

  const store = createStore(combineReducers({
    boardIndex:chess(),
    player,
    selectChess,
    enemy,

  }),enhancer);


  return store;
};
