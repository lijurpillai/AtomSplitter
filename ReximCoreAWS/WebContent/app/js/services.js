'use strict';

/* Services */


/*// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1');*/

var myModule = angular.module('myApp.services', []);

myModule.factory('Auth', function() {
  
  //factory function body that constructs shinyNewServiceInstance
  console.log('inside Auth service');
  return {
	  log:function(){console.log("INSIDE LOG of Service")},
	  login:function(){console.log("INSIDE LOGIN of Service")}	  
  };
});