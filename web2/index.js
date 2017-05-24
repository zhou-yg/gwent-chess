import 'pixi.js';

import Start from './view/index/Start';
import Main from './view/battle/Main';
import {load} from './loader';
import * as _ from 'lodash';

import createStore from './store/store';

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

window._ = _;

const socket = io();

const store = createStore(socket, {
  browser: true,
});

load(() => {

  const index = h(Main);

  window.indexInst = renderTo(index, app.stage);
});
