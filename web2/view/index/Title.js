'use strict';
import loader from '../../loader';

import {
  h,
  renderTo,
  PactComponent,
  Container
} from 'pixi-react/src/pixi-react';


export default class Title extends PactComponent {
  constructor(props) {
    super(props);

    this.displayName = 'Title'

    this.state = {
      member: {
        'scale.x' : 0.8,
        'scale.y' : 0.8,
        'anchor.x':0.5,
        x: 320,
        y: 10,
      }
    }
  }

  render () {

    const {member} = this.state;

    return (
      <sprite key="sp" member={member} texture={loader().Title.texture} />
    );
  }
}
