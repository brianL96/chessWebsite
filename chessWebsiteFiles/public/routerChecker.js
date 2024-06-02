
let getEloScore = '/home/getEloScore';
let stats = '/home/profile/stats';
let passwordUpdate = '/home/profile/passwordUpdate';
let getAllPlayersStats = '/home/getAllPlayersStats';
let login = '/home/login';
let signUp = '/home/signUp';
let getSavedGame = '/home/getSavedGame';
let getAllSavedGameIDs = '/home/getAllSavedGameIDs';
let getSavedGameAttributes = '/home/getSavedGameAttributes';
let deleteSavedGame = '/home/deleteSavedGame';
let saveGame = '/home/saveGame';

async function checkGetEloScore(){

    let bodyToSend = {
        userName: 'B1',
        tableName: 'classicstats'
    };

    let check = await fetchCheck2(getEloScore, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === false && check.result.type === 0){
		console.log("getEloScore Test 1 Passed");
	}
	else{
		console.log("getEloScore Test 1 Failed");
	}

	bodyToSend.userName = undefined;

	check = await fetchCheck2(getEloScore, JSON.stringify(bodyToSend));

	if(check.result.error === true && check.result.type === 1){
		console.log("getEloScore Test 2 Passed");
	}
	else{
		console.log("getEloScore Test 2 Failed");
	}

	bodyToSend.userName = "shamIser";

	check = await fetchCheck2(getEloScore, JSON.stringify(bodyToSend));

	if(check.result.error === true && check.result.type === 1){
		console.log("getEloScore Test 3 Passed");
	}
	else{
		console.log("getEloScore Test 3 Failed");
	}

	bodyToSend.tableName = undefined;

	check = await fetchCheck2(getEloScore, JSON.stringify(bodyToSend));

	if(check.result.error === true && check.result.type === 2){
		console.log("getEloScore Test 4 Passed");
	}
	else{
		console.log("getEloScore Test 4 Failed");
	}

	bodyToSend.tableName = "badstats";

	check = await fetchCheck2(getEloScore, JSON.stringify(bodyToSend));

	if(check.result.error === true && check.result.type === 2){
		console.log("getEloScore Test 5 Passed");
	}
	else{
		console.log("getEloScore Test 5 Failed");
	}

	bodyToSend.tableName = "kothstats";

	check = await fetchCheck2(getEloScore, JSON.stringify(bodyToSend));

	if(check.result.error === true && check.result.type === 1){
		console.log("getEloScore Test 6 Passed");
	}
	else{
		console.log("getEloScore Test 6 Failed");
	}

	bodyToSend.userName = "B1";

	check = await fetchCheck2(getEloScore, JSON.stringify(bodyToSend));

	if(check.result.error === false && check.result.type === 0){
		console.log("getEloScore Test 7 Passed");
	}
	else{
		console.log("getEloScore Test 7 Failed");
	}

   
}

async function checkProfileStats(){

	let bodyToSend = {
        userName: 'B1',
        table: 'classicstats'
    };

    let check = await fetchCheck2(stats, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === false){
		console.log("profileStats Test 1 Passed");
	}
	else{
		console.log("profileStats Test 1 Failed");
	}


	bodyToSend.userName = null;

	check = await fetchCheck2(stats, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true){
		console.log("profileStats Test 2 Passed");
	}
	else{
		console.log("profileStats Test 2 Failed");
	}

	bodyToSend.userName = "shamIser";

	check = await fetchCheck2(stats, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true){
		console.log("profileStats Test 3 Passed");
	}
	else{
		console.log("profileStats Test 3 Failed");
	}

	bodyToSend.userName = "B1";
	bodyToSend.table = "nostats";

	check = await fetchCheck2(stats, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true){
		console.log("profileStats Test 4 Passed");
	}
	else{
		console.log("profileStats Test 4 Failed");
	}

	
	bodyToSend.table = "cotlbstats";

	check = await fetchCheck2(stats, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === false){
		console.log("profileStats Test 5 Passed");
	}
	else{
		console.log("profileStats Test 5 Failed");
	}

}

