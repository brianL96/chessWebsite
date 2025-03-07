
console.log("Inside of the socketRoomFunctions file");

class gameRoomNode{


	constructor(){

		this.playerOneUsername = null; //getter setter
		this.playerTwoUsername = null; //getter setter
		this.numberOfPlayers = 0; //getter setter
		this.playersFound = [0, 0]; //getter setter
		this.firstMove = false; //getter setter
		this.firstMoveSet = null; //getter setter
		this.statusOfGame = false; //getter setter
		this.intermission = false; //getter setter
		this.playerOneSocketID = null; //getter setter
		this.playerTwoSocketID = null; //getter setter
		this.playerOneDrawOffer = false; //getter setter
		this.playerTwoDrawOffer = false; //getter setter
		this.playerOneDrawRequestLock = false; //getter setter
		this.playerTwoDrawRequestLock = false; //getter setter
		this.playerOneRematchOffer = false; //getter setter		
		this.playerTwoRematchOffer = false; //getter setter
		this.playerOneRematchRequestLock = false; //getter setter
		this.playerTwoRematchRequestLock = false; //getter setter
		this.roomOn = true; //getter setter
		this.watchedStatus = false; //getter setter
		this.playerNowPlaying = 1; //getter setter
		this.rematchCounter = 0; //getter setter
		this.rematchCounterLimit = 1000; //getter setter
		this.awaitingPlayerResponse = -1; //getter setter
		this.inProgressStartDate = null; //getter setter
		this.playerOneConnected = false; //getter setter
		this.playerTwoConnected = false; //getter setter

	}

	getPlayerOneConnected(){
		return this.playerOneConnected;
	}

	setPlayerOneConnected(connected){
		this.playerOneConnected = connected;
	}

	getPlayerTwoConnected(){
		return this.playerTwoConnected;
	}

	setPlayerTwoConnected(connected){
		this.playerTwoConnected = connected;
	}

	setPlayerConnected(whichPlayer, value){
		if(whichPlayer === 1){
			this.setPlayerOneConnected(value);
		}
		else if(whichPlayer === 2){
			this.setPlayerTwoConnected(value);
		}
	}

	getInProgressStartDate(){
		return this.inProgressStartDate;
	}

	setInProgressStartDate(date){
		this.inProgressStartDate = date;
	}

	getAwaitingPlayerResponse(){
		return this.awaitingPlayerResponse;
	}

	setAwaitingPlayerResponse(position){
		this.awaitingPlayerResponse = position;
	}

	resetAwaitingPlayerResponse(){
		this.awaitingPlayerResponse = -1;
	}

	checkAwaitingPlayerResponse(){
		if(this.getAwaitingPlayerResponse() === -1){
			return false;
		}
		return true;
	}

	checkAwaitingPlayerResponsePosition(socketID){
		//return true if player with socketID is awaiting 
		//return false if player with socketID is not awaiting

		//need to keep this because socketID might be equal -1 player position
		if(this.getAwaitingPlayerResponse() === -1){
			return false;
		}
		
		if(this.getAwaitingPlayerResponse() === this.getPlayerWithSocketID(socketID)){
			return true;
		}
		
		return false;
		
	}

	getPlayerTwoDrawRequestLock(){
		return this.playerTwoDrawRequestLock;
	}

	setPlayerTwoDrawRequestLock(value){
		this.playerTwoDrawRequestLock = value;
	}

	getPlayerOneDrawRequestLock(){
		return this.playerOneDrawRequestLock;
	}

	setPlayerOneDrawRequestLock(value){
		this.playerOneDrawRequestLock = value;
	}

	getPlayerOneDrawOffer(){
		return this.playerOneDrawOffer;
	}

	setPlayerOneDrawOffer(value){
		this.playerOneDrawOffer = value;
	}

	getPlayerTwoDrawOffer(){
		return this.playerTwoDrawOffer;
	}

	setPlayerTwoDrawOffer(value){
		this.playerTwoDrawOffer = value;
	}

	getPlayerOneRematchRequestLock(){
		return this.playerOneRematchRequestLock;
	}

	setPlayerOneRematchRequestLock(value){
		this.playerOneRematchRequestLock = value;
	}

