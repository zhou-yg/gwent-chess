'use strict';

class Spell {
  constructor(init){
    this.id = init.id;
    this.name = init.name;
    this.spell = init.spell;
    this.self = init.self;
    this.style = init.style;
  }
}

module.exports = Spell;
