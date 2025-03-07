
class Move{

	constructor(x, y){
		this.x = x;
		this.y = y;
		this.inCheck = false;
	}

	getX(){
		return this.x;
	}

	getY(){
		return this.y;
	}

	setCheck(inCheck){
		this.inCheck = inCheck;
	}

	getInCheck(){
		return this.inCheck;
	}

}


class Pawn{

	constructor(x, y, player){
		this.x = x;
		this.y = y;
		this.player = player;
	}

	
	findValidMoves(boardState, enPassant){

		let validMoves = [];
		let player = this.player;
		let x = this.x;
		let y = this.y;
		let opponent;
	
		if(player === "w"){
			opponent = "b";
		}
		else{
			opponent = "w";
		}

				

		
		if(x > 0){
					
			x = x - 1;
			let c = boardState[x][y].charAt(0);

			if(c === '#'){
				let m = new Move(x, y);
				validMoves.push(m);

				if(this.x === 6){
					x = x - 1;
					c = boardState[x][y].charAt(0);
					if( c === '#'){
						let m2 = new Move(x, y);
						validMoves.push(m2);
					}
				}	
			}

			x = this.x;
			x = x - 1;
			y = y - 1;

			if(x >= 0 && y >= 0){
				c = boardState[x][y].charAt(0);
				if(c === opponent){
					let m3 = new Move(x, y);
					validMoves.push(m3);
				}
				
			}

			x = this.x;
			y = this.y;
			x = x - 1;
			y = y + 1;

			if(x >= 0 && y <= 7){
				c = boardState[x][y].charAt(0);
				if(c === opponent){
					let m4 = new Move(x, y);
					validMoves.push(m4);
				}
			}		
			
			//check for enpassant move
			if(enPassant.getStatus()){
				if(enPassant.pawnParallel(this.x, this.y)){
					validMoves.push(enPassant.getMove());
				}
			}	
				
		}

		return validMoves;
	}


	findAllMoves(boardState, king, enPassant){

		let validMoves = [];
		let player = this.player;
		let x = this.x;
		let y = this.y;
		let opponent;
	
		if(player === "w"){
			opponent = "b";
		}
		else{
			opponent = "w";
		}

		if(x > 0){
					
			x = x - 1;
			let c = boardState[x][y].charAt(0);

			if(c === '#'){
				//check first spot
				let m = new Move(x, y);
				if(king.checkMove(boardState, this.x, this.y, x, y)){
					//king is in check in this position
					m.setCheck(true);
				}
				validMoves.push(m);

				if(this.x === 6){
					x = x - 1;
					c = boardState[x][y].charAt(0);
					if( c === '#'){
						let m2 = new Move(x, y);
						if(king.checkMove(boardState, this.x, this.y, x, y)){
							m2.setCheck(true);
						}
						validMoves.push(m2);
					}
				}	
			}

			x = this.x;
			x = x - 1;
			y = y - 1;

			if(x >= 0 && y >= 0){
				c = boardState[x][y].charAt(0);
				if(c === opponent){
					let m3 = new Move(x, y);
					if(king.checkMove(boardState, this.x, this.y, x, y)){
						m3.setCheck(true);
					}
					validMoves.push(m3);
				}
				
			}

			x = this.x;
			y = this.y;
			x = x - 1;
			y = y + 1;

			if(x >= 0 && y <= 7){
				c = boardState[x][y].charAt(0);
				if(c === opponent){
					let m4 = new Move(x, y);
					if(king.checkMove(boardState, this.x, this.y, x, y)){
						m4.setCheck(true);
					}
					validMoves.push(m4);
				}
			}		
			
			//check for enpassant move
			if(enPassant.getStatus()){
				if(enPassant.pawnParallel(this.x, this.y)){
					let m5 = enPassant.getMove();
					let enSafePiece = boardState[enPassant.getPawnX()][enPassant.getPawnY()];
					boardState[enPassant.getPawnX()][enPassant.getPawnY()] = "##";
					if(king.checkMove(boardState, this.x, this.y, x, y)){
						m5.setCheck(true);
					}
					boardState[enPassant.getPawnX()][enPassant.getPawnY()] = enSafePiece;
					validMoves.push(m5);
				}
			}	
				
		}

		return validMoves;
	}

	findAllOppMoves(boardState, king, enPassant){

		let validMoves = [];
		let player = this.player;
		let x = this.x;
		let y = this.y;
		let opponent;
	
		if(player === "w"){
			opponent = "b";
		}
		else{
			opponent = "w";
		}

		if(x < 7){
					
			x = x + 1;
			let c = boardState[x][y].charAt(0);

			if(c === '#'){
				//check first spot
				let m = new Move(x, y);
				if(king.checkMove(boardState, this.x, this.y, x, y)){
					//king is in check in this position
					m.setCheck(true);
				}
				validMoves.push(m);

				if(this.x === 1){
					x = x + 1;
					c = boardState[x][y].charAt(0);
					if( c === '#'){
						let m2 = new Move(x, y);
						if(king.checkMove(boardState, this.x, this.y, x, y)){
							m2.setCheck(true);
						}
						validMoves.push(m2);
					}
				}	
			}

			x = this.x;
			x = x + 1;
			y = y - 1;

			if(x <= 7 && y >= 0){
				c = boardState[x][y].charAt(0);
				if(c === opponent){
					let m3 = new Move(x, y);
					if(king.checkMove(boardState, this.x, this.y, x, y)){
						m3.setCheck(true);
					}
					validMoves.push(m3);
				}
				
			}

			x = this.x;
			y = this.y;
			x = x + 1;
			y = y + 1;

			if(x <= 7 && y <= 7){
				c = boardState[x][y].charAt(0);
				if(c === opponent){
					let m4 = new Move(x, y);
					if(king.checkMove(boardState, this.x, this.y, x, y)){
						m4.setCheck(true);
					}
					validMoves.push(m4);
				}
			}		
			
			//check for enpassant move
			if(enPassant.getStatus()){
				if(enPassant.pawnParallel(this.x, this.y)){
					let m5 = enPassant.getMove();
					let enSafePiece = boardState[enPassant.getPawnX()][enPassant.getPawnY()];
					boardState[enPassant.getPawnX()][enPassant.getPawnY()] = "##";
					if(king.checkMove(boardState, this.x, this.y, x, y)){
						m5.setCheck(true);
					}
					boardState[enPassant.getPawnX()][enPassant.getPawnY()] = enSafePiece;
					validMoves.push(m5);
				}
			}	
				
		}

		return validMoves;
	}



