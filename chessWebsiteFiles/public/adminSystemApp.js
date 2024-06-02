
let password = sessionStorage.getItem("guestpassword");
sessionStorage.removeItem("guestpassword");

let signedInNavbar = document.querySelector("#signed-in-navbar");
let signedInText = document.querySelector("#signed-in-text");
let extendSessionBtn = document.querySelector("#extend-session-btn");
let signoutBtn = document.querySelector("#signout-btn");

let selectorHeader = document.querySelector("#gameModeSelect");

let classicSelector = document.querySelector("#classic-mode");
let kothSelector = document.querySelector("#koth-mode");
let cotlbSelector = document.querySelector("#cotlb-mode");
let speedSelector = document.querySelector("#speed-mode");

//let currentRoomNode = 0;

let currentlySignedIn = true;
let currentGameModeSelected = "Classic";
let currentGameModeDisplayed = null;
let currentModeRoomsAvailable = -1;

extendSessionBtn.addEventListener("click", openExtensionModal);
signoutBtn.addEventListener("click", disconnectAdmin);

classicSelector.addEventListener("click", changeGameModeSelected);
kothSelector.addEventListener("click", changeGameModeSelected);
cotlbSelector.addEventListener("click", changeGameModeSelected);
speedSelector.addEventListener("click", changeGameModeSelected);

let displayRangeStartText = document.querySelector("#enter-start-display");
let displayRangeEndText = document.querySelector("#enter-end-display");


let displayBtn = document.querySelector("#display-rooms-btn");
displayBtn.addEventListener("click", resetRoomsDisplayed);

let serverStartSpan = document.querySelector("#serverStart-span");
let currentSessionStartSpan = document.querySelector("#currentSessionStart-span");
let lastAdminSignInSpan = document.querySelector("#lastAdminSignIn-span");
let totalAdminSignInsSpan = document.querySelector("#totalAdminSignIns-span");
let totalGamesCompletedSpan = document.querySelector("#totalGamesCompleted-span");
let specificGamesCompletedText = document.querySelector("#specificGamesCompleted-text");
let specificGamesCompletedSpan = document.querySelector("#specificGamesCompleted-span");
let specificHighestOccupancyText = document.querySelector("#specificHighestOccupancy-text");
let specificHighestOccupancySpan = document.querySelector("#specificHighestOccupancy-span");
let specificHighestOccupanyTimeText = document.querySelector("#specificHighestOccupancyTime-text");
let specificHighestOccupanyTimeSpan = document.querySelector("#specificHighestOccupancyTime-span");


let amountAvailableSpan = document.querySelector("#amount-available-span");
let rangeMinSpan = document.querySelector("#range-min-span");
let rangeMaxSpan = document.querySelector("#range-max-span");

let amountAdjustmentText = document.querySelector("#enter-adjustment");
let amountAdjustmentBtn = document.querySelector("#submit-amount-change");
amountAdjustmentBtn.addEventListener("click", sendAmountAdjustment);


let startRangeText = document.querySelector("#range-enter-start");
let endRangeText = document.querySelector("#range-enter-end");

let rangeKickBtn = document.querySelector("#range-kick-btn");
let rangeOffBtn = document.querySelector("#range-off-btn");
let rangeOnBtn = document.querySelector("#range-on-btn");

rangeKickBtn.addEventListener("click", doRangeKick);
rangeOffBtn.addEventListener("click", doRangeOff);
rangeOnBtn.addEventListener("click", doRangeOn);

let displayedHeaderContainer = document.querySelector("#room-view-currentlyDisplayed");

let confirmModal = document.querySelector("#confirm-modal");
let confirmModalX = document.querySelector("#confirm-modal-close");
let cancelConfirmModalBtn = document.querySelector("#confirm-modal-cancelBtn");
let confirmText = document.querySelector("#confirm-modal-messageText");
let confirmBtn = document.querySelector("#confirm-modal-confirmBtn");
let confirmEnterPassword = document.querySelector("#confirmation-enter-password");
let confirmPasswordError = document.querySelector("#confirm-passwordError-text");


confirmModalX.addEventListener("click", closeConfirmModal);
cancelConfirmModalBtn.addEventListener("click", closeConfirmModal);
confirmBtn.addEventListener("click", useConfirmedAction);

let errorModal = document.querySelector("#error-modal");
let errorModalX = document.querySelector("#error-modal-close");
let closeErrorModalBtn = document.querySelector("#error-modal-closeBtn");
let errorText = document.querySelector("#error-modal-messageText");

errorModalX.addEventListener("click", closeErrorModal);
closeErrorModalBtn.addEventListener("click", closeErrorModal);

let extensionModal = document.querySelector("#extension-modal");
let extensionModalSubmit = document.querySelector("#extension-modal-submitBtn");
let extensionModalX = document.querySelector("#extension-modal-close");
let extensionPasswordField = document.querySelector("#extension-enter-password");
let timerNumber = document.querySelector("#extension-timer-number");
let extensionError = document.querySelector("#extension-error");

extensionModalSubmit.addEventListener("click", submitExtensionRequest);
extensionModalX.addEventListener("click", closeExtensionModal);

let extensionRemainder = document.querySelector("#extension-remainder-number");
let remainder = 2;

let minutes = 5;
let seconds = 0;

//let countDown = window.setInterval(writeTime, 1000);
let countDown;

let commandMessage = "";
let errorMessage = "";

let action = 0;
let actionData = null;

let adjustMin = -1;
let adjustMax = -1;

let clientDisconnectCalled = false;

let adminPassword = {
	admin : password
};


let socket = io('/admin');

console.log("This is the current password: " + adminPassword.admin);
//here is the emit to verifyAdmin
socket.emit("verifyAdmin", adminPassword);

getTopPanelValues();
getAmountPanelValues();



socket.on("message", () => {
	console.log("Hello");
});

socket.on("regularString", (data) => {

	console.log("Inside of regularString");

	if(data === undefined || data === null || typeof(data) !== 'object'){
		return;
	}

	/*
	if(data.roomNumber === undefined || isNaN(data.roomNumber) || data.gameMode === undefined ||  isNaN(data.gameMode) || 
	   data.roomOn === undefined || typeof(data.roomOn) !== 'boolean'){
		return;
	}
	*/

	if(checkUpdateRoomNode(data) === false){
		return;
	}

	console.log(isNaN(data.roomNumber));
	console.log("Look here for regularString stuff");
	console.log(data);
	updateRoomNode(data);
});

socket.on("startSession", () => {
	countDown = window.setInterval(writeTime, 1000);
});

