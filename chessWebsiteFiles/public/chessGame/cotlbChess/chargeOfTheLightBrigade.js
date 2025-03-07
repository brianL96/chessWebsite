let rematchBtn = document.querySelector('#rematch-btn');
let rematchBtnText = document.querySelector("#rematch-btn-text");
let drawBtn = document.querySelector('#draw-btn');
let drawBtnText = document.querySelector('#draw-btn-text');
let resignBtn = document.querySelector('#resign-btn');
let saveBtn = document.querySelector('#save-btn');


let gameStateInfo = document.querySelector("#gameStateInfo");

let oppUsernameText = document.querySelector("#p1");
let usernameText = document.querySelector("#p2");

rematchBtn.addEventListener("click", resetGame);
drawBtn.addEventListener("click", declareDraw);
resignBtn.addEventListener("click", resignation);
saveBtn.addEventListener("click", saveGame);

let firstGame = true;
let firstGameComplete = false;
let messagesExchanged = 0;

let gameInProgress = false;


let offeredDraw = false;
let oppOfferedDraw = false;
let oppOfferedRematch = false;



let whichPlayer = -1;
let currentPlayer;
let opponentPlayer;
let selectedPiece = "empty";
let selectedX = -1;
let selectedY = -1;
let playerInCheck = false;
let oppInCheck = false;
let possibleMoves = [];
let waiting;
let rematchNumber = 0;


let disconnected = false;

let toSwapPlayer = true;
let getKnights;

let promoteDOMPiece;
let promotePiece;

let backendBoard = null;


let sendingMove = {
	//player: -1,
	sendingMoveSet: [],
	moveType: null,
	promoteDOM: null,
	promotePiece: null,
	gameNumber: 0
};

let firstTimerTurnOn = false;

let gameSaver;

let drawCheck;

let recievedFirstMove = false;
let recievedFirstMoveSet = null;


let myTimer = document.querySelector('#my-timer');
let myTimerContainer = document.querySelector("#my-timer-container");
let oppTimer = document.querySelector('#opp-timer');
let oppTimerContainer = document.querySelector("#opp-timer-container");

let myTimerRed = false;
let oppTimerRed = false;

let myCountDown = null;
let oppCountDown = null;

let myMinutes = 12;
let mySeconds = 0;
let oppMinutes = 12;
let oppSeconds = 0;



let myElo = document.querySelector('#my-elo');
let oppElo = document.querySelector('#opp-elo');


let saveGameModal = document.querySelector("#saveGameModal");
let saveGameNameInput = document.querySelector("#toSaveGameName");
let finishSaveBtn = document.querySelector("#finishSave-btn");
let cancelSaveBtn = document.querySelector("#save-cancel-btn");
let closeSaveBtn = document.querySelector("#saveGameModal-close");
let badSaveWarning = document.querySelector("#saveModal-warning");
let viewGamesBtn = document.querySelector("#view-btn");

let gameResult = 'Ongoing';
let dateString = null;

let closeViewX = document.querySelector("#vd-viewGamesModal-close");
let closeViewBtn = document.querySelector("#vd-close-btn");
let deleteBtn = document.querySelector("#delete-btn");
let displayGamesModal = document.querySelector("#view-games-modal");
let displayVerticalMenu = document.querySelector("#vd-game-info-vertical-menu");
let displayedGameID = -1;
let viewWarningText = document.querySelector("#view-modal-warning");


const socket = io('/cotlbGame');

let opponentUsername;
let opponentFound = false;
let currentRoomIndex = sessionStorage.getItem("cotlbCurrentRoom");
let currentPosition = sessionStorage.getItem("cotlbCurrentPosition");
let username = sessionStorage.getItem("username");
let password = sessionStorage.getItem("password");

let fixedHeader = document.querySelector("#fixed-header");
let fixedHeaderMenu = document.querySelector("#fixed-header-menu");

if(username !== null){
	createSignedInHeader(username);
}
else{
	createNotSignedInHeader();
}


if(currentRoomIndex !== null && currentPosition !== null && username !== null){

	currentRoomIndex = parseInt(sessionStorage.getItem("cotlbCurrentRoom"));
	currentPosition = parseInt(sessionStorage.getItem("cotlbCurrentPosition"));

	console.log("Connecting to room: " + currentRoomIndex);
	console.log("Player position: " + currentPosition);

	let getRoomData = { 
		getRoomIndex: currentRoomIndex,
		getPosition: currentPosition,
		getUsername: username,
		getPassword: password
	};

	socket.emit('connectToRoom', getRoomData);

	//usernameText.innerHTML = username;
	if(usernameText.firstChild){
		usernameText.removeChild(usernameText.lastChild);
	}
	usernameText.append(document.createTextNode(username));

}

function createNotSignedInHeader(){

	let loginBtn = document.createElement("input");
	let signupBtn = document.createElement("input");
	let buttonDiv = document.createElement("div");

	fixedHeaderMenu.classList.add('header-sm:w-3/4');

	loginBtn.id = "header-login-btn";
	loginBtn.type = "submit";
	loginBtn.value = "Log In";
	loginBtn.className = "w-28 h-1/2 bg-green-600 text-white rounded cursor-pointer shadow hover:bg-green-500 text-lg md:text-xl";

	signupBtn.id = "header-signup-btn";
	signupBtn.type = "submit";
	signupBtn.value = "Sign Up";
	signupBtn.className = "w-28 h-1/2 bg-green-600 text-white rounded cursor-pointer shadow hover:bg-green-500 text-lg md:text-xl";

	loginBtn.addEventListener("click", goToLogin);
	signupBtn.addEventListener("click", goToSignUp);

	buttonDiv.className = "flex flex-row justify-around w-70 lg:w-1/4 h-full items-center";
	buttonDiv.appendChild(loginBtn);
	buttonDiv.appendChild(signupBtn);

	fixedHeader.appendChild(buttonDiv);
}

function createSignedInHeader(user){
	let helloMessage = document.createElement("div");
	let helloMessageContainer = document.createElement("div");

	let signoutBtn = document.createElement("input");
	let signoutBtnContainer = document.createElement("div");
	let signoutContainer = document.createElement("div");

	fixedHeaderMenu.classList.add('header-sm:w-2/3');

	helloMessage.id = "header-hello";
	//helloMessage.innerHTML = "Hello " + user;
	helloMessage.append(document.createTextNode("Hello " + user));
	helloMessage.className = "flex flex-row flex-nowrap text-lg header-sm:text-md";
	helloMessageContainer.className = "flex flex-col justify-center text-center";
	helloMessageContainer.appendChild(helloMessage);

	signoutBtn.id  = "header-signout-btn";
	signoutBtn.type = "submit";
	signoutBtn.value = "Sign Out";
	signoutBtn.className = "w-24 lg:w-28 h-1/2 bg-green-600 text-white text-lg md:text-xl rounded cursor-pointer shadow hover:bg-green-500";
	signoutBtn.addEventListener("click", signOut);

	signoutBtnContainer.className = "flex flex-col justify-center h-full";
	signoutBtnContainer.appendChild(signoutBtn);

	signoutContainer.className = "flex flex-row justify-around h-full w-105 header-sm:w-1/3";	
	signoutContainer.appendChild(helloMessageContainer);
	signoutContainer.appendChild(signoutBtnContainer);

	fixedHeader.appendChild(signoutContainer);


}

function signOut(){
	sessionStorage.removeItem("username");
	sessionStorage.removeItem("password");
	window.location.href = "../";
}

function goToLogin(){
	window.location.href = "../home/Login";
}

function goToSignUp(){
	window.location.href = "../home/signUp";
}






socket.on('message', (message) => {

});

socket.on('clientSimpleMessage', (data) => {
	printText(data.message);
});

socket.on('safeToUpdateElo', () => {
	console.log("Inside safe to update elo");
	if(disconnected && socket.connected){
		socket.disconnect();
	}
	adjustElo();
});

socket.on('clientTimeout', (data) => {

	console.log("Inside Client Timeout");

	if(data.differentMessage){
		if(whichPlayer === 1){
			printText(data.playerOneMessage);
		}
		else if(whichPlayer === 2){
			printText(data.playerTwoMessage);
		}
	}
	else{
		printText(data.info);
	}

	if(data.timingOut){
		socket.disconnect();
		disconnected = true;
		stopFrontTimer();
	}
});


socket.on('getOppUsername', (data) => {

	console.log(data);

	if(data.playerUsername === undefined || data.playerUsername === null || data.playerUsername === username){
		return;
	}

	
	opponentFound = true;
	//oppUsernameText.innerHTML = data.playerUsername;
	if(oppUsernameText.firstChild){
		oppUsernameText.removeChild(oppUsernameText.lastChild);
	}
	oppUsernameText.append(document.createTextNode(data.playerUsername));
	opponentUsername = data.playerUsername;
	clearText();
	printText("Starting New Game");
	printText("Opponent Joined The Game");
	getElo(opponentUsername, 2);
	


});

