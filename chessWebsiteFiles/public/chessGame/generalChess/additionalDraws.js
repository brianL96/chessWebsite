
class replayNode{

	/*
	constructor(fiftyValue){
		this.fiftyValue = fiftyValue;
	}
	*/

	constructor(){
		this.fiftyValue = 0;
		this.stateToken = null;
	}

	setFiftyValue(fiftyValue){
		this.fiftyValue = fiftyValue;
	}

	setStateToken(stateToken){
		this.stateToken = stateToken;
	}

	getFiftyValue(){
		return this.fiftyValue;
	}

	getStateToken(){
		return this.stateToken;
	}


}



class drawChecker{

	constructor(side, opponent){
		this.side = side;
		this.opponent = opponent;
		this.maxNumberOfBoards = 15;
		this.boardsToCheck = [];
		this.counter = 0;
		this.replayNodes = [];
		this.editReplayNodes = [];

	}

	clearOldStates(){
		this.boardsToCheck.splice(0, this.boardsToCheck.length);
	}


	checkThreeFoldRepetition(stateToken){

		let length = this.boardsToCheck.length;
		let count = 0;
		let matchIndexes = [];

		for(let i = 0; i < length; i++ ){
			if(this.compareTwoStates(this.boardsToCheck[i], stateToken)){
				count++;
				matchIndexes.push(i);
			}
		}

		//now need to add this new state token
		if(length >= this.maxNumberOfBoards && length > 0){
			this.boardsToCheck.shift();
		}

		this.boardsToCheck.push(stateToken);

		//position must be encountered 3 times
		//so if there are two equal states found in boardsToCheck (previous states)
		//then this is the 3rd repetition
		if(count >= 2){
			console.log(this.boardsToCheck);
			console.log(matchIndexes);
			console.log(stateToken.boardLayout);
			return true;
		}

		return false;
	}

	replayCheckThreeFoldRepetition(edited){

		let maxCheck = this.maxNumberOfBoards - 1;
		let count = 0;
		let node = null;
		let index = 0;

		if(edited === false){
			if(this.replayNodes.length === 0){
				return false;
			}
			node = this.replayNodes.pop();
			index = this.replayNodes.length - 1;
			while(maxCheck > 0 && index >= 0){
				if(this.compareTwoStates(this.replayNodes[index].getStateToken(), node.getStateToken())){
					count++;
				}
				maxCheck--;
				index--;
			}
			this.replayNodes.push(node);
			
		}
		else{
			if(this.editReplayNodes.length === 0){
				return false;
			}
			node = this.editReplayNodes.pop();
			index = this.editReplayNodes.length - 1;
	
			while(maxCheck > 0 && index >= 0){
				if(this.compareTwoStates(this.editReplayNodes[index].getStateToken(), node.getStateToken())){
					count++;
				}
				maxCheck--;
				index--;
			}
			this.editReplayNodes.push(node);
		}

		if(count >= 2){
			return true;
		}

		return false;

	}

	replaySaveState(edited, stateToken){
	
		let node = null;

		if(edited === false && this.replayNodes.length > 0){
			node = this.replayNodes.pop();
			node.setStateToken(stateToken);
			this.replayNodes.push(node);
		}
		else if(edited === true && this.editReplayNodes.length > 0){
			node = this.editReplayNodes.pop();
			node.setStateToken(stateToken);
			this.editReplayNodes.push(node);
		}

	}

	compareTwoStates(state1Token, state2Token){

		for(let i = 0; i < 8; i++){
			for(let j = 0; j < 8; j++){

				if(state1Token.boardLayout[i][j] !== state2Token.boardLayout[i][j]){
					return false;
				}
			}
		}

		if(state1Token.myRightCastle !== state2Token.myRightCastle || state1Token.myLeftCastle !== state2Token.myLeftCastle){
			return false;
		}

		if(state1Token.oppRightCastle !== state2Token.oppRightCastle || state1Token.oppLeftCastle !== state2Token.oppLeftCastle){
			return false;
		}

		if(state1Token.enpassantX !== state2Token.enpassantX || state1Token.enpassantY !== state2Token.enpassantY){
			return false;
		}

		//console.log(state1Token);
		//console.log(state2Token);

		return true;
	}


	checkFifty(boardState, oldX, oldY, newX, newY){

		if(boardState[oldX][oldY].charAt(1) === 'p' || boardState[newX][newY] !== '##' ){
			this.counter = 0;
			//this.boardsToCheck.splice(0, this.boardsToCheck.length);
			console.log("Count reset to 0");
			this.clearOldStates();
			return false;
		}

		this.counter++;
		console.log("Count goes up to: " + this.counter);

		if(this.counter >= 100){
			console.log("50 Game Declared Draw");
			return true;
		}

		return false;
	}

	checkFiftyCounter(){

		if(this.counter >= 100){
			console.log("50 Game Declared Draw");
			return true;
		}

		return false;
	}

	copyReplayNodes(){
		let length = this.replayNodes.length;
		let i = 0;
		let node = null;
		
		while(i < length){
			//this.editReplayNodes.push(new replayNode(this.replayNodes[i].getFiftyValue()));
			node = new replayNode();
			node.setFiftyValue(this.replayNodes[i].getFiftyValue());
			node.setStateToken(this.replayNodes[i].getStateToken());
			this.editReplayNodes.push(node);
			i++;
		}

	}