	getPlayerTwoRematchRequestLock(){
		return this.playerTwoRematchRequestLock;
	}

	setPlayerTwoRematchRequestLock(value){
		this.playerTwoRematchRequestLock = value;
	}

	getPlayerOneRematchOffer(){
		return this.playerOneRematchOffer;
	}

	setPlayerOneRematchOffer(value){
		this.playerOneRematchOffer = value;
	}

	getPlayerTwoRematchOffer(){
		return this.playerTwoRematchOffer;
	}

	setPlayerTwoRematchOffer(value){
		this.playerTwoRematchOffer = value;
	}

	getPlayerOneUsername(){
		return this.playerOneUsername;
	}

	setPlayerOneUsername(username){
		this.playerOneUsername = username;
	}

	getPlayerTwoUsername(){
		return this.playerTwoUsername;
	}

	setPlayerTwoUsername(username){
		this.playerTwoUsername = username;
	}

	getPlayerOneSocketID(){
		return this.playerOneSocketID;
	}

	setPlayerOneSocketID(socketID){
		this.playerOneSocketID = socketID;
	}

	getPlayerTwoSocketID(){
		return this.playerTwoSocketID;
	}

	setPlayerTwoSocketID(socketID){
		this.playerTwoSocketID = socketID;
	}

	getStatusOfGame(){
		return this.statusOfGame;
	}

	setStatusOfGame(status){
		this.statusOfGame = status;
	}

	getIntermission(){
		return this.intermission;
	}

	setIntermission(status){
		this.intermission = status;
	}

	setRoomOnStatus(value){
		this.roomOn = value;
	}

	getRoomOnStatus(){
		return this.roomOn;
	}

	getFirstMoveStatus(){
		return this.firstMove;
	}

	setFirstMoveStatus(status){
		this.firstMove = status;
	}

	getPlayersFound(whichPlayer){
		if(whichPlayer === 0){
			return this.playersFound[0];
		}
		else if(whichPlayer === 1){
			return this.playersFound[1];
		}
		else{
			return null;
		}
	}

	setPlayersFound(whichPlayer, value){
		if((whichPlayer !== 0) && (whichPlayer !== 1)){
			return;
		}

		this.playersFound[whichPlayer] = value;
	}

	getNumberOfPlayers(){
		return this.numberOfPlayers;
	}

	setNumberOfPlayers(num){
		this.numberOfPlayers = num;
	}

	incrementNumberOfPlayers(){
		this.numberOfPlayers++;
	}

	decrementNumberOfPlayers(){
		this.numberOfPlayers--;
	}

	getFirstMoveSet(){
		return this.firstMoveSet;
	}

	setFirstMoveSet(value){
		this.firstMoveSet = value;
	}


	getPlayerWithSocketID(socketID){


		if(this.getPlayerOneSocketID() === socketID){
			return 1;
		}

		else if(this.getPlayerTwoSocketID() === socketID){
			return 2;
		}

		return -1;
	}

	getSocketIDWithUsername(username){
		
		if(this.getPlayerOneUsername() === username){
			return this.getPlayerOneSocketID();
		}
		else if(this.getPlayerTwoUsername() === username){
			return this.getPlayerTwoSocketID();
		}

		return null;
	}

	getUsernameWithSocketID(socketID){

		if(this.getPlayerOneSocketID() === socketID){
			return this.getPlayerOneUsername();
		}
		else if(this.getPlayerTwoSocketID() === socketID){
			return this.getPlayerTwoUsername();
		}

		return null;
	}


	removeSocketID(player){

		if(player === 1){
			this.setPlayerOneSocketID(null);
		}
		else if(player === 2){
			this.setPlayerTwoSocketID(null);
		}

	}

	getWatchedStatus(){
		return this.watchedStatus;
	}

	setWatchedStatus(status){
		this.watchedStatus = status;
	}

	swapPlayerUsernames(){
		let playerOne = this.getPlayerOneUsername();
		let playerTwo = this.getPlayerTwoUsername();
		this.setPlayerOneUsername(playerTwo);
		this.setPlayerTwoUsername(playerOne);
	}

	getPlayerNowPlaying(){
		return this.playerNowPlaying;
	}

