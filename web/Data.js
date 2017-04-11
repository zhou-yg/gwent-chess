'use strict';
import createStore from './store/store'

import types from './store/types'
import gwentTypes from 'gwent.js/src/lib/types'

import watch from 'gwent.js/src/lib/watch'
import * as _ from 'lodash';
import delegate from 'delegates'
import Spell from './models/chess/Spell';
import Watcher from './Watcher'

function dataDefault() {
  return {
    roundNumber: 0,
    chesses: [],
  }
}

class Data {

  constructor (socket, config) {

    if(!config){
      config = {};
    }

    this.store = createStore(socket,{
      browser:true,
    });

    const initState = this.store.getState();
    const initStateKeys = Object.keys(initState);

    delegate(this, 'store')
      .method('getState')
      .method('dispatch')
      .method('subscribe')

    const initConfig = Object.assign(dataDefault(), initState, config);
    Object.assign(this,initConfig);

    const dispatch = (action) => {
      if([types.CHESS_MOVE].indexOf(action.type) !== -1){
        this.roundNumber += 1;
      }
      this.store.dispatch(action);
    }

    Object.keys(types).forEach(type => {
      this[type] = {
        dispatch : (action) => {

          action = Object.assign({},action,{
            type:types[type],
            from: gwentTypes.BROWSER_TAG,
          });

          dispatch(action);
        }
      }
    });

    this.dispatch = dispatch;


    Object.keys(initConfig).map(propertyName=>{
      new Watcher(this, propertyName);
    });

    const _self = this;
    watch(this.store,initStateKeys.reduce((p, key) => {
      return Object.assign(p,{
        [key](v){
          console.log(key,v);
          _self[key] = v;
        }
      })
    }, {}));

  }
  watch(obj){
    Object.keys(obj).map(name=>{
      const watch = this.$watchs[name];
      if(watch){
        watch.on(obj[name].bind(this));
      }
    })
  }

  // addWatcher (watcherObj) {
  //   this.watchers = mergeWatch(this.watchers,watcherObj);
  //   this.unWatch();
  //   this.unWatch = watch(this,this.watchers);
  // }

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
}


export default Data;
