class Board{

	constructor(mySide, oppSide){
		this.mySide = mySide;
		this.oppSide = oppSide;
		this.myKing;
		this.oppKing;
		this.boardState;
		this.savedBoardState;
		this.enPassant;
		this.myCastle;
		this.oppCastle;

		this.setUpBoard(mySide, oppSide);

		this.currentMove = 0;
		this.lastStateChange = 0;
		this.stateChangeMoves = [];
		this.nextToken = null;

		this.savedState = {
			savedStates : [],
			savedMoveNumber : 0,
			savedToken : null,
			myCastleKingStatus: null,
			myCastleLeftRook: null,
			myCastleRightRook: null,
			oppCastleKingStatus: null,
			oppCastleLeftRook: null,
			oppCastleRightRook: null,
			stateSaved : false,
			myKingStats : null,
			oppKingStats: null
		};
	}

	getMySide(){
		return this.mySide;
	}

	getOppSide(){
		return this.oppSide;
	}

	getMyKing(){
		return this.myKing;
	}

	getOppKing(){
		return this.oppKing;
	}

	getEnpassant(){
		return this.enPassant;
	}

	setBoardStateW(){

		for(let j = 0; j < 8; j++){
			this.boardState[1][j] = "bp";
		} 

		this.boardState[0][0] = "bR";
		this.boardState[0][1] = "bN";
		this.boardState[0][2] = "bB";
		this.boardState[0][3] = "bQ";
		this.boardState[0][4] = "bK";
		this.boardState[0][5] = "bB";
		this.boardState[0][6] = "bN";
		this.boardState[0][7] = "bR";

		for(let j = 0; j < 8; j++){
			this.boardState[6][j] = "wp";
		}
	
		this.boardState[7][0] = "wR";
		this.boardState[7][1] = "wN";
		this.boardState[7][2] = "wB";
		this.boardState[7][3] = "wQ";
		this.boardState[7][4] = "wK";
		this.boardState[7][5] = "wB";
		this.boardState[7][6] = "wN";
		this.boardState[7][7] = "wR";

		for(let i = 2; i < 6; i++){
			for(let j = 0; j < 8; j++){
				this.boardState[i][j] = "##";
			}
		}
	}

	setBoardStateB(){

		this.boardState[0][0] = "wR";
		this.boardState[0][1] = "wN";
		this.boardState[0][2] = "wB";
		this.boardState[0][3] = "wK";
		this.boardState[0][4] = "wQ";
		this.boardState[0][5] = "wB";
		this.boardState[0][6] = "wN";
		this.boardState[0][7] = "wR";

		for(let i = 0; i < 8; i++){
			this.boardState[1][i] = "wp";
		}

		this.boardState[7][0] = "bR";
		this.boardState[7][1] = "bN";
		this.boardState[7][2] = "bB";
		this.boardState[7][3] = "bK";
		this.boardState[7][4] = "bQ";
		this.boardState[7][5] = "bB";
		this.boardState[7][6] = "bN";
		this.boardState[7][7] = "bR";

		for(let i = 0; i < 8; i++){
			this.boardState[6][i] = "bp";
		}
	
	
		for (let i = 2; i < 6; i++){
			for(let j = 0; j < 8; j++){
				this.boardState[i][j] = "##";
			}
		}
	}


	setUpBoard(mySide){

		this.boardState = new Array(8);
		this.savedBoardState = new Array(8);
		this.enPassant = new Enpassant();

		for(let k = 0; k < 8; k++){
			this.boardState[k] = new Array(8);
		}

		for(let k = 0; k < 8; k++){
			this.savedBoardState[k] = new Array(8);
		}

		if(mySide === "w"){
			this.myKing = new King(7, 4, 'w');
			this.oppKing = new King(0, 4, 'b');
			this.myCastle = new Castle(7, 0, 7, 7, 1);
			this.oppCastle = new Castle(0, 0, 0, 7, 1);
			this.setBoardStateW();
		}
		else if(mySide === "b"){
			this.myKing = new King(7, 3, 'b');
			this.oppKing = new King(0, 3, 'w');
			this.myCastle = new Castle(7, 0, 7, 7, 2);
			this.oppCastle = new Castle(0, 0, 0, 7, 2);		
			this.setBoardStateB();
		}

		this.oppKing.setOtherKing();
	}

