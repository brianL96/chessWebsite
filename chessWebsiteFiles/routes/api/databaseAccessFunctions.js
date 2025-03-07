

console.log("Inside the database Access Functions file");
const database = require('../../dbConnection.js');
let db = database.databaseExportObject;

let accessLimitNumber = 1000000;
let accessLimit = accessLimitNumber;
let resetAccessLimitInterval = setInterval(() => {
	console.log("Resetting Access Limit");
	resetAccessLimit();
}, 14400000);

function resetAccessLimit(){
	accessLimit = accessLimitNumber;
}

function checkAccessLimit(){

	if(accessLimit <= 0){
		return false;
	}

	accessLimit--;
	console.log(`Decrementing accessLimit: ${accessLimit}`);
	return true;
}


//console.log(db);

function checkDuplicateUserInTable(table, username){
	return new Promise( (resolve, reject) => {

		if(checkAccessLimit() === false){
			console.log("Access Limit Error for checkDuplicateUserInTable");
			resolve(0);
			return;
		}

		if(db.getConnection() === null){
			resolve(0);
			return;
		}
		
		let sql = 'SELECT COUNT (*) AS total FROM ' + table + ' WHERE username = ?';
		let query = db.getConnection().query(sql, username, (err, result) => {

			if(err){
				console.log("Error inside query for checkDuplicateUserInTable");
				resolve(0);
			}
			else{
				resolve(result[0].total);
			}
		});
	});
}

function checkDuplicateUsername(username){
	return new Promise( (resolve, reject) => {

		if(checkAccessLimit() === false){
			console.log("Access Limit Error for checkDuplicateUsername");
			resolve(-1);
			return;
		}

		if(db.getConnection() === null){
			resolve(-1);
			return;
		}

		let sql = 'SELECT COUNT (*) AS total FROM users1 WHERE username = ?';
		let queryU = db.getConnection().query(sql, username, (err, result) => {
			if(err){
				console.log("Error inside query for checkDuplicateUsername");
				console.log(err);
				resolve(-1);
			}
			else{
				resolve(result[0].total);			
			}
		});
	});
}

function checkDuplicateEmail(email){
	return new Promise( (resolve, reject) => {

		if(checkAccessLimit() === false){
			console.log("Access Limit Error for checkDuplicateEmail");
			resolve(-1);
			return;
		}

		if(db.getConnection() === null){
			resolve(-1);
			return;
		}

		let sql = 'SELECT COUNT (*) AS total FROM users1 WHERE email = ?';
		let queryU = db.getConnection().query(sql, email, (err, result) => {

			if(err){
				console.log("Error inside query for checkDuplicateEmail");
				resolve(-1);
			}
			else{
				resolve(result[0].total);			
			}
		});
	});
}

function checkUsernameExists(username){
	return new Promise( (resolve, reject) => {

		if(checkAccessLimit() === false){
			console.log("Access Limit Error for checkUsernameExists");
			resolve(-1);
			return;
		}

		if(db.getConnection() === null){
			resolve(-1);
			return;
		}

		let sql = 'SELECT COUNT (*) AS total FROM users1 WHERE username = ?';
		let queryU = db.getConnection().query(sql, username, (err, result) => {

			if(err){
				console.log("Error inside query for checkUsernameExists");
				resolve(-1);
			}
			else{
				resolve(result[0].total);				
			}
		});
	});
}


function getGameAttributes(username, id){
	return new Promise((resolve, reject) => {

		if(checkAccessLimit() === false){
			console.log("Access Limit Error for getGameAttributes");
			resolve({type: -1, result:{}});
			return;
		}

		if(db.getConnection() === null){
			resolve({type: -1, result: {}});
			return;
		}

		let sql = 'SELECT opponent AS opponent, movecount AS count, gameMode AS gameMode, result AS result, date AS date FROM savedgames WHERE username = ? AND id = ?';
		let query = db.getConnection().query(sql, [username, id],  (err, result) => {

			let msg = {
				type: 0,
				result: {}
			};

			if(err){
				console.log("Error inside query for getGameAttributes");
				msg.type = -1;
				resolve(msg);
			}
			else{

				if(result.length > 0){
					msg.type = 1;
					msg.result = result[0];
				}
				
				resolve(msg);
			}
		});
	});
}

