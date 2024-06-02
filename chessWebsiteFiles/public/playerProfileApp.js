


let selectClassic = document.querySelector("#selectClassic");
let selectKOTH = document.querySelector("#selectKOTH");
let selectCOTLB = document.querySelector("#selectCOTLB");
let selectSpeed = document.querySelector("#selectSpeed");

selectClassic.addEventListener("click", fetchClassicStats);
selectKOTH.addEventListener("click", fetchKOTHStats);
selectCOTLB.addEventListener("click", fetchCOTLBStats);
selectSpeed.addEventListener("click", fetchSpeedStats);

let tableSelected = document.querySelector("#tableSelected");
tableSelected.innerHTML = "Classic Chess Stats";

let winStat = document.querySelector('#winStat');
let lossStat = document.querySelector('#lossStat');
let stalemateStat = document.querySelector('#stalemateStat');
let drawStat = document.querySelector('#drawStat');
let ratioStat = document.querySelector("#ratioStat");


let username = sessionStorage.getItem("username");
let usernameHeader = document.querySelector("#username-header");

let oldPassword = document.querySelector("#old-password");
let newPassword = document.querySelector("#new-password");
let confirmPassword = document.querySelector("#confirm-newPassword");
let passwordChangeBtn = document.querySelector("#passwordChangeBtn");

let oldPasswordError = document.querySelector("#oldPassError");
let newPasswordError = document.querySelector("#newPassError");
let confirmPasswordError = document.querySelector("#confirmNewPassError");

let fixedHeader = document.querySelector("#fixed-header");
let fixedHeaderMenu = document.querySelector("#fixed-header-menu");

let dropList = document.getElementById("dropList");
let selectGameModeBtn = document.getElementById("select-game-mode-btn");
selectGameModeBtn.addEventListener("click", dropmenu);

let oldShowBtn = document.querySelector("#oldShowBtn");
let oldShowBtnText = document.querySelector("#oldShowBtn-text");
let newShowBtn = document.querySelector("#newShowBtn");
let newShowBtnText = document.querySelector("#newShowBtn-text");

oldShowBtn.addEventListener("click", showOldPassword);
newShowBtn.addEventListener("click", showNewPassword);

passwordChangeBtn.addEventListener("click", changePassword);

if(username === null){
	createNotSignedInHeader();
	winStat.innerHTML = "Not Availiable";
	lossStat.innerHTML = "Not Availiable";
	stalemateStat.innerHTML = "Not Availiable";
	drawStat.innerHTML = "Not Availiable";
	ratioStat.innerHTML = "Not Availiable";
}

else{	
	createSignedInHeader(username);
	if(usernameHeader.firstChild){
		usernameHeader.removeChild(usernameHeader.lastChild);
	}
	usernameHeader.append(document.createTextNode(username));
	selectClassic.classList.add("bg-blue-400");
	fetchCheck("classicstats");
}


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

