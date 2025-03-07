


const roomManagerClass = require('./gameRoomManager.js');
const userVariables = require('./userVariables.js');
const databaseAccess = require('./routes/api/databaseAccessFunctions.js');
const activePlayers = require('./activePlayers.js');

class chessGameManager{

	constructor(){
		this.gameRoomManagers = [];
	}

	addGameMode(initialRoomAmount, min, max, gameModeNumber, namespaceName, timerSeconds, extraTimerSeconds, database){
		let gameRoomManager = new roomManagerClass.gameRoomManager(initialRoomAmount, min, max, gameModeNumber, namespaceName, timerSeconds, extraTimerSeconds, database);
		this.gameRoomManagers.push(gameRoomManager);
	}

	getGameRoomManager(gameMode){
		return this.gameRoomManagers[gameMode];
	}


	async handleFindRoom(io, socket, managerIndex, data, callback){

		console.log("Start Of Handle Find Room");

		let returnMsg = {
			error: true,
			errorType: -1
		};

		let table = null;
		let usernamePasswordFailure = false;
		let recheckSocket = null;
		let thisGameRoomManager = this.getGameRoomManager(managerIndex);
		let namespace = thisGameRoomManager.getNamespaceName();
		let socketID = socket.id;

		console.log("This is the socket ID for findRoom: " + socketID);

		if(managerIndex === 0){
			table = 'classicstats';
		}
		else if(managerIndex === 1){
			table = 'kothstats';
		}
		else if(managerIndex === 2){
			table = 'cotlbstats';
		}
		else if(managerIndex === 3){
			table = 'speedstats';
		}
		else{
			returnMsg.errorType = 2;
			callback(returnMsg);
			userVariables.setupForceSocketDisconnect(io, namespace, socketID, 1);
			return;
		}


		//if(data === undefined || data === null || typeof(data) !== 'object'){
		if(this.checkData(data) === false){
			returnMsg.errorType = 0;
			callback(returnMsg);
			userVariables.setupForceSocketDisconnect(io, namespace, socketID, 1);
			return;
		}

		if(data.username === undefined || data.username === null || typeof(data.username) !== 'string' || data.username.length === 0 || data.username.length > 12 || data.username.toLowerCase() === "admin"){
			returnMsg.errorType = 0;
			callback(returnMsg);
			userVariables.setupForceSocketDisconnect(io, namespace, socketID, 1);
			return;
		}

		if(data.password === undefined || data.password === null || typeof(data.password) !== 'string' || data.password.length === 0 || data.password.length > 40){
			returnMsg.errorType = 1;
			callback(returnMsg);
			userVariables.setupForceSocketDisconnect(io, namespace, socketID, 1);
			return;
		}

		let usernameAmount = await databaseAccess.checkDuplicateUserInTable(table, data.username);


		if(usernameAmount === 0){
			returnMsg.errorType = 0;
			usernamePasswordFailure = true;
		}


		if(usernamePasswordFailure === false){
			let securityPassword = await databaseAccess.checkUserPassword(data.username);

			if(data.password !== securityPassword){
				returnMsg.errorType = 1;
				usernamePasswordFailure = true;
			}
		}

		recheckSocket = io.of(namespace).connected[socketID];

		if(recheckSocket === undefined || recheckSocket === null){
			console.log("Returning now, socket already disconnected");
			return;
		}


		if(usernamePasswordFailure){
			console.log("Username + Password Error, now returning");
			callback(returnMsg);
			userVariables.setupForceSocketDisconnect(io, namespace, socketID, 1);
			return;
		}

		console.log("Passed all checks");
		
		//let activeIndex = activePlayers.activePlayersObject.binarySearchActivePlayers(0, activePlayers.activePlayersObject.getActiveNodesLength() - 1, data.username)
		let activeIndex = activePlayers.activePlayersObject.binarySearchActiveNode(data.username);

		if(activeIndex !== -1){
			
			let check = activePlayers.activePlayersObject.checkActivePlayerNode(activeIndex, managerIndex);
			if(check){
				activePlayers.activePlayersObject.printActiveNodes();
			}
			else{
				let leaveRoom = activePlayers.activePlayersObject.getRoomNumberFromActiveNode(activeIndex, managerIndex);
				let disconnectSocketID = thisGameRoomManager.getSpecificRoom(leaveRoom).getGameRoomNode().getSocketIDWithUsername(data.username);
				let disconnectSocket = io.of(namespace).connected[disconnectSocketID];

				if(disconnectSocket !== undefined && disconnectSocket !== null){
					console.log("Disconnecting Other Socket");
					disconnectSocket.disconnect();
					console.log("Finished Disconnecting Other Socket");
				}
				else{
					console.log("No socket found");
					activePlayers.activePlayersObject.deleteActiveNodeWithIndex(activeIndex, managerIndex);
					if(thisGameRoomManager.getSpecificRoom(leaveRoom).getGameRoomNode().getNumberOfPlayers() === 2){
						userVariables.decrementCurrentOccupancy(managerIndex);
					}
					let resetFindRoomResult = thisGameRoomManager.getSpecificRoom(leaveRoom).getGameRoomNode().resetFindRoom(data.username);
					if(resetFindRoomResult !== -1){
						thisGameRoomManager.getSpecificRoom(leaveRoom).turnOffReservationTimeout(resetFindRoomResult);
					}
				}

			}
		}
		
		let foundRoom = thisGameRoomManager.reserveRoom(data);

		if(foundRoom.roomNumber !== -1 && foundRoom.playerPosition !== -1){
			let insertIndex = activePlayers.activePlayersObject.insertActivePlayerNode(data.username);
			activePlayers.activePlayersObject.setActivePlayerNode(insertIndex, managerIndex, foundRoom.roomNumber);
			activePlayers.activePlayersObject.printActiveNodes();
			thisGameRoomManager.getSpecificRoom(foundRoom.roomNumber).setReservationTimeoutObject(foundRoom.playerPosition, data.username);
		}

		foundRoom.error = false;
		callback(foundRoom);
		userVariables.setupForceSocketDisconnect(io, namespace, socketID, 1);
		console.log("End Of Handle Find Room");
	}



