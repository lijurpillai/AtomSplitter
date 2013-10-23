'use strict';

/* Filters */

var myFilter = angular.module('myApp.filters', []);

myFilter.filter('interpolate', ['version','Constants', function(version,Constants) {
	return function(text) {
	      return String(text).replace(/\%VERSION\%/mg, version+"_"+Constants.ENV);
	    };
}]);

myFilter.filter('ruleTableFilter', [function() {
	return function(data,list,search) {
	      console.log("MAGIDUSHU");
	      console.log(data);
	      console.log(list);
	      console.log(search);
	      return data;
	    };
}]);
