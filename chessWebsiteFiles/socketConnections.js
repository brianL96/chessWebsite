
const userVariables = require('./userVariables.js');

console.log("Check this: got to socketConnections.js");


class socketConnectionNode{

    constructor(namespace, socketID){
        this.namespace = namespace;
        this.socketID = socketID;
        this.defaultID = null;
        this.dateConnected = new Date();
        this.next = null;
    }

    getNext(){
        return this.next;
    }

    setNext(node){
        this.next = node;
    }

    
    getNamespace(){
        return this.namespace;
    }
    
    setNamespace(namespace){
        this.namespace = namespace;
    }

    setSocketID(socketID){
        this.socketID = socketID;
    }

    getSocketID(){
        return this.socketID;
    }

    setDefaultID(defaultID){
        this.defaultID = defaultID;
    }

    getDefaultID(){
        return this.defaultID;
    }

    getDateConnected(){
        return this.dateConnected;
    }

}


class socketConnectionFrontNode{

    constructor(ip){
        this.clientIP = ip;
        this.front = null;
        this.socketIDsCount = 0;
    }

    getClientIP(){
        return this.clientIP;
    }

    getFront(){
        return this.front;
    }

    setFront(node){
        this.front = node;
    }

    incrementCount(){
        this.socketIDsCount++;
    }

    decrementCount(){
        this.socketIDsCount--;
    }

    getCount(){
        return this.socketIDsCount;
    }

    getSocketIDsCount(){
        return this.socketIDsCount;
    }


    printList(){
        let nodePointer = this.getFront();
        while(nodePointer !== null){
            console.log(nodePointer);
            nodePointer = nodePointer.getNext();
        }
    }

}

class ipSocketConnectionsContainer{

    constructor(){
        this.connectionIPs = [];
        this.sweepedSocketID = null;
        this.lostIPsFrontNode = new socketConnectionFrontNode(null);
        this.immediateDisconnects = 0;   
    }

    printImmediateDisconnects(){
        console.log(this.immediateDisconnects);
    }

    getSweepedSocketID(){
        return this.sweepedSocketID;
    }

    setSweepedSocketID(socketID){
        this.sweepedSocketID = socketID;
    }

    getSocketSuffix(namespace, socketID){
        let namespaceLength = namespace.length + 1;
        let defaultID = null;
        if(socketID.length > namespaceLength){
            defaultID = socketID.substring(namespaceLength);
        }
        return defaultID;
    }

    getIPCount(ip){

        let frontNode = null;
        let ipString = null;

        if(ip === undefined || ip === null){
            frontNode = this.lostIPsFrontNode;
            if(frontNode.getCount() >= 100){
                return false;
            }
            return true;
         }

        if(typeof(ip) !== 'string'){
            ipString = ip.toString();
        }
        else{
            ipString = ip;
        }

        let ipNode = this.binarySearchIP(ipString);

        if(ipNode.foundIP === false){
            return true;
        }

        frontNode = this.connectionIPs[ipNode.foundIndex];

        if(frontNode.getCount() >= 65){
            return false
        }

        return true;

    }

    updateLostIPConnection(namespace, newSocketID, adjustedID){

        let frontNode = this.lostIPsFrontNode;
        let nodePointer = frontNode.getFront();
        let returnObject = {
            found: false,
            otherSocketID: null,
            otherNamespace: null
        };

        while(nodePointer !== null){
            if(nodePointer.getSocketID() === adjustedID){
                nodePointer.setDefaultID(nodePointer.getSocketID());
                nodePointer.setSocketID(newSocketID);
                nodePointer.setNamespace(namespace);
                returnObject.found = true;
                break;
            }
            else if(nodePointer.getDefaultID() === adjustedID){
                returnObject.otherSocketID = nodePointer.getSocketID();
                returnObject.otherNamespace = nodePointer.getNamespace();
                break;
            }
            nodePointer = nodePointer.getNext();
        }

        return returnObject;
    }

