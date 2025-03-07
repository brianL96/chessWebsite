console.log("Replay Page");


let myUsername = sessionStorage.getItem("username");
let myPassword = sessionStorage.getItem("password");
//let myPassword = "77";

//let verticalMenu = document.querySelector(".vertical-menu");
//let listHeaderText = document.querySelector(".listHeaderText");
//let previousGameMode = document.getElementById("previous-gameMode");
//let nextGameMode = document.getElementById("next-gameMode");

let showGamesBtn = document.getElementById("showGames-btn");
let gameName = document.getElementById("gameName");
let opponentName = document.getElementById("opponentName");

let turnLabel = document.getElementById("turn-label");
let checkWarning = document.getElementById("check-warning");
let editedLabel = document.getElementById("edited-label");

let count = 0;
let originalMoveCount = 0;
let total = 0;

let currentMoveCount = document.getElementById("move-counter-current");
let totalMoveCount = document.getElementById("move-counter-total");


let opponentUsername = null;

let gameSaver;
let additionalDrawChecker;
let movesPassed = [];
let nextEditedMoves = [];
let backendBoard;

let savedGameFound = false;

//let selectedGameID = -1;

let undoEdits = document.querySelector("#undoEdits-btn");
let undoEditsText = document.querySelector("#undoEditsText");
let saveEdits = document.querySelector("#saveEdits-btn");

//undoEdits.addEventListener("click", addToList);

showGamesBtn.addEventListener("click", openLoadGameModal)
undoEdits.addEventListener("click", undoAllEdits);
saveEdits.addEventListener("click", openSaveGameModal);


//let index = 0;

//let gameModeArray = ["classic", "koth", "cotlb", "speed"];
//let gameModeArrayIndex = 0;


//previousGameMode.addEventListener("click", goToDifferentMode);
//nextGameMode.addEventListener("click", goToDifferentMode);

let selectedPiece = "empty";
let selectedX = -1;
let selectedY = -1;
let possibleMoves = [];
let currentSideMakingMove = null;

let editedGame = false;
let inCheckmate = false;
let inStalemate = false;
let inAdditionalDraw = false;

let currentSide = "w";


let checkX = -1;
let checkY = -1;
let checkSide = null;

let preservedGame = {
	savedMoves: [],
	savedSide: null
};

let cotlbGame = false;
let kothGame = false;
let hillWin = false;

let promotionModal = document.querySelector("#promotion-modal");
let promotionSelectBtn = document.querySelector('#promotion-select-btn');

let showcaseQueen = document.querySelector("#showcaseQueen");
let showcaseKnight = document.querySelector("#showcaseKnight");
let showcaseRook = document.querySelector("#showcaseRook");
let showcaseBishop = document.querySelector("#showcaseBishop");

let savedPromotionMove = null;

showcaseQueen.addEventListener("click", queenPromote);
showcaseKnight.addEventListener("click", knightPromote);
showcaseRook.addEventListener("click", rookPromote);
showcaseBishop.addEventListener("click", bishopPromote)

let saveGameModal = document.querySelector("#saveGameModal");
let saveGameNameInput = document.querySelector("#toSaveGameName");
let finishSaveBtn = document.querySelector("#finishSave-btn");
let cancelSaveBtn = document.querySelector("#save-cancel-btn");
let closeSaveBtn = document.querySelector("#saveGameModal-close");
let badSaveWarning = document.querySelector("#saveModal-warning");
let viewGamesBtn = document.querySelector("#view-btn");


let closeViewBtn = document.querySelector("#vd-viewGamesModal-close");
let deleteBtn = document.querySelector("#delete-btn");
let displayGamesModal = document.querySelector("#view-games-modal");
let displayVerticalMenu = document.querySelector("#vd-game-info-vertical-menu");
let loadLabel = document.querySelector("#viewModal-loadText");
let loadGameBtn = document.querySelector("#load-btn");
loadGameBtn.addEventListener("click", beginGameLoad);
let viewModalSelectGameModeBtn = document.querySelector('#vd-select-game-mode');
viewModalSelectGameModeBtn.addEventListener('click', activateVerticalDropdown);
let verticalDropdown = document.querySelector('#vertical-dropdown');
let viewFetchedHeaderText = document.querySelector("#sort-header-text");
let viewWarningText = document.querySelector("#view-modal-warning");
let listOfFetchedGames = new Array();


let selectedSortOptionIndex = 'all';

let showAllOption = document.querySelector('#v-drop-all');
showAllOption.addEventListener('click', toggleSortingOptionSelection);
let showClassicOption = document.querySelector('#v-drop-classic');
showClassicOption.addEventListener('click', toggleSortingOptionSelection);
let showKOTHOption = document.querySelector('#v-drop-koth');
showKOTHOption.addEventListener('click', toggleSortingOptionSelection);
let showCOTLBOption = document.querySelector('#v-drop-cotlb');
showCOTLBOption.addEventListener('click', toggleSortingOptionSelection);
let showSpeedOption = document.querySelector('#v-drop-speed');
showSpeedOption.addEventListener('click', toggleSortingOptionSelection);



let gameResult = null;
let originalResult;

let displayedGameID = -1;
//let backupDisplayedID = -1;

let currentGameModeLoaded = null;
let currentGameLoadedID = -1;
//let backupLoadedID = -1;



//Set up foward and backward buttons
let nextMoveBtn = document.querySelector('#nextMove-btn');
nextMoveBtn.addEventListener("click", nextMove);
let lastMoveBtn = document.querySelector('#prevMove-btn');
lastMoveBtn.addEventListener("click", lastMove);

//let sortOptionHeader = document.querySelector(".game-info-header");
//sortOptionHeader.addEventListener("click", drop);

let dropDownDisplayed = false;
let firstLoad = true;
let dateString = null;
let originalDate;

let fixedHeader = document.querySelector("#fixed-header");
let fixedHeaderMenu = document.querySelector("#fixed-header-menu");

if(myUsername !== null){
	createSignedInHeader(myUsername);
	//fetchSavedGameIDs("classic");
}
else{
	createNotSignedInHeader();
}

createBoard();
//populateSortingOptionList();
fetchSavedGamesIDsIntoList();


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

	//fixedHeader.appendChild(loginBtn);
	//fixedHeader.appendChild(signupBtn);
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
	helloMessage.className = "flex flex-row flex-nowrap text-lg header-sm:text-md"
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

/*
function createNotSignedInHeader(){
	let loginBtn = document.createElement("input");
	let signupBtn = document.createElement("input");

	loginBtn.id = "header-login-btn";
	loginBtn.type = "submit";
	loginBtn.value = "Log In";
	loginBtn.className = "w-32 bg-green-600 text-white rounded cursor-pointer shadow hover:bg-green-500";

	signupBtn.id = "header-signup-btn";
	signupBtn.type = "submit";
	signupBtn.value = "Sign Up";
	signupBtn.className = "w-32 bg-green-600 text-white rounded cursor-pointer shadow hover:bg-green-500";

	loginBtn.addEventListener("click", goToLogin);
	signupBtn.addEventListener("click", goToSignUp);

	fixedHeader.appendChild(loginBtn);
	fixedHeader.appendChild(signupBtn);
}

function createSignedInHeader(user){
	let helloMessage = document.createElement("h2");

	let signoutBtn = document.createElement("input");

	helloMessage.id = "header-hello";
	helloMessage.innerHTML = "Hello " + user;

	signoutBtn.id  = "header-signout-btn";
	signoutBtn.type = "submit";
	signoutBtn.value = "Sign Out";
	signoutBtn.className = "w-32 bg-green-600 text-white rounded cursor-pointer shadow hover:bg-green-500";


	signoutBtn.addEventListener("click", signOut);

	fixedHeader.appendChild(helloMessage);
	fixedHeader.appendChild(signoutBtn);

}
*/



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


function checkKOTH(){

	if(kothGame){
		if(backendBoard.kingOfTheHill(currentSide)){

			hillWin = true;
			gameResult = "Hill Win";
			//console.log("Hill Win For: " + currentSide);
			if(currentSide === 'w'){
				checkWarning.innerHTML = "White Has Hill Win";

			}
			else if(currentSide === 'b'){
				checkWarning.innerHTML = "Black Has Hill Win";
			}
			turnLabel.innerHTML = "";
		}
		else{
			hillWin = false;
		}
	}
}

function switchSides(){
	if(currentSide === "w"){
		currentSide = "b";
		if(inCheckmate !== true && hillWin !== true && inStalemate !== true && inAdditionalDraw !== true){
			turnLabel.innerHTML = "Black's Move";
		}
	}
	else{
		currentSide = "w";
		if(inCheckmate !== true && hillWin !== true && inStalemate !== true && inAdditionalDraw !== true){
			turnLabel.innerHTML = "White's Move";
		}
	} 
}



function resetEditFields(){
	if(selectedX === -1 || selectedY === -1){
		return;
	}
	selectedPiece = "empty";
	currentSideMakingMove = null;
	unHighlight();
	selectedX = -1;
	selectedY = -1;
}

