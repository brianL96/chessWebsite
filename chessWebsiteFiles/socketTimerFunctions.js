

const roomFunctions = require('./socketRoomFunctions.js');
const scoreFunctions = require('./userScoreFunctions.js');
const userVariables = require('./userVariables.js');
const activePlayers = require('./activePlayers.js');

let regularGameSeconds = 721;
let noInitialMoveWarningSeconds = 30;
let noInitialMoveTimeoutSeconds = 60;
let noOpponentWarningSeconds = 30;
let noOpponentTimeoutSeconds = 60;
let noRematchWarningSeconds = 10;
let noRematchTimeoutSeconds = 40;
let speedGameSeconds = 61;
let speedGameExtraSeconds = 30;



function getGameModeStartSeconds(gameMode){

	if(gameMode === 0 || gameMode === 1 || gameMode === 2){
		return regularGameSeconds;
	}

	if(gameMode === 3){
		return speedGameSeconds;
	}

	return -1;
}


function getGameModeExtraSeconds(gameMode){

	if(gameMode === 0 || gameMode === 1 || gameMode === 2){
		return -1;
	}

	if(gameMode === 3){
		return speedGameExtraSeconds;
	}

	return -1;
}






class gameTimerManager{


	constructor(timerSeconds, extraSeconds, roomName, gameModeNumber, database, namespace){

		this.confirmationTimeout = null; //getter setter
		this.timeoutData = null; //getter setter
		this.playerOneStartDate = null; //getter setter
		this.playerTwoStartDate = null; //getter setter
		this.playerOneTimer = timerSeconds; //getter setter
		this.playerTwoTimer = timerSeconds; //getter setter
		this.timeoutObject = null; //getter setter
		this.startTimer = false; //getter setter
		this.playerOneMoved = false; //getter setter
		this.playerTwoMoved = false; //getter setter
		this.playerWaitingOn = -1; //getter setter
		this.timerInPlay = false; //getter setter
		this.noProgressionWarningObject = null; //getter setter
		this.noProgressionTimeoutObject = null; //getter setter
		this.playerOneExtraTime = extraSeconds; //getter setter
		this.playerTwoExtraTime = extraSeconds; //getter setter
		this.roomName = roomName; //getter setter
		this.gameRoomNode = new roomFunctions.gameRoomNode();
		this.gameModeNumber = gameModeNumber;
		this.database = database;
		this.namespace = namespace;

		this.playerOneReservationTimeout = null;
		this.playerTwoReservationTimeout = null;
	
	}

	setPlayerOneReservationTimeout(data){
		this.playerOneReservationTimeout = data;
	}

	getPlayerOneReservationTimeout(){
		return this.playerOneReservationTimeout;
	}

	setPlayerTwoReservationTimeout(data){
		this.playerTwoReservationTimeout = data;
	}

	getPlayerTwoReservationTimeout(){
		return this.playerTwoReservationTimeout;
	}

	getConfirmationTimeout(){
		return this.confirmationTimeout;
	}

	setConfirmationTimeout(value){
		this.confirmationTimeout = value;
	}

	getTimeoutData(){
		return this.timeoutData;
	}

	setTimeoutData(data){
		this.timeoutData = data;
	}

	getPlayerOneStartDate(){
		return this.playerOneStartDate;
	}

	setPlayerOneStartDate(date){
		this.playerOneStartDate = date;
	}

	getPlayerTwoStartDate(){
		return this.playerTwoStartDate;
	}

	setPlayerTwoStartDate(date){
		this.playerTwoStartDate = date;
	}


	getPlayerTime(whichPlayer){
		if(whichPlayer === 1){
			return this.playerOneTimer;
		}
		else if(whichPlayer === 2){
			return this.playerTwoTimer;
		}
		else if(whichPlayer === -1){
			return getGameModeStartSeconds(this.getGameModeNumber());
		}
		else{
			return null;
		}
	}

	setPlayerTime(whichPlayer, time){

		if(whichPlayer === 1){
			this.playerOneTimer = time;
		}
		else if(whichPlayer === 2){
			this.playerTwoTimer = time;
		}
	}

	getTimeoutObject(){
		return this.timeoutObject;
	}

	setTimeoutObject(timeoutObject){
		this.timeoutObject = timeoutObject;
	}


	getStartTimer(){
		return this.startTimer;
	}

	setStartTimer(value){
		this.startTimer = value;
	}

	getPlayerOneMoved(){
		return this.playerOneMoved;
	}

	setPlayerOneMoved(value){
		this.playerOneMoved = value;
	}

	getPlayerTwoMoved(){
		return this.playerTwoMoved;
	}

	setPlayerTwoMoved(value){
		this.playerTwoMoved = value;
	}

	getPlayerWaitingOn(){
		return this.playerWaitingOn;
	}

	setPlayerWaitingOn(value){
		this.playerWaitingOn = value;
	}

	getTimerInPlay(){
		return this.timerInPlay;
	}

	setTimerInPlay(value){
		this.timerInPlay = value;
	}

	getNoProgressionWarningObject(){
		return this.noProgressionWarningObject;
	}

	setNoProgressionWarningObject(warningObject){
		this.noProgressionWarningObject = warningObject;
	}

	getNoProgressionTimeoutObject(){
		return this.noProgressionTimeoutObject;
	}

