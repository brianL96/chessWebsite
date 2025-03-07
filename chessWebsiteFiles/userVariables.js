
console.log("Inside the user variables file");

const access = require('./accessFile.js');
const highestOccupancyClass = require('./highestOccupancy.js');

let maxNumberOfSavedGames = 20;
let serverStartDate = null;
let currentSessionStartDate = null;
let lastSessionStartDate = null;
let totalAdminSignIns = 0;
let totalGamesCompleted = 0;
let totalClassicGamesCompleted = 0;
let totalKothGamesCompleted = 0;
let totalCotlbGamesCompleted = 0;
let totalSpeedGamesCompleted = 0;
let adminPassword = access.adminPassword;
let adminActionPassword = access.adminActionPassword;
let singleAdminConnectionID = null;


function addHighestOccupancyObjects(amount){
	highestOccupancyClass.occupancyArray.addMultipleObjects(amount);
}

function printHighestOccupancyObjects(){
	highestOccupancyClass.occupancyArray.printHighestOccupancyArray();
}

function getHighestOccupancy(gameMode){
	return highestOccupancyClass.occupancyArray.getHighestOccupancyObject(gameMode).getHighestOccupancy();
}

function getHighestOccupancyTime(gameMode){
	return highestOccupancyClass.occupancyArray.getHighestOccupancyObject(gameMode).getUpdatedHighestOccupancyTime();
}

function incrementCurrentOccupancy(gameMode){
	highestOccupancyClass.occupancyArray.getHighestOccupancyObject(gameMode).incrementCurrentOccupancy();
}

function decrementCurrentOccupancy(gameMode){
	highestOccupancyClass.occupancyArray.getHighestOccupancyObject(gameMode).decrementCurrentOccupancy();
}

function setMaxOccupancy(gameMode){
	highestOccupancyClass.occupancyArray.getHighestOccupancyObject(gameMode).setMaxOccupancy();
}

function printSocketConnectedStatus(io, namespace, socketID){

	if(socketID === undefined || socketID === null){
		return;
	}

	let socket = io.of(namespace).connected[socketID];

	if(socket !== undefined && socket !== null){
		console.log("Not Disconnected");
	}
	if(socket === undefined || socket === null){
		console.log("Already Disconnected");
	}
}

function setupForceSocketDisconnect(io, namespace, socketID, extra){
	setTimeout(forceSocketDisconnect, 7000, io, namespace, socketID, extra);
}

function forceSocketDisconnect(io, namespace, socketID, extra){

	console.log("Inside force disconnect");
	console.log(namespace);
	console.log(socketID);

	if(io === undefined || io === null){
		return;
	}

	if(extra === 1){
		console.log("Coming from Find Room");
	}
	else if(extra === 2){
		console.log("Coming from connect to Room");
	}
	else if(extra === 3){
		console.log("Coming from Disconnecting");
	}
	else{
		console.log("Not sure where from");
	}

	if(socketID === undefined || socketID === null){
		console.log("Bad Values");
		return;
	}

	let socket = io.of(namespace).connected[socketID];

	if(socket !== undefined && socket !== null){
		console.log("Disconnecting Socket");
		socket.disconnect();
		console.log("Finished Disconnecting Socket");

	}
	if(socket === undefined || socket === null){
		console.log("Already Disconnected");
	}
}

function clearSocketConnection(io, namespace, socketID){

	if(io === undefined || io === null){
		console.log("Bad io");
		return;
	}

	if(socketID === undefined || socketID === null){
		console.log("Bad Values");
		return;
	}

	let socket = io.of(namespace).connected[socketID];

	if(socket !== undefined && socket !== null){
		socket.disconnect(true);

	}
	if(socket === undefined || socket === null){
		console.log("Already Disconnected");
	}
}

function setSocketRemovedFromList(io, socketID, value){

	if(socketID === undefined || socketID === null){
		console.log("Bad Values");
		return;
	}

	let socket = io.of('/').connected[socketID];

	if(socket !== undefined && socket !== null){
		socket.removedFromIPList = value;
		console.log("Successful addition to data!");
	}
	else{
		console.log("We've failed");
	}

}

function getSocketRemovedFromList(io, socketID){

	if(socketID === undefined || socketID === null){
		console.log("Bad Values");
		return null;
	}

	let socket = io.of('/').connected[socketID];

	if(socket !== undefined && socket !== null){
		if(socket.removedFromIPList === undefined){
			return null;
		}
		return socket.removedFromIPList;
	}
	else{
		console.log("We've failed 2");
	}
	
	return null;

}

function extractRoomNum(roomName){

	if(roomName === null || roomName === undefined){
		console.log("Here is the problem");
	}

	let length = roomName.length;

	let roomnum = roomName.substring(5, length + 1);

	return parseInt(roomnum);
}


module.exports = {
	maxNumberOfSavedGames,
	serverStartDate,
	currentSessionStartDate,
	lastSessionStartDate,
	totalAdminSignIns,
	totalGamesCompleted,
	totalClassicGamesCompleted,
	totalKothGamesCompleted,
	totalCotlbGamesCompleted,
	totalSpeedGamesCompleted,
	addHighestOccupancyObjects,
	printHighestOccupancyObjects,
	incrementCurrentOccupancy,
	decrementCurrentOccupancy,
	setMaxOccupancy,
	getHighestOccupancy,
	getHighestOccupancyTime,
	adminPassword,
	adminActionPassword,
	singleAdminConnectionID,
	printSocketConnectedStatus,
	setupForceSocketDisconnect,
	forceSocketDisconnect,
	clearSocketConnection,
	setSocketRemovedFromList,
	getSocketRemovedFromList,
	extractRoomNum
};