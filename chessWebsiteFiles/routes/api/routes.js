const express = require('express');
const path = require('path');
const router = express.Router();
const mysql = require('mysql');


const database = require('../../dbConnection.js');
const userVariables = require('../../userVariables.js');
const db = database.database;
const databaseAccess = require('./databaseAccessFunctions.js');
const routeRateLimiter = require('./routesRateLimiter.js');
const roomFunctions = require('../../socketRoomFunctions.js');

router.use(routeRateLimiter.routeLimiter);


router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../../public', 'index.html'), (err) => {
		if(err){
			res.status(404).send("Unable to retrieve file");
			return;
		}
	});
});


router.get('/signUp', (req, res) => {
	res.sendFile(path.join(__dirname, '../../public', 'signUp.html'), (err) => {
		if(err){
			res.status(404).send("Unable to retrieve file");
			return;
		}
	});
});

router.get('/signUpSuccess', (req, res) => {
	res.sendFile(path.join(__dirname, '../../public', 'signUpSuccess.html'), (err) => {
		if(err){
			res.status(404).send("Unable to retrieve file");
			return;
		}
	});
});

router.get('/passwordUpdated', (req, res) => {
	res.sendFile(path.join(__dirname, '../../public', 'passwordUpdated.html'), (err) => {
		if(err){
			res.status(404).send("Unable to retrieve file");
			return;
		}
	});
});

router.get('/login', (req, res) => {
	res.sendFile(path.join(__dirname, '../../public', 'login.html'), (err) => {
		if(err){
			res.status(404).send("Unable to retrieve file");
			return;
		}
	});
});

router.get('/profile', (req, res) => {
	res.sendFile(path.join(__dirname, '../../public', 'playerProfile.html'), (err) => {
		if(err){
			res.status(404).send("Unable to retrieve file");
			return;
		}
	});
});

router.get('/gamePage', (req, res) => {
	res.sendFile(path.join(__dirname, '../../public', 'gamePage.html'), (err) => {
		if(err){
			res.status(404).send("Unable to retrieve file");
			return;
		}
	});
});

router.get('/leaderboards', (req, res) => {
	res.sendFile(path.join(__dirname, '../../public', 'leaderboards.html'), (err) => {
		if(err){
			res.status(404).send("Unable to retrieve file");
			return;
		}
	});
});

router.get('/rules', (req, res) => {
	res.sendFile(path.join(__dirname, '../../public', 'rulesPage.html'), (err) => {
		if(err){
			res.status(404).send("Unable to retrieve file");
			return;
		}
	});
});

router.get('/admin', (req, res) => {
	res.sendFile(path.join(__dirname, '../../public', 'adminSystem.html'), (err) => {
		if(err){
			res.status(404).send("Unable to retrieve file");
			return;
		}
	});
});

router.get('/classicChess', (req, res) => {
	res.sendFile(path.join(__dirname, '../../public/chessGame/classicChess', 'chessboard.html'), (err) => {
		if(err){
			res.status(404).send("Unable to retrieve file");
			return;
		}
	});
});

router.get('/kingOfTheHill', (req, res) => {
	res.sendFile(path.join(__dirname, '../../public/chessGame/kothChess', 'chessboardKOTH.html'), (err) => {
		if(err){
			res.status(404).send("Unable to retrieve file");
			return;
		}
	});
});

router.get('/chargeOfTheLightBrigade', (req, res) => {
	res.sendFile(path.join(__dirname, '../../public/chessGame/cotlbChess', 'chessboardCOTLB.html'), (err) => {
		if(err){
			res.status(404).send("Unable to retrieve file");
			return;
		}
	});
});

router.get('/speedChess', (req, res) => {
	res.sendFile(path.join(__dirname, '../../public/chessGame/speedChess', 'chessboardSpeed.html'), (err) => {
		if(err){
			res.status(404).send("Unable to retrieve file");
			return;
		}
	});
});