socket.on("clientRoomData", (data) => {

	console.log(data);

	if(data === undefined || data === null || typeof(data) !== 'object'){
		return;
	}

	if(data.gameMode === undefined || typeof(data.gameMode) !== 'number' || Array.isArray(data.allResults) === false){
		return;
	}

	/*
	if(data.result === false){
		
		if(data.resultType === 1){
			errorMessage = "Error: Unable To Get Rooms From " + convertNumberToGameType(data.gameMode);
		}
		else if(data.resultType === 2){
			errorMessage = "Error: Input For Last Index Exceeds Highest Room Index In " + convertNumberToGameType(data.gameMode);
		}

		printError();
		return;
	}
	*/

	successConfirmModal();
	clearRoomNodesDisplay();
	let gameModeHeader = document.querySelector("#currentlyDisplayed");
	currentGameModeDisplayed = convertNumberToGameType(data.gameMode);
	gameModeHeader.innerHTML = currentGameModeDisplayed + " Rooms Displayed";
	if(displayedHeaderContainer.childElementCount < 2){
		let displayRoomsXContainer = document.createElement("div");
		displayRoomsXContainer.setAttribute("id", "displayRoomsX-container");
		let displayRoomsX = document.createElement("H2");
		displayRoomsX.setAttribute("id", "displayRoomsX");
		displayRoomsX.innerHTML = "&#10005;";
		displayRoomsX.addEventListener("click", justRemoveNodeList);
		displayRoomsXContainer.appendChild(displayRoomsX);
		displayedHeaderContainer.appendChild(displayRoomsXContainer);
	}
	//console.log(displayedHeaderContainer.childElementCount);
	createNewRoomNodesList(data.allResults);
});


socket.on("clientTopPanelValues", (data) => {

	console.log("Inside Get all top values:");
	console.log(data);

	if(data === undefined || data === null || typeof(data) !== 'object'){
		return;
	}

	if(data.serverStart === undefined || data.currentSession === undefined || data.lastAdmin === undefined || data.totalAdmin === undefined || 
		data.totalGames === undefined || data.specificTotal === undefined || data.specificOccupancy === undefined || data.specificTime === undefined || data.timeCountingBoolean === undefined){
			return;
	}

	data.serverStart === null ? (serverStartSpan.innerText = "---") : (serverStartSpan.innerText = data.serverStart);
	data.currentSession === null ? (currentSessionStartSpan.innerText = "---") : (currentSessionStartSpan.innerText = data.currentSession);
	data.lastAdmin === null ? (lastAdminSignInSpan.innerText = "---") :	(lastAdminSignInSpan.innerText = data.lastAdmin);
	data.totalAdmin === null ? (totalAdminSignInsSpan.innerText = "---") : (totalAdminSignInsSpan.innerText = data.totalAdmin);
	data.totalGames === null ? (totalGamesCompletedSpan.innerText = "---") : (totalGamesCompletedSpan.innerText = data.totalGames);
	data.specificTotal === null ? (specificGamesCompletedSpan.innerText = "---") : (specificGamesCompletedSpan.innerText = data.specificTotal);
	data.specificOccupancy === null ? (specificHighestOccupancySpan.innerText = "---") : (specificHighestOccupancySpan.innerText = data.specificOccupancy);
	

	if(data.specificTime === null){
		specificHighestOccupanyTimeSpan.innerText = "---";
	}
	else{
		if(data.timeCountingBoolean){
			specificHighestOccupanyTimeSpan.innerText = getFormattedSeconds(data.specificTime) + " (Cont.)";
		}
		else{
			specificHighestOccupanyTimeSpan.innerText = getFormattedSeconds(data.specificTime);
		}
	}

});

socket.on("clientTopPanelSpecificValues", (data) => {

	console.log("Inside Get specific top values:");
	console.log(data);

	if(data === undefined || data === null || typeof(data) !== 'object'){
		return;
	}

	if(data.totalGames === undefined || data.specificTotal === undefined || data.specificOccupancy === undefined || data.specificTime === undefined || data.timeCountingBoolean === undefined){
		return;
	}

	data.totalGames === null ? (totalGamesCompletedSpan.innerText = "---") : (totalGamesCompletedSpan.innerText = data.totalGames);
	data.specificTotal === null ? (specificGamesCompletedSpan.innerText = "---") : (specificGamesCompletedSpan.innerText = data.specificTotal);
	data.specificOccupancy === null ? (specificHighestOccupancySpan.innerText = "---") : (specificHighestOccupancySpan.innerText = data.specificOccupancy);
	//data.specificTime === null ? (specificHighestOccupanyTimeSpan.innerText = "---") : (specificHighestOccupanyTimeSpan.innerText = getFormattedSeconds(data.specificTime));
	//specificHighestOccupancySpan.innerText = data.specificOccupancy;

	if(data.specificTime === null){
		specificHighestOccupanyTimeSpan.innerText = "---";
	}
	else{
		if(data.timeCountingBoolean){
			specificHighestOccupanyTimeSpan.innerText = getFormattedSeconds(data.specificTime) + " (Cont.)";
		}
		else{
			specificHighestOccupanyTimeSpan.innerText = getFormattedSeconds(data.specificTime);
		}
	}



});

socket.on("clientAmountOfRoomVariables", (data) => {

	if(data === undefined || data === null || typeof(data) !== 'object'){
		return;
	}

	if(data.gameMode === undefined || typeof(data.gameMode) !== 'number' || data.amount === undefined || data.min === undefined || data.max === undefined){
		return;
	}

	if(data.amount === null || data.min === null || data.max === null){
		setAmountPanelValues(data.gameMode, "Unavailable", "Unavailable", "Unavailable");
		return;
	}


	setAmountPanelValues(data.gameMode, data.amount, data.min, data.max);

});

socket.on("clientPasswordError", (data) => {

	if(data === undefined || data === null || typeof(data) !== 'object'){
		return;
	}

	if(data.error === undefined || data.error === null){
		return;
	}

	if(data.error === 1){
		badPasswordConfirmModal();
	}

	else if(data.error === 2){
		badPasswordExtensionModal();
	}

});

socket.on("clientUpdateRoomsAvailable", (data) => {


	if(data === undefined || data === null || typeof(data) !== 'object'){
		return;
	}

	if(data.newAmount === undefined || typeof(data.newAmount) !== 'number' || data.gameMode === undefined || typeof(data.gameMode) !== 'number' ||
		data.returnMessage === undefined || typeof(data.returnMessage) !== 'object' || data.returnMessage.result === undefined){
		return;
	}

	if(typeof(data.returnMessage.result) !== 'boolean' || data.returnMessage.result === false){
		return;
	}

	successConfirmModal();

	let currentGameMode = convertGameTypeToNumber(currentGameModeSelected);

	if(data.gameMode === currentGameMode){
		amountAvailableSpan.innerHTML = data.newAmount;
		currentModeRoomsAvailable = data.newAmount;
	}
	else{
		console.log("No longer game mode 2");
	}

	
	updateNodesInDisplay(data);
});


socket.on("clientUpdateRoomNodeStatus", (data) => {

	console.log("Inside of clientUpdateRoomNodeStatus");

	if(data === undefined || data === null || typeof(data) !== 'object'){
		return;
	}

	/*
	if(data.roomNumber === undefined || isNaN(data.roomNumber) || data.gameMode === undefined ||  isNaN(data.gameMode) || 
	   data.roomOn === undefined || typeof(data.roomOn) !== 'boolean'){
		return;
	}
	*/

	if(checkUpdateRoomNode(data) === false){
		return;
	}
	console.log("Inside clientUpdateRoomNodeStatus");
	console.log(data);
	successConfirmModal();
	updateRoomNode(data);
	
});

