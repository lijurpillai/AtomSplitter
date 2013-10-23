'use strict';

var commService = angular.module('myApp.commServices', []);

commService.factory('ChatService',['$log','AuthService','Constants','$rootScope','AnalyticsData','RuleData'
                                   ,function($log,AuthService,Constants,$rootScope,AnalyticsData,RuleData){
	$log.info("inside ChatService");	
	var boxList = [];
	var box = null;
	var chatWindows = [];
	var currentPosn = "";
	var config = {
			width : 220, //px
			gap : 20,
			maxBoxes : 5					
		    };
	var posnMapper = [];// total available posn for the given maxBox limit
	var freePositions = []; // list of free position for chat window
	// to find min array position
	Array.min = function( array ){
	    return Math.min.apply( Math, array );
	};	
	// setting array based on maxbox length
	for ( var i = 0; i < config.maxBoxes; i++) {
		posnMapper.push(i); // overall available posn, like a const
		freePositions.push(i);// list of free positions.Initially equal to posnmapper
	}	
	var getNextOffset = function() {	
			var posnMultiplier = Array.min(freePositions);
			currentPosn = posnMultiplier;
			var deletePosn = freePositions.indexOf(Array.min(freePositions));
			freePositions.splice(deletePosn,1);
			console.log(freePositions);			
			return (config.width + config.gap) * posnMultiplier;
		    };
    var boxClosedCallback = function(id){
		  var el = '#'+id;		  	  
		  console.log($(el).parents('.ui-chatbox'));
		  $(el).parents('.ui-chatbox').remove();		  	
		  for ( var i = 0; i < chatWindows.length; i++) {
				if(chatWindows[i].id == id){
					freePositions.push(chatWindows[i].posn);
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
			if(chatWindows.length < config.maxBoxes ){
				var obj = {};	
				var el = document.createElement('div');
				el.setAttribute('id', trackingId);
				box=$(el).chatbox({
		        		id:trackingId,
		        	    //user:{key : "value"},
		        	    title : trackingId,
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
				obj.posn =currentPosn;  
				chatWindows.push(obj);
				return obj.box;				
			}
			
			else {
				console.log("reached max window limit");
				throw { errId: Constants.ERR_MSG_MAX_WINDOW.id , errMsg: Constants.ERR_MSG_MAX_WINDOW.msg + config.maxBoxes};				
			}
			
		},
		changeReqStatusAnalytics:function(trackingId){ // changing req status to inprogress on press of Chat
			var analyticsData = AnalyticsData.getAnalyticsData();
			for (var i = 0; i < analyticsData.length; i++) {				
				if(trackingId == analyticsData[i].trackingId){
					analyticsData[i].reqStatus = false;					
				};  
			}
		},
		changeReqStatusRule:function(trackingId){ // changing req status to inprogress on press of Chat
			var ruleData = RuleData.getRuleData();
			for (var i = 0; i < ruleData.length; i++) {				
				if(trackingId == ruleData[i].trackingId){
					ruleData[i].reqStatus = false;					
				};  
			}
		},
		getWindows:function(trackingId){
			for ( var i = 0; i < chatWindows.length; i++) {
				if(chatWindows[i].id == trackingId){
					return chatWindows[i].box; 
				}
			}
		},
		displayUserStatus:function(trackingId,status){
			var box = null;
			var msg = null;
			console.log("inside DISPLAY USER STAT" + trackingId);
			for ( var i = 0; i < chatWindows.length; i++) {
				if(chatWindows[i].id == trackingId){
					box = chatWindows[i].box; 
				}
			}
		    if(box){
		    	msg = "User "+status;
		    	box.chatbox("option", "boxManager").addMsg("System Message",msg);
		    }
		}
      };
}]);