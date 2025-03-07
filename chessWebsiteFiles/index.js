//My Project - Brian Lemes

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

const defaultSocks = require('./defaultSocket.js')(io);
const classicSocks = require('./classicGameSocket')(io);
const kothSocks = require('./kothGameSocket')(io);
const cotlbSocks = require('./cotlbGameSocket')(io);
const speedSocks = require('./speedGameSocket')(io);
const adminSocks = require('./adminSocket')(io);

const userVariables = require('./userVariables.js');
const socketIOConnections = require('./socketConnections.js');
const timerFunctions = require('./socketTimerFunctions');
const chessManager = require('./chessGameManager.js');

let chessGameManager = chessManager.chessGameManagerObject;

let port = process.env.PORT || '3000';

app.use((req, res, next) => {
	//console.log(req.url);
	next();
});

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public'), {index: false}));

app.use('/home', require('./routes/api/routes.js'));

app.get('/', (req, res) => {
	console.log("Right here");
	res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
		if(err){
			res.status(404).send("Unable to retrieve file");
			return;
		}
	});
});

app.get("*", (req, res) => {
	console.log("Default complete path: get activated");
	res.status(404).send("404 Page Not Found");
	return;
});

app.post("*", (req, res) => {
	console.log("Default complete path: post");
	res.status(404).send("404 Path Not Found");
	return;
});

app.all('*', (req, res) => {
	console.log("Method Header Not Recognized");
	res.status(404).send("404 Path Not Found");
	return;
});

app.use((err, req, res, next) =>{

	if(err instanceof SyntaxError && err.status === 400 && 'body' in err){
		console.log("Found");
		res.status(400).json({status: false, error: "Invalid Request Format: Invalid JSON"});
		return;
	}
	next(err);
});

app.use((err, req, res, next) => {
	console.log("Default Error Handler");
	res.status(400).json({status: false, error: "Unknown Error Processing Your Request, Try Again"});
	return;
});


userVariables.serverStartDate = new Date().toLocaleString();

chessGameManager.addGameMode(10, 5, 99, 0, '/classicGame', timerFunctions.getGameModeStartSeconds(0), timerFunctions.getGameModeExtraSeconds(0), 'classicstats');
chessGameManager.addGameMode(10, 5, 999, 1, '/kothGame', timerFunctions.getGameModeStartSeconds(1), timerFunctions.getGameModeExtraSeconds(1), 'kothstats');
chessGameManager.addGameMode(10, 2, 997, 2, '/cotlbGame', timerFunctions.getGameModeStartSeconds(2), timerFunctions.getGameModeExtraSeconds(2), 'cotlbstats');
chessGameManager.addGameMode(10, 5, 995, 3, '/speedGame', timerFunctions.getGameModeStartSeconds(3), timerFunctions.getGameModeExtraSeconds(3), 'speedstats');

userVariables.addHighestOccupancyObjects(4);
userVariables.printHighestOccupancyObjects();

socketIOConnections.ipSocketConnectionsContainerObject.activateInterval(io);

/*app.listen('3000', () =>{
	console.log('Server Started on port 3000!!!');
});*/

//server.listen('3000', () => console.log('Server running'));

server.listen(port, () => console.log('Server running'));



