'use strict';

/* Filters */

var myFilter = angular.module('myApp.filters', []);

myFilter.filter('interpolate', ['version','Constants', function(version,Constants) {
	return function(text) {
	      return String(text).replace(/\%VERSION\%/mg, version+"_"+Constants.ENV);
	    };
}]);

myFilter.filter('ruleTableFilter', [function() {
	return function(ruleData,ruleIdList,searchList) {
		
		if (!angular.isUndefined(ruleIdList) && ruleIdList.length > 0) {
			var tempRuleData = [];
			angular.forEach(ruleIdList,function(ruleId){
				console.log(ruleId);
				angular.forEach(ruleData,function(ruleData){
					console.log(ruleData.ruleId);
					if (angular.equals(ruleData.ruleId, ruleId)) {
						tempRuleData.push(ruleData);
                    }
				});
			});
			return tempRuleData;
		}
		else{
			return ruleData;
		}  	      
	      
	    };
}]);
