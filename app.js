'use strict'

const path = require('path');
const fs = require('fs');
const babel = require('babel-core');
const webpack = require('webpack');
const Gwent = require('../../');

const MemoryFS = require('memory-fs');
const mfs = new MemoryFS();

const createStore = require('./web/store/store.js');
const types = require('./web/store/types.js');

const userMap = {};

var i = 0;

class BattleManager {

  constructor(userA,userB){
    this.userA = userA;
    this.userB = userB;
    this.users = [this.userA,this.userB];

    this._userADispatch = userA.store.socketDispatch;
    this._userBDispatch = userB.store.socketDispatch;

    var dispatchers = [this._userADispatch,this._userBDispatch];

    this.unsubscribe = this.users.map((user,i)=>{

      user.store.socketDispatch = (action) => {

        try {


          dispatchers.forEach((socketDispatch, j)=> {

            action = Object.assign({}, action, {
              from:action.from + ` by battle manager`,
              isSelf: i === j,
            });
            console.log(`Manager.Dispatch ${j}`, action);

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
    this.userA.store.dispatch = this._userADispatch;
    this.userB.store.dispatch = this._userBDispatch;
    this.unsubscribe.forEach(fn=>fn());
  }
}

const app = Gwent({
  createStore,
  onConnect(){
    console.log('connect');

    this.userData = {
      username: 'u' + (i++),
      store: this.store,
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

const webpackConfig = {

  entry: {
    client: path.join(__dirname, 'index.js'),
  },
  output: {
    path: __dirname,
    publicPath: '/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
        exclude: /node_modules/
      }
    ]
  }
};

var compiler = webpack(webpackConfig);
compiler.outputFileSystem = mfs;

function jsContent() {
  return new Promise(resolve=> {
    compiler.run((err, stats)=> {

      var content = mfs.readFileSync(path.join(__dirname, './client.js'));

      resolve(content);
    });
  }).catch(e=> {
    console.log(e);
  });
}

app.use(function *(next) {

  if (/index\.js$/.test(this.request.path)) {
    this.response.set('Content-type', 'application/javascript');

    this.body = yield jsContent();

  } else {
    yield next;
  }
})

app.use(function *() {
  this.response.set('Content-type', 'text/html');
  this.body = fs.createReadStream('./index.html');
});

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
app.io.route('match user',function * (next,username){

  if(this.userData.battleManager){
    this.userData.battlerManager.end();
  }

  if(username !== this.userData.username){

    var findPlayer = null;

    Object.keys(userMap).map(socketId=>{
      if(userMap[socketId].username === username ){
        findPlayer = userMap[socketId];
      }
    });

    console.log('findPlayer:',findPlayer);

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

    const battleManager = new BattleManager(this.userData,findPlayer);

    this.userData.battlerManager = batterManager;
    findPlayer.battlerManager = batterManager;

  }else{
    this.emit('log','同名')
  }
});

app.listen(9999, ()=> {
  console.log('listen on 9999');
});
