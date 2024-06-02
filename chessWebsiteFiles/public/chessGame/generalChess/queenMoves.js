
class Queen {

	constructor(x, y, player){
		this.x = x;
		this.y  =y;
		this.player = player;
		this.validMoves = [];
	}

	findValidMoves(boardState){

		this.validMoves.splice(0, this.validMoves.length);

		let x = this.x;
		let y = this.y;
		let player = this.player;

		let bishop = new Bishop(x, y, player);
		let rook = new Rook(x, y, player);

		let bishopMoves = bishop.findValidMoves(boardState);
		let rookMoves = rook.findValidMoves(boardState);

		let size1 = bishopMoves.length;
		let size2 = rookMoves.length;

		for(let i = 0; i < size1; i++){
			this.validMoves.push(bishopMoves.shift());
		}

		for(let i = 0; i < size2; i++){
			this.validMoves.push(rookMoves.shift());
		}

		return this.validMoves;	
		
	}

	findAllMoves(boardState, king){

		this.validMoves.splice(0, this.validMoves.length);

		let x = this.x;
		let y = this.y;
		let player = this.player;

		let bishop = new Bishop(x, y, player);
		let rook = new Rook(x, y, player);

		let bishopMoves = bishop.findAllMoves(boardState, king);
		let rookMoves = rook.findAllMoves(boardState, king);

		let size1 = bishopMoves.length;
		let size2 = rookMoves.length;

		for(let i = 0; i < size1; i++){
			this.validMoves.push(bishopMoves.shift());
		}

		for(let i = 0; i < size2; i++){
			this.validMoves.push(rookMoves.shift());
		}

		return this.validMoves;

	}
}
