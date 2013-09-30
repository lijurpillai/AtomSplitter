'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters',
                         'myApp.authServices','myApp.pubNubServices','myApp.utilServices',
                         'myApp.authDirectives',
                         'myApp.authControllers','myApp.indexControllers','myApp.dashBoardControllers','myApp.actionTableCtrl',
                         'ngResource']).
  config(['$routeProvider','$httpProvider', function($routeProvider,$httpProvider) {
	
	//================================================
	    // Check if the user is connected
	    //================================================
	    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope,SessionManager,Constants){
	      // Initialize a new promise
	      var deferred = $q.defer();

	      // Make an AJAX call to check if the user is logged in
	      $http.get('/ReximCoreAWS/api/loggedin').success(function(userProfile){
	        // Authenticated
	    	console.log(userProfile);
	        if (userProfile !== null){
	          $timeout(deferred.resolve, 0);
	          	// setting navbar links on login
	          $rootScope.isLoggedIn = true;
	          $rootScope.FIRST_NAME = userProfile.firstName;
	          $rootScope.LAST_NAME = userProfile.lastName;
	        }
	        // Not Authenticated
	        else {
	          SessionManager.clearSession(Constants.SESS_KEY_USER_PROFILE);
	          $timeout(function(){deferred.reject();}, 0);
	          $location.url('/login');	          
	        }
	      });

	      return deferred.promise;
	    };
	//================================================   
	  //================================================
	    // Add an interceptor for AJAX errors
	    //================================================
	    $httpProvider.responseInterceptors.push(function($q, $location) {
	      return function(promise) {
	        return promise.then(
	          // Success: just return the response
	          function(response){
	            return response;
	          }, 
	          // Error: check the error status to get only the 401
	          function(response) {
	            if (response.status === 403)
	              $location.url('/login');
	            return $q.reject(response);
	          }
	        );
	      }
	    });
	    //================================================
	

	$routeProvider.when('/login',
		{
			templateUrl: 'partials/login.html',
			controller: 'LoginCtrl'
		});
    $routeProvider.when('/dashboard',
    	{
    		templateUrl: 'partials/dashboard.html',
    		//controller: 'dashboardCtrl',
    		resolve: {
  	          loggedin: checkLoggedin
  	        }
    		
    	});
    $routeProvider.when('/actiontable',
    	{
    		templateUrl: 'partials/actiontable.html',
    		//controller: 'adminCtrl',
    		resolve: {
    	          loggedin: checkLoggedin
    	        }
    	});
    $routeProvider.otherwise({redirectTo: '/dashboard'});
  }])
  
  	.run(['$rootScope', '$http','SessionManager','Constants',function ($rootScope, $http,SessionManager,Constants) {
  		
  		$rootScope.message = '';
  	    // Logout function is available in any pages
  	    $rootScope.logout = function(){
  	      console.log("inside logout");
  	      SessionManager.clearSession(Constants.SESS_KEY_USER_PROFILE);
  	      $http.post('/ReximCoreAWS/api/logout').success(function(resCode) {
  	      $rootScope.isLoggedIn = false;
		});
  	    };
  	
  	}]);
