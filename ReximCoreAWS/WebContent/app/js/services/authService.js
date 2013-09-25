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
		      
		    	  $rootScope.firstName = user.firstName;
			      $rootScope.lastName = user.lastName;
			      $rootScope.message = 'Authentication successful!';
			      $location.url('/view2');
		      
		    })
		    .error(function(){
		      // Error: authentication failed
		      $rootScope.showError = true;
		      $location.url('/login');
		    });
		  
		}
	};
}]);


