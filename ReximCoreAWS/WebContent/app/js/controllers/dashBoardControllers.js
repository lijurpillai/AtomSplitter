angular.module('myApp.dashBoardControllers', []).
 controller('PresenceCtrl',['$scope','$location','pubnubInit',function($scope,$location,pubnubInit){
	 console.log("inside PresenceCtrl -->");
	 pubnubInit.log();
	 $scope.activeUsers = 0;
	 var channelName = pubnubInit.PUBNUB_ANALYTICS_CHANNEL;	 
	 console.log("Channel ----> " + pubnubInit.PUBNUB_ANALYTICS_CHANNEL);
	 pubnubInit.PUBNUB.subscribe({
	        channel : channelName,
	        message : function(ruleData){
	        	console.log(ruleData);
			 },
			 presence   : function( message, env, channel ) {   // PRESENCE
		            console.log( "Channel: ",            channel           );
		            console.log( "Join/Leave/Timeout: ", message.action    );
		            console.log( "Occupancy: ",          message.occupancy );
		            console.log( "User ID: ",            message.uuid      );
		            
		            $scope.$apply(function () {
		            	$scope.activeUsers = message.occupancy;
		            });
		        }
	 });	 
}]);