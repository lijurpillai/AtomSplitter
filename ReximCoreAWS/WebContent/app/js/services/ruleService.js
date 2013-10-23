'use strict';

var ruleService = angular.module('myApp.ruleServices', []);

analyticsService.factory('RuleData',['$log','UserAgentService','Constants','UtilService'
                                     ,function($log,UserAgentService,Constants,UtilService){
	$log.info("inside RuleDATA");	
	var ruleData = [];
	var ruleConfigData = [];
	return{
		setRuleData:function(data){
			$log.info("inside AnalyticsData>setRuleData");					
			data.online = true;	// set online status as true
			data.reqStatus = true ;// set data status to new. On click of chat change it to false.
			data.timeStamp = Date.now();// set current time in millisec			
			UserAgentService.setUserAgent(data.pageData.navigatorAgent);
			data.isMobile = UserAgentService.isMobile();			
			data.device =  UserAgentService.getDeviceType();
			data.browser = UserAgentService.getBrowserType();
			data.deviceUrl = UtilService.getDeviceImgUrl(data.device);			
			  // Remove existing data for same user.
			ruleData.push(data);
		},		
	    getRuleData:function(filter){
	    	if(filter){
	    		var ruleFilterList = [];
	    		for ( var i = 0; i < ruleData.length; i++) {
					if(ruleData[i].ruleId == filter){
						ruleFilterList.push(ruleData[i]);
					}
				}
	    		return ruleFilterList;
	    	}
	    	else{
	    		console.log(ruleData);
		    	return ruleData;	
	    	}
	    	
	    },
	    setRuleConfig:function(data){
	    	console.log(data);
	    	for ( var i = 0; i < data.length; i++) {
	    		data[i].ruleCount = 0;// init count of the rule to 0
	    		ruleConfigData.push(data[i]);
			}
	    },
	    getRuleConfig:function(){	    	
	    	return ruleConfigData;
	    },
	    resetRuleConfig:function(){	    	
	    	ruleConfigData.length = 0;
	    },
	    resetRuleData:function(){	    	
	    	ruleData.length = 0;
	    },
	    setRuleCountRuleConfig:function(ruleId){	    	
	    	for ( var i = 0; i < ruleConfigData.length; i++) {
				if(ruleConfigData[i].ruleId == ruleId){
					ruleConfigData[i].ruleCount++;// increase count					
				}				
			}	    	
	    },
	    getRuleCountRuleConfig:function(ruleId){
	    	var count = 0;
	    	for ( var i = 0; i < ruleConfigData.length; i++) {
				if(ruleConfigData[i].ruleId == ruleId){
					count = ruleConfigData[i].ruleCount;
				}
			}
	    	return count;
	    }	   
	};
}]);