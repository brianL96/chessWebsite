

class King {

	constructor(x, y, player){
		this.x = x;
		this.y = y;
		this.previousX = x;
		this.previousY = y;
		this.player = player;
		this.validMoves = [];
		this.otherKing = false;
	}

	setOtherKing(){
		console.log("Setting other king to true");
		this.otherKing = true;
	}

	getX(){
		return this.x;
	}

	getY(){
		return this.y;
	}

	getPreviousX(){
		return this.previousX;
	}

	setPreviousX(previousX){
		this.previousX = previousX;
	}

	getPreviousY(){
		return this.previousY;
	}

	setPreviousY(previousY){
		this.previousY = previousY;
	}

	selected(x, y){

		if(this.x === x && this.y === y){
			return true;
		}

		return false;
	}

	moveKing(x, y){

		this.previousX = this.x;
		this.previousY = this.y;
		this.x = x;
		this.y = y;
	}

	undoMove(){

		this.x = this.previousX;
		this.y = this.previousY;
	}

	findValidMoves(boardState){

		//let player = this.player;
		//let validMoves = [];
		this.validMoves.splice(0, this.validMoves.length);

		let x = this.x;
		let y = this.y;

		x = x - 1;
		y = y - 1;

		if(x >= 0 && y >= 0){
			this.validMovesCheckSpot(boardState, x, y);
		}

		x = this.x;
		y = this.y;

		x = x - 1;

		if(x >= 0 ){
			this.validMovesCheckSpot(boardState, x, y);
		}		
		
		x = this.x;
		y = this.y;

		x = x - 1;
		y = y + 1;

		if(x >= 0 && y <= 7){
			this.validMovesCheckSpot(boardState, x, y);
		}

		x = this.x;
		y = this.y;

		
		y = y + 1;

		if(y <= 7){
			this.validMovesCheckSpot(boardState, x, y);
		}

		x = this.x;
		y = this.y;
		
		x = x + 1;
		y = y + 1;

		if(x <= 7 && y <= 7){
			this.validMovesCheckSpot(boardState, x, y);
		}

		x = this.x;
		y = this.y;
		
		x = x + 1;

		if(x <= 7 ){
			this.validMovesCheckSpot(boardState, x, y);
		}

		x = this.x;
		y = this.y;

		x = x + 1;
		y = y - 1;
	
		if(x <= 7 && y >= 0){
			this.validMovesCheckSpot(boardState, x, y);
		}

		x = this.x;
		y = this.y;

		y = y - 1;

		if(y >= 0){
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

		//let player = this.player;
		//let validMoves = [];
		this.validMoves.splice(0, this.validMoves.length);

		let x = this.x;
		let y = this.y;

		x = x - 1;
		y = y - 1;

		if(x >= 0 && y >= 0){
			this.allMovesCheckSpot(boardState, king, x, y);
		}

		x = this.x;
		y = this.y;

		x = x - 1;

		if(x >= 0 ){
			this.allMovesCheckSpot(boardState, king, x, y);
		}		
		
		x = this.x;
		y = this.y;

		x = x - 1;
		y = y + 1;

		if(x >= 0 && y <= 7){
			this.allMovesCheckSpot(boardState, king, x, y);
		}

		x = this.x;
		y = this.y;

		
		y = y + 1;

		if(y <= 7){
			this.allMovesCheckSpot(boardState, king, x, y);
		}

		x = this.x;
		y = this.y;
		
		x = x + 1;
		y = y + 1;

		if(x <= 7 && y <= 7){
			this.allMovesCheckSpot(boardState, king, x, y);
		}

		x = this.x;
		y = this.y;
		
		x = x + 1;

		if(x <= 7 ){
			this.allMovesCheckSpot(boardState, king, x, y);
		}

		x = this.x;
		y = this.y;

		x = x + 1;
		y = y - 1;
	
		if(x <= 7 && y >= 0){
			this.allMovesCheckSpot(boardState, king, x, y);
		}

		x = this.x;
		y = this.y;

		y = y - 1;

		if(y >= 0){
			this.allMovesCheckSpot(boardState, king, x, y);
		}

		return this.validMoves;		
		
	}

	allMovesCheckSpot(boardState, king, x, y){		
		if(boardState[x][y].charAt(0) !== this.player){
			let move = new Move(x, y);

			if(king.checkKingMove(boardState, x, y)){
				move.setCheck(true);
			}	

			this.validMoves.push(move);
		}
	}



	check(boardState){

		let player = this.player;
		let opponent;
		let x = this.x;
		let y = this.y;

		let inCheck = false;

		let oppRook;
		let oppKnight;
		let oppBishop;
		let oppQueen;
		let oppKing;
		let oppPawn;

		if(player === 'w'){

			oppRook = 'bR';
			oppKnight = 'bN';
			oppBishop = 'bB';
			oppQueen = 'bQ';
			oppKing = 'bK';
			oppPawn = 'bp';
		}
		else{

			oppRook = 'wR';
			oppKnight = 'wN';
			oppBishop = 'wB';
			oppQueen = 'wQ';
			oppKing = 'wK';
			oppPawn = 'wp';
		}	
	

		let bishop = new Bishop(x, y, player);
		let bishopMoves = bishop.findValidMoves(boardState);

		if(this.check2Piece(boardState, bishopMoves, oppBishop, oppQueen)){
			return true;
		}

		let rook = new Rook(x, y, player);
		let rookMoves = rook.findValidMoves(boardState);

		if(this.check2Piece(boardState, rookMoves, oppRook, oppQueen)){
			return true;
		}

		let knight = new Knight(x, y, player);
		let knightMoves = knight.findValidMoves(boardState);

		if(this.check1Piece(boardState, knightMoves, oppKnight)){
			return true;
		}
		
		let kingMoves = this.findValidMoves(boardState);

		if(this.check1Piece(boardState, kingMoves, oppKing)){
			return true;
		}

		let pawn = new Pawn(x, y, player);
		let pawnMoves = pawn.takeMoves(boardState);
		

		if(this.check1Piece(boardState, pawnMoves, oppPawn)){
			return true;
		}


		return false;
		
	}


	oppCheck(boardState){

		let player = this.player;
		let opponent;
		let x = this.x;
		let y = this.y;

		let inCheck = false;

		let oppRook;
		let oppKnight;
		let oppBishop;
		let oppQueen;
		let oppKing;
		let oppPawn;

		if(player === 'w'){

			oppRook = 'bR';
			oppKnight = 'bN';
			oppBishop = 'bB';
			oppQueen = 'bQ';
			oppKing = 'bK';
			oppPawn = 'bp';
		}
		else{

			oppRook = 'wR';
			oppKnight = 'wN';
			oppBishop = 'wB';
			oppQueen = 'wQ';
			oppKing = 'wK';
			oppPawn = 'wp';
		}	
	

		let bishop = new Bishop(x, y, player);
		let bishopMoves = bishop.findValidMoves(boardState);

		if(this.check2Piece(boardState, bishopMoves, oppBishop, oppQueen)){
			return true;
		}

		let rook = new Rook(x, y, player);
		let rookMoves = rook.findValidMoves(boardState);

		if(this.check2Piece(boardState, rookMoves, oppRook, oppQueen)){
			return true;
		}

		let knight = new Knight(x, y, player);
		let knightMoves = knight.findValidMoves(boardState);

		if(this.check1Piece(boardState, knightMoves, oppKnight)){
			return true;
		}
		
		let kingMoves = this.findValidMoves(boardState);

		if(this.check1Piece(boardState, kingMoves, oppKing)){
			return true;
		}

		let pawn = new Pawn(x, y, player);
		let pawnMoves = pawn.oppTakeMoves(boardState);
		

		if(this.check1Piece(boardState, pawnMoves, oppPawn)){
			return true;
		}


		return false;
		
	}


	
	check1Piece(boardState, path, opp1){
		//path is an array of Move objects
		let x;
		let y;
		
		for(let i = 0; i < path.length; i++){
			 x = path[i].getX();
			 y = path[i].getY();
			 
			if( boardState[x][y] === opp1){
				return true;
			}
		}
		return false;
	}

	check2Piece(boardState, path, opp1, opp2){
		//path is an array of Move objects
		let x;
		let y;

		for(let i = 0; i < path.length; i++){
			x = path[i].getX();
			y = path[i].getY();

			if( boardState[x][y] === opp1 || boardState[x][y] === opp2){
				return true;
			}
		}
		return false;
	}


	checkKingMove(boardState, newX, newY){
		//used for castles
		//moving king in general
		let inCheck = false;
		//get the king piece
		let c = boardState[this.x][this.y];
		boardState[this.x][this.y] = '##';

		let take = boardState[newX][newY];

		this.moveKing(newX, newY);

		if(this.otherKing === true){
			//console.log("Inside Other King");
			if(this.oppCheck(boardState)){
				inCheck = true;
			}
		}

		else{
			//console.log("Inside My King");
			if(this.check(boardState)){
				inCheck = true;
			}
		}
		//set board back to normal
		boardState[this.x][this.y] = take;
		this.undoMove();
		boardState[this.x][this.y] = c;

		return inCheck;

	}

	checkMove(boardState, oldX, oldY, newX, newY){
		//moving a piece not king

		let safePiece;
		let safeTake;
		let inCheck = false;
		//save the piece
		safePiece = boardState[oldX][oldY];
		//set old location to empty
		boardState[oldX][oldY] = "##";

		//save the new location:
		safeTake = boardState[newX][newY];
		//set piece to new location
		boardState[newX][newY] = safePiece;

		if(this.otherKing === true){
			//console.log("Inside Other King");
			if(this.oppCheck(boardState)){
				inCheck = true;
			}
		}
		else{
			if(this.check(boardState)){
				inCheck = true;
			}
		}

		//restore boardState
		boardState[newX][newY] = safeTake;
		boardState[oldX][oldY] = safePiece;

		return inCheck;
	}

	loadKingMoves(arrayOfMoves, boardState){

		//returns true if all moves are valid
		for(let i = 0; i < arrayOfMoves.length; i++){
			if(this.checkKingMove(boardState, arrayOfMoves[i].getX(), arrayOfMoves[i].getY())){
				return false;
			}
		}

		return true;
	}







}