function deleteGame(username, id){
	return new Promise((resolve, reject) => {

		if(checkAccessLimit() === false){
			console.log("Access Limit Error for deleteGame");
			resolve({type: -1});
			return;
		}

		if(db.getConnection() === null){
			resolve({type: -1});
			return;
		}

		let sql = 'DELETE FROM savedgames WHERE username = ? AND id = ?';
		let query = db.getConnection().query(sql, [username, id],  (err, result) => {
		
			console.log("Look Here for Delete Result");
			console.log(result);

			let msg = {
				type: 0
			};

			if(err){
				console.log("Error inside query for deleteGame");
				msg.type = -1;
				resolve(msg);
			}
			else{
				if(result.affectedRows !== undefined){
					if(result.affectedRows > 0){
						msg.type = 1;
					}
				}
				resolve(msg);
			}

		});
	});
}


function getSavedGameRecordWithID(username, id){
	return new Promise((resolve, reject) => {

		if(checkAccessLimit() === false){
			console.log("Access Limit Error for getSavedGameRecordWithID");
			resolve({type: -1, result: {}});
			return;
		}

		if(db.getConnection() === null){
			resolve({type: -1, result: {}});
			return;
		}

		let sql = 'SELECT opponent AS opponent, name AS name, side AS side, movesMade AS movesMade, movecount AS movecount, gameMode AS gameMode, result AS result, date AS date FROM savedgames WHERE username = ? AND id = ?';
		let query = db.getConnection().query(sql, [username, id], (err, result) => {

			let msg = {
				type: 0,
				result: {}
			};

			if(err){
				console.log("Error inside query for getSavedGameRecordWithID");
				msg.type = -1;
				resolve(msg);
			}
			else{

				if(result.length > 0){
					msg.type = 1;
					msg.result = result[0];
				}

				resolve(msg);
			}
		});
	});
}


function getAllGameIDs(username, mode){
	return new Promise((resolve, reject) => {

		if(checkAccessLimit() === false){
			console.log("Access Limit Error for getAllGameIDs");
			resolve({rows: [], error: true});
			return;
		}

		if(db.getConnection() === null){
			resolve({rows: [], error: true});
			return;
		}

		let sql;
		let query;
		if(mode === 'all'){
			sql = 'SELECT id AS id, name AS name, gameMode AS gameMode FROM savedgames WHERE username = ?';
			query = db.getConnection().query(sql, [username], (err, result) => {
				let msg = {
					rows: [],
					error: false
				};

				if(err){
					console.log("Error inside query for getAllGameIDs");
					msg.error = true;
					resolve(msg);
				}
				else{
					msg.rows = result;
					resolve(msg);
				}
			});
		}
		else{
			sql = 'SELECT id AS id, name AS name, gameMode AS gameMode FROM savedgames WHERE username = ? AND gameMode = ?';
			query = db.getConnection().query(sql, [username, mode], (err, result) => {

				let msg = {
					rows: [],
					error: false
				};

				if(err){
					console.log("Error inside query for getAllGameIDs");
					msg.error = true;
					resolve(msg);
				}
				else{
					msg.rows = result;
					resolve(msg);
				}
			});
		}
	});
}


function getStats(table, username){
	return new Promise( (resolve, reject) => {

		if(checkAccessLimit() === false){
			console.log("Access Limit Error for getStats");
			resolve({found: false});
			return;
		}

		if(db.getConnection() === null){
			resolve({found: false});
			return;
		}

		let sql = 'SELECT wins AS wins, losses AS losses, stalemates AS stalemates, draws AS draws FROM ' + table + ' WHERE username = ?';
		let queryU = db.getConnection().query(sql, username, (err, result) => {

			if(err){
				console.log("Error inside query for getStats");
				let msg = {
					found: false
				};
				resolve(msg);
			}
			else{
				console.log("Look here for stats result");
				console.log(result);

				let msg = {
					found: false,
					result: {}
				};

				if(result.length > 0){
					msg.found = true;
					msg.result = result[0];
				}
				
				resolve(msg);

			}
		});
	});
}

function getLeaderboardStats(table){
	return new Promise( (resolve, reject) => {

		if(checkAccessLimit() === false){
			console.log("Access Limit Error for leaderboards");
			resolve([]);
			return;
		}

		if(db.getConnection() === null){
			resolve([]);
			return;
		}

 		let sql = 'SELECT username AS username, elo AS elo FROM ' + table + ' ORDER BY elo DESC';
		console.log(db);
		let queryU = db.getConnection().query(sql, (err, result) => {
			if(err){
				console.log("Error inside query for leaderboards");
				console.log(db);
				resolve([]);
			}
			else{
				resolve(result);			
			}
		});
	});
}


