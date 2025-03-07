

const userVariables = require('./userVariables.js');
const chessManager = require('./chessGameManager.js');
const activePlayers = require('./activePlayers.js');
const socketIOConnections = require('./socketConnections.js');

let adminWatchedRooms = [];
let adminSessionTime = 300;
let adminSessionTimeout = null;
let adminSessionWarningTime = 150;
let adminSessionWarningTimeout = null;
let adminSessionExtensionRemainder = 0;

module.exports = function(io){

	let nspAdmin = io.of('/admin');

	nspAdmin.on('connection', (socket) => {

		console.log("A connection to admin made");

		let updateSuccess = null;
		let updateConfirmed = true;
		let removedConnectionFromList = false;

		socket.on('verifyAdmin', (data) => {

			if(data === undefined || data === null || typeof(data) !== 'object'){
				return;
			}

			socketIOConnections.ipSocketConnectionsContainerObject.removeConnectionFromIP(socket.request.connection.remoteAddress, socket.id);
			removedConnectionFromList = true;

			if(data.admin === userVariables.adminPassword){

				let oldAdminSocketID = userVariables.singleAdminConnectionID;
				userVariables.singleAdminConnectionID = socket.id;

				if(userVariables.currentSessionStartDate !== null){
					userVariables.lastSessionStartDate = userVariables.currentSessionStartDate;
				}
				userVariables.currentSessionStartDate = new Date().toLocaleString();
				userVariables.totalAdminSignIns++;

				if(oldAdminSocketID !== null){
					let oldAdminSocket = io.of('/admin').connected[oldAdminSocketID];
					oldAdminSocket.emit('disconnectClientAdmin', 2);
					unWatchRooms();
					adminWatchedRooms.splice(0, adminWatchedRooms.length);
					clearWarningTimeoutAdmin();
					clearTimeoutAdmin();
				}
				
				socket.emit("startSession");
				console.log("Setting New Socket ID");

				adminSessionWarningTimeout = setTimeout(warningTimeoutAdmin, adminSessionWarningTime * 1000, io);
				adminSessionTimeout = setTimeout(timeoutAdmin, adminSessionTime * 1000, io);
				adminSessionExtensionRemainder = 2;

			}
			else{
				console.log("Incorrect Admin Password: Disconnecting Socket");
				socket.disconnect();
			}

		});

		socket.on('disconnecting', () => {

			if(updateConfirmed && removedConnectionFromList === false){
				socketIOConnections.ipSocketConnectionsContainerObject.removeConnectionFromIP(socket.request.connection.remoteAddress, socket.id);
			}

			if(socket.id === userVariables.singleAdminConnectionID){
				clearWarningTimeoutAdmin();
				clearTimeoutAdmin();
				userVariables.singleAdminConnectionID = null;
				unWatchRooms();
				adminWatchedRooms.splice(0, adminWatchedRooms.length);
				adminSessionExtensionRemainder = 0;
				console.log("Admin Socket Disconnected");
			}

		});

		socket.on("adminJustUnwatch", () => {
			
			if(socket.id !== userVariables.singleAdminConnectionID){
				return;
			}
			console.log("Called Just-Unwatch Rooms");
			unWatchRooms();
			adminWatchedRooms.splice(0, adminWatchedRooms.length);
		});

		socket.on('requestLongerSession', (data) => {

			if(socket.id !== userVariables.singleAdminConnectionID){
				return;
			}

			if(data === undefined || data === null || typeof(data) !== 'object'){
				console.log("Null Value Sent");
				return;
			}

			
			if(checkActionPassword(data) === false){
				let passwordData = {error: 2};
				socket.emit("clientPasswordError", passwordData);
				return;
			}

			if(adminSessionExtensionRemainder < 1){
				return;
			}

			adminSessionExtensionRemainder--;
			clearWarningTimeoutAdmin();
			clearTimeoutAdmin();
			adminSessionWarningTimeout = setTimeout(warningTimeoutAdmin, adminSessionWarningTime * 1000, io);
			adminSessionTimeout = setTimeout(timeoutAdmin, adminSessionTime * 1000, io);
			socket.emit("extensionGranted");
			
		});

		socket.on("requestTopPanelValues", (data) => {

			if(socket.id !== userVariables.singleAdminConnectionID){
				return;
			}

			if(data === undefined || data === null || typeof(data) !== 'object'){
				console.log("Null Value Sent");
				return;
			}

			if(checkGameModeInput(data) === false){
				return;
			}

			let specificTotalCount = getSpecificTotalCount(data.gameMode);
			let specificHighestOccupancy = userVariables.getHighestOccupancy(data.gameMode);
			let specificTimeOccupancy = userVariables.getHighestOccupancyTime(data.gameMode);
		
			let result = {
				serverStart: userVariables.serverStartDate,
				currentSession: userVariables.currentSessionStartDate,
				lastAdmin: userVariables.lastSessionStartDate,
				totalAdmin: userVariables.totalAdminSignIns,
				totalGames: userVariables.totalGamesCompleted,
				specificTotal: specificTotalCount,
				specificOccupancy: specificHighestOccupancy,
				specificTime: specificTimeOccupancy.highestTime,
				timeCountingBoolean: specificTimeOccupancy.currentlyCounting
			};

			socket.emit("clientTopPanelValues", result);

		});

		socket.on("requestTopPanelSpecificValues", (data) => {

			if(socket.id !== userVariables.singleAdminConnectionID){
				return;
			}

			if(data === undefined || data === null || typeof(data) !== 'object' ){
				console.log("Null Value Sent");
				return;
			}

			if(checkGameModeInput(data) === false){
				return;
			}

			let specificTotalCount = getSpecificTotalCount(data.gameMode);
			let specificHighestOccupancy = userVariables.getHighestOccupancy(data.gameMode);
			let specificTimeOccupancy = userVariables.getHighestOccupancyTime(data.gameMode);

			let result = {
				totalGames: userVariables.totalGamesCompleted,
				specificTotal: specificTotalCount,
				specificOccupancy: specificHighestOccupancy,
				specificTime: specificTimeOccupancy.highestTime,
				timeCountingBoolean: specificTimeOccupancy.currentlyCounting
			};

			socket.emit("clientTopPanelSpecificValues", result);

		});

		socket.on('requestAmountOfRoomVariables', (data) => {

			if(socket.id !== userVariables.singleAdminConnectionID){
				return;
			}

			if(data === undefined || data === null || typeof(data) !== 'object' ){
				console.log("Null Value Sent");
				return;
			}

			if(checkGameModeInput(data) === false){
				return;
			}

			let result = chessManager.chessGameManagerObject.getGameRoomManager(data.gameMode).getInfoNode();

			socket.emit("clientAmountOfRoomVariables", result);

		});


		socket.on('serverAdjustAmountOfRooms', (data) => {


			if(socket.id !== userVariables.singleAdminConnectionID){
				return;
			}

			if(data === undefined || data === null || typeof(data) !== 'object'){
				console.log("Null Value Sent");
				return;
			}

			
			if(checkActionPassword(data) === false){
				let passwordData = {error: 1};
				socket.emit("clientPasswordError", passwordData);
				return;
			}

			if(checkGameModeInput(data) === false){
				console.log("Bad Game Mode");
				return;
			}

			if(data.newAmount === undefined || data.newAmount === null || typeof(data.newAmount) !== 'number'){
				console.log("Canceling before error");
				return;
			}

			//if result is false, then amount was not adjusted
			let returnMessage = adjustRoomAmount(io, data);
			data.returnMessage = returnMessage;


			if(returnMessage.result === false){
				console.log("Amount Not Adjusted, Not Valid Amount");
				socket.emit('clientUpdateRoomsAvailable', data);
				return;
			}

			if(returnMessage.result){
				console.log("Amount Of Rooms Adjusted");
				socket.emit('clientUpdateRoomsAvailable', data);
				return;
			}

		});

		socket.on('serverRoomNodeKick', (data) => {

			if(socket.id !== userVariables.singleAdminConnectionID){
				return;
			}

			if(data === undefined || data === null || typeof(data) !== 'object'){
				console.log("Null Value Sent");
				return;
			}

			
			if(checkActionPassword(data) === false){
				let passwordData = {error: 1};
				socket.emit("clientPasswordError", passwordData);
				return;
			}

			if(checkIndexingInput(data) === false){
				return;
			}

			let result = applyRoomKick(io, data);

			if(result){
				sendRoomNodeUpdateToAdmin(io, data.gameMode, data.roomNumber);
			}

		});


		socket.on('serverRangeRoomNodeKick', (data) => {

			if(socket.id !== userVariables.singleAdminConnectionID){
				return;
			}

			if(data === undefined || data === null || typeof(data) !== "object"){
				console.log("Null Value Sent");
				return;
			}

			
			if(checkActionPassword(data) === false){
				let passwordData = {error: 1};
				socket.emit("clientPasswordError", passwordData);
				return;
			}

			let data1 = {
				gameMode: data.gameMode,
				roomNumber: data.start
			};

			let data2 = {
				gameMode: data.gameMode,
				roomNumber: data.end
			};

			if(checkIndexingInput(data1) === false){
				console.log("Bad Indexing Input in Range");
				return;
			}

			if(checkIndexingInput(data2) === false){
				console.log("Bad Indexing Input in Range 2");
				return;
			}

			if(data.start > data.end){
				return;
			}

			let changeArray = [];
			let length = data.end + 1;
			let index = data.start;

			while(index < length){
				changeArray.push(getRoomNode(data.gameMode, index));
				index++;
			}

			rangeApplyRoomKick(io, changeArray);

			sendRangeRoomNodeUpdateToAdmin(io, changeArray);

		});


		socket.on('serverRoomNodeOffOrOn', (data) => {

			if(socket.id !== userVariables.singleAdminConnectionID){
				return;
			}

			if(data === undefined || data === null || typeof(data) !== 'object'){
				console.log("Null Value Sent");
				return;
			}

			if(checkActionPassword(data) === false){
				let passwordData = {error: 1};
				socket.emit("clientPasswordError", passwordData);
				return;
			}

			if(checkIndexingInput(data) === false){
				return;
			}

			if(checkChangeTypeInput(data) === false){
				return;
			}

			let result = turnRoomOffOrOn(io, data);

			if(result){
				sendRoomNodeUpdateToAdmin(io, data.gameMode, data.roomNumber);
			}

		});

		socket.on('serverRangeRoomNodeOffOrOn', (data) => {

			if(socket.id !== userVariables.singleAdminConnectionID){
				return;
			}

			if(data === undefined || data === null || typeof(data) !== "object"){
				console.log("Null Value Sent");
				return;
			}

			if(checkActionPassword(data) === false){
				let passwordData = {error: 1};
				socket.emit("clientPasswordError", passwordData);
				return;
			}

			let data1 = {
				gameMode:  data.gameMode,
				roomNumber:  data.start
			};

			let data2 = {
				gameMode: data.gameMode,
				roomNumber: data.end
			};

			if(checkIndexingInput(data1) === false){
				return;
			}

			if(checkIndexingInput(data2) === false){
				return;
			}

			if(data.start > data.end){
				return;
			}

			if(checkChangeTypeInput(data) === false){
				return;
			}


			let changeArray = [];
			let length = data.end + 1;
			let index = data.start;
			let i = 0;

			while(index < length){
				changeArray.push(getRoomNode(data.gameMode, index));
				changeArray[i].changeType = data.changeType;
				index++;
				i++;
			}
			
			rangeTurnRoomOffOrOn(io, changeArray);

			sendRangeRoomNodeUpdateToAdmin(io, changeArray);

		});

		socket.on('requestRoomData', (data) => {

			if(socket.id !== userVariables.singleAdminConnectionID){
				return;
			}

			console.log("Inside request room data");

			if(data === undefined || data === null || typeof(data) !== "object"){
				console.log("Null Value Sent");
				return;
			}

			if(checkActionPassword(data) === false){
				let passwordData = {error: 1};
				socket.emit("clientPasswordError", passwordData);
				return;
			}

			if(checkGameModeInput(data) === false){
				return;
			}

			if(data.start === undefined || data.start === null || typeof(data.start) !== 'number' || data.end === undefined || data.end === null || typeof(data.end) !== 'number'){
				console.log("Canceling Before Error");
				return;
			}

			if(data.getAll === undefined || data.getAll === null || typeof(data.getAll) !== 'boolean'){
				console.log("Canceling Before Error");
				return;
			}

			let gameManager = chessManager.chessGameManagerObject.getGameRoomManager(data.gameMode);
			let length = gameManager.getAmountOfRooms();
			let arrayOfRooms = [];
			let index = 0;

			if(data.getAll){
				while(index < length){
					let watchNode = getWatchNode(data.gameMode, index);
					arrayOfRooms.push(watchNode);
					index++;
				}
			}

			else if(data.getAll === false){

				//remember this is including, and it starts at 1 and ends at the last node
				if( (data.start === -1 && data.end === -1) ||
					(data.start !== -1 && (data.start < 0 || data.start >= length || (data.end !== -1 && data.start > data.end))) || 
					(data.end !== -1 && (data.end < 0 || data.end >= length))
				  ){
					console.log("Bad Number Value");
					return;
				}

				console.log("Passed all checks");
				
				if(data.start !== -1){
					index = data.start;
				}

				if(data.end !== -1){
					length = data.end;
				}
				else{
					length--;
				}

				if(index === length){
					let watchNode = getWatchNode(data.gameMode, index);
					arrayOfRooms.push(watchNode);
				}
				else if(index !== length){
					while(index <= length){
						let watchNode = getWatchNode(data.gameMode, index);
						arrayOfRooms.push(watchNode);
						index++;
					}
				}
			}

			console.log("About to adjust watched rooms");
			console.log(arrayOfRooms);
			let allResults = adjustWatchedRooms(arrayOfRooms);
			console.log(adminWatchedRooms);
			printWatchedState();

			if(allResults === null){
				return;
			}

			let returnData = {
				allResults: allResults,
				gameMode: data.gameMode
			};

			io.of('/admin').to(userVariables.singleAdminConnectionID).emit("clientRoomData", returnData);


		});

		updateSuccess = socketIOConnections.ipSocketConnectionsContainerObject.updateConnection(socket.request.connection.remoteAddress, '/admin', socket.id);

		if(updateSuccess.found){
			userVariables.setSocketRemovedFromList(io, socketIOConnections.ipSocketConnectionsContainerObject.getSocketSuffix('/admin', socket.id), true);
		}
		else if(updateSuccess.found === false){
			updateConfirmed = false;
			if(updateSuccess.otherSocketID !== null){
				userVariables.forceSocketDisconnect(io, updateSuccess.otherNamespace, updateSuccess.otherSocketID, 7);
			}
			userVariables.forceSocketDisconnect(io, '/admin', socket.id, 7);
		}

	});

}