	setNoProgressionTimeoutObject(timeoutObject){
		this.noProgressionTimeoutObject = timeoutObject;
	}

	getPlayerOneExtraTime(){
		return this.playerOneExtraTime;
	}

	setPlayerOneExtraTime(timerSeconds){
		this.playerOneExtraTime = timerSeconds;
	}	

	getPlayerTwoExtraTime(){
		return this.playerTwoExtraTime;
	}

	setPlayerTwoExtraTime(timerSeconds){
		this.playerTwoExtraTime = timerSeconds;
	}

	getRoomName(){
		return this.roomName;
	}

	setRoomName(roomName){
		this.roomName = roomName;
	}

	getGameRoomNode(){
		return this.gameRoomNode;
	}

	printGameRoomNode(){
		console.log(this.getGameRoomNode());
	}

	getGameModeNumber(){
		return this.gameModeNumber;
	}

	getDatabase(){
		return this.database;
	}

	getNamespace(){
		return this.namespace;
	}

	turnOffTimerObject(){

		if(this.getTimeoutObject() !== null){
			//console.log("Turning off old timer object for player: " + this.getPlayerWaitingOn());
			clearTimeout(this.getTimeoutObject());
			this.setTimeoutObject(null);
		}
	}

	turnOffConfirmationTimeout(){

		if(this.getConfirmationTimeout() !== null){
			//console.log("Turning off confirmation timer");
			clearTimeout(this.getConfirmationTimeout());
			this.setConfirmationTimeout(null);
		}
	}

	turnOffNoProgressionTimer(){

		if(this.getNoProgressionWarningObject() !== null){
			clearTimeout(this.getNoProgressionWarningObject());
			this.setNoProgressionWarningObject(null);
		}

		if(this.getNoProgressionTimeoutObject() !== null){
			clearTimeout(this.getNoProgressionTimeoutObject());
			this.setNoProgressionTimeoutObject(null);
		}
	}

	turnOffReservationTimeout(playerPosition){

		console.log("This is the player Position:");
		console.log(playerPosition);

		if(playerPosition === 1 && this.getPlayerOneReservationTimeout() !== null){
			console.log("Turning off Player One Reservation Timeout");
			clearTimeout(this.getPlayerOneReservationTimeout());
			this.setPlayerOneReservationTimeout(null);
		}

		else if(playerPosition === 2 && this.getPlayerTwoReservationTimeout() !== null){
			console.log("Turning off Player Two Reservation Timeout");
			clearTimeout(this.getPlayerTwoReservationTimeout());
			this.setPlayerTwoReservationTimeout(null);
		}
	}


	timeoutDisconnectFromRoom(io, data){

		console.log("Start of timeoutDisconnectFromRoom*************************");

		io.of(this.getNamespace()).in(this.getRoomName()).emit('clientTimeout', data);
		//setTimeout(userVariables.forceSocketDisconnect, 8000, io, this.getNamespace(), this.getGameRoomNode().getPlayerOneSocketID());
		//setTimeout(userVariables.forceSocketDisconnect, 8000, io, this.getNamespace(), this.getGameRoomNode().getPlayerTwoSocketID());
		

		if(data.timingOut !== false){
			//console.log("Disconnecting due to no progression timeout (General)");
			activePlayers.activePlayersObject.deleteBothActivePlayerNodesInRoom(this.getGameRoomNode(), this.getGameModeNumber());
			let playerOneSocketID = this.getGameRoomNode().getPlayerOneSocketID();
			let playerTwoSocketID = this.getGameRoomNode().getPlayerTwoSocketID();
			if(this.getGameRoomNode().getNumberOfPlayers() === 2){
				userVariables.decrementCurrentOccupancy(this.getGameModeNumber());
			}
			
			this.resetRoomTimers();
			this.turnOffNoProgressionTimer();
			this.turnOffReservationTimeout(1);
			this.turnOffReservationTimeout(2);
			this.getGameRoomNode().emptyRoom();
			this.messageAdmin(io);

			let socket1 = io.of(this.getNamespace()).connected[playerOneSocketID];
			let socket2 = io.of(this.getNamespace()).connected[playerTwoSocketID];

			if(socket1 !== undefined && socket1 !== null){
				socket1.leave(this.getRoomName());
			}
			if(socket2 !== undefined && socket2 !== null){
				socket2.leave(this.getRoomName());
			}

			userVariables.setupForceSocketDisconnect(io, this.getNamespace(), playerOneSocketID);
			userVariables.setupForceSocketDisconnect(io, this.getNamespace(), playerTwoSocketID);

			console.log("Changes after timeoutDisconnectFromRoom:");

			this.printChanges();

		}

	}

	checkStartTimer(io, socketID){

		//returns true if both players have moved
		//returns false if only one player has moved

		if(this.getGameRoomNode().getPlayerOneSocketID() === socketID){
			this.setPlayerOneMoved(true);
			this.turnOffNoProgressionTimer();
			this.setNoInitialMoveTimeoutObject(io);

		}
		
		else if(this.getGameRoomNode().getPlayerTwoSocketID() === socketID){
			this.setPlayerTwoMoved(true);
		}
		
		if(this.getPlayerOneMoved() && this.getPlayerTwoMoved()){
			this.setStartTimer(true);
			this.turnOffNoProgressionTimer();
			return true;
		}

		return false;
	}

	
	setReservationTimeoutObject(playerPostion, username){
		
		if(playerPostion !== 1 && playerPostion !== 2){
			return;
		}

		let reserveTimeoutObject = setTimeout(this.handleReservationTimeout.bind(this), 10000, username);

		if(playerPostion === 1){
			this.setPlayerOneReservationTimeout(reserveTimeoutObject);
		}
		else if(playerPostion === 2){
			this.setPlayerTwoReservationTimeout(reserveTimeoutObject);
		}
		
	}

