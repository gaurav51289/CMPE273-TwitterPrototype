var ejs = require("ejs");
var mysql = require('./mysql');


exports.sendTweet = function(req, res){
	// check user already exists
	var userId = req.session.userId;
	var tweetDesc = req.param("tweetContent");
	var hashTags = findHashtags(tweetDesc);
	var hashTagsList = "";

	if(hashTags != -1){
		for(i in hashTags){
			var hashTag = hashTags[i];
			hashTagsList = hashTagsList + " " + hashTag;

			var insertHash = "INSERT INTO `twitterdb`.`hashtags` (`hashtag`) VALUES ('"+ hashTag +"');"

				mysql.insertData(function(err,results){
					
					if(results.affectedRows > 0){
						
						console.log("Hash inserted");
					} else if(err){
						
						if(err.message.includes("username_UNIQUE")){
							msg = "UsernameNotAvailable";
							console.log(msg);
						} else {    
							msg = "TryAgainLater";
							
							console.log("Something's wrong");
						}
					}  	

				},insertHash);
		}
	}


	var insertTweet = "INSERT INTO `twitterdb`.`tweets` (`user_id`, `tweet_desc`, `hashtags`, `retweets_count`, `likes_count`, `image`,`video`) " +
			"VALUES " +
			"('" +
			userId +
			"', '" +
			tweetDesc +
			"', '" +
			hashTagsList +
			"', '" +
			"0" +
			"', '" +
			"0" +
			"', " +
			"null" +
			", " +
			"null" +
			");";
	
	
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
		
	},insertTweet);
};



//............................SEND RETWEET.....................................//

exports.sendRetweet = function(req, res){
	// check user already exists
	var userId = req.session.userId;
	var username = req.session.username;
	var retweetData = req.param("retweetData");

	var retweetUserId = retweetData.retweet.user_id;
	var tweetId = retweetData.retweet.tweet_id;
	var retweetDesc = retweetData.retweet.tweet_desc;
	var retweetsCount = retweetData.retweet.retweets_count + 1;
	var basefullname = retweetData.retweet.fullname;
	var comment = retweetData.comment;

	var hashTags = findHashtags(retweetDesc);
	var hashTagsList = "";

	if(hashTags != -1){
		for(i in hashTags){
			var hashTag = hashTags[i];
			hashTagsList = hashTagsList + " " + hashTag;

			var insertHash = "INSERT INTO `twitterdb`.`hashtags` (`hashtag`) VALUES ('"+ hashTag +"');"

				mysql.insertData(function(err,results){
					
					if(results.affectedRows > 0){
						
						console.log("Hash inserted");
					} else if(err){
						
						if(err.message.includes("username_UNIQUE")){
							msg = "UsernameNotAvailable";
							console.log(msg);
						} else {    
							msg = "TryAgainLater";
							
							console.log("Something's wrong");
						}
					}  	

				},insertHash);
		}
	}


	var insertRetweet = "INSERT INTO `twitterdb`.`tweets` " +
			"(`user_id`, `tweet_desc`, `hashtags`, `retweets_count`, `likes_count`, `image`,`video`,`isretweet`,`basetweet_id`,`retweetedby`) " +
			"VALUES " +
			"('" +
			retweetUserId +
			"', '" +
			retweetDesc +
			"', '" +
			hashTagsList +
			"', '" +
			retweetsCount +
			"', '" +
			"0" +
			"', " +
			"null" +
			", " +
			"null" +
			", '" +
			"1" +
			"', '" +
			tweetId+
			"', '" +
			username+
			"');";		
	
	mysql.insertData(function(err,results){
		console.log(insertRetweet);
		if(results.affectedRows > 0){

			var jsonresp = {"status" : "OK"};
			res.send(jsonresp);

		} else if(err){
				
			if(0){
					
			} else {    		
				console.log("Try again later.");
			}
		}  	
		
	},insertRetweet);

	//updateRetweet Count
	var updateRetweetCount = "UPDATE `twitterdb`.`tweets` SET retweets_count=retweets_count+1  WHERE `tweet_id`='" +tweetId+ "';"
	
	mysql.updateData(function(err,results){},updateRetweetCount);



};




exports.fetchNewTweets = function(req,res){

	var jsonresp;
	var userId = req.session.userId;
	var username = req.session.username;

	if(req.param("userIdProfile")){
		var userIdProfile = req.param("userIdProfile");
		var newTweetsQuery = "SELECT * FROM (SELECT * from `twitterdb`.`tweets` t WHERE t.user_id = '" +userIdProfile+ "') tab1 " + 
							 "JOIN `twitterdb`.`users` u WHERE u.user_id = tab1.user_id ";		
	}else{
		var newTweetsQuery = "SELECT tab1.*, u.user_id, u.username, u.fullname FROM " +
		"(SELECT * FROM `twitterdb`.`tweets` t WHERE t.user_id = '" +userId+ "'" +
		"OR t.user_id IN (SELECT following_id from `twitterdb`.`follows` f WHERE f.follower_id = '" +userId+ "')) tab1 " +
		"JOIN users u WHERE tab1.user_id = u.user_id";	
	}
	
	

	

	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){

				jsonresp = {results : results};		
				res.send(jsonresp);	
			}
			else {    
				console.log("Something's wrong.");
				jsonresp = {results : "NOTHING"};	
				res.send(jsonresp);	
			}
		}

	},newTweetsQuery);

	/*var newRetweetsQuery = "SELECT * FROM twitterdb.retweets r JOIN twitterdb.tweets t WHERE r.tweet_id = t.tweet_id " + 
	"AND r.user_id IN (SELECT following_id from `twitterdb`.`follows` f WHERE f.follower_id = '" +userId+ "')";

	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){

				jsonresp = {results : results};
				res.send(jsonresp);				
			}
			else {    
				console.log("Something's wrong.");
				
			}
		}

	},newRetweetsQuery);*/
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