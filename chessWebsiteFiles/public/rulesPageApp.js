
let username = sessionStorage.getItem("username");
let fixedHeader = document.querySelector("#fixed-header");
let fixedHeaderMenu = document.querySelector("#fixed-header-menu");


if(username === null){
	createNotSignedInHeader();
}

else{	
	createSignedInHeader(username);
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












