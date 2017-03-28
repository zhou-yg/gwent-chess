class UserList {

  constructor(socket){

    var div = document.createElement('div');
    div.id = 'userList';

    this.el = div;

    this.socket = socket;
    this.socket.on('users',(list)=>{

      this.list = list.map(obj=>{

        return {
          username:obj.username,
        }
      });

      this.render();
    });

    this.selectFn = () => {};
  }

  onSelect (fn) {
    this.selectFn = fn;
  }

  render(){
    const frag = this.list.map(obj=>{
      const li = document.createElement('li');
      li.innerText = obj.username;
      li.onclick = () => {

        this.socket.emit('match user',obj.username);
      };

      return li;
    }).reduce((frag,li)=>{
      frag.appendChild(li);
      return frag;
    },document.createDocumentFragment());

    this.el.innerHTML = '';
    this.el.appendChild(frag);
  }
}

export default UserList;
