'use strict';
/* Controllers */

angular.module('myApp.ruleActionTableCtrl', []).
  controller('RuleTableCtrl',['$scope','RuleData','$log','ChatService','PubnubService','Constants','$location',
                          function($scope,RuleData,$log,ChatService,PubnubService,Constants,$location){	  
	  $scope.selectedRule = [];
	  var filter = $location.search().ruleId;	  
	  if(filter){
		  $scope.ruleActionData = RuleData.getRuleData(filter);
	  }
	  else{
		  $scope.ruleActionData = RuleData.getRuleData();
	  }
	  $scope.predicate = '-timeStamp';
	  $scope.requestOptions = [	                   
	                   {name:'Close - Chat', value:1},
	                   {name:'Close - Push', value:2}	                   
	                 ];	
	  
	 /* $scope.ruleFilterList = RuleData.getRuleFilterList(filter);	  
	  $scope.rList = {name: $scope.ruleFilterList[0]};*/
	  $scope.ruleConfig = RuleData.getRuleConfig();
	  $scope.setSelectedRule = function(){
		  var ruleId = this.ruleList.ruleId;
		  console.log(ruleId);
		  if (_.contains($scope.selectedRule, ruleId)) {
	            $scope.selectedRule = _.without($scope.selectedRule, ruleId);
	        } else {
	            $scope.selectedRule.push(ruleId);
	        }
	        return false;
		  
	  };
	  
	  $scope.isChecked = function(ruleId){
	        if (_.contains($scope.selectedRule, ruleId)) {
	            return 'glyphicon glyphicon-ok pull-left';
	        }
	        return false;		  
	  };
	  
	  $scope.chat = function(trackingId,index){
		  // change status from new to in progress
		  ChatService.changeReqStatusRule(trackingId);		  
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
		 //var msg = $scope.pushData;
		 var clientChannel = ChatService.getClientChannel(trackingId);
		 PubnubService.PUBNUB_PUB(Constants.MSG_TYP_PUSH,msg,clientChannel);
		 var pushModalId = '#pushModal'+index;
		 $(pushModalId).modal('hide');
		 var moreInfoModal = '#moreInfoModal'+index;
		 $(moreInfoModal).modal('hide');
		 
	 };
  }]);