socket.on('opponentLeft', (data) => {

	opponentFound = false;
	offeredDraw = false;
	oppOfferedDraw = false;

	changeDrawBtnText("Offer Draw");

	//oppUsernameText.innerHTML = "Waiting...";
	if(oppUsernameText.firstChild){
		oppUsernameText.removeChild(oppUsernameText.lastChild);
	}
	oppUsernameText.append(document.createTextNode("Waiting..."));
	printText("Opponent Disconnected");
	printText("Waiting For Another Player To Join");
	oppElo.innerHTML = "Rating: NA";

});


socket.on('clientDisconnect', (data) => {

	//console.log("Disconnecting from room");
	sessionStorage.removeItem("cotlbCurrentRoom");
	sessionStorage.removeItem("cotlbCurrentPosition");
	disconnected = true;
	gameInProgress = false;


	if(data.gameVictory){
		printText("Opponent Left and Forfeited");
		if(whichPlayer === 1){
			printText("Black Disconnected, White Wins");
		}
		else{
			printText("White Disconnected, Black Wins");
		}
		
		gameResult = "Forfeit";
		updateSaveGameModalSpans();
		endGame();
	}
	else{
		printText("Opponent Left, Disconnected From Room");
		socket.disconnect();
	}

	stopFrontTimer();

});



socket.on('timeLoss', (data) => {


	if(data.timeLoss){

		//data.player is the loser
		if(data.player === 1){
			
			//console.log("White in Checkmate, Black Won");
			printText("White Lost On Time, Black Wins");
		}
		else{
			
			//console.log("Black in Checkmate, White Won");
			printText("Black Lost On Time, White Wins");
		}

		if(whichPlayer === data.player){
			myTimer.innerHTML = "00:00";
			myMinutes = 0;
			mySeconds = 0;
			turnTimerRed("myTimer");
		}
		else{
			oppTimer.innerHTML = "00:00";
			oppMinutes = 0;
			oppSeconds = 0;
			turnTimerRed("oppTimer");
		}

		gameInProgress = false;
		endGame();
		stopFrontTimer();
		gameResult = "Timer";
		updateSaveGameModalSpans();
	}
	
});


socket.on('clientCheckInsufficientMaterial', (data) => {

	if(data.player === whichPlayer){

		console.log("About to check opponent for insufficient pieces");

		let data = {
			drawSet: false,
			gameNumber: sendingMove.gameNumber
		};

		if(drawCheck.checkInsufficientOneSide(opponentPlayer, backendBoard.getBoardState())){
			
			data.drawSet = true;
		}

		socket.emit('confirmInsufficientCheck', data);

	}
});

socket.on('clientCheckmate', (data) => {


	if(data.checkmateStatus){

		if(data.player === whichPlayer){
			//here need to update board
			console.log("Checkmate Final Move:")
			console.log(data.sendingSet);
			updateBoardWithRecievedMoveset(data.sendingSet);
			checkForCheck();
		}

		//data.player is the loser
		if(data.player === 1){
			
			//console.log("White in Checkmate, Black Won");
			printText("White in Checkmate, Black Wins");
		}
		else{
			
			//console.log("Black in Checkmate, White Won");
			printText("Black in Checkmate, White Wins");
		}

		gameInProgress = false;
		endGame();
		stopFrontTimer();
		gameResult = "Checkmate";
		updateSaveGameModalSpans();
	}
	
});

socket.on('clientStalemate', (data) => {


	if(data.stalemateStatus){

		if(data.player === whichPlayer){
			//here need to update board
			console.log("Stalemate Final Move:")
			console.log(data.sendingSet);
			updateBoardWithRecievedMoveset(data.sendingSet);
		
		}

		//console.log("Game ends in Stalemate");
		printText("Game Ends in Stalemate");
		gameInProgress = false;
		endGame();
		stopFrontTimer();
		gameResult = "Stalemate";
		updateSaveGameModalSpans();
	}
	
});

socket.on('resignation', (data) => {

	if(gameInProgress !== true){
		return;
	}

	if(data.resign){

		//data.player is the loser
		if(data.player === 1){
			
			//console.log("White resigns, Black Won");
			printText("White resigns, Black Wins");
		}
		else{
			
			//console.log("Black resigns, White Won");
			printText("Black resigns, White Wins");
		}

		gameInProgress = false;
		endGame();
		stopFrontTimer();
		gameResult = "Resignation";
		updateSaveGameModalSpans();
	}
	
});

socket.on('clientAdditionalDraw', (data) => {

	//drawType: 1:Insufficient Material 2:Lack Of Progress 3: Insufficient Material Vs Timeout
	if(gameInProgress !== true){
		return;
	}

	if(data.drawSet){

		if(data.player === whichPlayer){
			//here need to update board
			console.log("Additional Draw Final Move:")
			console.log(data.sendingSet);
			updateBoardWithRecievedMoveset(data.sendingSet);
			checkForCheck();
		}

		gameInProgress = false;
		endGame();
		stopFrontTimer();

		if(data.drawType === 1){
			console.log("Inside of clientAdditionalDraw");
			printText("Both Players Have Insufficient Material");
			printText("Game Ends In Draw");
			gameResult = "Draw: Insufficient Material";
			updateSaveGameModalSpans();
			return;
		}

		else if(data.drawType === 2){
			console.log("Inside of clientAdditionalDraw");
			printText("Fifty Move Rule: No Game Progression");
			printText("Game Ends In Draw");
			gameResult = "Draw: Fifty Move Rule";
			updateSaveGameModalSpans();
			return;
		}

		else if(data.drawType === 3){
			console.log("Inside of clientAdditionalDraw");
			printText("Insufficient Material Vs. Timeout");
			printText("Game Ends In Draw");
			gameResult = "Draw: Insufficient Material Vs. Timeout";
			updateSaveGameModalSpans();
			return;
		}
		else if(data.drawType === 4){
			console.log("Inside of clientAdditionalDraw");
			printText("Threefold Repetition");
			printText("Game Ends In Draw");
			gameResult = "Draw: Threefold Repetition";
			updateSaveGameModalSpans();
			return;
		}
	}

});


socket.on('clientDraw', (data) => {
	//handle both the draw offer and the draw acceptance

	if(data.player === whichPlayer && data.handShakeComplete === false){
		return;
	}

	if(opponentFound === false){
		//console.log("Opponent Not Found, Draw Offer Not Accepted");
		return;
	}

	if(data.handShakeComplete === false){
		oppOfferedDraw = true;
		printText("Opponent Offered Draw");
		changeDrawBtnText("Accept Draw");
		return;

	}

	if(data.handShakeComplete){
		gameInProgress = false;
		if(data.player === whichPlayer){
			//printText("You Accepted Draw Offer");
		}
		else{
			printText("Opponent Accepted Draw");
		}
		
		printText("Game Ends in Draw");
		endGame();
		stopFrontTimer();
		gameResult = "Draw";
		updateSaveGameModalSpans();
		return;
	}
	
});


socket.on('clientReset', (data) => {

	if( (data.player === whichPlayer && data.handShakeComplete === false) || (data.player === -1)){
		return;
	}

	if(data.handShakeComplete === false){
		oppOfferedRematch = true;
		printText("Opponent Offers Rematch");
		changeRematchBtnText("Accept Rematch");
		return;
	}

	if(data.handShakeComplete){
		performSwap();
		resetBasics();
		startGame();
		gameResult = 'Ongoing';
		sendingMove.gameNumber++;
		updateSaveGameModalSpans();
		return;
	}
	
});




socket.on('getRoom', (data) => {
	
	if(data.getRoomIndex === -1){
		printText("All Rooms are Full");
		socket.disconnect();
	}
	else{

		if(gameInProgress){
			return;
		}

		if(data.success !== true){
			if(data.errorType === 0){
				printText("Cannot connect to room - Username not found");
			}
			else if(data.errorType === 1){
				printText("Cannot connect to room - Password incorrect");
			}
			else{
				printText("Cannot connect to room");
			}
			socket.disconnect();
			return;
		}

		if(data.firstMove){
			recievedFirstMove = true;
			recievedFirstMoveSet = data.firstMoveSet;
		}

		whichPlayer = currentPosition;
		if(whichPlayer === 1){
			currentPlayer = "w";
			opponentPlayer = "b";
			getKnights = true;
		}
		else{
			currentPlayer = "b";
			opponentPlayer = "w";
			getKnights = false;
		}
		getOpponentUsername();
		sendUsername();
		startGame();
	}
});

socket.on('clientMessage', (data) => {

	if(data.player === whichPlayer){
		return;
	}

	else{

		checkForFiftyMoveRule(data.sendingMoveSet[0], data.sendingMoveSet[1], data.sendingMoveSet[2], data.sendingMoveSet[3]);
		updateBoardWithRecievedMoveset(data);
		checkForCheck();
		checkForInsufficientPieces();
		checkForThreefoldRepetition(data.moveType);
		adjustOppTime(data.oppTimeLeft);
		adjustMyTime(data.myTimeLeft);
		waiting = false;
		handleCountDownClock("myTimer");

	}
	
});

