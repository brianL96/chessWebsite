
class Rook{

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

		//go up
		while( x > 0){		
			x = x - 1;
			result = this.validMovesCheckSpot(boardState, x, y);
			if(result === 0){
				break;
			}
		}

		x = this.x;

		//go down
		while(x < 7){
			x = x + 1;
			result = this.validMovesCheckSpot(boardState, x, y);
			if(result === 0){
				break;
			}
		}

		x = this.x;

		//go left
		while(y > 0){
			y = y - 1;
			result = this.validMovesCheckSpot(boardState, x, y);
			if(result === 0){
				break;
			}
		}

		y = this.y;

		//go right
		while(y < 7){
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

		//go up
		while( x > 0){	
			x = x - 1;
			result = this.allMovesCheckSpot(boardState, king, x, y);
			if(result === 0){
				break;
			}
		}

		x = this.x;

		//go down
		while(x < 7){
			x = x + 1;
			result = this.allMovesCheckSpot(boardState, king, x, y);
			if(result === 0){
				break;
			}

		}

		x = this.x;

		//go left
		while(y > 0){
			y = y - 1;
			result = this.allMovesCheckSpot(boardState, king, x, y);
			if(result === 0){
				break;
			}
		}

		y = this.y;

		while(y < 7){
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

class Castle{

	constructor(leftX, leftY, rightX, rightY, player){

		this.kingValid = true;
		this.leftRook = true;
		this.rightRook = true;
		this.leftX = leftX;
		this.leftY = leftY;
		this.rightX = rightX;
		this.rightY = rightY;
		this.leftPath = [];
		this.rightPath = [];
		this.player = player;

	}

	reset(leftX, leftY, rightX, rightY, player){

		this.kingValid = true;
		this.leftRook = true;
		this.rightRook = true;
		this.leftX = leftX;
		this.leftY = leftY;
		this.rightX = rightX;
		this.rightY = rightY;
		this.player = player;
		this.resetLeftPath();
		this.resetRightPath();

	}

	castleLeft(x, y){

		if(this.kingValid !== true || this.leftRook !== true ){
			return false;
		}

		if(this.player === 1){
			if(x === this.leftX && y === this.leftY + 2){
				return true;
			}
		}
		else{
			if(x === this.leftX && y === this.leftY + 1){
				return true;
			}
		}

		return false;
	}

	castleRight(x, y){

		if(this.kingValid !== true || this.rightRook !== true){
			return false;
		}

		if(this.player === 1){
			if(x === this.rightX && y === this.rightY - 1){
				return true;
			}
		}
		else{
			if(x === this.rightX && y === this.rightY - 2){
				return true;
			}
		}
		return false;
	}

	resetLeftPath(){

		if(this.leftPath.length > 0){
			this.leftPath.splice(0, this.leftPath.length);
		}

	}

	resetRightPath(){

		if(this.rightPath.length > 0){
			this.rightPath.splice(0, this.rightPath.length);
		}
	}

	getKingStatus(){
		return this.kingValid;
	}

	setKingStatus(status){
		this.kingValid = status;
	}

	getLeftPath(){
		return this.leftPath;
	}

	getRightPath(){
		return this.rightPath;
	}

	setKingMove(){
		this.kingValid = false;
	}

	resetKingMove(){
		this.kingValid = true;
	}


	getLeftCastle(){

		let m;

		if(this.player === 1){
			m = new Move(this.leftX, this.leftY + 2);
		}
		else{
			m = new Move(this.leftX, this.leftY + 1);
		}
		return m;
	}

	getRightCastle(){

		let m;

		if(this.player === 1){
			m = new Move(this.rightX, this.rightY - 1);
		}
		else{
			m = new Move(this.rightX, this.rightY - 2);
		}

		return m;
	}

	getLeftStatus(boardState, x, y){

		if(this.kingValid && this.leftRook ){
			//return true;
			return this.checkLeftPath(boardState, x, y);
		}

		return false;
		//return this.leftRook; 
	}

	getRightStatus(boardState, x, y){

		
		if(this.kingValid && this.rightRook){
			//return true;
			return this.checkRightPath(boardState, x, y);
		}

		return false;
		//return this.rightRook;
	}


	checkLeftPath(boardState, kingX, kingY){

		
		let x = kingX;
		let y = kingY - 1;
		let c = boardState[x][y];
		let lowerbound;

		if(this.player === 1){
			lowerbound = 2;
		}
		else{
			lowerbound = 1;
		}

		this.resetLeftPath();

		while(y >= 0 && boardState[x][y].charAt(1) !== 'R'){

			c = boardState[x][y];

			if(c !== '##'){
				this.resetLeftPath();
				return false;
			}
	
			if(y >= lowerbound){
				let m = new Move(x, y);
				this.leftPath.push(m);
			}
			y--;
		}

		return true;
	}

	checkRightPath(boardState, kingX, kingY){

		
		let x = kingX;
		let y = kingY + 1;
		let c = boardState[x][y];
		let upperbound;

		if(this.player === 1){
			upperbound = 6;
		}
		else{
			upperbound = 5;
		}

		this.resetRightPath();

		while(y <= 7 && boardState[x][y].charAt(1) !== 'R'){

			c = boardState[x][y];
		
			if(c !== '##'){
				this.resetRightPath();
				return false;
			}

			if(y <= upperbound){
				let m = new Move(x, y);
				this.rightPath.push(m);
			}

			y++;
		}

		return true;
	}


	checkRookMove(x, y){
		//call this when you move a rook
		//return 1 means left rook moved for first time
		//return 2 means right rook moved for first time
		//return 0 neither rook moved for first time
		if(this.leftRook){
			if(x === this.leftX && y === this.leftY){
				this.leftRook = false;
				return 1;
			}
		}

		if(this.rightRook){
			if(x === this.rightX && y === this.rightY){
				this.rightRook = false;
				return 2;
			}
		}

		return 0;

	}

	getLeftRook(){
		return this.leftRook;
	}

	getRightRook(){
		return this.rightRook;
	}

	setLeftRook(status){
		this.leftRook = status;
	}

	setRightRook(status){
		this.rightRook = status;
	}

	

}
