var ejs = require("ejs");
var mysql = require('./mysql');

exports.loadProfile = function(req,res){

  		res.render('profile', {"username" : req.param("id")});

};



exports.followUser = function(req,res){

	var userId = req.session.userId;
	var followingUserId = req.param("followingUserId");

	var followUserQuery = "INSERT INTO `twitterdb`.`follows` (`follower_id`, `following_id`) "+
	"VALUES ('" + userId + "', '" + followingUserId + "');" ;


	mysql.insertData(function(err,results){
		
		if(results.affectedRows > 0){

			var jsonresp = {"status" : "OK"};
			res.send(jsonresp);

		} else if(err){
				
			if(0){
					
			} else {    		
				console.log("Try again later.");
			}
		}  	
		
	},followUserQuery);

};


exports.unfollowUser = function(req,res){

	var userId = req.session.userId;
	var followingUserId = req.param("followingUserId");

	var unfollowQuery = "DELETE FROM `twitterdb`.`follows` WHERE `follower_id`='" + userId + "' and `following_id`='" + followingUserId + "';";



	mysql.insertData(function(err,results){
		
		if(results.affectedRows > 0){

			var jsonresp = {"status" : "OK"};
			res.send(jsonresp);

		} else if(err){
				
			if(0){
					
			} else {    		
				console.log("Try again later.");
			}
		}  	
		
	},unfollowQuery);

};

exports.saveProfileChanges = function(req, res){

	var userId = req.session.userId;
	var profileDetails = req.param("profileDetails");

	var updateProfileChanges = "UPDATE `twitterdb`.`users` SET aboutme = '"+profileDetails.aboutme+"', " + 
								"city = '"+profileDetails.city+"', " +
								"emailid = '"+profileDetails.emailid+"', " +
								"phoneno = '"+profileDetails.phoneno+"' " +
								//"dob = '"+profileDetails.dobshow+"' " +             add comma above
								"WHERE `user_id`='" +userId+ "';"
	
	mysql.updateData(function(err,results){
		
		if(results.affectedRows > 0){

			var jsonresp = {"status" : "OK"};
			res.send(jsonresp);

		} else if(err){
				
			if(0){
					
			} else {    		
				console.log("Try again later.");
			}
		}  	
		
	},updateProfileChanges);

};