	async handleConnectToRoom(io, socket, managerIndex, data){

		console.log("Start Of Connect To Room");

		let usernamePasswordFailure = false;
		let socketID = socket.id;
		let thisGameRoomManager = this.getGameRoomManager(managerIndex);
		let namespace = thisGameRoomManager.getNamespaceName();
		let recheckSocket = null;

		console.log("This is the socket ID for connectRoom: " + socketID);

		if(this.checkData(data) === false){
			let returnData = {errorType: 0, success: false};
			socket.emit("getRoom", returnData);
			userVariables.setupForceSocketDisconnect(io, namespace, socketID, 2);
			return;
		}

		data.errorType = -1;

		if(data.getUsername === undefined || data.getUsername === null || typeof(data.getUsername) !== 'string' || data.getUsername.length === 0 || data.getUsername.length > 12 || data.getUsername.toLowerCase() === "admin"){
			usernamePasswordFailure = true;
			data.errorType = 0;
		}

		//console.log("In connect to room: before first username password check: " + socket.id);
	
		if(usernamePasswordFailure === false){
			let usernameFound = await databaseAccess.checkUsernameExists(data.getUsername);
			if(usernameFound < 1){
				usernamePasswordFailure = true;
				data.errorType = 0;
			}
		}
	
		if(usernamePasswordFailure === false){
			let securityPassword = await databaseAccess.checkUserPassword(data.getUsername);
			if(data.getPassword === undefined || data.getPassword === null || typeof(data.getPassword) !== 'string' || data.getPassword.length === 0 || data.getPassword.length > 40 || data.getPassword !== securityPassword){
				usernamePasswordFailure = true;
				data.errorType = 1;
			}
		}

		//console.log("In connect to room: before final username password check: " + socket.id);

		recheckSocket = io.of(namespace).connected[socketID];

		if(recheckSocket === undefined || recheckSocket === null){
			console.log("Returning now");
			return;
		}

		if(usernamePasswordFailure){
			console.log("Bad Username + Password in Connect To Room");
			data.success = false;
			recheckSocket.emit("getRoom", data);
			userVariables.setupForceSocketDisconnect(io, namespace, socketID, 2);
			return;
		}

		//console.log("In connect to room: after final username password check: " + socket.id);
		
		if(data.getRoomIndex === undefined || data.getRoomIndex === null || typeof(data.getRoomIndex) !== 'number' || data.getRoomIndex < 0 || data.getRoomIndex >= thisGameRoomManager.getAmountOfRooms()){
			console.log("Bad Room Index Value");
			data.success = false;
			recheckSocket.emit("getRoom", data);
			userVariables.setupForceSocketDisconnect(io, namespace, socketID, 2);
			return;
		}


		if(data.getPosition === undefined || data.getPosition === null || typeof(data.getPosition) !== 'number' || (data.getPosition === 1 || data.getPosition === 2) === false){
			console.log("Bad Position Value");
			data.success = false;
			recheckSocket.emit("getRoom", data);
			userVariables.setupForceSocketDisconnect(io, namespace, socketID, 2);
			return;
		}

		thisGameRoomManager.connectToRoomGeneral(io, recheckSocket, data);
		thisGameRoomManager.getSpecificRoom(data.getRoomIndex).messageAdmin(io);
		console.log("End Of Connect To Room");
		
	}

	

	handleRequestOppUsername(io, socket, managerIndex, data){

		let validSocket = this.checkValidSocketID(io, managerIndex, socket.id);
		if(validSocket.error){
			console.log("Socket Error in handle request opp username");
			return;
		}

		let thisGameRoomManager = this.getGameRoomManager(managerIndex);
		let namespaceName = validSocket.namespace;
		let room = validSocket.allRooms;
		let roomnum = validSocket.roomnumber;

		if(this.checkSocketIdInRoom(managerIndex, roomnum, socket.id) === false){
			return;
		}

		if(this.checkData(data) === false){
			console.log("In Request Opp Username: Bad Data");
			return;
		}

		if(this.checkRematchCounter(managerIndex, roomnum, data) === false){
			return;
		}

		data.playerUsername = thisGameRoomManager.getSpecificRoom(roomnum).getGameRoomNode().getUsernameWithSocketID(socket.id);
		let oppUsernameData = thisGameRoomManager.getSpecificRoom(roomnum).getOpponentUsername(data);
		io.of(namespaceName).in(room).emit("getOppUsername", oppUsernameData);
		
	}

	handleSendOppUsername(io, socket, managerIndex, data){

		let validSocket = this.checkValidSocketID(io, managerIndex, socket.id);
		if(validSocket.error){
			return;
		}

		let thisGameRoomManager = this.getGameRoomManager(managerIndex);
		let namespaceName = validSocket.namespace;
		let room = validSocket.allRooms;
		let roomnum = validSocket.roomnumber;

		if(this.checkSocketIdInRoom(managerIndex, roomnum, socket.id) === false){
			return;
		}

		if(this.checkData(data) === false){
			console.log("In Send Opp Username: Bad Data");
			return;
		}

		if(this.checkRematchCounter(managerIndex, roomnum, data) === false){
			return;
		}

		data.playerUsername = thisGameRoomManager.getSpecificRoom(roomnum).getGameRoomNode().getUsernameWithSocketID(socket.id);
		io.of(namespaceName).in(room).emit('getOppUsername', data);
	}

