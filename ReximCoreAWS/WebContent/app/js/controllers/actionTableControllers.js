'use strict';

/* Controllers */

angular.module('myApp.actionTableCtrl', []).
  controller('TableCtrl',['$scope','AnalyticsData','$log','ChatService','PubnubService','Constants',
                          function($scope,AnalyticsData,$log,ChatService,PubnubService,Constants){	  	  
	  $scope.ruleData = AnalyticsData.getAnalyticsData();	  
	  $scope.predicate = '-timeStamp'; // sort by time ascending order	  
	  /*$scope.screenShot =function(trackingId){ // screen shot
		  $log.info("inside TableCtrl>screenShot()");
		  var clientChannel = ChatService.getClientChannel(trackingId);
		  var agentChannel = ChatService.getAgentChannel(trackingId);
		  var msg = "";		  
		  PubnubService.PUBNUB_PUB(Constants.MSG_TYP_SCREENSHOT,msg,clientChannel); 	  
	  };*/
	  
	  $scope.chat = function(trackingId,modalIndex){		  	
		  var modalId = '#moreInfoModal'+modalIndex;
		  $log.info("inside TableCtrl>Chat()" + modalId);
		  $(modalId).modal('hide');
		  var clientChannel = ChatService.getClientChannel(trackingId);
		  var agentChannel = ChatService.getAgentChannel(trackingId);
		  var box = ChatService.getWindows(trackingId);
		  var msg = "";		
		  if(box) {
			  console.log("box true do nothing");			  
			  //ChatService.BOX.chatbox("option", "boxManager").toggleBox();
		  }
		  else {
			  console.log("new box");			  
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
	        	  box.chatbox("option", "boxManager").addMsg(trackingId,"User closed chat window");
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
  }]);