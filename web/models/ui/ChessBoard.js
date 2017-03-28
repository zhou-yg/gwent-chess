'use strict'
import types from '../../store/types'
import watcher from 'gwent.js/src/lib/watcher'
import gwentTypes from 'gwent.js/src/lib/types'

import Horse from '../chess/Horse';
import Rook from '../chess/Rook';

class ChessBoard {

  constructor(socket, store, current, logObj){
    var initState = store.getState();

    var boardDOM = document.createElement('div');
    boardDOM.id = 'board';

    this.current = current;
    this.logObj = logObj
    this.isMyTurn = -1; //是否我的回合
    this.index = initState.index;
    this.player = initState.player;
    this.enemy = initState.enemy;
    this.el = boardDOM;
    this.store = store;
    this.socket = socket;

    const rerender = (index,player,enemy) => {
      this.player = player;
      this.enemy = enemy;
      this.index = index;

      this.render();
      this.renderChess();
    }

    watcher(store,{
      boardIndex(value,old,state){
        rerender(value,state.player,state.enemy);
      },
      player:(value,old,state)=>{
        if(old.length > 0 && value.length === 0 && state.turnState !== -1){
          this.logObj.log('我军阵亡，输了');

          socket.emit('end game');

          store.dispatch({
            type: types.START_TURN,
            from:gwentTypes.BROWSER_TAG,
            to: -1,
          });
        }else{
          rerender(state.boardIndex,value,state.enemy);
        }
      },
      enemy:(value,old,state)=>{
        if(old.length > 0 && value.length === 0 && state.turnState !== -1){
          this.logObj.log('对手死光了，获得胜利了');

          socket.emit('end game');

          store.dispatch({
            type: types.START_TURN,
            from:gwentTypes.BROWSER_TAG,
            to: -1,
          });

        }else{
          rerender(state.boardIndex, state.player, value);
        }
      },
      turnState: (value, old) => {
        if(old === -1 && value === true) {
          this.logObj.log(`游戏开始`);
        }
        if(value === -1 ){
          this.logObj.log(`游戏结束`);

          store.dispatch({
            type: types.RESET_GAME,
            from: gwentTypes.BROWSER_TAG,
          });
          this.initChess();
        } else {
          if(value){
            this.logObj.log(`现在是你的回合`);
          }else if(value){
            this.logObj.log('到别人啦');
          }
        }
        this.isMyTurn = value;
      }
    });

    this.initChess();
  }

  initChess(){
    // this.store.dispatch({
    //   type:types.CHESS_ADD,
    //   from:gwentTypes.BROWSER_TAG,
    //   chess:new Horse({
    //     x:3,
    //     y:8,
    //   }).graphicsData(),
    // });

    this.store.dispatch({
      type:types.CHESS_ADD,
      from:gwentTypes.BROWSER_TAG,
      chess:new Rook({
        x:2,
        y:8,
      }).graphicsData(),
    });
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
              this.logObj.log('原地移动');
            }else{

              const { enemy } = this.store.getState();

              const targetEnemy = enemy.filter((item) => {
                return item.x === j && item.y === i;
              });

              if(targetEnemy.length > 0){

                this.logObj.log(`消灭对手${i},${j}`)

                this.store.dispatch({
                  type:types.KILL_CHESS,
                  from:gwentTypes.BROWSER_TAG,
                  who:{
                    y:i,
                    x:j,
                  }
                });
              }
              this.store.dispatch({
                type:types.CHESS_MOVE,
                from:gwentTypes.BROWSER_TAG,
                selectChess:this.selectChess,
                to:{
                  y:i,
                  x:j,
                }
              });

              if(this.isMyTurn !== -1){
                this.store.dispatch({
                  type:types.CHANGE_TURN,
                  from:gwentTypes.BROWSER_TAG,
                });
              }
            }
          }
        }

      });
    });

    this.el.innerHTML = '';
    this.el.appendChild(frag);

    //渲染敌我

    return frag;
  }
  renderChess () {

    var addObj = (obj, isEnemy) => {
      const x = obj.x;
      const y = obj.y;

      const grid = this.el.children[y].children[x];

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
          this.logObj.log('不是你的回合');
          return;
        }

        this.selectChess = {
          chessType: obj.chessType,
          x,
          y,
          index:i,
        };

        this.current.show(this.selectChess);

        this.store.dispatch({
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

export default ChessBoard;
