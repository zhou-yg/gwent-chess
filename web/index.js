require('./assets/style.less');

import createStore from './store/store'
import types from './store/types'
import { INIT_CODE } from './store/reducers/chess'
import gwentTypes from 'gwent.js/src/lib/types'

import ChessBoard from './models/ui/ChessBoard';
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

class UserList {

  constructor(socket){

    var div = document.createElement('div');
    div.id = 'userList';
    document.body.appendChild(div);

    this.container = div;

    this.socket = socket;
    this.socket.on('users',(list)=>{

      this.list = list.map(obj=>{

        return {
          username:obj.username,
        }
      });

      this.render();
    });
  }

  render(){

    const frag = this.list.map(obj=>{
      const li = document.createElement('li');
      li.innerText = obj.username;
      li.onclick = () => {

        this.socket.emit('match user',obj.username);
      };

      return li;
    }).reduce((frag,li)=>{
      frag.appendChild(li);
      return frag;
    },document.createDocumentFragment());

    this.container.innerHTML = '';
    this.container.appendChild(frag);
  }
}


class Current {
  constructor(){
    var div = document.createElement('div');
    div.id = 'current';
    document.body.appendChild(div);
    this.$el= div;
  }
  show({chessType,x,y}){
    this.$el.innerHTML = '';

    var text = `当前选择:${chessType},${x}-${y}`;

    this.$el.innerText = text;
  }
}


const userList = new UserList(socket);

const current = new Current();

const chessBoard = new ChessBoard(store, current, logObj);

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
