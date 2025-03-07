

let signUpButton = document.querySelector('#signUpBtn');

let username = document.querySelector('#username');
let password = document.querySelector('#password');
let confirmPass = document.querySelector('#confirmPass');
let email = document.querySelector('#email');

let usernameError = document.querySelector('#usernameError');
let passwordError = document.querySelector('#passwordError');
let confirmPassError = document.querySelector('#confirmPassError');
let emailError = document.querySelector('#emailError');

let showBtn = document.querySelector("#showBtn");
let showBtnText = document.querySelector("#showBtn-text");

showBtn.addEventListener('click', showPassword);
signUpButton.addEventListener('click', signUpEvent);

function showPassword(e){
	let current = password.getAttribute("type");

	if(current === "password"){
		console.log("Changing to text");
		password.setAttribute("type", "text");
		confirmPass.setAttribute("type", "text");
		showBtnText.innerText = "Hide";
	}
	else if(current === "text"){
		console.log("Changing to password");
		password.setAttribute("type", "password");
		confirmPass.setAttribute("type", "password");
		showBtnText.innerText = "Show";
	}	
}


function signUpEvent(e){

	e.preventDefault();

	let uerror = false;
	let perror = false;
	let cperror = false;
	let eerror = false;

	if(username.value.length === 0){
		uerror = true;
		console.log("Must Enter Username");
		usernameError.innerHTML = "Must Enter Username";
	}

	if(username.value.length > 12){
		uerror = true;
		usernameError.innerHTML = "Max: 12 Characters";
	}

	
	if(username.value.toLowerCase() === 'admin'){
		uerror = true;
		usernameError.innerHTML = "Cannot Use 'Admin' As Username";
	}
	

	if(uerror === false){
		usernameError.innerHTML = "";
	}
	
	if(password.value.length === 0){
		perror = true;
		passwordError.innerHTML = "Must Enter Password";
	}

	if(password.value.length > 40){
		perror = true;
		passwordError.innerHTML = "Max: 40 Characters";
	}

	if(perror === false){
		passwordError.innerHTML = "";
	}

	if( (!perror) && (password.value !== confirmPass.value)){
		cperror = true;
		confirmPassError.innerHTML = "Doesn't Match Password";
	}
	else{
		confirmPassError.innerHTML = "";
	}

	if(email.value.length === 0){
		eerror = true;
		emailError.innerHTML = "Must Enter Email";
	}

	if(email.value.length > 40){
		eerror = true;
		emailError.innerHTML = "Max: 40 Characters";
	}
	
	if(eerror === false){
		emailError.innerHTML = "";
	}

	if( (!uerror) && (!perror) && (!cperror) && (!eerror) ){
		console.log("Successfully Passed Stage 1");
		fetchCheck();
		
	}

}

async function fetchCheck(){

	let credentials = {
		userName: null,
		passWord: null,
		eMail: null
	};

	let fetchResult;
	
	credentials.userName = username.value;
	credentials.passWord = password.value;
	credentials.eMail = email.value;

	await fetch('/home/signUp', 
		{
			method: 'POST',
			headers:{
				'Content-Type': 'application/json'
			},

			body: JSON.stringify(credentials)
		}
		).then(
			(res) => {
				if(res.ok === false){
					console.log("About to throw error");
					fetchResult = {error: true, type: 6};
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
		return;
	});

	console.log("After fetch");

	if(fetchResult.error){
		if(fetchResult.type === 0){
			usernameError.innerHTML = "Username Incorrectly Formatted";
			return;
		}
		else if(fetchResult.type === 1){
			usernameError.innerHTML = "Cannot Use 'Admin' As Username";
			return;
		}
		else if(fetchResult.type === 2){
			passwordError.innerHTML = "Password Incorrectly Formatted";
			return;
		}
		else if(fetchResult.type === 3){
			emailError.innerHTML = "Email Incorrectly Formatted";
			return;
		}
		else if(fetchResult.type === 4){
			usernameError.innerHTML = "Username Already In Use";
			return;
		}
		else if(fetchResult.type === 5){
			emailError.innerHTML = "Email Already In Use";
			return;
		}
		else if(fetchResult.type === 6){
			usernameError.innerHTML = "Request Not Processed";
		}
	}
	
	if(fetchResult.error === false){
		finishSignUp();
	}
	
}

function finishSignUp(){
	window.location.href = "../home/signUpSuccess";
}