function checkUserPassword(username){
	return new Promise( (resolve, reject) => {

		if(checkAccessLimit() === false){
			console.log("Access Limit Error for checkUserPassword");
			resolve(null);
			return;
		}

		if(db.getConnection() === null){
			resolve(null);
			return;
		}

		let sql = 'SELECT password AS p FROM users1 WHERE username = ?';
		let queryU = db.getConnection().query(sql, username, (err, result) => {

			if(err){
				console.log("Error inside query for checkUserPassword");
				resolve(null);
			}
			else{
				resolve(result[0].p);							
			}
		});
	});
}

function updatePassword(username, newPassword, oldPassword){

	return new Promise( (resolve, reject) => {

		if(checkAccessLimit() === false){
			console.log("Access Limit Error for updatePassword");
			resolve({type: 0});
			return;
		}

		if(db.getConnection() === null){
			resolve({type: 0});
			return;
		}

		let sql = 'UPDATE users1 SET password = ? WHERE username = ? AND password = ?';
		let queryU = db.getConnection().query(sql, [newPassword, username, oldPassword], (err, result) => {

			if(err){
				console.log("Error inside query for updatePassword");
				let msg = {
					type: 0
				};
				resolve(msg);
			}
			else{
				let msg = {
					type: 0
				};

				console.log("Result for update password");
				console.log(result);

				if(result.affectedRows > 0){
					msg.type = 1;
				}

				resolve(msg);			
			}
		});
	});
}

function getElo(tableName, username){
	return new Promise( (resolve, reject) => {

		if(checkAccessLimit() === false){
			console.log("Access Limit Error for getElo");
			resolve(-1);
			return;
		}

		if(db.getConnection() === null){
			resolve(-1);
			return;
		}

		let sql = 'SELECT elo AS elo FROM ' + tableName + ' WHERE username = ?';
		let queryU = db.getConnection().query(sql, username, (err, result) => {

			if(err){
				console.log("Error inside query for getElo");
				resolve(-1);
			}
			else{

				console.log("In Elo Get");
				console.log(result);

				if(result.length === 0 || result[0].elo === undefined || result[0].elo === null || typeof(result[0].elo) !== 'number'){
					resolve(-1);
					return;
				}
				resolve(result[0].elo);							
			}

		});
	});
}


function insertSaveGame(username, opponentName, side, gameMoves, name, gameMode, count, date, result, maxNumberOfSavedGames){
	return new Promise((resolve, reject) => {

		if(checkAccessLimit() === false){
			console.log("Access Limit Error for insertSaveGame");
			resolve(-1);
			return;
		}

		if(db.getConnection() === null){
			resolve(-1);
			return;
		}

		let sql = "INSERT INTO savedgames(username, opponent, side, movesMade, name, gameMode, movecount, date, result) SELECT ?, ?, ?, ?, ?, ?, ?, ?, ? WHERE (SELECT COUNT (*) AS total FROM savedgames WHERE username = ?) < ?";
		
		db.getConnection().query(sql, [username, opponentName, side, gameMoves, name, gameMode, count, date, result, username, maxNumberOfSavedGames], (err, result) => {
		
			if(err){
				console.log("Error inside query for insertSaveGame");
				resolve(-1);
				return;
			}

			else{
				if(result.affectedRows < 1){
					resolve(0);
					return;
				}
				else if(result.affectedRows > 0){
					resolve(1);
					return;
				}

			}

		});
	});
}