	takeMoves(boardState){

		let validMoves = [];
		let player = this.player;
		let x = this.x;
		let y = this.y;
		let opponent;
	
		if(player === "w"){
			opponent = "b";
		}
		else{
			opponent = "w";
		}

		if (x > 0){

			let c;

			x = x - 1;
			y = y - 1;

			if(x >= 0 && y >= 0){
				c = boardState[x][y].charAt(0);
				if(c === opponent){
					let m3 = new Move(x, y);
					validMoves.push(m3);
				}
				
			}

			x = this.x;
			y = this.y;
			x = x - 1;
			y = y + 1;

			if(x >= 0 && y <= 7){
				c = boardState[x][y].charAt(0);
				if(c === opponent){
					let m4 = new Move(x, y);
					validMoves.push(m4);
				}
			}
		}

		return validMoves;
	}


	oppTakeMoves(boardState){

		let validMoves = [];
		let player = this.player;
		let x = this.x;
		let y = this.y;
		let opponent;
	
		if(player === "w"){
			opponent = "b";
		}
		else{
			opponent = "w";
		}

		if (x < 7){

			let c;

			x = x + 1;
			y = y - 1;

			if(x <= 7 && y >= 0){
				c = boardState[x][y].charAt(0);
				if(c === opponent){
					let m3 = new Move(x, y);
					validMoves.push(m3);
				}
				
			}

			x = this.x;
			y = this.y;
			x = x + 1;
			y = y + 1;

			if(x <= 7 && y <= 7){
				c = boardState[x][y].charAt(0);
				if(c === opponent){
					let m4 = new Move(x, y);
					validMoves.push(m4);
				}
			}
		}

		return validMoves;
	}


}

class Enpassant{

	constructor(){

		this.enpassant = false;
		this.enX = -1;
		this.enY = -1;
		this.pawnX = -1;
		this.pawnY = -1;
	}

	checkPawn(boardState, oldX, oldY, newX, newY){

		//console.log("Inside CheckPawn");

		let c = boardState[oldX][oldY].charAt(1);

		if(oldX !== 1 || newX !== 3 || oldY !== newY || c !== 'p'){
			//enpassant = false;
			this.reset();
			return false;
		}

		this.enpassant = true;
		this.enX = 2;
		this.enY = oldY;
		this.pawnX = newX;
		this.pawnY = newY;

		return true;

	}

	checkMyPawn(boardState, oldX, oldY, newX, newY){

		//console.log("Inside CheckMyPawn");

		let c = boardState[oldX][oldY].charAt(1);

		if(oldX !== 6 || newX !== 4 || oldY !== newY || c !== 'p'){

			this.reset();
			return false;
		}

		this.enpassant = true;
		this.enX = 5;
		this.enY = oldY;
		this.pawnX = newX;
		this.pawnY = newY;

		return true;
	}

	reset(){

		this.enpassant = false;
		this.enX = -1;
		this.enY = -1;
		this.pawnX = -1;
		this.pawnY = -1;
	}

	getStatus(){
		return this.enpassant;
	}

	setStatus(status){
		this.enpassant = status;
	}

	getPawnX(){
		return this.pawnX;
	}

	setPawnX(pawnX){
		this.pawnX = pawnX;
	}

	getPawnY(){
		return this.pawnY;
	}

	setPawnY(pawnY){
		this.pawnY = pawnY;
	}

	getENX(){
		return this.enX;
	}

	setENX(enX){
		this.enX = enX;
	}

	getENY(){
		return this.enY;
	}

	setENY(enY){
		this.enY = enY;
	}

	getMove(){
		let m = new Move(this.enX, this.enY);
		return m;
	}

	preEnTake(boardState, oldX, oldY, newX, newY){

		let c1 = boardState[oldX][oldY].charAt(1);
		let c2 = boardState[newX][newY].charAt(1);

		if(newX === this.enX && newY === this.enY && c1 === 'p' && c2 === "#"){
			return true;
		}

		return false;

	}

	enTake(boardState, x, y){
		//need to be more specific
		//in classic I have no way of knowning whether or not
		//a pawn made an enpassant move, so need to check everything
		//at the time that the move is completed

		//console.log("Inside enTake");

		let c = boardState[x][y].charAt(1);

		if(x === this.enX && y === this.enY && c === 'p'){
			return true;
		}
		return false;
	}

	pawnParallel(x, y){

		if(x !== this.pawnX){
			return false;
		}

		if( ((this.pawnY - 1) >= 0) && ( (this.pawnY - 1) === y) ){
			return true;
		}

		if( ((this.pawnY + 1) <= 7) && ( (this.pawnY + 1) === y) ){
			return true;
		}

		return false;
	}


}