	handleReservationTimeout(username){

		console.log("Handling Reservation Timeout");

		let room = this.getGameRoomNode();

		let playerPosition = 0;

		if(room.getPlayerOneUsername() === username){
			playerPosition = 0;
			room.setPlayerOneUsername(null);
			this.turnOffReservationTimeout(1);
		}
		else if(room.getPlayerTwoUsername() === username){
			playerPosition = 1;
			room.setPlayerTwoUsername(null);
			this.turnOffReservationTimeout(2);
		}
		else{
			return;
		}

		if(room.getNumberOfPlayers() === 2){
			userVariables.decrementCurrentOccupancy(this.getGameModeNumber());
		}

		room.decrementNumberOfPlayers();
		room.setPlayersFound(playerPosition, 0);
		activePlayers.activePlayersObject.deleteActivePlayerNode(username, this.getGameModeNumber());

		console.log("Reservation Timeout Changes:");
		console.log("*************************");
		this.printChanges();
		console.log("*************************");

		console.log("Active Nodes After Reservation Timeout");
		activePlayers.activePlayersObject.printActiveNodes();


	}

	setNoInitialMoveTimeoutObject(io){

		let warningObject = setTimeout(this.handleNoInitialMoveTimeout.bind(this), noInitialMoveWarningSeconds * 1000, io, 1);
		this.setNoProgressionWarningObject(warningObject);
		let timeoutObject = setTimeout(this.handleNoInitialMoveTimeout.bind(this), noInitialMoveTimeoutSeconds * 1000, io, 2);
		this.setNoProgressionTimeoutObject(timeoutObject);
	}

	handleNoInitialMoveTimeout(io, option){

		let data = {
			differentMessage: true,
			info: null,
			playerOneMessage: null,
			playerTwoMessage: null,
			timingOut: null
		};

		let noMoveRecievedWarningMessage = "Timing Out In 30 Sec If No Initial Move Recieved.";
		let noMoveMadeWarningMessage = "Timing Out In 30 Sec If No Initial Move Made.";
		let noMoveRecievedTimeoutMessage = "No Initial Move Recieved. Timing Out From Room.";
		let noMoveMadeTimeoutMessage = "No Initial Move Made. Timing Out From Room.";

		if(option === 1){

			if(this.getPlayerOneMoved() === false){
				data.playerOneMessage = noMoveMadeWarningMessage;
				data.playerTwoMessage = noMoveRecievedWarningMessage;
				this.setNoProgressionWarningObject(null);
			}
			else if(this.getPlayerOneMoved() === true && this.getPlayerTwoMoved() === false){
				data.playerOneMessage = noMoveRecievedWarningMessage;
				data.playerTwoMessage = noMoveMadeWarningMessage;
				this.setNoProgressionWarningObject(null);
			}
			data.timingOut = false;
		}
		else if(option === 2){

			if(this.getPlayerOneMoved() === false){
				data.playerOneMessage = noMoveMadeTimeoutMessage;
				data.playerTwoMessage = noMoveRecievedTimeoutMessage;
				this.setNoProgressionTimeoutObject(null);
			}
			else if(this.getPlayerOneMoved() === true && this.getPlayerTwoMoved() === false){
				data.playerOneMessage = noMoveRecievedTimeoutMessage;
				data.playerTwoMessage = noMoveMadeTimeoutMessage;
				this.setNoProgressionTimeoutObject(null);
			}

			data.timingOut = true;
		}

		this.timeoutDisconnectFromRoom(io, data);

	}


	setNoRematchTimeoutObject(io){

		let warningObject = setTimeout(this.handleNoRematchTimeout.bind(this), noRematchWarningSeconds * 1000, io, 1);
		this.setNoProgressionWarningObject(warningObject);
		let timeoutObject = setTimeout(this.handleNoRematchTimeout.bind(this), noRematchTimeoutSeconds * 1000, io, 2);
		this.setNoProgressionTimeoutObject(timeoutObject);

	}

	handleNoRematchTimeout(io, option){

		//console.log("No Rematch Timeout Called");

		let data = {
			info: null,
			differentMessage: false,
			playerOneMessage: null,
			playerTwoMessage: null,
			timingOut: null
		};

		if(option === 1){
			data.info = "Timing Out In 30 Sec If No Rematch Initiated";
			data.timingOut = false;
			this.setNoProgressionWarningObject(null);
		}
		else if(option === 2){
			data.info = "No Rematch Initiated. Timing Out Of Room";
			data.timingOut = true;
			this.setNoProgressionTimeoutObject(null);

		}

		this.timeoutDisconnectFromRoom(io, data);
	}


