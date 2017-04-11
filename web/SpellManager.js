'use strict'
import * as _ from 'lodash';

export const SPELL_ID_01 = 'spell00';
export const SPELL_ID_02 = 'spell01';

const spellsMap = {
  // 视野和速度都变大了
  [SPELL_ID_01] : function (data, spellObj) {
    spellObj.self.visionDistance += 1;

    console.log(JSON.stringify(data.chesses.map(obj => {
      return Object.assign(obj.graphicsData(), {
        index: obj.index,
      });
    })));
    data.CHANGE_CHESS.dispatch({
      chesses: data.chesses.map(obj => {
        return Object.assign(obj.graphicsData(), {
          index: obj.index,
        });
      })
    });

    const curRound = data.roundNumber;

    data.watch({
      roundNumber (v,old,off) {
        console.log('回合数:', v);
        if(v - curRound > 2){
          spellObj.self.visionDistance -= 1;

          console.log(JSON.stringify(data.chesses.map(obj => {
            return Object.assign(obj.graphicsData(), {
              index: obj.index,
            });
          })));

          data.CHANGE_CHESS.dispatch({
            chesses: data.chesses.map(obj => {
              return Object.assign(obj.graphicsData(), {
                index: obj.index,
              });
            })
          });
          off();
        }
      },
    });
  },
  [SPELL_ID_02] : function (data, spellObj) {

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
