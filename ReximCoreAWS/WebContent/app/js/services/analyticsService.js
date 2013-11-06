'use strict';

var analyticsService = angular.module('myApp.analyticsServices', []);

analyticsService.factory('PresenceManager',['$log','AnalyticsData','ChatService','RuleData'
                                            ,function($log,AnalyticsData,ChatService,RuleData){	
	var presence = {};	
	return{	
		setPresenceData:function(data){			
			// change status from online to offline
			presence = data;
			var trackingId = presence.uuid;
			if(data.action == "leave"){	
				//** need to reset online status to false for RULE and ANALYTICS**//
				//** TO-DO Replace online login with centralized controller**//
				var analyticsData = AnalyticsData.getAnalyticsData();
				for (var i = 0; i < analyticsData.length; i++) {				
					if(trackingId == analyticsData[i].trackingId){
						analyticsData[i].online = false;					
					};  
				}
				var ruleData = RuleData.getRuleData();
				for (var i = 0; i < ruleData.length; i++) {				
					if(trackingId == ruleData[i].trackingId){
						ruleData[i].online = false;					
					};  
				}
				//Show message in chat window when user goes offline/online
				ChatService.displayUserStatus(trackingId,"Offline");				
			}
			if(data.action == "join"){
				//** Reset online status to true on join only for RULE,for ANALYTICS it is set in analytics service setter**//
				var ruleData = RuleData.getRuleData();
				for (var i = 0; i < ruleData.length; i++) {				
					if(trackingId == ruleData[i].trackingId){
						ruleData[i].online = true;					
					};  
				}
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
	//** page count graph display name **//
	var pageCounts = [];
	var pageCountConfigs = [];
	//** ends **//
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
					//** Closing more info modal window if open **//
					var tId = $("[id^=moreInfoModal]").find("#tId").text().trim();
					var modalId = $("[id^=moreInfoModal]").attr('id');
					var selector = "#"+modalId;
					 // ** this does not work since tId is not coming correct.
					  // ** leaving as is since it works. TO-DO - Fix it 
					if(tId==trackingId){
						$(selector).modal('hide');
					}
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
	    },
	    resetAnalyticsData:function(){	    	
	    	analyticsData.length = 0;
	    },
	    setPageCount:function(data){
	    	var newPage = true;
	    	var pageName = data.pageData.pathname.split("/")[1];
	    	var path = pageName.split(".")[0];
	    	console.log("Path Name >> " + path);
	    	if(path == ""){
				path = "Home";
			}
	    	// ** set page count config **//
	    	if(pageCountConfigs){
	    		for ( var i = 0; i < pageCountConfigs.length; i++) {
	    			var pageCountConfig = pageCountConfigs[i];
	    			var pageCount = pageCounts[i];	    			
					if(pageCountConfig[1] == path){
						console.log("do nothing");
						pageCount[1]++;						
						newPage = false;
					}					
				}
	    		if(newPage){
	    			var tempDataPageConfig = [pageCountConfigs.length , path];
	    			var tempDataPageCount = [pageCountConfigs.length,1];
	    			pageCountConfigs.push(tempDataPageConfig);	    			
	    			pageCounts.push(tempDataPageCount);
	    		}	    		
	    	}
	    	//** set page count config ENDS **//	    	
	    	
	    },
	    getPageCountConfigs : function(){
	    	return pageCountConfigs;
	    },
	    getPageCounts : function(){
	    	return pageCounts;
	    },
	    getTotalPageCount:function(){
	    	var totalCount = 0;
	    	for ( var i = 0; i < pageCounts.length; i++) {
	    		var pageCount = pageCounts[i];
	    		totalCount = totalCount + pageCount[1];
			}
	     return totalCount;
	    },
	    resetPageCount : function(){
	    	pageCounts.length = 0;
	    	pageCountConfigs.length = 0;	    	
	    }
      };
}]);