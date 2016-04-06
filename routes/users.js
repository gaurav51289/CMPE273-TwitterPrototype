var ejs = require("ejs");
var mysql = require('./mysql');
const crypto = require('crypto');




exports.signUpUser = function(req, res){
	// check user already exists
	
	var userDetails = req.param("userDetails");
	var password = req.param("password");
	var username = req.param("username");

	const salt = crypto.randomBytes(16).toString('hex');
	const enPassword = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256').toString('hex');


	var insertUser = "INSERT INTO `twitterdb`.`users` (`fullname`, `emailid`, `password`, `salt`, `phoneno`, `username`) " +
			"VALUES " +
			"('" +
			req.param("fullname") +
			"', '" +
			req.param("emailid") +
			"', '" +
			enPassword +
			"', '" +
			salt +
			"', '" +
			req.param("phoneno") +
			"', '" +
			username +
			"');";
	
	mysql.insertData(function(err,results){
		
		if(results.affectedRows > 0){

			var getUserIdQuery = "SELECT `user_id` FROM `twitterdb`.`users` WHERE username = '"+username+"'";

			mysql.fetchData(function(err,results){

				if(results.length > 0){
					req.session.userId = results[0].user_id;
					req.session.username = username;
				   	var jsonResponse = {"status" : "OK"};
				   	res.send(jsonResponse);

				} else {
					console.log("Error in sign up userid.");
				}


			},getUserIdQuery);



		} else if(err){
				
				if(err.message.includes("username_UNIQUE")){
					var jsonResponse = {"status" : "ERR"};
					res.send(jsonResponse);
				} else {    
					
				}
		}  	
		
	},insertUser);
};





exports.loginUser = function(req,res){
	var username = req.param("username");
	var password = req.param("password");

	var loginQuery="SELECT `user_id`,`password`,`salt` FROM `twitterdb`.`users` WHERE username='"+username+"' LIMIT 1";
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				//req.session.username = username;
				//ejs.renderFile('./views/twitterhome.ejs',{data: results}, function(err, result) {
	   				// render on success
					   if (!err) {
				   			
					   		var passwordDB = results[0].password;
					   		var saltDB = results[0].salt;

					   		passwordIN = crypto.pbkdf2Sync(password, saltDB, 100000, 64, 'sha256').toString('hex');	


							if (passwordIN == passwordDB){
				   				req.session.userId = results[0].user_id;
				   				req.session.username = username;
				   				var jsonResponse = {"status" : "OK"};
				   				res.send(jsonResponse);
				   			} else {
				   				var jsonResponse = {"status":"INVALID_LOGIN"};
				   				res.send(jsonResponse);
				   				console.log("Login Err1");
				   			}
				   		}
				   	// render or error
				   		else {
				   			res.end('An error occurred');
				   			console.log(err);
				   		}
				
			}
			else
				{
					var jsonResponse = {"status":"INVALID_LOGIN"};
				   	res.send(jsonResponse);
				   	console.log("Login Err1");
				}
		}
	},loginQuery);
}



exports.getUserDetails = function(req, res){

	var userId = req.session.userId;

	if(req.param("username")){
		var username = req.param("username");
		var getUserDetails = "SELECT user_id, username, fullname, aboutme, emailid, phoneno, city, DATE_FORMAT(dob,'%Y-%m-%d') AS dobshow, DATE_FORMAT(dob,'%M %d, %Y') AS dobf, DATE_FORMAT(joinedon,'%M, %Y') AS joinedonf FROM `twitterdb`.`users` WHERE username='" +username+ "'";		
	}else{
		var getUserDetails = "SELECT user_id, username, fullname, aboutme, emailid, phoneno, city, DATE_FORMAT(dob,'%Y-%m-%d') AS dobshow, DATE_FORMAT(dob,'%M %d, %Y') AS dobf, DATE_FORMAT(joinedon,'%M, %Y') AS joinedonf FROM `twitterdb`.`users` WHERE user_id='" +userId+ "'";
	}

	
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				jsonresp = {result : results[0], "status" : "OK", "loggedInUserId" : userId};		
				res.send(jsonresp);	
			}
			else {    
				console.log("Something's wrong.");
				
			}
		}
	},getUserDetails);
}

exports.logoutUser = function(req, res){

	req.session.destroy();
	var jsonresp = {"status" : "OK"};

	res.send(jsonresp);

}