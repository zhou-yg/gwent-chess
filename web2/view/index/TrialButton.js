'use strict';
import loader from '../../loader';

import {
  h,
  renderTo,
  PactComponent,
  Container
} from 'pixi-react/src/pixi-react';


export default class TrialButton extends PactComponent {
  constructor(props) {
    super(props);

    this.displayName = 'TrialButton';

    this.state = {
      member:{
        'anchor.x': 0.5,
        x: 320,
        y: 700,
      }
    }
  }

  testClick(){
    console.log('click')
  }

  render () {
    const {member}=this.state;

    return (
      <sprite onTouch={this.testClick} key="sp2" member={member} texture={loader().TrialButton.texture} />
    );
  }
}
