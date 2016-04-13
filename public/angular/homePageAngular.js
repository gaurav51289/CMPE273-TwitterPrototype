var app = angular.module('twitterhome', []);


app.controller('bodyCtrl', function($scope, $http, $interval, $timeout){

	$scope.searchShow = false;

	$scope.doSearch = function(){


		$scope.searchResult = "";
		var searchString = $scope.searchString;
		if(searchString != ""){
			$http({
				method : "POST",
				url : '/search',
				data : {
					"searchString" : searchString
				}

			}).then(function(res) {

				if(res.data.status == "OK"){
					$scope.searchShow = true;
					$scope.searchResult = res.data.result;
				}

			},function() {

			});

		}else{
			$scope.searchShow = false;
			$scope.searchResult = null;
		}
	}




	$scope.logoutUser = function(){
		$http({
			method : "POST",
			url : '/logoutUser',


		}).then(function(res){
			if(res.data.status == "OK"){
				window.location.assign("/");
			}

		}, function(){

		});
	}


	var getUserDetails = function(){
		$http({
			method : "POST",
			url : '/getUserDetails',


		}).then(function(res) {

			if(res.data.status == "OK"){
				$scope.userId = res.data.result._id;
				$scope.fullname = res.data.result.fullname;
				$scope.username = res.data.result.username;

			}

		},function() {

		});
	}
	getUserDetails();


	$scope.getLeftPanelData = function(){
		$http({
			method : "POST",
			url : '/getLeftPanelData'

		}).then(function(res) {

			if(res.data.status == "OK"){
				$scope.following_count =  res.data.following_count;
				$scope.followers_count = res.data.followers_count;
				$scope.tweets_count = res.data.tweets_count;
			}

		},function() {

		});
	}
	$scope.getLeftPanelData();


	$scope.getRightPanelUsers = function(){
		$http({
			method : "POST",
			url : '/getRightPanelUsers'

		}).then(function(res) {

			if(res.data.status == "OK"){
				var allUsers = res.data.results;
				for(i in allUsers){
					allUsers[i].showFollowButton = true;
				}
				$scope.rightPanelUsers = res.data.results;
			}

		},function() {

		});
	}
	$scope.getRightPanelUsers();


	$scope.followUser = function(user){

		var followingUserId = user._id;

		$http({
			method : "POST",
			url : '/followUser',
			data : {
				"followingUserId" : followingUserId
			}

		}).then(function(res) {

			if(res.data.status == "OK"){
				user.showFollowButton = false;
			}

		},function() {

		});
	}

	$scope.unfollowUser = function(user){

		var followingUserId = user.user_id;

		$http({
			method : "POST",
			url : '/unfollowUser',
			data : {
				"followingUserId" : followingUserId
			}

		}).then(function(res) {

			if(res.data.status == "OK"){
				user.showFollowButton = true;

			}

		},function() {

		});
	}



//.................HOME PAGE.....................................................//

	$scope.twtBoxRows = 1;
	$scope.twtBtnShow = false;
	$scope.newTweetBarShow = false;
	$scope.newTweets = [];

	var fetchTweetsFlag = $interval(function(){$scope.fetchNewTweets();}, 10000);

	$scope.fetchNewTweets = function(){

		$http({
			method : "POST",
			url : '/fetchNewTweets'

		}).then(function(res){
			if(res.data.results){
				$scope.newTweets = res.data.results;
			}
		}, function(){

		});
	}
	$scope.fetchNewTweets();


	$scope.twtBoxFocus = function(){

			$scope.twtBoxRows = 3;
			$scope.twtBtnShow = true;

	}

	$scope.twtBoxBlur = function(){
		if($scope.twtBoxContent === undefined || $scope.twtBoxContent == ""){
			$scope.twtBoxRows = 1;
			$scope.twtBtnShow = false;
		}
	}

	$scope.sendTweet = function(){
		var tweetContent = $scope.twtBoxContent;

		$http({
			method : "POST",
			url : '/sendTweet',
			data : {
				"tweetContent" : tweetContent,
			}

		}).then(function(res) {

			if(res.data.status == "OK"){

				$scope.twtBoxContent = "";
				$scope.twtBoxRows = 1;
				$scope.twtBtnShow = false;
				$scope.fetchNewTweets();
			}

		},function() {

		});
	}


	$scope.setRetweetContent = function(newTweet){


		$interval.cancel(fetchTweetsFlag);
		$scope.retweet = newTweet;
		$scope.retweetComment = "";

	}

	$scope.sendRetweet = function(retweet){
		$http({
			method : "POST",
			url : '/sendRetweet',
			data : {
				"retweetData" : {
					"retweet" : retweet,
					"comment" : $scope.retweetComment
				}
			}

		}).then(function(res) {

			if(res.data.status == "OK"){

				$scope.fetchNewTweets()
				fetchTweetsFlag = $interval(function(){$scope.fetchNewTweets();}, 5000);
			}

		},function() {

		});
	}

	$scope.$on('$destroy', function() {
          $interval.cancel(fetchTweetsFlag);
    });

});




