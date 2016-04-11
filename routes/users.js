var ejs = require("ejs");
//var mysql = require('./mysql');
var mongo = require('./mongo')
const crypto = require('crypto');




exports.signUpUser = function(req, res){
	// check user already exists

	var userDetails = req.param("userDetails");

	const salt = crypto.randomBytes(16).toString('hex');
	const enPassword = crypto.pbkdf2Sync(userDetails.password, salt, 100000, 64, 'sha256').toString('hex');

	userDetails.password = enPassword;
	userDetails.salt = salt;

	mongo.insert('users', userDetails, function(err,insertRes){
		console.log(insertRes);
		if(insertRes){
			mongo.findOne('users', {username : userDetails.username} ,function(err,findOneRes){
				console.log(findOneRes);
				if(findOneRes){
					req.session.userId = findOneRes._id;
					req.session.username = userDetails.username;
				   	var jsonResponse = {"status" : "OK"};
						console.log(jsonResponse);
				   	res.send(jsonResponse);
				} else {
					console.log("Error in sign up userid.");
				}
			});
		} else if(err){

				if(err.message.includes("username_UNIQUE")){
					var jsonResponse = {"status" : "ERR"};
					res.send(jsonResponse);
				} else {

				}
		}

	});
};





exports.loginUser = function(req,res){
	var username = req.param("username");
	var password = req.param("password");

	mongo.findOne('users', {username : username}, function(err,findOneRes){
		if(err){
			throw err;
		}
		else
		{
			if(findOneRes){

					   		var passwordDB = findOneRes.password;
					   		var saltDB = findOneRes.salt;

					   		passwordIN = crypto.pbkdf2Sync(password, saltDB, 100000, 64, 'sha256').toString('hex');

							if (passwordIN == passwordDB){
								req.session.userId = findOneRes._id;
								req.session.username = findOneRes.username;
				   				var jsonResponse = {"status" : "OK"};
				   				res.send(jsonResponse);
				   			} else {
				   				var jsonResponse = {"status":"INVALID_LOGIN"};
				   				res.send(jsonResponse);
				   				console.log("Login Err1");
				   			}
			}
			else
			{
					var jsonResponse = {"status":"INVALID_LOGIN"};
				   	res.send(jsonResponse);
				   	console.log("Login Err1");
			}
		}
	});
}



exports.getUserDetails = function(req, res){

	var userId = req.session.userId;
	var queryJSON;

	if(req.param("username")){
		queryJSON = {username : req.param("username")};
		mongo.findOne('users', queryJSON, function(err,findOneRes){
			if(err){
				throw err;
			}
			else
			{
				console.log(findOneRes);
				if(findOneRes){
					jsonresp = {result : findOneRes, "status" : "OK", "loggedInUserId" : userId};
					res.send(jsonresp);
				}
				else {
					console.log("Something's wrong.");
				}
			}
		});
	}else{
		mongo.findOneUsingId('users', userId, function(err,findOneRes){
			if(err){
				throw err;
			}
			else
			{
				console.log(findOneRes);
				if(findOneRes){
					jsonresp = {result : findOneRes, "status" : "OK", "loggedInUserId" : userId};
					res.send(jsonresp);
				}
				else {
					console.log("Something's wrong.");
				}
			}
		});
	}
}

exports.logoutUser = function(req, res){

	req.session.destroy();
	var jsonresp = {"status" : "OK"};

	res.send(jsonresp);

}
