


let dropBtn = document.getElementById("useDrop");
dropBtn.addEventListener("click", dropmenu);
let dropList = document.getElementById("dropList");

let previousGameMode = document.getElementById("previous-gameMode");
let nextGameMode = document.getElementById("next-gameMode");

let gameModeText = document.getElementById("gameMode");

let leaderboardsPanel = document.querySelector("#leaderboardsPanel");

let classicLink = document.querySelector("#classicLink");
let kothLink = document.querySelector("#kothLink");
let cotlbLink = document.querySelector("#cotlbLink");
let speedLink = document.querySelector("#speedLink");

let columnText = document.querySelector("#columnText");




classicLink.addEventListener("click", getClassic);
kothLink.addEventListener("click", getKOTH);
cotlbLink.addEventListener("click", getCOTLB);
speedLink.addEventListener("click", getSpeed);


let gameModeArray = ["classicstats", "kothstats", "cotlbstats", "speedstats"];
let gameModeArrayIndex = 3;

let fixedHeader = document.querySelector("#fixed-header");
let fixedHeaderMenu = document.querySelector("#fixed-header-menu");
let myUsername = sessionStorage.getItem("username");

if(myUsername !== null){
	createSignedInHeader(myUsername);
}
else{
	createNotSignedInHeader();
}

startClassic();