socket.on('disconnect', () => {
	
	printText("Disconnected From Room");
	printText("Return To Game Select Page To Connect To New Room");
	stopFrontTimer();
	//adjustElo();
});


function getOpponentUsername(){
	let data = {
		gameNumber: sendingMove.gameNumber
	};

	socket.emit("requestOppUsername", data);
}

function sendUsername(){
	let data = {
		gameNumber: sendingMove.gameNumber
	};

	socket.emit("sendOppUsername", data);
}


function move(e){


	let messageSent = false;
	let noProgression = false;

	let otherPlayer;

	if(whichPlayer === 1){
		otherPlayer = 2;
	}
	else{
		otherPlayer = 1;
	}

	if(gameInProgress !== true){
		return;
	}

	let x = e.target.getAttribute("xvalue");
	let y = e.target.getAttribute("yvalue");

	let xVal = parseInt(x);
	let yVal = parseInt(y);
	
	let currentPiece = e.target.getAttribute("piece");

	if(currentPiece === "empty" && selectedPiece === "empty" || (x === selectedX && y === selectedY)){		
		return;
	}


	//selecting piece
	if(selectedPiece === "empty"){
		//if selectPiece is "empty" then no piece is currently selected

		//if(boardState[xVal][yVal].charAt(0) !== currentPlayer){
		if(backendBoard.getPiece(xVal, yVal).charAt(0) !== currentPlayer){
			return;
		}

		primePiece(currentPiece, xVal, yVal);

		return; 
	}

	else{

		//if(boardState[xVal][yVal].charAt(0) === currentPlayer){
		if(backendBoard.getPiece(xVal, yVal).charAt(0) === currentPlayer){
			//a piece is selected, but player selects another of their pieces
			unHighlight();
			primePiece(currentPiece, xVal, yVal);
			return;
		}

		if(waiting){
			return;
		}

		if(validateMove(xVal, yVal) !== true){
			return;
		}


		sendingMove.sendingMoveSet.splice(0, sendingMove.sendingMoveSet.length);

		if(playerInCheck){
			highlightCheck(backendBoard.getMyKing().getX(), backendBoard.getMyKing().getY(), false);
			playerInCheck = false;
			if(currentPlayer === "w"){
				printText("White Out Of Check");
			}
			else{
				printText("Black Out Of Check");
			}
		}

		if(drawCheck.checkFifty(backendBoard.getBoardState(), selectedX, selectedY, xVal, yVal)){
			noProgression = true;
		}

		let updateStat = backendBoard.updateBoardState(selectedX, selectedY, xVal, yVal);



		selectedPiece = "empty";
		unHighlight();

		if(updateStat.getMoveType() === "promotion"){
			backendBoard.pawnPromoteMove(promotePiece, selectedX, selectedY, xVal, yVal);
		}


		let moveSet = updateStat.getMoves();

		updateDOMBoardAndSaveMove(updateStat.getMoveType(), moveSet);

		let checkStatus = backendBoard.kingCheck();


		for(let i = 0; i < moveSet.length; i++){
			sendingMove.sendingMoveSet.push(invertMoves(moveSet[i]));
		}

		
		sendingMove.moveType = updateStat.getMoveType();

		if(updateStat.getMoveType() === "promotion"){
			sendingMove.promoteDOM = promoteDOMPiece;
			sendingMove.promotePiece = promotePiece;	
		}



		if(checkStatus.inCheck && checkStatus.side === opponentPlayer){
			highlightCheck(checkStatus.checkX, checkStatus.checkY, true);
			oppInCheck = true;

			if(checkStatus.checkmate === false){
				if(opponentPlayer === "w"){
					printText("White In Check");
				}
				else{
					printText("Black In Check");
				}
			}
		
			if(checkStatus.checkmate){
				let checkmateMove = {
					sendingSet: sendingMove

				};
					
				socket.emit('checkmateStatus', checkmateMove);
				messageSent = true;
			}
		}

		else{
			if(backendBoard.stalemate(opponentPlayer)){

				let stalemateMove = {
					sendingSet: sendingMove
				};

				socket.emit('stalemateStatus', stalemateMove);
				messageSent = true;
			}
		}

		messageSent = sendAdditionalDrawCondition(noProgression, messageSent, updateStat.getMoveType());

		handleCountDownClock("oppTimer");

		if(messageSent === false){
			socket.emit('gameMove', sendingMove);
			messageSent = true;
		}

		if(oppOfferedDraw){
			changeDrawBtnText("Offer Draw");
			oppOfferedDraw = false;
			printText("You Declined Draw");
		}


		selectedX = -1;
		selectedY = -1;

		waiting = true;
		sendingMove.promoteDOM = null;
		sendingMove.promotePiece = null;

	}
}


function invertMoves(x){

	let x2;

	switch(x){
		case 7:
			x2 = 0;
			break;
		case 6:
			x2 = 1;
			break;
		case 5:
			x2 = 2;
			break;
		case 4:
			x2 = 3;
			break;
		case 3:
			x2 = 4;
			break;
		case 2:
			x2 = 5;
			break;
		case 1:
			x2 = 6;
			break;
		case 0:
			x2 = 7;
			break;
	}

	return x2;
}


function validateMove(x, y){

	for(let i = 0; i < possibleMoves.length; i++){
		if(possibleMoves[i].getX() == x &&
		possibleMoves[i].getY() == y){

			if(possibleMoves[i].getInCheck()){
				return false;
			}
			else{
				return true;
			}
		}
	}

	return false;
}

function replaceMoves(moves){

	let size = moves.length;

	for(let i = 0; i < size; i++){
		possibleMoves.push(moves.shift());
	}

	if(moves.length > 0){
		moves.splice(0, moves.length);
	}
}


function performSwap(){

	if(toSwapPlayer){
		swapLayout();
		swapPlayer();
		toSwapPlayer = false;
	}
	else{
		swapLayout();
		toSwapPlayer = true;
	}
}

function swapLayout(){
	if(getKnights){
		getKnights = false;
	}
	else{
		getKnights = true;
	}
}

function swapPlayer(){

	if(whichPlayer === 1){
		whichPlayer = 2;
		currentPlayer = "b";
		opponentPlayer = "w";
	}
	else{
		whichPlayer = 1;
		currentPlayer = "w";
		opponentPlayer = "b";
	}
}

function startGame(){

	clearText();
	printText("Starting New Game");

	gameInProgress = true;

	if(whichPlayer === 1){
		backendBoard = new Board("w", "b");
		waiting = false;
	}
	else{
		backendBoard = new Board("b", "w");
		waiting = true;
	}

	if(firstGame){
		createBoard();
		getElo(username, 1);

	}

	if(firstGameComplete){
		if(currentPlayer === "w"){
			myCountDown = window.setInterval(writeMyTime, 1000);
		}
		else if(currentPlayer === "b"){
			oppCountDown = window.setInterval(writeOppTime, 1000);
		}
	}
	
	resetPlayer();

	gameSaver = new Saver(currentPlayer);
	drawCheck = new drawChecker(currentPlayer, opponentPlayer);
	backendBoard.turnOffCastling();
	drawCheck.checkThreeFoldRepetition(backendBoard.getBoardStateToken());

	if(recievedFirstMove && firstGameComplete === false){
		handleIncomingMove(recievedFirstMoveSet);
		recievedFirstMove = false;
		recievedFirstMoveSet = null;
	}

}


function resetBasics(){

	gameInProgress = false;
	offeredDraw = false;
	oppOfferedDraw = false;
	oppOfferedRematch = false;

	if(selectedPiece !== "empty" && selectedX !== -1 && selectedPiece !== -1){
		unHighlight();
	}

	selectedPiece = "empty";
	selectedX = -1;
	selectedY = -1;
	playerInCheck = false;
	oppInCheck = false;

	possibleMoves.splice(0, possibleMoves.length);

	
	sendingMove.sendingMoveSet.splice(0, sendingMove.sendingMoveSet.length);
	sendingMove.moveType = null;
	sendingMove.promoteDOM = null;
	sendingMove.promotePiece = null;
	

	changeRematchBtnText("Rematch");
	changeDrawBtnText("Offer Draw");

	highlightCheck(backendBoard.getMyKing().getX(), backendBoard.getMyKing().getY(), false);
	highlightCheck(backendBoard.getOppKing().getX(), backendBoard.getOppKing().getY(), false);

	myMinutes = 12;
	mySeconds = 0;
	oppMinutes = 12;
	oppSeconds = 0;

	resetMyTimerRed();
	resetOppTimerRed();

	myTimer.innerHTML = "12:00";
	oppTimer.innerHTML = "12:00";
}


function endGame(){
	firstGameComplete = true;
}


function checkForCheck(){

	console.log("Inside of here");

	let checkStatus = backendBoard.kingCheck();

	console.log(checkStatus.inCheck);
	console.log(checkStatus.side);

	if(checkStatus.inCheck && checkStatus.side === currentPlayer){
		highlightCheck(checkStatus.checkX, checkStatus.checkY, true);
		playerInCheck = true;

		if(checkStatus.checkmate === false){
			if(currentPlayer === "w"){
				printText("White In Check");
			}
			else{
				printText("Black In Check");
			}
		}
		
	}

}


