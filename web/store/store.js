const redux = require('redux');

const reduxAssign = require('redux-assign');
const createStore = redux.createStore;
const combineReducers = redux.combineReducers;
const applyMiddleware = redux.applyMiddleware;

const enemy = require('./reducers/enemy');
const player = require('./reducers/player');
const selectChess = require('./reducers/selectChess');
const turnState = require('./reducers/turnState');

const middlewares = require('gwent.js/middlewares');

module.exports = function createMyStore(socket,options) {
  if(!options){
    options = {};
  }
  // console.log('socket:',socket.socket && socket.socket.on);

  const browser = options.browser;

  var enhancer;

  var myMiddlewares = [
    reduxAssign(true),
    middlewares.actionRedirect(socket),
  ];

  if(browser){
    myMiddlewares.splice(1,0,middlewares.receiveSocket(socket))
  }

  enhancer = applyMiddleware(...myMiddlewares);

  const store = createStore(combineReducers({
    player,
    selectChess,
    enemy,
    turnState,
  }),enhancer);


  return store;
};