function dropmenu(){

	if(dropList.classList.contains("hidden")){
		dropList.classList.remove("hidden");
		dropList.classList.add("block");
		console.log("Removing Hidden");
	}
	else{
		dropList.classList.remove("block");
		dropList.classList.add("hidden");
		console.log("Adding Hidden");
	}
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

function unHighlight(){

	if(classicLink.classList.contains("bg-green-500")){
		classicLink.classList.remove("bg-green-500");
	}
	if(kothLink.classList.contains("bg-green-500")){
		kothLink.classList.remove("bg-green-500");
	}
	if(cotlbLink.classList.contains("bg-green-500")){
		cotlbLink.classList.remove("bg-green-500");
	}
	if(speedLink.classList.contains("bg-green-500")){
		speedLink.classList.remove("bg-green-500");
	}
}

function startClassic(){

	if(gameModeArrayIndex === 0){
		return;
	}
	gameModeArrayIndex = 0;
	unHighlight();
	classicLink.classList.add("bg-green-500");
	goToDifferentMode();
}

function getClassic(e){
	if(gameModeArrayIndex === 0){
		return;
	}
	gameModeArrayIndex = 0;
	unHighlight();
	classicLink.classList.add("bg-green-500");
	dropmenu();
	goToDifferentMode();
}

function getKOTH(e){
	if(gameModeArrayIndex === 1){
		return;
	}
	gameModeArrayIndex = 1;
	unHighlight();
	kothLink.classList.add("bg-green-500");
	dropmenu();
	goToDifferentMode();
}

function getCOTLB(e){
	if(gameModeArrayIndex === 2){
		return;
	}
	gameModeArrayIndex = 2;
	unHighlight();
	cotlbLink.classList.add("bg-green-500");
	dropmenu();
	goToDifferentMode();
}

function getSpeed(e){
	if(gameModeArrayIndex === 3){
		return;
	}
	gameModeArrayIndex = 3;
	unHighlight();
	speedLink.classList.add("bg-green-500");
	dropmenu();
	goToDifferentMode();
	return;
}

function goToDifferentMode(){

	let modeName;

	switch(gameModeArray[gameModeArrayIndex]){
		case "classicstats":
			modeName = "Classic Chess";
			break;
		case "kothstats":
			modeName = "King Of The Hill";
			break;
		case "cotlbstats":
			modeName = "Charge Of The Light Brigade"
			break;
		case "speedstats":
			modeName = "Speed Chess";
			break;
	}

	console.log("Retrieving: " + modeName);

	gameModeText.innerHTML = modeName;

	fetchAllPlayerStats();

}


async function fetchAllPlayerStats(){


	let dataToSend = {
		gameMode: gameModeArray[gameModeArrayIndex]
	};

	let fetchResult;
	

	await fetch('/home/getAllPlayersStats', 
	
		{
			method: 'POST',
			headers:{
				'Content-Type': 'application/json'
			},

			body: JSON.stringify(dataToSend)
		}
	).then(
		(res) => {
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


	console.log("After fetch");
	clearLeaderBoards();
	

	if(fetchResult.error){
		console.log("No table found");
		addColumnTextBorder();
		//clearBoardAndMoves();
	}
	else{
		console.log(fetchResult);

		if(fetchResult.values.length === 0){
			console.log("Zero Results");
			addColumnTextBorder();
		}


		if(fetchResult.values.length > 0){
			removeColumnTextBorder();
			console.log("Something Interesting");

			let shaded = false;
			let i = 0;
			let lastEloFound = -1;
			let rankValue = 0;
			let lastRankFound = 1;

			while(i < fetchResult.values.length){
				if(fetchResult.values[i].elo === lastEloFound){
					rankValue = lastRankFound;
				}
				else{
					rankValue = i + 1;
				}

				lastEloFound = fetchResult.values[i].elo;
				lastRankFound = rankValue;

				let locationInList = "middle";

				if(i === 0){
					locationInList = "first";
				}
				else if(i + 1 === fetchResult.values.length){
					locationInList = "last";
				}

				appendPlayerStat(fetchResult.values[i].username, fetchResult.values[i].elo, shaded,  rankValue, locationInList);
				i++;

				if(shaded){
					shaded = false;
				}
				else{
					shaded = true;
				}
			}
			
		}
		else{
			console.log("Nothing To Show");
		}

	}

} 

function clearLeaderBoards(){
	while(leaderboardsPanel.firstChild){
		leaderboardsPanel.removeChild(leaderboardsPanel.lastChild);
	}
	
}


function appendPlayerStat(username, elo, shaded, rank, locationInList){

	let playerStat = document.createElement("div");

	let borderTop = " border-t ";
	let borderBottom = " border-b";

	if(locationInList === "first"){
		borderTop = " border-t-2 ";
	}
	else if(locationInList === "last"){
		borderBottom = " border-b-2"
	}

	//playerStat.className = "flex justify-center w-1/2 h-16 bg-green-200 border-x-2 border-t border-b border-black border-solid";
	playerStat.className = "flex justify-between w-full h-16 bg-green-200 border-x-2 border-black border-solid" + borderTop + borderBottom;

	let rankSquare = document.createElement("div");
	rankSquare.className = "h-full w-16 flex justify-center items-center bg-white border-r-2 border-green-300";

	let usernameTextLine = document.createElement("div");
	usernameTextLine.className = "h-full flex justify-center items-center";

	let eloTextLine = document.createElement("div");
	eloTextLine.className = "h-full flex justify-center items-center w-24";
	
	let playerUsername = document.createElement("div");
	let playerElo = document.createElement("h2");
	//playerUsername.innerHTML = username;
	playerUsername.append(document.createTextNode(username));
	playerElo.innerHTML = elo;
	
	let rankNumber = document.createElement("h3");
	rankNumber.innerHTML = rank;

	rankSquare.appendChild(rankNumber);
	
	playerStat.appendChild(rankSquare);

	usernameTextLine.appendChild(playerUsername);
	eloTextLine.appendChild(playerElo);

	playerStat.appendChild(usernameTextLine);
	playerStat.appendChild(eloTextLine);

	let value = sessionStorage.getItem("username");

	if(value !== null && value === username){

		playerStat.classList.remove("bg-green-200");
		rankSquare.classList.remove("border-green-300");
		playerStat.classList.add("bg-amber-500");
		rankSquare.classList.add("border-amber-600");

		usernameTextLine.classList.add("text-white");
		eloTextLine.classList.add("text-white");
	}

	playerStat.setAttribute("shaded", shaded);
	leaderboardsPanel.appendChild(playerStat);
}

function addColumnTextBorder(){
	if(columnText.classList.contains('border-b-2') === false){
		columnText.classList.add('border-b-2');
	}
}

function removeColumnTextBorder(){
	if(columnText.classList.contains('border-b-2')){
		columnText.classList.remove('border-b-2');
	}
}