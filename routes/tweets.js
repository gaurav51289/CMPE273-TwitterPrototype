
var mongo = require('./mongo');


exports.sendTweet = function(req, res){
	// check user already exists
	var userId = req.session.userId;
	var tweetDesc = { "tweet_desc" : req.param("tweetContent"), "user_id" : userId};
	var hashTags = findHashtags(tweetDesc.tweet_desc);
	var hashTagsList = "";

	if(hashTags != -1){
		for(i in hashTags){
			var hashTag = hashTags[i];
			hashTagsList = hashTagsList + hashTag + " ";

		}
	}

	tweetDesc.hashtags = hashTagsList;
	tweetDesc.retweets_count = 0;
	tweetDesc.likes_count = 0;
	tweetDesc.timestamp = new Date();
	console.log(tweetDesc);
	mongo.insert('tweets', tweetDesc, function(err,insertRes){

		if(insertRes){
			var jsonresp = {"status" : "OK"};
			res.send(jsonresp);
		} else if(err){
				console.log("Try again later.");
		}
	});
};



//............................SEND RETWEET.....................................//

exports.sendRetweet = function(req, res){
	// check user already exists
	var userId = req.session.userId;
	var username = req.session.username;
	var retweetContent = {};
	var retweetData = req.param("retweetData");

	var retweetUserId = retweetData.retweet.user_id;
	var tweetId = retweetData.retweet.tweet_id;
	var retweetDesc = retweetData.retweet.tweet_desc;
	var retweetsCount = retweetData.retweet.retweets_count + 1;
	var basefullname = retweetData.retweet.fullname;
	var comment = retweetData.comment;

	retweetContent.tweet_desc = retweetDesc;
	retweetContent.user_id = retweetUserId;
	retweetContent.retweets_count = retweetsCount;
	retweetContent.timestamp = new Date();
	retweetContent.isretweet = 1;
	retweetContent.basetweet_id = tweetId;
	retweetContent.retweetedby = username;

	mongo.insert('tweets', retweetContent,function(err,insertRes){

		if(insertRes){
			var jsonresp = {"status" : "OK"};
			res.send(jsonresp);
		} else if(err){
				console.log("Try again later.");
		}

	});

	var otweetId = new require('mongodb').ObjectId(tweetId);
	mongo.updateRetweetCount('tweets', {_id : otweetId}, 1);
};




exports.fetchNewTweets = function(req,res){

	var jsonresp;
	var userId = req.session.userId;
	var username = req.session.username;

	if(req.param("userIdProfile")){

		var userIdProfile = req.param("userIdProfile");

		var queryJSON = {user_id : userIdProfile};
		mongo.find('tweets', queryJSON,function(err,tweets){
			if(err){
				throw err;
			}
			else
			{
				if(tweets){
					var finalRes = [];
					var alluserIds = [];
					var userIdsByUse = {};
					Object.keys(tweets).forEach(function(index) {
					// here, we'll first bit a list of all LogIds
					var trace = tweets[index];

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
						//	console.log(finalRes);
							jsonresp = {results : finalRes};
							res.send(jsonresp);
					});


				}
				else {
					console.log("Something's wrong.");
					jsonresp = {results : "NOTHING"};
					res.send(jsonresp);
				}
			}

		});

	}else{
			mongo.find('follows',{'follower_id' : userId},function(err,followRes){
				var followingIdsArr = [];
				for (var i in followRes) {
					followingIdsArr.push(followRes[i].following_id);
				}
					followingIdsArr.push(userId);
				var queryJSON = {user_id : {$in : followingIdsArr}};
				mongo.find('tweets', queryJSON,function(err,tweets){
					if(err){
						throw err;
					}
					else
					{
						if(tweets){
													var finalRes = [];
													var alluserIds = [];
													var userIdsByUse = {};
													Object.keys(tweets).forEach(function(index) {
													// here, we'll first bit a list of all LogIds
													var trace = tweets[index];

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
														//	console.log(finalRes);
															jsonresp = {results : finalRes};
															res.send(jsonresp);
													});

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
};


var findHashtags = function(searchText) {
    var regexp = /\B\#\w\w+\b/g
    result = searchText.match(regexp);
    if (result) {
        return result;
    } else {
        return -1;
    }
};
