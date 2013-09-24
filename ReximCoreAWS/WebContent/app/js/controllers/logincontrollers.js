'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('dashboardCtrl', [function() {
	  // To do
  }])
  .controller('adminCtrl', [function() {
	// To do
  }])
  .controller('LoginCtrl',['$scope','AuthService'
                           ,function(scope,AuthService){
	  scope.user = {};// User object	  
	  scope.login = function(){	
		AuthService.logIn(scope.user.userName,scope.user.password);// calling loginService
		console.log("inside login control");		
	  };
  }]);