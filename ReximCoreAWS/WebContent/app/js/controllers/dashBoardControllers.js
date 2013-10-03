angular.module('myApp.dashBoardControllers', []).
 controller('PresenceCtrl',['$scope','$location','PubnubService','AnalyticsData','PresenceManager'
                            ,function($scope,$location,PubnubService,AnalyticsData,PresenceManager){	 
	 
	 var channelName = PubnubService.PUBNUB_ANALYTICS_CHANNEL;	 
	 console.log("Channel ----> " + PubnubService.PUBNUB_ANALYTICS_CHANNEL);
	 PubnubService.PUBNUB.subscribe({
	        channel : channelName,
	        message : function(analyticsData){	        	
	        	AnalyticsData.setAnalyticsData(analyticsData);
	        	console.log(AnalyticsData.getAnalyticsData());
			 },
			 presence   : function( message, env, channel ) {   // PRESENCE
		            console.log( "Channel: ",            channel           );
		            console.log( "Join/Leave/Timeout: ", message.action    );
		            console.log( "Occupancy: ",          message.occupancy );
		            console.log( "User ID: ",            message.uuid      );		            
		            $scope.$apply(function () {
		            	PresenceManager.setPresenceData(message);
		            	console.log(PresenceManager.getPresenceData().occupancy);
		            	$scope.activeUsers = PresenceManager.getPresenceData().occupancy;
		            });
		        }
	 });	 
}]);