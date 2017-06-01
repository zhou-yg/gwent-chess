'use strict'

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const Gwent = require('gwent.js');

const MemoryFS = require('memory-fs');
const mfs = new MemoryFS();

const createStore = require('./web2/store/store.js');
const types = require('./web2/store/types.js');
const webpackConfig = require('./webpack.config');
const compiler = webpack(webpackConfig);

const userMap = {};

var i = 0;

class BattleManager{

  constructor(userA,userB){
    this.userA = userA;
    this.userB = userB;
    this.users = [this.userA,this.userB];

    this._userADispatch = userA.store.socketDispatch;
    this._userBDispatch = userB.store.socketDispatch;

    var dispatchers = [this._userADispatch,this._userBDispatch];

    this.unsubscribes = this.users.map((user,i)=>{

      user.store.socketDispatch = (action) => {

        console.log(`BattleManager.socketDispatch`);

        try {

          dispatchers.forEach((socketDispatch, j)=> {

            action = Object.assign({}, action, {
              from:action.from + ` by battle manager`,
              isSelf: i === j,
            });

            socketDispatch.call(this.users[j].store, action);
          });
        }catch(e){
          console.log(`e ${i}`,e);
        }
      };

      return user.store.subscribe(() => {

        var state = user.store.getState();

        console.log('Manager',i+' lastAction:',user.store.__SOCKET_ROUTE_ACTION);
      });
    })
  }

  end () {
    this.userA.store.socketDispatch = this._userADispatch;
    this.userB.store.socketDispatch = this._userBDispatch;
    this.unsubscribes.forEach(fn=>fn());
  }
}

const app = Gwent({
  createStore,
  onConnect(){
    console.log('connect');

    this.userData = {
      username: 'u' + (i++),
      store: this.store,
      socket: this,
    };

    userMap[this.socket.id] = this.userData;
    try {

    } catch (e) {
      console.log(e);
    }
  },
  onDisconnect(){
    console.log('disconnect');

    delete userMap[this.socket.id];
  }
});

compiler.outputFileSystem = mfs;

function jsContent(i) {
  return new Promise(resolve=> {
    compiler.run((err, stats)=> {

      var content = mfs.readFileSync(path.join(__dirname, `./client${i}.js`));

      resolve(content);
    });
  }).catch(e=> {
    console.log(e);
  });
}

app.use(function *(next) {

  if (/index1\.js$/.test(this.request.path)) {
    this.response.set('Content-type', 'application/javascript');

    this.body = yield jsContent(1);

  } else if (/index2\.js$/.test(this.request.path)) {
    this.response.set('Content-type', 'application/javascript');

    this.body = yield jsContent(2);
  } else if (/index1$/.test(this.request.path)) {
    this.response.set('Content-type', 'text/html');
    this.body = fs.createReadStream('./web/index.html');

  } else if (/index2$/.test(this.request.path)) {
    this.response.set('Content-type', 'text/html');
    this.body = fs.createReadStream('./web2/index.html');
  }else if(/web2\/static\/[\w]+\.(jpg|png|json)$/.test(this.request.path)){
    const parsedPath = path.parse(this.request.path);
    const ext = parsedPath.ext.replace(/^\./,'').replace(/jpg/, 'jpeg');
    const name = parsedPath.name[0].toUpperCase() + parsedPath.name.substr(1);
    if(ext === 'json'){
      this.response.set('Content-type', `application/json`);
    }else{
      this.response.set('Content-type', `image/${ext}`);
    }
    this.body = fs.createReadStream(path.join(`./web2/static/`, `${name}${parsedPath.ext}`))
  } else {
    yield next;
  }
})


app.io.route('new user', function *() {
  console.log('new user');

  try{

    const users = Object.keys(userMap).map(k=> {
      return {
        username: userMap[k].username,
      }
    });

    this.emit('users', users);
    this.broadcast.emit('users',users);
  }catch(e){

  }
});
app.io.route('end game', function * (next) {

  if(this.userData.battleManager){
    console.log(this.userData.username + ' 匹配结束');
    this.userData.battleManager.end();
  }
});
app.io.route('match user',function * (next,username){

  if(this.userData.battleManager){
    this.userData.battlerManager.end();
  }

  var findPlayer = null;

  console.log('start find');

  const socketIdArr = Object.keys(userMap);
  const allLen = socketIdArr.length;
  var i = 0;
  try{
    while (i < allLen) {
      if(userMap[socketIdArr[i]].username !== this.userData.username){
        findPlayer = userMap[socketIdArr[i]];
        break;
      }
      i++;
    }
  }catch(e){
    console.log('match error:',e);
  }

  console.log('findPlayer:',findPlayer);

  if(findPlayer){

    var battleManager;
    try{

      findPlayer.store.socketDispatch({
        type:types.FIND_PLAYER,
        isSelf:true,
        player:this.store.getState().player,
      });


      this.store.socketDispatch({
        type:types.FIND_PLAYER,
        isSelf:true,
        player:findPlayer.store.getState().player,
      });

      this.store.socketDispatch({
        type:types.START_TURN,
        to: true,
      });
      findPlayer.store.socketDispatch({
        type:types.START_TURN,
        to: false,
      });

      battleManager = new BattleManager(this.userData,findPlayer);

      this.userData.battleManager = battleManager;
      findPlayer.battleManager = battleManager;

      console.log(this.userData);

      this.emit('game start');
      findPlayer.socket.emit('game start');

    }catch(e){
      console.log('end e', e);
    }

  }else{
    this.emit('log','无法匹配到对手');
  }
});

module.exports = app;