	setNoOpponentTimeoutObject(io){

		let warningObject = setTimeout(this.handleNoOpponentTimeout.bind(this), noOpponentWarningSeconds * 1000, io, 1);
		this.setNoProgressionWarningObject(warningObject);
		let timeoutObject = setTimeout(this.handleNoOpponentTimeout.bind(this), noOpponentTimeoutSeconds * 1000, io, 2);
		this.setNoProgressionTimeoutObject(timeoutObject);

	}

	handleNoOpponentTimeout(io, option){

		//console.log("No Opponent Timeout Called");

		let data = {
			info: null,
			differentMessage: false,
			playerOneMessage: null,
			playerTwoMessage: null,
			timingOut: null
		};

		if(option === 1){
			data.info = "Timing Out In 30 Sec If No Opponent Found";
			data.timingOut = false;
			this.setNoProgressionWarningObject(null);
		}
		else if(option === 2){
			data.info = "No Opponent Found. Timing Out Of Room";
			data.timingOut = true;
			this.setNoProgressionTimeoutObject(null);
		}

		this.timeoutDisconnectFromRoom(io, data);
	
	}

	handleTimeout(io){

		if(this.getTimerInPlay() === false || this.getTimeoutObject() === null){
			return;
		}

		this.executeGameplayTimeout(io);
	}


	executeGameplayTimeout(io){

		let gameOver = false;

		let data = {
			losingPlayer: null,
			player: -1
		};

		let sendingData = {
			player: -1
		};

		if(this.getPlayerWaitingOn() === 1){
			this.setPlayerTime(1, 0);
			data.player = 1;
			gameOver = true;
			this.setTimerInPlay(false);
			data.losingPlayer = this.getGameRoomNode().getPlayerOneUsername();
		}
		else if(this.getPlayerWaitingOn() === 2){
			this.setPlayerTime(2, 0);
			data.player = 2;
			gameOver = true;
			this.setTimerInPlay(false);
			data.losingPlayer = this.getGameRoomNode().getPlayerTwoUsername();
		}

		if(gameOver){
			this.turnOffTimerObject();
			sendingData.player = data.player;
			data.timeLoss = true;
			this.setTimeoutData(data);
			this.getGameRoomNode().setAwaitingPlayerResponse(data.player);
			let confirmationTimeout = setTimeout(this.handleLostOnTime.bind(this), 3300, io, data);
			this.setConfirmationTimeout(confirmationTimeout);
			io.of(this.getNamespace()).in(this.getRoomName()).emit('clientCheckInsufficientMaterial', sendingData);
			return;
		}


	}


	handleLostOnTime(io, data){

		//console.log("No confimation recieved, handling as time loss");
	
		if(this.getGameRoomNode().getPlayerNowPlaying() === -1){
			console.log("In Confirmation Timeout: Game Is Already Over, Returning");
			return;
		}

		data.timeLoss = true;
		this.processLostOnTime(io, data, this.getRoomName());
		this.turnOffConfirmationTimeout();
		this.setNoRematchTimeoutObject(io);
		this.getGameRoomNode().setPlayerNowPlaying(-1);
		io.of(this.getNamespace()).in(this.getRoomName()).emit('timeLoss', data);
		this.messageAdmin(io);

	}


	handleRoomTimers(io, socketID){

		let startTimer = false;
		let timerJustTurnedOn = false;
		let seconds = 0;
		let secondsRemaining = 0;
		let timeoutMilli = 0;
		let endTimer;

		if(this.getTimerInPlay() === false){
			console.log("Timer in play is false, returning right away");
			return true;
		}

		console.log("Made it past first timer check");

		if(this.getStartTimer() === false){
			startTimer = this.checkStartTimer(io, socketID);
			if(startTimer){
				timerJustTurnedOn = true;
			}
		}
		else{
			startTimer = true;
		}

		if(startTimer === false){
			console.log("The start timer is false. Returning right away");
			return true;
		}

		//if the timer was just switched on, need to initialize timer for player 1
		if(timerJustTurnedOn){
			this.setPlayerWaitingOn(1);
			this.setPlayerOneStartDate(new Date());
			timeoutMilli = this.getPlayerTime(1) * 1000;
			this.setTimeoutObject(setTimeout(this.handleTimeout.bind(this), timeoutMilli, io));
			return true;
		}

		//if the timer was not just turned on, need to setup the other player
		//I need to know which player to setup
		endTimer = new Date();

		if(this.getPlayerWaitingOn() === 1 && this.getPlayerOneStartDate() !== null){
			seconds = Math.floor(((endTimer.getTime() - this.getPlayerOneStartDate().getTime())/1000));
			//console.log("Seconds passed since player 1 made a move: " + seconds);
			secondsRemaining = this.getPlayerTime(1);
			this.setPlayerTime(1, secondsRemaining - seconds);
			this.turnOffTimerObject();

			if(this.getPlayerTime(1) <= 0){
				this.executeGameplayTimeout(io);
				return false;
			}

			this.setPlayerWaitingOn(2); 
			timeoutMilli = this.getPlayerTime(2) * 1000;
			this.setTimeoutObject(setTimeout(this.handleTimeout.bind(this), timeoutMilli, io));
			this.setPlayerTwoStartDate(new Date());
			return true;
		}

		else if(this.getPlayerWaitingOn() === 2 && this.getPlayerTwoStartDate() !== null){
			seconds = Math.floor(((endTimer.getTime() - this.getPlayerTwoStartDate().getTime())/1000));
			//console.log("Seconds passed since player 2 has made a move: " + seconds);
			secondsRemaining = this.getPlayerTime(2);
			this.setPlayerTime(2, secondsRemaining - seconds);
			this.turnOffTimerObject();

			if(this.getPlayerTime(2) <= 0){
				this.executeGameplayTimeout(io);
				return false;
			}
	
			this.setPlayerWaitingOn(1);
			timeoutMilli = this.getPlayerTime(1) * 1000;
			this.setTimeoutObject(setTimeout(this.handleTimeout.bind(this), timeoutMilli, io));
			this.setPlayerOneStartDate(new Date());
			return true;
		}

	}