//.................PROFILE PAGE CONTROLLERS...............//

app.controller('profilePageController', function($scope, $http, $interval, username){

	var userIdProfile;
	var loggedInUserId;

	var fetchNewTweetsProfile = function(){
		$http({
			method : "POST",
			url : '/fetchNewTweets',
			data : { "userIdProfile" : userIdProfile }

		}).then(function(res){
			if(res.data.results){
				$scope.newTweets = res.data.results;
			}

		}, function(){

		});
	}
	var fetchTweetsFlag = $interval(function(){$scope.fetchNewTweets();}, 5000);

	var getFollowingListForProfile = function(){
		$http({
			method : "POST",
			url : '/getFollowingList',
			data : {
				"profileUserId" : $scope.userDetails._id
			}

		}).then(function(res) {

			if(res.data.status == "OK"){
				followingList = res.data.results;
				$scope.followingList = followingList;
			}

		},function() {

		});
	}

	var getFollowerListForProfile = function(){
		$http({
			method : "POST",
			url : '/getFollowerList',
			data : {
				"profileUserId" : $scope.userDetails.user_id
			}

		}).then(function(res) {

			if(res.data.status == "OK"){
				followerList = res.data.results;
				$scope.followerList = followerList;
			}

		},function() {

		});
	}


	var showHideButtons = function(){
	//SHOW HIDE BUTTONS//
		console.log(userIdProfile);
		console.log(loggedInUserId);
		if(userIdProfile == loggedInUserId){
			$scope.editProfileButtonShow = true;
			$scope.unfollowButtonShow = false;
			$scope.followButtonShow = false;
			$scope.retweetDisabled = true;
		}else{

			var foundFlag = false;

			$http({
				method : "POST",
				url : '/getFollowingList',
				data : {
					"profileUserId" : loggedInUserId
				}

			}).then(function(res) {

				if(res.data.status == "OK"){

					followingListTemp = res.data.results;

					for(i in followingListTemp){

						if(followingListTemp[i].user_id == userIdProfile){
							foundFlag = true;
							break;
						}
					}

					if(foundFlag){
						$scope.editProfileButtonShow = false;
						$scope.unfollowButtonShow = true;
						$scope.followButtonShow = false;
						$scope.retweetDisabled = false;
					}else{
						$scope.editProfileButtonShow = false;
						$scope.unfollowButtonShow = false;
						$scope.followButtonShow = true;
						$scope.retweetDisabled = false;
					}

				}

			},function() {

			});

		}
	}



	var getUserDetailsProfile = function(){

		$scope.aboutMeShow = false;
		$scope.cityShow = false;
		$scope.dobShow = false;


		$http({
			method : "POST",
			url : '/getUserDetails',
			data : {"username" : username}

		}).then(function(res) {

			if(res.data.status == "OK"){
				$scope.userDetails = res.data.result;
				userIdProfile = res.data.result._id;
				loggedInUserId = res.data.loggedInUserId;

				if($scope.userDetails.aboutme) $scope.aboutMeShow = true;
				if($scope.userDetails.city) $scope.cityShow = true;
				if($scope.userDetails.dob) $scope.dobShow = true;


				fetchNewTweetsProfile();
				getFollowingListForProfile();
				getFollowerListForProfile();
				showHideButtons();
			}

		},function() {

		});
	}
	getUserDetailsProfile();





	//-----------------------------//


	$scope.saveProfileChanges = function(){

		$http({
			method : "POST",
			url : '/saveProfileChanges',
			data : {
				"profileDetails" : $scope.userDetails
			}

		}).then(function(res){
			if(res.data.results){

			}

		}, function(){

		});
	}

	$scope.logoutUser = function(){
		$http({
			method : "POST",
			url : '/logoutUser',


		}).then(function(res){
			if(res.data.status == "OK"){
				window.location.assign("/");
			}

		}, function(){

		});
	}

	$scope.setRetweetContentProfile = function(newTweet){

		$interval.cancel(fetchTweetsFlag);
		$scope.retweet = newTweet;
		$scope.retweetComment = "";

	}


	$scope.$on('$destroy', function() {
          $interval.cancel(fetchTweetsFlag);
    });


});
