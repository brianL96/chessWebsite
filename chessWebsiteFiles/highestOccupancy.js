
console.log("Inside highestOccupancy file");

class highestOccupancyObjectArray{

    constructor(){
        this.container = [];
    }

    addMultipleObjects(a){

        let amount = a;

        while(amount > 0){
            this.addObject();
            amount--;
        }
    }

    addObject(){
        let value = this.container.length;
        this.container.push(new highestOccupancyObject(value));
    }

    getHighestOccupancyObject(index){

        if(index < 0 || index >= this.container.length){
            return null;
        }

        return this.container[index];
    }

    printHighestOccupancyObject(index){

        if(index < 0 || index >= this.container.length){
            return;
        }
        
        console.log(this.container[index]);
    }

    printHighestOccupancyArray(){

        let length = this.container.length;
        let index = 0;

        console.log("Amount of elements in highest occupancy array: " + this.container.length);

        while(index < length){
            console.log(this.getHighestOccupancyObject(index));
            index++;
        }
    }
}

class highestOccupancyObject{

    constructor(gameMode){
        this.gameMode = gameMode;
        this.currentOccupancy = 0;
        this.highestOccupancy = 0;
        this.currentOccupancyTime = null;
        this.highestOccupancyTime = null;
    }

    getGameMode(){
        return this.gameMode;
    }

    getCurrentOccupancy(){
        return this.currentOccupancy;
    }

    setCurrentOccupancy(occupancy){
        this.currentOccupancy = occupancy;
    }

    getHighestOccupancy(){
        return this.highestOccupancy;
    }

    setHighestOccupancy(occupancy){
        this.highestOccupancy = occupancy;
    }

    getCurrentOccupancyTime(){
        return this.currentOccupancyTime;
    }

    setCurrentOccupancyTime(occupancyTime){
        this.currentOccupancyTime = occupancyTime;
    }

    getHighestOccupancyTime(){
        return this.highestOccupancyTime;
    }

    setHighestOccupancyTime(occupancyTime){
        this.highestOccupancyTime = occupancyTime;
    }

    getSecondsLapsed(dateObject){
        if(dateObject === null){
            return null;
        }
        let presentTime = new Date();
        let seconds = Math.floor(((presentTime.getTime() - dateObject.getTime())/1000));
        return seconds;
    }

    incrementCurrentOccupancy(){
        this.setCurrentOccupancy(this.getCurrentOccupancy() + 1);
        console.log("*******************************************************");
        console.log("Game Mode: " + this.getGameMode() + " current occupancy set to: " + this.getCurrentOccupancy());
        console.log("*******************************************************");
        this.setMaxOccupancy();
    }

    setMaxOccupancy(){

        if(this.getCurrentOccupancy() === this.getHighestOccupancy()){
            console.log("*******************************************************");
            console.log("Game Mode: " + this.getGameMode() + " reached old highest occupancy, starting to count.");
            console.log("*******************************************************");
            this.setCurrentOccupancyTime(new Date());
		}
		else if(this.getCurrentOccupancy() > this.getHighestOccupancy()){
            console.log("*******************************************************");
            console.log("Game Mode: " + this.getGameMode() + " new highest occupancy set, starting to count.");
            console.log("*******************************************************");
            this.setHighestOccupancy(this.getCurrentOccupancy());
			this.setHighestOccupancyTime(null);
            this.setCurrentOccupancyTime(new Date());
		}

    }

    decrementCurrentOccupancy(){

		if(this.getCurrentOccupancy() === this.getHighestOccupancy()){
			if(this.getHighestOccupancyTime() === null || this.getSecondsLapsed(this.getCurrentOccupancyTime()) > this.getHighestOccupancyTime()){
				this.setHighestOccupancyTime(this.getSecondsLapsed(this.getCurrentOccupancyTime()));
                console.log("*******************************************************");
                console.log("Game Mode: " + this.getGameMode() + " new highest occupancy time set: " + this.getHighestOccupancyTime());
                console.log("*******************************************************");
			}
		}

        this.setCurrentOccupancyTime(null);
		this.setCurrentOccupancy(this.getCurrentOccupancy() - 1);
    }

    getUpdatedHighestOccupancyTime(){

        let returnData = {
            currentlyCounting: false,
            highestTime: null
        };

		if(this.getHighestOccupancyTime() === null){
            console.log("*******************************************************");
            console.log("Game Mode: " + this.getGameMode() + " highestOccupancyTime is null.");
            console.log("*******************************************************");
			returnData.currentlyCounting = true;
			returnData.highestTime = this.getSecondsLapsed(this.getCurrentOccupancyTime());
		}
		else if(this.getCurrentOccupancyTime() !== null && this.getHighestOccupancyTime() !== null){
			if(this.getSecondsLapsed(this.getCurrentOccupancyTime()) >= this.getHighestOccupancyTime()){
                console.log("*******************************************************");
                console.log("Game Mode: " + this.getGameMode() + " currentOccupancyTime is highest.");
                console.log("*******************************************************");
				returnData.currentlyCounting = true;
				returnData.highestTime = this.getSecondsLapsed(this.getCurrentOccupancyTime());
			}
			else{
                console.log("*******************************************************");
                console.log("Game Mode: " + this.getGameMode() + " highestOccupancyTime is highest.");
                console.log("*******************************************************");
				returnData.currentlyCounting = false;
				returnData.highestTime = this.getHighestOccupancyTime();
			}
		}
		else{
            console.log("*******************************************************");
            console.log("Game Mode: " + this.getGameMode() + " only currentOccupancyTime is null.");
            console.log("*******************************************************");
			returnData.currentlyCounting = false;
			returnData.highestTime = this.getHighestOccupancyTime();
		}

        return returnData;
    }


}


let occupancyArray = new highestOccupancyObjectArray();

module.exports = {
    occupancyArray
};