	setPlayerNowPlaying(player){
		this.playerNowPlaying = player;
	}

	checkPlayerNowPlaying(player){

		console.log("This is the player: " + player);
		console.log(this.getPlayerNowPlaying());

		let opp;
		
		if(this.getPlayerNowPlaying() === 1){
			opp = 2;
		}
		else if(this.getPlayerNowPlaying() === 2){
			opp = 1;
		}
		else{
			opp = -1;
		}

		if(this.getPlayerNowPlaying() === player){
			return {
				playerNow: this.getPlayerNowPlaying(),
				oppNow: opp,
				check: true
			};
		}
		
		return {
			playerNow: this.getPlayerNowPlaying(),
			oppNow: opp,
			check: false
		};
	}

	getRematchCounter(){
		return this.rematchCounter;
	}

	setRematchCounter(num){
		this.rematchCounter = num;
	}

	incrementRematchCounter(){
		this.rematchCounter++;
	}

	getRematchCounterLimit(){
		return this.rematchCounterLimit;
	}

	setRematchCounterLimit(limit){
		this.rematchCounterLimit = limit;
	}


	handleRematchRequest(socketID){

		let returnData = {
			handShakeComplete : false,
			playerOneRequest : false,
			playerTwoRequest : false,
			player : -1,
			error : false,
			limitReached: false
		};


		if(this.getRoomOnStatus() === false){
			returnData.error = true;
			return returnData;
		}

		if(this.getIntermission() === false){
			returnData.error = true;
			return returnData;
		}

		if(this.getRematchCounter() >= this.getRematchCounterLimit()){
			returnData.error = true;
			returnData.limitReached = true;
			return returnData;
		}

		let player = this.getPlayerWithSocketID(socketID);

		if(player === 1 && this.getPlayerOneRematchRequestLock() === false){
			this.setPlayerOneRematchOffer(true);
			this.setPlayerOneRematchRequestLock(true);
			returnData.playerOneRequest = true;
			returnData.player = 1;
		}
		else if(player === 2 && this.getPlayerTwoRematchRequestLock() === false){
			this.setPlayerTwoRematchOffer(true);
			this.setPlayerTwoRematchRequestLock(true);
			returnData.playerTwoRequest = true;
			returnData.player = 2;
		}

		if(this.getPlayerOneRematchOffer() && this.getPlayerTwoRematchOffer()){
			console.log("Remtach Handshake Complete");
			returnData.handShakeComplete = true;
		}
		else{
			console.log("Remtach Handshake Not Complete");
		}

		return returnData;

	}



	handleDrawRequestDenied(socketID){

		//called when a move is made
		//player denied any draw requests from opponent
		//only turn off opponent request

		let returnData = {
			playerOneDenied : false,
			playerTwoDenied : false
		};

		let player = this.getPlayerWithSocketID(socketID);

		if(player === 1 && this.getPlayerTwoDrawOffer()){

			this.setPlayerTwoDrawOffer(false);
			this.setPlayerTwoDrawRequestLock(false);
			returnData.playerTwoDenied = true;

		}
		else if(player === 2 && this.getPlayerOneDrawOffer()){
			
			this.setPlayerOneDrawOffer(false);
			this.setPlayerOneDrawRequestLock(false);
			returnData.playerOneDenied = true;
		}

		return returnData;
	}


	handleDrawRequest(socketID){

		let returnData = {
			handShakeComplete: false,
			playerOneRequest: false,
			playerTwoRequest: false,
			player: -1,
			error : false
		};


		if(this.getIntermission()){
			returnData.error = true;
			return returnData;
		}

		let player = this.getPlayerWithSocketID(socketID);

		if(player === 1 && this.getPlayerOneDrawRequestLock() === false){
			this.setPlayerOneDrawOffer(true);
			this.setPlayerOneDrawRequestLock(true);
			returnData.playerOneRequest = true;
			returnData.player = 1;
		}
		else if(player === 2){
			this.setPlayerTwoDrawOffer(true);
			this.setPlayerTwoDrawRequestLock(true);
			returnData.playerTwoRequest = true;
			returnData.player = 2;
		}

		if(this.getPlayerOneDrawOffer() && this.getPlayerTwoDrawOffer()){
			returnData.handShakeComplete = true;
		}

		return returnData;
	}