function createBoard(){

	let board = document.querySelector("#board");
	let width = 8;
	let height = 8;
	let shaded = false;
	

	for(let i = 0; i < width; i++){
		
		for(let j = 0; j < height; j++){

			let spot = document.createElement("div");
			spot.setAttribute("xvalue", i);
			spot.setAttribute("yvalue", j);
			spot.setAttribute("check", "false");

			if(shaded === false){
				spot.className = "w-1/8 h-1/8 border border-black border-solid bg-burley-wood m-0";
				shaded = true;
			}
			else{
				spot.className = "w-1/8 h-1/8 border border-black border-solid bg-chocolate m-0";
				shaded = false;
			}

			spot.setAttribute("piece", "empty");
			spot.setAttribute("selected", "false");
			board.appendChild(spot);
			spot.addEventListener("click", move);
			
		}

		if(shaded === true){
			shaded = false;
		}

		else{
			shaded = true;
		}

	}

	firstGame = false;
}


function primePiece(currentPiece, x, y){

	selectedPiece = currentPiece;
	selectedX = x;
	selectedY = y;
	let moves = backendBoard.getAvailiableMoves(x, y);
	replaceMoves(moves);
	highlightSquares(possibleMoves);
	return;
}

function highlightSquares(moves){

	let currentSpot = document.querySelector("div[xvalue=" + CSS.escape(selectedX) + "][yvalue=" + CSS.escape(selectedY) + "]");
	currentSpot.setAttribute("selected", "true");

	tailwindHighlight(currentSpot, 'border-green-600');

	for(let i = 0; i < moves.length; i++){
		let x = moves[i].getX();
		let y = moves[i].getY();
		let s = document.querySelector("div[xvalue=" + CSS.escape(x) + "][yvalue=" + CSS.escape(y) + "]");
		if(moves[i].getInCheck()){
			s.setAttribute("selected", "gray");
			tailwindHighlight(s, 'border-gray-500');
		}
		else{
			s.setAttribute("selected", "true");
			tailwindHighlight(s, 'border-green-600');
		} 
	}
}


function unHighlight(){

	if(selectedX < 0 || selectedX > 7 || selectedY < 0 || selectedY > 7){
		return;
	}

	let oldSpot = document.querySelector("div[xvalue=" + CSS.escape(selectedX) + "][yvalue=" + CSS.escape(selectedY) + "]");
	oldSpot.setAttribute("selected", "false");
	tailwindUnhighlight(oldSpot);

	for(let i = 0; i < possibleMoves.length; i++){
		let x = possibleMoves[i].getX();
		let y = possibleMoves[i].getY();
		let s = document.querySelector("div[xvalue=" + CSS.escape(x) + "][yvalue=" + CSS.escape(y) + "]");
		s.setAttribute("selected", "false");
		tailwindUnhighlight(s);	
	}
	possibleMoves.splice(0, possibleMoves.length);
}

function tailwindHighlight(spot, color){

	if(spot.classList.contains('border-black')){
		spot.classList.remove("border-black");
	}
	if(spot.classList.contains('border')){
		spot.classList.remove("border");
	}
	if(spot.classList.contains('border-5') === false){
		spot.classList.add('border-5');
	}
	if(spot.classList.contains(color) === false){
		spot.classList.add(color);
	}

}

function tailwindUnhighlight(spot){

	if(spot.classList.contains('border-green-600')){
		spot.classList.remove("border-green-600");
	}

	if(spot.classList.contains('border-gray-500')){
		spot.classList.remove("border-gray-500");
	}

	if(spot.classList.contains('border-5')){
		spot.classList.remove("border-5");
	}
	if(spot.classList.contains('border-black') === false){
		spot.classList.add('border-black');
	}
	if(spot.classList.contains('border') === false){
		spot.classList.add('border');
	}
	
}

function updateDOMBoardAndSaveMove(moveType, moveSet){

	if(moveType === "regular"){
		let domPiece = removeDOMPiece(moveSet[0], moveSet[1]);
		insertDOMPiece(domPiece, moveSet[2], moveSet[3]);
		gameSaver.addBasicMove(moveSet[0], moveSet[1], moveSet[2], moveSet[3]);
		gameSaver.incrementCount();
		updateSaveGameModalSpans();
	}

	else if(moveType === "enpassant"){
		let domPiece = removeDOMPiece(moveSet[0], moveSet[1]);
		insertDOMPiece(domPiece, moveSet[2], moveSet[3]);
		removeDOMPiece(moveSet[4], moveSet[5]);
		gameSaver.addEnpassantMove(moveSet[0], moveSet[1], moveSet[2], moveSet[3], moveSet[4], moveSet[5]);
		gameSaver.incrementCount();
		updateSaveGameModalSpans();
	}
	else if(moveType === "promotion"){
		removeDOMPiece(moveSet[0], moveSet[1]);
		insertDOMPiece(promoteDOMPiece, moveSet[2], moveSet[3]);
		gameSaver.addPromotionMove(promotePiece.charAt(1), moveSet[0], moveSet[1], moveSet[2], moveSet[3]);
		gameSaver.incrementCount();
		updateSaveGameModalSpans();
	}


}

function removeDOMPiece(x, y){
	//returns the chess piece (DOM) that was on the deleted spot
	let spot = document.querySelector("div[xvalue=" + CSS.escape(x) + "][yvalue=" + CSS.escape(y) + "]");
	let oldPiece = spot.getAttribute("piece");
	spot.setAttribute("piece", "empty");
	return oldPiece;
}

function insertDOMPiece(oldPiece, x, y){
	let spot = document.querySelector("div[xvalue=" + CSS.escape(x) + "][yvalue=" + CSS.escape(y) + "]");
	spot.setAttribute("piece", oldPiece);
}


function highlightCheck(x, y, highlightRed){
	let kingSpot = document.querySelector("div[xvalue=" + CSS.escape(x) + "][yvalue=" + CSS.escape(y) + "]");
	if(highlightRed){
		if(kingSpot.classList.contains('bg-red-600') === false){
			kingSpot.classList.add('bg-red-600');
		}
	}
	else{
		if(kingSpot.classList.contains('bg-red-600')){
			kingSpot.classList.remove('bg-red-600');
		}
	}
}


function resetPlayer(){

	let blackBackRank;
	let blackPawnRank;
	let blackQueenPosition;
	let blackKingPosition;
	let whitePawnRank;
	let whiteBackRank;
	let whiteQueenPosition;
	let whiteKingPosition;

	let whiteBackPiece;
	let blackBackPiece;
	
	if(whichPlayer === 1){
		blackBackRank = 0;
		blackQueenPosition = 3;
		blackKingPosition = 4;
		blackPawnRank = 1;
		whitePawnRank = 6;
		whiteBackRank = 7;
		whiteQueenPosition = 3;
		whiteKingPosition = 4;
	}
	else{
		blackBackRank = 7;
		blackQueenPosition = 4;
		blackKingPosition = 3;
		blackPawnRank = 6;
		whitePawnRank = 1;
		whiteBackRank = 0;
		whiteQueenPosition = 4;
		whiteKingPosition = 3;
	}

	if(getKnights){
		//this turn this player gets 7 knights
		if(whichPlayer === 1){
			whiteBackPiece = "whiteKnight";
			blackBackPiece = "blackQueen";
			promoteDOMPiece = "whiteKnight";
			promotePiece = "wN";
		}
		else{
			blackBackPiece = "blackKnight";
			whiteBackPiece = "whiteQueen";
			promoteDOMPiece = "blackKnight";
			promotePiece = "bN";
		}
	}
	else{
		if(whichPlayer === 1){
			//this turn this player gets queens
			whiteBackPiece = "whiteQueen";
			blackBackPiece = "blackKnight";
			promoteDOMPiece = "whiteQueen";
			promotePiece = "wQ";
		}
		else{
			blackBackPiece = "blackQueen";
			whiteBackPiece = "whiteKnight";
			promoteDOMPiece = "blackQueen";
			promotePiece = "bQ";
		}
	}



	if(blackBackPiece === "blackQueen"){
		removeDOMPiece(blackBackRank, 0);
		insertDOMPiece("blackQueen", blackBackRank, 1);
		removeDOMPiece(blackBackRank, 2);
		insertDOMPiece("blackQueen", blackBackRank, blackQueenPosition);
		removeDOMPiece(blackBackRank, 5);
		insertDOMPiece("blackQueen", blackBackRank, 6);
		removeDOMPiece(blackBackRank, 7);
	}
	else{
		for(let i = 0; i < 8; i++){
			if(blackKingPosition === i){
				continue;
			}
			insertDOMPiece(blackBackPiece, blackBackRank, i);
		}
	}

	insertDOMPiece("blackKing", blackBackRank, blackKingPosition);



	for(let i = 0; i < 8; i++){
		insertDOMPiece("blackPawn", blackPawnRank, i);
	}

	for(let i = 2; i < 6; i++){
		for(let j = 0; j < 8; j++){
			removeDOMPiece(i, j);
		}
	}

	for(let i = 0; i < 8; i++){
		insertDOMPiece("whitePawn", whitePawnRank, i);
	}



	if(whiteBackPiece === "whiteQueen"){
		removeDOMPiece(whiteBackRank, 0);
		insertDOMPiece("whiteQueen", whiteBackRank, 1);
		removeDOMPiece(whiteBackRank, 2);
		insertDOMPiece("whiteQueen", whiteBackRank, whiteQueenPosition);
		removeDOMPiece(whiteBackRank, 5);
		insertDOMPiece("whiteQueen", whiteBackRank, 6);
		removeDOMPiece(whiteBackRank, 7);

	}
	else{

		for(let i = 0; i < 8; i++){
			if(whiteKingPosition === i){
				continue;
			}
			insertDOMPiece(whiteBackPiece, whiteBackRank, i);
		}
	}

	insertDOMPiece("whiteKing", whiteBackRank, whiteKingPosition);


	if(whichPlayer === 1){
		setBoardStateW();
	}
	else{
		setBoardStateB();
	}

}


