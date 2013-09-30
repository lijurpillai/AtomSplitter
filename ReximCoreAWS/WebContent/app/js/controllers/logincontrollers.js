'use strict';

/* Controllers */

angular.module('myApp.authControllers', []).
  controller('LoginCtrl',['$scope','AuthService','SessionManager','Constants',function($scope,AuthService,SessionManager,Constants){
	  SessionManager.clearSession(Constants.SESS_KEY_USER_PROFILE);
	  $scope.user = {};// User object	  
	  $scope.login = function(){	
		AuthService.logIn($scope.user.userName,$scope.user.password);// calling loginService
		console.log("inside login control");		
	  };
  }]);