router.get('/replayPage', (req, res) => {
	res.sendFile(path.join(__dirname, '../../public/chessGame/replayChess', 'chessboardReplay.html'), (err) => {
		if(err){
			res.status(404).send("Unable to retrieve file");
			return;
		}
	});
});



router.post('/getEloScore', async (req, res) => {

	
	let returnMsg = {
		error: false,
		type: 0
	};

	if(checkReqBody(req) === false){
		returnMsg.error = true;
		res.status(200).json({msg: returnMsg});
		return;
	}

	let username = req.body.userName;
	let table = req.body.tableName;

	if(checkUsernameString(username) === false){
		returnMsg.error = true;
		returnMsg.type = 1;
		res.status(200).json({msg: returnMsg});
		return;
	}

	if(checkTableString(table) === false){
		returnMsg.error = true;
		returnMsg.type = 2;
		res.status(200).json({msg: returnMsg});
		return;
	}

	if(returnMsg.error === false){
		let result = await databaseAccess.getElo(table, username);

		if(result === -1){
			returnMsg.error = true;
			returnMsg.type = 1;
		}
		else{
			returnMsg.result = result;
		}
		
	}

	res.status(200).json({msg: returnMsg});
		
});


router.post('/profile/stats', async (req, res) => {

	//doesn't need password check

	let returnMsg = {
		error: true,
		result: {}
	};

	if(checkReqBody(req) === false){
		res.status(200).json({msg: returnMsg});
		return;
	}

	let username = req.body.userName;
	let table = req.body.table;

	if(checkUsernameString(username) === false){
		res.status(200).json({msg: returnMsg});
		return;
	}

	if(checkTableString(table) === false){
		res.status(200).json({msg: returnMsg});
		return;	
	}

	let result = await databaseAccess.getStats(table, username);

	if(result.found){
		returnMsg.result = result.result;
		returnMsg.error = false;
		res.status(200).json({msg: returnMsg});
		return;
	}

	res.status(200).json({msg: returnMsg});

});


router.post('/profile/passwordUpdate', async (req, res) => {
	//password check already here

	let returnMsg = {
		error: true,
		type: 0
	};


	if(checkReqBody(req) === false){
		res.status(200).json({msg: returnMsg});
		return;
	}

	let username = req.body.userName;
	let oldPassword = req.body.oldPass;
	let newPassword = req.body.newPass;


	if(checkUsernameString(username) === false){
		res.status(200).json({msg: returnMsg});
		return;
	}

	let usernamePasswordError = await checkUsernameAndPassword(username, oldPassword);

	if(usernamePasswordError === 0){
		res.status(200).json({msg: returnMsg});
		return;
	}
	else if(usernamePasswordError === 1){
		returnMsg.type = 1;
		res.status(200).json({msg: returnMsg});
		return;
	}
	else if(usernamePasswordError === 2){
		returnMsg.type = 3;
		res.status(200).json({msg: returnMsg});
		return;
	}
	else if(usernamePasswordError === -1){
		returnMsg.type = 4;
		res.status(200).json({msg: returnMsg});
		return;
	}

	if(checkPasswordString(newPassword) === false){
		returnMsg.type = 2;
		res.status(200).json({msg: returnMsg});
		return;
	}

	let result = await databaseAccess.updatePassword(username, newPassword, oldPassword);

	if(result.type === 1){
		returnMsg.error = false;
		res.status(200).json({msg: returnMsg});
		return;
	}

	returnMsg.type = 4;	
	res.status(200).json({msg: returnMsg});

});


router.post('/getAllPlayersStats', async(req, res) => {

	let returnMsg = {
		error: true,
		values: null
	};


	if(checkReqBody(req) === false){
		res.status(200).json({msg: returnMsg});
		return;
	}

	let table = req.body.gameMode;

	if(checkTableString(table) === false){
		res.status(200).json({msg: returnMsg});
		return;	
	}

	let result = await databaseAccess.getLeaderboardStats(table);
	returnMsg.values = result;
	returnMsg.error = false;

	res.status(200).json({msg: returnMsg});
});