	handleDisconnecting(io, socket, managerIndex){

		console.log("Start Of Disconnect");

		let thisGameRoomManager = this.getGameRoomManager(managerIndex);
		let namespaceName = thisGameRoomManager.getNamespaceName();
		let rooms = Object.keys(io.nsps[namespaceName].adapter.sids[socket.id]);

		let returnData = {
			gameVictory: false
		};

		console.log("This is the socket ID for disconnecting: " + socket.id);

		if(rooms.length < 2){
			console.log("Disconnecting a non-room connected node");
			return;
		}

		console.log("Disconnecting a room connected node");
		
		let room = rooms[1];
		let roomnum = userVariables.extractRoomNum(room);
		let thisSpecificRoom = thisGameRoomManager.getSpecificRoom(roomnum);
		let gameRoomNode = thisSpecificRoom.getGameRoomNode();
		let playerUsername = gameRoomNode.getUsernameWithSocketID(socket.id);

		let playerPosition = gameRoomNode.getPlayerWithSocketID(socket.id);
		let otherSocketID;

		if(playerPosition === 1){
			otherSocketID = gameRoomNode.getPlayerTwoSocketID();
		}
		else{
			otherSocketID = gameRoomNode.getPlayerOneSocketID();
		}


		if(gameRoomNode.getNumberOfPlayers() === 2){
			userVariables.decrementCurrentOccupancy(managerIndex);
		}

		if(gameRoomNode.getStatusOfGame() || (gameRoomNode.getFirstMoveStatus() === true && playerPosition === 1)){
 
			console.log("Disconnecting everyone from room: " + room);
			activePlayers.activePlayersObject.deleteBothActivePlayerNodesInRoom(gameRoomNode, managerIndex);

			returnData.gameVictory = thisSpecificRoom.processPotentialWinLossDueToDisconnect(io, socket.id, room);
			thisSpecificRoom.resetRoomTimers();
			thisSpecificRoom.turnOffNoProgressionTimer();
			thisSpecificRoom.turnOffReservationTimeout(1);
			thisSpecificRoom.turnOffReservationTimeout(2);
			
			if(otherSocketID !== null){
				io.of(namespaceName).connected[otherSocketID].leave(room);
			}

			io.of(namespaceName).to(otherSocketID).emit('clientDisconnect', returnData);

			gameRoomNode.emptyRoom();
			thisGameRoomManager.printRoomInfo(roomnum);
			thisSpecificRoom.messageAdmin(io);
			userVariables.setupForceSocketDisconnect(io, namespaceName, otherSocketID, 3);

		}

		else if(gameRoomNode.getNumberOfPlayers() > 0){

			thisSpecificRoom.processOpponentLeftDisconnect(room, socket.id);
			activePlayers.activePlayersObject.deleteActivePlayerNode(playerUsername, managerIndex);

			if(gameRoomNode.getNumberOfPlayers() === 1){
				thisSpecificRoom.turnOffNoProgressionTimer();
				if(gameRoomNode.getPlayerOneConnected() || gameRoomNode.getPlayerTwoConnected()){
					thisSpecificRoom.setNoOpponentTimeoutObject(io);
				}
				else{
					thisSpecificRoom.setTimerInPlay(false);
				}
				gameRoomNode.removeSocketID(playerPosition);
				gameRoomNode.resetRoomDraws();
				thisSpecificRoom.messageAdmin(io);
			}

			if(gameRoomNode.getNumberOfPlayers() === 0){
				thisSpecificRoom.turnOffNoProgressionTimer();
				thisSpecificRoom.resetRoomTimers();
				gameRoomNode.emptyRoom();
				thisSpecificRoom.messageAdmin(io);
			}

			io.of(namespaceName).in(room).emit('opponentLeft');
		}
		else{
			console.log("No disconnect options used");
		}

		console.log("Active Nodes After Disconnect occurs");
		activePlayers.activePlayersObject.printActiveNodes();
		console.log("At the End Of Disconnect");
	}