function insertSignUp(username, password, email){
	return new Promise( async (resolve, reject) => {

		if(checkAccessLimit() === false){
			console.log("Access Limit Error for insertSignUp");
			resolve(-1);
			return;
		}

		if(db.getConnection() === null){
			console.log("Error inside query for insertSignUp");
			resolve(-1);
			return;
		}

		console.log("Before connection");

		let sqlInsert = 'INSERT INTO users1(username, password, email) VALUES (?, ?, ?)';
		let sqlInsertClassic = 'INSERT INTO classicstats(username, wins, losses, stalemates, draws, elo) VALUES (?, 0, 0, 0, 0, 300)';
		let sqlInsertKOTH = 'INSERT INTO kothstats(username, wins, losses, stalemates, draws, elo) VALUES (?, 0, 0, 0, 0, 300)';
		let sqlInsertCOTLB = 'INSERT INTO cotlbstats(username, wins, losses, stalemates, draws, elo) VALUES (?, 0, 0, 0, 0, 300)';
		let sqlInsertSpeed = 'INSERT INTO speedstats(username, wins, losses, stalemates, draws, elo) VALUES(?, 0, 0, 0, 0, 300)';

		db.getConnection().getConnection( async (err, conn) => {

			if(err){
				console.log("Error getting connection, returning.");
				resolve(-1);
				return;
			}

			try{
				await conn.promise().beginTransaction();
				console.log("After begin transaction");
				await conn.promise().query(sqlInsert, [username, password, email]);
				console.log("After 1st insert");
				await conn.promise().query(sqlInsertClassic, username);
				console.log("After 2nd insert");
				await conn.promise().query(sqlInsertKOTH, username);
				console.log("After 3rd insert");
				await conn.promise().query(sqlInsertCOTLB, username);
				console.log("After 4th insert");
				await conn.promise().query(sqlInsertSpeed, username);
				console.log("After 5th insert");
				await conn.promise().commit();
				console.log("After commit");
				db.getConnection().releaseConnection(conn);
				resolve(1);
				return;
			}
			catch(err){
				console.log("Error occured while querying");
				try{
					conn.rollback();
				}
				catch(err){
					console.log("Connection Already disconnected");
				}
				db.getConnection().releaseConnection(conn);
				resolve(-1);
				return;
			}

		});

	});
}


function updateEloInDatabase(tableName, wonUsername, lostUsername, number){
	return new Promise( (resolve, reject) => {

		if(checkAccessLimit() === false){
			console.log("Access Limit Error for updateEloInDatabase");
			resolve(false);
			return;
		}

		if(db.getConnection() === null){
			resolve(false);
			return;
		}

		let updateSQL = 'UPDATE ' + tableName + ' SET elo = ? WHERE username = ?';
		let getEloSQL = 'SELECT elo AS elo, username AS username FROM ' + tableName + ' WHERE username = ?';
		let lockSQL = 'SELECT username AS username FROM ' + tableName + ' WHERE username = ? OR username = ? FOR UPDATE';
		let updateWinsStatSQL = 'UPDATE ' + tableName + ' SET wins = wins + 1 WHERE username = ?';
		let updateLossesStatSQL = 'UPDATE ' + tableName + ' SET losses = losses + 1 WHERE username = ?';

		db.getConnection().getConnection( async (err, conn) => {

			if(err){
				console.log("Error inside query for updateEloInDatabase");
				resolve(false);
				return;
			}
			
			try{
				await conn.promise().beginTransaction();
				console.log("Update Elo: After begin " + number);
				await conn.promise().query(lockSQL, [wonUsername, lostUsername]);
				console.log("Update Elo: After lock " + number);
				await conn.promise().query(updateWinsStatSQL, wonUsername);
				console.log("Update Elo: After first " + number);
				await conn.promise().query(updateLossesStatSQL, lostUsername);
				console.log("Update Elo: After second " + number);

				let wonEloResult = await conn.promise().query(getEloSQL, wonUsername);

				if(wonEloResult.length === 0 || wonEloResult[0].length === 0 || wonEloResult[0][0].elo === undefined || wonEloResult[0][0].elo === null || typeof(wonEloResult[0][0].elo) !== 'number'){
					throw err;
				}

				let wonElo = wonEloResult[0][0].elo;

				console.log("Update Elo: Won elo - " + wonElo + " - " + number);

				let lostEloResult = await conn.promise().query(getEloSQL, [lostUsername]);
				if(lostEloResult.length === 0 || lostEloResult[0].length === 0 || lostEloResult[0][0].elo === undefined || lostEloResult[0][0].elo === null || typeof(lostEloResult[0][0].elo) !== 'number'){
					throw err;
				}

				let lostElo = lostEloResult[0][0].elo;

				console.log("Update Elo: Lost elo - " + lostElo + " - " + number);

				if(wonElo === -1 || lostElo === -1){
					console.log("Bad Elo Result");
					throw err;
				}

				let P1 = getProbability(wonElo, lostElo);
				let P2 = getProbability(lostElo, wonElo);

				let wonEloUpdate = Math.ceil(wonElo + (9 * (1 - P1)));
				let lostEloUpdate = Math.floor(lostElo + (9 *(0 - P2)));
			
				if(lostEloUpdate < 0){
					console.log("Minimum Elo reached");
					wonEloUpdate = wonElo + lostElo;
					lostEloUpdate = 0;
				}

				await conn.promise().query(updateSQL, [wonEloUpdate, wonUsername]);
				console.log("Update Elo: After Third " + number);

				await conn.promise().query(updateSQL, [lostEloUpdate, lostUsername]);
				console.log("Update Elo: After Fourth " + number);

				await conn.promise().commit();
				console.log("Update Elo: After Commit " + number);
				db.getConnection().releaseConnection(conn);
				resolve(true);
				return;
			}
			catch(err){
				console.log("Error occured while querying");
				console.log(err);
				try{
					conn.rollback();
				}
				catch(err){
					console.log("Connection Already disconnected");
				}
				db.getConnection().releaseConnection(conn);
				resolve(false);
				return;
			}

		});
	});
}