router.post('/login', async (req, res) =>{
	
	let returnMsg = {
		error: true,
		type: 0
	};


	if(checkReqBody(req) === false){
		res.status(200).json({msg: returnMsg});
		return;
	}

	let username = req.body.userName;
	let password = req.body.passWord;

	if(username === undefined || username === null || typeof(username) !== 'string' || username.length === 0 || username.length > 12){
		res.status(200).json({msg: returnMsg});
		return;	
	}

	if(checkPasswordString(password) === false){
		returnMsg.type = 1;
		res.status(200).json({msg: returnMsg});
		return;
	}

	if(username.toLowerCase() === "admin" && password === userVariables.adminPassword){
		returnMsg.type = 2;
		returnMsg.error = false;
		res.status(200).json({msg: returnMsg});
		return;
	}

	if(username.toLowerCase() === "admin" && password !== userVariables.adminPassword){
		returnMsg.type = 2;
		res.status(200).json({msg: returnMsg});
		return;
	}

	let usernameFound = await databaseAccess.checkUsernameExists(username);

	if(usernameFound === -1){
		returnMsg.type = 5;
		res.status(200).json({msg: returnMsg});
		return;
	}
	
	if(usernameFound < 1){
		returnMsg.type = 3;
		res.status(200).json({msg: returnMsg});
		return;
	}

	let securityPassword = await databaseAccess.checkUserPassword(username);

	if(securityPassword === null){
		returnMsg.type = 5;
		res.status(200).json({msg: returnMsg});
		return;
	}
	
	if(securityPassword !== password){
		returnMsg.type = 4;
		res.status(200).json({msg: returnMsg});
		return;
	}
	
	returnMsg.error = false;
	returnMsg.type = 1;
	res.status(200).json({msg: returnMsg});
	return;
});


router.post('/signUp', async (req, res) =>{
	
	let returnMsg = {
		error: true,
		type: 0
	};
	
	if(checkReqBody(req) === false){
		res.status(200).json({msg: returnMsg});
		return;
	}
	
	let username = req.body.userName;
	let password = req.body.passWord;
	let email = req.body.eMail;

	if(username === undefined || username === null || typeof(username) !== 'string' || username.length === 0 || username.length > 12){
		console.log("Inside Signup: Bad Username String");
		res.status(200).json({msg: returnMsg});
		return;	
	}

	if(username.toLowerCase() ==='admin'){
		returnMsg.type = 1;
		res.status(200).json({msg: returnMsg});
		return;
	}

	if(checkPasswordString(password) === false){
		returnMsg.type = 2;
		res.status(200).json({msg: returnMsg});
		return;
	}

	if(checkPasswordString(email) === false){
		returnMsg.type = 3;
		res.status(200).json({msg: returnMsg});
		return;
	}
	
	let duplicateUsername = await databaseAccess.checkDuplicateUsername(username);

	if(duplicateUsername === -1){
		returnMsg.type = 6;
		res.status(200).json({msg: returnMsg});
		return;
	}
	
	if(duplicateUsername > 0){
		returnMsg.type = 4;
		res.status(200).json({msg: returnMsg});
		return;
	}

	let duplicateEmail = await databaseAccess.checkDuplicateEmail(email);

	if(duplicateEmail === -1){
		returnMsg.type = 6;
		res.status(200).json({msg: returnMsg});
		return;
	}
	
	if(duplicateEmail > 0){
		returnMsg.type = 5;
		res.status(200).json({msg: returnMsg});
		return;
	}

	let signUpResult = await databaseAccess.insertSignUp(username, password, email); //need to fix this

	if(signUpResult === -1){
		returnMsg.type = 6;
		res.status(200).json({msg: returnMsg});
		return;
	}

	returnMsg.error = false;
	res.status(200).json({msg: returnMsg});
	return;
	
});


