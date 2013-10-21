angular.module('myApp.dashBoardControllers', []).
 controller('PresenceCtrl',['$scope','$location','PubnubService','AnalyticsData','PresenceManager','Constants','SessionManager','RuleData'
                            ,function($scope,$location,PubnubService,AnalyticsData,PresenceManager,Constants,SessionManager,RuleData){	 
	 
	 var channelName = PubnubService.PUBNUB_ANALYTICS_CHANNEL;	 
	 console.log("Channel ----> " + PubnubService.PUBNUB_ANALYTICS_CHANNEL);
	//**Rule data**//
	 $scope.ruleDetailsName = RuleData.getRuleConfig();
	 $scope.totalRules = RuleData.getRuleData().length;
	//**Rule data ends**//
	 $scope.$watch('allUsers', function() {	       
	       $scope.activeUsers = AnalyticsData.getActiveUsers().length;
	       $scope.androidDevice = AnalyticsData.getTotalDevice(Constants.ANDROID_DEVICE);
	       $scope.iOSDevice = AnalyticsData.getTotalDevice(Constants.I_OS_DEVICE);
	       $scope.winDevice = AnalyticsData.getTotalDevice(Constants.WIN_DEVICE);
	       $scope.deskTop = AnalyticsData.getTotalDevice(Constants.DESKTOP);
	       $scope.newUsers = AnalyticsData.getNewUsers();			
	       $scope.returnUsers = AnalyticsData.getReturnUsers();	
	                     
	   });
	 
	 $scope.$watch('totalRules', function() {	
		 //**Re drawing the rule info table to update count on change on totalRules**//
		 $scope.ruleDetailsName = RuleData.getRuleConfig();
	 });
	 
	 $scope.goToRuleTable = function(ruleId){
		 console.log("dfasd BHIJBIIIP" + ruleId);
		 $location.path('/ruleactiontable').search({ruleId: ruleId});
	 };
	 
	 PubnubService.PUBNUB.subscribe({
	        channel : channelName,
	        message : function(data){	
	        	if(data.isRule){
	        		//** set rule data from clinet **//
	        		RuleData.setRuleData(data);
	        		//** Update totalRules on receiving new data **//
	        		$scope.totalRules = RuleData.getRuleData().length;
	        		//** updating ruleCount of RuleConfig array, bad logic **//
	        		RuleData.setRuleCountRuleConfig(data.ruleId);
	        		//$scope.ruleDetailsName = RuleData.getRuleConfig();	
	        		$scope.$apply();
	        		console.log("rule triggered");
	        		console.log(data);
	        		
	        	}
	        	else{
	        		AnalyticsData.setMasterAnalyticsData(data);
	        		AnalyticsData.setAnalyticsData(data);
		        	console.log(AnalyticsData.getAnalyticsData());
	        	}
			 },
			 presence   : function( message, env, channel ) {   // PRESENCE
		            console.log( "Channel: ",            channel           );
		            console.log( "Join/Leave/Timeout: ", message.action    );
		            console.log( "Occupancy: ",          message.occupancy );
		            console.log( "User ID: ",            message.uuid      );		            
		            $scope.$apply(function () {
		            	PresenceManager.setPresenceData(message);
		            	console.log(PresenceManager.getPresenceData().occupancy);
		            	// all users 
		            	$scope.allUsers = PresenceManager.getPresenceData().occupancy;
		            });
		        }
	 });	 
}]);