	handleGameMove(io, socket, managerIndex, data){

		console.log("Start Of Handle Game Move");

		let validSocket = this.checkValidSocketID(io, managerIndex, socket.id);
		if(validSocket.error){
			console.log("Socket error, returning");
			return;
		}

		let namespaceName = validSocket.namespace;
		let room = validSocket.allRooms;
		let roomnum = validSocket.roomnumber;
		let thisGameRoomManager = this.getGameRoomManager(managerIndex);
		let thisSpecificRoom = thisGameRoomManager.getSpecificRoom(roomnum);

		if(this.checkSocketIdInRoom(managerIndex, roomnum, socket.id) === false){
			console.log("Socket not in room, returning");
			return;
		}

		if(this.checkData(data) === false){
			console.log("In Game Move: Bad Data");
			return;
		}

		if(this.checkGameMoveInput(data) === false){
			console.log("Game move input incorrect, returning");
			return;
		}

		console.log("Game Move Check Finished");


		let nowPlayingCheck = this.checkValidPlayerTurn(managerIndex, roomnum, socket.id, data);
		if(nowPlayingCheck.error){
			console.log("In Game Move: Wrong Player Playing, Returning");
			return;
		}

		if(thisSpecificRoom.getGameRoomNode().checkAwaitingPlayerResponse()){
			console.log("In Game Move: Awaiting Player Response, Returning");
			return;
		}

		let playerPosition = thisSpecificRoom.getPlayerWaitingOn();
		let continuedProcess = true;
	
		if(managerIndex === 3){
			continuedProcess = thisSpecificRoom.handleRoomTimersWithExtraTime(io, socket.id);
		}
		else{
			continuedProcess = thisSpecificRoom.handleRoomTimers(io, socket.id);
		}

		if(continuedProcess === false){
			console.log("Player that made move has run out of time, returning.");
			return;
		}

		data.player = nowPlayingCheck.playerNow;

		let statusTurnedOn = thisSpecificRoom.processMoveMade(data);

		if(statusTurnedOn){
			thisSpecificRoom.messageAdmin(io);
		}

		let secondsLeft = thisSpecificRoom.getPlayerTime(playerPosition);
		let otherSecondsLeft = thisSpecificRoom.getPlayerTime(nowPlayingCheck.oppNow);

		data.oppTimeLeft = secondsLeft;
		data.myTimeLeft = otherSecondsLeft;

		data.drawDenied = false;
		
		let returnData = thisSpecificRoom.getGameRoomNode().handleDrawRequestDenied(socket.id);
		
		if(returnData.playerOneDenied || returnData.playerTwoDenied){
			data.drawDenied = true;
		}

		console.log("In Game Move: Setting Now Playing To Player: " + nowPlayingCheck.oppNow);
		thisSpecificRoom.getGameRoomNode().setPlayerNowPlaying(nowPlayingCheck.oppNow);
		io.of(namespaceName).in(room).emit('clientMessage', data);
		console.log("End Of Game Move");
	}


	handleCheckmateStatus(io, socket, managerIndex, data){

		console.log("Start Of Checkmate Status");

		let validSocket = this.checkValidSocketID(io, managerIndex, socket.id);
		if(validSocket.error){
			console.log("Valid socket error, returning");
			return;
		}
		let namespaceName = validSocket.namespace;
		let room = validSocket.allRooms;
		let roomnum = validSocket.roomnumber;
		let thisGameRoomManager = this.getGameRoomManager(managerIndex);
		let thisSpecificRoom = thisGameRoomManager.getSpecificRoom(roomnum);

		if(this.checkSocketIdInRoom(managerIndex, roomnum, socket.id) === false){
			return;
		}

		if(thisSpecificRoom.getGameRoomNode().getPlayerOneConnected() === false || thisSpecificRoom.getGameRoomNode().getPlayerTwoConnected() === false){
			console.log("In Checkmate: Two players must be connected, returning");
			return;
		}

		if(this.checkData(data) === false){
			console.log("In Checkmate: Bad Data");
			return;
		}

		if(this.checkCheckmateInput(data) === false){
			return;
		}

		console.log("Checkmate Check Finished");

		let nowPlayingCheck = this.checkValidPlayerTurn(managerIndex, roomnum, socket.id, data.sendingSet);
		if(nowPlayingCheck.error){
			console.log("In Checkmate: Current Player Not Correct, Returning");
			return;
		}

		if(thisSpecificRoom.getGameRoomNode().checkAwaitingPlayerResponse()){
			console.log("In Checkmate: Awaiting Player Response, Returning");
			return;
		}

		thisSpecificRoom.processCheckmate(io, room, nowPlayingCheck.playerNow);
		thisSpecificRoom.turnOffTimerObject();
		thisSpecificRoom.setNoRematchTimeoutObject(io);
		thisGameRoomManager.printRoomInfo(roomnum);

		console.log("In Checkmate: Current Player Set To -1");
		thisSpecificRoom.getGameRoomNode().setPlayerNowPlaying(-1);

		data.checkmateStatus = true;
		data.player = nowPlayingCheck.oppNow;
		
		io.of(namespaceName).in(room).emit('clientCheckmate', data);

		thisSpecificRoom.messageAdmin(io);
		console.log("End Of Checkmate Status");	
	}

	handleStalemateStatus(io, socket, managerIndex, data){

		console.log("Start Of Stalemate");

		let validSocket = this.checkValidSocketID(io, managerIndex, socket.id);
		if(validSocket.error){
			console.log("Valid Socket Error, returning");
			return;
		}

		let namespaceName = validSocket.namespace;
		let room = validSocket.allRooms;
		let roomnum = validSocket.roomnumber;
		let thisGameRoomManager = this.getGameRoomManager(managerIndex);
		let thisSpecificRoom = thisGameRoomManager.getSpecificRoom(roomnum);

		if(this.checkSocketIdInRoom(managerIndex, roomnum, socket.id) === false){
			return;
		}

		if(thisSpecificRoom.getGameRoomNode().getPlayerOneConnected() === false || thisSpecificRoom.getGameRoomNode().getPlayerTwoConnected() === false){
			console.log("In Stalemate: Two players must be connected, returning");
			return;
		}

		if(this.checkData(data) === false){
			console.log("In Stalemate: Bad Data");
			return;
		}

		if(this.checkStalemateInput(data) === false){
			console.log("Stalemate Input Problem. Returning.")
			return;
		}
		
		console.log("Stalemate Check Finished");

		let nowPlayingCheck = this.checkValidPlayerTurn(managerIndex, roomnum, socket.id, data.sendingSet);
		if(nowPlayingCheck.error){
			console.log("In Stalemate: Current Player Not Correct, Returning");
			return;
		}

		if(thisSpecificRoom.getGameRoomNode().checkAwaitingPlayerResponse()){
			console.log("In Stalemate: Awaiting Player Response, Returning");
			return;
		}
	
		thisSpecificRoom.processStalemate();
		thisSpecificRoom.turnOffTimerObject();
		thisSpecificRoom.setNoRematchTimeoutObject(io);
		thisGameRoomManager.printRoomInfo(roomnum);

		console.log("In Stalemate: Current Player Set To -1");
		thisSpecificRoom.getGameRoomNode().setPlayerNowPlaying(-1);

		data.stalemateStatus = true;
		data.player = nowPlayingCheck.oppNow;

		io.of(namespaceName).in(room).emit('clientStalemate', data);
		thisSpecificRoom.messageAdmin(io);

		console.log("End Of Stalemate");
	}