	turnOffCastling(){
		this.myCastle.setKingStatus(false);
		this.oppCastle.setKingStatus(false);
	}

	getBoardStateToken(){

		let savedState = {
			boardLayout: null,
			myRightCastle: null,
			myLeftCastle: null,
			oppRightCastle: null,
			oppLeftCastle: null,
			enpassantX: -1,
			enpassantY: -1			
		}

		savedState.boardLayout = new Array(8);
		for(let i = 0; i < 8; i++){
			savedState.boardLayout[i] = new Array(8);
		}

		for(let i = 0; i < 8; i++){
			for(let j = 0; j < 8; j++){
				savedState.boardLayout[i][j] = this.boardState[i][j];
			}
		}

		savedState.myRightCastle = this.myCastle.getRightRook();
		savedState.myLeftCastle = this.myCastle.getLeftRook();

		if(this.myCastle.getKingStatus() === false){
			savedState.myRightCastle = false;
			savedState.myLeftCastle = false;
		}

		savedState.oppRightCastle = this.oppCastle.getRightRook();
		savedState.oppLeftCastle = this.oppCastle.getLeftRook();

		if(this.oppCastle.getKingStatus() === false){
			savedState.oppRightCastle = false;
			savedState.oppLeftCastle = false;
		}

		if(this.enPassant.getENX() !== -1 && this.enPassant.getENY() !== -1){
			if(this.checkAvailiableEnpassantMove()){
				savedState.enpassantX = this.enPassant.getENX();
				savedState.enpassantY = this.enPassant.getENY();	
			}
		}


		return savedState;

	}

	checkAvailiableEnpassantMove(){

		let pawnX = this.enPassant.getPawnX();
		let pawnY = this.enPassant.getPawnY();

		let opposingPawn = this.boardState[pawnX][pawnY];
	
		let pawnsToConsider = [];
		let pawnsToConsiderCount = 0;

		let mySidePawn = null;
		if(opposingPawn.charAt(0) === 'w'){
			mySidePawn = 'bp';
		}
		else{
			mySidePawn = 'wp';
		}

		for(let i = 0; i < 8; i++){
			if(this.boardState[pawnX][i] === mySidePawn && this.enPassant.pawnParallel(pawnX, i)){
				pawnsToConsider.push(pawnX);
				pawnsToConsider.push(i);
				pawnsToConsiderCount++;
			}
		}

		if(pawnsToConsiderCount > 0){
			let index = 0;
			while(pawnsToConsiderCount > 0){
				if(this.checkEnpassantMove(pawnsToConsider[index], pawnsToConsider[index + 1], mySidePawn.charAt(0))){
					return true;
				}
				pawnsToConsiderCount--;
				index = index + 2;
			}

			console.log("Good Pawns: " + pawnsToConsiderCount);
		}

		return false;
	}

	checkEnpassantMove(x, y, side){

		console.log("Pawn X: " + x);
		console.log("Pawn Y: " + y);
		console.log("Side: " + side);

		let copiedBoard = new Array(8);
		for(let i = 0; i < 8; i++){
			copiedBoard[i] = new Array(8);
		}

		for(let i = 0; i < 8; i++){
			for(let j = 0; j < 8; j++){
				copiedBoard[i][j] = this.boardState[i][j];
			}
		}

		copiedBoard[this.enPassant.getPawnX()][this.enPassant.getPawnY()] = "##";
		copiedBoard[this.enPassant.getENX()][this.enPassant.getENY()] = side + 'p';
		copiedBoard[x][y] = '##';

		//now I need a new king, or do I?
		//I'll use another king to keep it simple

		let tempKing = null;

		if(side === this.mySide){

			tempKing = new King(this.myKing.getX(), this.myKing.getY(), side);
		}
		else{
			tempKing = new King(this.oppKing.getX(), this.oppKing.getY(), side);
		}

		if(tempKing.check(copiedBoard) === false){
			return true;
		}

		return false;

	}

