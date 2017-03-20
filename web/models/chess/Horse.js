import Chess from './Chess.js'

class Horse extends Chess{

  constructor(config = {}){
    super(Object.assign(config,{
      chessType: 'Horse',
    }));
  }

}


export default Horse;
