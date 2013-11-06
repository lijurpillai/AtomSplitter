'use strict';
/* Controllers */

angular.module('myApp.actionTableCtrl', []).
  controller('TableCtrl',['$scope','AnalyticsData','$log','ChatService','PubnubService','Constants',
                          function($scope,AnalyticsData,$log,ChatService,PubnubService,Constants){	  
	 // $scope.$watch('activeUsers', function() {	
		//console.log("IN THIS WORLD");
		//var device = AnalyticsData.getAnalyticsData().device;	  
	  $scope.ruleData = AnalyticsData.getAnalyticsData();	  
	  $scope.predicate = '-timeStamp'; 
	  
	  $scope.requestOptions = [	                   
	                   {name:'Close - Chat', value:1},
	                   {name:'Close - Push', value:2}	                   
	                 ];	  
	  /*$scope.$watch('ruleData.online', function(changed) {
		  console.log("IN THIS WORLD");
		  console.log(changed);
	  },true);*/
	  
	  $scope.chat = function(trackingId,index){
		  // change status from new to in progress
		  ChatService.changeReqStatusAnalytics(trackingId);
		  var modalId = '#moreInfoModal'+index;
		  $(modalId).modal('hide'); // Hide More Info modal.Req if chat clicked from modal		  
		  var clientChannel = ChatService.getClientChannel(trackingId);
		  var agentChannel = ChatService.getAgentChannel(trackingId);
		  var box = ChatService.getWindows(trackingId);// get chat box object
		  var msg = "";		  
		  if(box) {
			  $log.info("box true do nothing");	
			  box.chatbox("option", "boxManager").highlightBox();
		  }
		  else {
			  $log.info("new box");			  
			  box = ChatService.initBox(trackingId);
		  }
          PubnubService.PUBNUB.subscribe({
	        channel : agentChannel,
	        message : function(msg){ 
	          if(msg.msgType != Constants.MSG_TYP_CHAT_CLOSE){
	        	  console.log("inside pubnub subscribe");	
	        	  if(ChatService.getWindows(msg.trackingId)){
	        		  box.chatbox("option", "boxManager").addMsg(trackingId,msg.msg); 
	        	  }
	        	  //** since box object null assume user offline and send a message**//
	        	  else{
	        		  PubnubService.PUBNUB_PUB(Constants.MSG_TYP_CHAT,"Agent Offline",clientChannel);
	        	  }
	          }
	          else if(msg.msgType == Constants.MSG_TYP_CHAT_CLOSE){
	        	  if(ChatService.getWindows(msg.trackingId)){
	        		  box.chatbox("option", "boxManager").addMsg("System Message","User closed chat window");  
	        	  }	        	  
	          }	          
	        }
	     });		          		        
         $('.ui-chatbox-input-box ').keydown(function(event) {
	          console.log("in keydown");		          
	          if (event.keyCode && event.keyCode == $.ui.keyCode.ENTER) {
	              msg = $.trim($(this).val());		              
	              if (msg.length > 0) {
	            	  box.chatbox("option", "boxManager").addMsg("Me", msg);		            	  
	            	  PubnubService.PUBNUB_PUB(Constants.MSG_TYP_CHAT,msg,clientChannel);		                  
              		}
	              $(this).val('');
	              return false;
	          }
	      });
	 };// end scope.chat
	 $scope.push = function(trackingId,msg,index){		 
		 var clientChannel = ChatService.getClientChannel(trackingId);
		 PubnubService.PUBNUB_PUB(Constants.MSG_TYP_PUSH,msg,clientChannel);
		 var pushModalId = '#pushModal'+index;
		  $(pushModalId).modal('hide');
		  var moreInfoModal = '#moreInfoModal'+index;
		  $(moreInfoModal).modal('hide');
	 };
  }]);