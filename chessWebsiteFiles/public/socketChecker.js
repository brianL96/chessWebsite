
console.log("Inside socket io tester");

let roomIndex = 0;
let playerPosition = 0;
			
let socket1 = io('/classicGame');
let socket2 = io('/classicGame');
let socket3 = io('/classicGame');
//let socket4 = io('/classicGame');

//goToClassic(socket1, socket2, getDataToSend('B1', '777'));
goToClassic(socket1, socket2, getDataToSend('yy', '777'));
//justReserveClassic(socket1, getDataToSend('yy', '777'));
//connectToClassic(socket2, getDataToSend('yy', '777'));
//connectToClassic(socket3, getDataToSend('yy', '777'));
//connectToClassic(socket4, getDataToSend('yy', '777'));
//justReserveClassic(socket2, getDataToSend('yy', '777'));
//justReserveClassic(socket3, getDataToSend('yy', '777'));
//justReserveClassic(socket2, getDataToSend('yy', '777'));
//justReserveClassic(socket2, getDataToSend('B1', '777'));
setTimeout(justReserveClassic, 7000, socket3, getDataToSend('yy', '777'));
//spamGoToClassic(socket1, socket2, socket3, socket4, getDataToSend('yy', '777'));


function spamClassicConnectToRoom(object){
	let i = 0;
	while(i < 5){
		connectToClassic(object)
		i++;
	}
}

function spamClassicConnectToRoomWithMultipleSockets(object1, object2, object3, object4){
	connectToClassic(object1);
	connectToClassic(object2);
	connectToClassic(object3);
	connectToClassic(object4);
}

function spamClassicFindRoom(object){
	let i = 0;
	while(i < 5){
		goToClassic(object, null);
			i++;
		
	}
}

function disconnectSocket(object){
	object.disconnect();
}

function sendResignation(object){
				
	let resignMove = {
		gameNumber: 0
	};

	object.emit('playerResignation', resignMove);
}

function multipleGrabs(){
    let i = 0;
	let limit = 10;
	let more = false;
	while(i < limit){
					
		//getOpponentUsername(socket2);
		sendMove(socket2, more);
		rematch(socket2, more);
		if(i >= 5){
			more = true;
		}
		i++;
	}
}

function getOpponentUsername(object){
	let data = {	
		gameNumber: 0
	};
			
	object.emit("requestOppUsername", data);
}

function sendMove(object, more){

	let sendingMove = {
		sendingMoveSet: [0, 1, 0, 2],
		moveType: 'regular',
		promoteDOM: null,
		promotePiece: null,
		gameNumber: 0
	};

	if(more){
		sendingMove.gameNumber = 0;
	}

	object.emit('gameMove', sendingMove);
}

function sendInsufficientCheck(object){

	let data = {
		drawSet: true,
		gameNumber: 0
	};

	object.emit('confirmInsufficientCheck', data);
}

function sendAdditionalDraw(object){

	let sendingMove = {
		sendingMoveSet: [0, 1, 0, 2],
		moveType: 'regular',
		promoteDOM: null,
		promotePiece: null,
		gameNumber: 0
	};

	let setDraw = {
		sendingSet: sendingMove
	};

	setDraw.drawType = 2;

	object.emit('serverAdditionalDraw', setDraw);

}

function sendHillWin(object){

	let sendingMove = {
		sendingMoveSet: [0, 1, 0, 2],
		moveType: 'regular',
		promoteDOM: null,
		promotePiece: null,
		gameNumber: 0
	};

	let hillWinMove = {
		sendingSet: sendingMove
	};

	object.emit('serverHillWin', hillWinMove);
}

function sendStaleMate(object){

	console.log("About to send stalemate");

	let sendingMove = {
		sendingMoveSet: [0, 1, 0, 2],
		moveType: 'regular',
		promoteDOM: null,
		promotePiece: null,
		gameNumber: 0
	};

	let stalemateMove = {
		sendingSet: sendingMove				
	};

	object.emit('stalemateStatus', stalemateMove);
}

function sendCheckMate(object){

	console.log("About to send checkmate");

	let sendingMove = {
		sendingMoveSet: [0, 1, 0, 2],
		moveType: 'regular',
		promoteDOM: null,
		promotePiece: null,
		gameNumber: 0
	};

	let checkmateMove = {
		sendingSet: sendingMove
	};
	
	object.emit('checkmateStatus', checkmateMove);

}

function rematch(object, more){
	let resetMove = {
	    gameNumber: 0
	};

	if(more){
		resetMove.gameNumber = 1;
	}

	object.emit('serverNewGame', resetMove);
}


