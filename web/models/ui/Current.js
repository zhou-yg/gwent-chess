'use strict';

class Current {
  constructor(data){
    var div = document.createElement('div');
    div.id = 'current';
    this.el= div;
    this.data = data;
    this.listeners = [];
  }
  showSelectChess(){
    var {index, skills,chessType,x,y} = this.data.chesses[this.data.selectChess.index];
    this.el.innerHTML = '';

    var frag = document.createDocumentFragment();

    var text = document.createTextNode(`当前选择:${index}, ${chessType},${x}-${y}`);

    frag.appendChild(text);
    skills.forEach(skillObj => {

      var d = document.createElement('div');

      d.className = 'skill-one';
      d.style.background = skillObj.style.background;
      d.innerText = skillObj.name;

      d.onclick = ()=>{
        this.data.doSkill(skillObj);
        this.listeners.forEach(fn => fn());
      }

      frag.appendChild(d)
    });
    this.el.appendChild(frag);
  }
  onSkill(fn){
    this.listeners.push(fn);
    return ()=>{
      this.listeners = this.listeners.filter((f) => {
        return f !== fn;
      });
    }
  }
}

export default Current;
