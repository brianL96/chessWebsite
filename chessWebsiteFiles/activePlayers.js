
class activePlayersNode{

	constructor(user){
		this.username = user;
		this.classicRoom = -1;
		this.kothRoom = -1;
		this.cotlbRoom = -1;
		this.speedRoom = -1;
	}

	getUsername(){
		return this.username;
	}

	getClassicRoom(){
		return this.classicRoom;
	}

	setClassicRoom(room){
		this.classicRoom = room;
	}

	getKOTHRoom(){
		return this.kothRoom;
	}

	setKOTHRoom(room){
		this.kothRoom = room;
	}

	getCOTLBRoom(){
		return this.cotlbRoom;
	}

	setCOTLBRoom(room){
		this.cotlbRoom = room;
	}

	getSpeedRoom(){
		return this.speedRoom;
	}

	setSpeedRoom(room){
		this.speedRoom = room;
	}
}

class activePlayers{

    constructor(){
		this.activeNodes = [];
	}

    getActiveNodesLength(){
        return this.activeNodes.length;
    }

    getActiveNode(index){
        return this.activeNodes[index];
    }

	printActiveNodes(){
		console.log(this.activeNodes);
	}

    removeActiveNode(index){
        this.activeNodes.splice(index, 1);
    }

    createActiveNode(user){
		let node = new activePlayersNode(user);
		return node;
	}

    setActivePlayerNode(index, gameType, gameRoom){

        let node = this.getActiveNode(index);

		if(gameType === 0){
			node.setClassicRoom(gameRoom);
		}
		else if(gameType === 1){
			node.setKOTHRoom(gameRoom);
		}
		else if(gameType === 2){
			node.setCOTLBRoom(gameRoom);
		}
		else if(gameType === 3){
			node.setSpeedRoom(gameRoom);
		}

	}

    getRoomNumberFromActiveNode(index, gameType){

        let node = this.getActiveNode(index);

		if(gameType === 0){
			return node.getClassicRoom();
		}
		else if(gameType === 1){
			return node.getKOTHRoom();
		}
		else if(gameType === 2){
			return node.getCOTLBRoom();
		}
		else if(gameType === 3){
			return node.getSpeedRoom();
		}

		return -1;
	}

    checkActivePlayerNode(index, gameType){

        let node = this.getActiveNode(index);

		if(gameType === 0){
			return (node.getClassicRoom() === -1 ? true : false);
		}
		else if(gameType === 1){
			return (node.getKOTHRoom() === -1 ? true : false);
		}
		else if(gameType === 2){
			return (node.getCOTLBRoom() === -1 ? true: false);
		}
		else if(gameType === 3){
			return (node.getSpeedRoom() === -1 ? true: false);
		}

		return false;

	}

	deleteBothActivePlayerNodesInRoom(gameRoomNode, gameType){

		//console.log("Active Nodes Before Delete:");
		//this.printActiveNodes();

		let username1 = gameRoomNode.getPlayerOneUsername();
		let username2 = gameRoomNode.getPlayerTwoUsername();

		this.deleteActivePlayerNode(username1, gameType);
		this.deleteActivePlayerNode(username2, gameType);

		//console.log("Deleted Active Nodes:");
		//console.log(this.activeNodes);
	}

	deleteActiveNodeWithIndex(index, gameType){

		let node = this.getActiveNode(index);
		this.setActivePlayerNode(index, gameType, -1);
		if(node.getClassicRoom() === -1 && node.getKOTHRoom() === -1 && node.getCOTLBRoom() === -1 && node.getSpeedRoom() === -1){
			this.removeActiveNode(index);
		}

	}

    deleteActivePlayerNode(username, gameType){

		if(username === undefined || username === null){
			return;
		}

		//let result = this.binarySearchActivePlayers(0, this.getActiveNodesLength() - 1, username);
		let result = this.binarySearchActiveNode(username);
		if(result !== -1){
			let node = this.getActiveNode(result);
			this.setActivePlayerNode(result, gameType, -1);
			if(node.getClassicRoom() === -1 && node.getKOTHRoom() === -1 && node.getCOTLBRoom() === -1 && node.getSpeedRoom() === -1){
				this.removeActiveNode(result);
			}
		}

		//console.log("Active Nodes After Single Delete");
		//this.printActiveNodes();
	}

	binarySearchActiveNode(target){

        let left = 0
        let right = this.getActiveNodesLength() - 1;
        let mid = 0;
        let found = false;

        while(left <= right){
            mid = Math.floor((left + right)/2);

			if(this.getActiveNode(mid).getUsername().localeCompare(target) === 0){
				found = true;
				break;
			}
			if(this.getActiveNode(mid).getUsername().localeCompare(target) > 0){
                right = mid - 1;
            }
            else{
                left = mid + 1;
            }
        }

		if(found === false){
			return -1;
		}

		return mid;

    }

	binarySearchActiveNodeForInsert(target){

        let left = 0
        let right = this.getActiveNodesLength() - 1;
        let mid = 0;
        let found = false;

        let returnObject = {
            foundIndex: -1,
            foundTarget: false,
            insertLeft: false
        };
		
        while(left <= right){
            mid = Math.floor((left + right)/2);

			if(this.getActiveNode(mid).getUsername().localeCompare(target) === 0){
				found = true;
				break;
			}
			if(this.getActiveNode(mid).getUsername().localeCompare(target) > 0){
                right = mid - 1;
            }
            else{
                left = mid + 1;
            }
        }


        if(found === false && this.getActiveNodesLength() > 0){
			if(this.getActiveNode(mid).getUsername().localeCompare(target) > 0){
                returnObject.insertLeft = true;
            }
        }

        returnObject.foundTarget = found;
        returnObject.foundIndex = mid;

        return returnObject;
		

    }
	
	insertActivePlayerNode(username){
	
		let returnValue = -1;
		let node = null;
		let result = this.binarySearchActiveNodeForInsert(username);

		/*
		console.log("************");
		this.printActiveNodes();
		console.log("************");
		*/

        if(result.foundTarget === false){

			node = this.createActiveNode(username);
            //where to insert active node?
            if(this.getActiveNodesLength() === 0 || result.foundIndex === -1){
				console.log("1st Active Node");
				this.activeNodes.push(node);
				returnValue = 0;
            }
            else{
                if(result.insertLeft){
                    console.log("2nd Active Node");
					this.activeNodes.splice(result.foundIndex, 0, node);
					returnValue = result.foundIndex;
                }
                else if(result.insertLeft === false){
                    if( (result.foundIndex + 1) >= this.getActiveNodesLength()){
                        console.log("3rd Active Node");
						this.activeNodes.push(node);
						returnValue = this.getActiveNodesLength() - 1;
                    }
                    else{
                        console.log("4th Active Node");
						this.activeNodes.splice(result.foundIndex + 1, 0, node);
						returnValue = result.foundIndex + 1;
                    }
                }
            }

			return returnValue;

        }
        else if(result.foundTarget){
			return result.foundIndex;
        }

		return -1;
    }

}

let activePlayersObject = new activePlayers();


module.exports = {

	activePlayers,
	activePlayersObject
};


	
