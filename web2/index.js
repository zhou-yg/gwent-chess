import 'pixi.js';

import Start from './view/index/Start';
import Main from './view/battle/Main';
import {load} from './loader';
import * as _ from 'lodash';
import data from './data';
import types from './store/types';

import Horse from './character/chess/Horse';

import {
  h,
  renderTo,
} from 'pixi-react/src/pixi-react';

const app = new PIXI.Application({
  width:640,
  height:1004,
  transparent:true,
});

window.app = app;
document.body.appendChild(app.view);

data.dispatchToServer({
  type: types.START_TURN,
  to: true,
});

data.dispatchToServer({
  type: types.CHESS_ADD,
  chess: new Horse({
    x: 0,
    y: 5,
  }),
});

load(() => {

  const index = (<Main />);

  window.indexInst = renderTo(index, app.stage);
});
