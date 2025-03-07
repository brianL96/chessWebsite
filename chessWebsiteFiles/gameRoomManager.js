

const timerFunctions = require('./socketTimerFunctions.js');
const userVariables = require('./userVariables.js');


class gameRoomManager{

	constructor(initialRoomAmount, min, max, gameModeNumber, namespaceName, timerSeconds, extraTimerSeconds, database){

		this.initialRoomAmount = initialRoomAmount; //getter
		this.min = min; //getter
		this.max = max; //getter
		this.gameModeNumber = gameModeNumber; //getter
		this.namespaceName = namespaceName; //getter
		this.timerSeconds = timerSeconds; //getter
		this.extraTimerSeconds = extraTimerSeconds; //getter
		this.database = database; //getter
		this.gameTimerManagers = []; //getter
		this.increaseGameTimerManagerList(initialRoomAmount);
	}


	getInitialRoomAmount(){
		return this.initialRoomAmount;
	}

	getTimerSeconds(){
		return this.timerSeconds;
	}

	getExtraTimerSeconds(){
		return this.extraTimerSeconds;
	}

	getSpecificRoom(roomNumber){
		return this.gameTimerManagers[roomNumber];
	}

	getMinAmountOfRooms(){
		return this.min;
	}

	getMaxAmountOfRooms(){
		return this.max;
	}

	getAmountOfRooms(){
		return this.gameTimerManagers.length;
	}

	getGameModeNumber(){
		return this.gameModeNumber;
	}

	getNamespaceName(){
		return this.namespaceName;
	}

	getDatabaseName(){
		return this.database;
	}

	getInfoNode(){

		let node = {
			gameMode: this.getGameModeNumber(),
			namespace: this.getNamespaceName(),
			amount: this.getAmountOfRooms(),
			min: this.getMinAmountOfRooms(),
			max: this.getMaxAmountOfRooms(),
			database: this.getDatabaseName()
		};

		return node;
	}

	addGameTimerManager(node){ 
		this.gameTimerManagers.push(node);
	}

	getGameTimerManagerObject(roomName){
		let node = new timerFunctions.gameTimerManager(this.getTimerSeconds(), this.getExtraTimerSeconds(), roomName, this.getGameModeNumber(), this.getDatabaseName(), this.getNamespaceName());
		return node;
	}

	increaseGameTimerManagerList(newTotal){

		if(newTotal <= this.getAmountOfRooms()){
			return;
		}

		for(let index = this.getAmountOfRooms(); index < newTotal; index++){
			this.addGameTimerManager(this.getGameTimerManagerObject("room-" + index));
		}
	}

	decreaseGameTimerManagerList(newTotal){

		if(newTotal >= this.getAmountOfRooms()){
			return;
		}

		let amoutToDelete = this.getAmountOfRooms() - newTotal;
		this.gameTimerManagers.splice(newTotal, amoutToDelete);
	}



	printRoomInfo(roomNumber){

		let room = this.getSpecificRoom(roomNumber);
		console.log("Room: " + roomNumber);
		console.log(room);
	}

	printAllRoomInfo(){
		let length = this.getAmountOfRooms();
		for(let i = 0; i < length; i++){
			this.printRoomInfo(i);
		}
	}


	findGameRoom(checkUsername){


		let foundRoom = {
			roomNumber: -1,
			playerPosition: -1,
		};

		let amountOfRooms = this.getAmountOfRooms();
		let room = null;
		let roomGameRoomNode = null;

		for(let i = 0; i < amountOfRooms; i++){
		
			room = this.getSpecificRoom(i);
			roomGameRoomNode = room.getGameRoomNode();

			if(roomGameRoomNode.getRoomOnStatus()){
				if(roomGameRoomNode.getStatusOfGame() !== true){
					if(roomGameRoomNode.getPlayerOneUsername() !== checkUsername && roomGameRoomNode.getPlayerTwoUsername() !== checkUsername){

						if(roomGameRoomNode.getNumberOfPlayers() === 1){
							roomGameRoomNode.incrementNumberOfPlayers();
							foundRoom.roomNumber = i;

							if(roomGameRoomNode.getPlayersFound(0) === 1 && roomGameRoomNode.getPlayersFound(1) === 0){
								roomGameRoomNode.setPlayersFound(1, 1);
								foundRoom.playerPosition = 2;
								return foundRoom;
							}

							else if(roomGameRoomNode.getPlayersFound(0) === 0 && roomGameRoomNode.getPlayersFound(1) === 1){
								roomGameRoomNode.setPlayersFound(0, 1);
								foundRoom.playerPosition = 1;
								return foundRoom;
							}				
				
						}

					}
				}
			}
		}


		for(let i = 0; i < amountOfRooms; i++){

			room = this.getSpecificRoom(i);
			roomGameRoomNode = room.getGameRoomNode();

			if(roomGameRoomNode.getRoomOnStatus()){
				if(roomGameRoomNode.getStatusOfGame() !== true){
					if(roomGameRoomNode.getPlayerOneUsername() !== checkUsername && roomGameRoomNode.getPlayerTwoUsername() !== checkUsername){
		
						if(roomGameRoomNode.getNumberOfPlayers() === 1 || roomGameRoomNode.getNumberOfPlayers() === 0){
			 
							roomGameRoomNode.incrementNumberOfPlayers();
							foundRoom.roomNumber = i;
			
							if(roomGameRoomNode.getPlayersFound(0) === 1 && roomGameRoomNode.getPlayersFound(1) === 0){
					
								roomGameRoomNode.setPlayersFound(1, 1);
								foundRoom.playerPosition = 2;
								return foundRoom;
							}
							else if((roomGameRoomNode.getPlayersFound(0) === 0 && roomGameRoomNode.getPlayersFound(1) === 0) ||
							 		(roomGameRoomNode.getPlayersFound(0) === 0 && roomGameRoomNode.getPlayersFound(1) === 1)
								){
								roomGameRoomNode.setPlayersFound(0, 1);
								foundRoom.playerPosition = 1;
								return foundRoom;
							}				
				
						}

					}
				}
			}
		}

		return foundRoom;

	}