socket.on("clientUpdateRangeRoomNodeStatus", (data) => {

	console.log("Inside of clientUpdateRangeRoomNodeStatus");

	if(data === undefined || data === null || typeof(data) !== 'object' || Array.isArray(data) === false){
		return;
	}

	successConfirmModal();
	let index = 0;
	let length = data.length;
	let dataNode = null;
	while(index < length){
		dataNode = data[index];
		/*
		if(dataNode.roomNumber === undefined || isNaN(dataNode.roomNumber) || dataNode.gameMode === undefined ||  isNaN(dataNode.gameMode) || 
			dataNode.roomOn === undefined || typeof(dataNode.roomOn) !== 'boolean'){
		 	continue;
	 	}
		*/
		if(checkUpdateRoomNode(dataNode) === false){
			console.log("Skipping one");
			index++;
			continue;
		}
		updateRoomNode(dataNode);
		index++;
	}
});

socket.on("extensionGranted", () => {
	//currentlySignedIn = true;
	//clientDisconnectCalled = false;
	if(currentlySignedIn === false){
		return;
	}
	
	signedInNavbar.style.backgroundColor = "#1eec58";
	signedInText.innerHTML = "Currently Signed In";
	
	if(remainder > 0){
		remainder--;
		extensionRemainder.innerHTML = remainder;
	}

	if(remainder === 0){
		extensionError.innerHTML = "All session extensions have been used.";
	}
	else if(remainder > 0){
		extensionError.innerHTML = "";
	}

	turnOffCountdown();
	minutes = 5;
	seconds = 1;
	writeTime();
	countDown = window.setInterval(writeTime, 1000);

});

socket.on("adminTimeoutWarning", () => {
	if(currentlySignedIn === false){
		return;
	}
	signedInNavbar.style.backgroundColor = "#e0e927";
	signedInText.innerHTML = "Current Session Timing Out Soon...";
});

socket.on("disconnectClientAdmin", (data) => {

	signedInNavbar.style.backgroundColor = "#ce301d";
	signedInText.innerHTML = "Currently Signed Out";
	clientDisconnectCalled = true;

	if(socket.connected){
		socket.disconnect();
	}

	if(data === 1){
		errorMessage = "Time limit of current session has expired. Return to Sign-In Page to sign back into Admin.";
	}
	else if(data === 2){
		errorMessage = "Another user has signed in as Admin. Return to Sign-In Page to sign back into Admin.";
	}
	else{
		errorMessage = "Your current session has disconnected. Return to Sign-In Page to sign back into Admin.";
	}
	
	printError();

	currentlySignedIn = false;
	turnOffCountdown();
	timerNumber.innerHTML = '00:00';
	extensionRemainder.innerHTML = 0;
	extensionError.innerHTML = "Your session has ended.";
	remainder = 0;
	
});

socket.on("disconnect", () => {

	if(clientDisconnectCalled){
		return;
	}
	
	console.log("Disconnect only method called");
	signedInNavbar.style.backgroundColor = "#ce301d";
	signedInText.innerHTML = "Currently Signed Out";
	errorMessage = "Your current session has disconnected. Return to Sign-In Page to sign back into Admin.";
	printError();
	currentlySignedIn = false;
	turnOffCountdown();
	timerNumber.innerHTML = '00:00';
	extensionRemainder.innerHTML = 0;
	extensionError.innerHTML = "Your session has ended.";
	remainder = 0;

});

function disconnectAdmin(e){
	console.log("This was clicked");
	console.log("Disconnecting from admin");
	console.log("Connection status: " + socket.connected);
	signedInNavbar.style.backgroundColor = "#ce301d";
	signedInText.innerHTML = "Currently Signed Out";
	clientDisconnectCalled = true;

	if(socket.connected){
		socket.disconnect();
	}

	console.log("Connection status: " + socket.connected);

	if(currentlySignedIn === false){
		errorMessage = "Already signed out. Return to Sign-In Page to sign back into Admin.";
		printError();
	}
	
	closeConfirmModal();
	currentlySignedIn = false;
	turnOffCountdown();
	timerNumber.innerHTML = '00:00';
	extensionRemainder.innerHTML = 0;
	extensionError.innerHTML = "Your session has ended.";
	remainder = 0;
}

function justRemoveNodeList(e){
	console.log("Just remove node list");
	socket.emit("adminJustUnwatch");
	let displayRoomsXContainer = document.querySelector("#displayRoomsX-container");
	let gameModeHeader = document.querySelector("#currentlyDisplayed");
	displayedHeaderContainer.removeChild(displayRoomsXContainer);
	gameModeHeader.innerHTML = "No Rooms Displayed";
	clearRoomNodesDisplay();
}

function sendAmountAdjustment(e){

	console.log("Amount adjustment called");
	console.log(adjustMin);
	console.log(adjustMax);

	if(socket.connected === false){
		errorMessage = "Already signed out. Return to Sign-In Page to sign back into Admin.";
		printError();
		return;
	}

	if(adjustMin === -1 || adjustMax === -1){
		errorMessage = "Range For Adjustment Currently Unavailable.";
		printError();
		return;
	}

	if(amountAdjustmentText.value.length === 0 || isNaN(amountAdjustmentText.value)){
		errorMessage = "Error: Invalid Input Value For Adjusting Room Amount";
		printError();
		return;
	}

	let amount = parseInt(amountAdjustmentText.value);

	if(adjustMin !== -1 && amount < adjustMin){
		errorMessage = "Error: Input Lower than Allowed Min. Set Of Rooms In " + currentGameModeSelected;
		printError();
		return;
	}

	if(adjustMax !== -1 && amount > adjustMax){
		errorMessage = "Error: Input Higher than Allowed Max Set Of Rooms In " + currentGameModeSelected;
		printError();
		return;
	}

	let data = {
		newAmount: -1,
		gameMode: -1
	};

	//let amount = parseInt(amountAdjustmentText.value);
	data.newAmount = amount;
	data.gameMode = convertGameTypeToNumber(currentGameModeSelected);

	commandMessage = "Confirm: Change Number Of Rooms In " + currentGameModeSelected + " To " + data.newAmount + " Rooms";
	

	action = 1;
	actionData = data;

	printCommand();

	//socket.emit('serverAdjustAmountOfRooms', data);
}

function checkUpdateRoomNode(data){

	if(data.roomNumber === undefined || isNaN(data.roomNumber) || data.gameMode === undefined ||  isNaN(data.gameMode) || 
	   data.roomOn === undefined || typeof(data.roomOn) !== 'boolean'){
		return false;
	}

	return true;
} 


function convertNumberToGameType(number){

	if(number === 0){
		return "Classic";
	}
	else if(number === 1){
		return "K.O.T.H.";
	}
	else if(number === 2){
		return "C.O.T.L.B.";
	}
	else if(number === 3){
		return "Speed";
	}

	return " ";
}