router.post('/getSavedGame', async(req, res) => {

	let returnMsg = {
		error: true,
		type: 0,
		result: {}
	};

	if(checkReqBody(req) === false){
		res.status(200).json({msg: returnMsg});
		return;
	}

	let username = req.body.username;
	let password = req.body.playerPassword;
	let id = req.body.identity;

	let usernamePasswordError = await checkUsernameAndPassword(username, password);

	if(usernamePasswordError === -1){
		returnMsg.type = 4;
		res.status(200).json({msg: returnMsg});
		return;	
	}

	if(usernamePasswordError === 0){
		res.status(200).json({msg: returnMsg});
		return;	
	}
	else if(usernamePasswordError === 1 || usernamePasswordError === 2){
		returnMsg.type = 1;
		res.status(200).json({msg: returnMsg});
		return;	
	}

	if(checkID(id) === false){
		returnMsg.type = 2;
		res.status(200).json({msg: returnMsg});
		return;
	}

	let result = await databaseAccess.getSavedGameRecordWithID(username, id);

	if(result.type === -1){
		returnMsg.type = 4;
		res.status(200).json({msg: returnMsg});
		return;
	}

	if(result.type === 0){
		returnMsg.type = 3;
		res.status(200).json({msg: returnMsg});
		return;
	}

	else if(result.type === 1){
		returnMsg.error = false;
		returnMsg.result = result.result;
		res.status(200).json({msg: returnMsg});
		return;
	}

});


router.post('/getAllSavedGameIDs', async(req, res) => {

	let returnMsg = {
		rows: [],
		error: true
	};

	if(checkReqBody(req) === false){
		res.status(200).json({msg: returnMsg});
		return;
	}

	let username = req.body.user;
	let password = req.body.playerPassword;
	let mode = req.body.mode;

	let usernamePasswordError = await checkUsernameAndPassword(username, password);

	if(usernamePasswordError === -1){
		res.status(200).json({msg: returnMsg});
		return;
	}
	
	if(usernamePasswordError === 0){
		res.status(200).json({msg: returnMsg});
		return;	
	}
	else if(usernamePasswordError === 1 || usernamePasswordError === 2){
		res.status(200).json({msg: returnMsg});
		return;	
	}

	if(mode === undefined || mode === null || typeof(mode) !== 'string' || (mode === 'all' || mode === 'classic' || mode === 'koth' || mode === 'cotlb' || mode === 'speed') === false){
		mode = 'all';
	}

	let result = await databaseAccess.getAllGameIDs(username, mode);

	if(result.error){
		res.status(200).json({msg: returnMsg});
		return;
	}

	//returnMsg.rows = await databaseAccess.getAllGameIDs(username, mode);
	returnMsg.rows = result.rows;
	returnMsg.error = false;
	res.status(200).json({msg: returnMsg});
	
});


router.post('/getSavedGameAttributes', async(req, res) => {

	let returnMsg = {
		error: true,
		type: 0,
		result: {}
	};

	if(checkReqBody(req) === false){
		res.status(200).json({msg: returnMsg});
		return;
	}

	let username = req.body.user;
	let id = req.body.identity;
	let password = req.body.playerPassword;

	let usernamePasswordError = await checkUsernameAndPassword(username, password);

	if(usernamePasswordError === -1){
		returnMsg.type = 4;
		res.status(200).json({msg: returnMsg});
		return;
	}
	
	if(usernamePasswordError === 0){
		res.status(200).json({msg: returnMsg});
		return;	
	}
	else if(usernamePasswordError === 1 || usernamePasswordError === 2){
		returnMsg.type = 1;
		res.status(200).json({msg: returnMsg});
		return;	
	}

	if(checkID(id) === false){
		returnMsg.type = 2;
		res.status(200).json({msg: returnMsg});
		return;
	}

	let dataResult = await databaseAccess.getGameAttributes(username, id);

	if(dataResult.type === -1){
		returnMsg.type = 4;
		res.status(200).json({msg: returnMsg});
		return;
	}

	if(dataResult.type === 0){
		returnMsg.type = 3;
		res.status(200).json({msg: returnMsg});
		return;
	}
	else{
		returnMsg.error = false;
		returnMsg.result  = dataResult.result;
		res.status(200).json({msg: returnMsg});
		return;
	}
});