	saveBoard(){
		for(let i = 0; i < 8; i++){
			for(let j = 0; j < 8; j++){
				this.savedBoardState[i][j] = this.boardState[i][j];
			}
		}

		this.savedState.stateSaved = true;
		this.savedState.savedToken = this.nextToken;
		this.savedState.savedMoveNumber = this.currentMove;

		console.log("This is the state of state changed moves: ");
		console.log(this.stateChangeMoves);

		for(let i = 0; i < this.stateChangeMoves.length; i++){
			this.savedState.savedStates.push(this.stateChangeMoves[i]);
		}

		this.savedState.myCastleKingStatus = this.myCastle.getKingStatus();
		this.savedState.myCastleLeftRook = this.myCastle.getLeftRook();
		this.savedState.myCastleRightRook = this.myCastle.getRightRook();

		this.savedState.oppCastleKingStatus = this.oppCastle.getKingStatus();
		this.savedState.oppCastleLeftRook = this.oppCastle.getLeftRook();
		this.savedState.oppCastleRightRook = this.oppCastle.getRightRook();

		let myKingToken = {
			x : this.myKing.getX(),
			y : this.myKing.getY(),
			previousX : this.myKing.getPreviousX(),
			previousY : this.myKing.getPreviousY(),
			initialMoveStatus : this.myCastle.getKingStatus()
		};

		let oppKingToken = {
			x : this.oppKing.getX(),
			y : this.oppKing.getY(),
			previousX : this.oppKing.getPreviousX(),
			previousY : this.oppKing.getPreviousY(),
			initialMoveStatus : this.myCastle.getKingStatus()
		};


		this.savedState.myKingStats = myKingToken;
		this.savedState.oppKingStats = oppKingToken;

		/*
		console.log("Look here: ");
		console.log(this.savedState.savedStates);
		console.log(this.savedState.savedToken);
		console.log(this.savedState.savedMoveNumber);
		*/

	}

	useSaveBoard(){


		if(this.savedState.stateSaved){

			for(let i = 0; i < 8; i++){
				for(let j = 0; j < 8; j++){
					this.boardState[i][j] = this.savedBoardState[i][j];
				}
			}

			this.nextToken = this.savedState.savedToken;
			this.currentMove = this.savedState.savedMoveNumber;

			if(this.nextToken !== null){
				if(this.nextToken.type === "enpassant"){
					this.resetEnpassant(this.nextToken);
				}
			}
			else{
				this.enPassant = new Enpassant();
			}

			this.myCastle.setKingStatus(this.savedState.myCastleKingStatus);
			this.myCastle.setLeftRook(this.savedState.myCastleLeftRook);
			this.myCastle.setRightRook(this.savedState.myCastleRightRook);

			this.oppCastle.setKingStatus(this.savedState.oppCastleKingStatus);
			this.oppCastle.setLeftRook(this.savedState.oppCastleLeftRook);
			this.oppCastle.setRightRook(this.savedState.oppCastleRightRook);

			this.myKing.moveKing(this.savedState.myKingStats.x, this.savedState.myKingStats.y);
			this.myKing.setPreviousX(this.savedState.myKingStats.previousX);
			this.myKing.setPreviousY(this.savedState.myKingStats.previousY);
			this.myCastle.setKingStatus(this.savedState.myKingStats.initialMoveStatus);

			this.oppKing.moveKing(this.savedState.oppKingStats.x, this.savedState.oppKingStats.y);
			this.oppKing.setPreviousX(this.savedState.oppKingStats.previousX);
			this.oppKing.setPreviousY(this.savedState.oppKingStats.previousY);
			this.oppCastle.setKingStatus(this.savedState.oppKingStats.initialMoveStatus);


			this.stateChangeMoves.splice(0, this.stateChangeMoves.length);


			for(let i = 0; i < this.savedState.savedStates.length; i++){
				this.stateChangeMoves.push(this.savedState.savedStates[i]);
			}

			if(this.stateChangeMoves.length > 0){
				this.lastStateChange = this.stateChangeMoves[this.stateChangeMoves.length - 1].moveNumber;
			}
			else{
				this.lastStateChange = 0;
			}


			this.savedState.stateSaved = false;
			this.savedState.savedStates.splice(0, this.savedState.savedStates.length);
			this.savedState.saveToken = null;
			this.savedState.savedMoveNumber = 0;

			this.savedState.myCastleKingStatus = null;
			this.savedState.myCastleLeftRook = null;
			this.savedState.myCastleRightRook = null;

			this.savedState.oppCastleKingStatus = null;
			this.savedState.oppCastleLeftRook = null;
			this.savedState.oppCastleRightRook = null;

			this.savedState.myKingStats = null;
			this.savedState.oppKingStats = null;

		}
	}

	getBoardState(){
		return this.boardState;
	}

	getSavedBoardState(){
		return this.savedBoardState;
	}

