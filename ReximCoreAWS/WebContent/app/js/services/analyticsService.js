'use strict';

var analyticsService = angular.module('myApp.analyticsServices', []);

analyticsService.factory('PresenceManager',['$log','AnalyticsData','ChatService',function($log,AnalyticsData,ChatService){	
	var presence = {};	
	return{	
		setPresenceData:function(data){			
			// change status from online to offline
			presence = data;
			var trackingId = presence.uuid;
			if(data.action == "leave"){								
				var analyticsData = AnalyticsData.getAnalyticsData();
				for (var i = 0; i < analyticsData.length; i++) {				
					if(trackingId == analyticsData[i].trackingId){
						analyticsData[i].online = false;					
					};  
				}
				//Show message in chat window when user goes offline/online
				ChatService.displayUserStatus(trackingId,"Offline");				
			}
			if(data.action == "join"){
				ChatService.displayUserStatus(trackingId,"online");
			}
		},
		getPresenceData:function(){			
	    	return presence;
	    }
      };
}]);

analyticsService.factory('AnalyticsData',['$log','UserAgentService','Constants','UtilService',function($log,UserAgentService,Constants,UtilService){
	$log.info("inside Sessionmanager");
	var analyticsData = [];	
	var masterAnalyticsData = [];
	var ruleData = [];
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
		getReturnUsers : function(){
			var count = 0;
			for (var i = 0; i < analyticsData.length; i++) {
				if(!analyticsData[i].isNewUser && analyticsData[i].online){
					count ++;
				}
			}
			
			return count;
		},
		getNewUsers : function(){
			var count = 0;
			for (var i = 0; i < analyticsData.length; i++) {
				if(analyticsData[i].isNewUser && analyticsData[i].online){
					count ++;
				}
			}
			
			return count;
		},
		getTotalDevice : function(deviceType){
			var count = 0;
			for (var i = 0; i < analyticsData.length; i++) {
				if(analyticsData[i].device == deviceType && analyticsData[i].online ){
					count ++;
				}
			}
			return count;					
		},
		setMasterAnalyticsData:function(data){
			var tempData = {};
			tempData.data = []; // define array
			var newTrackId = true;//flag for new user
			var tId = data.trackingId;
			tempData.tId = tId;			
			tempData.data.push(data);
			//** if master data already exists
			//** check if tId exists and update the row.
			if(masterAnalyticsData){
				for ( var i = 0; i < masterAnalyticsData.length; i++) {
					if(masterAnalyticsData[i].tId == tId ){
						newTrackId = false;
						masterAnalyticsData[i].data.push(data);
					}
				}// if tId is new 
				if(newTrackId){
					masterAnalyticsData.push(tempData);
				}
			}
			else{
				masterAnalyticsData.push(tempData);
			}
			//masterAnalyticsData.push(data);
		},
		// Only unique data exists.
			// when user data return for same tracking id it is removed.
			// cannot use this as master data. Need to create another one for that to push to DB
		setAnalyticsData:function(data){
			$log.info("inside AnalyticsData>setAnalyticsData");
			var trackingId = data.trackingId;			
			data.online = true;	// set online status as true
			data.reqStatus = true ;// set data status to new. On click of chat change it to false.
			data.timeStamp = Date.now();// set current time in millisec			
			UserAgentService.setUserAgent(data.pageData.navigatorAgent);
			data.isMobile = UserAgentService.isMobile();			
			data.device =  UserAgentService.getDeviceType();
			data.browser = UserAgentService.getBrowserType();
			data.deviceUrl = UtilService.getDeviceImgUrl(data.device);			
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
	    setRuleData:function(data){
			$log.info("inside AnalyticsData>setRuleData");					
			data.online = true;	// set online status as true
			data.reqStatus = true ;// set data status to new. On click of chat change it to false.
			data.timeStamp = Date.now();// set current time in millisec			
			UserAgentService.setUserAgent(data.pageData.navigatorAgent);
			data.isMobile = UserAgentService.isMobile();			
			data.device =  UserAgentService.getDeviceType();
			data.browser = UserAgentService.getBrowserType();
			data.deviceUrl = getDeviceImgUrl(data.device);			
			  // Remove existing data for same user.
			ruleData.push(data);
		},		
	    getRuleData:function(){
	    	console.log(ruleData);
	    	return ruleData;
	    },
	    getActiveUsers:function(){
	    	var activeUsers = analyticsData.filter(function(obj) {
	    	    return (obj.online );
	    	});
	    	return activeUsers;
	    }
      };
}]);