    updateConnection(ip, namespace, newSocketID){

        let frontNode = null;
        let nodePointer = null;
        let ipString = null;
        let namespaceLength = namespace.length + 1;
        let adjustedID = newSocketID.substring(namespaceLength);
        let returnObject = {
            found: false,
            otherSocketID: null,
            otherNamespace: null
        };

        //console.log("This is the adjustedID I'm changing: " + adjustedID);
        
        if(ip === undefined || ip === null){
           return this.updateLostIPConnection(namespace, newSocketID, adjustedID);
        }

        if(typeof(ip) !== 'string'){
            ipString = ip.toString();
        }
        else{
            ipString = ip;
        }
        
        let ipNode = this.binarySearchIP(ipString);
        
        if(ipNode.foundIP){
            frontNode = this.connectionIPs[ipNode.foundIndex];
            nodePointer = frontNode.getFront();
            while(nodePointer !== null){
                
                if(nodePointer.getSocketID() === adjustedID){
                    nodePointer.setDefaultID(nodePointer.getSocketID());
                    nodePointer.setSocketID(newSocketID);
                    nodePointer.setNamespace(namespace);
                    returnObject.found = true;
                    break;
                }
                else if(nodePointer.getDefaultID() === adjustedID){
                    returnObject.otherSocketID = nodePointer.getSocketID();
                    returnObject.otherNamespace = nodePointer.getNamespace();
                    break;
                }

                nodePointer = nodePointer.getNext();
            }
            
        }

        //console.log("After I've updated a socketID:");
        //this.printArray();

        return returnObject;
    }

    addConnectionToList(frontNode, namespace, socketID){

        let node = new socketConnectionNode(namespace, socketID);//node.next is null
        let frontPointer = frontNode.getFront();//frontPointer is the same as where this object points to
        node.setNext(frontPointer);//node.next points to the front
        frontNode.setFront(node);
        frontNode.incrementCount();
     }

     addLostIPConnection(io, namespace, socketID){
        console.log("Adding Lost Connection");
        let frontNode = this.lostIPsFrontNode;
        if(frontNode.getCount() >= 100){
            userVariables.clearSocketConnection(io, '/', socketID);
            this.immediateDisconnects++;
            return;
        }
        this.addConnectionToList(frontNode, namespace, socketID);
     }

    addConnection(io, ip, namespace, socketID){

        //console.log("Add Connection Called, Adding Socket ID: " + socketID);
    
        if(ip === undefined || ip === null){
            this.addLostIPConnection(io, namespace, socketID);
            return;
        }

        let frontNode = null;
        let ipString = null;

        if(typeof(ip) !== 'string'){
            ipString = ip.toString();
        }
        else{
            ipString = ip;
        }

        let ipNode = this.binarySearchIP(ipString);

        if(ipNode.foundIP === false){
            frontNode = new socketConnectionFrontNode(ipString);
            this.addConnectionToList(frontNode, namespace, socketID);

            //where to insert ip object?
            if(this.connectionIPs.length === 0 || ipNode.foundIndex === -1){
                console.log("1st");
                this.connectionIPs.push(frontNode);
            }
            else{
                if(ipNode.insertLeft){
                    console.log("2nd");
                    this.connectionIPs.splice(ipNode.foundIndex, 0, frontNode);
                }
                else if(ipNode.insertLeft === false){
                    if( (ipNode.foundIndex + 1) >= this.connectionIPs.length){
                        console.log("3rd");
                        this.connectionIPs.push(frontNode);
                    }
                    else{
                        console.log("4th");
                        this.connectionIPs.splice(ipNode.foundIndex + 1, 0, frontNode);
                    }
                }
            }

        }
        else{
            
            frontNode = this.connectionIPs[ipNode.foundIndex];
            if(frontNode.getCount() >= 65){
                userVariables.clearSocketConnection(io, '/', socketID);
                this.immediateDisconnects++;
                return;
            }
            this.addConnectionToList(frontNode, namespace, socketID);
            
        }

        //console.log("After Adding Socket ID: " + socketID + " This is the connections container: ");
        //this.printArray();

    }

    removeConnectionFromList(frontNode, socketID){

        let index = 0;
        let nodePointer = frontNode.getFront();
        let prevPointer = null;

        while(nodePointer !== null){

            if(nodePointer.getSocketID() === socketID){

                if(index === 0){
                    //front node
                    frontNode.setFront(nodePointer.getNext());
                }
                else{
                    prevPointer.setNext(nodePointer.getNext());
                }
                nodePointer.setNext(null);
                nodePointer = null;
                frontNode.decrementCount();
                break;
            }
            
            index++;
            prevPointer = nodePointer;
            nodePointer = nodePointer.getNext();
        }


    }

    removeLostIPConnectionFromList(socketID){
        this.removeConnectionFromList(this.lostIPsFrontNode, socketID);
    }

