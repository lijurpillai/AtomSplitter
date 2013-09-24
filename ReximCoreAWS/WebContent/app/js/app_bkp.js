/*'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers','ngResource']).
  config(['$routeProvider', function($routeProvider) {
	
	$routeProvider.when('/',
		{
			templateUrl: 'partials/partial1.html', 
			controller: 'MyCtrl1'
			
		});
	$routeProvider.when('/login',
		{
			templateUrl: 'partials/login.html',
			controller: 'MyCtrl1'
		});
    $routeProvider.when('/view1',
    	{
    		templateUrl: 'partials/partial1.html',
    		controller: 'MyCtrl1'
    	});
    $routeProvider.when('/view2',
    	{
    		templateUrl: 'partials/partial2.html',
    		controller: 'MyCtrl2'
    	});
    $routeProvider.otherwise({redirectTo: '/'});
  }])
  
  	.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
  		
  	// enumerate routes that don't need authentication
  	  var routesThatDontRequireAuth = ['/login'];
  	// check if current location matches route  
  	  var routeClean = function (route) {
  	    return _.find(routesThatDontRequireAuth,
  	      function (noAuthRoute) {
  	        return _.str.startsWith(route, noAuthRoute);
  	      });
  	  };
  	  
  	$rootScope.$on('$routeChangeStart', function (event, next, current) {
  	    // if route requires auth and user is not logged in
  		console.log($location.url());
  	    if (!routeClean($location.url()) && !Auth.isLoggedIn()) {
  	      // redirect back to login
  	      $location.path('/login');
  	    }
  	  });
      

  	}]);
*/