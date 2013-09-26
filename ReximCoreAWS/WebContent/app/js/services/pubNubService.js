'use strict';

var pubNubModule = angular.module('myApp.pubNubServices', []);

pubNubModule.factory('pubnubInit',['$log','$rootScope','Constants',function($log,$rootScope,Constants){
	var pubnub = PUBNUB.init({
	      publish_key   : Constants.PUB_KEY,
	      subscribe_key : Constants.SUB_KEY
	  });
	var userProfile = $rootScope.USER_PROFILE;
	
	return{
			log:function(){
				$log.info("inside pubnubInit Service");
				console.log($rootScope.USER_PROFILE);
				console.log(userProfile.orgId+Constants.SEPERATOR+Constants.PUBNUB_ANALYTICS_CHANNEL);
			},
			PUBNUB:pubnub,
			PUBNUB_ANALYTICS_CHANNEL: userProfile.orgId+Constants.SEPERATOR+Constants.PUBNUB_ANALYTICS_CHANNEL
	      };
	
}]);