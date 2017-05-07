import 'pixi.js';

import Start from './view/Start';
import {load} from './loader';

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

load(() => {

  const index = h(Start);

  window.indexNode = index;
  window.indexInst = renderTo(index, app.stage);

});