function move(e){

	console.log("Inside Move Method");

	let xVal = parseInt(e.target.getAttribute("xvalue"));
	let yVal = parseInt(e.target.getAttribute("yvalue"));

	
	let currentPiece = e.target.getAttribute("piece");

	if(inCheckmate || inStalemate || hillWin || inAdditionalDraw){
		return;
	}

	if(currentPiece === "empty" && selectedPiece === "empty" || (xVal === selectedX && yVal === selectedY)){
		return;

	}

	//selecting first piece
	if(selectedPiece === "empty"){

		currentSideMakingMove = backendBoard.getPiece(xVal, yVal).charAt(0);
		if(currentSide !== currentSideMakingMove){
			return;
		}

		primePiece(currentPiece, xVal, yVal);
		//switchSides();
		return; 
	}

	else{

		//here the user is selecting another one of their pieces
		if(backendBoard.getPiece(xVal, yVal).charAt(0) === currentSideMakingMove){
			unHighlight();
			primePiece(currentPiece, xVal, yVal);
			return;
		}

		//click on a spot that is not a valid move
		if(validateMove(xVal, yVal) !== true){
			return;
		}

		if(editedGame !== true){
		//only preserve game if first manual move
			preserveGame();
			additionalDrawChecker.copyReplayNodes();
		}

		additionalDrawChecker.insertReplayNode(true);
		additionalDrawChecker.replayCheckFifty(true, backendBoard.getBoardState(), selectedX, selectedY, xVal, yVal);

		let move = backendBoard.updateBoardState(selectedX, selectedY, xVal, yVal);
		
		if(move.getMoveType() === "promotion"){

			if(cotlbGame){
				//need to see whether it is my move or opp move to get right promotion piece
				let promotion;
				if(currentSide === gameSaver.getPlayer().charAt(0)){
					promotion = gameSaver.getPlayer().charAt(1);
				}
				else{
					if(gameSaver.getPlayer().charAt(1) === "Q"){
						promotion = "N";
					}
					else{
						promotion = "Q";
					}
				}

				move.addPromotionPiece(promotion);
				let moveSet = move.getMoves();
				backendBoard.pawnPromoteMove(currentSide + moveSet[0], moveSet[1], moveSet[2], moveSet[3], moveSet[4]);	
				//backendBoard.printBoardState();		
			}
			else{
				savedPromotionMove = move;
				setupAndDisplayShowcase();
				return;
			}
		}

	
		finishMove(move);


	}
}

