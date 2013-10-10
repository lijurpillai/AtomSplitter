'use strict';

var utilService = angular.module('myApp.utilServices', []);

utilService.value('version', '0.1');

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
	// env
	//var env = "qa";
	var env = "dev";
	// pubnub key
	var publish_key = 'pub-c-d3ac13ed-c7c1-4998-ab20-1b35279e2537';
    var subscribe_key = 'sub-c-2786f95e-30bc-11e3-8450-02ee2ddab7fe';
    //channels
	var analyticsChannel = "analyticsData";
	var chatChannel = "chat";
	var msgTypeScreenShot = 98; // screen shot
	var msgTypeChatClose = 99; // Clinet closes window
	var msgTypeChat = 1; // Chat
	var msgTypePush = 21; // Push
	//session key
	var session_key_userProfile = "userProfile";
	//other
	var seperator = '_';
	// error message
	var maxWindowLimit = {id: 1 , msg:"Reached max chat window limit of : "};
	// device names
	var androidDevice = "Android",
		iOSDevice = "iOS",
		winDevice = "IEMobile";		
	var desktopDevice = "Desktop";
	//device img url
	var urlWindows = "img/icons/desktop.png",
		urlAndroid ="img/icons/android.png" ,
		urlWinMobile="img/icons/metro.png" ,
		urlIOs = "img/icons/ios.png";
	
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
		MSG_TYP_PUSH : msgTypePush,
		ERR_MSG_MAX_WINDOW:maxWindowLimit,
		ANDROID_DEVICE:androidDevice,
		I_OS_DEVICE:iOSDevice,	
		WIN_DEVICE : winDevice,
		DESKTOP:desktopDevice,
		URL_WIN:urlWindows,
		URL_ANDROID:urlAndroid,
		URL_IOS:urlIOs,
		URL_WINMOB:urlWinMobile,
		ENV:env
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

utilService.factory('AnalyticsData',['$log','UserAgentService','Constants',function($log,UserAgentService,Constants){
	$log.info("inside Sessionmanager");
	var analyticsData = [];	
	function getDeviceImgUrl(device){
		switch (device) {
		case "Desktop":
			return Constants.URL_WIN;
			break;
		case "iOS":
			return Constants.URL_IOS;
			break;
		case "Android":
			return Constants.URL_ANDROID;
			break;
		case "IEMobile":
			return Constants.URL_WINMOB;
			break;
		default:
			return Constants.URL_WIN;
			break;
		}
	}
	return{	
		getTotalDevice : function(deviceType){
			var count = 0;
			for (var i = 0; i < analyticsData.length; i++) {
				if(analyticsData[i].device == deviceType && analyticsData[i].online ){
					count ++;
				}
			}
			return count;					
		},
		setAnalyticsData:function(data){
			var trackingId = data.trackingId;			
			data.online = true;	// set online status as true
			data.reqStatus = true ;// set data status to new. On click of chat change it to false.
			data.timeStamp = Date.now();			
			UserAgentService.setUserAgent(data.pageData.navigatorAgent);
			data.isMobile = UserAgentService.isMobile();			
			data.device =  UserAgentService.getDeviceType();
			data.deviceUrl = getDeviceImgUrl(data.device);
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
	    },
	    getActiveUsers:function(){
	    	var activeUsers = analyticsData.filter(function(obj) {
	    	    return (obj.online );
	    	});
	    	return activeUsers;
	    }
      };
}]);

utilService.factory('UserAgentService',['$log',function($log){
	$log.info("UserAgentService");
	var uAgent = null;	
	
	 return{		
		getDeviceType:function(){
			var device = "Desktop";
			$log.info("UserAgentService > getDevice");
			var mobDevice = uAgent.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)/i);			
			
			if(mobDevice){
				device = mobDevice[0];
				if(device =="iPhone"||device =="iPad"||device =="iPod" ){
					device = "iOS";					
				}
			}
			return device;
		},
		setUserAgent:function(uaString){
			$log.info("UserAgentService > setUserAgent");
			uAgent = uaString;		
		},
		getUserAgent:function(){
			return uAgent;
		},
		isMobile:function(){
			var device = uAgent.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)/);			
			var isMobile = false;			
			if(device){				
				isMobile = true;
			}
			return isMobile;
		}
      };
}]);