require('./assets/style.less');

import createStore from './store/store'
import types from './store/types'
import { INIT_CODE } from './store/reducers/chess'
import gwentTypes from 'gwent.js/src/lib/types'
import watcher from 'gwent.js/src/lib/watcher'

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

    this.container = document.querySelector('#userList');

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

class ChessBoard {

  constructor(){
    this.isMyTurn = -1; //是否我的回合
    this.index = [];
    this.player = [];
    this.enemy = [];
    this.boardDOM = document.querySelector('#board');
  }

  render(){

    const frag = document.createDocumentFragment();


    console.log(this.player.length);
    const isFog = (x0,y0) => {
      const r = this.player.every(obj => {
        const {x,y} = obj;
        const dx = Math.abs(x-x0);
        const dy = Math.abs(y-y0);
        const r0 = dx > 2 || dy > 2 || (dx === dy && dy === 2);

        return r0;
      });
      //console.log(r,x0,y0);
      return r;
    }

    //渲染地形
    this.index.forEach((row,i)=>{

      const div = document.createElement('div');
      div.className = 'grid-box';

      frag.appendChild(div);

      row.forEach((v,j)=>{

        let grid = document.createElement('div');
        grid.className = 'grid';

        div.appendChild(grid);

        if(isFog(j, i)){

          grid.classList.add('fog');

        }else if(v && v.type === 'move'){
          grid.className += ' move';

          grid.onclick = () => {

            if (this.selectChess.x === j && this.selectChess.y === i){
              logObj.log('原地移动');
            }else{

              const { enemy } = store.getState();

              const targetEnemy = enemy.filter((item) => {
                return item.x === j && item.y === i;
              });

              if(targetEnemy.length > 0){

                logObj.log(`消灭对手${i},${j}`)

                store.dispatch({
                  type:types.KILL_CHESS,
                  from:gwentTypes.BROWSER_TAG,
                  who:{
                    y:i,
                    x:j,
                  }
                });
              }
              store.dispatch({
                type:types.CHESS_MOVE,
                from:gwentTypes.BROWSER_TAG,
                selectChess:this.selectChess,
                to:{
                  y:i,
                  x:j,
                }
              });

              if(this.isMyTurn !== -1){
                debugger;
                store.dispatch({
                  type:types.CHANGE_TURN,
                  from:gwentTypes.BROWSER_TAG,
                });
              }
            }
          }
        }

      });
    });

    this.boardDOM.innerHTML = '';
    this.boardDOM.appendChild(frag);

    //渲染敌我

    return frag;
  }
  renderChess () {

    var addObj = (obj, isEnemy) => {
      const x = obj.x;
      const y = obj.y;

      const grid = this.boardDOM.children[y].children[x];

      grid.innerHTML = '';

      if(isEnemy && grid.classList.contains('fog')){

      }else{
        const chess = document.createElement('div');
        chess.classList.add('chess');
        chess.classList.add(obj.chessType);
        chess.classList.add(obj.camp);
        chess.innerText = obj.chessType;

        grid.appendChild(chess);

        return chess;
      }
    };

    this.player.map((obj,i)=>{
      const x = obj.x;
      const y = obj.y;

      const chess = addObj(obj);

      chess.onclick = ()=>{
        if(!this.isMyTurn){
          logObj.log('不是你的回合');
          return;
        }

        this.selectChess = {
          chessType: obj.chessType,
          x,
          y,
          index:i,
        };

        current.show(this.selectChess);

        store.dispatch({
          type:types.SELECT_CHESS,
          selectChess:this.selectChess,
        })
      };
    });

    this.enemy.map(obj=>{
      addObj(obj, true);
    });
  }
}

class Current {
  constructor(){
    this.$el= document.querySelector('#current');
  }
  show({chessType,x,y}){
    this.$el.innerHTML = '';

    var text = `当前选择:${chessType},${x}-${y}`;

    this.$el.innerText = text;
  }
}

const chessBoard = new ChessBoard();

const userList = new UserList(socket);

const current = new Current();

function rerender(index,player,enemy){
  chessBoard.player = player;
  chessBoard.enemy = enemy;
  chessBoard.index = index;

  chessBoard.render();
  chessBoard.renderChess();
}

var initState = store.getState();

rerender(initState.boardIndex,initState.player,initState.enemy);

watcher(store,{
  boardIndex(value,old,state){
    rerender(value,state.player,state.enemy);
  },
  player(value,old,state){
    rerender(state.boardIndex,value,state.enemy);
  },
  enemy(value,old,state){
    rerender(state.boardIndex, state.player, value);
  },
  turnState(value){
    if(value){
      logObj.log(`现在是你的回合`);
    }else{
      logObj.log('到别人啦');
    }

    chessBoard.isMyTurn = value;
  }
});

store.dispatch({
  type:types.CHESS_ADD,
  from:gwentTypes.BROWSER_TAG,
  chess:new Horse({
    x:3,
    y:7,
  }).graphicsData(),
});

store.dispatch({
  type:types.CHESS_ADD,
  from:gwentTypes.BROWSER_TAG,
  chess:new Rook({
    x:2,
    y:7,
  }).graphicsData(),
});