function getSpecificTotalCount(gameMode){

	if(gameMode === 0){
		return userVariables.totalClassicGamesCompleted;
	}
	else if(gameMode === 1){
		return userVariables.totalKothGamesCompleted;
	}
	else if(gameMode === 2){
		return userVariables.totalCotlbGamesCompleted;
	}
	else if(gameMode === 3){
		return userVariables.totalSpeedGamesCompleted;
	}

	return null;
}

function clearWarningTimeoutAdmin(){
	if(adminSessionWarningTimeout !== null){
		clearTimeout(adminSessionWarningTimeout);
		adminSessionWarningTimeout = null;
	}
}

function clearTimeoutAdmin(){
	if(adminSessionTimeout !== null){
		clearTimeout(adminSessionTimeout);
		adminSessionTimeout = null;
	}
}

function warningTimeoutAdmin(io){

	clearWarningTimeoutAdmin();
	let adminSocket = io.of('/admin').connected[userVariables.singleAdminConnectionID];
	adminSocket.emit("adminTimeoutWarning");
}

function timeoutAdmin(io){

	clearTimeoutAdmin();
	let adminSocketID = userVariables.singleAdminConnectionID;
	userVariables.singleAdminConnectionID = null;
	let adminSocket = io.of('/admin').connected[adminSocketID];
	adminSocket.emit('disconnectClientAdmin', 1);
	unWatchRooms();
	adminWatchedRooms.splice(0, adminWatchedRooms.length);
	adminSessionExtensionRemainder = 0;

}