	handlePawnEnpassant(oldX, oldY, newX, newY, movedPiece){

		//need to handle the possibility of either player performing an enpassant
		if(movedPiece.charAt(1) !== "p"){
			return false;
		}

		//I moved my pawn
		if(movedPiece === this.mySide + "p"){
			//either this pawn is succeptible to enpassant at this point or it is not
			//this.enPassant.checkMyPawn(this.boardState, oldX, oldY, newX, newY);

			if(this.enPassant.enTake(this.boardState, newX, newY)){
				return true;
			}
			else{
				return false;
			}

		}
		else if(movedPiece === this.oppSide + "p"){

			//this.enPassant.checkPawn(this.boardState, oldX, oldY, newX, newY);

			if(this.enPassant.enTake(this.boardState, newX, newY)){
				return true;
			}
			else{
				return false;
			}
		}

		return false;

	}

	handlePawnPromotion(movedPiece, newX){

		if(movedPiece.charAt(1) !== 'p'){
			return false;
		}

		if(movedPiece.charAt(0) === this.mySide){
			if(newX === 0){
				return true;
			}
		}
		else if(movedPiece.charAt(0) === this.oppSide){
			if(newX === 7){
				return true;
			}
		}

		return false;
	}

	handleRookMove(movedPiece, oldX, oldY){

		if(movedPiece.charAt(1) !== 'R'){
			return;
		}

		if(movedPiece.charAt(0) === this.mySide){
			this.myCastle.checkRookMove(oldX, oldY);
		}
		else if(movedPiece.charAt(0) === this.oppSide){
			this.oppCastle.checkRookMove(oldX, oldY);
		}
	}

	handleCastle(movedPiece, oldX, oldY, newX, newY){

		console.log("Inside handle castle");

		let castleSuccess = false;
		let rookX;
		let oldRookY;
		let newRookY;

		let castleMove = {
			rookX: -1,
			oldRookY: -1,
			newRookY: -1,
			success: false
		};

		if(movedPiece.charAt(0) === this.mySide){

			rookX = 7;

			if(this.myCastle.castleLeft(newX, newY)){
			
				oldRookY = 0;

				if(this.mySide === "w"){
					newRookY = 3;
				}
				else if(this.mySide === "b"){
					newRookY = 2;
				}

				castleSuccess = true;
			}
			else if(this.myCastle.castleRight(newX, newY)){
				
				oldRookY = 7;

				if(this.mySide === "w"){
					newRookY = 5;
				}
				else if(this.mySide === "b"){
					newRookY = 4;
				}

				castleSuccess = true;
			}

		}

		else if(movedPiece.charAt(0) === this.oppSide){

			rookX = 0;

			if(this.oppCastle.castleLeft(newX, newY)){
			
				oldRookY = 0;

				if(this.mySide === "w"){
					newRookY = 3;
				}
				else if(this.mySide === "b"){
					newRookY = 2;
				}

				castleSuccess = true;
			}
			else if(this.oppCastle.castleRight(newX, newY)){
				
				oldRookY = 7;

				if(this.mySide === "w"){
					newRookY = 5;
				}
				else if(this.mySide === "b"){
					newRookY = 4;
				}

				castleSuccess = true;
			}


		}

		if(castleSuccess){
			//get the rook to be moved
			//let c = boardState[rookX][oldRookY];

			//empty the rook spot
			//boardState[rookX][oldRookY] = '##';

			//move the rook
			//boardState[rookX][newRookY] = c;
			this.castleMove(oldX, oldY, newX, newY, rookX, oldRookY, newRookY);
			castleMove.oldRookY = oldRookY;
			castleMove.newRookY = newRookY;
			castleMove.success = true;
		}

		return castleMove;

	}


