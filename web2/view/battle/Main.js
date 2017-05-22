import {
  h,
  renderTo,
  PactComponent,
  Container
} from 'pixi-react/src/pixi-react';

import BattleField from './BattleField';

export default class Main extends PactComponent {

  constructor (props){
    super(props);

    this.state = {

    }
  }

  render(){

    return (
      <c>
        <BattleField />
      </c>
    );
  }
}
