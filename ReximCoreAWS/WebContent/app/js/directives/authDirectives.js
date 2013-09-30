'use strict';

/* Directives */


angular.module('myApp.authDirectives', []).
  directive('reximUserName', function($log,$rootScope) {
    return function(scope,element,attrs){
    	scope.$watch(attrs.reximUserName, function(value) {			
			$rootScope.SHOW_USER_ERROR = false;
	      });    	
    };
   
  }).
  directive('reximPassword', function($log,$rootScope) {
	    return function(scope,element,attrs){
	    	scope.$watch(attrs.reximPassword, function(value) {		    		
				$rootScope.SHOW_PWD_ERROR = false;
		      });    	
	    };
	   
	  });;
