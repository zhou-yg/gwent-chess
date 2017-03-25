require('./assets/style.less');

import createStore from './store/store'
import types from './store/types'
import { INIT_CODE } from './store/reducers/chess'
import gwentTypes from 'gwent.js/src/lib/types'

import Main from './models/ui/Main';
import ChessBoard from './models/ui/ChessBoard';
import UserList from './models/ui/UserList'
import Horse from './models/chess/Horse';
import Rook from './models/chess/Rook';

const socket = io();

socket.on('log',function (a){
  console.log('log:',a);
  logObj.log(a);
});

const store = createStore(socket,{
  browser:true,
});

socket.emit('new user');

const logObj = {
  $el: document.querySelector('#log'),
  data:{
    list:[],
    i:0,
  },
  log (str) {
    str = String(str);
    if(this.data.list.length >= 3){
      this.data.list = this.data.list.slice(0,2);
    }
    this.data.list = [str].concat(this.data.list);
    this.data.i++;
    this.render();
  },
  render(){
    const frag = document.createDocumentFragment();
    this.data.list.map((str,i)=>{
      var p = document.createElement('p')
      p.className = 'log-one';
      p.innerText = (this.data.i - i)+'.'+str;
      frag.appendChild(p);
    });
    this.$el.innerHTML = '';
    this.$el.appendChild(frag);
  }
};

class Current {
  constructor(){
    var div = document.createElement('div');
    div.id = 'current';
    this.el= div;
  }
  show({chessType,x,y}){
    this.el.innerHTML = '';

    var text = `当前选择:${chessType},${x}-${y}`;

    this.el.innerText = text;
  }
}

const main = new Main();

const userList = new UserList(socket);

const current = new Current();

const chessBoard = new ChessBoard(store, current, logObj);

main.appendToTop(chessBoard.el);
main.appendToBottom(userList.el);

store.dispatch({
  type:types.CHESS_ADD,
  from:gwentTypes.BROWSER_TAG,
  chess:new Horse({
    x:3,
    y:8,
  }).graphicsData(),
});

store.dispatch({
  type:types.CHESS_ADD,
  from:gwentTypes.BROWSER_TAG,
  chess:new Rook({
    x:2,
    y:8,
  }).graphicsData(),
});