	emptyRoom(){

		this.setStatusOfGame(false);
		this.setFirstMoveStatus(false);
		this.setPlayerOneUsername(null);
		this.setPlayerTwoUsername(null);
		this.setPlayersFound(0, 0);
		this.setPlayersFound(1, 0);
		this.setNumberOfPlayers(0);
		this.setIntermission(false);
		this.setFirstMoveSet(null);

		this.resetRoomDraws();
		this.resetRoomRematchRequests();

		this.setPlayerNowPlaying(1);
		this.setRematchCounter(0);
		this.setInProgressStartDate(null);

		this.setPlayerOneConnected(false);
		this.setPlayerTwoConnected(false);
	}


	resetRoomDraws(){

		this.setPlayerOneDrawOffer(false);
		this.setPlayerTwoDrawOffer(false);
		this.setPlayerOneDrawRequestLock(false);
		this.setPlayerTwoDrawRequestLock(false);
	}

	resetRoomRematchRequests(){

		this.setPlayerOneRematchOffer(false);
		this.setPlayerTwoRematchOffer(false);
		this.setPlayerOneRematchRequestLock(false);
		this.setPlayerTwoRematchRequestLock(false);
	}

	resetFindRoom(username){

		if(username === this.getPlayerOneUsername()){
			this.setPlayerOneUsername(null);
			this.setPlayersFound(0, 0);
			this.decrementNumberOfPlayers();
			return 1;
		}
		else if(username === this.getPlayerTwoUsername()){
			this.setPlayerTwoUsername(null);
			this.setPlayersFound(1, 0);
			this.decrementNumberOfPlayers();
			return 2;
		}

		return -1;
	}

	getRoomStatus(){

		let data = {
			gameplayStatus: -1,
			playerOneUsername: null,
			playerTwoUsername: null,
			occupiedResult: null,
			occupiedStatus: false,
			rematchCounterResult: -1,
			roomOn: true,
			inProgressDate: null
		};

		data.rematchCounterResult = this.getRematchCounter();
		data.inProgressDate = this.getInProgressStartDate();
		
		if(this.getStatusOfGame() === false && this.getIntermission() === false){
			//no game in progress
			data.gameplayStatus = 0;
		}
		else if(this.getStatusOfGame() === true && this.getIntermission() === false){
			//game in progress
			data.gameplayStatus = 1;
		}
		else if(this.getIntermission() === true){
			//game is in intermission
			data.gameplayStatus = 2;
		}


		if(this.getRoomOnStatus()){
			data.roomOn = true;
		}
		else{
			data.roomOn = false;
		}


		if(this.getPlayersFound(0) === 0 && this.getPlayersFound(1) === 0){
			data.occupiedResult = "Room Unoccupied";

		}
		else if(this.getPlayersFound(0) === 1 && this.getPlayersFound(1) === 0){
			data.occupiedResult = "Room Has 1 User";
			data.playerOneUsername = this.getPlayerOneUsername();
			data.occupiedStatus = true;
		}
		else if(this.getPlayersFound(0) === 0 && this.getPlayersFound(1) === 1){
			data.occupiedResult = "Room Has 1 User";
			data.playerTwoUsername = this.getPlayerTwoUsername();
			data.occupiedStatus = true;
		}
		else if(this.getPlayersFound(0) === 1 && this.getPlayersFound(1) === 1){
			data.occupiedResult = "Room Is Fully Occupied";
			data.playerOneUsername = this.getPlayerOneUsername();
			data.playerTwoUsername = this.getPlayerTwoUsername();
			data.occupiedStatus = true;
		}

		return data;
	}

