'use strict';
import loader from '../../loader';
import Title from '../Title/';
import TrialButton from '../TrialButton';

import {
  h,
  renderTo,
  PactComponent,
  Container
} from 'pixi-react/src/pixi-react';


export default class Prince extends PactComponent {
  constructor(props) {
    super(props);

    this.displayName = 'Index';

    const member = {
      'scale.x' : 1,
      'scale.y' : 1,
      'anchor.x': 0.5,
      'animationSpeed': 0.05,
      x: 300,
      y: 400,
      play: true,
    }

    this.state = {
      member,
    }

  }

  render () {

    const {member} = this.state;

    const textures = Object.values(loader().Prince.textures);

    return (
      <ani textures={textures} member={member}/>
    );
  }
}