function registerSocketEvent(object){

	object.on('clientAdditionalDraw', (data) => {

	    if(data.drawSet){

		    if(data.player === playerPosition){
			    console.log("Additional Draw Final Move:")
			    console.log(data.sendingSet);
		    }

		    if(data.drawType === 1){
		        console.log("Inside of clientAdditionalDraw");
			    console.log("Draw: Insufficient Material");
		    }

		    else if(data.drawType === 2){
			    console.log("Inside of clientAdditionalDraw");
			    console.log("Draw: Fifty Move Rule");
		    }

		    else if(data.drawType === 3){
			    console.log("Inside of clientAdditionalDraw");
			    console.log("Draw: Insufficient Material Vs. Timeout");
		    }
		    else if(data.drawType === 4){
			    console.log("Inside of clientAdditionalDraw");
			    console.log("Draw: Threefold Repetition");
		    }

	    }
    });

	object.on('clientHillWin', (data) => {

		if(data.hillWin){
			if(data.player === playerPosition){
				console.log("KOTH Final Move:")
				console.log(data.sendingSet);
			}
		}
	
	});

	object.on('clientStalemate', (data) => {

		if(data.stalemateStatus){

			if(data.player === playerPosition){
				console.log("Stalemate Final Move:")
				console.log(data.sendingSet);
			}

		}

	});

	object.on('clientCheckmate', (data) => {

		if(data.checkmateStatus){

			if(data.player === playerPosition){
				console.log("Checkmate Final Move:")
				console.log(data.sendingSet);
			}
		}
	});

	object.on('clientReset', (data) => {

	    if(data.handShakeComplete === false){
			oppOfferedRematch = true;
			console.log("Opponent Offers Rematch");
			return;
		}

		if(data.handShakeComplete){
			console.log("Rematch set");	
		}

	});

	object.on('getRoom', (data) => {
	
		if(data.getRoomIndex === -1){
		    console.log("All Rooms are Full");
			object.disconnect();
		}
		else{
			if(data.success !== true){
				if(data.errorType === 0){
					console.log("Cannot connect to room - Username not found");
				}
				else if(data.errorType === 1){
					console.log("Cannot connect to room - Password incorrect");
				}
				else{
					console.log("Cannot connect to room");
				}
				object.disconnect();
				return;
			}

			console.log("Good connect!");
		}
	});

	object.on('getOppUsername', (data) => {
		console.log("Get Opp Username Text: ");
		console.log(data);
	});

}

function justReserveClassic(object, dataToSend){


	object.emit('findRoom', dataToSend, (data) => {

		if(data.error){
			if(data.errorType === 0){
				console.log("Username Not Found, Cannot Play");
			}
			else if(data.errorType === 1){
				console.log("Password Incorrect, Cannot Play");
			}
			else if(data.errorType === 2){
				console.log("Game Mode Not Found");
			}
			object.disconnect();
		}
        else
        {
			console.log("Just reserved room success");
		}
		
	});
}


function goToClassic(object, object2, dataToSend){

	object.emit('findRoom', dataToSend, (data) => {

		if(data.error){
			if(data.errorType === 0){
				console.log("Username Not Found, Cannot Play");
			}
			else if(data.errorType === 1){
				console.log("Password Incorrect, Cannot Play");
			}
			else if(data.errorType === 2){
				console.log("Game Mode Not Found");
			}
			object.disconnect();
		}
        else
        {
			//object.disconnect();
			roomIndex = data.roomNumber;
		    playerPosition = data.playerPosition;
		    connectToClassic(object2, dataToSend);
		}
		
	});

}

function goToClassic(object, object2, dataToSend){

	object.emit('findRoom', dataToSend, (data) => {

		if(data.error){
			if(data.errorType === 0){
				console.log("Username Not Found, Cannot Play");
			}
			else if(data.errorType === 1){
				console.log("Password Incorrect, Cannot Play");
			}
			else if(data.errorType === 2){
				console.log("Game Mode Not Found");
			}
			object.disconnect();
		}
        else
        {
			//object.disconnect();
			roomIndex = data.roomNumber;
		    playerPosition = data.playerPosition;
		    connectToClassic(object2, dataToSend);
		}
		
	});

}


function spamGoToClassic(object, object2, object3, object4, dataToSend){

	object.emit('findRoom', dataToSend, (data) => {

		if(data.error){
			if(data.errorType === 0){
				console.log("Username Not Found, Cannot Play");
			}
			else if(data.errorType === 1){
				console.log("Password Incorrect, Cannot Play");
			}
			else if(data.errorType === 2){
				console.log("Game Mode Not Found");
			}
			//object.disconnect();
		}
        else
        {
			roomIndex = data.roomNumber;
		    playerPosition = data.playerPosition;
		    connectToClassic(object2, dataToSend);
			connectToClassic(object3, dataToSend);
			connectToClassic(object4, dataToSend);
		}
		
	});

}

function connectToClassic(object, data){

	let getRoomData = { 
		getRoomIndex: roomIndex,
		getPosition: playerPosition,
		getUsername: data.username,
		getPassword: data.password		
	};

	object.emit('connectToRoom', getRoomData);
}

function getDataToSend(user, pass){

	let dataToSend = {
		username: user,
	    password: pass
	};

	return dataToSend;
}




			
			
			
		