async function checkPasswordUpdate(){

	let bodyToSend = {
        userName: "B1",
		oldPass: "777",
		newPass: "774"
    };

	
    let check = await fetchCheck2(passwordUpdate, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === false && check.result.type === 0){
		console.log("passwordUpdate Test 1 Passed");
	}
	else{
		console.log("passwordUpdate Test 1 Failed");
	}

	bodyToSend.userName = "StANLeY33";
	

	check = await fetchCheck2(passwordUpdate, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 0){
		console.log("passwordUpdate Test 2 Passed");
	}
	else{
		console.log("passwordUpdate Test 2 Failed");
	}

	bodyToSend.userName = undefined;
	
	check = await fetchCheck2(passwordUpdate, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 0){
		console.log("passwordUpdate Test 3 Passed");
	}
	else{
		console.log("passwordUpdate Test 3 Failed");
	}
	
	bodyToSend.userName = "B1";
	bodyToSend.oldPass = null
	
	check = await fetchCheck2(passwordUpdate, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 1){
		console.log("passwordUpdate Test 4 Passed");
	}
	else{
		console.log("passwordUpdate Test 4 Failed");
	}

	bodyToSend.userName = "B1";
	bodyToSend.oldPass = "774";
	bodyToSend.newPass = "";
	
	check = await fetchCheck2(passwordUpdate, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 2){
		console.log("passwordUpdate Test 5 Passed");
	}
	else{
		console.log("passwordUpdate Test 5 Failed");
	}

	bodyToSend.newPass = null;
	
	check = await fetchCheck2(passwordUpdate, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 2){
		console.log("passwordUpdate Test 6 Passed");
	}
	else{
		console.log("passwordUpdate Test 6 Failed");
	}

	bodyToSend.oldPass = "777";
	bodyToSend.newPass = null;
	
	check = await fetchCheck2(passwordUpdate, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 3){
		console.log("passwordUpdate Test 7 Passed");
	}
	else{
		console.log("passwordUpdate Test 7 Failed");
	}

	bodyToSend.userName = "B1";
	bodyToSend.oldPass = "774";
	bodyToSend.newPass = "777";

	check = await fetchCheck2(passwordUpdate, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === false && check.result.type === 0){
		console.log("passwordUpdate Test 8 Passed");
	}
	else{
		console.log("passwordUpdate Test 8 Failed");
	}
	

}

async function checkGetAllPlayersStats(){

	let bodyToSend = {
        gameMode: 'classicstats'
    };

    let check = await fetchCheck2(getAllPlayersStats, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === false){
		console.log("getAllPlayersStats Test 1 Passed");
	}
	else{
		console.log("getAllPlayersStats Test 1 Failed");
	}

	bodyToSend.gameMode = 66;

	check = await fetchCheck2(getAllPlayersStats, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true){
		console.log("getAllPlayersStats Test 2 Passed");
	}
	else{
		console.log("getAllPlayersStats Test 2 Failed");
	}

	bodyToSend.gameMode = "speedstats";

	check = await fetchCheck2(getAllPlayersStats, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === false){
		console.log("getAllPlayersStats Test 3 Passed");
	}
	else{
		console.log("getAllPlayersStats Test 3 Failed");
	}
}

async function checkLogin(){

	let bodyToSend = {
        userName: "B1",
		passWord: "777"
    };

    let check = await fetchCheck2(login, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === false && check.result.type === 1){
		console.log("login Test 1 Passed");
	}
	else{
		console.log("login Test 1 Failed");
	}

	bodyToSend.userName = null;

	check = await fetchCheck2(login, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 0){
		console.log("login Test 2 Passed");
	}
	else{
		console.log("login Test 2 Failed");
	}

	bodyToSend.passWord = null;

	check = await fetchCheck2(login, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 0){
		console.log("login Test 3 Passed");
	}
	else{
		console.log("login Test 3 Failed");
	}

	bodyToSend.userName = "B1";

	check = await fetchCheck2(login, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 1){
		console.log("login Test 4 Passed");
	}
	else{
		console.log("login Test 4 Failed");
	}

	bodyToSend.userName = "admin";
	bodyToSend.passWord = "admin!!777";

	check = await fetchCheck2(login, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === false && check.result.type === 2){
		console.log("login Test 5 Passed");
	}
	else{
		console.log("login Test 5 Failed");
	}

	bodyToSend.passWord = 7;

	check = await fetchCheck2(login, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 1){
		console.log("login Test 6 Passed");
	}
	else{
		console.log("login Test 6 Failed");
	}

	bodyToSend.passWord = "777";

	check = await fetchCheck2(login, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 2){
		console.log("login Test 7 Passed");
	}
	else{
		console.log("login Test 7 Failed");
	}

	bodyToSend.userName = "blahsCoh";

	check = await fetchCheck2(login, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 3){
		console.log("login Test 8 Passed");
	}
	else{
		console.log("login Test 8 Failed");
	}

	bodyToSend.userName = "B1"
	bodyToSend.passWord = "7";

	check = await fetchCheck2(login, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 4){
		console.log("login Test 9 Passed");
	}
	else{
		console.log("login Test 9 Failed");
	}

	bodyToSend.passWord = "777";

	check = await fetchCheck2(login, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === false && check.result.type === 1){
		console.log("login Test 10 Passed");
	}
	else{
		console.log("login Test 10 Failed");
	}


}

