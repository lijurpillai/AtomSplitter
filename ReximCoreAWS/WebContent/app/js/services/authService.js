'use strict';

var myServiceModule = angular.module('myApp.authServices', []);

myServiceModule.factory('AuthService',['$log','$rootScope','$http','$location',function($log,$rootScope,$http,$location){
	var msg = "";
	return{
		logIn : function(userName,password){
			$log.info("Inside logIn service--");
			$log.info("Username--" + userName + "--");			
		    $http.post('/ReximCoreAWS/api/login', {	      
		      userName: userName,
		      password: password
		    })
		    .success(function(user){
		      // No error: authentication OK
		    	  
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
	};
}]);