function setBoardStateW(){

	let whiteBackPiece;
	let blackBackPiece;

	if(getKnights){
		//this turn this player gets 7 knights		
		whiteBackPiece = "wN";
		blackBackPiece = "bQ";
		
	}
	else{	
		//this turn this player gets queens
		whiteBackPiece = "wQ";
		blackBackPiece = "bN";
	
	}

	if(blackBackPiece === "bQ"){
		backendBoard.insertPiece("##", 0, 0);
		backendBoard.insertPiece("bQ", 0, 1);
		backendBoard.insertPiece("##", 0, 2);
		backendBoard.insertPiece("bQ", 0, 3);
		backendBoard.insertPiece("##", 0, 5);
		backendBoard.insertPiece("bQ", 0, 6);
		backendBoard.insertPiece("##", 0, 7);
	}
	else{
		for(let i = 0; i < 8; i++){
			if(i === 4){
				continue;
			}
			backendBoard.insertPiece("bN", 0, i);
		}
	}
	backendBoard.insertPiece("bK", 0, 4);

	for(let j = 0; j < 8; j++){
		backendBoard.insertPiece("bp", 1, j);
	}

	for(let i = 2; i < 6; i++){
		for(let j = 0; j < 8; j++){
			backendBoard.insertPiece("##", i, j);
		}
	}

	for(let j = 0; j < 8; j++){
		backendBoard.insertPiece("wp", 6, j);
	}

	if(whiteBackPiece === "wQ"){
		backendBoard.insertPiece("##", 7, 0);
		backendBoard.insertPiece("wQ", 7, 1);
		backendBoard.insertPiece("##", 7, 2);
		backendBoard.insertPiece("wQ", 7, 3);
		backendBoard.insertPiece("##", 7, 5);
		backendBoard.insertPiece("wQ", 7, 6);
		backendBoard.insertPiece("##", 7, 7);
	}
	else{
		for(let i = 0; i < 8; i++){
			if(i === 4){
				continue;
			}
			backendBoard.insertPiece("wN", 7, i);
		}
	}

	backendBoard.insertPiece("wK", 7, 4);
		
}

function setBoardStateB(){

	if(getKnights){
		//this turn this player gets 7 knights
		blackBackPiece = "bN"
		whiteBackPiece = "wQ";
		
	}
	else{
	
		blackBackPiece = "bQ";
		whiteBackPiece = "wN";
		
	}

	if(whiteBackPiece === "wQ"){
		backendBoard.insertPiece("##", 0, 0);
		backendBoard.insertPiece("wQ", 0, 1);
		backendBoard.insertPiece("##", 0, 2);
		backendBoard.insertPiece("wQ", 0, 4);
		backendBoard.insertPiece("##", 0, 5);
		backendBoard.insertPiece("wQ", 0, 6);
		backendBoard.insertPiece("##", 0, 7);

	}
	else{
		for(let i = 0; i < 8; i++){
			if(i === 3){
				continue;
			}
			backendBoard.insertPiece("wN", 0, i);
		}
	}

	backendBoard.insertPiece("wK", 0, 3);

	for(let i = 0; i < 8; i++){
		backendBoard.insertPiece("wp", 1, i);
	}


	for (let i = 2; i < 6; i++){
		for(let j = 0; j < 8; j++){
			backendBoard.insertPiece("##", i, j);
		}
	}


	for(let i = 0; i < 8; i++){
		backendBoard.insertPiece("bp", 6, i);
	}


	if(blackBackPiece === "bQ"){
		backendBoard.insertPiece("##", 7, 0);
		backendBoard.insertPiece("bQ", 7, 1);
		backendBoard.insertPiece("##", 7, 2);
		backendBoard.insertPiece("bQ", 7, 4);
		backendBoard.insertPiece("##", 7, 5);
		backendBoard.insertPiece("bQ", 7, 6);
		backendBoard.insertPiece("##", 7, 7);
	}
	else{
		for(let i = 0; i < 8; i++){
			if(i === 3){
				continue;
			}
			backendBoard.insertPiece("bN", 7, i);
		}
	}

	backendBoard.insertPiece("bK", 7, 3);

}


function handleIncomingMove(data){
	checkForFiftyMoveRule(data.sendingMoveSet[0], data.sendingMoveSet[1], data.sendingMoveSet[2], data.sendingMoveSet[3]);
	updateBoardWithRecievedMoveset(data);
	checkForCheck();
	checkForInsufficientPieces();
	checkForThreefoldRepetition(data.moveType);
	adjustOppTime(data.oppTimeLeft);
	adjustMyTime(data.myTimeLeft);
	waiting = false;
	handleCountDownClock("myTimer");
}


function updateBoardWithRecievedMoveset(data){

	let moveSet = data.sendingMoveSet;

	if((moveSet[2] === selectedX && moveSet[3] === selectedY) ||
	(data.moveType === "enpassant" && moveSet[4] === selectedX && moveSet[5] === selectedY))
	{
		unHighlight();
		selectedPiece = "empty";
		selectedX = -1;
		selectedY = -1;
	}
		
	if(oppInCheck){
		oppInCheck = false;
		highlightCheck(backendBoard.getOppKing().getX(), backendBoard.getOppKing().getY(), false);
		if(opponentPlayer === "w"){
			printText("White Out Of Check");
		}
		else{
			printText("Black Out Of Check");
		}
	}


	if(data.moveType === "regular"){
		backendBoard.regularMove(moveSet[0], moveSet[1], moveSet[2], moveSet[3]);
		updateDOMBoardAndSaveMove("regular", moveSet);
	}
	else if(data.moveType === "enpassant"){
		backendBoard.enpassantMove(moveSet[0], moveSet[1], moveSet[2], moveSet[3], moveSet[4], moveSet[5]);
		updateDOMBoardAndSaveMove("enpassant", moveSet);
	}
	/*
	else if(data.moveType === "castle"){
		backendBoard.castleMove(moveSet[0], moveSet[1], moveSet[2], moveSet[3], moveSet[0], moveSet[4], moveSet[5]);
		updateDOMBoardAndSaveMove("castle", moveSet);
	}
	*/
	else if(data.moveType === "promotion"){
		backendBoard.pawnPromoteMove(data.promotePiece, moveSet[0], moveSet[1], moveSet[2], moveSet[3]);
		removeDOMPiece(moveSet[0], moveSet[1]);
		insertDOMPiece(data.promoteDOM, moveSet[2], moveSet[3]);
		gameSaver.addPromotionMove(data.promotePiece.charAt(1), moveSet[0], moveSet[1], moveSet[2], moveSet[3]);
		gameSaver.incrementCount();
		updateSaveGameModalSpans();
	}

	if(selectedPiece !== "empty"){
		//need to reset in case the opponent's move
		//obstructed a previous viable option
		unHighlight();
		primePiece(selectedPiece, selectedX, selectedY);
	}

	if(data.drawDenied){
		offeredDraw = false;
		printText("Opponent Declined Draw");
	}

}


function changeRematchBtnText(text){
	rematchBtnText.innerHTML = text;
}


function resetGame(e){
	

	if(disconnected){
		printText("You Are Disconnected From The Room");
		return;
	}

	if(gameInProgress || opponentFound !== true){
		printText("Cannot Rematch At This Time");
		return;
	}

	let resetMove = {
		gameNumber: sendingMove.gameNumber
	};


	if(oppOfferedRematch){
		printText("You Accecpted Rematch Offer");
	}

	else if(oppOfferedRematch === false){
		printText("Rematch Offer Sent");

	}

	socket.emit('serverNewGame', resetMove);

}

function resignation(e){

	if(disconnected){
		printText("You Are Disconnected From The Room");
		return;
	}

	if(gameInProgress !== true || opponentFound !== true){
		printText("Cannot Resign At This Time");
		return;
	}

	let resignMove = {
		gameNumber: sendingMove.gameNumber
	};

	socket.emit('playerResignation', resignMove);
}