router.post('/deleteSavedGame', async(req, res) => {

	let returnMsg = {
		error: true,
		type: 0
	};

	if(checkReqBody(req) === false){
		res.status(200).json({msg: returnMsg});
		return;
	}

	let username = req.body.user;
	let password = req.body.playerPassword;
	let id = req.body.identity;
	
	let usernamePasswordError = await checkUsernameAndPassword(username, password);

	if(usernamePasswordError === -1){
		returnMsg.type = 4;
		res.status(200).json({msg: returnMsg});
		return;	
	}

	if(usernamePasswordError === 0){
		res.status(200).json({msg: returnMsg});
		return;	
	}
	else if(usernamePasswordError === 1 || usernamePasswordError === 2){
		returnMsg.type = 1;
		res.status(200).json({msg: returnMsg});
		return;	
	}

	if(checkID(id) === false){
		returnMsg.type = 2;
		res.status(200).json({msg: returnMsg});
		return;
	}

	let result = await databaseAccess.deleteGame(username, id);

	if(result.type === -1){
		returnMsg.type = 4;
		res.status(200).json({msg: returnMsg});
		return;
	}

	if(result.type === 0){
		returnMsg.type = 3;
		res.status(200).json({msg: returnMsg});
		return;
	}
	else if(result.type === 1){
		returnMsg.error = false;
		res.status(200).json({msg: returnMsg});
		return;
	}

});


router.post('/saveGame', async (req, res) =>{

	//need a mutex lock for checking number of games saved and then inserting
	//instead of mutex lock, could use a transaction to ensure count does not exceed limit, need to return to this issue
	//already has password check

	//errors:
	//type -1 - error accessing database
	//type 0 - no username
	//type 1 - username + password incorrect
	//type 2 - no name for saved game
	//type 3 - name for saved game is too long cap is 40
	//type 4 - no moves sent
	//type 5 - too many moves sent
	//type 6 - bad game mode
	//type 7 - bad side
	//type 8 - bad count value
	//type 9 - saved games limit already reached
	
	let returnMsg = {
		error: true,
		type: 0
	};

	if(checkReqBody(req) === false){
		res.status(200).json({msg: returnMsg});
		return;
	}

	let username = req.body.playerName;
	let password = req.body.playerPassword;
	let name = req.body.name;
	let gameMoves = req.body.gameMoves;
	let gameMode = req.body.gameMode;
	let opponentName = req.body.oppName;
	let side = req.body.side;
	let count = req.body.count;
	let result = req.body.result;
	let date = req.body.date;

	let usernamePasswordError = await checkUsernameAndPassword(username, password);

	if(usernamePasswordError === -1){
		returnMsg.type = -1;
		res.status(200).json({msg: returnMsg});
		return;
	}
	
	if(usernamePasswordError === 0){
		res.status(200).json({msg: returnMsg});
		return;	
	}
	else if(usernamePasswordError === 1 || usernamePasswordError === 2){
		returnMsg.type = 1;
		res.status(200).json({msg: returnMsg});
		return;	
	}

	if(name === undefined || name === null || typeof(name) !== 'string' || name.length === 0){
		returnMsg.type = 2;
		res.status(200).json({msg: returnMsg});
		return;	
	}

	if(name.length > 40){
		returnMsg.type = 3;
		res.status(200).json({msg: returnMsg});
		return;	
	}

	if(gameMoves === undefined || gameMoves === null || typeof(gameMoves) !== 'string' || gameMoves.length === 0){
		returnMsg.type = 4;
		res.status(200).json({msg: returnMsg});
		return;	
	}

	if(gameMoves.length > 870){
		returnMsg.type = 5;
		res.status(200).json({msg: returnMsg});
		return;
	}

	if(gameMode === undefined || gameMode === null || typeof(gameMode) !== 'string' || gameMode.length > 7 || (gameMode === 'classic' || gameMode === 'koth' || gameMode === 'cotlb' || gameMode === 'speed') === false){
		returnMsg.type = 6;
		res.status(200).json({msg: returnMsg});
		return;	
	}

	if(opponentName === undefined || opponentName === null || typeof(opponentName) !== 'string'|| opponentName.length === 0 || opponentName.length > 25){
		opponentName = "Not Available";
	}

	if(side === undefined || side === null || typeof(side) !== 'string' || side.length > 2 || (side === 'w' || side === 'b' || side === 'wQ' || side === 'wN' || side === 'bQ' || side === 'bN') === false){
		returnMsg.type = 7;
		res.status(200).json({msg: returnMsg});
		return;	
	}


	if(count === undefined || count === null || typeof(count) !== 'number' || count <= 0 || count > 200){
		returnMsg.type = 8;
		res.status(200).json({msg: returnMsg});
		return;	
	}

	if(result === undefined || result === null || typeof(result) !== 'string' || result.length === 0 || result.length > 50){
		result = "Not Available";
	}

	if(date === undefined || date === null || typeof(date) !== 'string' || date.length === 0 || date.length > 50){
		date = 'Not Available';
	}

	let insertSaveGameResult = await databaseAccess.insertSaveGame(username, opponentName, side, gameMoves, name, gameMode, count, date, result, userVariables.maxNumberOfSavedGames);

	if(insertSaveGameResult === -1){
		returnMsg.type = -1;
		res.status(200).json({msg: returnMsg});
		return;
	}
	else if(insertSaveGameResult === 0){
		returnMsg.type = 9;
		res.status(200).json({msg: returnMsg});
		return;
	}
	else if(insertSaveGameResult === 1){
		returnMsg.error = false;
		res.status(200).json({msg: returnMsg});
		return;
	}
	
});