function convertGameTypeToNumber(string){


	if(string === "Classic"){
		return 0;
	}
	else if(string === "K.O.T.H."){
		return 1;
	}
	else if(string === "C.O.T.L.B."){
		return 2;
	}
	else if(string === "Speed"){
		return 3;
	}

	return -1;
}




function changeGameModeSelected(e){

	if(socket.connected === false){
		errorMessage = "Already signed out. Return to Sign-In Page to sign back into Admin.";
		printError();
		return;
	}

	let gameModeSelected = e.target.getAttribute("name");
	//let gameModeHeader = document.querySelector("#currentlyDisplayed");

	if(gameModeSelected === currentGameModeSelected){
		console.log("Selecting same game type");
		return;
	}

	currentGameModeSelected = gameModeSelected;

	classicSelector.setAttribute("clicked", "false");
	kothSelector.setAttribute("clicked", "false");
	cotlbSelector.setAttribute("clicked", "false");
	speedSelector.setAttribute("clicked", "false");
	e.target.setAttribute("clicked", "true");

	selectorHeader.innerHTML = "Game Mode: " + e.target.getAttribute("name");

	amountAvailableSpan.innerHTML = "";
	rangeMinSpan.innerHTML = "";
	rangeMaxSpan.innerHTML = "";
	currentModeRoomsAvailable = -1;
	adjustMin = -1;
	adjustMax = -1;

	if(specificGamesCompletedText.childElementCount > 0){
		specificGamesCompletedText.removeChild(specificGamesCompletedSpan);
	}
	specificGamesCompletedText.innerHTML = e.target.getAttribute("name") + " Games Completed: ";
	specificGamesCompletedSpan.innerText = "";
	specificGamesCompletedText.appendChild(specificGamesCompletedSpan);

	if(specificHighestOccupancyText.childElementCount > 0){
		specificHighestOccupancyText.removeChild(specificHighestOccupancySpan);
	}

	if(specificHighestOccupanyTimeText.childElementCount > 0){
		specificHighestOccupanyTimeText.removeChild(specificHighestOccupanyTimeSpan);
	}



	specificHighestOccupancyText.innerHTML = e.target.getAttribute("name") + " Highest Occupancy: ";
	specificHighestOccupanyTimeText.innerHTML = e.target.getAttribute("name") + " Time Spent At Highest Occupancy: ";
	specificHighestOccupancySpan.innerText = "";
	specificHighestOccupanyTimeSpan.innerText = "";
	specificHighestOccupancyText.appendChild(specificHighestOccupancySpan);
	specificHighestOccupanyTimeText.appendChild(specificHighestOccupanyTimeSpan);

	getAmountPanelValues();
	getTopPanelSpecificValues();

	//gameModeHeader.innerHTML = e.target.getAttribute("name") + " Rooms Displayed";
}

function getTopPanelValues(){

	let data = {
		gameMode: 0
	};

	socket.emit("requestTopPanelValues", data);
}

function getTopPanelSpecificValues(){

	let gameModeNumber = convertGameTypeToNumber(currentGameModeSelected);

	let data = { gameMode: gameModeNumber };

	socket.emit("requestTopPanelSpecificValues", data);
}

function getAmountPanelValues(){

	let gameModeNumber = convertGameTypeToNumber(currentGameModeSelected);

	let data = { gameMode: gameModeNumber };

	socket.emit('requestAmountOfRoomVariables', data);
}


function setAmountPanelValues(gameMode, currentAvailableRoomAmount, newMin, newMax){

	console.log("Set amount panel values called");

	let currentGameMode = convertGameTypeToNumber(currentGameModeSelected);

	if(currentGameMode !== gameMode){
		console.log("No longer the right gamemode");
		return;
	}

	amountAvailableSpan.innerHTML = currentAvailableRoomAmount;
	rangeMinSpan.innerHTML = newMin + "-";
	rangeMaxSpan.innerHTML = newMax;

	if(typeof(currentAvailableRoomAmount) !== 'number'|| typeof(newMin) !== 'number' || typeof(newMax) !== 'number' ){
		console.log("Caught wrong value");
		currentModeRoomsAvailable = -1;
		adjustMin = -1;
		adjustMax = -1;
		return;
	}

	currentModeRoomsAvailable = currentAvailableRoomAmount;
	adjustMin = newMin;
	adjustMax = newMax;
}





function getWatchNode(type, rangeStart, rangeEnd, all){

	let roomType = convertGameTypeToNumber(type);

	let data = {
		gameMode: roomType,
		start: rangeStart,
		end: rangeEnd,
		getAll: all
	};

	return data;
}


function updateNodesInDisplay(rangeNode){

	let panel = document.querySelector("#room-display-panel");
	let nodeList = document.querySelector("#room-node-list");
	let list = nodeList.children;
	//let length = list.length;
	let amountDisplayed = parseInt(nodeList.childElementCount);
	let index = 0;

	let gameMode = rangeNode.gameMode;
	let highestIndex = rangeNode.newAmount - 1;

	let changeOccured = false;

	while(index < amountDisplayed){
		let roomNodeRoomNumber = parseInt(list[index].getAttribute("number"));
		let roomNodeGameMode = parseInt(list[index].getAttribute("gameTypeNumber"));
		if(roomNodeGameMode === gameMode && roomNodeRoomNumber > highestIndex){
			nodeList.removeChild(list[index]);
			amountDisplayed = parseInt(nodeList.childElementCount);
			changeOccured = true;
			continue;
		}
		index++;
	}


	if(changeOccured){
		//let newSize = (154 * parseInt(nodeList.childElementCount)) + 3;
		let newSize = (204 * parseInt(nodeList.childElementCount)) + 1;
		nodeList.style.height = newSize + "px";
		panel.style.height = newSize + 900 + "px";

	}
	//now I need to adjust the room-display-panel size
	console.log("Amount of Rooms Display: ");
	console.log(amountDisplayed);


}




