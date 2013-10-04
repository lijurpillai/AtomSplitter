'use strict';

var utilService = angular.module('myApp.utilServices', []);

utilService.factory('$exceptionHandler',['$log',function($log){
	$log.info("$exceptionHandler");
	return function (exception, cause) {		
		$log.info(exception.errMsg);
		$log.info(cause);
		if(exception.errId){
			var displayMsg = "Message : " + exception.errMsg;
			alert(displayMsg);
		}
        
    };
}]);

utilService.factory('Constants',['$log',function($log){
	var publish_key = 'pub-c-43e4e48b-0a32-4edc-8555-58875edc6cbc';
    var subscribe_key = 'sub-c-95086202-154f-11e3-9b93-02ee2ddab7fe';
    //channels
	var analyticsChannel = "analyticsData";
	var chatChannel = "chat";
	var msgTypeScreenShot = 98; // screen shot
	var msgTypeChatClose = 99; // Clinet closes window
	var msgTypeChat = 1; // Chat
	//session key
	var session_key_userProfile = "userProfile";
	//other
	var seperator = '_';
	// error message
	var maxWindowLimit = {id: 1 , msg:"Reached max chat window limit of : "};
	
	return{	
		PUB_KEY:publish_key,
		SUB_KEY:subscribe_key,		
		PUBNUB_ANALYTICS_CHANNEL:analyticsChannel,
		PUBNUB_CHAT_CHANNEL: chatChannel,
		SEPERATOR: seperator,
		SESS_KEY_USER_PROFILE:session_key_userProfile,
		MSG_TYP_SCREENSHOT:msgTypeScreenShot,
		MSG_TYP_CHAT_CLOSE:msgTypeChatClose,
		MSG_TYP_CHAT:msgTypeChat,
		ERR_MSG_MAX_WINDOW:maxWindowLimit
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
			data.reqStatus = true ;// set data status to new. On click of chat change it to false.
			data.timeStamp = Date.now();
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