async function checkSignUp(){

	let bodyToSend = {
        userName: "B1",
		passWord: "777",
		eMail: "trim"
    };

	bodyToSend.userName = 902;
	
    let check = await fetchCheck2(signUp, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 0){
		console.log("signUp Test 1 Passed");
	}
	else{
		console.log("signUp Test 1 Failed");
	}

	bodyToSend.userName = "ooooooooooooo";
	
    check = await fetchCheck2(signUp, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 0){
		console.log("signUp Test 2 Passed");
	}
	else{
		console.log("signUp Test 2 Failed");
	}

	bodyToSend.userName = "aDMin";
	
    check = await fetchCheck2(signUp, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 1){
		console.log("signUp Test 3 Passed");
	}
	else{
		console.log("signUp Test 3 Failed");
	}

	bodyToSend.userName = "admin";
	
    check = await fetchCheck2(signUp, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 1){
		console.log("signUp Test 4 Passed");
	}
	else{
		console.log("signUp Test 4 Failed");
	}

	bodyToSend.userName = "aDaM";
	bodyToSend.passWord = undefined
	
    check = await fetchCheck2(signUp, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 2){
		console.log("signUp Test 5 Passed");
	}
	else{
		console.log("signUp Test 5 Failed");
	}

	bodyToSend.userName = "aDaM";
	bodyToSend.passWord = "h"
	bodyToSend.eMail = null;
	
    check = await fetchCheck2(signUp, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 3){
		console.log("signUp Test 6 Passed");
	}
	else{
		console.log("signUp Test 6 Failed");
	}

	bodyToSend.userName = "B1";
	
    check = await fetchCheck2(signUp, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 3){
		console.log("signUp Test 7 Passed");
	}
	else{
		console.log("signUp Test 7 Failed");
	}

	bodyToSend.eMail = "tryout";
	
    check = await fetchCheck2(signUp, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 4){
		console.log("signUp Test 8 Passed");
	}
	else{
		console.log("signUp Test 8 Failed");
	}

	bodyToSend.userName = "tryoutsSo4"
	bodyToSend.eMail = "B1Baby";
	
    check = await fetchCheck2(signUp, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 5){
		console.log("signUp Test 9 Passed");
	}
	else{
		console.log("signUp Test 9 Failed");
	}

	bodyToSend.userName = "tryoutsSo5"
	bodyToSend.eMail = "tryout5email";
	
    check = await fetchCheck2(signUp, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === false && check.result.type === 0){
		console.log("signUp Test 10 Passed");
	}
	else{
		if(check.result.error === true && check.result.type === 4){
			console.log("signUp Test 10: Failed Because Duplicate");
		}
		else{
			console.log("signUp Test 10 Failed");
		}
	}

}

async function checkGetSavedGame(){

	let bodyToSend = {
        username: "B1",
		playerPassword: "777",
		identity: 5
    };

    let check = await fetchCheck2(getSavedGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === false && check.result.type === 0){
		console.log("getSavedGame Test 1 Passed");
	}
	else{
		console.log("getSavedGame Test 1 Failed");
	}

	bodyToSend.username = "LLLLLLLLLLLLLLLLLL";

	check = await fetchCheck2(getSavedGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 0){
		console.log("getSavedGame Test 2 Passed");
	}
	else{
		console.log("getSavedGame Test 2 Failed");
	}

	bodyToSend.username = "B1";
	bodyToSend.playerPassword = "774";

	check = await fetchCheck2(getSavedGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 1){
		console.log("getSavedGame Test 3 Passed");
	}
	else{
		console.log("getSavedGame Test 3 Failed");
	}

	bodyToSend.playerPassword = undefined;

	check = await fetchCheck2(getSavedGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 1){
		console.log("getSavedGame Test 4 Passed");
	}
	else{
		console.log("getSavedGame Test 4 Failed");
	}

	bodyToSend.playerPassword = "777";
	bodyToSend.identity = "that";

	check = await fetchCheck2(getSavedGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 2){
		console.log("getSavedGame Test 5 Passed");
	}
	else{
		console.log("getSavedGame Test 5 Failed");
	}

	bodyToSend.identity = 24;

	check = await fetchCheck2(getSavedGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 3){
		console.log("getSavedGame Test 6 Passed");
	}
	else{
		console.log("getSavedGame Test 6 Failed");
	}

	bodyToSend.identity = 82;

	check = await fetchCheck2(getSavedGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === false && check.result.type === 0){
		console.log("getSavedGame Test 7 Passed");
	}
	else{
		console.log("getSavedGame Test 7 Failed");
	}

}