function resetRoomsDisplayed(e){

	if(socket.connected === false){
		errorMessage = "Already signed out. Return to Sign-In Page to sign back into Admin.";
		printError();
		return;
	}

	let rangeStart = -1;
	let rangeEnd = -1;
	let getAll = true;

	let startString = displayRangeStartText.value;
	let endString  = displayRangeEndText.value;

	if(currentModeRoomsAvailable === -1){
		errorMessage = "Error: Missing Amount Of Rooms Available";
		printError();
		return;
	}

	if(startString.length !== 0 && (isNaN(startString) || parseInt(startString) < 0)){
		errorMessage = "Error: Range Input Incorrectly Formatted";
		printError();
		return;
	}

	if(startString.length !== 0 && isNaN(startString) === false && parseInt(startString) >= currentModeRoomsAvailable){
		errorMessage = "Error: Start Index Beyond Availiable Range";
		printError();
		return;
	}

	if(endString.length !== 0 && (isNaN(endString) || parseInt(endString) < 0) || parseInt(endString) < parseInt(startString)){
		errorMessage = "Error: Range Input Incorrectly Formatted";
		printError();
		return;
	}

	if(endString.length !== 0 && isNaN(endString) === false && parseInt(endString) >= currentModeRoomsAvailable){
		errorMessage = "Error: End Index Beyond Availiable Range";
		printError();
		return;
	}


	if(displayRangeStartText.value.length !== 0){
		rangeStart = parseInt(displayRangeStartText.value);
		getAll = false;
	}
	
	if(displayRangeEndText.value.length !== 0){
		rangeEnd = parseInt(displayRangeEndText.value);
		getAll = false;
	}

	let dataToSend = getWatchNode(currentGameModeSelected, rangeStart, rangeEnd, getAll);

	console.log(dataToSend);

	if(dataToSend.getAll){
		commandMessage = "Confirm: Display All Available Rooms From " + currentGameModeSelected;
	}
	else{

		if(dataToSend.start === -1){
			commandMessage = "Confirm: Display Rooms From 0 To " + dataToSend.end + " In " + currentGameModeSelected;
		}
		else if(dataToSend.end === -1){
			commandMessage = "Confirm: Display Rooms From " + dataToSend.start + " To " + (currentModeRoomsAvailable - 1) + " In " + currentGameModeSelected;
		}
		else{
			commandMessage = "Confirm: Display Rooms From " + dataToSend.start + " To " + dataToSend.end + " In " + currentGameModeSelected;
		}
	}

	action = 2;
	actionData = dataToSend;

	printCommand();

	//socket.emit("requestRoomData", (dataToSend));

	
}


function clearRoomNodesDisplay(){

	
	let nodeList = document.querySelector("#room-node-list");
	let panel = document.querySelector("#room-display-panel");

	while(nodeList.firstChild){
		nodeList.removeChild(nodeList.lastChild);
	}

	nodeList.style.height = "1px";
	panel.style.height = "900px";

}


function createNewRoomNodesList(requestedRooms){

	let i = 0;
	let length = requestedRooms.length;
	
	//while(i < numberOfRooms){
	while(i < length){

		addRoomNode(requestedRooms[i]);
		i++;
	}

	//currentRoomNode = 0;
}

function addRoomNode(requestedRoomData){

	let node = createRoomNode(requestedRoomData);
	//currentRoomNode++;
	let panel = document.querySelector("#room-display-panel");
	let nodeList = document.querySelector("#room-node-list");

	let oldSizeOfPanel = panel.offsetHeight;
	//let newSizeOfPanel = oldSizeOfPanel + 152;
	let newSizeOfPanel = oldSizeOfPanel + 202;
	panel.style.height = newSizeOfPanel + "px";

	let oldSizeOfList = nodeList.offsetHeight;
	//let newSizeOfList = oldSizeOfList + 152;
	let newSizeOfList = oldSizeOfList + 202;
	nodeList.style.height = newSizeOfList + "px";

	//console.log(newSizeOfList);
	nodeList.appendChild(node);
}




