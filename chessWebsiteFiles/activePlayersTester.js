const activePlayers = require('./activePlayers.js');

console.log("************************************");
console.log("Inside active players tester:");


function addActiveNode(username, gameMode, roomNumber){

    let activeIndex = activePlayers.activePlayersObject.binarySearchActiveNode(username);
        if(activeIndex !== -1){
            let check = activePlayers.activePlayersObject.checkActivePlayerNode(activeIndex, gameMode);
            if(check){
                console.log("Nothing to delete from active nodes:");
                activePlayers.activePlayersObject.printActiveNodes();
            }
            else{
                console.log("Have to delete from active nodes");
                let leaveRoom = activePlayers.activePlayersObject.getRoomNumberFromActiveNode(activeIndex, gameMode);
                console.log("This is the room that username: " + username + " is leaving: " + leaveRoom);
                activePlayers.activePlayersObject.deleteActiveNodeWithIndex(activeIndex, gameMode);
                console.log("After deleting from active nodes:");
                activePlayers.activePlayersObject.printActiveNodes();
            }
        }

    let insertIndex = activePlayers.activePlayersObject.insertActivePlayerNode(username);
	activePlayers.activePlayersObject.setActivePlayerNode(insertIndex, gameMode, roomNumber);
    console.log("Here is the active nodes after addActiveNode:");
	activePlayers.activePlayersObject.printActiveNodes();
}

function deleteActiveNode(username, gameMode){
    activePlayers.activePlayersObject.deleteActivePlayerNode(username, gameMode);
    console.log("Here is the active nodes after deleteActiveNode:");
	activePlayers.activePlayersObject.printActiveNodes();
}

addActiveNode('B1', 0, 0);
addActiveNode('B1', 1, 7);
addActiveNode('B1', 1, 5);
addActiveNode('B1', 2, 8);
addActiveNode('B1', 3, 10);
deleteActiveNode('B1', 3);
deleteActiveNode('B1', 1);
deleteActiveNode('B1', 0);
deleteActiveNode('B1', 2);
addActiveNode('B1', 0, 0);
addActiveNode('CR10', 0, 0);
addActiveNode('yy', 0, 1);
addActiveNode('CR0', 0, 1);
addActiveNode('CR0', 0, 7);
addActiveNode('B1', 1, 8);
addActiveNode('CR0', 1, 90);
addActiveNode('CR0', 3, 100);
addActiveNode('CR0', 2, 21);
deleteActiveNode('B1', 1);
deleteActiveNode('B1', 1);
deleteActiveNode('CR10', 0);
deleteActiveNode('CR10', 0);
deleteActiveNode('B1', 0);
deleteActiveNode('yy', 1);
deleteActiveNode('yy', 0);
deleteActiveNode('CR0', 2);
deleteActiveNode('CR0', 1);
deleteActiveNode('CR0', 3);
deleteActiveNode('CR0', 0);
deleteActiveNode('CR0', 0);



console.log("After active players tester:");
console.log("************************************");
