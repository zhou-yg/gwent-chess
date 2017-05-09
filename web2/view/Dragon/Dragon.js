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


export default class Dragon extends PactComponent {
  constructor(props) {
    super(props);

    this.displayName = 'Index';

    const member = {
      'scale.x' : 0.1,
      'scale.y' : 0.1,
      'anchor.x': 0.5,
      'animationSpeed': 0.1,
      x: 320,
      y: 400,
      play: false,
    }

    this.state = {
      member,
    }

    window.dragon = this;
  }

  render () {

    const {member} = this.state;

    const textures = Object.values(loader().Dragon.textures);

    return (
      <ani textures={textures} member={member}/>
    );
  }
}