function createRoomNode(requestedRoomData){

	if(requestedRoomData === undefined || requestedRoomData === null || typeof(requestedRoomData) !== 'object'){
		return;
	}

	let roomNode = document.createElement("div");
	let roomNodeUpper = document.createElement("div");
	let roomNodeLower = document.createElement("div");

	let roomNumberSection = document.createElement("div");
	let roomNumberSquare = document.createElement("div");
	let roomNumber = document.createElement("H2");
	
	let statusSection = document.createElement("div");
	let onStatusContainer = document.createElement("div");
	let onStatus = document.createElement("H2");
	let occupiedStatusContainer = document.createElement("div");
	let occupiedStatus = document.createElement("H2");
	let gameplayStatusContainer = document.createElement("div");
	let gameplayStatus = document.createElement("H2");

	let joinedSection = document.createElement("div");
	let summaryContainer = document.createElement("div");
	let summary = document.createElement("H3");
	let usernameContainer = document.createElement("div");
	let username1 = document.createElement("H3");
	let username2 = document.createElement("H3");

	let manipulateSection = document.createElement("div");
	//let kickBtn = document.createElement("input");
	//let offBtn = document.createElement("input");
	let kickBtn = document.createElement("button");
	//let kickBtnText = document.createElement("H3");
	let offBtn = document.createElement("button");
	//let offBtnText = document.createElement("H3");

	let rematchNumberContainer = document.createElement("div");
	let rematchNumberText = document.createElement("H3");
	let rematchNumberSpan = document.createElement("span");
	let startTimeContainer = document.createElement("div");
	let startTimeText = document.createElement("H3");
	let startTimeSpan = document.createElement("span");


	roomNode.className = "room-node";
	//roomNode.setAttribute("number", currentRoomNode);
	roomNode.setAttribute("number", requestedRoomData.roomNumber);

	//roomNode.setAttribute("gameTypeNumber", convertGameTypeToNumber(currentGameModeSelected));
	//roomNode.setAttribute("gameMode", currentGameModeSelected);

	roomNode.setAttribute("gameTypeNumber", convertGameTypeToNumber(currentGameModeDisplayed));
	roomNode.setAttribute("gameMode", currentGameModeDisplayed);

	roomNodeUpper.className = "room-node-upper";
	roomNodeLower.className = "room-node-lower";

	roomNumberSection.className = "room-node-roomNumberSection";
	roomNumberSquare.className = "room-Number-Square";
	roomNumber.className = "room-number-inside-square";
	//roomNumber.innerHTML = currentRoomNode;
	roomNumber.innerHTML = requestedRoomData.roomNumber;

	statusSection.className = "room-node-statusSection";
	
	onStatus.className = "on-status";
	onStatusContainer.className = "on-status-container";

	if(requestedRoomData.roomOn){
		//onStatus.setAttribute("room-on", "true");
		onStatusContainer.setAttribute("room-on", "true");
		onStatus.innerHTML = "Room On";
	}
	else{
		//onStatus.setAttribute("room-on", "false");
		onStatusContainer.setAttribute("room-on", "false");
		onStatus.innerHTML = "Room Off";
	}

	occupiedStatus.className = "occupied-status";
	occupiedStatusContainer.className = "occupied-status-container";

	if(requestedRoomData.occupiedStatus === false){
		//occupiedStatus.setAttribute("occupied", "false");
		occupiedStatusContainer.setAttribute("occupied", "false");
		occupiedStatus.innerHTML = "Unoccupied";
	}
	else{
		//occupiedStatus.setAttribute("occupied", "true");
		occupiedStatusContainer.setAttribute("occupied", "true");
		occupiedStatus.innerHTML = "Occupied";
	}

	gameplayStatus.className = "gameplay-status";
	gameplayStatusContainer.className = "gameplay-status-container";

	if(requestedRoomData.gameplayStatus === 0){
		//gameplayStatus.setAttribute("gameplay", "noGame");
		gameplayStatusContainer.setAttribute("gameplay", "noGame");
		gameplayStatus.innerHTML = "Not In Progress";		
	}
	else if(requestedRoomData.gameplayStatus === 1){
		//gameplayStatus.setAttribute("gameplay", "progress");
		gameplayStatusContainer.setAttribute("gameplay", "progress");
		gameplayStatus.innerHTML = "Game In Progress";
	}
	else if(requestedRoomData.gameplayStatus === 2){
		//gameplayStatus.setAttribute("gameplay", "intermission");
		gameplayStatusContainer.setAttribute("gameplay", "intermission");
		gameplayStatus.innerHTML = "Intermission";
	}

	roomNumberSquare.appendChild(roomNumber);
	roomNumberSection.appendChild(roomNumberSquare);

	/*
	statusSection.appendChild(onStatus);
	statusSection.appendChild(occupiedStatus);
	statusSection.appendChild(gameplayStatus);
	*/

	onStatusContainer.appendChild(onStatus);
	occupiedStatusContainer.appendChild(occupiedStatus);
	gameplayStatusContainer.appendChild(gameplayStatus);
	statusSection.appendChild(onStatusContainer);
	statusSection.appendChild(occupiedStatusContainer);
	statusSection.appendChild(gameplayStatusContainer);
	
	joinedSection.className = "room-node-joinedSection";

	summaryContainer.className = "joined-summary-container";
	summary.className = "joined-summary";
	usernameContainer.className = "joined-username-container";	
	username1.className = "joined-username1";
	username2.className = "joined-username2";

	summary.innerHTML = requestedRoomData.occupiedResult;

	if(requestedRoomData.playerOneUsername !== null){
		username1.innerHTML = requestedRoomData.playerOneUsername;
	}
	else{
		username1.innerHTML = "";
	}

	if(requestedRoomData.playerTwoUsername !== null){
		username2.innerHTML = requestedRoomData.playerTwoUsername;
	}
	else{
		username2.innerHTML = "";
	}

	/*
	joinedSection.appendChild(summary);
	joinedSection.appendChild(username1);
	joinedSection.appendChild(username2);
	*/

	summaryContainer.appendChild(summary);
	usernameContainer.appendChild(username1);
	usernameContainer.appendChild(username2);
	joinedSection.appendChild(summaryContainer);
	joinedSection.appendChild(usernameContainer);

	
	manipulateSection.className = "room-node-manipulateSection";

	//kickBtn.type = "submit";
	kickBtn.className = "kick-btn";
	//kickBtn.value = "Kick Players";
	kickBtn.innerText = "Kick Players";

	//kickBtnText.innerHTML = "Kick Players";
	//kickBtnText.className = "roomNodeKickBtnText";

	//kickBtn.setAttribute("id", "kick-btn" + currentRoomNode);
	kickBtn.setAttribute("id", "kick-btn" + requestedRoomData.roomNumber);

	//kickBtn.appendChild(kickBtnText);
	kickBtn.addEventListener("click", kickButtonClicked);

	
	//offBtn.type = "submit";
	offBtn.className = "off-btn";

	if(requestedRoomData.roomOn){
		//offBtn.value = "Turn Off";
		//offBtnText.innerHTML = "Turn Off";
		offBtn.innerText = "Turn Off";
		offBtn.setAttribute("changeType", 1);
	}
	else{
		//offBtn.value = "Turn On";
		//offBtnText.innerHTML = "Turn On";
		offBtn.innerText = "Turn On";
		offBtn.setAttribute("changeType", 2);
	}

	//offBtnText.className = "roomNodeOffBtnText";
	//offBtn.setAttribute("id", "off-btn" + currentRoomNode);
	offBtn.setAttribute("id", "off-btn" + requestedRoomData.roomNumber);
	//offBtn.appendChild(offBtnText);
	offBtn.addEventListener("click", onOffButtonClicked)

	manipulateSection.appendChild(kickBtn);
	manipulateSection.appendChild(offBtn);

	/*
	roomNode.appendChild(roomNumberSection);

	roomNode.appendChild(statusSection);
	roomNode.appendChild(joinedSection);
	roomNode.appendChild(manipulateSection);
	*/

	roomNodeUpper.appendChild(roomNumberSection);
	roomNodeUpper.appendChild(statusSection);
	roomNodeUpper.appendChild(joinedSection);
	roomNodeUpper.appendChild(manipulateSection);

	rematchNumberContainer.className = "room-node-rematch-container";
	rematchNumberText.className = "room-node-rematch-text";
	rematchNumberSpan.className = "room-node-rematch-span";
	startTimeContainer.className = "room-node-startTime-container";
	startTimeText.className = "room-node-startTime-text";
	startTimeSpan.className = "room-node-startTime-span";

	rematchNumberText.innerHTML = "Rematches Played: ";
	//rematchNumberSpan.innerText = "0";
	rematchNumberSpan.innerText = requestedRoomData.rematchCounterResult;

	rematchNumberText.appendChild(rematchNumberSpan);
	rematchNumberContainer.appendChild(rematchNumberText);
	//rematchNumberContainer.appendChild(rematchNumberSpan);

	startTimeText.innerHTML = "Start Time: ";
	if(requestedRoomData.inProgressDate === null){
		startTimeSpan.innerText = "---";
	}
	else{
		startTimeSpan.innerText = requestedRoomData.inProgressDate;
	}

	startTimeText.appendChild(startTimeSpan);
	startTimeContainer.appendChild(startTimeText);
	//startTimeContainer.appendChild(startTimeSpan);

	roomNodeLower.appendChild(rematchNumberContainer);
	roomNodeLower.appendChild(startTimeContainer);

	roomNode.appendChild(roomNodeUpper);
	roomNode.appendChild(roomNodeLower);

	return roomNode;

}