	printChanges(){

		if(this.getPlayerOneUsername() !== null){
			console.log("Player One Username Changed:");
			console.log(this.getPlayerOneUsername());
		}
		if(this.getPlayerTwoUsername() !== null){
			console.log("Player Two Username Changed:");
			console.log(this.getPlayerTwoUsername());
		}
		if(this.getNumberOfPlayers() !== 0){
			console.log("Number Of Players Changed:");
			console.log(this.getNumberOfPlayers());
		}
		if(this.getPlayersFound(0) !== 0){
			console.log("Players Found (0) Changed:");
			console.log(this.getPlayersFound(0));
		}
		if(this.getPlayersFound(1) !== 0){
			console.log("Players Found (1) Changed:");
			console.log(this.getPlayersFound(1));
		}
		if(this.getFirstMoveStatus() !== false){
			console.log("First Move Status Changed:");
			console.log(this.getFirstMoveStatus());
		}
		if(this.getFirstMoveSet() !== null){
			console.log("First Move Set Changed:");
			console.log(this.getFirstMoveSet());
		}
		if(this.getStatusOfGame() !== false){
			console.log("Status Of Game Changed:");
			console.log(this.getStatusOfGame());
		}
		if(this.getIntermission() !== false){
			console.log("Intermission Changed:");
			console.log(this.getIntermission());
		}
		if(this.getPlayerOneSocketID() !== null){
			console.log("Player One Socket ID Changed:");
			console.log(this.getPlayerOneSocketID());
		}
		if(this.getPlayerTwoSocketID() !== null){
			console.log("Player Two Socket ID Changed:");
			console.log(this.getPlayerTwoSocketID());
		}
		if(this.getPlayerOneDrawOffer() !== false){
			console.log("Player One Draw Offer Changed:");
			console.log(this.getPlayerOneDrawOffer());
		}
		if(this.getPlayerTwoDrawOffer() !== false){
			console.log("Player Two Draw Offer Changed:");
			console.log(this.getPlayerTwoDrawOffer());
		}
		if(this.getPlayerOneDrawRequestLock() !== false){
			console.log("Player One Draw Request Lock Changed:");
			console.log(this.getPlayerOneDrawRequestLock());
		}
		if(this.getPlayerTwoDrawRequestLock() !== false){
			console.log("Player Two Draw Request Lock Changed:");
			console.log(this.getPlayerTwoDrawRequestLock());
		}
		if(this.getPlayerOneRematchOffer() !== false){
			console.log("Player One Rematch Offer Changed:");
			console.log(this.getPlayerOneRematchOffer());
		}
		if(this.getPlayerTwoRematchOffer() !== false){
			console.log("Player Two Rematch Offer Changed:");
			console.log(this.getPlayerTwoRematchOffer());
		}
		if(this.getPlayerOneRematchRequestLock() !== false){
			console.log("Player One Rematch Request Lock Changed:");
			console.log(this.getPlayerOneRematchRequestLock());
		}
		if(this.getPlayerTwoRematchRequestLock() !== false){
			console.log("Player Two Rematch Request Lock Changed:");
			console.log(this.getPlayerTwoRematchRequestLock());
		}
		if(this.getRoomOnStatus() !== true){
			console.log("Room On Status Changed:");
			console.log(this.getRoomOnStatus());
		}
		if(this.getWatchedStatus() !== false){
			console.log("Watched Status Changed:");
			console.log(this.getWatchedStatus());
		}
		if(this.getPlayerNowPlaying() !== 1){
			console.log("Player Now Playing Changed:");
			console.log(this.getPlayerNowPlaying());
		}
		if(this.getRematchCounter() !== 0){
			console.log("Rematch Counter Changed:");
			console.log(this.getRematchCounter());
		}
		if(this.getRematchCounterLimit() !== 1000){
			console.log("Rematch Counter Limit Changed:");
			console.log(this.getRematchCounterLimit());
		}
		if(this.getAwaitingPlayerResponse() !== -1){
			console.log("Awaiting Player Response Changed:");
			console.log(this.getAwaitingPlayerResponse());
		}
		if(this.getInProgressStartDate() !== null){
			console.log("In Progress Start Date Changed:");
			console.log(this.getInProgressStartDate());
		}
		if(this.getPlayerOneConnected() !== false){
			console.log("Player One Connected Changed:");
			console.log(this.getPlayerOneConnected());
		}
		if(this.getPlayerTwoConnected() !== false){
			console.log("Player Two Connected Changed:");
			console.log(this.getPlayerTwoConnected());
		}
	}


}


module.exports = {

	gameRoomNode
};












