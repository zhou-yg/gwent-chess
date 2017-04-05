'use strict';
import createStore from './store/store'
import types from './store/types'

import watch from 'gwent.js/src/lib/watch'
import gwentTypes from 'gwent.js/src/lib/types'
import * as _ from 'lodash';
import delegate from 'delegates'
import Skill from './models/chess/Skill.js';

function mergeWatch(obj, obj2) {
  obj = _.cloneDeep(obj);

  Object.keys(obj2).forEach(fnName => {
    const oldFn = obj[fnName];

    if(oldFn){
      obj[fnName] = function () {
        oldFn.apply(obj,arguments);
        obj2[fnName].apply(obj,arguments);
      }
    }else{
      obj[fnName] = obj2[fnName];
    }
  });

  return obj;
}

class Data {

  constructor (socket) {

    this.store = createStore(socket,{
      browser:true,
    });

    delegate(this, 'store')
      .method('getState')
      .method('dispatch')
      .method('subscribe')

    this.chesses = [];

    this.watchers = {
    }

    this.unWatch = () => {};
  }

  addWatcher (watcherObj) {
    this.watchers = mergeWatch(this.watchers,watcherObj);
    this.unWatch();
    this.unWatch = watch(this,this.watchers);
  }

  addChess (obj) {
    obj.index = this.chesses.length;
    this.chesses.push(obj);

    this.store.dispatch({
      type:types.CHESS_ADD,
      from:gwentTypes.BROWSER_TAG,
      chess:Object.assign(obj.graphicsData(),{
        index: obj.index
      }),
    });
  }
  setSelectChess (obj) {
    this.selectChess = obj;
  }

  doSkill (skillObj) {
    var skillFunc = Skill.skillsMap[skillObj.id];

    var newState = skillFunc(this.store.getState(), skillObj);
    //....

    this.store.dispatch({
      type:types.CHANGE_CHESS,
      from:gwentTypes.BROWSER_TAG,
      chesses: this.chesses.map(obj => {
        return Object.assign(obj.graphicsData(), {
          index: obj.index,
        });
      })
    })
  }
}

export default Data;