function unWatchRooms(){

	let index = 0;
	let length = adminWatchedRooms.length;
	
	while(index < length){
		let watchNode = adminWatchedRooms[index];
		let room = chessManager.chessGameManagerObject.getGameRoomManager(watchNode.gameType).getSpecificRoom(watchNode.roomNumber).getGameRoomNode();
		room.setWatchedStatus(false);
		index++;
	}
}

function printWatchedState(){

	let index = 0;
	let length = adminWatchedRooms.length;

	while(index < length){
		let watchNode = adminWatchedRooms[index];
		let roomWatch = chessManager.chessGameManagerObject.getGameRoomManager(watchNode.gameType).getSpecificRoom(watchNode.roomNumber).getGameRoomNode().getWatchedStatus();
		console.log(roomWatch);
		index++;
	}
}

function checkActionPassword(data){
	if(data.actionPassword === undefined || data.actionPassword === null || typeof(data.actionPassword) !== 'string' || data.actionPassword !== userVariables.adminActionPassword){
		console.log("Invalid Action Password");
		return false;
	}

	return true;
}


function checkGameModeInput(data){

	if(data.gameMode === undefined || data.gameMode === null || typeof(data.gameMode) !== 'number' || data.gameMode > 3 || data.gameMode < 0){
		console.log("Bad Game Mode Number");
		return false;
	}

	return true;
}