async function checkGetAllSavedGameIDs(){

	let bodyToSend = {
        user: "B1",
		playerPassword: "777",
		mode: "all"
    };

    let check = await fetchCheck2(getAllSavedGameIDs, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === false){
		console.log("getAllSavedGameIDs Test 1 Passed");
	}
	else{
		console.log("getAllSavedGameIDs Test 1 Failed");
	}

	bodyToSend.mode = undefined;

	check = await fetchCheck2(getAllSavedGameIDs, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === false){
		console.log("getAllSavedGameIDs Test 2 Passed");
	}
	else{
		console.log("getAllSavedGameIDs Test 2 Failed");
	}

	bodyToSend.mode = "classic";

	check = await fetchCheck2(getAllSavedGameIDs, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === false){
		console.log("getAllSavedGameIDs Test 3 Passed");
	}
	else{
		console.log("getAllSavedGameIDs Test 3 Failed");
	}

	bodyToSend.user = "StIGMa989e";

	check = await fetchCheck2(getAllSavedGameIDs, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true){
		console.log("getAllSavedGameIDs Test 4 Passed");
	}
	else{
		console.log("getAllSavedGameIDs Test 4 Failed");
	}

	bodyToSend.user = "B1";
	bodyToSend.playerPassword = "77";

	check = await fetchCheck2(getAllSavedGameIDs, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true){
		console.log("getAllSavedGameIDs Test 5 Passed");
	}
	else{
		console.log("getAllSavedGameIDs Test 5 Failed");
	}

}

async function checkGetSavedGameAttributes(){

	let bodyToSend = {
        user: "B1",
		playerPassword: "777",
		identity: 82
    };

    let check = await fetchCheck2(getSavedGameAttributes, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === false && check.result.type === 0){
		console.log("getSavedGameAttributes Test 1 Passed");
	}
	else{
		console.log("getSavedGameAttributes Test 1 Failed");
	}

	bodyToSend.user = "LLLLLLLLLLLLLLLLLL";

	check = await fetchCheck2(getSavedGameAttributes, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 0){
		console.log("getSavedGameAttributes Test 2 Passed");
	}
	else{
		console.log("getSavedGameAttributes Test 2 Failed");
	}

	bodyToSend.user = "B1";
	bodyToSend.playerPassword = "774";

	check = await fetchCheck2(getSavedGameAttributes, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 1){
		console.log("getSavedGameAttributes Test 3 Passed");
	}
	else{
		console.log("getSavedGameAttributes Test 3 Failed");
	}

	bodyToSend.playerPassword = undefined;

	check = await fetchCheck2(getSavedGameAttributes, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 1){
		console.log("getSavedGameAttributes Test 4 Passed");
	}
	else{
		console.log("getSavedGameAttributes Test 4 Failed");
	}

	bodyToSend.playerPassword = "777";
	bodyToSend.identity = "that";

	check = await fetchCheck2(getSavedGameAttributes, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 2){
		console.log("getSavedGameAttributes Test 5 Passed");
	}
	else{
		console.log("getSavedGameAttributes Test 5 Failed");
	}

	bodyToSend.identity = 11;

	check = await fetchCheck2(getSavedGameAttributes, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 3){
		console.log("getSavedGameAttributes Test 6 Passed");
	}
	else{
		console.log("getSavedGameAttributes Test 6 Failed");
	}

	bodyToSend.identity = 50;

	check = await fetchCheck2(getSavedGameAttributes, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === false && check.result.type === 0){
		console.log("getSavedGameAttributes Test 7 Passed");
	}
	else{
		console.log("getSavedGameAttributes Test 7 Failed");
	}

}

