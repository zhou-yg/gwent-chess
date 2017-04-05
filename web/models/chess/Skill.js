'use strict';

class Skill {
  constructor(init){
    this.id = init.id;
    this.name = init.name;
    this.skill = init.skill;
    this.self = init.self;
    this.style = init.style;
  }
}


Skill.skillsMap = {
  // 视野和速度都变大了
  'skill00' : function (allState, skillObj) {
    skillObj.self.visionDistance = 3;
  },
  'skill01' : function () {

  }
}

module.exports = Skill;
