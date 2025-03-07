
class Bishop{

	constructor(x, y, player){
		this.x = x;
		this.y = y;
		this.player = player;
		this.validMoves = [];
	}

	findValidMoves(boardState){

		this.validMoves.splice(0, this.validMoves.length);

		let result;
		let x = this.x;
		let y = this.y;

		while(x > 0 && y > 0){
			x = x - 1;
			y = y - 1;
			result = this.validMovesCheckSpot(boardState, x, y);
			if(result === 0){
				break;
			}
		}

		//go diagonally right-up:
		x = this.x;
		y = this.y;

		while(x > 0 && y < 7){
			x = x - 1;
			y = y + 1;
			result = this.validMovesCheckSpot(boardState, x, y);
			if(result === 0){
				break;
			}
		}

		//go diagonally left-down:
		x = this.x;
		y = this.y;

		while(x < 7 && y > 0){
			x = x + 1;
			y = y - 1;
			result = this.validMovesCheckSpot(boardState, x, y);
			if(result === 0){
				break;
			}
		}

		//go diagonally right-down:
		x = this.x;
		y = this.y;
		
		while(x < 7 && y < 7){
			x = x + 1;
			y = y + 1;
			result = this.validMovesCheckSpot(boardState, x, y);
			if(result === 0){
				break;
			}
		}

		return this.validMoves;
	}

	validMovesCheckSpot(boardState, x, y){

		if(boardState[x][y].charAt(0) !== "#"){
			if(this.player === boardState[x][y].charAt(0)){
				return 0;
			}
			else{
				let lastMove = new Move(x, y);
				this.validMoves.push(lastMove);
				return 0;
			}
		}
	
		let move = new Move(x, y);
		this.validMoves.push(move);
		return 1;
	}

	findAllMoves(boardState, king){

		this.validMoves.splice(0, this.validMoves.length);
		let result;
		let x = this.x;
		let y = this.y;

		while(x > 0 && y > 0){
			x = x - 1;
			y = y - 1;
			result = this.allMovesCheckSpot(boardState, king, x, y);
			if(result === 0){
				break;
			}
		}

		//go diagonally right-up:
		x = this.x;
		y = this.y;

		while(x > 0 && y < 7){
			x = x - 1;
			y = y + 1;
			result = this.allMovesCheckSpot(boardState, king, x, y);
			if(result === 0){
				break;
			}
		}

		//go diagonally left-down:
		x = this.x;
		y = this.y;

		while(x < 7 && y > 0){
			x = x + 1;
			y = y - 1;
			result = this.allMovesCheckSpot(boardState, king, x, y);
			if(result === 0){
				break;
			}
		}

		//go diagonally right-down:
		x = this.x;
		y = this.y;
		
		while(x < 7 && y < 7){
			x = x + 1;
			y = y + 1;
			result = this.allMovesCheckSpot(boardState, king, x, y);
			if(result === 0){
				break;
			}
		}

		return this.validMoves;
	}

	allMovesCheckSpot(boardState, king, x, y){

		if(boardState[x][y].charAt(0) !== "#"){
			if(this.player === boardState[x][y].charAt(0)){
				return 0;
			}
			else{
				let lastMove = new Move(x, y);
				if(king.checkMove(boardState, this.x, this.y, x, y)){
					lastMove.setCheck(true);
				}	
				this.validMoves.push(lastMove);
				return 0;
			}				
		}
			
		let move = new Move(x, y);
		if(king.checkMove(boardState, this.x, this.y, x, y)){
			move.setCheck(true);
		}	
		this.validMoves.push(move);
		return 1;

	}

}