function checkChangeTypeInput(data){
	
	if(data.changeType === undefined || data.changeType === null || typeof(data.changeType) !== 'number' || data.changeType < 1 || data.changeType > 2){
		console.log("Bad Change Type Input");
		return false;
	}

	return true;
}

function checkIndexingInput(data){

	if(checkGameModeInput(data) === false){
		return false;
	}

	let gameManager = chessManager.chessGameManagerObject.getGameRoomManager(data.gameMode);
	let amountNode = gameManager.getInfoNode();
	
	//amountNode.max is the max amount of rooms that can be allocated to a game mode
	//should use .amount
	console.log("This is the max: " + amountNode.amount);

	if(data.roomNumber === undefined || data.roomNumber === null || typeof(data.roomNumber) !== 'number' || data.roomNumber < 0 || data.roomNumber >= amountNode.amount){
		console.log("Bad Room Number");
		return false;
	}

	return true;
		
}


function getWatchNode(type, number){

	//"classic" is type 0
	//"koth" is type 1
	//"cotlb" is type 2
	//"speed" is type 3

	let watchNode = {
		gameType: parseInt(type),
		roomNumber: parseInt(number)
	};
	return watchNode;
}


function adjustRoomAmount(io, changeObject){

	let gameManager = chessManager.chessGameManagerObject.getGameRoomManager(changeObject.gameMode);
	let amountNode = gameManager.getInfoNode();
	let newAmount = changeObject.newAmount;

	let returnMessage = {
		result: false,
		message: 0
	};

	if(newAmount === undefined || typeof(newAmount) !== 'number'){
		return returnMessage;
	}

	if(newAmount < amountNode.min){
		returnMessage.message = 1;
		return returnMessage;
	}

	if(newAmount > amountNode.max){
		returnMessage.message = 2;
		return returnMessage;
	}

	let currentLength = gameManager.getAmountOfRooms();
	let startIndex = -1;
	let amountToDelete = 0;
	let amountToAdd = 0;
	
	if(newAmount === currentLength){
		returnMessage.result = true;
		return returnMessage;
	}

	if(newAmount < currentLength){

		let index;
		startIndex = newAmount;
		index = startIndex;
		amountToDelete = currentLength - newAmount;

		while(index < currentLength){

			let data = {
				gameMode: changeObject.gameMode,
				roomNumber: index
			};

			applyRoomKick(io, data);
			index++;
		}

		gameManager.decreaseGameTimerManagerList(newAmount);
		deleteFromWatchedRooms(changeObject);
		returnMessage.result = true;
		return returnMessage;
	}

	if(newAmount > currentLength){
		gameManager.increaseGameTimerManagerList(newAmount);
		returnMessage.result = true;
		return returnMessage;
	}

	return returnMessage;

}

