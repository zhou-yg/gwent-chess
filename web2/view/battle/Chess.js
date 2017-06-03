'use strict';
import * as _ from 'lodash';
import {
  h,
  renderTo,
  PactComponent,
  Container
} from 'pixi-react/src/pixi-react';

import loader from '../../loader';


export default class Chess extends PactComponent{
  constructor(props){
    super(props);

    this.state = {
      member: {
        'scale.x': 0.5,
        'scale.y': 0.5,
        'animationSpeed': 0.05,
      }
    }
  }

  render(){
    const {member} = this.state;
    const {chess} = this.props;

    console.log(chess.textureName);

    const resource = loader()[chess.textureName];

    if(resource.texture){
      return (
        <c texture={resource.texture} member={member} />
      );
    }else{
      return (
        <ani textures={Object.values(resource.textures)} member={member} />
      );
    }
  }
}
