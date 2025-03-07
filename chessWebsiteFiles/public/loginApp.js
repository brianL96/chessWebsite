

let loginBtn = document.querySelector("#loginBtn");
let username = document.querySelector('#username');
let password = document.querySelector('#password');

let usernameError = document.querySelector('#usernameError');
let passwordError = document.querySelector('#passwordError');

let showBtn = document.querySelector("#showBtn");
let showBtnText = document.querySelector("#showBtn-text");

showBtn.addEventListener('click', showHidePassword);

loginBtn.addEventListener('click', loginEvent);

function showHidePassword(e){

	let current = password.getAttribute("type");

	if(current === "password"){
		password.setAttribute("type", "text");
		showBtnText.innerText = "Hide";
	}
	else if(current === "text"){
		password.setAttribute("type", "password");
		showBtnText.innerText = "Show";
	}
}

function loginEvent(e){

	e.preventDefault();

	let ucorrect = true;
	let pcorrect = true;

	if(username.value.length === 0){
		usernameError.innerHTML = "Username Not Entered";
		ucorrect = false;
	}

	if(username.value.length > 12){
		usernameError.innerHTML = "Max: 12 Characters";
		ucorrect = false
	}

	if(ucorrect){
		usernameError.innerHTML = "";
	}

	if(password.value.length === 0){
		passwordError.innerHTML = "Password Not Entered";
		pcorrect = false;
	}

	if(password.value.length > 40){
		passwordError.innerHTML = "Max: 40 Characters";
		pcorrect = false;
	}

	if(pcorrect){
		passwordError.innerHTML = "";
	}
	
	if(ucorrect === false || pcorrect === false){
		return;
	}
	
	console.log(username.value);
	console.log(password.value);

	fetchCheck();

}


async function fetchCheck(){

	let credentials = {
		userName: null,
		passWord: null
	};

	let fetchResult;
	
	credentials.userName = username.value;
	credentials.passWord = password.value;
	
	await fetch('/home/login', 

		{
			method: 'POST',
			headers:{
			
				'Content-Type': 'application/json'
			},

			body: JSON.stringify(credentials)
		}
	).then((res) => {
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
		return;
	});

	console.log("After fetch");
	
	if(fetchResult.error){

		if(fetchResult.type === 0){
			usernameError.innerHTML = "Username Incorrectly Formatted";
		}
		else if(fetchResult.type === 1){
			passwordError.innerHTML = "Password Incorrectly Formatted";
		}
		else if(fetchResult.type === 2){
			passwordError.innerHTML = "Password Incorrect";
		}
		else if(fetchResult.type === 3){
			usernameError.innerHTML = "Username Not Found";
		}
		else if(fetchResult.type === 4){
			passwordError.innerHTML = "Password Incorrect";
		}
		else if(fetchResult.type === 5){
			usernameError.innerHTML = "Request Not Processed";
		}
		
		return;
	}

	else if(fetchResult.error === false){
		finishSignUp(fetchResult);
	}
	
}

function finishSignUp(fetchResult){

	if(fetchResult.type === 2){
		sessionStorage.setItem("guestpassword", password.value);
		window.location.href = "../home/admin";
	}
	else if(fetchResult.type === 1){
		sessionStorage.setItem("username", username.value);
		sessionStorage.setItem("password", password.value);
		window.location.href = "../home";	
	}
	
}








