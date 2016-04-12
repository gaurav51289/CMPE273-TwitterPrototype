
var mongo = require('./mongo');

exports.loadProfile = function(req,res){

  		res.render('profile', {"username" : req.param("id")});
      
};



exports.followUser = function(req,res){

	var userId = req.session.userId;
	var followingUserId = req.param("followingUserId");

	// var followUserQuery = "INSERT INTO `twitterdb`.`follows` (`follower_id`, `following_id`) "+
	// "VALUES ('" + userId + "', '" + followingUserId + "');" ;
  var queryJSON = {follower_id : userId, following_id : followingUserId};

	mongo.insert('follows', queryJSON,function(err,insertRes){

		if(insertRes){
			var jsonresp = {"status" : "OK"};
			res.send(jsonresp);
		} else if(err){

			if(0){

			} else {
				console.log("Try again later.");
			}
		}
	});
};


exports.unfollowUser = function(req,res){

	var userId = req.session.userId;
	var followingUserId = req.param("followingUserId");

	// var unfollowQuery = "DELETE FROM `twitterdb`.`follows` WHERE `follower_id`='" + userId + "' and `following_id`='" + followingUserId + "';";

  var queryJSON = {follower_id : userId, following_id : followingUserId};

	mongo.remove('follows', queryJSON, function(err,removeRes){

		if(removeRes){
			var jsonresp = {"status" : "OK"};
			res.send(jsonresp);
		} else if(err){
				console.log("Try again later.");
		}

	});

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
