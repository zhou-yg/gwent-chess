'use strict';
import loader from '../../loader';
import Title from './Title';
import TrialButton from './TrialButton';
import Prince from './Prince';

import {
  h,
  renderTo,
  PactComponent,
  Container
} from 'pixi-react/src/pixi-react';


export default class Index extends PactComponent {
  constructor(props) {
    super(props);

    this.displayName = 'Index';

    const member = {
      'scale.x' : 0.2,
      'scale.y' : 0.1,
      x: 10,
      y: 100,
    }

    this.state = {
      member,
    }
  }

  render () {

    const {member} = this.state;

    return (
      <c>
        <Title />
        <TrialButton />
        <Prince />
      </c>
    );
  }
}