	handleRoomTimersWithExtraTime(io, socketID){

		let startTimer = false;
		let timerJustTurnedOn = false;
		let seconds = 0;
		let secondsRemaining = 0;
		let timeoutMilli = 0;
		let endTimer;

		if(this.getTimerInPlay() === false){
			return true;
		}

		if(this.getStartTimer() === false){
			startTimer = this.checkStartTimer(io, socketID);
			if(startTimer){
				timerJustTurnedOn = true;
			}
		}
		else{
			startTimer = true;
		}

		if(startTimer === false){
			return true;
		}

		//if the timer was just switched on, need to initialize timer for player 1
		if(timerJustTurnedOn){
			this.setPlayerWaitingOn(1);
			this.setPlayerOneStartDate(new Date());
			timeoutMilli = this.getPlayerTime(1) * 1000;
			this.setTimeoutObject(setTimeout(this.handleTimeout.bind(this), timeoutMilli, io));
			return true;
		}

		endTimer = new Date();

		if(this.getPlayerWaitingOn() === 1 && this.getPlayerOneStartDate() !== null){
		
			seconds = Math.floor(((endTimer.getTime() - this.getPlayerOneStartDate().getTime())/1000));
			secondsRemaining = this.getPlayerTime(1);
			this.setPlayerTime(1, secondsRemaining - seconds);
			this.turnOffTimerObject();

			if(seconds <= 2 && this.getPlayerTime(1) <= 30 && this.getPlayerOneExtraTime() > 0){
				this.setPlayerTime(1, this.getPlayerTime(1) + 3);
				this.setPlayerOneExtraTime(this.getPlayerOneExtraTime() - 3);
			}


			if(this.getPlayerTime(1) <= 0){
				this.executeGameplayTimeout(io);
				return false;
			}
		
			this.setPlayerWaitingOn(2);
			timeoutMilli = this.getPlayerTime(2) * 1000; 
			this.setTimeoutObject(setTimeout(this.handleTimeout.bind(this), timeoutMilli, io));
			this.setPlayerTwoStartDate(new Date());
			return true;
		}


		else if(this.getPlayerWaitingOn() === 2 && this.getPlayerTwoStartDate() !== null){
		
			seconds = Math.floor(((endTimer.getTime() - this.getPlayerTwoStartDate().getTime())/1000));
			secondsRemaining = this.getPlayerTime(2);
			this.setPlayerTime(2, secondsRemaining - seconds);
			this.turnOffTimerObject();

			if(seconds <= 2 && this.getPlayerTime(2) <= 30 && this.getPlayerTwoExtraTime() > 0){
				this.setPlayerTime(2, this.getPlayerTime(2) + 3);
				this.setPlayerTwoExtraTime(this.getPlayerTwoExtraTime() - 3);
			}

			if(this.getPlayerTime(2) <= 0){
				this.executeGameplayTimeout(io);
				return false;
			}
		
			this.setPlayerWaitingOn(1);
			timeoutMilli = this.getPlayerTime(1) * 1000;
			this.setTimeoutObject(setTimeout(this.handleTimeout.bind(this), timeoutMilli, io));
			this.setPlayerOneStartDate(new Date());
			return true;
		}

	}


	rematchResetRoomTimers(io){

		let playerOneSocketID = this.getGameRoomNode().getPlayerOneSocketID();
		let playerTwoSocketID = this.getGameRoomNode().getPlayerTwoSocketID();

		this.resetRoomTimers();
		this.getGameRoomNode().setPlayerOneSocketID(playerTwoSocketID);
		this.getGameRoomNode().setPlayerTwoSocketID(playerOneSocketID);
		this.setStartTimer(true);
		this.setPlayerOneMoved(true);
		this.setPlayerTwoMoved(true);
		this.setTimerInPlay(true);
		this.setPlayerWaitingOn(1);

	
		let timeoutObject = setTimeout(this.handleTimeout.bind(this), getGameModeStartSeconds(this.getGameModeNumber()) * 1000, io);
		this.setTimeoutObject(timeoutObject);
		let date = new Date();
		this.setPlayerOneStartDate(date);


	}