function changeDrawBtnText(text){
	drawBtnText.innerHTML = text;
}


function declareDraw(e){
	
	if(disconnected){
		printText("You Are Disconnected From The Room");
		return;
	}

	if(gameInProgress !== true || opponentFound !== true){
		printText("Cannot Draw At This Time");
		return;
	}

	if(offeredDraw){
		return;
	}

	let drawMove = {
		gameNumber: sendingMove.gameNumber
	};

	if(oppOfferedDraw){
		printText("You Accepted Draw Offer");
	}

	else if(oppOfferedDraw === false){
		printText("You Offered Draw");
		offeredDraw = true;
	}

	socket.emit('serverDraw', drawMove);

}

function checkForFiftyMoveRule(oldX, oldY, newX, newY){
	let noProgression = false;

	if(drawCheck.checkFifty(backendBoard.getBoardState(), oldX, oldY, newX, newY)){
		console.log("No Progression Condition Met");
		noProgression = true;
	}

	return noProgression;

}

function checkForInsufficientPieces(){
	if(drawCheck.checkInsufficientPieces(backendBoard.getBoardState())){
		console.log("Insufficent Material Condition Met");
		return true;
	}

	return false;
}

function checkForThreefoldRepetition(moveType){

	if(moveType === "castle"){
		drawCheck.clearOldStates();
	}

	if(drawCheck.checkThreeFoldRepetition(backendBoard.getBoardStateToken())){
		console.log("Threefold Repetition Condition Met");
		return true;
	}

	return false;
}

function sendAdditionalDrawCondition(noProgression, messageSent, moveType){

	if(messageSent){
		return true;
	}

	let setDraw = {
		sendingSet: sendingMove
	};

	if(noProgression && messageSent === false){
		
		setDraw.drawType = 2;
		console.log("This is the side that reports");
		socket.emit('serverAdditionalDraw', setDraw);
		return true;
	}


	if(messageSent === false && noProgression === false){

		if(checkForInsufficientPieces()){
			
			setDraw.drawType =  1,
			console.log("This is the side that reports");
			socket.emit('serverAdditionalDraw', setDraw);
			return true;
		}

		if(checkForThreefoldRepetition(moveType)){
			
			setDraw.drawType = 4;
			console.log("This is the side that reports");
			socket.emit('serverAdditionalDraw', setDraw);
			return true;
		}

	}

	return false;
}


//timer functions

function resetMyTimerRed(){
	myTimerRed = false;
	if(myTimerContainer.classList.contains("bg-red-600")){
		myTimerContainer.classList.remove("bg-red-600");
		myTimerContainer.classList.add("bg-blue-400");
	}
}

function resetOppTimerRed(){
	oppTimerRed = false;
	if(oppTimerContainer.classList.contains("bg-red-600")){
		oppTimerContainer.classList.remove("bg-red-600");
		oppTimerContainer.classList.add("bg-blue-400");
	}
}


function turnTimerRed(whichTimer){

	if(whichTimer === "myTimer"){
		if(myTimerRed === false && ((myMinutes < 0) || (myMinutes === 0 && mySeconds < 10))){
			myTimerRed = true;
			if(myTimerContainer.classList.contains("bg-blue-400")){
				myTimerContainer.classList.remove("bg-blue-400");
				myTimerContainer.classList.add("bg-red-600");
			}
		}
		else if(myTimerRed && ( (myMinutes > 0) || (myMinutes === 0 && mySeconds >= 10))){
			console.log("Reset of timer red called for my timer");
			resetMyTimerRed();
		}
	}


	else if(whichTimer === "oppTimer"){
		if(oppTimerRed === false && ((oppMinutes < 0) || (oppMinutes === 0 && oppSeconds < 10))){
			oppTimerRed = true;
			if(oppTimerContainer.classList.contains("bg-blue-400")){
				oppTimerContainer.classList.remove("bg-blue-400");
				oppTimerContainer.classList.add("bg-red-600");
			}
		}
		else if(oppTimerRed && ( (oppMinutes > 0) || (oppMinutes === 0 && oppSeconds >= 10))){
			console.log("Reset of timer red called for opponent timer.");
			console.log(oppMinutes);
			console.log(oppSeconds);
			resetOppTimerRed();
		}
	}
}


function handleCountDownClock(whichTimer){

	if(firstGameComplete === false && messagesExchanged < 1){
			messagesExchanged++;
			return;
	}

	if(firstTimerTurnOn === false){
		printText("Initial Moves Made: Timers Starting");
		firstTimerTurnOn = true;
	}

	if(whichTimer === "myTimer"){
		countDownMyClock();
	}

	else if(whichTimer === "oppTimer"){
		countDownOppClock();
	}

}

function countDownOppClock(){

	if(myCountDown !== null){
		clearInterval(myCountDown);
		myCountDown = null;
		myTimer.innerHTML = getTimerFormat(myMinutes, mySeconds);
		turnTimerRed("myTimer");
	}

	if(oppCountDown !== null){
		clearInterval(oppCountDown);
		oppCountDown = null;
	}

	oppCountDown = window.setInterval(writeOppTime, 1000);

}

function countDownMyClock(){

	if(oppCountDown !== null){
		clearInterval(oppCountDown);
		oppCountDown = null;
		oppTimer.innerHTML = getTimerFormat(oppMinutes, oppSeconds);
		turnTimerRed("oppTimer");
	}

	if(myCountDown !== null){
		clearInterval(myCountDown);
		myCountDown = null;
	}
	
	myCountDown = window.setInterval(writeMyTime, 1000);


}

function writeMyTime(){

	if(mySeconds === 0 && myMinutes >= 0){
		mySeconds = 59;
		myMinutes--;
	}
	else{
		mySeconds--;
	}

	turnTimerRed("myTimer");

	if(myMinutes < 0){

		clearInterval(myCountDown);
		myCountDown = null;
		myTimer.innerHTML = '00:00';
		return;
	}
	
	myTimer.innerHTML = getTimerFormat(myMinutes, mySeconds);
}


function convertSecondsToTimer(seconds){
	let clock = {
		minutes: 0,
		seconds: 0
	};

	if(seconds <= 0){
		return clock;
	}

	let min = Math.floor(seconds/60)
	let sec = (seconds - (min * 60))

	/*
	if(seconds === 0){
		min = 0;
		sec = 0;
	}
	*/

	clock.minutes = min;
	clock.seconds = sec;
	
	return clock;
}


function adjustMyTime(seconds){
	console.log("Incoming my seconds: " + seconds);
	let clock = convertSecondsToTimer(seconds - 1);
	myMinutes = clock.minutes;
	mySeconds = clock.seconds;
	myTimer.innerHTML = getTimerFormat(myMinutes, mySeconds);
	turnTimerRed("myTimer");
}


function adjustOppTime(seconds){

	console.log("Incoming opp seconds: " + seconds);
	let clock = convertSecondsToTimer(seconds - 1);
	oppMinutes = clock.minutes;
	oppSeconds = clock.seconds;
	oppTimer.innerHTML = getTimerFormat(oppMinutes, oppSeconds);
	turnTimerRed("oppTimer");
}


function writeOppTime(){

	if(oppSeconds === 0 && oppMinutes >= 0){
		oppSeconds = 59;
		oppMinutes--;
	}
	else{
		oppSeconds--;
	}

	turnTimerRed("oppTimer");

	if(oppMinutes < 0){
		clearInterval(oppCountDown);
		oppCountDown = null;
		oppTimer.innerHTML = '00:00';
		return;
	}

	oppTimer.innerHTML = getTimerFormat(oppMinutes, oppSeconds);
}

function stopFrontTimer(){
	if(oppCountDown !== null){
		clearInterval(oppCountDown);
		oppCountDown = null;
	}

	if(myCountDown !== null){
		clearInterval(myCountDown);
		myCountDown = null;
	}
}