	updateBoardState(oldX, oldY, newX, newY){

		let returnMove = new saveMove();
		returnMove.addMove(oldX);
		returnMove.addMove(oldY);
		returnMove.addMove(newX);
		returnMove.addMove(newY);

		let movedPiece = this.boardState[oldX][oldY];

		if(movedPiece.charAt(1) === "p"){
			if(this.enPassant.preEnTake(this.boardState, oldX, oldY, newX, newY)){
				returnMove.addMove(this.enPassant.getPawnX());
				returnMove.addMove(this.enPassant.getPawnY());
				returnMove.setBackendRemovedPiece(this.getPiece(this.enPassant.getPawnX(), this.enPassant.getPawnY()));
				this.enpassantMove(oldX, oldY, newX, newY, this.enPassant.getPawnX(), this.enPassant.getPawnY());
				returnMove.setMoveType("enpassant");
				return returnMove;
			}
			//if not enpassant need to handle possible pawn promotion
			if(this.handlePawnPromotion(movedPiece, newX)){
				returnMove.setBackendRemovedPiece(this.getPiece(newX, newY));
				returnMove.setExtraBackendRemovedPiece(this.getPiece(oldX, oldY));
				returnMove.setMoveType("promotion");
				return returnMove;
			}
		}


		if(movedPiece.charAt(1) === "K"){
			let castleMove = this.handleCastle(movedPiece, oldX, oldY, newX, newY);
			if(castleMove.success){
				returnMove.addMove(castleMove.oldRookY);
				returnMove.addMove(castleMove.newRookY);
				returnMove.setMoveType("castle");
				return returnMove;
			}
			console.log("Not a castle");
		}

		returnMove.setBackendRemovedPiece(this.getPiece(newX, newY));
		this.regularMove(oldX, oldY, newX, newY);
		returnMove.setMoveType("regular");
		return returnMove;
		
	}



	enpassantMove(oldX, oldY, newX, newY, removeX, removeY){

		if(this.nextToken !== null){
			this.stateChangeMoves.push(this.nextToken);
			this.nextToken = null;
			this.lastStateChange = this.currentMove;
		}
		
		this.boardState[newX][newY] = this.boardState[oldX][oldY];
		this.boardState[oldX][oldY] = "##";
		this.boardState[removeX][removeY] = "##";

		this.enPassant.reset();
		this.incrementCount();
	}

	castleMove(oldX, oldY, newX, newY, rookX, oldRookY, newRookY){


		if(this.nextToken !== null){
			this.stateChangeMoves.push(this.nextToken);
			this.nextToken = null;
			this.lastStateChange = this.currentMove;
		}
	
		this.boardState[newX][newY] = this.boardState[oldX][oldY];
		this.boardState[oldX][oldY] = "##";
		this.boardState[rookX][newRookY] = this.boardState[rookX][oldRookY];
		this.boardState[rookX][oldRookY] = "##";

		if(this.boardState[newX][newY].charAt(0) === this.mySide){
			this.preserveKingMove(this.mySide, this.myCastle.getKingStatus());
			this.myCastle.setKingMove();
			this.myKing.moveKing(newX, newY);
		}
		else if(this.boardState[newX][newY].charAt(0) === this.oppSide){
			this.preserveKingMove(this.oppSide, this.oppCastle.getKingStatus());
			this.oppCastle.setKingMove();	
			this.oppKing.moveKing(newX, newY);
		}

		this.enPassant.reset();
		this.incrementCount();

	}

	pawnPromoteMove(promotionPiece, oldX, oldY, newX, newY){

		if(this.nextToken !== null){
			this.stateChangeMoves.push(this.nextToken);
			this.nextToken = null;
			this.lastStateChange = this.currentMove;
		}

		this.boardState[newX][newY] = promotionPiece;
		this.boardState[oldX][oldY] = "##";

		this.enPassant.reset();
		this.incrementCount();
	}