	resetRoomTimers(){

		this.setPlayerOneStartDate(null);
		this.setPlayerTwoStartDate(null);
		this.setPlayerTime(1, getGameModeStartSeconds(this.getGameModeNumber()));
		this.setPlayerTime(2, getGameModeStartSeconds(this.getGameModeNumber()));
		this.getGameRoomNode().setPlayerOneSocketID(null);
		this.getGameRoomNode().setPlayerTwoSocketID(null);
		this.setStartTimer(false);
		this.setPlayerOneMoved(false);
		this.setPlayerTwoMoved(false);	
		this.setTimerInPlay(false);
		this.turnOffTimerObject();
		this.setPlayerWaitingOn(-1);
		this.setTimeoutData(null);
		this.turnOffConfirmationTimeout();
		this.setPlayerOneExtraTime(getGameModeExtraSeconds(this.getGameModeNumber()));
		this.setPlayerTwoExtraTime(getGameModeExtraSeconds(this.getGameModeNumber()));
		this.getGameRoomNode().resetAwaitingPlayerResponse();
	
	}


	getOpponentUsername(data){

		let oppUsernameData = {
			playerUsername: null
		};

		if(data.playerUsername === this.getGameRoomNode().getPlayerOneUsername() && this.getGameRoomNode().getPlayerTwoConnected()){
			oppUsernameData.playerUsername = this.getGameRoomNode().getPlayerTwoUsername();
		}
		else if(data.playerUsername === this.getGameRoomNode().getPlayerTwoUsername() && this.getGameRoomNode().getPlayerOneConnected()){
			oppUsernameData.playerUsername = this.getGameRoomNode().getPlayerOneUsername();
		}

		return oppUsernameData;
	}


	processMoveMade(data){
	
		//returns true is statusOfGame is set to true
		if(this.getGameRoomNode().getStatusOfGame()){
			return false;
		}

		if(this.getGameRoomNode().getFirstMoveStatus() === false){
			this.getGameRoomNode().setFirstMoveStatus(true);
			this.getGameRoomNode().setFirstMoveSet(data);
			//console.log("First Move is now true");
			return false
		}
		else{
			this.getGameRoomNode().setStatusOfGame(true);
			this.getGameRoomNode().setInProgressStartDate(new Date().toLocaleString());
			//console.log("Status of Game is now true");
			return true;
		}

	}


	processStalemate(){

		this.turnOffNoProgressionTimer();
		
		if(this.getGameRoomNode().getStatusOfGame() === false){
			this.getGameRoomNode().setInProgressStartDate(new Date().toLocaleString());
		}
		
		this.getGameRoomNode().setStatusOfGame(true);
		this.getGameRoomNode().setIntermission(true);
		scoreFunctions.updateStalemates(this.getDatabase(), this.getGameRoomNode().getPlayerOneUsername(), this.getGameRoomNode().getPlayerTwoUsername());
		userVariables.totalGamesCompleted++;
		this.incrementGameModeCompletedGames(this.getGameModeNumber());
	}


	processDraw(data){

		if(data.handShakeComplete){

			this.getGameRoomNode().setIntermission(true);

			if(this.getGameRoomNode().getStatusOfGame() === false){
				this.getGameRoomNode().setInProgressStartDate(new Date().toLocaleString());
			}

			this.getGameRoomNode().setStatusOfGame(true);
			scoreFunctions.updateDraws(this.getDatabase(), this.getGameRoomNode().getPlayerOneUsername(), this.getGameRoomNode().getPlayerTwoUsername());
			userVariables.totalGamesCompleted++;
			this.incrementGameModeCompletedGames(this.getGameModeNumber());
			return true;
		}

		return false;
	}


	processAdditionalDraw(){
		this.turnOffNoProgressionTimer();
		
		if(this.getGameRoomNode().getStatusOfGame() === false){
			this.getGameRoomNode().setInProgressStartDate(new Date().toLocaleString());
		}
		
		this.getGameRoomNode().setStatusOfGame(true);
		this.getGameRoomNode().setIntermission(true);
		scoreFunctions.updateDraws(this.getDatabase(), this.getGameRoomNode().getPlayerOneUsername(), this.getGameRoomNode().getPlayerTwoUsername());
		userVariables.totalGamesCompleted++;
		this.incrementGameModeCompletedGames(this.getGameModeNumber());	
	}


	processNewGame(data){

		if(data.handShakeComplete){
			this.getGameRoomNode().setIntermission(false);
			return true;
		}

		return false;
	}


	processOpponentLeftDisconnect(room, socketID){

		let gameRoomNode = this.getGameRoomNode();
		let playerPosition = gameRoomNode.getPlayerWithSocketID(socketID);

		if(playerPosition === 1){
			console.log("Removing player one from room " + room);
			gameRoomNode.setPlayerOneUsername(null);
			gameRoomNode.setPlayersFound(0, 0);
			gameRoomNode.setPlayerConnected(1, false);
		}
		else{
			console.log("Removing player two from this room " + room);
			gameRoomNode.setPlayerTwoUsername(null);
			gameRoomNode.setPlayersFound(1, 0);
			gameRoomNode.setPlayerConnected(2, false);
		}

		gameRoomNode.decrementNumberOfPlayers();
	}


