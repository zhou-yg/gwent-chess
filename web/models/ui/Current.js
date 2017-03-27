'use strict';

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

export default Current;