	regularMove(oldX, oldY,  newX, newY){

		if(this.nextToken !== null){
			this.stateChangeMoves.push(this.nextToken);
			this.nextToken = null;
			this.lastStateChange = this.currentMove;
		}

		let playerSide = this.boardState[oldX][oldY].charAt(0);

		if(playerSide === this.mySide){
		
			if(this.myKing.selected(oldX, oldY)){
				this.preserveKingMove(this.mySide, this.myCastle.getKingStatus());
				this.myKing.moveKing(newX, newY);
				if(this.myCastle.getKingStatus()){
					this.myCastle.setKingMove();
				}
				this.enPassant.reset();		
			}

			else if(this.boardState[oldX][oldY] === this.mySide + "R"){
				let rookMoved = this.myCastle.checkRookMove(oldX, oldY);
				if(rookMoved === 1){
					this.preserveRookMove(this.mySide, "left");
				}
				else if(rookMoved === 2){
					this.preserveRookMove(this.mySide, "right");
				}
				this.enPassant.reset();
			}

			
			else if(this.enPassant.checkMyPawn(this.boardState, oldX, oldY, newX, newY)){
				//console.log("My Pawn Succeptible");
				this.nextToken = this.preserveEnpassant();
			}

		}
		else if(playerSide === this.oppSide){

			if(this.oppKing.selected(oldX, oldY)){
				this.preserveKingMove(this.oppSide, this.oppCastle.getKingStatus());
				this.oppKing.moveKing(newX, newY);
				if(this.oppCastle.getKingStatus()){
					this.oppCastle.setKingMove();
				}
				this.enPassant.reset();
			}

			else if(this.boardState[oldX][oldY] === this.oppSide + "R"){
				let rookMoved = this.oppCastle.checkRookMove(oldX, oldY);
				if(rookMoved === 1){
					this.preserveRookMove(this.oppSide, "left");
				}
				else if(rookMoved === 2){
					this.preserveRookMove(this.oppSide, "right");
				}
				this.enPassant.reset();
			}
			
			else if(this.enPassant.checkPawn(this.boardState, oldX, oldY, newX, newY)){
				//console.log("Opponent Pawn Succeptible");
				this.nextToken = this.preserveEnpassant();
			}
			
		}

		this.boardState[newX][newY] = this.boardState[oldX][oldY];
		this.boardState[oldX][oldY] = "##";	

		this.incrementCount();
	}

	removePiece(x, y){
		let c = this.boardState[x][y];
		this.boardState[x][y] = "##";
		return c;
	}

	insertPiece(piece, x, y){
		this.boardState[x][y] = piece;
	}

	getPiece(x, y){
		return this.boardState[x][y];
	}


	printBoardState(){
		for(let i = 0; i < 8; i++){
			for(let j = 0; j < 8; j++){
				console.log(this.boardState[i][j] + " ");
			}
			console.log("\n");	
		}
	}

	getCurrentMove(){
		return this.currentMove;
	}

	incrementCount(){
		this.currentMove++;
	}

	decrementCount(){
		if(this.nextToken !== null){
			this.nextToken = null;
		}

		this.enPassant.reset();

		if(this.currentMove === 0){
			return;
		}

		this.currentMove--;
		this.checkStateChange();



	}


//Preserving State Methods
	preserveKingMove(playerSide, initialMoveStatus){
		let data;
		if(playerSide === this.mySide){
			data = {
				type: "kingMove",
				moveNumber: this.currentMove,
				x: this.myKing.getX(),
				y: this.myKing.getY(),
				previousX: this.myKing.getPreviousX(),
				previousY: this.myKing.getPreviousY(),
				side: this.mySide,
				initialMove: initialMoveStatus
			};
		}
		else{
			data = {
				type: "kingMove",
				moveNumber: this.currentMove,
				x: this.oppKing.getX(),
				y: this.oppKing.getY(),
				previousX: this.oppKing.getPreviousX(),
				previousY: this.oppKing.getPreviousY(),
				side: this.oppSide,
				initialMove: initialMoveStatus
			};
		}

		//return data;
		//console.log("Initial Move Status: " + initialMoveStatus);
		this.stateChangeMoves.push(data);
		this.lastStateChange = this.currentMove;
	}

	preserveRookMove(playerSide, rookSide){
		//console.log("Preserving Rook Move");
		//console.log("Current Rook Preserver Move: " + this.currentMove);
		let data = {
			type: "rookMove",
			moveNumber: this.currentMove,
			player: playerSide,
			rook: rookSide
		};

		//return data;
		this.stateChangeMoves.push(data);
		this.lastStateChange = this.currentMove;
	}

	preserveEnpassant(){
		let data = {
			type: "enpassant",
			moveNumber: this.currentMove + 1,
			status: this.enPassant.getStatus(),
			pawnX: this.enPassant.getPawnX(),
			pawnY: this.enPassant.getPawnY(),
			enX: this.enPassant.getENX(),
			enY: this.enPassant.getENY()
		};
		return data;
		//this.stateChangeMoves.push(data);
		//this.lastStateChange = this.currentMove + 1;
	}
//End Preserving State Methods

//Reseting State Methods

	resetEnpassant(token){
		this.enPassant.setStatus(token.status);
		this.enPassant.setPawnX(token.pawnX);
		this.enPassant.setPawnY(token.pawnY);
		this.enPassant.setENX(token.enX);
		this.enPassant.setENY(token.enY);
		//console.log("Enpassant Reset:");
		//console.log("Status " + token.status);
		//console.log("X Position: " + token.pawnX);
		//console.log("Y Position: " + token.pawnY);
		//console.log("X Take " + token.enX);
		//console.log("Y Take " + token.enY);
	}