    removeConnectionFromIP(ip, socketID){

        console.log("Inside remove connection from IP, removing SocketID: " + socketID);

        if(this.getSweepedSocketID() === socketID){
            console.log("Socket has already been sweeped");
            this.setSweepedSocketID(null);
            return null;
        }

        if(ip === undefined || ip === null){
            this.removeLostIPConnectionFromList(socketID);
            return;
        }

        let frontNode = null;
        let ipString = null;

        if(typeof(ip) !== 'string'){
            ipString = ip.toString();
        }
        else{
            ipString = ip;
        }
        
        let ipNode = this.binarySearchIP(ipString);
    
        if(ipNode.foundIP){
            frontNode = this.connectionIPs[ipNode.foundIndex];
            this.removeConnectionFromList(frontNode, socketID);
            if(frontNode.getCount() === 0){
                this.connectionIPs.splice(ipNode.foundIndex, 1);
            }
        }

        //console.log("After removing socketID: " + socketID);
        //this.printArray();
    }

    binarySearchIP(ip){

        let left = 0
        let right = this.connectionIPs.length - 1;
        let mid = 0;
        let found = false;

        let returnObject = {
            foundIndex: -1,
            foundIP: false,
            insertLeft: false
        };

        while(left <= right){
            mid = Math.floor((left + right)/2);
            //if(this.connectionIPs[mid].getClientIP() === ip){
            if(this.connectionIPs[mid].getClientIP().localeCompare(ip) === 0){
                found = true;
                break;
            }

            //if(this.connectionIPs[mid].getClientIP() > ip){
            if(this.connectionIPs[mid].getClientIP().localeCompare(ip) > 0){
                right = mid - 1;
            }
            else{
                left = mid + 1;
            }
        }

        if(found === false && this.connectionIPs.length > 0){
            //if(ip < this.connectionIPs[mid].getClientIP()){
            if(this.connectionIPs[mid].getClientIP().localeCompare(ip) > 0){
                returnObject.insertLeft = true;
            }
        }

        returnObject.foundIP = found;
        returnObject.foundIndex = mid;

        return returnObject;
    }

    findIPAddress(ip){

        let size = this.connectionIPs.length;
        let index = 0;
        let found = false;
        let foundI = -1;

        while(index < size){
            if(this.connectionIPs[index].getClientIP() === ip){
                found = true;
                foundI = index;
            }
            index++;
        }

        let returnObject = {
            foundIP: found,
            foundIndex: foundI 
        };

        return returnObject;   
    }

    printArray(){
        console.log(this.connectionIPs);
    }

    activateInterval(io){
        setInterval(this.checkLingeringConnectionsFromIP.bind(this), 60000, io);
    }

    printLostIPsFrontNode(){
        console.log(this.lostIPsFrontNode);
    }

    checkLingeringLostIPConnections(io){

        let frontNode = this.lostIPsFrontNode;
        let nodePointer = frontNode.getFront();
        let socketIDIndex = 0;
        let tempPointer = null;
        let prevPointer = null;

        let currentDate = null;
        let connectionDate = null;
        let connectionNamespace = null;
        let connectionSocketID = null;
        let connectionDefaultID = null;
        let secondsConnected = 0;

        while(nodePointer !== null){

            currentDate = new Date();
            connectionDate = nodePointer.getDateConnected();
            connectionNamespace = nodePointer.getNamespace();
            connectionSocketID = nodePointer.getSocketID();
            connectionDefaultID = nodePointer.getDefaultID();
            secondsConnected = (currentDate.getTime() - connectionDate.getTime())/1000;

            if(secondsConnected > 14){
                if(socketIDIndex === 0){
                    frontNode.setFront(nodePointer.getNext());
                }
                else{
                    prevPointer.setNext(nodePointer.getNext());
                }
                tempPointer = nodePointer.getNext();
                nodePointer.setNext(null);
                nodePointer = null;
                nodePointer = tempPointer;
                tempPointer = null;
                frontNode.decrementCount();

                this.setSweepedSocketID(connectionSocketID);
                //console.log("SocketID Sweeped: " + connectionSocketID);
                userVariables.forceSocketDisconnect(io, connectionNamespace, connectionSocketID, 7);
                userVariables.forceSocketDisconnect(io, '/', connectionDefaultID, 7);
                continue;
            }

            socketIDIndex++;
            prevPointer = nodePointer;
            nodePointer = nodePointer.getNext();
        }

        this.setSweepedSocketID(null);
        this.printLostIPsFrontNode();
        
    }

