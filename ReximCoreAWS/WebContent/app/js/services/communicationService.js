'use strict';

var commService = angular.module('myApp.commServices', []);

commService.factory('ChatService',['$log','AuthService','Constants','$rootScope','AnalyticsData',function($log,AuthService,Constants,$rootScope,AnalyticsData){
	$log.info("inside ChatService");
	var boxList = [];
	var box = null;
	var chatWindows = [];
	var config = {
			width : 220, //px
			gap : 20,
			maxBoxes : 4					
		    };
	var getNextOffset = function() {		  
			return (config.width + config.gap) * chatWindows.length;
		    };
    var boxClosedCallback = function(id){
		  var el = '#'+id;
		  console.log($(el).parents('.ui-chatbox'));
		  $(el).parents('.ui-chatbox').remove();
		  /*var idx =  boxList.indexOf(id);
		  if(idx != -1) {
			  boxList.splice(idx, 1);
		  }	*/	
		  for ( var i = 0; i < chatWindows.length; i++) {
				if(chatWindows[i].id == id){
					chatWindows.splice(i,1);
				}
			}
	  };
	return{			
		getClientChannel:function(trackingId){
			var clientChannel = trackingId+Constants.SEPERATOR+AuthService.getUserProfile().orgId+
			   Constants.SEPERATOR+Constants.PUBNUB_CHAT_CHANNEL+Constants.SEPERATOR+"client"+Constants.SEPERATOR+Constants.ENV;
			$log.info("inside ChatService>getClinetChannel");
			return clientChannel;
		},
		getAgentChannel:function(trackingId){
			var agentChannel = trackingId+Constants.SEPERATOR+AuthService.getUserProfile().orgId+
							   Constants.SEPERATOR+Constants.PUBNUB_CHAT_CHANNEL+Constants.SEPERATOR+"agent"+Constants.SEPERATOR+Constants.ENV; 
			$log.info("inside ChatService>getAgentChannel");
			return agentChannel;
		},
		BOX_LIST:boxList,
		BOX:box,
		initBox : function(trackingId){
			console.log("inside initBox");
			if(chatWindows.length <= config.maxBoxes ){
				var obj = {};	
				var el = document.createElement('div');
				el.setAttribute('id', trackingId);
				box=$(el).chatbox({
		        		id:trackingId,
		        	    //user:{key : "value"},
		        	    title : "REXIM Chat "+ trackingId,
		        	    width : config.width,
		        	    offset : getNextOffset(),
		                messageSent : function(id, user, msg) {
					                  $(el).chatbox("option", "boxManager")
					                  .addMsg(id, msg);
					                  },
					    boxClosed : boxClosedCallback
		          		});
				boxList.push(trackingId);
	            $('.ui-chatbox').hide();
	          //}
	            $('.ui-chatbox').show(500);            		
				for ( var i = 0; i < chatWindows.length; i++) {
					if(chatWindows[i].trackingId == trackingId){
						chatWindows.splice(i,1);
					}
				}
				obj.id = trackingId;
				obj.box = box;
				chatWindows.push(obj);
				return obj.box;				
			}
			
			else {
				console.log("reached max window limit");
				throw { errId: Constants.ERR_MSG_MAX_WINDOW.id , errMsg: Constants.ERR_MSG_MAX_WINDOW.msg + config.maxBoxes + 1};
				//$rootScope.maxWindowErrMsg = Constants.ERR_MSG_MAX_WINDOW + config.maxBoxes;
			}
			
		},
		changeReqStatus:function(trackingId){ // changing req status to inprogress on press of Chat
			var analyticsData = AnalyticsData.getAnalyticsData();
			for (var i = 0; i < analyticsData.length; i++) {				
				if(trackingId == analyticsData[i].trackingId){
					analyticsData[i].reqStatus = false;					
				};  
			}
		},
		getWindows:function(trackingId){
			for ( var i = 0; i < chatWindows.length; i++) {
				if(chatWindows[i].id == trackingId){
					return chatWindows[i].box; 
				}
			}
		}
      };
}]);