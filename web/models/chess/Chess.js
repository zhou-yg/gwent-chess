'use strict'

const defaultConfig = () => {
  return {
    x:0,
    y:1,
    type: 'Chess',
    chessType: 'Chess',
    visionDistance: 2,
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


module.exports = Chess;