function deleteFromWatchedRooms(changeObject){

	let tooHigh = changeObject.newAmount;
	let mode = changeObject.gameMode;
	let index = 0;
	let length = adminWatchedRooms.length;
	let currentRoom = null;

	if(tooHigh < 0){
		return false;
	}

	while(index < length){

		currentRoom = adminWatchedRooms[index];

		if(currentRoom.gameType === mode && currentRoom.roomNumber >= tooHigh){
			adminWatchedRooms.splice(index, 1);
			length = adminWatchedRooms.length;
			continue;
		}

		index++;
	}

	return true;

}


function rangeTurnRoomOffOrOn(io, array){

	let length = array.length;
	let index = 0;

	while(index < length){

		turnRoomOffOrOn(io, array[index]);
		index++;
	}
}

function turnRoomOffOrOn(io, changeObject){

	let gameManager = chessManager.chessGameManagerObject.getGameRoomManager(changeObject.gameMode);

	if(gameManager === null){
		return
	}

	let playerOneSocketID = gameManager.getSpecificRoom(changeObject.roomNumber).getGameRoomNode().getPlayerOneSocketID();
	let playerTwoSocketID = gameManager.getSpecificRoom(changeObject.roomNumber).getGameRoomNode().getPlayerTwoSocketID();
	let namespace = gameManager.getNamespaceName();

	let dataToSend = {
		message: null
	}

	if(changeObject.changeType === 1){

		gameManager.getSpecificRoom(changeObject.roomNumber).getGameRoomNode().setRoomOnStatus(false);
		dataToSend.message = "Admin Has Turned This Room Off; Players Cannot Rematch";

		if(playerOneSocketID !== null){
			io.of(namespace).to(playerOneSocketID).emit('clientSimpleMessage', dataToSend);
		}

		if(playerTwoSocketID !== null){
			io.of(namespace).to(playerTwoSocketID).emit('clientSimpleMessage', dataToSend);
		}
		return true;
	}

	else if(changeObject.changeType === 2){

		gameManager.getSpecificRoom(changeObject.roomNumber).getGameRoomNode().setRoomOnStatus(true);
		dataToSend.message = "Admin Has Turned This Room Back On; Players Can Again Rematch";

		if(playerOneSocketID !== null){
			io.of(namespace).to(playerOneSocketID).emit('clientSimpleMessage', dataToSend);
		}

		if(playerTwoSocketID !== null){
			io.of(namespace).to(playerTwoSocketID).emit('clientSimpleMessage', dataToSend);
		}

		return true;
	}

	return false;
}


