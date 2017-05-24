'use strict';

import * as _ from 'lodash';
import {
  h,
  renderTo,
  PactComponent,
  Container
} from 'pixi-react/src/pixi-react';

import loader from '../../loader';

const MAX_W = 640;
const CELL_W = 6;
const CELL_H = CELL_W;
const CELL_WIDTH = MAX_W/CELL_W;

class Cell {
  constructor(x, y) {

    this.type = 0;

    this.chess = null;
    this.block = null;
    this.position = {x,y};
    this.inffect = null;
  }
}

class CellManager {
  constructor(){
    this.W = CELL_W;
    this.H = CELL_H;

    this.indexes = _.range(this.W * this.H).map(i => {
      return new Cell(i % this.W, parseInt(i / this.H));
    });
  }

  getCell(x, y){
    return _.cloneDeep(this.indexes[x + y * this.H]);
  }
}

class CellSprite extends PactComponent {
  constructor(props){
    super(props);
  }
  render () {
    const {topMember, cell, i} = this.props;
    const member = {
      'anchor.x':0.5,
      'anchor.y':0.5,
      'scale.x': 0.3,
      'scale.y': 0.3,
    }

    const w = MAX_W/CELL_W;
    var decorates = [];
    if(cell.type === 0 ){
      decorates = _.range(_.random(1,3)).map(index => {
        const myMember = Object.assign({
          x: _.random(20, w - 20),
          y: _.random(20, w - 20),
        }, member);
        const key = `grass${index}`;
        const grassType = _.random(0, 3);
        return (
          <sp key={key} member={myMember} texture={loader()[`grass${grassType}`].texture} />
        );
      });
    }

    const color = i%2 ===0 ? 0xffffff : 0xeeeeee;

    return (
      <c member={topMember}>
        <rect color={color} w={w} h={w} />
        {decorates}
      </c>
    );
  }
}

export default class BattleField extends PactComponent {

  constructor (props){
    super(props);

    this.state = {
      cellManager: new CellManager(),
    };
  }

  render(){
    const {cellManager} = this.state;
    return (
      <c>
      {cellManager.indexes.map((cell, i) => {
        const k = `cell${i}`;
        const member = {
          x: cell.position.x * CELL_WIDTH,
          y: cell.position.y * CELL_WIDTH,
        }
        return (
          <CellSprite i={i + parseInt(i/CELL_W)} key={k} cell={cell} topMember={member} />
        );
      })}
      </c>
    );
  }
}
