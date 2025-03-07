let classicLink = document.querySelector("#classicLink");
let kothLink = document.querySelector("#kothLink");
let cotlbLink = document.querySelector("#cotlbLink");
let speedLink = document.querySelector("#speedLink");

let classicError = document.querySelector("#classic-error");
let kothError = document.querySelector("#koth-error");
let cotlbError = document.querySelector("#cotlb-error");
let speedError = document.querySelector("#speed-error");


classicLink.addEventListener("click", goToClassic);
kothLink.addEventListener("click", goToKOTH);
cotlbLink.addEventListener("click", goToCOTLB);
speedLink.addEventListener("click", goToSpeed);

let roomIndex;
let playerPosition;

let fixedHeader = document.querySelector("#fixed-header");
let fixedHeaderMenu = document.querySelector("#fixed-header-menu");
let myUsername = sessionStorage.getItem("username");
let myPassword = sessionStorage.getItem("password");

if(myUsername !== null){
	createSignedInHeader(myUsername);
}
else{
	createNotSignedInHeader();
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


function goToClassic(e){

	let dataToSend = {
		username: myUsername,
		password: myPassword
	};

	if(myUsername === null){
		turnOffErrors();
		classicError.innerHTML = "Must Be Signed In To Play";
		return;
	}	

	let socket = io('/classicGame');
	
	socket.emit('findRoom', dataToSend, (data) => {

		if(data.error){

			turnOffErrors();

			if(data.errorType === 0){
				classicError.innerHTML = "Username Not Found, Cannot Play";
			}
			else if(data.errorType === 1){
				classicError.innerHTML = "Password Incorrect, Cannot Play";
			}
			else if(data.errorType === 2){
				classicError.innerHTML = "Game Mode Not Found";
			}
			socket.disconnect();
		}
		
		else{
			roomIndex = data.roomNumber;
			playerPosition = data.playerPosition;
			socket.disconnect();
			lastStepClassic();
		}
		
	});

	return;
}

function lastStepClassic(){

	if(roomIndex === -1){
		turnOffErrors();
		classicError.innerHTML = "All Rooms Are Currently Full";
		return;		
	}

	console.log("Room Index: " + roomIndex);
	console.log("Player Position " + playerPosition);
	
	sessionStorage.setItem("classicCurrentRoom", roomIndex);
	sessionStorage.setItem("classicCurrentPosition", playerPosition);
	
	window.location.href = "classicChess";
}


function goToKOTH(e){
	
	let dataToSend = {
		username: myUsername,
		password: myPassword
	};

	if(myUsername === null){
		turnOffErrors();
		kothError.innerHTML = "Must Be Signed In To Play";
		return;
	}	

	let socket = io('/kothGame');

	socket.emit('findRoom', dataToSend, (data) => {
		if(data.error){

			turnOffErrors();
			if(data.errorType === 0){
				kothError.innerHTML = "Username Not Found, Cannot Play";
			}
			else if(data.errorType === 1){
				kothError.innerHTML = "Password Incorrect, Cannot Play";
			}
			else if(data.errorType === 2){
				kothError.innerHTML = "Game Mode Not Found";
			}

			socket.disconnect();
		}
		else{
			roomIndex = data.roomNumber;
			playerPosition = data.playerPosition;
			socket.disconnect();
			lastStepKOTH();
		}
	});

	return;
}

function lastStepKOTH(){
	if(roomIndex === -1){
		turnOffErrors();
		kothError.innerHTML = "All Rooms Are Currently Full";
		return;	
	}
	console.log("Room Index: " + roomIndex);
	console.log("Player Position " + playerPosition);

	sessionStorage.setItem("kothCurrentRoom", roomIndex);
	sessionStorage.setItem("kothCurrentPosition", playerPosition);

	window.location.href = "kingOfTheHill";
}

function goToCOTLB(e){

	let dataToSend = {
		username: myUsername,
		password: myPassword
	};

	if(myUsername === null){
		turnOffErrors();
		cotlbError.innerHTML = "Must Be Signed In To Play";
		return;
	}	

	let socket = io('/cotlbGame');

	socket.emit('findRoom', dataToSend, (data) => {
		if(data.error){
			turnOffErrors();
			if(data.errorType === 0){
				cotlbError.innerHTML = "Username Not Found, Cannot Play";
			}
			else if(data.errorType === 1){
				cotlbError.innerHTML = "Password Incorrect, Cannot Play";
			}
			else if(data.errorType === 2){
				cotlbError.innerHTML = "Game Mode Not Found";
			}
			socket.disconnect();
		}
		else{
			roomIndex = data.roomNumber;
			playerPosition = data.playerPosition;
			socket.disconnect();
			lastStepCOTLB();
		}

	});

	return;
}

function lastStepCOTLB(){
	if(roomIndex === -1){
		turnOffErrors();
		cotlbError.innerHTML = "All Rooms Are Currently Full";
		return;	
	}

	console.log("Room Index: " + roomIndex);
	console.log("Player Position " + playerPosition);

	sessionStorage.setItem("cotlbCurrentRoom", roomIndex);
	sessionStorage.setItem("cotlbCurrentPosition", playerPosition);
	window.location.href = "chargeOfTheLightBrigade";
}


function goToSpeed(e){

	let dataToSend = {
		username: myUsername,
		password: myPassword
	};

	if(myUsername === null){
		turnOffErrors();
		speedError.innerHTML = "Must Be Signed In To Play";
		return;
	}	

	let socket = io('/speedGame');
	

	socket.emit('findRoom', dataToSend, (data) => {

		if(data.error){

			turnOffErrors();
			if(data.errorType === 0){
				speedError.innerHTML = "Username Not Found, Cannot Play";
			}
			else if(data.errorType === 1){
				speedError.innerHTML = "Password Incorrect, Cannot Play";
			}
			else if(data.errorType === 2){
				speedError.innerHTML = "Game Mode Not Found";
			}
			
			socket.disconnect();
		}
		else{
			roomIndex = data.roomNumber;
			playerPosition = data.playerPosition;
			socket.disconnect();
			lastStepSpeed();
		}
	});

	return;
}

function lastStepSpeed(){

	if(roomIndex === -1){
		turnOffErrors();
		speedError.innerHTML = "All Rooms Are Currently Full";
		return;		
	}

	console.log("Room Index: " + roomIndex);
	console.log("Player Position " + playerPosition);
	
	sessionStorage.setItem("speedCurrentRoom", roomIndex);
	sessionStorage.setItem("speedCurrentPosition", playerPosition);

	window.location.href = "speedChess";
}

function turnOffErrors(){
	classicError.innerHTML = "";
	kothError.innerHTML = "";
	cotlbError.innerHTML = "";
	speedError.innerHTML = "";
}



