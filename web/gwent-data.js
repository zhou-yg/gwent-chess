'use strict';
import Watcher from './Watcher';

function dataDefault() {
  return {
  };
}

class Data {

  constructor (config) {

    if(!config){
      config = {};
    }

    const initConfig = Object.assign(dataDefault(), config);
    Object.assign(this,initConfig);

    Object.keys(initConfig).map(propertyName=>{
      new Watcher(this, propertyName);
    });

  }
  watch(obj){
    Object.keys(obj).map(name=>{
      const watch = this.$watchs[name];
      if(watch){
        watch.on(obj[name].bind(this));
      }
    })
  }
}


export default Data;