function updateRoomNode(updateData){

	console.log("In Update");
	
	if(updateData.roomNumber === undefined || updateData.gameMode === undefined){
		return;
	}

	let roomNumber = parseInt(updateData.roomNumber);
	let gameTypeNumber = parseInt(updateData.gameMode);

	let roomNode = document.querySelector("div[number=" + CSS.escape(roomNumber) + "][gameTypeNumber=" + CSS.escape(gameTypeNumber) + "]");

	if(roomNode === null){
		return;
	}

	let roomNodeUpper = roomNode.querySelector(".room-node-upper");
	let roomNodeLower = roomNode.querySelector(".room-node-lower");
	//let statusSection = roomNode.querySelector(".room-node-statusSection");
	let statusSection = roomNodeUpper.querySelector(".room-node-statusSection");
	let onStatusContainer = statusSection.querySelector(".on-status-container");
	let onStatus = onStatusContainer.querySelector(".on-status");
	//let onStatus = statusSection.querySelector(".on-status");
	let occupiedStatusContainer = statusSection.querySelector(".occupied-status-container");
	let occupiedStatus = occupiedStatusContainer.querySelector(".occupied-status");
	//let occupiedStatus = statusSection.querySelector(".occupied-status");
	let gameplayStatusContainer = statusSection.querySelector(".gameplay-status-container");
	let gameplayStatus = gameplayStatusContainer.querySelector(".gameplay-status");
	//let gameplayStatus = statusSection.querySelector(".gameplay-status");

	//let joinedSection = roomNode.querySelector(".room-node-joinedSection");
	let joinedSection = roomNodeUpper.querySelector(".room-node-joinedSection");
	let summaryContainer = joinedSection.querySelector(".joined-summary-container");
	let summary = summaryContainer.querySelector(".joined-summary");
	//let summary = joinedSection.querySelector(".joined-summary");
	let usernameContainer = joinedSection.querySelector(".joined-username-container");
	let username1 = usernameContainer.querySelector(".joined-username1");	
	let username2 = usernameContainer.querySelector(".joined-username2");
	//let username1 = joinedSection.querySelector(".joined-username1");	
	//let username2 = joinedSection.querySelector(".joined-username2");

	//let manipulateSection = roomNode.querySelector(".room-node-manipulateSection");
	let manipulateSection = roomNodeUpper.querySelector(".room-node-manipulateSection");
	let offBtn = manipulateSection.querySelector(".off-btn");
	//let offBtnText = offBtn.querySelector(".roomNodeOffBtnText");

	let rematchNumberContainer = roomNodeLower.querySelector(".room-node-rematch-container");
	let rematchNumberText = rematchNumberContainer.querySelector(".room-node-rematch-text");
	let rematchNumberSpan = rematchNumberText.querySelector(".room-node-rematch-span");

	let startTimeContainer = roomNodeLower.querySelector(".room-node-startTime-container");
	let startTimeText = startTimeContainer.querySelector(".room-node-startTime-text");
	let startTimeSpan = startTimeText.querySelector(".room-node-startTime-span");

	rematchNumberSpan.innerText = updateData.rematchCounterResult;
	
	if(updateData.inProgressDate === null){
		startTimeSpan.innerText = "---";
	}
	else{
		startTimeSpan.innerText = updateData.inProgressDate;
	}

	if(updateData.roomOn){
		//onStatus.setAttribute("room-on", "true");
		onStatusContainer.setAttribute("room-on", "true");
		onStatus.innerHTML = "Room On";
	}
	else{
		//onStatus.setAttribute("room-on", "false");
		onStatusContainer.setAttribute("room-on", "false");
		onStatus.innerHTML = "Room Off";
	}

	if(updateData.occupiedStatus === false){
		//occupiedStatus.setAttribute("occupied", "false");
		occupiedStatusContainer.setAttribute("occupied", "false");
		occupiedStatus.innerHTML = "Unoccupied";
	}
	else{
		//occupiedStatus.setAttribute("occupied", "true");
		occupiedStatusContainer.setAttribute("occupied", "true");
		occupiedStatus.innerHTML = "Occupied";
	}

	if(updateData.gameplayStatus === 0){
		//gameplayStatus.setAttribute("gameplay", "noGame");
		gameplayStatusContainer.setAttribute("gameplay", "noGame");
		gameplayStatus.innerHTML = "Not In Progress";		
	}
	else if(updateData.gameplayStatus === 1){
		//gameplayStatus.setAttribute("gameplay", "progress");
		gameplayStatusContainer.setAttribute("gameplay", "progress");
		gameplayStatus.innerHTML = "Game In Progress";
	}
	else if(updateData.gameplayStatus === 2){
		//gameplayStatus.setAttribute("gameplay", "intermission");
		gameplayStatusContainer.setAttribute("gameplay", "intermission");
		gameplayStatus.innerHTML = "Intermission";
	}

	summary.innerHTML = updateData.occupiedResult;

	if(updateData.playerOneUsername !== null){
		username1.innerHTML = updateData.playerOneUsername;
	}
	else{
		username1.innerHTML = "";
	}

	if(updateData.playerTwoUsername !== null){
		username2.innerHTML = updateData.playerTwoUsername;
	}
	else{
		username2.innerHTML = "";
	}

	if(updateData.roomOn){
		//offBtn.value = "Turn Off";
		//offBtnText.innerHTML = "Turn Off";
		offBtn.innerText = "Turn Off";
		offBtn.setAttribute("changeType", 1);
	}
	else{
		//offBtn.value = "Turn On";
		//offBtnText.innerHTML = "Turn On";
		offBtn.innerText = "Turn On";
		offBtn.setAttribute("changeType", 2);
	}
}


function getRoomStateChangeNode(gameModeNumber, number, type){

	let data = {
		gameMode: gameModeNumber,
		roomNumber: number,
		changeType: type
	};

	return data;
}


function doRangeKick(e){

	if(socket.connected === false){
		errorMessage = "Already signed out. Return to Sign-In Page to sign back into Admin.";
		printError();
		return;
	}

	let stateChangeArray = doRangeChange(0);
	console.log(stateChangeArray);
	if(stateChangeArray === null){
		return;
	}

	commandMessage = "Confirm: Kick Players In Rooms From " + stateChangeArray.start + " To " + stateChangeArray.end + " In " + currentGameModeSelected;


	action = 5;
	actionData = stateChangeArray;
	printCommand();

	//socket.emit('serverRangeRoomNodeKick', stateChangeArray);
}


function doRangeOff(e){

	if(socket.connected === false){
		errorMessage = "Already signed out. Return to Sign-In Page to sign back into Admin.";
		printError();
		return;
	}

	let stateChangeArray = doRangeChange(1);
	console.log(stateChangeArray);
	if(stateChangeArray === null){
		return;
	}
	commandMessage = "Confirm: Turn Rooms Off From " + stateChangeArray.start + " To " + stateChangeArray.end + " In " + currentGameModeSelected;

	action = 6;
	actionData = stateChangeArray;
	printCommand();
	//socket.emit('serverRangeRoomNodeOffOrOn', stateChangeArray);
}


function doRangeOn(e){

	if(socket.connected === false){
		errorMessage = "Already signed out. Return to Sign-In Page to sign back into Admin.";
		printError();
		return;
	}

	let stateChangeArray = doRangeChange(2);
	console.log(stateChangeArray);
	if(stateChangeArray === null){
		return;
	}
	commandMessage = "Confirm: Turn Rooms On From " + stateChangeArray.start + " To " + stateChangeArray.end + " In " + currentGameModeSelected;

	action = 6;
	actionData = stateChangeArray;
	printCommand();
	//socket.emit('serverRangeRoomNodeOffOrOn', stateChangeArray);
}

function doRangeChange(change){

	let start;
	let end;
	let data;

	if(currentModeRoomsAvailable === -1){
		errorMessage = "Error: Missing Amount Of Rooms Available";
		printError();
		return null;
	}
	

	if(startRangeText.value.length === 0 || endRangeText.value.length === 0){
		//console.log("No Range Entered");
		errorMessage = "Error: Range Not Entered";
		printError();
		return null;
	}

	start = parseInt(startRangeText.value);
	end = parseInt(endRangeText.value);

	if(isNaN(startRangeText.value) || isNaN(endRangeText.value) || start < 0 || end < 0 || end < start){
		//console.log("No Range Entered");
		errorMessage = "Error: Range Input Incorrectly Formatted";
		printError();
		return null;
	}

	if(start >= currentModeRoomsAvailable){
		errorMessage = "Error: Start Index Beyond Availiable Range";
		printError();
		return null;
	}

	if(end >= currentModeRoomsAvailable){
		errorMessage = "Error: End Index Beyond Availiable Range";
		printError();
		return null;
	}

	data = getWatchNode(currentGameModeSelected, start, end, false);
	data.changeType = change;

	return data;

}