function getProbability(rating1, rating2){

	let value1 = ((rating2 - rating1)/400);
	let value2 = Math.pow(10, value1);
	return (1.0/(1.0 + value2));
	
}

function updateDrawsInDatabase(tableName, username1, username2, number){
	return new Promise( (resolve, reject) => {

		if(checkAccessLimit() === false){
			console.log("Access Limit Error for updateDrawsInDatabase");
			resolve(false);
			return;
		}

		if(db.getConnection() === null){
			resolve(false);
			return;
		}

		let sql = 'UPDATE ' + tableName + ' SET draws = draws + 1 WHERE username = ?';
		let lockSQL = 'SELECT username AS username FROM ' + tableName + ' WHERE username = ? OR username = ? FOR UPDATE';
		
		db.getConnection().getConnection( async (err, conn) => {

			if(err){
				console.log("Error inside query for updateDrawsInDatabase");
				resolve(false);
				return;
			}

			try{
				await conn.promise().beginTransaction();
				console.log("In Draw: After Begin " + number);
				await conn.promise().query(lockSQL, [username1, username2]);
				console.log("In Draw: After Lock " + number);
				await conn.promise().query(sql, username1);
				console.log("In Draw: After First " + number);
				await conn.promise().query(sql, username2);
				console.log("In Draw: After Second " + number);
				await conn.promise().commit();
				console.log("In Draw: After commit " + number);
				db.getConnection().releaseConnection(conn);
				resolve(true);
				return;
			}
			catch(err){
				console.log("Error occured while querying");
				try{
					conn.rollback();
				}
				catch(err){
					console.log("Connection Already disconnected");
				}
				db.getConnection().releaseConnection(conn);
				resolve(false);
				return;
			}
			
		});
	});
}

function updateStalematesInDatabase(tableName, username1, username2, number){
	return new Promise( (resolve, reject) => {

		if(checkAccessLimit() === false){
			console.log("Access Limit Error for updateStalematesInDatabase");
			resolve(false);
			return;
		}

		if(db.getConnection() === null){
			resolve(false);
			return;
		}

		let sql = 'UPDATE ' + tableName + ' SET stalemates = stalemates + 1 WHERE username = ?';
		let lockSQL = 'SELECT username AS username FROM ' + tableName + ' WHERE username = ? OR username = ? FOR UPDATE';
		
		db.getConnection().getConnection( async (err, conn) => {

			if(err){
				console.log("Error inside query for updateStalematesInDatabase");
				resolve(false);
				return;
			}

			try{
				await conn.promise().beginTransaction();
				console.log("In Stalemate: After Begin " + number);
				await conn.promise().query(lockSQL, [username1, username2]);
				console.log("In Stalemate: After Lock " + number);
				await conn.promise().query(sql, username1);
				console.log("In Stalemate: After First " + number);
				await conn.promise().query(sql, username2);
				console.log("In Stalemate: After Second " + number);
				await conn.promise().commit();
				console.log("In Stalemate: After Commit " + number);
				db.getConnection().releaseConnection(conn);
				resolve(true);
				return;
			}
			catch(err){
				console.log("Error occured while querying");
				try{
					conn.rollback();
				}
				catch(err){
					console.log("Connection Already disconnected");
				}
				db.getConnection().releaseConnection(conn);
				resolve(false);
				return;
			}
		});
	});
}

module.exports = {
	checkDuplicateUserInTable,
	checkDuplicateUsername,
	checkDuplicateEmail,
	checkUsernameExists,
	getGameAttributes,
	deleteGame,
	getSavedGameRecordWithID,
	getAllGameIDs,
	getStats,
	getLeaderboardStats,
	checkUserPassword,
	updatePassword,
	getElo,
	insertSaveGame,
	insertSignUp,
	updateEloInDatabase,
	updateDrawsInDatabase,
	updateStalematesInDatabase
};