	resetRookMove(token){
		if(token.player === this.mySide){
			if(token.rook === "left"){
				this.myCastle.setLeftRook(true);
				//console.log("My Left Rook Reset");
			}
			else if(token.rook === "right"){
				this.myCastle.setRightRook(true);
				//console.log("My Right Rook Reset");
			}
		}
		else if(token.player === this.oppSide){
			if(token.rook === "left"){
				this.oppCastle.setLeftRook(true);
				//console.log("Opp Left Rook Reset");
			}
			else if(token.rook === "right"){
				this.oppCastle.setRightRook(true);
				//console.log("Opp Right Rook Reset");
			}
		}
	}

	resetKingMove(kingToken){
		if(kingToken.side === this.mySide){
			this.myKing.moveKing(kingToken.x, kingToken.y);
			this.myKing.setPreviousX(kingToken.previousX);
			this.myKing.setPreviousY(kingToken.previousY);
			if(kingToken.initialMove){
				this.myCastle.resetKingMove();
			}

		}
		else if(kingToken.side === this.oppSide){
			this.oppKing.moveKing(kingToken.x, kingToken.y);
			this.oppKing.setPreviousX(kingToken.previousX);
			this.oppKing.setPreviousY(kingToken.previousY);
			if(kingToken.initialMove){
				this.oppCastle.resetKingMove();
			}
		}

		//console.log("Side: " + kingToken.side);
		//console.log("King X: " + kingToken.x);
		//console.log("King Y: " + kingToken.y);
		//console.log("Previous X: " + kingToken.previousX);
		//console.log("Previous Y: " + kingToken.previousY);
	}

//End Reseting State Methods

	checkStateChange(){
		if(this.stateChangeMoves.length === 0){
			console.log("Current Move: " + this.currentMove);
			console.log("Nothing to reset");
			return;
		}

		console.log("Current Move: " + this.currentMove);
		//console.log("Last State Change Recorded: " + this.lastStateChange);


		let secondPop = this.popStateChangeToken();
		if(secondPop){
			//console.log("Second Token Same Move");
			this.popStateChangeToken();
		}

	}

	popStateChangeToken(){

		if(this.currentMove !== this.lastStateChange){
			return false;
		}

		if(this.currentMove === this.lastStateChange){

			let token = this.stateChangeMoves.pop();

			if(token.type === "enpassant"){
				this.resetEnpassant(token);
				this.nextToken = token;
			}
			else if(token.type === "rookMove"){
				this.resetRookMove(token);
			}
			else if(token.type === "kingMove"){
				this.resetKingMove(token);
			}


		}

		if(this.stateChangeMoves.length === 0){
			this.lastStateChange = 0;
			return false;
		}
		else{
			let nextToken = this.stateChangeMoves.pop();
			this.lastStateChange = nextToken.moveNumber;
			this.stateChangeMoves.push(nextToken);
		}

		return true;
	}


