import Chess from './Chess.js'

class Rook extends Chess{

  constructor(config = {}){
    super(Object.assign(config,{
      chessType:'Rook',
    }))
  }

}


export default Rook;