async function checkDeleteSavedGame(){

	let bodyToSend = {
        user: "B1",
		playerPassword: "777",
		identity: 269
    };

	bodyToSend.user = null;

	let check = await fetchCheck2(deleteSavedGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 0){
		console.log("checkDeleteSavedGame Test 1 Passed");
	}
	else{
		console.log("checkDeleteSavedGame Test 1 Failed");
	}

	bodyToSend.user = "ToTo79fef";

	check = await fetchCheck2(deleteSavedGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 0){
		console.log("checkDeleteSavedGame Test 2 Passed");
	}
	else{
		console.log("checkDeleteSavedGame Test 2 Failed");
	}

	bodyToSend.user = "B1";
	bodyToSend.playerPassword = null;

	check = await fetchCheck2(deleteSavedGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 1){
		console.log("checkDeleteSavedGame Test 3 Passed");
	}
	else{
		console.log("checkDeleteSavedGame Test 3 Failed");
	}

	bodyToSend.user = "B1";
	bodyToSend.playerPassword = "888";

	check = await fetchCheck2(deleteSavedGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 1){
		console.log("checkDeleteSavedGame Test 4 Passed");
	}
	else{
		console.log("checkDeleteSavedGame Test 4 Failed");
	}

	bodyToSend.user = "B1";
	bodyToSend.playerPassword = "777";
	bodyToSend.identity = null;

	check = await fetchCheck2(deleteSavedGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 2){
		console.log("checkDeleteSavedGame Test 5 Passed");
	}
	else{
		console.log("checkDeleteSavedGame Test 5 Failed");
	}

	bodyToSend.identity = 1891;

	check = await fetchCheck2(deleteSavedGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 3){
		console.log("checkDeleteSavedGame Test 6 Passed");
	}
	else{
		console.log("checkDeleteSavedGame Test 6 Failed");
	}

	bodyToSend.identity = 52;

	check = await fetchCheck2(deleteSavedGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === false && check.result.type === 0){
		console.log("checkDeleteSavedGame Test 7 Passed");
	}
	else{
		if(check.result.error === true && check.result.type === 3){
			console.log("checkDeleteSavedGame Test 7 Game Already Deleted (Failed)");
		}
		else{
			console.log("checkDeleteSavedGame Test 7 Failed");
		}
	}



}

