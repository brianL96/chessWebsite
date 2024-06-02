
const chessManager = require('./chessGameManager.js');
const socketIOConnections = require('./socketConnections.js');
const userVariables = require('./userVariables.js');

module.exports = function(io){

console.log("In COTLB Sockets");

let nspCOTLB = io.of('/cotlbGame');

nspCOTLB.on('connection', (socket) => {
	
	console.log('Connection Used');

	socket.emit('message', 'Welcome to Charge of the Light Brigade!');

	let updateSuccess = null;
	let updateConfirmed = true;
	let removedConnectionFromList = false;
	let handshakeCalled = false;

	socket.on('findRoom', (data, callback) =>{

		if(handshakeCalled){
			return;
		}

		socketIOConnections.ipSocketConnectionsContainerObject.removeConnectionFromIP(socket.request.connection.remoteAddress, socket.id);
		removedConnectionFromList = true;
		handshakeCalled = true;
		chessManager.chessGameManagerObject.handleFindRoom(io, socket, 2, data, callback);

	});
	
	socket.on('connectToRoom', (data) => {

		if(handshakeCalled){
			return;
		}

		handshakeCalled = true;
		socketIOConnections.ipSocketConnectionsContainerObject.removeConnectionFromIP(socket.request.connection.remoteAddress, socket.id);
		removedConnectionFromList = true;
		chessManager.chessGameManagerObject.handleConnectToRoom(io, socket, 2, data);
	});	

	socket.on("requestOppUsername", (data) => {

		chessManager.chessGameManagerObject.handleRequestOppUsername(io, socket, 2, data);
	});

	socket.on("sendOppUsername", (data) => {

		chessManager.chessGameManagerObject.handleSendOppUsername(io, socket, 2, data);
		
	});

	socket.on('disconnecting', () => {

		if(updateConfirmed && removedConnectionFromList === false){
			socketIOConnections.ipSocketConnectionsContainerObject.removeConnectionFromIP(socket.request.connection.remoteAddress, socket.id);
		}
		chessManager.chessGameManagerObject.handleDisconnecting(io, socket, 2);

	});

	socket.on('gameMove', (data) => {

		chessManager.chessGameManagerObject.handleGameMove(io, socket, 2, data);
	});


	socket.on('checkmateStatus', (data) => {

		chessManager.chessGameManagerObject.handleCheckmateStatus(io, socket, 2, data);
	});

	socket.on('stalemateStatus', (data) => {

		chessManager.chessGameManagerObject.handleStalemateStatus(io, socket, 2, data);
	});


	socket.on('playerResignation', (data) => {
	
		chessManager.chessGameManagerObject.handlePlayerResignation(io, socket, 2, data);
	});


	socket.on('confirmInsufficientCheck', (data) =>{

		chessManager.chessGameManagerObject.handleConfirmInsufficientCheck(io, socket, 2, data);

	});

	socket.on('serverDraw', (data) => {

		chessManager.chessGameManagerObject.handleServerDraw(io, socket, 2, data);

	});

	socket.on('serverNewGame', (data) => {

		chessManager.chessGameManagerObject.handleServerNewGame(io, socket, 2, data);

	});

	socket.on('serverAdditionalDraw', (data) => {

		chessManager.chessGameManagerObject.handleServerAdditionalDraw(io, socket, 2, data);

	});

	updateSuccess = socketIOConnections.ipSocketConnectionsContainerObject.updateConnection(socket.request.connection.remoteAddress, '/cotlbGame', socket.id);

	if(updateSuccess.found){
		userVariables.setSocketRemovedFromList(io, socketIOConnections.ipSocketConnectionsContainerObject.getSocketSuffix('/cotlbGame', socket.id), true);
	}
	else if(updateSuccess.found === false){
		updateConfirmed = false;
		if(updateSuccess.otherSocketID !== null){
			userVariables.forceSocketDisconnect(io, updateSuccess.otherNamespace, updateSuccess.otherSocketID, 7);
		}
		userVariables.forceSocketDisconnect(io, '/cotlbGame', socket.id, 7);
	}

});


}


