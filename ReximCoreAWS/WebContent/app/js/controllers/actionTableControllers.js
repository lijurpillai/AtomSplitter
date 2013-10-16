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
		  ChatService.changeReqStatus(trackingId);
		  
		  $scope.$watch('online', function() {
			  console.log('ONLINE TO OFFLINE');
		  });
		  
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
		          box.chatbox("option", "boxManager").addMsg(trackingId,msg.msg);  
	          }
	          else if(msg.msgType == Constants.MSG_TYP_CHAT_CLOSE){
	        	  box.chatbox("option", "boxManager").addMsg("System Message","User closed chat window");
	          }
	          else if(msg.msgType == Constants.MSG_TYP_CHAT_CLOSE){
	        	  console.log("sending screen shot");
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
	 $scope.push = function(trackingId,msg){
		 console.log("PUSH");
		 //var msg = $scope.pushData;
		 console.log(msg);
		 var clientChannel = ChatService.getClientChannel(trackingId);
		 PubnubService.PUBNUB_PUB(Constants.MSG_TYP_PUSH,msg,clientChannel);
		 
	 };
  }]);