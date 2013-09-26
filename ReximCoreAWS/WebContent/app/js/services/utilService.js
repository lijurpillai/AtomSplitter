'use strict';

var utilService = angular.module('myApp.utilServices', []);
utilService.factory('Constants',['$log',function($log){
	var publish_key = 'pub-c-43e4e48b-0a32-4edc-8555-58875edc6cbc';
    var subscribe_key = 'sub-c-95086202-154f-11e3-9b93-02ee2ddab7fe';
	var analyticsChannel = "analyticsData";
	
	var seperator = '_';
	return{	
		PUB_KEY:publish_key,
		SUB_KEY:subscribe_key,		
		PUBNUB_ANALYTICS_CHANNEL:analyticsChannel,
		SEPERATOR: seperator
      };
}]);