angular.module('myApp.dashBoardControllers', []).
 controller('PresenceCtrl',['$scope','$location','PubnubService','AnalyticsData','PresenceManager','Constants','SessionManager','RuleData','AuthService'
                            ,function($scope,$location,PubnubService,AnalyticsData,PresenceManager,Constants,SessionManager,RuleData,AuthService){	 
	 //** Chart trail **//
	 

	/* $scope.pieChartUserType =
		 [
		     { label: "New User",  data: 10},
		     { label: "Return User",  data: 30}		     
		 ];	*/          

	 
	 
	 //** Ends**//
	 var channelName = getChannelName();	 
	 console.log("Channel ----> " + channelName);
	 function getChannelName(){
		 return AuthService.getUserProfile().orgId+Constants.SEPERATOR+
		 Constants.PUBNUB_ANALYTICS_CHANNEL+Constants.SEPERATOR+Constants.ENV;
	 }
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
	       
	       var pageCount = AnalyticsData.getPageCounts();
	  	   //** Bar chart data for page count ** //
	  	   var pageCountData =  [{ label: "Total Page Count", data: pageCount,color: "#5482FF"}];	  	 
	  	   $scope.chartData = pageCountData;
	  	   //** Bar chart ends **//
	  	   //** Pie Chart data for user type **//

	  	 $scope.pieChartUserType = [
	  	                            { label: "New User",  data: AnalyticsData.getNewUsers()},
	  	                            { label: "Return User",  data: AnalyticsData.getReturnUsers()}
	  	                            ];

	  	   //** Pie Chart ends **//
	                     
	   });
	 
	 $scope.$watch('totalRules', function() {	
		 //**Re drawing the rule info table to update count on change on totalRules**//
		 $scope.ruleDetailsName = RuleData.getRuleConfig();
	 });
	 
	 $scope.goToRuleTable = function(ruleId){
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
	        		//** set page count **//
	        		AnalyticsData.setPageCount(data);
	        		//** ENDS set page count **//
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