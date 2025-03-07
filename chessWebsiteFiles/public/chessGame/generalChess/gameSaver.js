
class saveMove{

	constructor(){
		this.moveType = null;
		this.moves = [];
		this.removedPiece = null;
		this.extraRemovedPiece = null;
		this.backendRemovedPiece = null;
		this.extraBackendRemovedPiece = null;
	}

	getMoveType(){
		return this.moveType;
	}

	setMoveType(moveType){
		this.moveType = moveType;
	}

	getMoves(){
		return this.moves;
	}

	addPromotionPiece(piece){
		this.moves.unshift(piece);
	}

	addMove(move){
		this.moves.push(move);
	}

	getRemovedPiece(){
		return this.removedPiece;
	}

	setRemovedPiece(removedPiece){
		this.removedPiece = removedPiece;
	}

	getExtraRemovedPiece(){
		return this.extraRemovedPiece;
	}

	setExtraRemovedPiece(piece){
		this.extraRemovedPiece = piece;
	}

	getBackendRemovedPiece(){
		return this.backendRemovedPiece;
	}

	setBackendRemovedPiece(piece){
		this.backendRemovedPiece = piece;
	}

	getExtraBackendRemovedPiece(){
		return this.extraBackendRemovedPiece;
	}

	setExtraBackendRemovedPiece(piece){
		this.extraBackendRemovedPiece = piece;
	}

}

/*
class previousMove{

	constructor(moveType, removedPiece){
		this.moveType = moveType;
		this.removedPiece = removedPiece;
		this.extraRemovedPiece;
		this.backendRemovedPiece;
		this.extraBackendRemovedPiece;
	}

	getMoveType(){
		return this.moveType;
	}

	getRemovedPiece(){
		return this.removedPiece;
	}

	setExtraRemovedPiece(piece){
		this.extraRemovedPiece = piece;
	}

	getExtraRemovedPiece(){
		return this.extraRemovedPiece;
	}

	setBackendRemovedPiece(piece){
		this.backendRemovedPiece = piece;
	}

	getBackendRemovedPiece(){
		return this.backendRemovedPiece;
	}

	setExtraBackendRemovedPiece(piece){
		this.extraBackendRemovedPiece = piece;
	}

	getExtraBackendRemovedPiece(){
		return this.extraBackendRemovedPiece;
	}
}

*/


class Saver{


	constructor(player){
		this.player = player;
		this.gameMoves = "";
		this.count = 0;

		this.currentMove = 0;
		this.gameMoveIndex = 0;
	}


	getPlayer(){
		return this.player;
	}

	getMoves(){
		return this.gameMoves;
	}

	setMoves(moveSet){
		this.gameMoves = moveSet;
	}

	addBasicMove(oldX, oldY, newX, newY){
		this.gameMoves = this.gameMoves + oldX.toString() + oldY.toString() + newX.toString() + newY.toString();
	}

	getCount(){
		return this.count;
	}

	incrementCount(){
		this.count = this.count + 1;
	}

	addEnpassantMove(oldX, oldY, newX, newY, removeX, removeY){
		this.gameMoves = this.gameMoves + "E" + oldX.toString() + oldY.toString() + newX.toString() + newY.toString() + removeX.toString() + removeY.toString();
		
	}

	addCastleMove(oldX, oldY, newX, newY, oldRookY, newRookY){
		this.gameMoves = this.gameMoves + "C" + oldX.toString() + oldY.toString() + newX.toString() + newY.toString() +  oldRookY.toString() + newRookY.toString();
	}

	addPromotionMove(promotion, oldX, oldY, newX, newY){
		this.gameMoves = this.gameMoves + "P" + promotion + oldX.toString() + oldY.toString() + newX.toString() + newY.toString();
	}

	readNextMove(){

		
		//console.log("Retrieving next move");

		if(this.gameMoveIndex >= this.gameMoves.length){
			console.log("No move to return");
			return null;
		}

		let nextMoveType = this.gameMoves.charAt(this.gameMoveIndex);


		if(nextMoveType === "E"){
			//for enpassant I need to read in the next 6 characters
			let move = new saveMove();
			move.setMoveType("enpassant");
			let index = this.gameMoveIndex;
			let length = this.gameMoves.length;
			let end = index + 6; 
			index++;

			while(index <= end){
				move.addMove(parseInt(this.gameMoves.charAt(index)));
				index++;
			}

			
			this.gameMoveIndex = index;			
			return move;
				
		}

		else if(nextMoveType === "C"){
				
			//for castle I need to read next 6 characters
			let move = new saveMove();
			move.setMoveType("castle");
			let index = this.gameMoveIndex;
			let length = this.gameMoves.length;
			let end = index + 6;
			index++;

			while(index <= end){
				move.addMove(parseInt(this.gameMoves.charAt(index)));
				index++;
			}

			this.gameMoveIndex = index;
			return move;
		}

		else if(nextMoveType === "P"){

			//for pawn promotion I need to read next 5 characters
			let move = new saveMove();
			move.setMoveType("promotion");
			let index = this.gameMoveIndex;
			let length = this.gameMoves.length;
			let end = index + 5;
			index++;

			move.addMove(this.gameMoves.charAt(index));
			index++;

			while(index <= end){
				move.addMove(parseInt(this.gameMoves.charAt(index)));
				index++;
			}

			this.gameMoveIndex = index;
			return move;
		}
			

		else {

			//if not a special move then a regular move
			let move = new saveMove();
			move.setMoveType("regular");
			let index = this.gameMoveIndex;
			let length = this.gameMoves.length;
			let end = index + 4; 

			while(index < end){
				move.addMove(parseInt(this.gameMoves.charAt(index)));
				index++;
			}

			this.gameMoveIndex = index;
			return move;
			
		}

		console.log("No move to return")
		return null;

	}


	getLastMove(previousMove){

		if(this.gameMoveIndex === 0){
			console.log("No move to return");
			return null;
		}

		if(previousMove.getMoveType() === "regular"){
			let move = new saveMove();
			move.setMoveType("regular");


			let end = this.gameMoveIndex;

			let index = end - 4;

			while(index < end){
				move.addMove(parseInt(this.gameMoves.charAt(index)));
				index++;
			}

			this.gameMoveIndex = end - 4;
			return move;

		}

		else if(previousMove.getMoveType() === "enpassant"){
			let move = new saveMove();
			move.setMoveType("enpassant");

			let end = this.gameMoveIndex;
			let index = end - 6;

			while(index < end){
				move.addMove(parseInt(this.gameMoves.charAt(index)));
				index++;
			}

			this.gameMoveIndex = end - 7;
			return move;
		}

		else if(previousMove.getMoveType() === "castle"){
			let move = new saveMove();
			move.setMoveType("castle");

			let end = this.gameMoveIndex;
			let index = end - 6;

			while(index < end){
				move.addMove(parseInt(this.gameMoves.charAt(index)));
				index++;
			}

			this.gameMoveIndex = end - 7;
			return move;
		}

		else if(previousMove.getMoveType() === "promotion"){
			let move = new saveMove();
			move.setMoveType("promotion");

			let end = this.gameMoveIndex;
			let index = end - 5;

			move.addMove(this.gameMoves.charAt(index));
			index++;

			while(index < end){
				move.addMove(parseInt(this.gameMoves.charAt(index)));
				index++;
			}

			this.gameMoveIndex = end - 6;
			return move;
		}


	}


}