function unHighlight(){

	if(selectClassic.classList.contains("bg-blue-400")){
		selectClassic.classList.remove("bg-blue-400");
	}
	if(selectKOTH.classList.contains("bg-blue-400")){
		selectKOTH.classList.remove("bg-blue-400");
	}
	if(selectCOTLB.classList.contains("bg-blue-400")){
		selectCOTLB.classList.remove("bg-blue-400");
	}
	if(selectSpeed.classList.contains("bg-blue-400")){
		selectSpeed.classList.remove("bg-blue-400");
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

function fetchClassicStats(){
	unHighlight()
	selectClassic.classList.add("bg-blue-400");
	dropmenu();
	fetchCheck("classicstats");
	
}

function fetchKOTHStats(){
	unHighlight()
	selectKOTH.classList.add("bg-blue-400");
	dropmenu();
	fetchCheck("kothstats");
}

function fetchCOTLBStats(){
	unHighlight()
	selectCOTLB.classList.add("bg-blue-400");
	dropmenu();
	fetchCheck("cotlbstats");
}

function fetchSpeedStats(){
	unHighlight()
	selectSpeed.classList.add("bg-blue-400");
	dropmenu();
	fetchCheck("speedstats");
}

async function fetchCheck(table){


	if(table === 'classicstats'){
		tableSelected.innerHTML = "Classic Chess";
	}
	else if(table === 'kothstats'){
		tableSelected.innerHTML = "King Of The Hill";
	}
	else if(table === 'cotlbstats'){
		tableSelected.innerHTML = "Charge Of The Light Brigade";
	}
	else if(table === 'speedstats'){
		tableSelected.innerHTML = "Speed Chess";
	}

	if(username === null){
		return;
	}

	
	let credentials = {
		userName: null,
		table: null
	};

	credentials.userName = username;
	credentials.table = table;

	let fetchResult;

  	await fetch('/home/profile/stats', 
  		{
			method: 'POST',
			headers:{		
				'Content-Type': 'application/json'
			},
		
			body: JSON.stringify(credentials)
		}
	)
	.then((res) => {
		
		if(res.ok === false){
			console.log("About to throw error");
			fetchResult = {error: true};
			throw Error(res.statusText);
		}
		
		return res.json();
	}
	)
	.then((data) => {
		console.log(data.msg);
		fetchResult = data.msg;
	})
	.catch(function(error){
		console.log('Request failed doing stuff', error);
		return;
	});

	console.log("Fetch Complete");
	console.log(fetchResult);

	if(fetchResult.error === false){

		winStat.innerHTML = fetchResult.result.wins;
		lossStat.innerHTML = fetchResult.result.losses;
		stalemateStat.innerHTML = fetchResult.result.stalemates;
		drawStat.innerHTML = fetchResult.result.draws;

		if(fetchResult.result.losses === 0){
			ratioStat.innerHTML = fetchResult.result.wins.toFixed(2);
		}
		else{
			ratioStat.innerHTML = (fetchResult.result.wins/fetchResult.result.losses).toFixed(2);
		}
	}
	else{
		winStat.innerHTML = "Not Availiable";
		lossStat.innerHTML = "Not Availiable";
		stalemateStat.innerHTML = "Not Availiable";
		drawStat.innerHTML = "Not Availiable";
		ratioStat.innerHTML = "Not Availiable";
		return;
	}

}


function changePassword(e){

	oldPasswordError.innerHTML = "";
	newPasswordError.innerHTML = "";
	confirmPasswordError.innerHTML = "";

	if(username === null){
		oldPasswordError.innerHTML = "Not Signed In";
		return;
	}

	if(oldPassword.value.length === 0){
		oldPasswordError.innerHTML = "Must Enter Current Password";
		return;
	}

	if(oldPassword.value.length > 40){
		oldPasswordError.innerHTML = "Max: 40 Characters";
		return;
	}

	if(newPassword.value.length === 0){
		newPasswordError.innerHTML = "New Password Not Entered";
		return;
	}

	if(newPassword.value.length > 40){
		newPasswordError.innerHTML = "Max: 40 Characters";
		return;
	}
	
	if(confirmPassword.value.length === 0){
		confirmPasswordError.innerHTML = "Must Confirm New Password";
		return;
	}

	if(confirmPassword.value !== newPassword.value){
		confirmPasswordError.innerHTML = "Doesn't Match New Password";
		return;
	}
	
	beginPasswordUpdate(username, oldPassword.value, newPassword.value);
	

}

async function beginPasswordUpdate(user, checkPassword, updatePassword){

	let status = await finishPasswordUpdate(user, checkPassword, updatePassword);

	if(status.error){

		if(status.type === 0){
			oldPasswordError.innerHTML = "Username Not Found";
		}
		else if(status.type === 1){
			oldPasswordError.innerHTML = "Current Password Not Found";
		}
		else if(status.type === 2){
			newPasswordError.innerHTML = "New Password Not Found";
		}
		else if(status.type === 3){
			oldPasswordError.innerHTML = "Password Incorrect";
		}
		else if(status.type === 4){
			oldPasswordError.innerHTML = "Error Updating Database";
		}
		else if(status.type === 5){
			oldPasswordError.innerHTML = "Request Not Processed";
		}

		return;
	}

	if(status.error === false){
		sessionStorage.removeItem("username");
		sessionStorage.removeItem("password");
		window.location.href = "passwordUpdated";
	}


}

async function finishPasswordUpdate(user, checkPassword, updatePassword){

	let fetchResult;

	let data = {
		userName: user,
		oldPass: checkPassword,
		newPass: updatePassword
	};

  await fetch('/home/profile/passwordUpdate', 
  	{
		method: 'POST',
		headers:{
			
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)

		}
	)
	.then((res) => {
		if(res.ok === false){
			console.log("About to throw error");
			fetchResult = {error: true, type: 5};
			throw Error(res.statusText);
		}
		return res.json();
	}
	)
	.then((data) => {
		console.log(data.msg);
		fetchResult = data.msg;
	})
	.catch(function(error){
		console.log('Request failed doing stuff', error);
		fetchResult = {error: true, type: 5};
	});

	console.log("POST Request Complete");


	return fetchResult;

}

function showOldPassword(e){
	let current = oldPassword.getAttribute("type");

	if(current === "password"){
		oldPassword.setAttribute("type", "text");
		oldShowBtnText.innerText = "Hide";
	}
	else if(current === "text"){
		oldPassword.setAttribute("type", "password");
		oldShowBtnText.innerText = "Show";
	}
}

function showNewPassword(e){
	let current = newPassword.getAttribute("type");

	if(current === "password"){
		console.log("Changing to text");
		newPassword.setAttribute("type", "text");
		confirmPassword.setAttribute("type", "text");
		newShowBtnText.innerText = "Hide";
	}
	else if(current === "text"){
		console.log("Changing to password");
		newPassword.setAttribute("type", "password");
		confirmPassword.setAttribute("type", "password");
		newShowBtnText.innerText = "Show";
	}	
}