	handlePlayerResignation(io, socket, managerIndex, data){

		console.log("Start Of Resignation");

		let validSocket = this.checkValidSocketID(io, managerIndex, socket.id);
		if(validSocket.error){
			console.log("Socket error, returning");
			return;
		}
		let namespaceName = validSocket.namespace;
		let room = validSocket.allRooms;
		let roomnum = validSocket.roomnumber;
		let thisGameRoomManager = this.getGameRoomManager(managerIndex);
		let thisSpecificRoom = thisGameRoomManager.getSpecificRoom(roomnum);

		if(this.checkSocketIdInRoom(managerIndex, roomnum, socket.id) === false){
			return;
		}

		if(thisSpecificRoom.getGameRoomNode().getPlayerOneConnected() === false || thisSpecificRoom.getGameRoomNode().getPlayerTwoConnected() === false){
			console.log("In Resignation: Two players must be connected, returning");
			return;
		}

		if(this.checkData(data) === false){
			console.log("In Resignation: Bad Data");
			return;
		}

		if(this.checkRematchCounter(managerIndex, roomnum, data) === false){
			return;
		}

		if(thisSpecificRoom.getGameRoomNode().getPlayerNowPlaying() === -1){
			console.log("In Resignation: Game Is Already Over, Returning");
			return;
		}

		if(thisSpecificRoom.getGameRoomNode().checkAwaitingPlayerResponse()){
			console.log("In Resignation: Awaiting Player Response, Returning");
			return;
		}

		let playerPosition = thisSpecificRoom.getGameRoomNode().getPlayerWithSocketID(socket.id);

		thisSpecificRoom.processResignation(io, socket.id, room);
		thisSpecificRoom.turnOffTimerObject();
		thisSpecificRoom.turnOffNoProgressionTimer();
		thisSpecificRoom.setNoRematchTimeoutObject(io);
		thisGameRoomManager.printRoomInfo(roomnum);

		console.log("In Resignation: Current Player Set To -1");
		thisSpecificRoom.getGameRoomNode().setPlayerNowPlaying(-1);
		
		data.resign = true;
		data.player = playerPosition;
		
		io.of(namespaceName).in(room).emit('resignation', data);
		thisSpecificRoom.messageAdmin(io);

		console.log("End Of Resignation");
	
	}

	handleConfirmInsufficientCheck(io, socket, managerIndex, data){

		console.log("Inside confirm insufficient check");

		let validSocket = this.checkValidSocketID(io, managerIndex, socket.id);
		if(validSocket.error){
			console.log("Socket error, returning");
			return;
		}

		let namespaceName = validSocket.namespace;
		let room = validSocket.allRooms;
		let roomnum = validSocket.roomnumber;
		let thisGameRoomManager = this.getGameRoomManager(managerIndex);
		let thisSpecificRoom = thisGameRoomManager.getSpecificRoom(roomnum);

		if(this.checkSocketIdInRoom(managerIndex, roomnum, socket.id) === false){
			return;
		}

		if(this.checkData(data) === false){
			console.log("In Insufficient Check: Bad Data");
			return;
		}

		if(this.checkRematchCounter(managerIndex, roomnum, data) === false){
			console.log("In Confirm Insufficient Check: Rematch Counter is off, Returning");
			return;
		}

		if(thisSpecificRoom.getGameRoomNode().getPlayerNowPlaying() === -1){
			console.log("In Confirm Insufficient Check: Game Is Already Over, Returning");
			return;
		}

		if(thisSpecificRoom.getGameRoomNode().checkAwaitingPlayerResponsePosition(socket.id) === false){
			console.log("In Confirm Insufficient Check: Wrong Player Answered");
			return;
		}
		
		let playerPosition = thisSpecificRoom.getGameRoomNode().getPlayerWithSocketID(socket.id);

		console.log("--------------------------------------------------------------");
		console.log("This is the timer object before handle confirm insufficient check goes off:");
		thisGameRoomManager.printRoomInfo(roomnum);
		console.log("--------------------------------------------------------------");

		console.log("MADE it past the checks in insufficient check");

		if(data.drawSet === undefined || data.drawSet === null || typeof(data.drawSet) !== 'boolean' || data.drawSet === false){
			console.log("Important: Timeout due to lack of time confirmed");
			data.player = playerPosition;
			thisSpecificRoom.processLostOnTime(io, data, room);
			thisSpecificRoom.turnOffConfirmationTimeout();
			thisSpecificRoom.setNoRematchTimeoutObject(io);
			thisSpecificRoom.getGameRoomNode().setPlayerNowPlaying(-1);
			thisGameRoomManager.printRoomInfo(roomnum);
			io.of(namespaceName).in(room).emit('timeLoss', thisSpecificRoom.getTimeoutData());
			thisSpecificRoom.messageAdmin(io);
		}

		if(data.drawSet){
			data.drawType = 3;
			console.log("Important: Additional Draw Condition Met");
			thisSpecificRoom.processAdditionalDraw(data);
			thisSpecificRoom.turnOffConfirmationTimeout();
			thisSpecificRoom.setNoRematchTimeoutObject(io);
			thisSpecificRoom.getGameRoomNode().setPlayerNowPlaying(-1);
			thisGameRoomManager.printRoomInfo(roomnum);
			io.of(namespaceName).in(room).emit('clientAdditionalDraw', data);
			thisSpecificRoom.messageAdmin(io);	
		}
	
	}

