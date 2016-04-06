//loading the 'login' angularJS module
var app = angular.module('users', []);

//Defininf the menu controller

app.controller('signUpController', function($scope, $http){

	$scope.hideSignUp1 = false;
	$scope.page1error = false;
	$scope.hideSignUp2 = true;
	$scope.page2error = false;
	$scope.hideSignUp3 = true;
	$scope.page3error = false;
	$scope.page3username = false;

	$scope.doSignUp = function(){
		if($scope.fullName && $scope.password){
			$scope.hideSignUp1 = true;
			$scope.hideSignUp2 = false;
		}else{
			$scope.page1error = true;
		}
		
	}


	$scope.doRegisterPhone = function(){
		if($scope.emailId && $scope.phoneNo){
			$scope.hideSignUp2 = true;
			$scope.hideSignUp3 = false;
		}else{
			$scope.page2error = true;
		}
		
	}

	$scope.doRegisterUsername = function() {
		if($scope.username){
			$http({
			method : "POST",
			url : '/signUpUser',
			data : {
				"fullname" : $scope.fullName,
				"password" : $scope.password,
				"emailid" : $scope.emailId,
				"phoneno" : $scope.phoneNo,
				"username" : $scope.username

			}

			}).then(function(res) {
			
				if(res.data.status == "OK")
					window.location.assign("/twitterhome"); 
				if(res.data.status == "ERR")
					$scope.page3username = true;
			},function() {
			
			});
		}else{
			$scope.page3error = true;
		}
		
	}



});




//login controller_______________________________________________________________________________________//

app.controller('loginController', function($scope, $http){


	$scope.loginUser = function() {

		$http({
			method : "POST",
			url : '/loginUser',
			data : {
				"username" : $scope.username,
				"password" : $scope.password
			}

		}).then(function(res) {
			if(res.data.status == "OK")	
			window.location.assign("/twitterhome"); 
		},function() {
			
		});
	}



});
