'use strict'

const defaultConfig = () => {
  return {
    name:'棋子',
    x:0,
    y:1,
    type: 'Chess',
    chessType: 'Chess',
    visionDistance: 2,
    spells: [],
    textureName: '',
  }
}


class Chess {

  constructor(config){
    Object.assign(this,defaultConfig(),config);
  }

  graphicsData() {
    const configKeys = Object.keys(defaultConfig());

    const data = configKeys.map(k => {
      return {
        [k]:this[k],
      }
    }).reduce((p, c) => {
      return Object.assign(p,c);
    }, {});

    return data;
  }

}

Chess.basicCheckMoveFn = function basicCheckMoveFn(x0,y0,x1,y1) {
  return (Math.abs(x0 - x1) === 1 && y0 === y1) || (Math.abs(y0 - y1) === 1 && x0 === x1);
}

module.exports = Chess;