	handleServerDraw(io, socket, managerIndex, data){

		console.log("Start Of Draw");

		let validSocket = this.checkValidSocketID(io, managerIndex, socket.id);
		if(validSocket.error){
			console.log("Valid Socket error, returning");
			return;
		}
		let namespaceName = validSocket.namespace;
		let room = validSocket.allRooms;
		let roomnum = validSocket.roomnumber;
		let thisGameRoomManager = this.getGameRoomManager(managerIndex);
		let thisSpecificRoom = thisGameRoomManager.getSpecificRoom(roomnum);

		if(this.checkSocketIdInRoom(managerIndex, roomnum, socket.id) === false){
			return;
		}

		if(this.checkData(data) === false){
			console.log("In Draw: Bad Data");
			return;
		}

		if(this.checkRematchCounter(managerIndex, roomnum, data) === false){
			return;
		}

		if(thisSpecificRoom.getGameRoomNode().getPlayerNowPlaying() === -1){
			console.log("In Draw: Game Is Already Over, Returning");
			return;
		}

		if(thisSpecificRoom.getGameRoomNode().checkAwaitingPlayerResponse()){
			console.log("In Draw: Awaiting Player Response, Returning");
			return;
		}

		let drawRequest = thisSpecificRoom.getGameRoomNode().handleDrawRequest(socket.id);

		if(drawRequest.error){
			return;
		}

		if(drawRequest.handShakeComplete){
			//console.log("Turning Off Timer Due to Draw");
			thisSpecificRoom.processDraw(drawRequest);
			thisSpecificRoom.turnOffTimerObject();
			thisSpecificRoom.turnOffNoProgressionTimer();
			thisSpecificRoom.setNoRematchTimeoutObject(io);
			thisGameRoomManager.printRoomInfo(roomnum);
			console.log("In Draw: Current Player Set To -1");
			thisSpecificRoom.getGameRoomNode().setPlayerNowPlaying(-1);

		}
		

		io.of(namespaceName).in(room).emit('clientDraw', drawRequest);

		if(drawRequest.handShakeComplete){
			thisSpecificRoom.messageAdmin(io);
		}

		console.log("End of Draw");
	}


	handleServerNewGame(io, socket, managerIndex, data){

		//no async in here
		console.log("Start Of New Game");

		let validSocket = this.checkValidSocketID(io, managerIndex, socket.id);
		if(validSocket.error){
			console.log("Valid Socket error, returning");
			return;
		}
		let namespaceName = validSocket.namespace;
		let room = validSocket.allRooms;
		let roomnum = validSocket.roomnumber;
		let thisGameRoomManager = this.getGameRoomManager(managerIndex);
		let thisSpecificRoom = thisGameRoomManager.getSpecificRoom(roomnum);

		if(this.checkSocketIdInRoom(managerIndex, roomnum, socket.id) === false){
			console.log("In New Game: Socket ID not found, returning");
			return;
		}

		if(this.checkData(data) === false){
			console.log("In New Game: Bad Data");
			return;
		}

		if(this.checkRematchCounter(managerIndex, roomnum, data) === false){
			console.log("In New Game: Rematch Counter is Wrong, returning");
			return;
		}

		console.log("Rematch Check Finished");

		if(thisSpecificRoom.getGameRoomNode().getPlayerNowPlaying() !== -1){
			console.log("In New Game: Game Is Not Over Yet, Returning");
			return;
		}

		let newGameRequest = thisSpecificRoom.getGameRoomNode().handleRematchRequest(socket.id);

		if(newGameRequest.error){
			if(newGameRequest.limitReached){
				let limitMessage = {message: "Unable to Rematch: Max Number Of Rematches Reached. Connect To Another Room."};
				socket.emit("clientSimpleMessage", limitMessage);
			}
			return;
		}

		if(newGameRequest.handShakeComplete){

			thisSpecificRoom.processNewGame(newGameRequest);
			thisSpecificRoom.getGameRoomNode().resetRoomRematchRequests();
			thisSpecificRoom.getGameRoomNode().resetRoomDraws();
			thisSpecificRoom.rematchResetRoomTimers(io);
			thisSpecificRoom.turnOffNoProgressionTimer();
			thisSpecificRoom.getGameRoomNode().swapPlayerUsernames();
			thisSpecificRoom.getGameRoomNode().incrementRematchCounter();
			console.log("In Rematch: Current Player Set To 1");
			thisSpecificRoom.getGameRoomNode().setPlayerNowPlaying(1);
			thisGameRoomManager.printRoomInfo(roomnum);
		}

		io.of(namespaceName).in(room).emit('clientReset', newGameRequest);

		if(newGameRequest.handShakeComplete){
			thisSpecificRoom.messageAdmin(io);
		}

		console.log("End Of New Game");
	}