function checkReqBody(req){

	if(req === undefined || req === null || typeof(req) !== 'object'){
		console.log("Bad Req Body");
		return false;
	}
	if(req.body === undefined || req.body === null || typeof(req.body) !== 'object'){
		console.log("Bad Req Body");
		return false;
	}
	return true;
}

function checkUsernameString(username){

	if(username === undefined || username === null || typeof(username) !== 'string' || username.length === 0 || username.length > 12 || username.toLowerCase() === "admin"){
		console.log("Bad Username String");
		return false;
	}

	return true;
}

function checkPasswordString(password){

	if(password === undefined || password === null || typeof(password) !== 'string' || password.length === 0 || password.length > 40){
		console.log("Bad Password String");
		return false;	
	}

	return true;
}

function checkTableString(table){

	if(table === undefined || table === null || typeof(table) !== 'string' || table.length === 0 || table.length > 50){
		console.log("Bad Table String");
		return false;	
	}

	if( (table === "classicstats" || table === "kothstats" || table === "cotlbstats" || table === "speedstats" ) === false){
		console.log("Bad Table String");
		return false;	
	}

	return true;
}

function checkID(id){

	if(id === undefined || id === null || typeof(id) !== 'number'){
		console.log("Bad id value");
		return false;
	}

	return true;
}

async function checkUsernameAndPassword(username, password){

	//-1 database error
	//0 bad username
	//1 bad password format
	//2 username and password combo incorrect
	//3 no username/password error

	if(checkUsernameString(username) === false){
		return 0;
	}

	let usernameFound = await databaseAccess.checkUsernameExists(username);

	if(usernameFound === -1){
		return -1;
	}

	if(usernameFound < 1){
		console.log("Username Not Found");
		return 0;	
	}

	if(checkPasswordString(password) === false){
		return 1;
	}

	let securityPassword = await databaseAccess.checkUserPassword(username);

	if(securityPassword === null){
		return -1;
	}

	if(password !== securityPassword){
		console.log("Password Incorrect For Username");
		return 2;	
	}

	return 3;

}


function waster(){
	return new Promise((resolve, reject) => {

		console.log("About to wait 10 secs");

			setTimeout(
				() => { resolve(1);}, 
				10000
			);
		console.log("Waited 5 secs");
	});
}


module.exports = router;