function getTimerFormat(minutes, seconds){

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


function adjustElo(){
	getElo(username, 1);
	getElo(opponentUsername, 2);
}


async function getElo(user, player){

	if(user === null){
		console.log("Invalid Username in getElo");
		return;
	}

	let dataToSend = {
		userName: user,
		tableName: "cotlbstats"
	};

	let fetchResult;
	

	await fetch('/home/getEloScore', 
	
		{
			method: 'POST',
			headers:{
				'Content-Type': 'application/json'
			},

			body: JSON.stringify(dataToSend)
		}).then((res) => {
			if(res.ok === false){
				console.log("About to throw error");
				fetchResult = {error: true};
				throw Error(res.statusText);
			}
			return res.json();
		})
	.then((data) => {
		console.log(data.msg);
		fetchResult = data.msg;
	})
	.catch(function(error){
		console.log('Request failed doing stuff', error);
	});

	if(fetchResult.error){
		console.log("Ran into error");
		return;
	}

	if(fetchResult.result === undefined || fetchResult.result === null){
		console.log("Ran into error");
		return;
	}

	if(player === 1){
		myElo.innerHTML = 'Rating: ' + fetchResult.result;
	}

	else if(player === 2){
		oppElo.innerHTML = 'Rating: ' + fetchResult.result;
	}

	console.log("After fetch");
	

}


function clearText(){
	while(gameStateInfo.firstChild){
		gameStateInfo.removeChild(gameStateInfo.lastChild);
	}
}

function printText(text){

	let div = document.createElement('div');
	let textNode = document.createTextNode(text);
	div.classList = "flex flex-col justify-center pl-3 bg-emerald-100 border-2 border-white h-14 w-full shrink-0";
	div.appendChild(textNode);
	gameStateInfo.appendChild(div);
	gameStateInfo.scrollTop = gameStateInfo.scrollHeight;
}



//save game modal

cancelSaveBtn.onclick = function(){
	tailwindCloseSaveGameModal();
}

closeSaveBtn.onclick = function(){
	tailwindCloseSaveGameModal();
}

viewGamesBtn.onclick = function(){
	tailwindCloseSaveGameModal();
	clearModalList();
	removeViewModalWarning();
	fetchAllSavedGameIDs();
	if(displayGamesModal.classList.contains('hidden')){
		displayGamesModal.classList.remove('hidden');
		
	}
	
}

function tailwindCloseSaveGameModal(){

	if(saveGameModal.classList.contains('hidden') === false){
		saveGameModal.classList.add('hidden');
	}
}

function saveGame(e){

	openSaveGameModal();
}


function updateSaveGameModalSpans(){

	console.log("Inside of update spans 1");

	if(saveGameModal.classList.contains('hidden') === false){
		console.log("Passed update spans tests 2");
		let dateObject = new Date();
		let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		dateString = months[dateObject.getMonth()] + " " + dateObject.getDate() + ", " + dateObject.getFullYear();
		appendSpan("#saveModal-resultText", gameResult);
		appendSpan("#saveModal-moveNumText", gameSaver.getCount());
		appendSpan("#saveModal-dateText", dateString);
	}
}

function openSaveGameModal(){

	let dateObject = new Date();
	let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	dateString = months[dateObject.getMonth()] + " " + dateObject.getDate() + ", " + dateObject.getFullYear();


	appendSpan("#saveModal-resultText", gameResult);
	appendSpan("#saveModal-moveNumText", gameSaver.getCount());
	appendSpan("#saveModal-dateText", dateString);
	
	
	badSaveWarning.innerHTML = "";

	if(saveGameModal.classList.contains('hidden')){
		saveGameModal.classList.remove('hidden');
	}


}


function appendSpan(domElementName, spanString){

	let domElement = document.querySelector(domElementName);
	let resultSpan = document.createElement("span");
	resultSpan.classList = "text-blue-700 font-bold";
	let num = domElement.childElementCount;

	while(num > 0){
		domElement.removeChild(domElement.lastChild);
		num--;
	}
 
	//resultSpan.innerHTML = spanString;
	resultSpan.append(document.createTextNode(spanString));
	domElement.appendChild(resultSpan);

}


finishSaveBtn.onclick = function(){



	if(saveGameNameInput.value.length === 0){
		saveModalWarningRed();
		badSaveWarning.innerHTML = "Error: Must Enter A Name";
		return;

	}

	if(saveGameNameInput.value.length > 40){
		saveModalWarningRed();
		badSaveWarning.innerHTML = "Error: Name Can Have Max 40 Characters";
		return;
	}

	if(gameSaver.getMoves().length === 0){
		saveModalWarningRed();
		badSaveWarning.innerHTML = "Error: Cannot Save A Game With No Moves Recorded";
		return;
	}

	if(gameSaver.getCount() > 200){
		saveModalWarningRed();
		badSaveWarning.innerHTML = "Cannot Save A Game With Over 200 Moves";
		return;
	}


	sendGameData(saveGameNameInput.value);
	saveGameNameInput.value = '';
	console.log("Completely Finished Saving Game");
}




async function sendGameData(nameOfGame){

	let movesMade = gameSaver.getMoves();

	let dataToSend = {
		playerName: username,
		playerPassword: password,
		oppName: opponentUsername,
		side: gameSaver.getPlayer() + promotePiece.charAt(1),
		gameMoves: movesMade,
		name: nameOfGame,
		count: gameSaver.getCount(),
		gameMode: "cotlb",
		result: gameResult,
		date: dateString
	};

	let fetchResult;
	

	await fetch('/home/saveGame', 
	
		{
			method: 'POST',
			headers:{
				//'Content-Type': 'text/html; charset=UTF-8'
				'Content-Type': 'application/json'
			},

			//body: JSON.stringify(m)//this works
			body: JSON.stringify(dataToSend)
		}
	).then((res) => {
		if(res.ok === false){
			console.log("About to throw error");
			fetchResult = {error: true, type: 10};
			throw Error(res.statusText);
		}
		return res.json();
	})//this works) /*res.text()*/
	.then((data) => {
		console.log(data.msg);
		fetchResult = data.msg;
	})
	.catch(function(error){
		console.log('Request failed doing stuff', error);
		return;
	});

	if(fetchResult.error === false){
		console.log("Game Successfully Saved");
		saveModalWarningGreen();
		badSaveWarning.innerHTML = "Game Successfully Saved";
		printText("Game Successfully Saved");
		return;
	}
	
	if(fetchResult.error){
		saveModalWarningRed();

		if(fetchResult.type === -1){
			badSaveWarning.innerHTML = "Error Accessing Database";
		}
		else if(fetchResult.type === 0){
			badSaveWarning.innerHTML = "Game Not Saved: No Username Sent";
		}
		else if(fetchResult.type === 1){
			badSaveWarning.innerHTML = "Game Not Saved: Password For Username Incorrect";
		}
		else if(fetchResult.type === 2){
			badSaveWarning.innerHTML = "Game Not Saved: Game Must Be Given A Name";
		}
		else if(fetchResult.type === 3){
			badSaveWarning.innerHTML = "Game Not Saved: Limit is 40 Characters For Game Name";
		}
		else if(fetchResult.type === 4){
			badSaveWarning.innerHTML = "Game Not Saved: No Moves Recorded";
		}
		else if(fetchResult.type === 5){
			badSaveWarning.innerHTML = "Game Not Saved: Too Many Moves In Game";
		}
		else if(fetchResult.type === 6){
			badSaveWarning.innerHTML = "Game Not Saved: Game Type Not Found";
		}
		else if(fetchResult.type === 7){
			badSaveWarning.innerHTML = "Game Not Saved: Can't Find The Side Player Is On";
		}
		else if(fetchResult.type === 8){
			badSaveWarning.innerHTML = "Game Not Saved: Bad Move Count Recorded";
		}
		else if(fetchResult.type === 9){
			badSaveWarning.innerHTML = "Game Not Saved: You've Reached The Limit Of Saved Games";
		}
		else if(fetchResult.type === 10){
			badSaveWarning.innerHTML = "Game Not Saved: Request Not Processed, Try Again Later";
		}
		return;
	}
			
}

function saveModalWarningGreen(){

	if(badSaveWarning.classList.contains('text-red-600')){
		badSaveWarning.classList.remove('text-red-600');
		badSaveWarning.classList.add('text-green-600');
	}
}

function saveModalWarningRed(){
	if(badSaveWarning.classList.contains('text-green-600')){
		badSaveWarning.classList.remove('text-green-600');
		badSaveWarning.classList.add('text-red-600');
	}
}


//display/delete modal box

function removeViewModalWarning(){
	viewWarningText.innerHTML = "";
}

closeViewX.onclick = function(){
	closeDisplayGamesModal();
	clearModalList();
}

closeViewBtn.onclick = function(){
	closeDisplayGamesModal();
	clearModalList();
}

function closeDisplayGamesModal(){
	if(displayGamesModal.classList.contains('hidden') === false){
		displayGamesModal.classList.add('hidden');
	}
}

deleteBtn.onclick = function(){
	removeViewModalWarning();
	handleGameDelete();
}

function clearModalList(){

	while(displayVerticalMenu.firstChild){
		displayVerticalMenu.removeChild(displayVerticalMenu.lastChild);
	}
}

async function handleGameDelete(){

	if(displayedGameID === -1){
		console.log("No deletion");
		return;
	}

	let deleteResult = await fetchDeleteGame(displayedGameID);

	if(deleteResult.error === true && (deleteResult.type === 0 ||  deleteResult.type === 1 || deleteResult.type === 2 || deleteResult.type === 4)){
		return;
	}

	let deletedGame = document.querySelector("div[gameIdentity=" + CSS.escape(displayedGameID) + "]");
	deletedGame.remove();
	displayedGameID = -1;

	appendSpan("#viewModal-gameModeText", "");
	appendSpan("#viewModal-countText", "");
	appendSpan("#viewModal-resultText", "");
	appendSpan("#viewModal-opponentText", "");
	appendSpan("#viewModal-dateText", "");

	if(displayVerticalMenu.childElementCount === 0){
		addViewGamesListElement("(Empty)", 'empty');
	}
}


function addBreakLineInName(domElement, name, endIndex){


	let textNode = null;

	if(name.length <= endIndex || endIndex < 1){
		textNode = document.createTextNode(name);
		domElement.append(textNode);
		return null;
	}

	let breakline = document.createElement("br");
	let start = name.substring(0, endIndex);
	let adjustedLeftover = name.substring(endIndex);

	if(name.charAt(endIndex - 1) !== '-'){
		textNode = document.createTextNode(start + '-');
	}
	else{
		textNode = document.createTextNode(start);
	}

	domElement.append(textNode);
	domElement.append(breakline);

	return adjustedLeftover;
	
}


function reformatLongGameName(domElement, name){


	let firstLeftover = null;
	let secondLeftover = null;

	firstLeftover = addBreakLineInName(domElement, name, 14);

	if(name.length <= 14){
		return;
	}

	secondLeftover = addBreakLineInName(domElement, firstLeftover, 14);

	if(secondLeftover === null){
		return;
	}

	addBreakLineInName(domElement, secondLeftover, 14);
	
	
}


function addViewGamesListElement(name, id){

	let element = document.createElement("div");
	
	reformatLongGameName(element, name);
	element.setAttribute("gameIdentity", id);
	element.addEventListener("click", toggleIDSelection);
	element.classList = "flex flex-col flex-wrap justify-center bg-gray-300 hover:bg-gray-400 border-x border-b whitespace-nowrap overflow-x-auto border-gray-500 w-full shrink-0 text-center text-black hover:cursor-pointer";
	element.setAttribute("elementType", "displayVerticalMenuElement");

	if(name.length > 14 && name.length < 29){
		element.classList.add("h-14");
	}
	else if(name.length >= 29){
		element.classList.add("h-19");
	}
	else{
		element.classList.add("h-10");
	}

	displayVerticalMenu.appendChild(element);

}


async function fetchAllSavedGameIDs( ){

	let dataToSend = {
		user: username,
		mode: 'all',
		playerPassword: password
	};

	let fetchResult;
	
	await fetch('/home/getAllSavedGameIDs', 
		{
			method: 'POST',
			headers:{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(dataToSend)
		}
	).then((res) => {
		if(res.ok === false){
			console.log("About to throw error");
			fetchResult = {error: true};
			throw Error(res.statusText);
		}
		return res.json();
	})
	.then((data) => {
		fetchResult = data.msg;
	})
	.catch(function(error){
		console.log('Request failed doing stuff', error);
		return;
	});

	if(fetchResult.error){
		//console.log("Error Fetching Game IDs");
		viewWarningText.innerHTML = "Unable To Fetch Saved Games";
	}

	if(fetchResult.error || fetchResult.rows.length === 0){
		displayedGameID = -1;
		addViewGamesListElement("(Empty)", 'empty');
	}

	else{
		let i = 0;
		let end = fetchResult.rows.length;
		console.log("Number of Games: " + end);
		let firstIDFound = -1;
		displayedGameID = -1;

		

		while(i < end){

			addViewGamesListElement(fetchResult.rows[i].name, fetchResult.rows[i].id);
			if(i === 0){
				firstIDFound = fetchResult.rows[i].id;
				displayedGameID = fetchResult.rows[i].id;
				let firstInList = document.querySelector("div[gameIdentity=" + CSS.escape(displayedGameID) + "]");
				tailwindHighlightSavedGame(firstInList);
			}

			i++;
		}

		if(i > 0 && firstIDFound !== -1){
			displaySingleGameData(firstIDFound);
		}

		
	}

}

async function displaySingleGameData(gameID){

	let data = await fetchGameDataUsingID(gameID);

	if(data.error){
		if(data.type === 0){
			//console.log("Game Data Not Returned: Bad Username");
			viewWarningText.innerHTML = "Game Data Not Returned: Username Not Found";
		}
		else if(data.type === 1){
			//console.log("Game Data Not Returned: Bad Password");
			viewWarningText.innerHTML = "Game Data Not Returned: Incorrect Password";
		}
		else if(data.type === 2){
			//console.log("Game Data Not Returned: Bad ID");
			viewWarningText.innerHTML = "Game Data Not Returned: Game ID Incorrectly Formatted";
		}
		else if(data.type === 3){

			//console.log("Game Data Not Returned: Game Not Found");
			viewWarningText.innerHTML = "Game Data Not Returned: Game Not Found";
			/*
			appendSpan("#viewModal-gameModeText", "");
			appendSpan("#viewModal-countText", "");
			appendSpan("#viewModal-resultText", "");
			appendSpan("#viewModal-opponentText", "");
			appendSpan("#viewModal-dateText", "");
			*/
		}
		else if(data.type === 4){
			//console.log("Request Not Processed, Try Again Later");
			viewWarningText.innerHTML = "Request Not Processed, Try Again Later";
		}

		appendSpan("#viewModal-gameModeText", "");
		appendSpan("#viewModal-countText", "");
		appendSpan("#viewModal-resultText", "");
		appendSpan("#viewModal-opponentText", "");
		appendSpan("#viewModal-dateText", "");
		return;
	}

	appendSpan("#viewModal-gameModeText", data.result.gameMode);
	appendSpan("#viewModal-countText", data.result.count);
	appendSpan("#viewModal-resultText", data.result.result);
	appendSpan("#viewModal-opponentText", data.result.opponent);
	appendSpan("#viewModal-dateText", data.result.date);

}

async function fetchGameDataUsingID(id){


	let dataToSend = {
		user: username,
		identity: id,
		playerPassword: password
	};

	let fetchResult;
	

	await fetch('/home/getSavedGameAttributes', 
		{
			method: 'POST',
			headers:{
				'Content-Type': 'application/json'
			},

			//body: JSON.stringify(m)//this works
			body: JSON.stringify(dataToSend)
		}
	).then((res) => {
			if(res.ok === false){
				console.log("About to throw error");
				fetchResult = {error: true, type: 4};
				throw Error(res.statusText);
			}
			return res.json();
		
	})//this works) /*res.text()*/
	.then((data) => {
		fetchResult = data.msg;
	})
	.catch(function(error){
		console.log('Request failed doing stuff', error);
		return;
	});

	return fetchResult;
}


async function fetchDeleteGame(id){


	let dataToSend = {
		user: username,
		identity: id,
		playerPassword: password
	};

	let fetchResult;
	
	await fetch('/home/deleteSavedGame', 
		{
			method: 'POST',
			headers:{
				'Content-Type': 'application/json'
			},

			body: JSON.stringify(dataToSend)
		}
	).then((res) => {
		if(res.ok === false){
			console.log("About to throw error");
			fetchResult = {error: true, type: 4};
			throw Error(res.statusText);
		}	
		return res.json();		

	})
	.then((data) => {
		fetchResult = data.msg;
	})
	.catch(function(error){
		console.log('Request failed doing stuff', error);
		return;
	});

	if(fetchResult.error){

		if(fetchResult.type === 0){
			//console.log("Bad username");
			viewWarningText.innerHTML = "Unable To Delete: Username Not Found";
		}
		else if(fetchResult.type === 1){
			//console.log("Bad Password");
			viewWarningText.innerHTML = "Unable To Delete: Incorrect Password";
		}
		else if(fetchResult.type === 2){
			//console.log("Bad ID");
			viewWarningText.innerHTML = "Unable To Delete: Game ID Incorrectly Formatted";
		}
		else if(fetchResult.type === 3){
			//console.log("Delete Entry Not Found");
			viewWarningText.innerHTML = "Delete Entry Not Found";
		}
		else if(fetchResult.type === 4){
			//console.log("Request Not Processed, Try Again Later");
			viewWarningText.innerHTML = "Request Not Processed, Try Again Later";
		}
	}

	if(fetchResult.error === false){
		console.log("Delete Successful");
	}

	return fetchResult;
}



function toggleIDSelection(e){

	removeViewModalWarning();

	let id = -1;

	if(e.target.getAttribute("gameIdentity") === "empty"){
		return;
	}

	if(parseInt(e.target.getAttribute("gameIdentity")) === displayedGameID){
		return;
	}

	if(displayedGameID !== -1){
		let oldID = document.querySelector("div[gameIdentity=" + CSS.escape(displayedGameID) + "]");
		tailwindUnhighlightSavedGame(oldID);
	}

	tailwindHighlightSavedGame(e.target);
	displayedGameID = parseInt(e.target.getAttribute("gameIdentity"));
	id = parseInt(e.target.getAttribute("gameIdentity"))
	displaySingleGameData(id);

}

function tailwindHighlightSavedGame(element){

	if(element.classList.contains('bg-gray-300')){
		element.classList.remove('bg-gray-300');
		element.classList.add('bg-green-400');
	}

	if(element.classList.contains('hover:bg-gray-400')){
		element.classList.remove('hover:bg-gray-400');
	}
}

function tailwindUnhighlightSavedGame(element){

	if(element.classList.contains('bg-green-400')){
		element.classList.remove('bg-green-400');
		element.classList.add('bg-gray-300');
	}

	if(element.classList.contains('hover:bg-gray-400') === false){
		element.classList.add('hover:bg-gray-400');
	}
}