	reserveRoom(data){

		let foundRoom = this.findGameRoom(data.username);

		if(foundRoom.roomNumber !== -1 && foundRoom.playerPosition !== -1){
			
			let index = foundRoom.roomNumber;
			let thisSpecificRoom = this.getSpecificRoom(index);
			let thisGameRoomNode = thisSpecificRoom.getGameRoomNode();

			if(foundRoom.playerPosition === 1){
				thisGameRoomNode.setPlayerOneUsername(data.username);
			}
			else{
				thisGameRoomNode.setPlayerTwoUsername(data.username);
			}

			if(thisGameRoomNode.getNumberOfPlayers() === 2){
				userVariables.incrementCurrentOccupancy(this.getGameModeNumber());
			}
		}

		return foundRoom;
	}


	connectToRoomGeneral(io, socket, data){

		data.success = false;

		let thisSpecificRoom = this.getSpecificRoom(data.getRoomIndex);
		let roomGameRoomNode = thisSpecificRoom.getGameRoomNode();
		
		if(data.getPosition === 1){
			if(roomGameRoomNode.getPlayerOneUsername() === data.getUsername && roomGameRoomNode.getPlayerOneConnected() === false){
				roomGameRoomNode.setPlayerOneSocketID(socket.id);
				roomGameRoomNode.setPlayerOneConnected(true);
				data.success = true;
			}
		}

		else if(data.getPosition === 2){
			if(roomGameRoomNode.getPlayerTwoUsername() === data.getUsername && roomGameRoomNode.getPlayerTwoConnected() === false){
				roomGameRoomNode.setPlayerTwoSocketID(socket.id);
				roomGameRoomNode.setPlayerTwoConnected(true);
				data.success = true;	
			}
		}

		if(data.success){
		
			socket.join("room-" + data.getRoomIndex);

			socket.playerPosition = data.getPosition;

			thisSpecificRoom.turnOffReservationTimeout(data.getPosition);
			thisSpecificRoom.setTimerInPlay(true);

			//if(roomGameRoomNode.getNumberOfPlayers() < 2){
			if(roomGameRoomNode.getPlayerOneConnected() === false || roomGameRoomNode.getPlayerTwoConnected() === false){
				thisSpecificRoom.setNoOpponentTimeoutObject(io);
			}

			//else if(roomGameRoomNode.getNumberOfPlayers() === 2){
			else if(roomGameRoomNode.getPlayerOneConnected() && roomGameRoomNode.getPlayerTwoConnected()){
				thisSpecificRoom.turnOffNoProgressionTimer();
				thisSpecificRoom.setNoInitialMoveTimeoutObject(io);
			}
			
			data.firstMove = false;
			data.firstMoveSet = null;

			if(roomGameRoomNode.getFirstMoveStatus()){
				data.firstMove = true;
				data.firstMoveSet = roomGameRoomNode.getFirstMoveSet();
			}

			socket.emit("getRoom", data);
		}

		else if(data.success === false){
			console.log("Unsuccessful connect to room: " + socket.id);
			socket.emit("getRoom", data);
			userVariables.setupForceSocketDisconnect(io, this.getNamespaceName(), socket.id);
		}

	}

}


module.exports = {
	gameRoomManager
};

