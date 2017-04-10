'use strict'
import types from '../../store/types'
import gwentTypes from 'gwent.js/src/lib/types'

import Horse from '../chess/Horse';
import Rook from '../chess/Rook';

const INIT_CODE = 0;

const fnMap = {
  Horse: Horse.checkMoveFn,
  Rook : Rook.checkMoveFn,
}

class Board {

  constructor () {
    this.selectChess = null;
    this.index = this.init();
  }

  init () {
    return [
      [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
      [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
      [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
      [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
      [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
      [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
      [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
      [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
      [INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE, INIT_CODE],
    ]
  }

  clear() {
    this.index = this.init();
  }

  select (selectChess) {
    this.selectChess = selectChess;

    var checkMoveFn = fnMap[selectChess.chessType];

    var arr = this.index.map((row,y)=>{
      return row.map((code,x)=>{
        if(checkMoveFn(x,y,selectChess.x,selectChess.y, selectChess.visionDistance) ){
          if(x !== selectChess.x || y !== selectChess.y){
            return {
              type:'move'
            };
          }
          return INIT_CODE;
        }
        return INIT_CODE;
      });
    });

    this.index = arr;

    return arr;
  }
}

class ChessBoard {

  constructor(data, current, logObj){

    var boardDOM = document.createElement('div');
    boardDOM.id = 'board';

    const board = new Board();

    this.current = current;
    this.logObj = logObj
    this.isMyTurn = -1; //是否我的回合
    //this.index = initState.index;
    this.board = board;
    this.player = data.player;
    this.enemy = data.enemy;
    this.el = boardDOM;
    this.data = data;

    const rerender = (player,enemy) => {
      this.player = player;
      this.enemy = enemy;

      this.render();
      this.renderChess();
    }

    data.watch({
      player:(value,old,state)=>{
        if(old.length > 0 && value.length === 0 && this.turnState !== -1){
          this.logObj.log('我军阵亡，输了');

          socket.emit('end game');

          data.dispatch({
            type: types.START_TURN,
            from:gwentTypes.BROWSER_TAG,
            to: -1,
          });
        }else{
          rerender(value,this.enemy);
        }
      },
      enemy:(value,old,state)=>{
        if(old.length > 0 && value.length === 0 && this.turnState !== -1){
          this.logObj.log('对手死光了，获得胜利了');

          socket.emit('end game');

          data.dispatch({
            type: types.START_TURN,
            from:gwentTypes.BROWSER_TAG,
            to: -1,
          });

        }else{
          rerender(this.player, value);
        }
      },
      turnState: (value, old) => {
        if(old === -1 && value === true) {
          this.logObj.log(`游戏开始`);
        }
        if(value === -1 ){
          this.logObj.log(`游戏结束`);

          data.dispatch({
            type: types.RESET_GAME,
            from: gwentTypes.BROWSER_TAG,
          });
          this.board.clear();
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
    // this.data.dispatch({
    //   type:types.CHESS_ADD,
    //   from:gwentTypes.BROWSER_TAG,
    //   chess:new Horse({
    //     x:3,
    //     y:8,
    //   }).graphicsData(),
    // });
    this.data.addChess(new Rook({
      x:2,
      y:8,
    }));
  }

  render(){

    const frag = document.createDocumentFragment();

    const isFog = (x0,y0) => {
      const r = this.player.every(obj => {
        const {x,y,visionDistance} = obj;
        const dx = Math.abs(x-x0);
        const dy = Math.abs(y-y0);
        var r0 = dx > visionDistance || dy > visionDistance || (dx === dy && dy === visionDistance);
        return r0;
      });
      //console.log(r,x0,y0);
      return r;
    }

    //渲染地形
    this.board.index.forEach((row,i)=>{

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

            if (this.data.selectChess.x === j && this.data.selectChess.y === i){
              this.logObj.log('原地移动');
            }else{

              const { enemy } = this.data.getState();

              const targetEnemy = enemy.filter((item) => {
                return item.x === j && item.y === i;
              });

              if(targetEnemy.length > 0){

                this.logObj.log(`消灭对手${i},${j}`)

                this.data.dispatch({
                  type:types.KILL_CHESS,
                  from:gwentTypes.BROWSER_TAG,
                  who:{
                    y:i,
                    x:j,
                  }
                });
              }
              this.data.dispatch({
                type:types.CHESS_MOVE,
                from:gwentTypes.BROWSER_TAG,
                selectChess:this.data.selectChess,
                to:{
                  y:i,
                  x:j,
                }
              });
              this.board.clear();
              this.render();

              if(this.isMyTurn !== -1){
                this.data.dispatch({
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
        console.log('?')
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


        this.data.setSelectChess({
          chessType: obj.chessType,
          x,
          y,
          index:i,
        });

        this.current.showSelectChess();

        this.board.select(this.data.selectChess);

        this.render();
        this.renderChess();
      };
    });

    this.enemy.map(obj=>{
      addObj(obj, true);
    });
  }
}

export default ChessBoard;
