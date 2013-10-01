'use strict';

/* Controllers */

angular.module('myApp.actionTableCtrl', []).
  controller('TableCtrl',['$scope','AnalyticsData',function($scope,AnalyticsData){	  	  
	  $scope.ruleData = AnalyticsData.getAnalyticsData();
	  $scope.predicate = '-timeStamp';
  }]);