async function checkSaveGame(){

	let bodyToSend = {
        playerName: "B1",
		playerPassword: "777",
		name: "FunGame",
		gameMoves: "ttt",
		gameMode: "classic",
		oppName: "stan",
		side: "w",
		count: 4,
		result: "cash",
		date: "June 6",
    };

	bodyToSend.playerName = undefined;

	let check = await fetchCheck2(saveGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 0){
		console.log("checkSaveGame Test 1 Passed");
	}
	else{
		console.log("checkSaveGame Test 1 Failed");
	}

	bodyToSend.playerName = "KuSHAckZ";

	check = await fetchCheck2(saveGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 0){
		console.log("checkSaveGame Test 2 Passed");
	}
	else{
		console.log("checkSaveGame Test 2 Failed");
	}

	bodyToSend.playerName = "B1";
	bodyToSend.playerPassword = null;

	check = await fetchCheck2(saveGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 1){
		console.log("checkSaveGame Test 3 Passed");
	}
	else{
		console.log("checkSaveGame Test 3 Failed");
	}

	bodyToSend.playerName = "B1";
	bodyToSend.playerPassword = "888";

	check = await fetchCheck2(saveGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 1){
		console.log("checkSaveGame Test 4 Passed");
	}
	else{
		console.log("checkSaveGame Test 4 Failed");
	}

	bodyToSend.playerPassword = "777";
	bodyToSend.name = "";

	check = await fetchCheck2(saveGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 2){
		console.log("checkSaveGame Test 5 Passed");
	}
	else{
		console.log("checkSaveGame Test 5 Failed");
	}

	bodyToSend.name = 88;

	check = await fetchCheck2(saveGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 2){
		console.log("checkSaveGame Test 6 Passed");
	}
	else{
		console.log("checkSaveGame Test 6 Failed");
	}

	let longGameName = "w";
	let limit = 40;
	let i = 0;
	while(i < limit){
		longGameName = longGameName.concat("w");
		i++;
	}
	
	bodyToSend.name = longGameName;

	check = await fetchCheck2(saveGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 3){
		console.log("checkSaveGame Test 7 Passed");
	}
	else{
		console.log("checkSaveGame Test 7 Failed");
	}

	bodyToSend.name = "Fresh";
	bodyToSend.gameMoves = undefined;

	check = await fetchCheck2(saveGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 4){
		console.log("checkSaveGame Test 8 Passed");
	}
	else{
		console.log("checkSaveGame Test 8 Failed");
	}

	bodyToSend.gameMoves = "";

	check = await fetchCheck2(saveGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 4){
		console.log("checkSaveGame Test 9 Passed");
	}
	else{
		console.log("checkSaveGame Test 9 Failed");
	}

	let longGameMoves = "w";
	limit = 870;
	i = 0;
	while(i < limit){
		longGameMoves = longGameMoves.concat("w");
		i++;
	}

	bodyToSend.gameMoves = longGameMoves;

	check = await fetchCheck2(saveGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 5){
		console.log("checkSaveGame Test 10 Passed");
	}
	else{
		console.log("checkSaveGame Test 10 Failed");
	}

	bodyToSend.gameMoves = "1212";
	bodyToSend.gameMode = "classi";

	check = await fetchCheck2(saveGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 6){
		console.log("checkSaveGame Test 11 Passed");
	}
	else{
		console.log("checkSaveGame Test 11 Failed");
	}

	bodyToSend.gameMode = null;

	check = await fetchCheck2(saveGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 6){
		console.log("checkSaveGame Test 12 Passed");
	}
	else{
		console.log("checkSaveGame Test 12 Failed");
	}

	bodyToSend.gameMode = "speed";
	bodyToSend.side = "w9";

	check = await fetchCheck2(saveGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 7){
		console.log("checkSaveGame Test 13 Passed");
	}
	else{
		console.log("checkSaveGame Test 13 Failed");
	}

	bodyToSend.side = undefined;

	check = await fetchCheck2(saveGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 7){
		console.log("checkSaveGame Test 14 Passed");
	}
	else{
		console.log("checkSaveGame Test 14 Failed");
	}

	bodyToSend.side = "r";

	check = await fetchCheck2(saveGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 7){
		console.log("checkSaveGame Test 15 Passed");
	}
	else{
		console.log("checkSaveGame Test 15 Failed");
	}

	bodyToSend.side = "b";
	bodyToSend.count = -7;

	check = await fetchCheck2(saveGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 8){
		console.log("checkSaveGame Test 16 Passed");
	}
	else{
		console.log("checkSaveGame Test 16 Failed");
	}

	bodyToSend.count = 201;

	check = await fetchCheck2(saveGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === true && check.result.type === 8){
		console.log("checkSaveGame Test 17 Passed");
	}
	else{
		console.log("checkSaveGame Test 17 Failed");
	}

	bodyToSend.count = 200;

	check = await fetchCheck2(saveGame, JSON.stringify(bodyToSend));

	console.log(check);

	if(check.result.error === false && check.result.type === 0){
		console.log("checkSaveGame Test 18 Passed");
	}
	else{
		if(check.result.error === true && check.result.type === 9){
			console.log("checkSaveGame Test 18: Limit Reached");
		}
		else{
			console.log("checkSaveGame Test 18 Failed");
		}
	}

}


async function fetchCheck2(path, bodyToSend){

	return new Promise( async (resolve, reject) => { 

    	let returnValue = {
        	result: null,
        	requestError: false
    	};
	
		await fetch(path, 
			{
				method: 'POST',
				headers:{
					'Content-Type': 'application/json'
				},
				//body: JSON.stringify(credentials)
            	body: bodyToSend
			}

			).then(
				(res) => {
					if(res.ok === false){
						console.log("About to throw error");
						throw Error(res.statusText);
					}
					return res.json();
			})
		.then((data) => {
			//console.log(data.msg);
			returnValue.result = data.msg;
		})
		.catch(function(error){
			console.log('Request failed doing stuff', error);
        	returnValue.requestError = true;
			resolve(returnValue);
		});

		console.log("After fetch");

		resolve(returnValue);

	});
	
}


//checkGetEloScore();
//checkProfileStats();
//checkPasswordUpdate();
//checkGetAllPlayersStats();
//checkLogin();
//checkSignUp();
//checkGetSavedGame();
//checkGetAllSavedGameIDs();
//checkGetSavedGameAttributes();
//checkDeleteSavedGame();
//checkSaveGame();