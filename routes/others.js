
var mongo = require('./mongo');



exports.getRightPanelUsers = function(req,res){

	var userId = req.session.userId;

	mongo.find('follows',{'follower_id' : userId},function(err,followRes){
		var followingIdsArr = [];
		for (var i in followRes) {
			followingIdsArr.push(new require('mongodb').ObjectId(followRes[i].following_id));
		}
			followingIdsArr.push(new require('mongodb').ObjectId(userId));

		var queryJSON = {_id : {$nin : followingIdsArr}};

	mongo.find('users', queryJSON,function(err,findRes){
		if(err){
			throw err;
		}
		else
		{
			if(findRes){

				var jsonresp = {"status" : "OK", "results" : findRes};
				res.send(jsonresp);
			}
			else {
				console.log("Something's wrong.");
			}
		}
	});
});
}

exports.getLeftPanelData = function(req,res){

	var userId = req.session.userId;
	var following_count = 0
	var followers_count = 0;
	var tweets_count = 0;

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


	mongo.count('tweets', {user_id : userId},function(err,countRes){
		if(err){
			throw err;		}
		else
		{

				tweets_count = countRes;
				var jsonresp = {
					"following_count" : following_count,
					"followers_count" : followers_count,
					"tweets_count" : tweets_count,
					"status" : "OK"
				};
				res.send(jsonresp);
		}
	});
}


exports.getFollowingList = function(req, res){
	var userId = req.param("profileUserId");
	mongo.find('follows',{'follower_id' : userId},function(err,followRes){
		var followingIdsArr = [];
		for (var i in followRes) {
			followingIdsArr.push(new require('mongodb').ObjectId(followRes[i].following_id));
		}
		var queryJSON = {_id : {$in : followingIdsArr}};
		mongo.find('users', queryJSON,function(err,users){
			if(err){
				throw err;
			}
			else
			{
				if(users){
					var jsonresp = {"status" : "OK", "results" : users};
					res.send(jsonresp);

				}
				else {
					console.log("Something's wrong.");
					jsonresp = {results : "NOTHING"};
					res.send(jsonresp);
				}
			}
		});
	});
}

exports.getFollowerList = function(req, res){
	var userId = req.param("profileUserId");

	mongo.find('follows',{'following_id' : userId},function(err,followRes){
		var followerIdsArr = [];
		for (var i in followRes) {
			followerIdsArr.push(new require('mongodb').ObjectId(followRes[i].follower_id));
		}
			var queryJSON = {_id : {$in : followerIdsArr}};
			mongo.find('users', queryJSON,function(err,users){
			if(err){
				throw err;
			}
			else
			{
				if(users){

					var jsonresp = {"status" : "OK", "results" : users};
					res.send(jsonresp);
				}
				else {
					console.log("Something's wrong.");
					jsonresp = {results : "NOTHING"};
					res.send(jsonresp);
				}
			}
		});
	});
}


exports.search = function(req, res){
	var userId = req.param("profileUserId");

	mongo.searchIt('tweets',req.param("searchString"),function(err,searchRes){

		if(err){
			throw err;
		}
		else
		{
			if(searchRes){

									var finalRes = [];
									var alluserIds = [];
									var userIdsByUse = {};
									Object.keys(searchRes).forEach(function(index) {
									// here, we'll first bit a list of all LogIds
									var trace = searchRes[index];

									alluserIds.push(new require('mongodb').ObjectId(trace.user_id));

											if(!userIdsByUse[trace.user_id]){
													userIdsByUse[trace.user_id] = [];
											}
											userIdsByUse[trace.user_id].push(trace);

									});

									mongo.find('users', {_id : {$in : alluserIds}}, function(err, users) {
											users.forEach(function(user) {
											//	console.log(userIdsByUse[user._id][0]);
												for (var i in userIdsByUse[user._id]) {

														userIdsByUse[user._id][i].username = user.username;
														userIdsByUse[user._id][i].fullname = user.fullname;
														finalRes.push(userIdsByUse[user._id][i]);
												}
											});
											console.log(finalRes);
											jsonresp = {result : finalRes, "status" : "OK"};
											res.send(jsonresp);
									});

			}
			else {
				jsonresp = {"result" : "Nothing Found", "status" : "OK"};
				res.send(jsonresp);
			}
		}

	});
}
