'use strict'
import * as _ from 'lodash';

export const SPELL_ID_01 = 'spell00';
export const SPELL_ID_02 = 'spell01';

const spellsMap = {
  // 视野和速度都变大了
  [SPELL_ID_01] : function (data, spellObj) {
    spellObj.self.visionDistance = 3;

    data.CHANGE_CHESS.dispatch({
      chesses: data.chesses.map(obj => {
        return Object.assign(obj.graphicsData(), {
          index: obj.index,
        });
      })
    })
  },
  [SPELL_ID_02] : function () {

  },
}

class History {
  constructor(id,data){
    this.id = id;
    this.data = _.cloneDeep(data);
  }
}

class SpellManager {
  constructor(data) {

    this.data = data;

    this.castHistory = [];
  }

  castSpell (spellObj) {

    var spellFunc = spellsMap[spellObj.id];

    spellFunc(this.data, spellObj);

    this.castHistory.push(new History(spellObj.id,this.data));
  }
}


export default SpellManager;
