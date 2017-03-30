'use strict';
import createStore from './store/store'
import types from './store/types'

import watch from 'gwent.js/src/lib/watch'
import gwentTypes from 'gwent.js/src/lib/types'
import * as _ from 'lodash';
import delegate from 'delegates'

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

    this.watchers = {
    }

    this.unWatch = () => {};
  }

  addWatcher (watcherObj) {
    this.watchers = mergeWatch(this.watchers,watcherObj);
    this.unWatch();
    this.unWatch = watch(this,this.watchers);
  }
}

export default Data;
