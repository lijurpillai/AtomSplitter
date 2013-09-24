'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.authServices', 'myApp.directives', 'myApp.controllers','ngResource']).
  config(['$routeProvider','$httpProvider', function($routeProvider,$httpProvider) {
	
	//================================================
	    // Check if the user is connected
	    //================================================
	    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
	      // Initialize a new promise
	      var deferred = $q.defer();

	      // Make an AJAX call to check if the user is logged in
	      $http.get('/ReximCoreAWS/api/loggedin').success(function(userProfile){
	        // Authenticated
	    	console.log(userProfile);
	        if (userProfile !== null)
	          $timeout(deferred.resolve, 0);

	        // Not Authenticated
	        else {
	          $rootScope.message = 'You need to log in.';
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
    		controller: 'dashboardCtrl',
    		resolve: {
  	          loggedin: checkLoggedin
  	        }
    		
    	});
    $routeProvider.when('/admin',
    	{
    		templateUrl: 'partials/admin.html',
    		controller: 'adminCtrl',
    		resolve: {
    	          loggedin: checkLoggedin
    	        }
    	});
    $routeProvider.otherwise({redirectTo: '/dashboard'});
  }])
  
  	.run(['$rootScope', '$http', function ($rootScope, $http) {
  		
  		$rootScope.message = '';

  	    // Logout function is available in any pages
  	    $rootScope.logout = function(){
  	      console.log("inside logout");	
  	      $rootScope.message = 'Logged out.';
  	      $http.post('/ReximCoreAWS/api/logout').success(function(resCode) {
			$rootScope.firstName = null;
			$rootScope.lastName = null;
			$rootScope.showError = null;
		});
  	    };
  	
  	}]);
