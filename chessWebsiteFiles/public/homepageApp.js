

let imageURLs = [ 
	"../images/classicGame.png",
	"../images/kothGame.png",
	"../images/saveGameModal.png",
	"../images/replay.png",
	"../images/leaderboards.png",
	"../images/adminTop.png",
	"../images/adminBottom.png",
];

let imagesIndex = 0;
let cycleCountDown = window.setInterval(cyclePicture, 6000);
let mainPicture = document.querySelector("#main-image");

let frontCircle1 = document.querySelector("#f-circle-1");
let frontCircle2 = document.querySelector("#f-circle-2");
let frontCircle3 = document.querySelector("#f-circle-3");
let frontCircle4 = document.querySelector("#f-circle-4");
let frontCircle5 = document.querySelector("#f-circle-5");
let frontCircle6 = document.querySelector("#f-circle-6");
let frontCircle7 = document.querySelector("#f-circle-7");
let rect1 = document.querySelector("#rect-1");
let rect2 = document.querySelector("#rect-2");
let rect3 = document.querySelector("#rect-3");
let rect4 = document.querySelector("#rect-4");
let rect5 = document.querySelector("#rect-5");
let rect6 = document.querySelector("#rect-6");
let rect7 = document.querySelector("#rect-7");

let frontCircleArray = new Array();

frontCircleArray.push(frontCircle1);
frontCircleArray.push(frontCircle2);
frontCircleArray.push(frontCircle3);
frontCircleArray.push(frontCircle4);
frontCircleArray.push(frontCircle5);
frontCircleArray.push(frontCircle6);
frontCircleArray.push(frontCircle7);

rect1.addEventListener("click", manualSwitch);
rect2.addEventListener("click", manualSwitch);
rect3.addEventListener("click", manualSwitch);
rect4.addEventListener("click", manualSwitch);
rect5.addEventListener("click", manualSwitch);
rect6.addEventListener("click", manualSwitch);
rect7.addEventListener("click", manualSwitch);

let helloMessage = document.querySelector("#welcome-Sign");
let fixedHeaderMenuTop = document.querySelector("#fixed-header-menu-top");
let myUsername = sessionStorage.getItem("username");

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

	loginBtn.id = "header-login-btn";
	loginBtn.type = "submit";
	loginBtn.value = "Log In";
	loginBtn.className = "w-28 h-full bg-green-600 text-white rounded cursor-pointer shadow hover:bg-green-500 text-lg md:text-xl";

	signupBtn.id = "header-signup-btn";
	signupBtn.type = "submit";
	signupBtn.value = "Sign Up";
	signupBtn.className = "w-28 h-full bg-green-600 text-white rounded cursor-pointer shadow hover:bg-green-500 text-lg md:text-xl";

	loginBtn.addEventListener("click", goToLogin);
	signupBtn.addEventListener("click", goToSignUp);

	buttonDiv.className = "flex flex-row justify-around w-70 lg:w-1/4 h-full items-center";
	buttonDiv.appendChild(loginBtn);
	buttonDiv.appendChild(signupBtn);

	fixedHeaderMenuTop.appendChild(buttonDiv);

}

function createSignedInHeader(user){
	
	let signoutBtn = document.createElement("input");
	let signoutBtnContainer = document.createElement("div");

	helloMessage.innerText = "Welcome " + myUsername;

	signoutBtn.id  = "header-signout-btn";
	signoutBtn.type = "submit";
	signoutBtn.value = "Sign Out";
	signoutBtn.className = "w-24 lg:w-28 h-full bg-green-600 text-white text-lg md:text-xl rounded cursor-pointer shadow hover:bg-green-500";
	signoutBtn.addEventListener("click", signOut);

	signoutBtnContainer.className = "flex flex-col justify-center h-full mr-4";
	signoutBtnContainer.appendChild(signoutBtn);

	fixedHeaderMenuTop.appendChild(signoutBtnContainer);

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

function clearCycleCountdown(){
	clearInterval(cycleCountDown);
}

function startCycleCountdown(){
	cycleCountDown = window.setInterval(cyclePicture, 6000);
}

function manualSwitch(e){

	let value = parseInt(e.target.getAttribute("value"));
	clearCycleCountdown();
	clearCircleAnimation(frontCircleArray[imagesIndex]);

	let reflowNeeded = false;
	let transitionRight = true;
	if(imagesIndex === (value)){
		reflowNeeded = true;
	}

	if((value < imagesIndex) && ((value === 0 && imagesIndex === imageURLs.length - 1) === false)){
		transitionRight = false;
	}

	if(value === 0){
		console.log("Clicked 0");
		imagesIndex = 0;
	}
	else if(value === 1){
		console.log("Clicked 1");
		imagesIndex = 1;
	}
	else if(value === 2){
		console.log("Clicked 2");
		imagesIndex = 2;
	}
	else if(value === 3){
		console.log("Clicked 3");
		imagesIndex = 3;
	}
	else if(value === 4){
		console.log("Clicked 4");
		imagesIndex = 4;
	}
	else if(value === 5){
		console.log("Clicked 5");
		imagesIndex = 5;
	}
	else if(value === 6){
		console.log("Clicked 6");
		imagesIndex = 6;
	}

	if(reflowNeeded === false){
		removeSlideAnimation();
		mainPicture.src = imageURLs[imagesIndex];
		addTransitionAnimation(transitionRight);
		
	}
	else if(reflowNeeded){
		mainPicture.src = imageURLs[imagesIndex];
		console.log("Offset requested");
		console.log(frontCircleArray[imagesIndex].getBoundingClientRect());
	}

	startCircleAnimation(frontCircleArray[imagesIndex]);
	startCycleCountdown();

}

function clearCircleAnimation(currentCircleAnimating){
	
	if(currentCircleAnimating === undefined || currentCircleAnimating === null){
		return;
	}

	currentCircleAnimating.style.stroke = "none";
	currentCircleAnimating.style.animationName = "none";
	currentCircleAnimating.style.setProperty("stroke-dashoffset","360");
	
}

function startCircleAnimation(newCircleAnimating){
	
	if(newCircleAnimating === undefined || newCircleAnimating === null){
		return;
	}

	newCircleAnimating.style.setProperty("stroke-dashoffset","0");
	newCircleAnimating.style.stroke = "black";
	newCircleAnimating.style.animationName = "fill-circle";
	newCircleAnimating.style.animationPlayState = "initial";
	
}


function cyclePicture(){

	clearCircleAnimation(frontCircleArray[imagesIndex]);
	imagesIndex++;
	if(imagesIndex >= imageURLs.length){
		imagesIndex = 0;
	}
	removeSlideAnimation();
	mainPicture.src = imageURLs[imagesIndex];
	addTransitionAnimation(true);
	startCircleAnimation(frontCircleArray[imagesIndex]);
}

function removeSlideAnimation(){
	mainPicture.style.animationName = "none";
	void mainPicture.offsetWidth;

}

function addTransitionAnimation(transitionRight){
	mainPicture.style.transform = "translateX(0)";
	if(transitionRight){
		mainPicture.style.animationName = "transition-from-right";
	}
	else{
		mainPicture.style.animationName = "transition-from-left";
	}
}

function waster(){
	return new Promise((resolve, reject) => {

		console.log("About to wait 7 secs");

			setTimeout(
				() => { resolve(1);}, 
				7000
			);
		
	});
}