function rangeApplyRoomKick(io, array){

	let length = array.length;
	let index = 0;

	while(index < length){
		applyRoomKick(io, array[index]);
		index++;
	}
}


function getRoomNode(mode, index){

	let data = {
		gameMode: mode,
		roomNumber: index
	};

	return data;
}


function applyRoomKick(io, changeObject){

	console.log("Start of applyRoomKick*************************");

	let gameManager = chessManager.chessGameManagerObject.getGameRoomManager(changeObject.gameMode);
	let roomsOfSocket = null;
	let secondRoom = null;
	let roomnum = changeObject.roomNumber;

	let returnData = {
		info: "You've Been Disconnected by Admin",
		differentMessage: false,
		playerOneMessage: null,
		playerTwoMessage: null,
		timingOut: true
	};
	
	let namespace = gameManager.getNamespaceName();
	let specificRoom = gameManager.getSpecificRoom(roomnum);

	activePlayers.activePlayersObject.deleteBothActivePlayerNodesInRoom(specificRoom.getGameRoomNode(), changeObject.gameMode);

	let playerOneSocketID = specificRoom.getGameRoomNode().getPlayerOneSocketID();
	let playerTwoSocketID = specificRoom.getGameRoomNode().getPlayerTwoSocketID();

	if(specificRoom.getGameRoomNode().getNumberOfPlayers() === 2){
		userVariables.decrementCurrentOccupancy(changeObject.gameMode);
	}

	specificRoom.turnOffNoProgressionTimer();
	specificRoom.resetRoomTimers();
	specificRoom.turnOffReservationTimeout(1);
	specificRoom.turnOffReservationTimeout(2);
	specificRoom.getGameRoomNode().emptyRoom();
	
	//need to disconnect socket from room and then tell the client to disconnect
	if(playerOneSocketID !== null){
		roomsOfSocket = Object.keys(io.nsps[namespace].adapter.sids[playerOneSocketID]);
		secondRoom = roomsOfSocket[1];
		io.of(namespace).connected[playerOneSocketID].leave(secondRoom);
		io.of(namespace).to(playerOneSocketID).emit('clientTimeout', returnData);
		userVariables.setupForceSocketDisconnect(io, namespace, playerOneSocketID);
	}

	if(playerTwoSocketID !== null){
		roomsOfSocket = Object.keys(io.nsps[namespace].adapter.sids[playerTwoSocketID]);
		secondRoom = roomsOfSocket[1];
		io.of(namespace).connected[playerTwoSocketID].leave(secondRoom);
		io.of(namespace).to(playerTwoSocketID).emit('clientTimeout', returnData);
		userVariables.setupForceSocketDisconnect(io, namespace, playerTwoSocketID);
	}

	console.log("Active Nodes After Admin Disconnect occurs");
	activePlayers.activePlayersObject.printActiveNodes();

	console.log("Room changes after admin kick:");
	specificRoom.printChanges();
	
	return true;
}