	handleServerAdditionalDraw(io, socket, managerIndex, data){

		console.log("Start Of Additional Draw");

		let validSocket = this.checkValidSocketID(io, managerIndex, socket.id);
		if(validSocket.error){
			console.log("Valid socket error, returning");
			return;
		}

		let namespaceName = validSocket.namespace;
		let room = validSocket.allRooms;
		let roomnum = validSocket.roomnumber;
		let thisGameRoomManager = this.getGameRoomManager(managerIndex);
		let thisSpecificRoom = thisGameRoomManager.getSpecificRoom(roomnum);

		if(this.checkSocketIdInRoom(managerIndex, roomnum, socket.id) === false){
			console.log("In Additional Draw: Bad Socket in Room");
			return;
		}

		if(thisSpecificRoom.getGameRoomNode().getPlayerOneConnected() === false || thisSpecificRoom.getGameRoomNode().getPlayerTwoConnected() === false){
			console.log("In Additional Draw: Two players must be connected, returning");
			return;
		}

		if(this.checkData(data) === false){
			console.log("In Additional Draw: Bad Data");
			return;
		}

		if(this.checkAdditionalDrawInput(data) === false){
			console.log("Bad Additional Draw Input");
			return;
		}

		console.log("Additonal Draw Check Finished");

		let nowPlayingCheck = this.checkValidPlayerTurn(managerIndex, roomnum, socket.id, data.sendingSet);
		if(nowPlayingCheck.error){
			console.log("In Additional Draw: Current Player Not Correct, Returning");
			return;
		}

		if(thisSpecificRoom.getGameRoomNode().checkAwaitingPlayerResponse()){
			console.log("In Additional Draw: Awaiting Player Response, Returning");
			return;
		}

		thisSpecificRoom.turnOffTimerObject();
		thisSpecificRoom.processAdditionalDraw(data);
		thisSpecificRoom.setNoRematchTimeoutObject(io);
		thisGameRoomManager.printRoomInfo(roomnum);

		console.log("In Additional Draw: Current Player Set To -1");
		thisSpecificRoom.getGameRoomNode().setPlayerNowPlaying(-1);

		data.drawSet = true;
		data.player = nowPlayingCheck.oppNow;

		io.of(namespaceName).in(room).emit('clientAdditionalDraw', data);
		thisSpecificRoom.messageAdmin(io);

		console.log("End Of Additional Draw");
		
	}

	handleServerHillWin(io, socket, managerIndex, data){

		console.log("Start Of King Of The Hill");

		let validSocket = this.checkValidSocketID(io, managerIndex, socket.id);
		if(validSocket.error){
			console.log("Valid socket error, returning");
			return;
		}
		let namespaceName = validSocket.namespace;
		let room = validSocket.allRooms;
		let roomnum = validSocket.roomnumber;
		let thisGameRoomManager = this.getGameRoomManager(managerIndex);
		let thisSpecificRoom = thisGameRoomManager.getSpecificRoom(roomnum);

		if(this.checkSocketIdInRoom(managerIndex, roomnum, socket.id) === false){
			console.log("In Hill Win: Socket Not In Room");
			return;
		}

		if(thisSpecificRoom.getGameRoomNode().getPlayerOneConnected() === false || thisSpecificRoom.getGameRoomNode().getPlayerTwoConnected() === false){
			console.log("In Hill Win: Two players must be connected, returning");
			return;
		}

		if(this.checkData(data) === false){
			console.log("In Hill Win: Bad Data");
			return;
		}

		if(this.checkHillWinInput(data) === false){
			console.log("In Hill Win: Input Incorrect, Returning");
			return;
		}

		let nowPlayingCheck = this.checkValidPlayerTurn(managerIndex, roomnum, socket.id, data.sendingSet);
		if(nowPlayingCheck.error){
			console.log("In Hill Win: Current Player Not Correct, Returning");
			return;
		}

		if(thisSpecificRoom.getGameRoomNode().checkAwaitingPlayerResponse()){
			console.log("In Hill Win: Awaiting Player Response, Returning");
			return;
		}

		thisSpecificRoom.processHillWinLoss(io, room, nowPlayingCheck.playerNow);
		thisSpecificRoom.turnOffTimerObject();
		thisSpecificRoom.setNoRematchTimeoutObject(io);
		thisGameRoomManager.printRoomInfo(roomnum);

		console.log("In Hill Win: Current Player Set To -1");
		thisSpecificRoom.getGameRoomNode().setPlayerNowPlaying(-1);

		data.hillWin = true;
		data.player = nowPlayingCheck.oppNow;

		io.of(namespaceName).in(room).emit('clientHillWin', data);
		thisSpecificRoom.messageAdmin(io);

		console.log("End Of King Of The Hill");

	}

	checkValidSocketID(io, managerIndex, socketID){


		let returnValue = {
			error: true,
			namespace: null,
			allRooms: null,
			roomnumber: -1
		};

		let namespaceName = this.getGameRoomManager(managerIndex).getNamespaceName();
		//let rooms = Object.keys(io.nsps[namespaceName].adapter.sids[socket.id]);
		let roomsObject = io.nsps[namespaceName].adapter.sids[socketID];
		if(roomsObject === undefined || roomsObject === null){
			return returnValue;
		}
		let rooms = Object.keys(roomsObject);
		if(this.checkRoomsLength(rooms) === false){
			return returnValue;
		}

		let room = rooms[1];
		let roomnum = userVariables.extractRoomNum(room);

		returnValue.error = false;
		returnValue.namespace = namespaceName;
		returnValue.allRooms = room;
		returnValue.roomnumber = roomnum;
		return returnValue;

	}

	checkData(data){
		if(data === undefined || data === null || typeof(data) !== 'object'){
			return false;
		}
		return true;
	}

