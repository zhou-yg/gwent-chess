'use strict';
import createStore from './store/store'

import types from './store/types'
import gwentTypes from 'gwent.js/src/lib/types'

import watch from 'gwent.js/src/lib/watch'
import * as _ from 'lodash';
import delegate from 'delegates'
import Spell from './models/chess/Spell.js';

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

class Dep {

}
Dep.targetStack = [];
function pushTarget (t) {
  if(Dep.target){
    Dep.targetStack.push(Dep.target);
  }
  Dep.target = t;
}
function popTarget (){
  Dep.target = Dep.targetStack.pop();
}
class Watcher {

  constructor(instance,key){
    let w = this;
    let data = instance[key];

    this.instance = instance;
    this.key = key;
    this.value = null;
    this.parents = new Set();
    this.subs = [];

    if(typeof data !== 'function'){
      Object.defineProperty(instance,key,{
        set(v){
          w.value = v;
          w.subs.forEach(fn=>{
            fn.call(instance);
          });

          w.parents.forEach(watchObj=>{
            watchObj.update();
          });
        },
        get(){
          if(Dep.target){
            w.parents.add(Dep.target);
          }
          return w.value;
        }
      });
    }else{
      Object.defineProperty(instance,key,{
        set(v){
        },
        get(){
          pushTarget(w);
          w.value = data.call(instance);
          popTarget();
          return w.value;
        }
      });

      this.value = instance[key];
    }
    if(!instance.$watchs){
        instance.$watchs = {};
    }
    instance.$watchs[key] = this;
  }

  on(fn){
    this.subs.push(fn);
  }
  off(fn){
    this.subs = this.subs.filter(f=>{
      return f !== fn;
    })
  }

  update(){
    this.value = this.instance[this.key];

    this.subs.forEach(fn=>{
      fn.call(this.instance,this.value);
    });
    this.parents.forEach(watchObj=>{
      watchObj.update();
    })
  }
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

    Object.keys(types).forEach(type => {
      this[type] = {
        dispatch : (action) => {
          action = Object.assign({},action,{
            type:types[type],
            from: gwentTypes.BROWSER_TAG,
          });
          this.store.dispatch(action);
        }
      }
    });

    ['chesses'].map(propertyName=>{
      new Watcher(this, propertyName);
    })
  }
  watch(obj){
    Object.keys(obj).map(name=>{
      const watch = this.$watchs[name];
      if(watch){
        watch.on(obj[name].bind(this));
      }
    })
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
}


export default Data;
