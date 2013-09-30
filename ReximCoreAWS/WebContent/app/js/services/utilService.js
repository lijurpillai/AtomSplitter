'use strict';

var utilService = angular.module('myApp.utilServices', []);
utilService.factory('Constants',['$log',function($log){
	var publish_key = 'pub-c-43e4e48b-0a32-4edc-8555-58875edc6cbc';
    var subscribe_key = 'sub-c-95086202-154f-11e3-9b93-02ee2ddab7fe';
	var analyticsChannel = "analyticsData";
	var session_key_userProfile = "userProfile";	
	var seperator = '_';
	
	return{	
		PUB_KEY:publish_key,
		SUB_KEY:subscribe_key,		
		PUBNUB_ANALYTICS_CHANNEL:analyticsChannel,
		SEPERATOR: seperator,
		SESS_KEY_USER_PROFILE:session_key_userProfile
      };
}]);

utilService.factory('SessionManager',['$log',function($log){
	$log.info("inside Sessionmanager");
	return{	
		clearSession:function(key){
			$log.info("inside Sessionmanager>clearSession");
			if(sessionStorage){		  
				sessionStorage.clear(key);			
			}
		}
      };
}]);
utilService.factory('PresenceManager',['$log','AnalyticsData',function($log,AnalyticsData){
	$log.info("inside PresenceManager");
	var presence = {};
	return{	
		setPresenceData:function(data){
			$log.info("inside PresenceManager>setPresenceData");
			// change status from online to offline
			presence = data;
			if(data.action == "leave"){
				console.log("inside LEAVE");
				var trackingId = presence.uuid;
				var analyticsData = AnalyticsData.getAnalyticsData();
				for (var i = 0; i < analyticsData.length; i++) {				
					if(trackingId == analyticsData[i].trackingId){
						analyticsData[i].online = false;					
					};  
				}
				
			}
		},
		getPresenceData:function(){
			$log.info("inside PresenceManager>getPresenceData");
	    	return presence;
	    }
      };
}]);

utilService.factory('AnalyticsData',['$log',function($log){
	$log.info("inside Sessionmanager");
	var analyticsData = [];	
	return{	
		setAnalyticsData:function(data){
			var trackingId = data.trackingId;
			data.online = true;	// set online status as true				
			$log.info("inside AnalyticsData>setAnalyticsData");
			  // Remove existing data for same user.
			for (var i = 0; i < analyticsData.length; i++) {				
				if(trackingId == analyticsData[i].trackingId){
					analyticsData.splice(i,1);					
				};  
			}
			analyticsData.push(data);
		},
	    getAnalyticsData:function(){
	    	console.log(analyticsData);
	    	return analyticsData;
	    }
      };
}]);