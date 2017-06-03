import createStore from './store/store';
import delegate from 'delegates';
import GwentData from '../web/gwent-data';
import gwentTypes from 'gwent.js/src/lib/types'
import watch from 'gwent.js/src/lib/watch';

class Data {

  constructor (socket) {
    const store = createStore(socket, {
      browser: true,
    });


    this.store = store;

    delegate(this, 'store')
      .method('getState')
      .method('dispatch')
      .method('subscribe');

  }

  watch(register){
    return watch(this.store,register);
  }

  dispatchToServer(action) {
    Object.assign(action, {
      from: gwentTypes.BROWSER_TAG,
    });

    this.store.dispatch(action);
  }
}

const socket = io();

const d = new Data(socket);


export default d;
