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
	   
	  }).
	  directive('focusMe', function($timeout, $parse) {
		  return {
		    link: function(scope, element, attrs) {
		      var model = $parse(attrs.focusMe);
		      scope.$watch("open", function(value) {
		        console.log('value=',value);
		        if(value === true) { 
		          $timeout(function() {
		            element[0].focus(); 
		          });
		        }
		      });		     
		    }
		  };
		}).
  directive('appVersion', ['version', function(version) {
	    return function(scope, elm, attrs) {
	      elm.text(version);
	    };
	  }]);
