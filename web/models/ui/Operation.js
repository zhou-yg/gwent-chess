'use strict';

class Operation {
  constructor () {
    const user = document.createElement('div');
    user.className = 'operation__user';
    user.innerText = '用户'
    const game = document.createElement('div');
    game.className = 'operation__game';
    game.innerText = '开始游戏'
    const div = document.createElement('div');
    div.id = 'operation';

    //div.appendChild(user);
    div.appendChild(game);

    user.onclick = () => {
      this.onUserCb();
    }
    game.onclick = () => {
      this.onGameCb();
    }

    this.el = div;
    this.onUserCb = () => {};
    this.onGameCb = () => {};
  }
  onUser(fn){
    this.onUserCb = fn;
  }
  onGame(fn){
    this.onGameCb = fn;
  }
}

export default Operation;