	processPotentialWinLossDueToDisconnect(io, socketID, room){
		
		//console.log("Disconnecting everyone from room: " + room);
		let gameRoomNode = this.getGameRoomNode();
		let playerPosition = gameRoomNode.getPlayerWithSocketID(socketID);

		let lostUsername = null;
		let wonUsername = null;
		let lostSocketID = null;
		let wonSocketID = null;

		if(playerPosition === 1){
			lostUsername = gameRoomNode.getPlayerOneUsername();
			wonUsername = gameRoomNode.getPlayerTwoUsername();
			lostSocketID = gameRoomNode.getPlayerOneSocketID();
			wonSocketID = gameRoomNode.getPlayerTwoSocketID();
		}
		else if(playerPosition === 2){
			lostUsername = gameRoomNode.getPlayerTwoUsername();
			wonUsername = gameRoomNode.getPlayerOneUsername();
			lostSocketID = gameRoomNode.getPlayerTwoSocketID();
			wonSocketID = gameRoomNode.getPlayerOneSocketID();
		}

		if(gameRoomNode.getIntermission() === false && gameRoomNode.getStatusOfGame() === true){
			scoreFunctions.updateWinsLosses(io, this.getNamespace(), room, this.getDatabase(), wonUsername, lostUsername, wonSocketID, lostSocketID);
			userVariables.totalGamesCompleted++;
			this.incrementGameModeCompletedGames(this.getGameModeNumber());
			return true;  
		}

		return false;
	}


	processCheckmate(io, room, winningPosition){
	
		let gameRoomNode = this.getGameRoomNode();

		this.turnOffNoProgressionTimer();
		
		if(gameRoomNode.getStatusOfGame() === false){
			gameRoomNode.setInProgressStartDate(new Date().toLocaleString());
		}
		
		gameRoomNode.setStatusOfGame(true);
		gameRoomNode.setIntermission(true);

		let wonUsername = null;
		let lostUsername = null;
		let lostSocketID = null;
		let wonSocketID = null;

		if(winningPosition === 1){
			wonUsername = gameRoomNode.getPlayerOneUsername();
			lostUsername = gameRoomNode.getPlayerTwoUsername();
			lostSocketID = gameRoomNode.getPlayerTwoSocketID();
			wonSocketID = gameRoomNode.getPlayerOneSocketID();
		}
		else if(winningPosition === 2){
			wonUsername = gameRoomNode.getPlayerTwoUsername();
			lostUsername = gameRoomNode.getPlayerOneUsername();
			lostSocketID = gameRoomNode.getPlayerOneSocketID();
			wonSocketID = gameRoomNode.getPlayerTwoSocketID();
		}
		
		//async in here
		scoreFunctions.updateWinsLosses(io, this.getNamespace(), room, this.getDatabase(), wonUsername, lostUsername, wonSocketID, lostSocketID);
		userVariables.totalGamesCompleted++;
		this.incrementGameModeCompletedGames(this.getGameModeNumber());
		
	}


	processLostOnTime(io, data, room){
		
		let gameRoomNode = this.getGameRoomNode();
		gameRoomNode.setIntermission(true);

		let playerPosition = data.player;
		let wonUsername = null;
		let lostUsername = null;
		let lostSocketID = null;
		let wonSocketID = null;

		if(playerPosition === 1){
			wonUsername = gameRoomNode.getPlayerTwoUsername();
			lostUsername = gameRoomNode.getPlayerOneUsername();
			lostSocketID = gameRoomNode.getPlayerOneSocketID();
			wonSocketID = gameRoomNode.getPlayerTwoSocketID();
		}
		else if(playerPosition === 2){
			wonUsername = gameRoomNode.getPlayerOneUsername();
			lostUsername = gameRoomNode.getPlayerTwoUsername();
			lostSocketID = gameRoomNode.getPlayerTwoSocketID();
			wonSocketID = gameRoomNode.getPlayerOneSocketID();
			
		}
		
		scoreFunctions.updateWinsLosses(io, this.getNamespace(), room, this.getDatabase(), wonUsername, lostUsername, wonSocketID, lostSocketID);
		userVariables.totalGamesCompleted++;
		this.incrementGameModeCompletedGames(this.getGameModeNumber());

	}


	processResignation(io, socketID, room){

		let gameRoomNode = this.getGameRoomNode();
		let playerPosition = gameRoomNode.getPlayerWithSocketID(socketID);

		let wonUsername = null;
		let lostUsername = null;
		let lostSocketID = null;
		let wonSocketID = null;

		if(gameRoomNode.getStatusOfGame() === false){
			gameRoomNode.setInProgressStartDate(new Date().toLocaleString());
		}
		
		gameRoomNode.setStatusOfGame(true);
		gameRoomNode.setIntermission(true);

		if(playerPosition === 1){
			wonUsername = gameRoomNode.getPlayerTwoUsername();
			lostUsername = gameRoomNode.getPlayerOneUsername();
			lostSocketID = gameRoomNode.getPlayerOneSocketID();
			wonSocketID = gameRoomNode.getPlayerTwoSocketID();
		}
		else if(playerPosition === 2){
			wonUsername = gameRoomNode.getPlayerOneUsername();
			lostUsername = gameRoomNode.getPlayerTwoUsername();
			lostSocketID = gameRoomNode.getPlayerTwoSocketID();
			wonSocketID = gameRoomNode.getPlayerOneSocketID();
			
		}

		scoreFunctions.updateWinsLosses(io, this.getNamespace(), room, this.getDatabase(), wonUsername, lostUsername, wonSocketID, lostSocketID);
		userVariables.totalGamesCompleted++;
		this.incrementGameModeCompletedGames(this.getGameModeNumber());
	}


