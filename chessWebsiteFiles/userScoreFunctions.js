
console.log("Inside of User Score Functions");

const databaseAccess = require('./routes/api/databaseAccessFunctions.js');

function updateWinsLosses(io, namespace, roomToEmit, database, wonUsername, lostUsername, wonSocketID, lostSocketID){

	if(wonUsername === null || lostUsername === null){
		console.log("One or both usernames null, returning from update wins and losses");
		return;
	}
	
	updateElo(io, namespace, roomToEmit, database, wonUsername, lostUsername, wonSocketID, lostSocketID);

}

function updateDraws(tableName, player1, player2){

	if(player1 === null || player2 === null){
		return;
	}

	databaseAccess.updateDrawsInDatabase(tableName, player1, player2, 1);		
}

function updateStalemates(tableName, player1, player2){

	if(player1 === null || player2 === null){
		return;
	}

	databaseAccess.updateStalematesInDatabase(tableName, player1, player2);
	
}


async function updateElo(io, namespace, roomToEmit, tableName, wonUsername, lostUsername, wonSocketID, lostSocketID){

	let noUpdateMessage = {message: "ELO score couldn't be updated."};

	let eloUpdateResult = await databaseAccess.updateEloInDatabase(tableName, wonUsername, lostUsername, 1);

	console.log("Look here for eloUpdateResult");
	console.log(eloUpdateResult);

	console.log("About to check if room is still connected in ELO update");

	let roomExists = io.nsps[namespace].adapter.rooms[roomToEmit];
	let roomConnectedPass = true;
	let wonSocket = null;
	let lostSocket = null;

	console.log(roomToEmit);
	console.log(roomExists);
	
	if(roomExists === undefined || roomExists === null || roomExists.length === undefined || typeof(roomExists.length) !== 'number' || roomExists.length < 1){
		console.log("Room not connected in ELO updated");
		roomConnectedPass = false;
	}

	if(roomConnectedPass){
		console.log("About to check if user is still connected in ELO update");
	
		wonSocket = io.of(namespace).in(roomToEmit).connected[wonSocketID];
		lostSocket = io.of(namespace).in(roomToEmit).connected[lostSocketID];

		if((wonSocket !== undefined && wonSocket !== null) || (lostSocket !== undefined && lostSocket !== null)){
			console.log("User still connected in ELO update");
			if(eloUpdateResult){
				io.of(namespace).in(roomToEmit).emit('safeToUpdateElo');
			}
			else{
				io.of(namespace).in(roomToEmit).emit('clientSimpleMessage', noUpdateMessage);
			}
		}
	}

	else{

		console.log("users not connected to room in elo update");
		wonSocket = io.of(namespace).connected[wonSocketID];
		lostSocket = io.of(namespace).connected[lostSocketID];

		if(wonSocket !== undefined && wonSocket !== null){
			console.log("Won Socket still connected");
			if(eloUpdateResult){
				wonSocket.emit("safeToUpdateElo");
			}
			else{
				wonSocket.emit('clientSimpleMessage', noUpdateMessage);
			}
		}
		if(lostSocket !== undefined && lostSocket !== null){
			console.log("Lost Socket Still connected");
			if(eloUpdateResult){
				lostSocket.emit("safeToUpdateElo");
			}
			else{
				lostSocket.emit('clientSimpleMessage', noUpdateMessage);
			}
		}
	}

	console.log("Elo Update Finished");

}


function getProbability(rating1, rating2){

	let value1 = ((rating2 - rating1)/400);
	let value2 = Math.pow(10, value1);
	return (1.0/(1.0 + value2));
	
}

module.exports = {
	updateWinsLosses,
	updateDraws,
	updateStalemates,
	updateElo,
	getProbability
};