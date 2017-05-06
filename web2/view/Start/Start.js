'use strict';
import loader from '../../loader';

import {
  h,
  renderTo,
  PactComponent,
  Container
} from 'pixi-react/src/pixi-react';


export default class Index extends PactComponent {
  constructor(props) {
    super(props);

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
      <c key="index">
        <sprite
          key="must has a key"
          texture={loader().Start.texture}
          member={member}
        />
      </c>
    );
  }
}
