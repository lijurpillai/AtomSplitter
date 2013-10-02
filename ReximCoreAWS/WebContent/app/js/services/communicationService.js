'use strict';

var commService = angular.module('myApp.commServices', []);

commService.factory('ChatService',['$log','AuthService','Constants',function($log,AuthService,Constants){
	$log.info("inside ChatService");
	var boxList = [];
	var box = null;
	return{			
		getClientChannel:function(trackingId){
			var clientChannel = trackingId+Constants.SEPERATOR+AuthService.getUserProfile().orgId+
			   Constants.SEPERATOR+Constants.PUBNUB_CHAT_CHANNEL+Constants.SEPERATOR+"client";
			$log.info("inside ChatService>getClinetChannel");
			return clientChannel;
		},
		getAgentChannel:function(trackingId){
			var agentChannel = trackingId+Constants.SEPERATOR+AuthService.getUserProfile().orgId+
							   Constants.SEPERATOR+Constants.PUBNUB_CHAT_CHANNEL+Constants.SEPERATOR+"agent"; 
			$log.info("inside ChatService>getAgentChannel");
			return agentChannel;
		},
		BOX_LIST:boxList,
		BOX:box
      };
}]);