	getAvailiableMoves(xVal, yVal){

		let moves = [];
		let piece = this.getPiece(xVal, yVal);
		let player = piece.charAt(0);
		let pieceType = piece.charAt(1);
	
		if(pieceType === "p"){
			let pawn = new Pawn(xVal, yVal, player);
			if(player === this.mySide){
				return pawn.findAllMoves(this.boardState, this.myKing, this.enPassant);
			}
			else{
				return pawn.findAllOppMoves(this.boardState, this.oppKing, this.enPassant);
			}	
		}

		if(pieceType === "B"){
			let bishop = new Bishop(xVal, yVal, player);
			if(player === this.mySide){
				return bishop.findAllMoves(this.boardState, this.myKing);
			}
			else{
				return bishop.findAllMoves(this.boardState, this.oppKing);
			}
		}

		if(pieceType === "R"){
			let rook = new Rook(xVal, yVal, player);
			if(player === this.mySide){
				return rook.findAllMoves(this.boardState, this.myKing);
			}
			else{
				return rook.findAllMoves(this.boardState, this.oppKing);
			}
		}

		if(pieceType === "N"){
			let knight = new Knight(xVal, yVal, player);
			if(player === this.mySide){
				return knight.findAllMoves(this.boardState, this.myKing);
			}
			else{
				return knight.findAllMoves(this.boardState, this.oppKing);
			}
		}

		if(pieceType === "Q"){
			let queen = new Queen(xVal, yVal, player);
			if(player === this.mySide){
				return queen.findAllMoves(this.boardState, this.myKing);
			}
			else{
				return queen.findAllMoves(this.boardState, this.oppKing)
			}
		}

		if(pieceType === "K"){

			let king = new King(xVal, yVal, player);
			let kingMoves = [];

			if(player === this.mySide){
				kingMoves = king.findAllMoves(this.boardState, this.myKing);


				if(this.myKing.check(this.boardState) !== true){
					//check left castle
					if(this.myCastle.getLeftStatus(this.boardState, xVal, yVal)){
						if(this.myKing.loadKingMoves(this.myCastle.getLeftPath(), this.boardState)){
							kingMoves.push(this.myCastle.getLeftCastle());
						}
					}

					//want to see if we can add right castle move:
					if(this.myCastle.getRightStatus(this.boardState, xVal, yVal)){
						if(this.myKing.loadKingMoves(this.myCastle.getRightPath(), this.boardState)){
							kingMoves.push(this.myCastle.getRightCastle());
						}
					}
				}

			}
			else{
				//console.log("Opponent king making move");
				kingMoves = king.findAllMoves(this.boardState, this.oppKing);

				if(this.oppKing.oppCheck(this.boardState) !== true){
					//check left castle
					if(this.oppCastle.getLeftStatus(this.boardState, xVal, yVal)){		
						if(this.oppKing.loadKingMoves(this.oppCastle.getLeftPath(), this.boardState)){
							kingMoves.push(this.oppCastle.getLeftCastle());
						}
					}

					//want to see if we can add right castle move:
					if(this.oppCastle.getRightStatus(this.boardState, xVal, yVal)){
						if(this.oppKing.loadKingMoves(this.oppCastle.getRightPath(), this.boardState)){
							kingMoves.push(this.oppCastle.getRightCastle());
						}
					}

				}
			}

			return kingMoves;
		}

		return moves;
	}


	kingCheck(){
	
		let checkStatus = {
			checkX: -1,
			checkY: -1,
			side: null,
			inCheck: false,
			checkmate: false
		};

		if(this.myKing.check(this.boardState)){
			checkStatus.checkX = this.myKing.getX();
			checkStatus.checkY = this.myKing.getY();

			//console.log("This is king X: " + this.myKing.getX());
			//console.log("This is king y: " + this.myKing.getY());
			checkStatus.side = this.mySide;
			checkStatus.inCheck = true;
			if(this.checkmate(this.mySide)){
				checkStatus.checkmate = true;
			}
		}
		else if(this.oppKing.oppCheck(this.boardState)){
			checkStatus.checkX = this.oppKing.getX();
			checkStatus.checkY = this.oppKing.getY();
			checkStatus.side = this.oppSide;
			checkStatus.inCheck = true;
			if(this.checkmate(this.oppSide)){
				checkStatus.checkmate = true;
			}
		}

		return checkStatus;
	}

	checkmate(player){

		for(let i = 0; i < 8; i++){

			for(let j = 0; j < 8; j++){

				if(this.boardState[i][j].charAt(0) === player){

					let moves = this.getAvailiableMoves(i, j);
				
					for(let k = 0; k < moves.length; k++){

						if(moves[k].getInCheck() !== true){
							return false;
						}
					}
				
				}
			}
		}

		//console.log("In Checkmate");

		this.printBoardState();

		return true;
	}

	stalemate(player){

		for(let i = 0; i < 8; i++){

			for(let j = 0; j < 8; j++){

				if(this.boardState[i][j].charAt(0) === player){

					let moves = this.getAvailiableMoves(i, j);

					for(let k = 0; k < moves.length; k++){

						if(moves[k].getInCheck() !== true){
							return false;
						}

					}
				
				}
			}
		}

		//console.log("In Stalemate");
		return true;
	}

	kingOfTheHill(player){
		let piece = player + "K";

		if(this.getPiece(4, 4) === piece){
			return true;
		}
		else if(this.getPiece(4, 3) === piece){
			return true;
		}
		else if(this.getPiece(3, 4) === piece){
			return true;
		}
		else if(this.getPiece(3, 3) === piece){
			return true;
		}

		return false;
	}


}