function sendRoomNodeUpdateToAdmin(io, gameMode, roomNumber){

	let room = chessManager.chessGameManagerObject.getGameRoomManager(gameMode).getSpecificRoom(roomNumber).getGameRoomNode();
	let status = room.getRoomStatus();
	status.roomNumber = roomNumber;
	status.gameMode = gameMode;

	io.of('/admin').to(userVariables.singleAdminConnectionID).emit("clientUpdateRoomNodeStatus", status);
}


function sendRangeRoomNodeUpdateToAdmin(io, array){

	let index = 0;
	let length = array.length;
	let statusArray = [];
	let gameMode = null;
	let specificRoom = null;
	let node = null;
	let status = null;

	while(index < length){
	
		node = array[index];
		gameMode = chessManager.chessGameManagerObject.getGameRoomManager(node.gameMode);
		specificRoom = gameMode.getSpecificRoom(node.roomNumber);
		status = specificRoom.getGameRoomNode().getRoomStatus();
		status.roomNumber = node.roomNumber;
		status.gameMode = node.gameMode;
		statusArray.push(status);
		index++;
	}

	io.of('/admin').to(userVariables.singleAdminConnectionID).emit("clientUpdateRangeRoomNodeStatus", statusArray);
}


function adjustWatchedRooms(arrayOfRooms){

	//need to see which new rooms are being watched
	//need to see which old rooms are no longer watched
	//need to update all involved room's status as watched or unwatched

	//for now I'm making the assumption that the list is sorted

	let room = null;
	let newRoomsWatched = [];

	let length = arrayOfRooms.length;
	let index = 0;

	while(index < length){

		let target = arrayOfRooms[index];
		let oldListLength = adminWatchedRooms.length;
		let result = binarySearch(adminWatchedRooms, 0, oldListLength - 1, target);

		if(result === -1){
			//new item
			newRoomsWatched.push(target);
		}
		else{
			adminWatchedRooms.splice(result, 1);
		}


		index++;
	}

	//at this point ive gone through my new array and added to a list of new rooms to watch
	//and removed from old list any repeating items
	//now the rooms to stop watching are in adminWatchedRooms
	//and newRoomsWatched have the ones I need to tell I'm watching
	
	index = 0;
	length = adminWatchedRooms.length;
	

	while(index < length){
		let watchNode = adminWatchedRooms[index];
		let room = chessManager.chessGameManagerObject.getGameRoomManager(watchNode.gameType).getSpecificRoom(watchNode.roomNumber).getGameRoomNode();
		room.setWatchedStatus(false);
		index++;
	}

	index = 0;
	length = newRoomsWatched.length;


	while(index < length){

		let watchNode = newRoomsWatched[index];
		let room = chessManager.chessGameManagerObject.getGameRoomManager(watchNode.gameType).getSpecificRoom(watchNode.roomNumber).getGameRoomNode();
		room.setWatchedStatus(true);
		index++;
	}

	let currentRoomsStatus = [];
	let roomStatus = null;
	
	adminWatchedRooms.splice(0, adminWatchedRooms.length);

	index = 0;
	while(index < arrayOfRooms.length){
		adminWatchedRooms.push(arrayOfRooms[index]);
		roomStatus = chessManager.chessGameManagerObject.getGameRoomManager(arrayOfRooms[index].gameType).getSpecificRoom(arrayOfRooms[index].roomNumber).getGameRoomNode().getRoomStatus();
		roomStatus.roomNumber = arrayOfRooms[index].roomNumber;
		roomStatus.gameType = arrayOfRooms[index].gameType;
		currentRoomsStatus.push(roomStatus);
		index++;
	}

	return currentRoomsStatus;

}


function binarySearch(array, startIndex, length, target){

	if(length >= startIndex){
		let mid = startIndex + (Math.floor((length - startIndex) / 2));

		if(array[mid].gameType === target.gameType && array[mid].roomNumber === target.roomNumber){
			return mid;
		}

		if(array[mid].gameType > target.gameType || array[mid].roomNumber > target.roomNumber){
			return binarySearch(array, startIndex, mid - 1, target);
		}

		return binarySearch(array, mid + 1, length, target);
	}

	return -1;

}