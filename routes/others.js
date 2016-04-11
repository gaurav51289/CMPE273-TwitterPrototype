
var mongo = require('./mongo');



exports.getRightPanelUsers = function(req,res){

	var userId = req.session.userId;

// 	var rightPanelUsersQuery = "select user_id,fullname,username from users where user_id not in " +
// "(select f.following_id from users u, follows f " +
// "where u.user_id = '" +userId+ "' and u.user_id = f.follower_id) and user_id != '" +userId+ "' LIMIT 3";

	mongo.find('users', {},function(err,findRes){
		if(err){
			throw err;
		}
		else
		{
			if(findRes){
				console.log(findRes);
				var jsonresp = {"status" : "OK", "results" : findRes};
				res.send(jsonresp);
			}
			else {
				console.log("Something's wrong.");

			}
		}
	});
};

exports.getLeftPanelData = function(req,res){

	var userId = req.session.userId;
	var following_count = 0
	var followers_count = 0;
	var tweets_count = 0;


	var followingCountQuery = "SELECT count(following_id) AS following_count FROM follows WHERE follower_id = '" +userId+ "'";
	var followersCountQuery = "SELECT count(follower_id) AS followers_count FROM follows WHERE following_id = '" +userId+ "'";
	var tweetsCountQuery = "SELECT count(tweet_id) AS tweets_count FROM tweets WHERE user_id = '" +userId+ "'";


	mongo.count('follows',{'follower_id' : userId},function(err,countRes){
		if(err){
			throw err;
		}
		else
		{
				following_count = countRes;
		}

	});

	mongo.count('follows',{'following_id' : userId},function(err,countRes){
		if(err){
			throw err;
		}
		else
		{
				followers_count = countRes;
		}

	});


	mysql.fetchData(function(err,results){
		if(err){
			throw err;		}
		else
		{
			if(results.length > 0){
				tweets_count = results[0].tweets_count;
				var jsonresp = {
					"following_count" : following_count,
					"followers_count" : followers_count,
					"tweets_count" : tweets_count,
					"status" : "OK"
				};
				res.send(jsonresp);

			}
			else {
				console.log("Something's wrong.");

			}
		}

	},tweetsCountQuery);

}


exports.getFollowingList = function(req, res){
	var userId = req.param("profileUserId");

	var getFollowingQuery = "SELECT * FROM twitterdb.users WHERE user_id IN (SELECT following_id FROM twitterdb.follows WHERE follower_id = '"+userId+"');";

	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else
		{
			if(results.length > 0){
				var jsonresp = {"status" : "OK", "results" : results};
				res.send(jsonresp);
			}
			else {
				console.log("Something's wrong.");

			}
		}

	},getFollowingQuery);
}

exports.getFollowerList = function(req, res){
	var userId = req.param("profileUserId");

	var getFollowerQuery = "SELECT * FROM twitterdb.users WHERE user_id IN (SELECT follower_id FROM twitterdb.follows WHERE following_id = '"+userId+"');";

	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else
		{
			if(results.length > 0){
				var jsonresp = {"status" : "OK", "results" : results};
				res.send(jsonresp);
			}
			else {
				console.log("Something's wrong.");

			}
		}

	},getFollowerQuery);
}


exports.search = function(req, res){
	var userId = req.param("profileUserId");
	var searchQuery = "SELECT tab1.*, u.user_id, u.username, u.fullname FROM " +
					  "(SELECT * FROM twitterdb.tweets WHERE hashtags LIKE '%"+req.param("searchString")+"%') tab1 " +
					  "JOIN twitterdb.users u WHERE tab1.user_id = u.user_id;"

	mysql.fetchData(function(err,results){

		if(err){
			throw err;
		}
		else
		{
			if(results.length > 0){

				jsonresp = {"result" : results, "status" : "OK"};
				res.send(jsonresp);
			}
			else {
				jsonresp = {"result" : "Nothing Found", "status" : "OK"};
				res.send(jsonresp);
			}
		}

	},searchQuery);
}