    checkLingeringConnectionsFromIP(io){

        console.log("Sweep Called");

        let frontNode = null;
        let ipListSize = this.connectionIPs.length;
        let ipIndex = 0;
        let socketIDIndex = 0;
        let nodePointer = null;
        let tempPointer = null;
        let prevPointer = null;
        let ipRemoved = false;

        let currentDate = null;
        let connectionDate = null;
        let connectionNamespace = null;
        let connectionSocketID = null;
        let connectionDefaultID = null;
        let secondsConnected = 0;


        while(ipIndex < ipListSize){

            ipRemoved = false;
            socketIDIndex = 0;
            frontNode = this.connectionIPs[ipIndex];
            nodePointer = frontNode.getFront();
            tempPointer = null;
            prevPointer = null;

            if(frontNode.getCount() === 0 || nodePointer === null){
                this.connectionIPs.splice(ipIndex, 1);
                ipListSize = this.connectionIPs.length;
                continue;
            }

            while(nodePointer !== null){

                currentDate = new Date();
                connectionDate = nodePointer.getDateConnected();
                connectionNamespace = nodePointer.getNamespace();
                connectionSocketID = nodePointer.getSocketID();
                connectionDefaultID = nodePointer.getDefaultID();
                secondsConnected = (currentDate.getTime() - connectionDate.getTime())/1000;

                if(secondsConnected > 14){
                
                    if(socketIDIndex === 0){
                        frontNode.setFront(nodePointer.getNext());
                    }
                    else{
                        prevPointer.setNext(nodePointer.getNext());
                    }
                    tempPointer = nodePointer.getNext();
                    nodePointer.setNext(null);
                    nodePointer = null;
                    nodePointer = tempPointer;
                    tempPointer = null;
                    frontNode.decrementCount();

                    if(frontNode.getCount() === 0){
                        this.connectionIPs.splice(ipIndex, 1);
                        ipListSize = this.connectionIPs.length;
                        ipRemoved = true;
                    }
                    //force the socket disconnect here
                    this.setSweepedSocketID(connectionSocketID);
                    //console.log("SocketID Sweeped: " + connectionSocketID);
                    userVariables.forceSocketDisconnect(io, connectionNamespace, connectionSocketID, 7);
                    userVariables.forceSocketDisconnect(io, '/', connectionDefaultID, 7);
                    //userVariables.clearSocketConnection(io, '/', connectionDefaultID);
                    continue;
                }
    
                socketIDIndex++;
                prevPointer = nodePointer;
                nodePointer = nodePointer.getNext();
            }
            

            if(ipRemoved){
                continue;
            }

            ipIndex++;
        }

        this.setSweepedSocketID(null);
        //console.log("After the sweep");
        //this.printArray();

        this.checkLingeringLostIPConnections(io);
    }

}

/*
console.log("Look here for your tests:------------------------------------");
let ipSocketConnectionsContainerObject = new ipSocketConnectionsContainer();
ipSocketConnectionsContainerObject.addConnection(null, '7', "classic", "id1");
ipSocketConnectionsContainerObject.addConnection(null, 16, "classic", "id2");
ipSocketConnectionsContainerObject.addConnection(null, 18, "classic", "id3");
ipSocketConnectionsContainerObject.addConnection(null, 20, "classic", "id4");
ipSocketConnectionsContainerObject.addConnection(null, '17', "classic", "id5");
ipSocketConnectionsContainerObject.addConnection(null, 15, "classic", "id6");
ipSocketConnectionsContainerObject.addConnection(null, 5, "classic", "id7");
ipSocketConnectionsContainerObject.addConnection(null, 16, "classic", "id8");
ipSocketConnectionsContainerObject.addConnection(null, '16', "classic", "id9");
ipSocketConnectionsContainerObject.addConnection(null, '8', "classic", "id10");
ipSocketConnectionsContainerObject.removeConnectionFromIP(16, "id8");
ipSocketConnectionsContainerObject.removeConnectionFromIP("16", "id9");
ipSocketConnectionsContainerObject.removeConnectionFromIP(16, "id2");
ipSocketConnectionsContainerObject.addConnection(null, "16", "classic", "id10");
ipSocketConnectionsContainerObject.removeConnectionFromIP("20", "id4");
ipSocketConnectionsContainerObject.removeConnectionFromIP('5', "id7");
ipSocketConnectionsContainerObject.removeConnectionFromIP(8, "id10");
ipSocketConnectionsContainerObject.printArray();
console.log("-------------------------------------------------------------");
*/