function getRoomNodeInfoFromClick(objectClicked, changeType){

	console.log("Object clicked: ");
	console.log(objectClicked);

	//let roomNode = objectClicked.target.parentNode.parentNode;
	let roomNode = objectClicked.target.parentNode.parentNode.parentNode;
	let mode = roomNode.getAttribute("gameMode");

	let gameModeNumber = convertGameTypeToNumber(mode);
	let number = parseInt(roomNode.getAttribute("number"));

	let data = getRoomStateChangeNode(gameModeNumber, number, changeType);
	return data;

}


function printChangeNode(data){
	console.log("Game Mode of Room Node: " + data.gameMode);
	console.log("Room Node Clicked: " + data.roomNumber);
	console.log("Change Type: " + data.changeType);
}

function kickButtonClicked(e){

	if(socket.connected === false){
		errorMessage = "Already signed out. Return to Sign-In Page to sign back into Admin.";
		printError();
		return;
	}

	let data = getRoomNodeInfoFromClick(e, 0);
	printChangeNode(data);
	commandMessage = "Confirm: Kick Players From Room " + data.roomNumber + " In " + currentGameModeDisplayed;
	action = 3;
	actionData = data;
	printCommand();
	//socket.emit("serverRoomNodeKick", data);
}

function onOffButtonClicked(e){

	if(socket.connected === false){
		errorMessage = "Already signed out. Return to Sign-In Page to sign back into Admin.";
		printError();
		return;
	}

	let changeType = parseInt(e.target.getAttribute("changeType"));
	let data = getRoomNodeInfoFromClick(e, changeType);
	printChangeNode(data);
	if(changeType === 1){
		commandMessage = "Confirm: Turn Room " + data.roomNumber + " In " + currentGameModeDisplayed + " Off.";
	}
	else if(changeType === 2){
		commandMessage = "Confirm: Turn Room " + data.roomNumber + " In " + currentGameModeDisplayed + " On.";
	}

	action = 4;
	actionData = data;
	printCommand();
	//socket.emit("serverRoomNodeOffOrOn", data);
}

function closeConfirmModal(){
	confirmModal.style.visibility = "hidden";
	confirmPasswordError.innerHTML = "";
	confirmEnterPassword.value = "";
	action = 0;
	actionData = null;
}

function badPasswordConfirmModal(){
	if(confirmModal.style.visibility === "hidden"){
		console.log("Currently Hidden Confirmation");
		return;
	}
	confirmPasswordError.innerHTML = "";
	confirmPasswordError.style.color = "red";
	confirmPasswordError.innerHTML = "Incorrect Password";

}

function successConfirmModal(){
	if(confirmModal.style.visibility === "hidden"){
		console.log("Currently Hidden Confirmation");
		return;
	}
	confirmPasswordError.innerHTML = "";
	confirmPasswordError.style.color = "green";
	confirmPasswordError.innerHTML = "Success";
}

function openConfirmModal(){
	confirmModal.style.visibility = "visible";
}

function printCommand(){
	console.log(commandMessage);
	confirmText.innerHTML = commandMessage;
	openConfirmModal();
}

function useConfirmedAction(e){

	console.log("In use action");
	console.log(confirmEnterPassword.value);

	actionData.actionPassword = confirmEnterPassword.value;
	confirmEnterPassword.value = "";
	console.log(actionData);
	
	if(action === 1){
		socket.emit('serverAdjustAmountOfRooms', actionData);
	}
	else if(action === 2){
		socket.emit("requestRoomData", actionData);
	}
	else if(action === 3){
		socket.emit("serverRoomNodeKick", actionData);
	}
	else if(action === 4){
		socket.emit("serverRoomNodeOffOrOn", actionData);
	}
	else if(action === 5){
		socket.emit('serverRangeRoomNodeKick', actionData);
	}
	else if(action === 6){
		socket.emit('serverRangeRoomNodeOffOrOn', actionData);
	}

	//closeConfirmModal();

}


function closeErrorModal(e){
	errorModal.style.visibility = "hidden";
}

function openErrorModal(){
	errorModal.style.visibility = "visible";
}

function openExtensionModal(){
	extensionModal.style.visibility = "visible";
}

function badPasswordExtensionModal(){
	if(extensionModal.style.visibility === "hidden"){
		console.log("Currently Hidden Extension");
		return;
	}
	if(remainder > 0){
		extensionError.innerHTML = "Incorrect Password";
	}
}

function closeExtensionModal(){
	extensionModal.style.visibility = "hidden";
	extensionPasswordField.value = "";
	if(remainder > 0){
		extensionError.innerHTML = "";
	}
}

function submitExtensionRequest(){
	console.log("Submit button clicked");
	console.log(extensionPasswordField.value);
	let data = {
		actionPassword: extensionPasswordField.value
	}
	socket.emit("requestLongerSession", data);
	extensionPasswordField.value = "";
}

function printError(){
	closeConfirmModal();
	console.log(errorMessage);
	errorText.innerHTML = errorMessage;
	openErrorModal();
}

function writeTime(){

	if(seconds === 0 && minutes >= 0){
		seconds = 59;
		minutes--;
	}
	else{
		seconds--;
	}

	
	if(minutes < 0){
		//clearInterval(countDown);
		//countDown = null;
		turnOffCountdown();
		timerNumber.innerHTML = '00:00';
		return;
	}

	timerNumber.innerHTML = getTimerFormat();
}


function getTimerFormat(){

	let min;
	let sec;

	if(minutes < 10){
		min = '0' + minutes;
	}
	else{
		min = minutes;
	}

	if(seconds < 10){
		sec = '0' + seconds;
	}
	else{
		sec = seconds;
	}

	return min + ':' + sec;
}

function getFormattedSeconds(totalSeconds){

	if( totalSeconds === null || typeof(totalSeconds) !== 'number' || totalSeconds < 0){
		return '---';
	}

	let formattedMinutes = Math.floor(totalSeconds/60);
	let formattedSeconds = (totalSeconds - (formattedMinutes * 60));

	if(formattedMinutes > 0){
		return formattedMinutes + ' min. ' + formattedSeconds + ' sec.';
	}
	else{
		return formattedSeconds + ' sec.';
	}
}

function convertSecondsToTimer(totalSeconds){
	

	if(totalSeconds <= 0){
		return;
	}

	minutes = Math.floor(totalSeconds/60)
	seconds = (totalSeconds - (minutes * 60))

}

function turnOffCountdown(){
	if(countDown !== null){
		clearInterval(countDown);
		countDown = null;
	}
}


function waster(){
	return new Promise((resolve, reject) => {

		console.log("About to wait 10 secs");

			setTimeout(
				() => { resolve(1);}, 
				7000
			);
		
	});
}