	checkValidPlayerTurn(managerIndex, roomnum, socketID, data){

		let thisGameRoomManager = this.getGameRoomManager(managerIndex);
		let thisSpecificRoom = thisGameRoomManager.getSpecificRoom(roomnum);
		let player = thisSpecificRoom.getGameRoomNode().getPlayerWithSocketID(socketID);
		let nowPlayingCheck = thisSpecificRoom.getGameRoomNode().checkPlayerNowPlaying(player);

		nowPlayingCheck.error = true;

		if(nowPlayingCheck.check === false){
			//console.log("In Game Move: Wrong Player Playing, Returning");
			return nowPlayingCheck;
		}

		if(data.gameNumber === undefined || data.gameNumber === null || typeof(data.gameNumber) !== 'number'){
			return nowPlayingCheck;
		}

		if(data.gameNumber !== thisSpecificRoom.getGameRoomNode().getRematchCounter()){
			return nowPlayingCheck;
		}

			nowPlayingCheck.error = false;
			return nowPlayingCheck;
	}

	checkRematchCounter(managerIndex, roomnum, data){

		let thisGameRoomManager = this.getGameRoomManager(managerIndex);
		let thisSpecificRoom = thisGameRoomManager.getSpecificRoom(roomnum);

		if(data.gameNumber === undefined || data.gameNumber === null || typeof(data.gameNumber) !== 'number'){
			return false;
		}

		if(data.gameNumber !== thisSpecificRoom.getGameRoomNode().getRematchCounter()){
			return false;
		}

		return true;
	}

	checkGameMoveInput(data){

		if(data.moveType === undefined || data.moveType === null || typeof(data.moveType) !== 'string' || (data.moveType === 'regular'|| data.moveType === 'promotion' || data.moveType === 'castle' || data.moveType === 'enpassant') === false){
			return false;
		}

		if(data.sendingMoveSet === undefined || data.sendingMoveSet === null || Array.isArray(data.sendingMoveSet) === false){
			return false;
		}

		if(this.checkMoveArray(data.moveType, data.sendingMoveSet) === false){
			return false;
		}

		if(data.moveType === 'promotion'){

			if(data.promoteDOM === undefined || data.promoteDOM === null || typeof(data.promoteDOM) !== 'string'){
				return false;
			}

			if(data.promotePiece === undefined || data.promotePiece === null || typeof(data.promotePiece) !== 'string'){
				return false;
			}

			let pDOM = data.promoteDOM;
			let pP = data.promotePiece;

			if((pDOM === "whiteQueen" || pDOM === "whiteRook" || pDOM === "whiteKnight" || pDOM === "whiteBishop" || pDOM === "blackQueen" || pDOM === "blackRook" || pDOM === "blackKnight" || pDOM === "blackBishop") === false){
				return false;
			}

			if((pP === "wQ" || pP === "wR" || pP === "wN" || pP === "wB" || pP === "bQ" || pP === "bR" || pP === "bN" || pP === "bB") === false){
				return false;
			}
		}

		return true;

	}

	checkMoveArray(moveType, moveArray){

		if((moveType === 'regular' || moveType === 'promotion') && moveArray.length !== 4){
			return false;
		}

		if((moveType === 'enpassant' || moveType === 'castle') && moveArray.length !== 6){
			return false
		}

		let index = 0;
		let length = moveArray.length;

		while(index < length){
			if(moveArray[index] === undefined || moveArray[index] === null || typeof(moveArray[index]) !== 'number' || moveArray[index] < 0 || moveArray[index] > 7){
				return false;
			}
			index++;
		}

		return true;

	}

	checkAdditionalDrawInput(data){

		if(data.drawType === undefined || data.drawType === null || typeof(data.drawType) !== 'number' || (data.drawType === 1 || data.drawType === 2 || data.drawType === 4) === false){
			return false;
		}

		if(data.sendingSet === undefined || data.sendingSet === null || this.checkGameMoveInput(data.sendingSet) === false){
			return false;
		}

		return true;
	}

	checkCheckmateInput(data){

		if(data.sendingSet === undefined || data.sendingSet === null || this.checkGameMoveInput(data.sendingSet) === false){
			return false;
		}

		return true;
	}

	
	checkStalemateInput(data){

		if(data.sendingSet === undefined || data.sendingSet === null || this.checkGameMoveInput(data.sendingSet) === false){
			return false;
		}

		return true;
	}

	checkHillWinInput(data){

		if(data.sendingSet === undefined || data.sendingSet === null || this.checkGameMoveInput(data.sendingSet) === false){
			return false;
		}

		return true;
	}
	


	checkRoomsLength(rooms){

		if(rooms.length === undefined || rooms.length === null || typeof(rooms.length) !== 'number' || rooms.length < 2){
			//console.log("Not connected to specific room");
			return false;
		}
		return true;
	}

	
	checkSocketIdInRoom(managerIndex, roomnum, socketID){

		let thisGameRoomManager = this.getGameRoomManager(managerIndex);
		let thisSpecificRoom = thisGameRoomManager.getSpecificRoom(roomnum);

		if(socketID === thisSpecificRoom.getGameRoomNode().getPlayerOneSocketID()){
			return true;
		}
		
		if(socketID === thisSpecificRoom.getGameRoomNode().getPlayerTwoSocketID()){
			return true;
		}

		return false;
	}

	checkUsernameInput(username){

		if(username === undefined || username === null || typeof(username) !== 'string' || username.length > 14 || username.length <= 0){
			return false;
		}

		return true;
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


	/*
	sleep(){
		return new Promise( (resolve) => {
			setTimeout(resolve, 10000);
		});
	}
	*/

}


let chessGameManagerObject = new chessGameManager();


module.exports = {

	chessGameManager,
	chessGameManagerObject
};


	