'use strict';

var myServiceModule = angular.module('myApp.authServices', []);

myServiceModule.factory('AuthService',['$log','$rootScope','$http','$location',function($log,$rootScope,$http,$location){
	var userProfile = "";	
	return{
		logIn : function(userName,password){
			$log.info("Inside logIn service--");
			$log.info("Username--" + userName + "--");	
			if(userName == null || userName == " "){
				$rootScope.SHOW_USER_ERROR = true;				
			}
			if(password == null || password == " "){
				$rootScope.SHOW_PWD_ERROR = true;				
			}
			if($rootScope.SHOW_USER_ERROR == false && $rootScope.SHOW_PWD_ERROR == false){
				$http.post('/ReximCoreAWS/api/login', {	      
				      userName: userName,
				      password: password
				    })
				    .success(function(user){
				      // No error: authentication OK
				    	  $rootScope.USER_PROFILE = user;
				    	  $rootScope.FIRST_NAME = user.firstName;
				    	  $rootScope.LAST_NAME = user.lastName;	
				    	  	// resetting auth error cause by incorrect login
				    	  $rootScope.SHOW_AUTH_ERROR = false;
					      $location.url('/dashboard');
				      
				    })
				    .error(function(){
				      // Error: authentication failed
				      $rootScope.SHOW_AUTH_ERROR = true;
				      $location.url('/login');
				    });				
			}
		},
		USERPROFILE: userProfile
	};
}]);


