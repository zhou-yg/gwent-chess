'use strict';

class Current {
  constructor(data,spell){
    var div = document.createElement('div');
    div.id = 'current';
    this.el= div;
    this.data = data;
    this.spell = spell;
  }
  showSelectChess(){
    var {index, spells,chessType,x,y} = this.data.chesses[this.data.selectChess.index];
    this.el.innerHTML = '';

    var frag = document.createDocumentFragment();

    var text = document.createTextNode(`当前选择:${index}, ${chessType},${x}-${y}`);

    frag.appendChild(text);
    spells.forEach(spellObj => {

      var d = document.createElement('div');

      d.className = 'spell-one';
      d.style.background = spellObj.style.background;
      d.innerText = spellObj.name;

      d.onclick = ()=>{
        //this.data.doSpell(spellObj);
        // this.spell = new Spell(this.data);
        this.spell.castSpell(spellObj);
        //this.listeners.forEach(fn => fn());
      }

      frag.appendChild(d)
    });
    this.el.appendChild(frag);
  }
  onSpell(fn){
  }
}

export default Current;