	clearEditReplayNodes(){
		this.editReplayNodes.splice(0, this.editReplayNodes.length);

		let length = this.replayNodes.length;

		if(length === 0){
			this.counter = 0;
		}
		else if(length > 0){
			this.counter = this.replayNodes[length - 1].getFiftyValue();
		}

		console.log("This is the counter after the clear edit replay nodes");
		console.log(this.counter);


	}

	insertReplayNode(edited){

		let node = new replayNode();

		if(edited === false){
			this.replayNodes.push(node);
		}
		else{
			this.editReplayNodes.push(node);
		}
	}

	setCheckFiftyCounterValue(edited, value){

		let node = null;

		if(edited === false && this.replayNodes.length > 0){
			node = this.replayNodes.pop();
			node.setFiftyValue(value);
			this.replayNodes.push(node);
		}
		else if(edited && this.editReplayNodes.length > 0){
			node = this.editReplayNodes.pop();
			node.setFiftyValue(value);
			this.editReplayNodes.push(node);
		}
	}

	replayCheckFifty(edited, boardState, oldX, oldY, newX, newY){

		let value = this.checkFifty(boardState, oldX, oldY, newX, newY);
		let node = null;

		if(edited === false && this.replayNodes.length > 0){
			node = this.replayNodes.pop();
			node.setFiftyValue(this.counter);
			this.replayNodes.push(node);
		}
		else if(edited === true && this.editReplayNodes.length > 0){
			node = this.editReplayNodes.pop();
			node.setFiftyValue(this.counter);
			this.editReplayNodes.push(node);
		}

		return value;

	}

	backupReplay(edited){
		if(edited === false && this.replayNodes.length > 1){
			this.replayNodes.pop();
		}

		if(edited === true && this.editReplayNodes.length > 1){
			this.editReplayNodes.pop();
		}
	}

	backupCheckFifty(edited, index){

		/*
		if(edited === false && this.replayNodes.length > 0){
			this.replayNodes.pop();
		}

		if(edited === true && this.editReplayNodes.length > 0){
			this.editReplayNodes.pop();
		}
		*/



		if(index < 0 || (edited === false && this.replayNodes.length === 0) || (edited === true && this.editReplayNodes.length === 0)){
			this.counter = 0;
			console.log("This is what the counter is now on the backup:");
			console.log(this.counter);
			return;
		}

		if(edited === false){
			this.counter = this.replayNodes[index].getFiftyValue();
		}
		
		else if(edited === true){
			this.counter = this.editReplayNodes[index].getFiftyValue();
		}

		console.log("This is what the counter is now on the backup:");
		console.log(this.counter);

	}

	checkInsufficientPieces(boardState){

		let myKnights = 0;
		let myBishops = 0;
		let oppKnights = 0;
		let oppBishops = 0;

		let piece;
		let p;
		let c;

		for(let i = 0; i < 8; i++){
			for(let j = 0; j < 8; j++){

				piece = boardState[i][j];
				p = piece.charAt(0);

				if(p === 'w' || p === 'b'){

					c = piece.charAt(1);

					if(c === 'p' || c === 'R' || c === 'Q'){
						return false;
					}
					else if(c === 'N'){
						if(p === this.side){
							myKnights++;
						}
						else{
							oppKnights++;
						}
					}
					else if(c === 'B'){
						if(p === this.side){
							myBishops++;
						}
						else{
							oppBishops++;
						}
					}
				}
			}
		}

		//only kings are left
		if(myKnights === 0 && myBishops === 0 && oppKnights === 0 && oppBishops === 0){
			return true;
		}

		//Player has 1 bishop and opponent has just king
		if(myKnights === 0 && myBishops === 1 && oppKnights === 0 && oppBishops === 0){
			return true;
		}

		//Player has 1 knight and opponent has just king
		if(myKnights === 1 && myBishops === 0 && oppKnights === 0 && oppBishops === 0){
			return true;
		}

		//Both players have lone kings and a single bishop
		if(myKnights === 0 && myBishops === 1 && oppKnights === 0 && oppBishops === 1){
			return true;
		}

		//Player has 1 bishop and opponent has 1 knight
		if(myKnights === 0 && myBishops === 1 && oppKnights === 1 && oppBishops === 0){
			return true;
		}

		//Player has 1 knights and opponent has 1 bishop
		if(myKnights === 1 && myBishops === 0 && oppKnights === 0 && oppBishops === 1){
			return true;
		}

		if(myKnights === 1 && myBishops === 0 && oppKnights === 1 && oppBishops === 0){
			return true;
		}

		if(myKnights === 0 && myBishops === 0 && oppKnights === 1 && oppBishops === 0){
			return true;
		}

		if(myKnights === 0 && myBishops === 0 && oppKnights === 0 && oppBishops === 1){
			return true;
		}

		return false;
	}

	checkInsufficientOneSide(side, boardState){
		let myKnights = 0;
		let myBishops = 0;
		let piece;

		for(let i = 0; i < 8; i++){
			for(let j = 0; j < 8; j++){

				if(boardState[i][j].charAt(0) === side){

					piece = boardState[i][j].charAt(1);
					if(piece === 'p' || piece === 'R' || piece === 'Q'){
						return false;
					}
					else if(piece === 'B'){
						myBishops++;
					}
					else if(piece === 'N'){
						myKnights++;
					}

				}
			}
		}

		if(myKnights === 0 && myBishops === 0){
			return true;
		} 

		if(myKnights === 1 && myBishops === 0){
			return true;
		}

		if(myKnights === 0 && myBishops === 1){
			return true;
		}

		return false;

	}




}