	processHillWinLoss(io, room, winningPosition){

		let gameRoomNode = this.getGameRoomNode();
		
		this.turnOffNoProgressionTimer();
		
		if(gameRoomNode.getStatusOfGame() === false){
			gameRoomNode.setInProgressStartDate(new Date().toLocaleString());
		}
		
		gameRoomNode.setStatusOfGame(true);
		gameRoomNode.setIntermission(true);

		let wonUsername = null;
		let lostUsername = null;
		let lostSocketID = null;
		let wonSocketID = null;

		if(winningPosition === 1){
			wonUsername = gameRoomNode.getPlayerOneUsername();
			lostUsername = gameRoomNode.getPlayerTwoUsername();
			lostSocketID = gameRoomNode.getPlayerTwoSocketID();
			wonSocketID = gameRoomNode.getPlayerOneSocketID();
		}
		else if(winningPosition === 2){
			wonUsername = gameRoomNode.getPlayerTwoUsername();
			lostUsername = gameRoomNode.getPlayerOneUsername();
			lostSocketID = gameRoomNode.getPlayerOneSocketID();
			wonSocketID = gameRoomNode.getPlayerTwoSocketID();
		}

		//async in here
		scoreFunctions.updateWinsLosses(io, this.getNamespace(), room, this.getDatabase(), wonUsername, lostUsername, wonSocketID, lostSocketID);
		userVariables.totalGamesCompleted++;
		this.incrementGameModeCompletedGames(this.getGameModeNumber());
	}

	
	incrementGameModeCompletedGames(gameMode){

		if(gameMode === 0){
			userVariables.totalClassicGamesCompleted++;
		}
		else if(gameMode === 1){
			userVariables.totalKothGamesCompleted++;
		}
		else if(gameMode === 2){
			userVariables.totalCotlbGamesCompleted++;
		}
		else if(gameMode === 3){
			userVariables.totalSpeedGamesCompleted++;
		}
	}

	messageAdmin(io){

		let status = this.getGameRoomNode().getRoomStatus();
		status.gameMode = this.getGameModeNumber();
		status.roomNumber = userVariables.extractRoomNum(this.getRoomName());

		if(userVariables.singleAdminConnectionID !== null && this.getGameRoomNode().getWatchedStatus()){
			io.of('/admin').to(userVariables.singleAdminConnectionID).emit("regularString", status);
		}
	}

	waster(){
		return new Promise((resolve, reject) => {
	
			console.log("About to wait 10 secs");
	
				setTimeout(
					() => { resolve(1);}, 
					10000
				);
			
		});
	}

	
	printChanges(){
		
		if(this.getConfirmationTimeout() !== null){
			console.log("Confirmation Timeout Changed:");
			console.log(this.getConfirmationTimeout());
		}
		if(this.getTimeoutData() !== null){
			console.log("Timeout Data Changed:");
			console.log(this.getTimeoutData());
		}
		if(this.getPlayerOneStartDate() !== null){
			console.log("Player One Start Date Changed:");
			console.log(this.getPlayerOneStartDate());
		}
		if(this.getPlayerTwoStartDate() !== null){
			console.log("Player Two Start Date Changed:");
			console.log(this.getPlayerTwoStartDate());
		}
		if(this.getTimeoutObject() !== null){
			console.log("Timeout Object Changed:");
			console.log(this.getTimeoutObject());
		}
		if(this.getStartTimer() !== false){
			console.log("Start Timer Changed:");
			console.log(this.getStartTimer());
		}
		if(this.getPlayerOneMoved() !== false){
			console.log("Player One Moved Changed:");
			console.log(this.getPlayerOneMoved());
		}
		if(this.getPlayerTwoMoved() !== false){
			console.log("Player Two Moved Changed:");
			console.log(this.getPlayerTwoMoved());
		}
		if(this.getPlayerWaitingOn() !== -1){
			console.log("Player Waiting On Changed:");
			console.log(this.getPlayerWaitingOn());
		}
		if(this.getTimerInPlay() !== false){
			console.log("Timer In Play Changed");
			console.log(this.getTimerInPlay());
		}
		if(this.getNoProgressionWarningObject() !== null){
			console.log("No Progression Warning Object Changed:");
			console.log(this.getNoProgressionWarningObject());
		}
		if(this.getNoProgressionTimeoutObject() !== null){
			console.log("No Progression Timeout Object Changed:");
			console.log(this.getNoProgressionTimeoutObject());
		}
		if(this.getPlayerOneReservationTimeout() !== null){
			console.log("Player One Reservation Timeout Changed:");
			console.log(this.getPlayerOneReservationTimeout());
		}
		if(this.getPlayerTwoReservationTimeout() !== null){
			console.log("Player Two Reservation Timeout Changed:");
			console.log(this.getPlayerTwoReservationTimeout());
		}

		this.getGameRoomNode().printChanges();
	}

}


module.exports = {

	regularGameSeconds,
	noInitialMoveWarningSeconds,
	noInitialMoveTimeoutSeconds,
	noOpponentWarningSeconds,
	noOpponentTimeoutSeconds,
	noRematchWarningSeconds,
	noRematchTimeoutSeconds,
	speedGameSeconds,
	speedGameExtraSeconds,
	getGameModeStartSeconds,
	getGameModeExtraSeconds,
	gameTimerManager
};
