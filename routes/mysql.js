var ejs= require('ejs');
var mysql = require('mysql');
var pool = [],poolStatus = [];
var CONNECTION_OPEN = 0, CONNECTION_BUSY = 1;
var minimumPoolSize = 10, maximumPoolSize = 25;

function createConnection()
{
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'mysql1989',
        database : 'twitterdb',
        port : 3306
    });
    return connection;
}

function Pool()
{
    for(var i=0; i < minimumPoolSize; ++i)
    {
        pool.push(createConnection());
        poolStatus.push(CONNECTION_OPEN);
    }
}

function addConnectionToPool()
{
    pool.push(createConnection());
    poolStatus.push(CONNECTION_OPEN);
}

Pool.prototype.getConnection = function()
{
    var poolExausted = true;
    var poolJSON;
    for(var j = 0 ; j < pool.length ; j++)
    {
        if(poolStatus[j] === CONNECTION_OPEN)
        {
            poolStatus[j] = CONNECTION_BUSY;
            poolExausted = false;
            poolJSON = [{poolObject: pool[j],poolObjectLocation: j}];
            return poolJSON;
        }
    }

    if(poolExausted && pool.length < maximumPoolSize)
    {
        addConnectionToPool();
        poolStatus[pool.length-1] = CONNECTION_BUSY;
        poolExausted = false;
        poolJSON = [{poolObject: pool[pool.length-1],poolObjectLocation: jCount}];
        return poolJSON;
    }
};

Pool.prototype.releaseConnection = function(connectionObjectLocation)
{
    if(poolStatus[connectionObjectLocation] === CONNECTION_BUSY)
    {
        poolStatus[connectionObjectLocation] = CONNECTION_OPEN;
    }
};

var p = new Pool();



//..............FETCH DATA................................//
function fetchData(callback,sqlQuery){


    var connectionFromPool = p.getConnection();
    var connection = connectionFromPool[0].poolObject;
    var connectionLocation = connectionFromPool[0].poolObjectLocation;

    connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
			callback(err,0);
		}
		else 
		{	// return err or result
			callback(err, rows);
		}
	});
    p.releaseConnection(connectionLocation);
}    



//.................INSERT DATA.....................//

function insertData(callback,sqlQuery){


    var connectionFromPool = p.getConnection();
    var connection = connectionFromPool[0].poolObject;
    var connectionLocation = connectionFromPool[0].poolObjectLocation;

    connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
			callback(err, 0);
		}
		else 
		{	// return err or result
			callback(err, rows);
		}
	});

    p.releaseConnection(connectionLocation);
} 



//.................DELETE DATA.....................//

function deleteData(callback,sqlQuery){


    var connectionFromPool = p.getConnection();
    var connection = connectionFromPool[0].poolObject;
    var connectionLocation = connectionFromPool[0].poolObjectLocation;

    connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
			callback(err, 0);
		}
		else 
		{	// return err or result
			callback(err, rows);
		}
	});

    p.releaseConnection(connectionLocation);
}


//.................UPDATE DATA.....................//

function updateData(callback,sqlQuery){


    var connectionFromPool = p.getConnection();
    var connection = connectionFromPool[0].poolObject;
    var connectionLocation = connectionFromPool[0].poolObjectLocation;

    connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
			callback(err, 0);
		}
		else 
		{	// return err or result
			callback(err, rows);
		}
	});

    p.releaseConnection(connectionLocation);
}  


exports.fetchData = fetchData;
exports.insertData = insertData;
exports.deleteData = deleteData;
exports.updateData = updateData;
