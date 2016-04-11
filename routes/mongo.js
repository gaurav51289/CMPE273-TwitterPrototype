//Twitter Project with Mongo

var MongoClient = require('mongodb').MongoClient;
var mongoURL = "mongodb://localhost:27017/twitterdb";
var db;
var connected = false;

/**
 * Connects to the MongoDB Database with the provided URL
 */
function connect(url, callback){
    MongoClient.connect(url, function(err, _db){
      if (err) { throw new Error('Could not connect: '+err); }
      db = _db;
      connected = true;
      console.log(connected +" is connected?");
      callback(db);
    });
};

/**
 * Returns the collection on the selected database
 */
function collection(name){
    if (!connected) {
      throw new Error('Must connect to Mongo before calling "collection"');
    }
    return db.collection(name);

};


exports.insertMany = function(collectionName,insertJSONArray,callback){

	connect(mongoURL, function(db){
		console.log('Connected to mongo at: ' + mongoURL);
		var collectionObject = collection(collectionName);
		collectionObject.insertMany(insertJSONArray,callback);//native object call for NPM
//		db.close();
	});
}

exports.insert = function(collectionName,insertJSON, callback){

	connect(mongoURL, function(db){
		console.log('Connected to mongo at: ' + mongoURL);
		var collectionObject = collection(collectionName);
		collectionObject.insert(insertJSON,callback);//native object call for NPM
//		db.close();
	});
}


exports.findOne = function(collectionName,queryJSON,callback){
	connect(mongoURL, function(db){
		console.log('Connected to mongo at: ' + mongoURL);
		var collectionObject = collection(collectionName);
		console.log(queryJSON);
		collectionObject.findOne(queryJSON,callback);
	});
}

exports.findOneUsingId = function(collectionName,idString,callback){
  var o_id = new require('mongodb').ObjectID(idString);
  var queryJSON = {_id : o_id};
	connect(mongoURL, function(db){
		console.log('Connected to mongo at: ' + mongoURL);
		var collectionObject = collection(collectionName);
		console.log(queryJSON);
		collectionObject.findOne(queryJSON,callback);
	});
}

exports.find = function(collectionName,queryJSON,callback){
	connect(mongoURL, function(db){
		console.log('Connected to mongo at: ' + mongoURL);
		var collectionObject = collection(collectionName);
		console.log(queryJSON);
		collectionObject.find(queryJSON).toArray(callback);
	});
}

exports.count = function(collectionName,queryJSON,callback){
	connect(mongoURL, function(db){
		console.log('Connected to mongo at: ' + mongoURL);
		var collectionObject = collection(collectionName);
		console.log(queryJSON);
		collectionObject.count(queryJSON, callback);
	});
}


exports.connect = connect;
exports.collection = collection;