/*
let ipTester = new ipSocketConnectionsContainer();
ipTester.addConnection(null, "ip1", '/', "socketID1");
ipTester.addConnection(null, "ip1", '/', "socketID1.1");
ipTester.addConnection(null, "ip1", '/', "socketID2");
ipTester.addConnection(null, "ip1", '/', "socketID2.1");
ipTester.addConnection(null, "ip2", '/', "socketID3");
ipTester.addConnection(null, "ip2", '/', "socketID3.1");
ipTester.addConnection(null, "ip2", '/', "socketID4");
ipTester.addConnection(null, null, '/', "socketID5");
ipTester.addConnection(null, "ip3", '/', "socketID6");
ipTester.addConnection(null, undefined, '/', "socketID7");
ipTester.addConnection(null, undefined, '/', "socketID8");
ipTester.addConnection(null, 9, '/', "socketID9");
ipTester.addConnection(null, "9", '/', "socketID10");
ipTester.addConnection(null, "99", '/', "socketID12");
ipTester.printArray();
ipTester.printLostIPsFrontNode();
console.log("********");
ipTester.updateConnection("ip1", "/classicGame", "/classicGame#socketID2");
ipTester.updateConnection("ip2", "/classicGame", "/classicGame#socketID3");
ipTester.updateConnection(9, "/kothGame", "/kothGame#socketID10");
ipTester.updateConnection("ip3", "/classicGame", "/classicGame#socketID13");
ipTester.updateConnection(null, "/speedGame", "/speedGame#socketID8");
ipTester.updateConnection(undefined, "/cotlbGame", "/cotlbGame#socketID7");
ipTester.updateConnection(undefined, "/cotlbGame", "/cotlbGame#socketID13");
ipTester.printArray();
ipTester.printLostIPsFrontNode();
console.log("********");
ipTester.removeConnectionFromIP(9, "socketID9");
ipTester.removeConnectionFromIP("ip2", "socketID4");
ipTester.removeConnectionFromIP(undefined, "/cotlbGame#socketID7");
ipTester.removeConnectionFromIP("ip3", "socketID6");
ipTester.printArray();
ipTester.printLostIPsFrontNode();
console.log("********");
console.log(ipTester.getIPCount(9));
console.log(ipTester.getIPCount("ip1"));
console.log(ipTester.getIPCount("ip4"));
console.log(ipTester.getIPCount(null));
console.log(ipTester.getIPCount(undefined));
console.log("********");

let limit = 64;
let adds = 0;
while(adds < limit){
    ipTester.addConnection(null, "9", '/', adds);
    adds++;
}
console.log(ipTester.getIPCount(9));
console.log(ipTester.getIPCount(null));
console.log("********");
limit = 98;
adds = 0;
while(adds < limit){
    ipTester.addConnection(null, null, '/', adds);
    adds++;
}
ipTester.printArray();
ipTester.printLostIPsFrontNode();
console.log(ipTester.getIPCount(null));
console.log(ipTester.getIPCount(undefined));
console.log(ipTester.getIPCount("ip1"));
ipTester.printImmediateDisconnects();
ipTester.addConnection(null, null, '/', 100);
ipTester.printImmediateDisconnects();
ipTester.addConnection(null, 9, '/', 100);
ipTester.printImmediateDisconnects();
ipTester.removeConnectionFromIP(undefined, 9);
ipTester.printArray();
ipTester.printLostIPsFrontNode();
*/


/*
setTimeout(handleTest, 15000, ipTester);

function handleTest(object){
    console.log("Test Here: ------------------");
    ipTester.addConnection(null, "ip0", '/', "socketID15");
    ipTester.addConnection(null, undefined, '/', "socketID14");
    object.checkLingeringConnectionsFromIP(null);
    object.printArray();
    console.log("End of test: ---------------------");
}
*/





class socketConnection{

    constructor(namespace, socketID){
        this.namespace = namespace;
        this.socketID = socketID;
        this.dateConnected = new Date();
    }

    getNamespace(){
        return this.namespace;
    }

    getSocketID(){
        return this.socketID;
    }

    getDateConnected(){
        return this.dateConnected;
    }

}

class socketIOConnections{

    constructor(){
        this.connectionsList = [];
    }

    addConnectionToList(namespace, socketID){
        let socketIOConnection = new socketConnection(namespace, socketID);
        this.connectionsList.push(socketIOConnection);
        
        console.log("Just added a socket id to list:-----------------------------");
        console.log(this.connectionsList);
        console.log("------------------------------------------------------------");
        
    }

