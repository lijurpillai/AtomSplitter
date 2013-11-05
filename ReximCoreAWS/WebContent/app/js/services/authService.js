'use strict';

var myServiceModule = angular.module('myApp.authServices', []);

myServiceModule.factory('AuthService',['$log','$rootScope','$http','$location','Constants','RuleData'
                                       ,function($log,$rootScope,$http,$location,Constants,RuleData){
	var userProfile = "";	
	return{
		logIn : function(userName,password){
			$log.info("Inside logIn service--");				
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
				    	//No error: authentication OK
				    	if(sessionStorage){
				    		// setting userProfile in session storage
				    		sessionStorage.setItem(Constants.SESS_KEY_USER_PROFILE,angular.toJson(user));
				    		$rootScope.loginTime = Date.now();
				    	}
				    	   // resetting auth error cause by incorrect login
				    	  $rootScope.SHOW_AUTH_ERROR = false;
				    	  $http.post('/ReximCoreAWS/api/getrule', {	      
						      orgName: user.org,
						      orgId: user.orgId
						    }).success(function(rule){
						    	console.log(rule);
						    	if(sessionStorage){
						    		// setting userProfile in session storage
						    		//sessionStorage.setItem(Constants.SESS_KEY_RULE_PROFILE,angular.toJson(rule));
						    		//**set rule config data**//
						    		RuleData.setRuleConfig(rule);
						    	}
						    });
					      $location.url('/dashboard');				      
				    })
				    .error(function(){
				      // Error: authentication failed
				      $rootScope.SHOW_AUTH_ERROR = true;
				      $location.url('/login');
				    });				
			}
		},
		getUserProfile: function(){
			var userProfile = "";
			$log.info("Inside getUserProfile");
			if(sessionStorage){
				userProfile = JSON.parse(sessionStorage.getItem(Constants.SESS_KEY_USER_PROFILE));
			}			
			return userProfile;
		}
	};
}]);