function finishMove(move){
	processNextMove(move);

	//clicked on a valid move, so everything is reset		
	selectedPiece = "empty";
	unHighlight();
	selectedX = -1;
	selectedY = -1;
	currentSideMakingMove = null;
	editedGame = true;

	editedLabel.innerHTML = "EDITED GAME";

	if(nextEditedMoves.length > 0){
		nextEditedMoves.splice(0, nextEditedMoves.length);
	}

	resetCheckStatus();
	setCheckStatus();
	if(kothGame){
		checkKOTH();
	}

	additionalDrawChecker.replaySaveState(editedGame, backendBoard.getBoardStateToken());

	//at this point if the game is still ongoing, gameResult needs to be set to ongoing
	if(inCheckmate !== true && hillWin !== true && inStalemate !== true){
		let checkDrawStatus = setAdditionalDrawStatus();
		if(checkDrawStatus.drawValue === false){
			gameResult = "Ongoing";
		}
		
	}
	

	switchSides();

	count++;
	total = count;
	updateSaveGameModalSpans();
	turnOnUndoEditsBtn();
	currentMoveCount.innerHTML = count;
	totalMoveCount.innerHTML = count;
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

function validateMove(x, y){

	for(let i = 0; i < possibleMoves.length; i++){
		if(possibleMoves[i].getX() == x && possibleMoves[i].getY() == y){
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

	if(possibleMoves.length > 0){
		possibleMoves.splice(0, possibleMoves.length);
	}

	for(let i = 0; i < size; i++){
		possibleMoves.push(moves.shift());
	}
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


function unHighlight(){

	/*
	if(selectedX < 0 || selectedX > 7 || selectedY < 0 || selectedY > 7){
		return;
	}
	*/

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

function insertDOMPiece(piece, x, y){
	let spot = document.querySelector("div[xvalue=" + CSS.escape(x) + "][yvalue=" + CSS.escape(y) + "]");
	spot.setAttribute("piece", piece);
}

function getPieceName(x, y){
	let spot = document.querySelector("div[xvalue=" + CSS.escape(x) + "][yvalue=" + CSS.escape(y) + "]");
	return spot.getAttribute("piece");
}


function removeDOMPiece(x, y){
	//returns the chess piece (DOM) that was on the deleted spot
	let spot = document.querySelector("div[xvalue=" + CSS.escape(x) + "][yvalue=" + CSS.escape(y) + "]");
	let oldPiece = spot.getAttribute("piece");
	spot.setAttribute("piece", "empty");
	return oldPiece;
}


function getNextEditedMove(){

	if(nextEditedMoves.length === 0){
		return null;
	}

	let nextMove = nextEditedMoves.pop();

	//movesPassed.push(nextMove);
	return nextMove;
}

function nextMove(e){
	//fired when next move button is clicked
	//need to get the right next move from either save game string
	//OR from the nextEditedMove stack
	//finally update front and back boards

	console.log("Next Move Button Clicked");

	if(savedGameFound === false){
		//console.log("No Saved Game Currently Loaded");
		return;
	}

	if(gameSaver === null){
		//console.log("No Game Currently Loaded");
		return;
	}

	let nextMove;

	if(editedGame){
		nextMove = getNextEditedMove();
	}
	else{
		nextMove = gameSaver.readNextMove();
	}

	if(nextMove === null){
		return;
	}


	count++;
	currentMoveCount.innerHTML = count;
		
	//processNextMove(nextMove);
	let moveSet = nextMove.getMoves();

	

	//console.log("Here is the entire moveset:");
	//console.log(moveSet);
	//console.log(gameSaver.getMoves());

	if(nextMove.getMoveType() === "regular"){
		additionalDrawChecker.insertReplayNode(editedGame);
		additionalDrawChecker.replayCheckFifty(editedGame, backendBoard.getBoardState(), moveSet[0], moveSet[1], moveSet[2], moveSet[3]);
		nextMove.setBackendRemovedPiece(backendBoard.getPiece(moveSet[2], moveSet[3]));
		backendBoard.regularMove(moveSet[0], moveSet[1], moveSet[2], moveSet[3]);
	}
	else if(nextMove.getMoveType() === "enpassant"){
		additionalDrawChecker.insertReplayNode(editedGame);
		additionalDrawChecker.replayCheckFifty(editedGame, backendBoard.getBoardState(), moveSet[0], moveSet[1], moveSet[2], moveSet[3]);
		nextMove.setBackendRemovedPiece(backendBoard.getPiece(moveSet[4], moveSet[5]));
		backendBoard.enpassantMove(moveSet[0], moveSet[1], moveSet[2], moveSet[3], moveSet[4], moveSet[5]);
	}
	else if(nextMove.getMoveType() === "castle"){
		additionalDrawChecker.insertReplayNode(editedGame);
		additionalDrawChecker.replayCheckFifty(editedGame, backendBoard.getBoardState(), moveSet[0], moveSet[1], moveSet[2], moveSet[3]);
		backendBoard.castleMove(moveSet[0], moveSet[1], moveSet[2], moveSet[3], moveSet[0], moveSet[4], moveSet[5]);
	}
	else if(nextMove.getMoveType() === "promotion"){
		additionalDrawChecker.insertReplayNode(editedGame);
		additionalDrawChecker.replayCheckFifty(editedGame, backendBoard.getBoardState(), moveSet[1], moveSet[2], moveSet[3], moveSet[4]);
		nextMove.setBackendRemovedPiece(backendBoard.getPiece(moveSet[3], moveSet[4]));
		nextMove.setExtraBackendRemovedPiece(backendBoard.getPiece(moveSet[1], moveSet[2]));
		backendBoard.pawnPromoteMove(currentSide + moveSet[0], moveSet[1], moveSet[2], moveSet[3], moveSet[4]);
	
	}
	
	processNextMove(nextMove);
	resetCheckStatus();
	setCheckStatus();
	if(kothGame){
		checkKOTH();
	}

	additionalDrawChecker.replaySaveState(editedGame, backendBoard.getBoardStateToken());

	if(inCheckmate === false && inStalemate === false && hillWin === false){
		setAdditionalDrawStatus();
	}
	switchSides();

	if(selectedX !== -1 && selectedY !== -1){
		resetEditFields();
	}

	//backendBoard.printBoardState();
	
}


function lastMove(e){

	if(savedGameFound === false){
		//console.log("No saved Game Currently Loaded");
		return;
	}

	if(movesPassed.length <= 0){
		//console.log("No moves have passed");
		return;
	}

	let examineMove = movesPassed.pop();

	if(editedGame){
		nextEditedMoves.push(examineMove);
	}
	else{
		gameSaver.getLastMove(examineMove);
	}	

	count--;
	currentMoveCount.innerHTML = count;

	let moveSet = examineMove.getMoves();


	if(examineMove.getMoveType() === "regular"){
		//console.log("Look Here: ");
		//console.log(examineMove);

		let domPiece = removeDOMPiece(moveSet[2], moveSet[3]);
		insertDOMPiece(domPiece, moveSet[0], moveSet[1]);
		insertDOMPiece(examineMove.getRemovedPiece(), moveSet[2], moveSet[3]);

		let backPiece = backendBoard.removePiece(moveSet[2], moveSet[3]);

		//console.log("Removing: " + backPiece);
		backendBoard.insertPiece(backPiece, moveSet[0], moveSet[1]);

		//console.log("Inserting Removed Piece Back: " + examineMove.getBackendRemovedPiece());

		backendBoard.insertPiece(examineMove.getBackendRemovedPiece(), moveSet[2], moveSet[3]);
		//return;
	}
	else if(examineMove.getMoveType() === "enpassant"){
		let domPiece = removeDOMPiece(moveSet[2], moveSet[3]);
		insertDOMPiece(domPiece, moveSet[0], moveSet[1]);
		insertDOMPiece(examineMove.getRemovedPiece(), moveSet[4], moveSet[5]);

		let backPiece = backendBoard.removePiece(moveSet[2], moveSet[3]);
		backendBoard.insertPiece(backPiece, moveSet[0], moveSet[1]);
		backendBoard.insertPiece(examineMove.getBackendRemovedPiece(), moveSet[4], moveSet[5]);
		//return;
	}
	else if(examineMove.getMoveType() === "castle"){
		let domPiece = removeDOMPiece(moveSet[2], moveSet[3]);
		insertDOMPiece(domPiece, moveSet[0], moveSet[1]);

		let rookPiece = removeDOMPiece(moveSet[0], moveSet[5]);
		insertDOMPiece(rookPiece, moveSet[0], moveSet[4]);

		let backPiece = backendBoard.removePiece(moveSet[2], moveSet[3]);
		backendBoard.insertPiece(backPiece, moveSet[0], moveSet[1]);
		let backRook = backendBoard.removePiece(moveSet[0], moveSet[5]);
		backendBoard.insertPiece(backRook, moveSet[0], moveSet[4]);


	}
	else if(examineMove.getMoveType() === "promotion"){

		//here the move is undone
		//pawn promotion doesn't effect state of board
		insertDOMPiece(examineMove.getRemovedPiece(), moveSet[3], moveSet[4]);
		insertDOMPiece(examineMove.getExtraRemovedPiece(), moveSet[1], moveSet[2]);

		backendBoard.insertPiece(examineMove.getBackendRemovedPiece(), moveSet[3], moveSet[4]);
		backendBoard.insertPiece(examineMove.getExtraBackendRemovedPiece(), moveSet[1], moveSet[2]);
		//return;
	}

	//backendBoard.printBoardState();
	backendBoard.decrementCount();
	resetCheckStatus();
	setCheckStatus();
	if(kothGame){
		checkKOTH();
	}


	additionalDrawChecker.backupReplay(editedGame);
	additionalDrawChecker.backupCheckFifty(editedGame, count);
	
	if(inCheckmate === false && inStalemate === false && hillWin === false){
		setAdditionalDrawStatus();
	}

	switchSides();

	if(selectedX !== -1 && selectedY !== -1){
		resetEditFields();
	}


}


function processNextMove(nextMove){
	if(nextMove !== null){
		//console.log(nextMove.getMoves());
		if(nextMove.getMoveType() === "regular"){
			//commitRegularMove(nextMove.getMoves());
			commitRegularMove(nextMove);
		}
		else if(nextMove.getMoveType() === "enpassant"){
			//commitEnpassantMove(nextMove.getMoves());
			commitEnpassantMove(nextMove);
		}
		else if(nextMove.getMoveType() === "castle"){
			//commitCastleMove(nextMove.getMoves());
			commitCastleMove(nextMove);
		}
		else if(nextMove.getMoveType() === "promotion"){
			//commitPawnPromotion(nextMove.getMoves());
			commitPawnPromotion(nextMove);
		}
	}

	//backendBoard.printBoardState();
}


//function commitEnpassantMove(enpassantMoveSet){

function commitEnpassantMove(move){

	//console.log(move);
	let enpassantMoveSet = move.getMoves();

	let domPiece = removeDOMPiece(enpassantMoveSet[0], enpassantMoveSet[1]);
	insertDOMPiece(domPiece, enpassantMoveSet[2], enpassantMoveSet[3]);
	let removedPiece = removeDOMPiece(enpassantMoveSet[4], enpassantMoveSet[5]);
	
	//let move = new previousMove("enpassant", removedPiece);
	move.setRemovedPiece(removedPiece);
	//move.setBackendRemovedPiece(backendBoard.getPiece(enpassantMoveSet[4], enpassantMoveSet[5]));
	movesPassed.push(move);

	//backendBoard.enpassantMove(enpassantMoveSet[0], enpassantMoveSet[1], enpassantMoveSet[2], enpassantMoveSet[3], enpassantMoveSet[4], enpassantMoveSet[5]);
}


//function commitCastleMove(castleMoveSet){
function commitCastleMove(move){

	let castleMoveSet = move.getMoves();

	let domPiece1 = removeDOMPiece(castleMoveSet[0], castleMoveSet[1]);
	insertDOMPiece(domPiece1, castleMoveSet[2], castleMoveSet[3]);

	let domPiece2 = removeDOMPiece(castleMoveSet[0], castleMoveSet[4]);
	insertDOMPiece(domPiece2, castleMoveSet[0], castleMoveSet[5]);

	//let move = new previousMove("castle", null);
	movesPassed.push(move);

	//backendBoard.castleMove(castleMoveSet[0], castleMoveSet[1], castleMoveSet[2], castleMoveSet[3], castleMoveSet[0], castleMoveSet[4], castleMoveSet[5]);
}

//function commitRegularMove(regularMoveSet){
function commitRegularMove(move){

	let regularMoveSet = move.getMoves();

	let domPiece = removeDOMPiece(regularMoveSet[0], regularMoveSet[1]);
	let removedPiece = removeDOMPiece(regularMoveSet[2], regularMoveSet[3]);
	insertDOMPiece(domPiece, regularMoveSet[2], regularMoveSet[3]);

	//let move = new previousMove("regular", removedPiece);
	move.setRemovedPiece(removedPiece);
	//move.setBackendRemovedPiece(backendBoard.getPiece(regularMoveSet[2], regularMoveSet[3])); 
	movesPassed.push(move);

	//backendBoard.regularMove(regularMoveSet[0], regularMoveSet[1], regularMoveSet[2], regularMoveSet[3]);
}

//function commitPawnPromotion(promotionMoveSet){
function commitPawnPromotion(move){

	//console.log("Made it to commit function");
	//console.log("Promoting Taking Place")

	let promotionMoveSet = move.getMoves();
	//console.log(promotionMoveSet[0].length);

	let newPiece = getPromotionPiece(promotionMoveSet[0], promotionMoveSet[3]);
	//console.log(newPiece + "----");

	let removedPiece1 = removeDOMPiece(promotionMoveSet[3], promotionMoveSet[4]);

	let removedPiece2 = removeDOMPiece(promotionMoveSet[1], promotionMoveSet[2]);

	insertDOMPiece(newPiece, promotionMoveSet[3], promotionMoveSet[4]);

	move.setRemovedPiece(removedPiece1);
	move.setExtraRemovedPiece(removedPiece2);

	movesPassed.push(move);
}


function getPromotionPiece(firstChar, promotionSpot){

	let piece;
	let newPiece;

	switch(firstChar){
		case "Q":
			piece = "Queen";
			break;
		case "B":
			piece = "Bishop";
			break;
		case "R":
			piece = "Rook";
			break;
		case "N":
			piece = "Knight";
			break;
	}

//here is the problem for cotlb
	if(gameSaver.getPlayer().charAt(0) === "w"){
		if(promotionSpot === 0){
			newPiece = "white" + piece;
		}
		else{
			newPiece = "black" + piece;
		}
	}
	else if(gameSaver.getPlayer().charAt(0) === "b"){
		if(promotionSpot === 0){
			newPiece = "black" + piece;
		}
		else{
			newPiece = "white" + piece;
		}
	}

	return newPiece;
	
}


function setCheckStatus(){
	let checkStatus = backendBoard.kingCheck();
	let opponentSide;
	if(currentSide === 'w'){
		opponentSide = 'b';
	}
	else{
		opponentSide = 'w';
	}

	if(checkStatus.inCheck){
		checkX = checkStatus.checkX;
		checkY = checkStatus.checkY;
		checkSide = checkStatus.side;
		highlightCheck(checkX, checkY, true);

		if(checkStatus.checkmate){
			inCheckmate = true;
			gameResult = "Checkmate";

			if(currentSide === "w"){

				checkWarning.innerHTML = "Black In Checkmate";
				turnLabel.innerHTML = "";

				//console.log("Black In Checkmate");
			}
			else if(currentSide === "b"){

				checkWarning.innerHTML = "White In Checkmate";
				turnLabel.innerHTML = "";

				//console.log("White In Checkmate");
			}
		}

		else{
			if(currentSide === "w"){
				checkWarning.innerHTML = "Black In Check";
			}
			else if(currentSide === "b"){
				checkWarning.innerHTML = "White In Check";
			}
		}
	}

	
	//else if(backendBoard.stalemate(currentSide)){
	else if(backendBoard.stalemate(opponentSide)){
		inStalemate = true;
		//console.log("In Stalemate");
		checkWarning.innerHTML = "Stalemate";
		turnLabel.innerHTML = "";
		gameResult = "Stalemate";
	}
	


}

function setStalemateStatus(){

	if(backendBoard.stalemate(currentSide)){
		inStalemate = true;
		//console.log("In Stalemate");
		checkWarning.innerHTML = "Stalemate";
		turnLabel.innerHTML = "";
		gameResult = "Stalemate";
		return true;
	}
	else{
		inStalemate = false;
	}

	return false;
}

function setAdditionalDrawStatus(){

	let data = {
		drawValue: false
	};

	if(additionalDrawChecker.checkInsufficientPieces(backendBoard.getBoardState())){
		data.drawValue = true;
		gameResult = "Draw: Insufficient Pieces";
		checkWarning.innerHTML = "Draw: Insufficient Pieces";
		turnLabel.innerHTML = "";
	}

	else if(additionalDrawChecker.checkFiftyCounter()){
		data.drawValue = true;
		gameResult = "Draw: 50 Move Rule";
		checkWarning.innerHTML = "Draw: 50 Move Rule";
		turnLabel.innerHTML = "";
	}

	else if(additionalDrawChecker.replayCheckThreeFoldRepetition(editedGame)){
		data.drawValue = true;
		gameResult = "Draw: Threefold Repetition";
		checkWarning.innerHTML = "Draw: Threefold Repetition";
		turnLabel.innerHTML = "";
	}
	

	if(data.drawValue){
		console.log("Still draw value is true");
		inAdditionalDraw = true;
	}
	else{
		console.log("Setting additional draw to false");
		inAdditionalDraw = false;
		checkWarning.innerHTML = "";
	}

	return data;
}

function resetCheckStatus(){

	if(checkX !== -1 && checkY !== -1){
		highlightCheck(checkX, checkY, false);
		checkX = -1;
		checkY = -1;
		checkSide = null	
	}

	inCheckmate = false;
	inStalemate = false;

	checkWarning.innerHTML = "";

}

function highlightCheck(x, y, highlightRed){
	let kingSpot = document.querySelector("div[xvalue=" + CSS.escape(x) + "][yvalue=" + CSS.escape(y) + "]");

	if(highlightRed){
		//kingSpot.setAttribute("check", "red");
		if(kingSpot.classList.contains('bg-red-600') === false){
			kingSpot.classList.add('bg-red-600');
		}
	}else{
		//kingSpot.setAttribute("check", "false");
		if(kingSpot.classList.contains('bg-red-600')){
			kingSpot.classList.remove('bg-red-600');
		}
	}
}

function turnOffUndoEditsBtn(){

	if(undoEdits.classList.contains('cursor-not-allowed') === false){
		console.log("Undo Btn Turned Off");
		undoEdits.classList.add('cursor-not-allowed');
	}

	if(undoEdits.classList.contains('bg-gray-400') === false){
		undoEdits.classList.add('bg-gray-400');
	}

	if(undoEdits.classList.contains("bg-gray-200")){
		undoEdits.classList.remove("bg-gray-200");
	}

	if(undoEdits.classList.contains("hover:bg-gray-300")){
		undoEdits.classList.remove("hover:bg-gray-300");
	}

	if(undoEdits.classList.contains("active:bg-gray-400")){
		undoEdits.classList.remove("active:bg-gray-400");
	}

	if(undoEdits.classList.contains("duration-150")){
		undoEdits.classList.remove("duration-150");
	}

	/*
	if(undoEditsText.classList.contains("text-white")){
		undoEditsText.classList.remove("text-white");
	}
	

	if(undoEditsText.classList.contains("text-gray-600") === false){
		undoEditsText.classList.add("text-gray-600");
	}
	*/

}

function turnOnUndoEditsBtn(){
	if(undoEdits.classList.contains('cursor-not-allowed')){
		console.log("Undo Btn Turned On");
		undoEdits.classList.remove('cursor-not-allowed');
	}

	if(undoEdits.classList.contains('bg-gray-400')){
		undoEdits.classList.remove('bg-gray-400');
	}

	if(undoEdits.classList.contains("bg-gray-200") === false){
		undoEdits.classList.add("bg-gray-200");
	}

	if(undoEdits.classList.contains("hover:bg-gray-300") === false){
		undoEdits.classList.add("hover:bg-gray-300");
	}

	if(undoEdits.classList.contains("active:bg-gray-400") === false){
		undoEdits.classList.add("active:bg-gray-400");
	}

	if(undoEdits.classList.contains("duration-150") === false){
		undoEdits.classList.add("duration-150");
	}

	/*
	if(undoEditsText.classList.contains("text-gray-600")){
		undoEditsText.classList.remove("text-gray-600");
	}

	if(undoEditsText.classList.contains("text-white") === false){
		undoEditsText.classList.add("text-white");
	}
	*/

}

function undoAllEdits(){

	if(editedGame !== true){
		return;
	}

	additionalDrawChecker.clearEditReplayNodes();
	

	resetFields();
	currentSide = preservedGame.savedSide;

	if(currentSide === "w"){
		turnLabel.innerHTML = "White's Move";
	}
	else if(currentSide === "b"){
		turnLabel.innerHTML = "Black's Move";
	}
	for(let j = 0; j < preservedGame.savedMoves.length; j++){
		movesPassed.push(preservedGame.savedMoves[j]);
	}

	preservedGame.savedMoves.splice(0, preservedGame.savedMoves.length);

	backendBoard.useSaveBoard();
	backToFrontBoard();
	setAdditionalDrawStatus();
	setCheckStatus();

	//backendBoard.printBoardState();

	//console.log("Moves Passed: ");
	//console.log(movesPassed);

	count = backendBoard.getCurrentMove();
	currentMoveCount.innerHTML =  count;
	totalMoveCount.innerHTML = originalMoveCount;
	total = originalMoveCount;

	dateString = originalDate;
	gameResult = originalResult;

	updateSaveGameModalSpans();

	turnOffUndoEditsBtn();

}

function preserveGame(){
	
	for(let j = 0; j < movesPassed.length; j++ ){
		let toSaveMove = new saveMove();
		toSaveMove.setMoveType(movesPassed[j].getMoveType());
		toSaveMove.setRemovedPiece(movesPassed[j].getRemovedPiece());
		toSaveMove.setExtraRemovedPiece(movesPassed[j].getExtraRemovedPiece());
		toSaveMove.setBackendRemovedPiece(movesPassed[j].getBackendRemovedPiece());
		toSaveMove.setExtraBackendRemovedPiece(movesPassed[j].getExtraBackendRemovedPiece());

		let moveSet = movesPassed[j].getMoves();

		for(let k = 0; k < moveSet.length; k++){
			toSaveMove.addMove(moveSet[k]);
		}

		preservedGame.savedMoves.push(toSaveMove);
		
	}

	preservedGame.savedSide = currentSide;
	backendBoard.saveBoard();

}

function backToFrontBoard(){

	for(let j = 0; j < 8; j++){
		for(let k = 0; k < 8; k++){
			let piece = backendBoard.getPiece(j, k);

			switch(piece){
				case "wR":
					insertDOMPiece("whiteRook", j, k);
					break;
				case "wN":
					insertDOMPiece("whiteKnight", j, k);
					break;
				case "wB":
					insertDOMPiece("whiteBishop", j, k);
					break;
				case "wQ":
					insertDOMPiece("whiteQueen", j, k);
					break;
				case "wK":
					insertDOMPiece("whiteKing", j, k);
					break;
				case "wp":
					insertDOMPiece("whitePawn", j, k);
					break;
				case "bR":
					insertDOMPiece("blackRook", j, k);
					break;
				case "bB":
					insertDOMPiece("blackBishop", j, k);
					break;
				case "bN":
					insertDOMPiece("blackKnight", j, k);
					break;
				case "bQ":
					insertDOMPiece("blackQueen", j, k);
					break;
				case "bK":
					insertDOMPiece("blackKing", j, k);
					break;
				case "bp":
					insertDOMPiece("blackPawn", j, k);
					break;
				case "##":
					removeDOMPiece(j, k);
					break;

			}
		}
	}
}


function frontToBackBoard(){

	for(let j = 0; j < 8; j++){
		for(let k = 0; k < 8; k++){

			let piece = getPieceName(j, k);

			switch(piece){
				case "whiteRook":
					backendBoard.insertPiece("wR", j, k)
					break;
				case "whiteKnight":
					backendBoard.insertPiece("wN", j, k);
					break;
				case "whiteBishop":
					backendBoard.insertPiece("wB", j, k);
					break;
				case "whiteQueen":
					backendBoard.insertPiece("wQ", j, k);
					break;
				case "whiteKing":
					backendBoard.insertPiece("wK", j, k);
					break;
				case "whitePawn":
					backendBoard.insertPiece("wp", j, k);
					break;
				case "blackRook":
					backendBoard.insertPiece("bR", j, k);
					break;
				case "blackBishop":
					backendBoard.insertPiece("bB", j, k);
					break;
				case "blackKnight":
					backendBoard.insertPiece("bN", j, k);
					break;
				case "blackQueen":
					backendBoard.insertPiece("bQ", j, k);
					break;
				case "blackKing":
					backendBoard.insertPiece("bK", j, k);
					break;
				case "blackPawn":
					backendBoard.insertPiece("bp", j, k);
					break;
				case "empty":
					backendBoard.insertPiece("##", j, k);
					break;

			}
		}
	}
}


function addMoveToGameSaver(saver, moveType, moveSet){
	if(moveType === "regular"){
		saver.addBasicMove(moveSet[0], moveSet[1], moveSet[2], moveSet[3]);
	}
	else if(moveType === "enpassant"){
		saver.addEnpassantMove(moveSet[0], moveSet[1], moveSet[2], moveSet[3], moveSet[4], moveSet[5]);
	}
	else if(moveType === "castle"){
		saver.addCastleMove(moveSet[0], moveSet[1], moveSet[2], moveSet[3], moveSet[4], moveSet[5]);
	}
	else if(moveType === "promotion"){
		saver.addPromotionMove(moveSet[0], moveSet[1], moveSet[2], moveSet[3], moveSet[4]);
	}
		
}


function resetFields(){
	currentSide = "w";
	editedGame = false;
	editedLabel.innerHTML = "";
	if(nextEditedMoves.length > 0){
		nextEditedMoves.splice(0, nextEditedMoves.length);
	}
	if(movesPassed.length > 0){
		movesPassed.splice(0, movesPassed.length);
	}
	resetEditFields();
	resetCheckStatus();
}


function setupChargeBoard(playerSide, playerPieces){

	
	let whitePawnRank;
	let blackPawnRank;

	let knightRank;
	let knightPiece;

	let kingPosition;

	let queenSide;


	if(playerSide === "w"){
		if(playerPieces === "N"){
		//player has white Knights opponent has black Queens

			knightRank = 7;
			knightPiece = "whiteKnight";

			insertDOMPiece("blackQueen", 0, 1);
			insertDOMPiece("blackQueen", 0, 3);
			insertDOMPiece("blackQueen", 0, 6);

			queenSide = 0;

		}
		else{
		//player has white Queens and opponent has black Knights

			knightRank = 0;
			knightPiece = "blackKnight";

			insertDOMPiece("whiteQueen", 7, 1);
			insertDOMPiece("whiteQueen", 7, 3);
			insertDOMPiece("whiteQueen", 7, 6);

			queenSide = 7;


		}

		insertDOMPiece("blackKing", 0, 4);
		insertDOMPiece("whiteKing", 7, 4);

		whitePawnRank = 6;
		blackPawnRank = 1;
		kingPosition = 4;
	}

	else{

		if(playerPieces === "Q"){
		//player has black Queens and opponent has white Knights

			knightRank = 0;
			knightPiece = "whiteKnight";

			insertDOMPiece("blackQueen", 7, 1);
			insertDOMPiece("blackQueen", 7, 4);
			insertDOMPiece("blackQueen", 7, 6);

			queenSide = 7;

		}
		else{
		//player has black knights and opponent has white queens

			knightRank = 7;
			knightPiece = "blackKnight";

			insertDOMPiece("whiteQueen", 0, 1);
			insertDOMPiece("whiteQueen", 0, 4);
			insertDOMPiece("whiteQueen", 0, 6);

			queenSide = 0;

		}

		insertDOMPiece("blackKing", 7, 3);
		insertDOMPiece("whiteKing", 0, 3);

		whitePawnRank = 1;
		blackPawnRank = 6;
		kingPosition = 3;
	}


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


	//now add knights
	for(let i = 0; i < 8; i++){
		if(i === kingPosition){
			continue;
		}
		insertDOMPiece(knightPiece, knightRank, i);
	}

	removeDOMPiece(queenSide, 0);
	removeDOMPiece(queenSide, 2);
	removeDOMPiece(queenSide, 5);
	removeDOMPiece(queenSide, 7);

	if(playerSide === "w"){
		backendBoard = new Board('w', 'b');
	}
	else if(playerSide === "b"){
		backendBoard = new Board('b', 'w');
	}

	frontToBackBoard();

}


function setupBoard(){

	let blackBackRank;
	let blackPawnRank;
	let blackQueenPosition;
	let blackKingPosition;
	let whitePawnRank;
	let whiteBackRank;
	let whiteQueenPosition;
	let whiteKingPosition;

	if(gameSaver.getPlayer() === "w"){
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

	insertDOMPiece("blackRook", blackBackRank, 0);
	insertDOMPiece("blackKnight", blackBackRank, 1);
	insertDOMPiece("blackBishop", blackBackRank, 2);
	insertDOMPiece("blackQueen", blackBackRank, blackQueenPosition);
	insertDOMPiece("blackKing", blackBackRank, blackKingPosition);
	insertDOMPiece("blackBishop", blackBackRank, 5);
	insertDOMPiece("blackKnight", blackBackRank, 6);
	insertDOMPiece("blackRook", blackBackRank, 7);

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

	insertDOMPiece("whiteRook", whiteBackRank, 0);
	insertDOMPiece("whiteKnight", whiteBackRank, 1);
	insertDOMPiece("whiteBishop", whiteBackRank, 2);
	insertDOMPiece("whiteQueen", whiteBackRank, whiteQueenPosition);
	insertDOMPiece("whiteKing", whiteBackRank, whiteKingPosition);
	insertDOMPiece("whiteBishop", whiteBackRank, 5);
	insertDOMPiece("whiteKnight", whiteBackRank, 6);
	insertDOMPiece("whiteRook", whiteBackRank, 7);

	if(gameSaver.getPlayer() === "w"){
		backendBoard = new Board('w', 'b');
	}
	else if(gameSaver.getPlayer() === "b"){
		backendBoard = new Board('b', 'w');
	}
}

function createBoard(){

	let board = document.querySelector("#board");
	let width = 8;
	let height = 8;
	shaded = false;
	//spots = [];

	for(let i = 0; i < width; i++){
		
		for(let j = 0; j < height; j++){

			//console.log("Whoop: " + i + " " + j);

			let spot = document.createElement("div");
			spot.setAttribute("xvalue", i);
			spot.setAttribute("yvalue", j);
			spot.setAttribute("check", "false");

			if(shaded === false){
				//spot.className="light";
				spot.className = "w-1/8 h-1/8 border border-black border-solid bg-burley-wood m-0";
				shaded = true;
			}
			else{
				//spot.className="dark";
				spot.className = "w-1/8 h-1/8 border border-black border-solid bg-chocolate m-0";
				shaded = false;
			}

			spot.setAttribute("piece", "empty");
			spot.setAttribute("selected", "false");
			board.appendChild(spot);
			spot.addEventListener("click", move);
			//spots.push(spot);
		}

		if(shaded === true){
			shaded = false;
		}

		else{
			shaded = true;
		}

	}

}



function highlightMiddle(){

	let spot1 = document.querySelector("div[xvalue=" + CSS.escape(4) + "][yvalue=" + CSS.escape(4) + "]");
	let spot2 = document.querySelector("div[xvalue=" + CSS.escape(4) + "][yvalue=" + CSS.escape(3) + "]");
	let spot3 = document.querySelector("div[xvalue=" + CSS.escape(3) + "][yvalue=" + CSS.escape(4) + "]");
	let spot4 = document.querySelector("div[xvalue=" + CSS.escape(3) + "][yvalue=" + CSS.escape(3) + "]");

	//spot1.className = "gold";
	//spot2.className = "gold";
	//spot3.className = "gold";
	//spot4.className = "gold";

	highlightGold(spot1,'bg-burley-wood');
	highlightGold(spot2,'bg-chocolate');
	highlightGold(spot3,'bg-chocolate');
	highlightGold(spot4,'bg-burley-wood');
}



function unhighlightMiddle(){

	let spot1 = document.querySelector("div[xvalue=" + CSS.escape(4) + "][yvalue=" + CSS.escape(4) + "]");
	let spot2 = document.querySelector("div[xvalue=" + CSS.escape(4) + "][yvalue=" + CSS.escape(3) + "]");
	let spot3 = document.querySelector("div[xvalue=" + CSS.escape(3) + "][yvalue=" + CSS.escape(4) + "]");
	let spot4 = document.querySelector("div[xvalue=" + CSS.escape(3) + "][yvalue=" + CSS.escape(3) + "]");

	//spot1.className = "light";
	//spot2.className = "dark";
	//spot3.className = "dark";
	//spot4.className = "light";

	unHighlightGold(spot1,'bg-burley-wood');
	unHighlightGold(spot2,'bg-chocolate');
	unHighlightGold(spot3,'bg-chocolate');
	unHighlightGold(spot4,'bg-burley-wood');

}

function highlightGold(spot, bgColor){

	spot.classList.remove(bgColor);
	if(spot.classList.contains('bg-yellow-300') === false){
		spot.classList.add('bg-yellow-300');
	}

}

function unHighlightGold(spot, bgColor){

	if(spot.classList.contains('bg-yellow-300')){
		spot.classList.remove('bg-yellow-300');
	}
	spot.classList.add(bgColor);
}

function clearBoardAndMoves(){
	for(let i = 0; i < 8; i++){
		for(let j = 0; j < 8; j++){
			removeDOMPiece(i, j);
		}
	}

	gameSaver = null;

	if(movesPassed.length > 0){
		movesPassed.splice(0, movesPassed.length);
	}

}

//Pawn Promotion Modal

function openPromotionModal(){

	if(promotionModal.classList.contains('hidden')){
		promotionModal.classList.remove('hidden');
	}
}

function closePromotionModal(){

	if(promotionModal.classList.contains('hidden') === false){
		promotionModal.classList.add('hidden');
	}
}

function setupAndDisplayShowcase(e){
	if(currentSide === "w"){
		showcaseQueen.setAttribute("piece", "whiteQueen");
		showcaseKnight.setAttribute("piece", "whiteKnight");
		showcaseRook.setAttribute("piece", "whiteRook");
		showcaseBishop.setAttribute("piece", "whiteBishop");
	}
	else if(currentSide === "b"){
		showcaseQueen.setAttribute("piece", "blackQueen");
		showcaseKnight.setAttribute("piece", "blackKnight");
		showcaseRook.setAttribute("piece", "blackRook");
		showcaseBishop.setAttribute("piece", "blackBishop");
	}

	//modal.style.display = "block";
	openPromotionModal();
	queenPromote();
}

function selectInShowcase(piece){

	showcaseQueen.setAttribute("selected", "false");
	showcaseKnight.setAttribute("selected", "false");
	showcaseRook.setAttribute("selected", "false");
	showcaseBishop.setAttribute("selected", "false");

	tailwindUnhighlight(showcaseQueen);
	tailwindUnhighlight(showcaseKnight);
	tailwindUnhighlight(showcaseRook);
	tailwindUnhighlight(showcaseBishop);

	if(piece === "queen"){
		showcaseQueen.setAttribute("selected", "true");
		tailwindHighlight(showcaseQueen,'border-green-600');
	}
	else if(piece === "knight"){
		showcaseKnight.setAttribute("selected", "true");
		tailwindHighlight(showcaseKnight, 'border-green-600');
	}
	else if(piece === "rook"){
		showcaseRook.setAttribute("selected", "true");
		tailwindHighlight(showcaseRook,'border-green-600' );
	}
	else if(piece === "bishop"){
		showcaseBishop.setAttribute("selected", "true");
		tailwindHighlight(showcaseBishop,'border-green-600' );
	}
}


function queenPromote(e){
	selectInShowcase("queen");
}

function knightPromote(e){
	selectInShowcase("knight");
}

function rookPromote(e){
	selectInShowcase("rook");
}

function bishopPromote(e){
	selectInShowcase("bishop");
}

promotionSelectBtn.onclick = function(){
	let move = null;
	let piece = null;
	let moveSet = null;

	if(showcaseQueen.getAttribute("selected") === "true"){
		piece = "Q";
	}
	else if(showcaseKnight.getAttribute("selected") === "true"){
		piece = "N";
	}
	else if(showcaseRook.getAttribute("selected") === "true"){
		piece = "R";
	}
	else if(showcaseBishop.getAttribute("selected") === "true"){
		piece = "B";
	}

	savedPromotionMove.addPromotionPiece(piece);
	moveSet = savedPromotionMove.getMoves();
	backendBoard.pawnPromoteMove(currentSide + moveSet[0], moveSet[1], moveSet[2], moveSet[3], moveSet[4]);
	
	move = savedPromotionMove;
	savedPromotionMove = null;

	//modal.style.display = "none";
	closePromotionModal();
	finishMove(move);
	return;

}

//save game modal

cancelSaveBtn.onclick = function(){
	//saveGameModal.style.display = "none";
	tailwindCloseSaveGameModal();
}

closeSaveBtn.onclick = function(){
	//saveGameModal.style.display = "none";
	tailwindCloseSaveGameModal();
}

viewGamesBtn.onclick = function(){

	tailwindCloseSaveGameModal();
	clearFetchedGameList();
	clearModalList();
	removeViewModalWarning();
	fetchSavedGamesIDsIntoList();
	openDisplayGamesModal();
}

function tailwindCloseSaveGameModal(){

	if(saveGameModal.classList.contains('hidden') === false){
		saveGameModal.classList.add('hidden');
	}
}

function openSaveGameModal(e){

	dateString = getRightDate();
	appendSpan("#saveModal-resultText", gameResult);
	appendSpan("#saveModal-moveNumText", total);
	appendSpan("#saveModal-dateText", dateString);
	badSaveWarning.innerHTML = "";
	if(saveGameModal.classList.contains('hidden')){
		saveGameModal.classList.remove('hidden');
	}
}

finishSaveBtn.onclick = function(){

	let gameSaver2 = new Saver(currentSide);
	let moveSet = null;
	let oppName = null;
	let movesToSend = null;


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


	if(editedGame){

		if(movesPassed.length === 0 && nextEditedMoves.length === 0){
			saveModalWarningRed();
			badSaveWarning.innerHTML = "Error: Cannot Save A Game With No Moves Recorded";
			return;
		}

		for(let i = 0; i < movesPassed.length; i++){
			moveSet = movesPassed[i].getMoves();
			moveType = movesPassed[i].getMoveType();
			addMoveToGameSaver(gameSaver2, moveType, moveSet);
		}

		//for(let j = 0; j < nextEditedMoves.length; j++){
		for(let j = nextEditedMoves.length - 1; j >= 0; j--){
			moveSet = nextEditedMoves[j].getMoves();
			moveType = nextEditedMoves[j].getMoveType();
			addMoveToGameSaver(gameSaver2, moveType, moveSet);
		}

		oppName = "Edited Game";
		movesToSend = gameSaver2.getMoves();
	}

	else if(editedGame !== true){

		if(gameSaver === undefined || gameSaver === null){
			saveModalWarningRed();
			badSaveWarning.innerHTML = "Error: No Game Found";
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
		

		oppName = opponentUsername;
		movesToSend = gameSaver.getMoves();
	}


	sendGameData(oppName, movesToSend, saveGameNameInput.value);

	saveGameNameInput.value = '';

}

async function sendGameData(opponent, moves, gameName){


	let sideOfPlayer;

	if(gameSaver !== undefined && gameSaver !== null){
		sideOfPlayer = gameSaver.getPlayer();
	}

	let dataToSend = {
		playerName: myUsername,
		playerPassword: myPassword,
		oppName: opponent,
		//side: gameSaver.getPlayer(),
		side: sideOfPlayer,
		gameMoves: moves,
		name: gameName,
		gameMode: currentGameModeLoaded,
		count: total,
		date: getRightDate(),
		result: gameResult
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
		return;
	}
	
	if(fetchResult.error){
		saveModalWarningRed();

		if(fetchResult.type === -1){
			badSaveWarning.innerHTML = "Error Accessing Database";
		}
		else if(fetchResult.type === 0){
			badSaveWarning.innerHTML = "Game Not Saved: No Valid Username Sent";
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


function getRightDate(){
	let dateObject = new Date();
	let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	if(editedGame || dateString === null){
		dateString = months[dateObject.getMonth()] + " " + dateObject.getDate() + ", " + dateObject.getFullYear();
	}
	return dateString;

}

function updateSaveGameModalSpans(){
	if(saveGameModal.classList.contains('hidden') === false){
		dateString = getRightDate();
		appendSpan("#saveModal-resultText", gameResult);
		appendSpan("#saveModal-dateText", dateString);
		appendSpan("#saveModal-moveNumText", total);
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


//view and load games modal

function removeViewModalWarning(){
	viewWarningText.innerHTML = "";
}

function openLoadGameModal(e){
	//saveGameModal.style.display = "none";
	//displayGamesModal.style.display = "block";
	//fetchAllSavedGameIDs();
	tailwindCloseSaveGameModal();
	clearFetchedGameList();
	clearModalList();
	removeViewModalWarning();
	fetchSavedGamesIDsIntoList();
	openDisplayGamesModal();
}

closeViewBtn.onclick = function(){
	//x button
	closeDisplayGamesModal();
	closeVerticalDropdown();
}

function closeDisplayGamesModal(){
	if(displayGamesModal.classList.contains('hidden') === false){
		displayGamesModal.classList.add('hidden');
	}
}

function openDisplayGamesModal(){
	if(displayGamesModal.classList.contains('hidden')){
		displayGamesModal.classList.remove('hidden');
	}
}

function clearModalList(){
	while(displayVerticalMenu.firstChild){
		displayVerticalMenu.removeChild(displayVerticalMenu.lastChild);
	}
}


//Delete Game Functions

deleteBtn.onclick = function(){
	removeViewModalWarning();
	handleGameDelete();
}

async function handleGameDelete(){

	//delete button is clicked
	//listOfFetchedGames is an array of currently fetched game info
	let deletionID = displayedGameID;
	let end = listOfFetchedGames.length;

	if(displayedGameID === -1){
		console.log("No deletion");
		return;
	}

	let deleteResult = await fetchDeleteGame(displayedGameID);

	if(deleteResult.error === true && (deleteResult.type === 0 || deleteResult.type === 1 || deleteResult.type === 2 || deleteResult.type === 4)){
		return;
	}

	/*
	if(deleteResult.error === false){
		if(displayedGameID === currentGameLoadedID){
			currentGameLoadedID = -1;
		}
	}
	*/

	//need to delete the game in the list
	let deletedGame = document.querySelector("div[gameIdentity=" + CSS.escape(displayedGameID) + "]");
	deletedGame.remove();
	displayedGameID = -1;
	//backupDisplayedID = -1;

	//need to delete from the back list
	for(let i = 0; i < end; i++){
		if(listOfFetchedGames[i].id === deletionID){
			listOfFetchedGames.splice(i, 1);
			console.log("Deleted");
			console.log(listOfFetchedGames);
			break;
		}
	}

	//need to remove html
	emptyAllGameInfo();

	if(displayVerticalMenu.childElementCount === 0){
		addViewGamesListElement("(Empty)", 'empty');
	}
}

async function fetchDeleteGame(id){


	let dataToSend = {
		user: myUsername,
		playerPassword: myPassword,
		identity: id
	};

	let fetchResult;
	
	await fetch('/home/deleteSavedGame', 
	
		{
			method: 'POST',
			headers:{
				'Content-Type': 'application/json'
			},

			body: JSON.stringify(dataToSend)
		}).then(
			(res) => {
				
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
			//console.log("Bad password");
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

function emptyAllGameInfo(){

	appendSpan("#viewModal-gameModeText", "");
	appendSpan("#viewModal-countText", "");
	appendSpan("#viewModal-opponentText", "");
	appendSpan("#viewModal-resultText", "");
	appendSpan("#viewModal-dateText", "");
	loadLabel.innerHTML = "";
}

function addBreakLineInName(domElement, name, endIndex){

	/*
	let returnValue = {
		spaceAdded: false,
		dashAdded: false,
		adjustedLeftover: null
	};
	*/

	let textNode = null;

	if(name.length <= endIndex || endIndex < 1){
		//returnValue.adjustedLeftover = name;
		//return returnValue;
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
	/*
	if(name.charAt(endIndex - 1) !== '-'){
		returnValue.adjustedName = start + "-" + "<br>" + end;
		returnValue.dashAdded = true;
	}
	else{
		returnValue.adjustedName = start + "<br>" + end;
	}
	
	
	return returnValue;
	*/

	/*
	if(name.charAt(endIndex) !== ' '){
		let start = name.substring(0, endIndex);
		let end = name.substring(endIndex);
		returnValue.spaceAdded = true;
		if(name.charAt(endIndex - 1) !== '-'){
			returnValue.adjustedName = start + "-" + "<br>" + end;
			returnValue.dashAdded = true;
		}
		else{
			returnValue.adjustedName = start + "<br>" + end;
		}
	}
	else{
		returnValue.adjustedName = name;
	}
	*/

	//return returnValue;
}


function reformatLongGameName(domElement, name){

	/*
	let dashAdded = false;
	let spaceAdded = false;
	let firstAdjustment = null;
	*/

	let firstLeftover = null;
	let secondLeftover = null;

	firstLeftover = addBreakLineInName(domElement, name, 17);

	if(name.length <= 17){
		//addBreakLineInName(domElement, name, 17);
		return;
	}

	secondLeftover = addBreakLineInName(domElement, firstLeftover, 17);

	if(secondLeftover === null){
		return;
	}

	addBreakLineInName(domElement, secondLeftover, 17);
	
	
	/*
	if(name.charAt(17) !== ' '){
		let start = name.substring(0, 17);
		let end = name.substring(17);
		spaceAdded = true;
		if(name.charAt(16) !== '-'){
			firstAdjustment = start + "-" + "<br>" + end;
			let dashAdded = true;
		}
		else{
			firstAdjustment = start + "<br>" + end;
		}
	}
	else{
		firstAdjustment = name.substring(0);
	}
	*/


	/*
	if(firstAdjustment.adjustedName.length <= 38){
		return firstAdjustment.adjustedName;
	}

	if(firstAdjustment.adjustedName.length <= 39 && firstAdjustment.dashAdded){
		return firstAdjustment.adjustedName;
	}

	if(firstAdjustment.dashAdded === false){
		secondAdjustemnt = addBreakLineInName(firstAdjustment.adjustedName, 38);
		return secondAdjustemnt.adjustedName;
	}

	if(firstAdjustment.dashAdded){
		secondAdjustemnt = addBreakLineInName(firstAdjustment.adjustedName, 39);
		return secondAdjustemnt.adjustedName;
	}

	return name;
	*/
}

//Populating the visual list of games functions:

function addViewGamesListElement(name, id){

	
	let element = document.createElement("div");
	/*
	let textNode = document.createTextNode(name);
	let textNode2 = document.createTextNode("seee");
	let breakline = document.createElement("br");
	element.append(textNode);
	element.append(breakline);
	element.append(textNode2);
	*/
	
	//let link = null;
	
	reformatLongGameName(element, name);
	/*
	if(name.length > 17){
		let newName = reformatLongGameName(name);
		element.innerHTML = newName;
	}
	else{
		element.innerHTML = name;
	}
	*/
	

	//let link = document.createTextNode(name);
	//element.append(link);
	element.setAttribute("gameIdentity", id);
	element.addEventListener("click", toggleIDSelection);
	//element.classList = "bg-gray-300 hover:bg-gray-400 border-x border-b border-gray-400 h-10 w-full shrink-0 text-center text-black hover:cursor-pointer";
	element.classList = "flex flex-col flex-wrap justify-center bg-gray-300 hover:bg-gray-400 border-x border-b whitespace-nowrap overflow-x-auto border-gray-500 w-full shrink-0 text-center text-black hover:cursor-pointer";
	element.setAttribute("elementType", "displayVerticalMenuElement");

	if(name.length > 17 && name.length < 35){
		element.classList.add("h-12");
		/*
		element.classList.remove("flex-col");
		element.classList.remove("justify-center");
		*/
	}
	else if(name.length >= 35){
		element.classList.add("h-18");
	}
	else{
		element.classList.add("h-10");
	}

	
	
	displayVerticalMenu.appendChild(element);
	
}

async function fetchSavedGamesIDsIntoList(){

	let dataToSend = {
		user: myUsername,
		playerPassword: myPassword,
		mode: selectedSortOptionIndex
	};

	let fetchResult;
	
	await fetch('/home/getAllSavedGameIDs', 
		{
			method: 'POST',
			headers:{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(dataToSend)
		}).then(
			(res) => {
				console.log("Got a response in Get All IDs")
				if(res.ok === false){
					console.log("About to throw error");
					fetchResult = {error: true};
					throw Error(res.statusText);
				}
				return res.json()
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
	else{

		let i = 0;
		let end = fetchResult.rows.length;

		while(i < end){

			let node = getGameNode(fetchResult.rows[i].name, fetchResult.rows[i].id, fetchResult.rows[i].gameMode);
			listOfFetchedGames.push(node);
			i++;
		}		
	}

	//printFetchedGameList();
	fetchGameListToVisualList();

}

function fetchGameListToVisualList(){

	//takes listOfFetchedGames and populates the visual list of games

	if(listOfFetchedGames.length === 0){
		console.log("No elements found");
		displayedGameID = -1;
		addViewGamesListElement("(Empty)", 'empty');
		emptyAllGameInfo();
	}

	else if(listOfFetchedGames.length > 0){

		let i = 0;
		let end = listOfFetchedGames.length;
		let firstIDFound = -1;
		let selectedElement;
		
		//displayedGameID = -1;

		while(i < end){

			addViewGamesListElement(listOfFetchedGames[i].name, listOfFetchedGames[i].id);

			if(i === 0 && displayedGameID === -1){
				firstIDFound = listOfFetchedGames[i].id;
				displayedGameID = listOfFetchedGames[i].id;
				//backupDisplayedID = displayedGameID;
				let firstInList = document.querySelector("div[gameIdentity=" + CSS.escape(displayedGameID) + "]");
				tailwindHighlightSavedGame(firstInList);
			}

		

			i++;
		}

		if(displayedGameID !== -1){
			console.log("Calling Attribute Call here");
			
			selectedElement = document.querySelector("div[gameIdentity=" + CSS.escape(displayedGameID) + "]");

			if(selectedElement === null){
				//previously selected element is no longer in list
				displayedGameID = listOfFetchedGames[0].id;
				selectedElement = document.querySelector("div[gameIdentity=" + CSS.escape(displayedGameID) + "]");
			}

			firstIDFound = displayedGameID;
			//backupDisplayedID = displayedGameID;
		
			tailwindHighlightSavedGame(selectedElement);
			displaySingleGameData(firstIDFound);
		}


		if(i > 0 && firstIDFound !== -1 && firstLoad){
			console.log("Using Automatic Load Game");
			//displaySingleGameData(firstIDFound);
			beginGameLoad();
			firstLoad = false;
		}

	}

}

//Displaying Single Game Data Using ID

function toggleIDSelection(e){

	console.log("Inside clicked game inside menu");
	removeViewModalWarning();

	//function activates when a game is selected in the visual list

	let id = -1;

	if(e.target.getAttribute("gameIdentity") === "empty"){
		return;
	}

	if(parseInt(e.target.getAttribute("gameIdentity")) === displayedGameID){
		return;
	}

	if(displayedGameID !== -1){
		//unselect the old game
		let oldID = document.querySelector("div[gameIdentity=" + CSS.escape(displayedGameID) + "]");
		tailwindUnhighlightSavedGame(oldID);
		if(oldID.getAttribute("selected") !== "loaded"){
			oldID.setAttribute("selected", "false");
		}
		
	}

	if(e.target.getAttribute("selected") !== "loaded"){
		e.target.setAttribute("selected", "true");
	}

	tailwindHighlightSavedGame(e.target);
	displayedGameID = parseInt(e.target.getAttribute("gameIdentity"));
	//backupDisplayedID = displayedGameID;
	id = parseInt(e.target.getAttribute("gameIdentity"))
	displaySingleGameData(id);

	//this function is about selecting not loading
	if(currentGameLoadedID === displayedGameID){
		loadLabel.innerHTML = "Currently Loaded";
	}
	else{
		loadLabel.innerHTML = "";
	}

}

async function displaySingleGameData(gameID){

	let data = await fetchGameDataUsingID(gameID);

	if(gameID === currentGameLoadedID){
		loadLabel.innerHTML = "Currently Loaded";
	}
	else if(gameID !== currentGameLoadedID){
		loadLabel.innerHTML = "";
	}

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
			//emptyAllGameInfo();
		}
		else if(data.type === 4){
			//console.log("Request Not Processed, Try Again Later");
			viewWarningText.innerHTML = "Request Not Processed, Try Again Later";
		}
		emptyAllGameInfo();
		return;
	}

	appendSpan("#viewModal-gameModeText", data.result.gameMode);
	appendSpan("#viewModal-countText", data.result.count);
	appendSpan("#viewModal-opponentText", data.result.opponent);
	appendSpan("#viewModal-resultText", data.result.result);
	appendSpan("#viewModal-dateText", data.result.date);

}


async function fetchGameDataUsingID(id){

	//console.log("ID Stuff");
	//console.log(id);

	let dataToSend = {
		user: myUsername,
		playerPassword: myPassword,
		identity: id
	};

	let fetchResult;
	

	await fetch('/home/getSavedGameAttributes', 
	
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
			fetchResult = {error: true, type: 4};
			throw Error(res.statusText);
		}
		return res.json();
	
	})//this works) /*res.text()*/
	.then((data) => {
		//console.log(data.msg);
		fetchResult = data.msg;
	})
	.catch(function(error){
		console.log('Request failed doing stuff', error);
		return;
	});

	return fetchResult;
}




function tailwindHighlightSavedGame(element){

	if(element.classList.contains('bg-gray-300')){
		element.classList.remove('bg-gray-300');
		element.classList.add('bg-green-500');
	}

	if(element.classList.contains('hover:bg-gray-400')){
		element.classList.remove('hover:bg-gray-400');
	}
}


function tailwindUnhighlightSavedGame(element){

	if(element.classList.contains('bg-green-500')){
		element.classList.remove('bg-green-500');
		element.classList.add('bg-gray-300');
	}

	if(element.classList.contains('hover:bg-gray-400') === false){
		element.classList.add('hover:bg-gray-400');
	}
}


//Functions for Loading Game:

function beginGameLoad(e){

	//removeViewModalWarning();

	//console.log("In This Spot");
	//console.log(displayedGameID);
	if(displayedGameID === -1){
		return;
	}

	fetchCompleteGame(displayedGameID);
}


async function fetchCompleteGame(id){

	console.log("Fetch Complete Game Called");

	let fetchResult;
	//console.log("ID");
	//console.log(id);

	if(displayedGameID === currentGameLoadedID){
		return;
	}

	removeViewModalWarning();

	let dataToSend = {
		username: myUsername,
		playerPassword: myPassword,
		identity: id
	};

	await fetch('/home/getSavedGame', 
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

	//console.log("FetchResult: ");
	//console.log(fetchResult);

	if(fetchResult.error){
		if(fetchResult.type === 0){
			//console.log("Could Not Retrieve Game: Bad Username");
			viewWarningText.innerHTML = "Could Not Retrieve Game: Username Not Found";
		}
		else if(fetchResult.type === 1){
			//console.log("Could Not Retrieve Game: Incorrect Password");
			viewWarningText.innerHTML = "Could Not Retrieve Game: Incorrect Password";
		}
		else if(fetchResult.type === 2){
			//console.log("Could Not Retrieve Game: Bad ID");
			viewWarningText.innerHTML = "Could Not Retrieve Game: Game ID Incorrectly Formatted";
		}
		else if(fetchResult.type === 3){
			//console.log("Could Not Retrieve Game: Game Not Found");
			viewWarningText.innerHTML = "Could Not Retrieve Game: Game Not Found";
		}
		else if(fetchResult.type === 4){
			//console.log("Request Not Processed, Try Again Later");
			viewWarningText.innerHTML = "Request Not Processed, Try Again Later";
		}
		return;
	}

	/*
	if(fetchResult.error){
		console.log("No saved Game Found");
		savedGameFound = false;
		clearBoardAndMoves();
		currentMoveCount.innerHTML =  0;
		totalMoveCount.innerHTML = 0;
		turnLabel.innerHTML = "";
		opponentName.innerHTML = "";
		gameName.innerHTML = "";
		resetFields();
	}
	*/

	else{

		//important if you delete something, and then try to load
		if(currentGameLoadedID !== -1){
			let oldLoaded = document.querySelector("div[gameIdentity=" + CSS.escape(currentGameLoadedID) + "]");
			if(oldLoaded !== null){
				oldLoaded.setAttribute("selected", "false");
			}
		}

		let loaded = document.querySelector("div[gameIdentity=" + CSS.escape(displayedGameID) + "]");
		loaded.setAttribute("selected", "loaded");

		currentGameLoadedID = displayedGameID;
		//backupLoadedID = currentGameLoadedID;
		loadUpGame(fetchResult.result);
			
	}

}

function removeChildElementsFromElement(domElement){
	while(domElement.firstChild){
		domElement.removeChild(domElement.lastChild);
	}
}


function loadUpGame(fetchResult){

	resetFields();
	inAdditionalDraw = false;
	hillWin = false;
	kothGame = false;
	cotlbGame = false;

	let currentMode = fetchResult.gameMode;

	if(currentGameModeLoaded === "koth" && currentMode !== "koth"){
		unhighlightMiddle();
	}

	if(currentMode === "koth"){
		highlightMiddle();
		kothGame = true;
	}

	if(currentMode === "cotlb"){
		cotlbGame = true;
	}

	//need to change this line
	//gameResult = "Ongoing";
	originalResult = fetchResult.result;
	gameResult = fetchResult.result;
	originalDate = fetchResult.date;
	dateString = fetchResult.date;
	//console.log("This is gameResult: " + gameResult);
	savedGameFound = true;
	gameSaver = new Saver(fetchResult.side);
	gameSaver.setMoves(fetchResult.movesMade);
	opponentUsername = fetchResult.opponent;
	currentGameModeLoaded = fetchResult.gameMode;

	//gameName.innerHTML = fetchResult.name;
	removeChildElementsFromElement(gameName);
	removeChildElementsFromElement(opponentName);
	//let gameNameTextNode = document.createTextNode(fetchResult.name);
	//gameName.append(gameNameTextNode);
	gameName.append(document.createTextNode(fetchResult.name));
	//opponentName.innerHTML = fetchResult.opponent;
	opponentName.append(document.createTextNode(fetchResult.opponent));


	count = 0;
	currentMoveCount.innerHTML =  0;

	originalMoveCount = fetchResult.movecount;

	totalMoveCount.innerHTML = fetchResult.movecount;

	total = fetchResult.movecount;

	turnLabel.innerHTML = "White's Move";

	//need to handle the changing of gamemodes here
	if(fetchResult.gameMode === "cotlb"){
		setupChargeBoard(gameSaver.getPlayer().charAt(0), gameSaver.getPlayer().charAt(1));
	}
	else{
		setupBoard();
	}

	
	if((currentGameLoadedID === displayedGameID) && (displayedGameID !== -1) ){
		loadLabel.innerHTML = "Currently Loaded";
	}

	updateSaveGameModalSpans();
	turnOffUndoEditsBtn();

	//load up the additionalDrawChecker

	let side;
	let opponentSide;

	if(fetchResult.side.charAt(0) === 'w'){
		side = 'w';
	}
	else if(fetchResult.side.charAt(0) === 'b'){
		side = 'b';
	}

	if(side === 'w'){
		opponentSide = 'b';
	}
	else if(side === 'b'){
		opponentSide = 'w';
	}

	additionalDrawChecker = new drawChecker(side, opponentSide);
	additionalDrawChecker.insertReplayNode(false);
	additionalDrawChecker.setCheckFiftyCounterValue(false, 0);
	additionalDrawChecker.replaySaveState(false, backendBoard.getBoardStateToken());

}

function getGameNode(text, identity, mode){

	let gameDataNode = {
		name: text,
		id: identity,
		gameMode: mode
	};

	return gameDataNode;
}

function clearFetchedGameList(){

	console.log("Size before splice");
	console.log(listOfFetchedGames.length);

	if(listOfFetchedGames.length > 0){
		listOfFetchedGames.splice(0, listOfFetchedGames.length);
	}

	console.log("Size after splice");
	console.log(listOfFetchedGames.length);
	console.log("Method complete");

}

function printFetchedGameList(){

	let size = listOfFetchedGames.length;
	let i = 0;
	console.log("Size: " + size);
	for(i = 0; i < size; i++){
		console.log(listOfFetchedGames[i]);
	}
} 

//dropdown menu in view and load modal

function activateVerticalDropdown(e){
	if(verticalDropdown.classList.contains('hidden')){
		verticalDropdown.classList.remove('hidden');
		return;
	}
	closeVerticalDropdown();
}


function closeVerticalDropdown(){
	if(verticalDropdown.classList.contains('hidden') === false){
		verticalDropdown.classList.add('hidden');
	}
}


function viewUnhighlightDropdown(mode){

	let element = document.querySelector("div[mode=" + CSS.escape(mode) + "]");

	if(element.classList.contains('bg-slate-400')){
		element.classList.remove('bg-slate-400');
		element.classList.add('bg-slate-200');
		element.classList.add('hover:bg-slate-300');
	}
}

function viewHighlightDropdown(mode){
	let element = document.querySelector("div[mode=" + CSS.escape(mode) + "]");

	if(element.classList.contains('bg-slate-200')){
		element.classList.remove('bg-slate-200');
		element.classList.remove('hover:bg-slate-300');
		element.classList.add('bg-slate-400');
	}
}


function toggleSortingOptionSelection(e){



	let mode = e.target.getAttribute('mode');

	if(mode === selectedSortOptionIndex){
		return;
	}

	viewUnhighlightDropdown(selectedSortOptionIndex);
	selectedSortOptionIndex = mode;
	viewHighlightDropdown(mode)

	clearModalList();
	clearFetchedGameList();
	removeViewModalWarning();
	
	if(mode === 'all'){
		viewFetchedHeaderText.innerHTML = 'All Games Displayed';
	}
	else if(mode === 'classic'){
		viewFetchedHeaderText.innerHTML = 'Classic Games Displayed';
	}
	else if(mode === 'koth'){
		viewFetchedHeaderText.innerHTML = 'K.O.T.H. Games Displayed';
	}
	else if(mode === 'cotlb'){
		viewFetchedHeaderText.innerHTML = 'C.O.T.L.B. Games Displayed';
	}
	else if(mode === 'speed'){
		viewFetchedHeaderText.innerHTML = 'Speed Games Displayed';
	}

	fetchSavedGamesIDsIntoList();

}