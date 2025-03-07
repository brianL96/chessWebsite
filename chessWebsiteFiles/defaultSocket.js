
console.log("Made it to defaultSocket.js");

const socketIOConnections = require('./socketConnections.js');
const userVariables = require('./userVariables.js');

module.exports = function(io){

let totalConnections = 0;
let numberOfDisconnects = 0;
let closed = 0;
let disconnectMessArray = [];


//setInterval(printClientCount, 10000);


io.use((socket, next) => {
 
    socket.conn.on("close", (reason) => {
        console.log("Socket has closed: " + socket.id);
        disconnectMessArray.push(reason); 
        closed++;
    });

    socket.conn.on("packet", ({type, data}) => {
        //console.log(type + " " + data);
    });

    //console.log("Inside the first middleware");
    let limitTest = socketIOConnections.ipSocketConnectionsContainerObject.getIPCount(socket.request.connection.remoteAddress);
    if(limitTest === false){
        socket.conn.close();
        return;
    }
    
    next();
});

io.on('connection', (socket) => {

    //console.log("Inside connection");

    totalConnections++;

    socket.conn.on('message', (data) => {
        //console.log("Look here:");
        //console.log(socket.nsp.name);
    });

    socket.on('disconnecting', (reason) => {
        //console.log(reason);
        numberOfDisconnects++;
        console.log("This is the socket that is disconnecting from the default space: " + socket.id + " " + numberOfDisconnects);
        if(userVariables.getSocketRemovedFromList(io, socket.id) !== true){
            socketIOConnections.ipSocketConnectionsContainerObject.removeConnectionFromIP(socket.request.connection.remoteAddress, socket.id);
        }
        else{
            console.log("Caught the truth value!");
        }
    });

    socketIOConnections.ipSocketConnectionsContainerObject.addConnection(io, socket.request.connection.remoteAddress, '/', socket.id);
    userVariables.setSocketRemovedFromList(io, socket.id, false);

});


function printClientCount(){
    console.log("**************************************");
    socketIOConnections.ipSocketConnectionsContainerObject.printArray();
    console.log("----------------------------------");
    console.log(Object.keys(io.of('/').connected).length);
    console.log("----------------------------------");
    console.log(Object.keys(io.of('/classicGame').connected).length);
    console.log("----------------------------------");
    console.log(Object.keys(io.of('/cotlbGame').connected).length);
    console.log("----------------------------------");
    console.log(io.engine.clientsCount);
    console.log("-----------------------------------");
    console.log("T: " + totalConnections);
    console.log("-----------------------------------");
    console.log("D: " + numberOfDisconnects);
    console.log("-----------------------------------");
    socketIOConnections.ipSocketConnectionsContainerObject.printImmediateDisconnects();
    console.log("-----------------------------------");
    console.log("C: " + closed);
    console.log(disconnectMessArray);
    console.log(disconnectMessArray.length);
    console.log("**************************************");
}

}