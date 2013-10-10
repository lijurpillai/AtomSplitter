angular.module('myApp.dashBoardControllers', []).
 controller('PresenceCtrl',['$scope','$location','PubnubService','AnalyticsData','PresenceManager','Constants'
                            ,function($scope,$location,PubnubService,AnalyticsData,PresenceManager,Constants){	 
	 
	 var channelName = PubnubService.PUBNUB_ANALYTICS_CHANNEL;	 
	 console.log("Channel ----> " + PubnubService.PUBNUB_ANALYTICS_CHANNEL);
	 /*if(!($scope.allUsers)){
		 $scope.allUsers = 0;
	 }*/
	 $scope.$watch('allUsers', function() {	       
	       $scope.activeUsers = AnalyticsData.getActiveUsers().length;
	       $scope.androidDevice = AnalyticsData.getTotalDevice(Constants.ANDROID_DEVICE);
	       $scope.iOSDevice = AnalyticsData.getTotalDevice(Constants.I_OS_DEVICE);
	       $scope.winDevice = AnalyticsData.getTotalDevice(Constants.WIN_DEVICE);
	       $scope.deskTop = AnalyticsData.getTotalDevice(Constants.DESKTOP);
	       //$scope.$apply();
	       //geolocator.locateByIP(onGeoSuccess, onGeoError, cmbSource.selectedIndex, 'map-canvas');
	   });
	 
	 
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
		            	// all users 
		            	$scope.allUsers = PresenceManager.getPresenceData().occupancy;
		            	//$scope.activeUsers = AnalyticsData.getActiveUsers().length;
		            	/*$scope.androidDevice = AnalyticsData.getTotalDevice(Constants.ANDROID_DEVICE);
		            	$scope.iOSDevice = AnalyticsData.getTotalDevice(Constants.I_OS_DEVICE);
		            	$scope.winDevice = AnalyticsData.getTotalDevice(Constants.WIN_DEVICE);
		            	$scope.deskTop = AnalyticsData.getTotalDevice(Constants.DESKTOP);*/
		            	
		            	
		            });
		        }
	 });	 
}]);