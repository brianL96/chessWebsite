
class Knight{

	constructor(x, y, player){
		this.x = x;
		this.y = y;
		this.player = player;
		this.validMoves = [];

	}

	findValidMoves(boardState){

		this.validMoves.splice(0, this.validMoves.length);

		let x = this.x;
		let y = this.y;
	
		x = x - 2;
		y = y - 1;

		if(x >= 0 && y >= 0){
			this.validMovesCheckSpot(boardState, x, y);
		}

		x = this.x;
		y = this.y;

		x = x - 2;
		y = y + 1;
		if(x >= 0 && y <= 7){
			this.validMovesCheckSpot(boardState, x, y);
		}		
		
		x = this.x;
		y = this.y;

		x = x - 1;
		y = y + 2;

		if(x >= 0 && y <= 7){
			this.validMovesCheckSpot(boardState, x, y);
		}

		x = this.x;
		y = this.y;

		x = x + 1;
		y = y + 2;
		if(x <= 7 && y <=7){
			this.validMovesCheckSpot(boardState, x, y);
		}

		x = this.x;
		y = this.y;
		
		x = x + 2;
		y = y + 1;

		if(x <= 7 && y <= 7){
			this.validMovesCheckSpot(boardState, x, y);
		}

		x = this.x;
		y = this.y;
		
		x = x + 2;
		y = y - 1;

		if(x <= 7 && y >= 0){
			this.validMovesCheckSpot(boardState, x, y);
		}

		x = this.x;
		y = this.y;

		x = x + 1;
		y = y - 2;
	
		if(x <= 7 && y >= 0){
			this.validMovesCheckSpot(boardState, x, y);
		}

		x = this.x;
		y = this.y;

		x = x - 1;
		y = y - 2;

		if(x >= 0 && y >= 0){
			this.validMovesCheckSpot(boardState, x, y);
		}

		return this.validMoves;	
	}

	validMovesCheckSpot(boardState, x, y){
		if(boardState[x][y].charAt(0) !== this.player){
			let move = new Move(x, y);
			this.validMoves.push(move);
		}
	}


	findAllMoves(boardState, king){

		this.validMoves.splice(0, this.validMoves.length);
		
		let x = this.x;
		let y = this.y;
	

		x = x - 2;
		y = y - 1;

		if(x >= 0 && y >= 0){
			this.allMovesCheckSpot(boardState, king, x, y);
		}

		x = this.x;
		y = this.y;

		x = x - 2;
		y = y + 1;

		if(x >= 0 && y <= 7){
			this.allMovesCheckSpot(boardState, king, x, y);
		}		
		
		x = this.x;
		y = this.y;

		x = x - 1;
		y = y + 2;

		if(x >= 0 && y <= 7){
			this.allMovesCheckSpot(boardState, king, x, y);
		}

		x = this.x;
		y = this.y;

		x = x + 1;
		y = y + 2;

		if(x <= 7 && y <=7){
			this.allMovesCheckSpot(boardState, king, x, y);
		}

		x = this.x;
		y = this.y;
		
		x = x + 2;
		y = y + 1;

		if(x <= 7 && y <= 7){
			this.allMovesCheckSpot(boardState, king, x, y);
		}

		x = this.x;
		y = this.y;
		
		x = x + 2;
		y = y - 1;

		if(x <= 7 && y >= 0){
			this.allMovesCheckSpot(boardState, king, x, y);
		}

		x = this.x;
		y = this.y;

		x = x + 1;
		y = y - 2;
	
		if(x <= 7 && y >= 0){
			this.allMovesCheckSpot(boardState, king, x, y);
		}

		x = this.x;
		y = this.y;

		x = x - 1;
		y = y - 2;

		if(x >= 0 && y >= 0){
			this.allMovesCheckSpot(boardState, king, x, y);
		}

		return this.validMoves;	
	}

	allMovesCheckSpot(boardState, king, x, y){		
		if(boardState[x][y].charAt(0) !== this.player){
			let move = new Move(x, y);
			if(king.checkMove(boardState, this.x, this.y, x, y)){
				move.setCheck(true);
			}				
			this.validMoves.push(move);
		}
	}


}










