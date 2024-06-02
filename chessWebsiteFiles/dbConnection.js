
console.log("Inside DB Connection");
const access = require('./accessFile.js');
const mysql = require('mysql2');

class databaseExportObjectClass{

    constructor(){
        this.connection = null;
    }

	setConnection(connection){
		this.connection = connection;
	}

	getConnection(){
		return this.connection;
	}

}

let database = null;

let databaseExportObject = new databaseExportObjectClass();

let dbPool = mysql.createPool({
	host: access.databaseHost,
	user: access.databaseUser,
	password: access.databasePassword,
	database: access.databaseName,
	waitForConnections : true,
	connectionLimit : 10,
	maxIdle : 10,
	idleTimeout : 60000,
	queueLimit : 0,
	enableKeepAlive : true,
	keepAliveInitialDelay : 0
});


dbPool.on("acquire", () => {
	//console.log("Important: Connection Acquired");
});

dbPool.on("connection", () => {
	//console.log("Important: Pool Connection Made");
});

dbPool.on("release", () => {
	//console.log("Important: Pool Connection Released");
});

databaseExportObject.setConnection(dbPool);

module.exports = {
	databaseExportObject,
	database
};