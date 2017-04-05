require('./assets/style.less');

import createStore from './store/store'
import types from './store/types'
import { INIT_CODE } from './store/reducers/chess'
import gwentTypes from 'gwent.js/src/lib/types'

import Main from './models/ui/Main';
import ChessBoard from './models/ui/ChessBoard';
import UserList from './models/ui/UserList';
import Current from './models/ui/Current';
import Operation from './models/ui/Operation';
import Data from './Data.js'

const socket = io();

socket.on('log',function (a){
  console.log('log:',a);
  logObj.log(a);
});

socket.emit('new user');

const data = new Data(socket);

console.log(data);

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

const main = new Main();

const userList = new UserList(socket);

const current = new Current(data);

const op = new Operation();

const chessBoard = new ChessBoard(data,current, logObj)

main.appendToBottom(op.el);
main.appendToBottom(current.el);

userList.onSelect(()=>{
  main.top.innerHTML='';
  main.appendToTop(chessBoard.el);
});
op.onGame(()=>{
  main.top.innerHTML='';
  main.appendToTop(chessBoard.el);
});
op.onUser(()=>{
  main.top.innerHTML='';
  main.appendToTop(userList.el);
});