    activateInterval(io){
        //console.log("Started interval in connections");
        setInterval(this.checkLingeringConnections.bind(this), 60000, io);
    }

    checkLingeringConnections(io){

        //console.log("Lingering connections called");
        let size = this.connectionsList.length;
        let index = 0;
        let currentDate = null;
        let singleConnection = null;
        let connectionDate = null;
        let connectionNamespace = null;
        let connectionSocketID = null;
        let secondsConnected = 0;

        
        console.log("Before deleting lingering sockets: ----------------------");
        console.log(this.connectionsList);
        console.log("---------------------------------------------------------");
        

        /*
        if(size < 1){
            return;
        }
        */

        while(index < size){

            currentDate = new Date();
            singleConnection = this.connectionsList[index];
            connectionDate = singleConnection.getDateConnected();
            connectionNamespace = singleConnection.getNamespace();
            connectionSocketID = singleConnection.getSocketID();
            secondsConnected = (currentDate.getTime() - connectionDate.getTime())/1000;

            if(secondsConnected > 14){
                /*
                console.log("Deleting a lingering socket");
                console.log("Before actually removal from lingering list:--------------");
                console.log(this.connectionsList);
                console.log("----------------------------------------------------");
                */
                this.connectionsList.splice(index, 1);
                userVariables.forceSocketDisconnect(io, connectionNamespace, connectionSocketID, 7);
                /*
                console.log("After actually removal from lingering list:--------------");
                console.log(this.connectionsList);
                console.log("---------------------------------------------------------");
                */
                size = this.connectionsList.length;
                continue;
            }
            index++;
        }

        
        console.log("After deleting lingering sockets: ----------------------");
        console.log(this.connectionsList);
        console.log("---------------------------------------------------------");
        
    }

    removeConnection(socketID){
        //console.log("Remove Connection called");
        let size = this.connectionsList.length;
        let index = 0;
        let found = false;
        while(index < size){
            if(this.connectionsList[index].getSocketID() === socketID){
                this.connectionsList.splice(index, 1);
                found = true;
                break;
            }
            index++;
        }

        
        console.log("Just removed a socket id from list:-------------------------");
        console.log(this.connectionsList);
        console.log("------------------------------------------------------------");
        

        return found;
    }


}

let socketIOConnectionsObject = new socketIOConnections();
let ipSocketConnectionsContainerObject = new ipSocketConnectionsContainer();


module.exports = {
	socketIOConnectionsObject,
    ipSocketConnectionsContainerObject
};


/*
class ipSocketConnections{

    constructor(ip){
        this.clientIP = ip;
        this.front = null;
        this.socketIDsCount = 0;
    }

    getClientIP(){
        return this.clientIP;
    }

    getFront(){
        return this.front;
    }

    setFront(node){
        this.front = node;
    }

    incrementCount(){
        this.socketIDsCount++;
    }

    decrementCount(){
        this.socketIDsCount--;
    }

    getCount(){
        return this.socketIDsCount;
    }

    getSocketIDsCount(){
        return this.socketIDsCount;
    }


    printList(){
        let nodePointer = this.getFront();
        while(nodePointer !== null){
            console.log(nodePointer);
            nodePointer = nodePointer.getNext();
        }
    }

    addConnectionToList(namespace, socketID){

       let node = new socketConnectionNode(namespace, socketID);
       let frontPointer = this.getFront();
       node.setNext(frontPointer);
       this.setFront(node);
       this.incrementCount();
    }

    removeConnectionFromList(socketID){

        let index = 0;
        let nodePointer = this.getFront();
        let prevPointer = null;
        while(nodePointer !== null){
            if(nodePointer.getSocketID() === socketID){
                if(index === 0){
                    this.setFront(nodePointer.getNext());
                }
                else{
                    prevPointer.setNext(nodePointer.getNext());
                }
                nodePointer.setNext(null);
                nodePointer = null;
                this.decrementCount();
                break;
            }
            index++;
            prevPointer = nodePointer;
            nodePointer = nodePointer.getNext();
        }

    }

}
*/

/*
console.log("Look here for list test:");
let ipObject = new ipSocketConnections("IPAddress1");
ipObject.addConnectionToList("classic", "1");
ipObject.addConnectionToList("classic", "2");
ipObject.addConnectionToList("classic", "3");
ipObject.removeConnectionFromList("1");
console.log(ipObject.getCount());
ipObject.printList();
console.log("List test complete");
*/










