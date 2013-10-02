'use strict';

/* Controllers */

angular.module('myApp.actionTableCtrl', []).
  controller('TableCtrl',['$scope','AnalyticsData','$log','ChatService','pubnubInit',function($scope,AnalyticsData,$log,ChatService,pubnubInit){	  	  
	  $scope.ruleData = AnalyticsData.getAnalyticsData();
	  
	  $scope.predicate = '-timeStamp'; // sort by time ascending order
	  
	  $scope.chat1 = function(trackingId){
		  $log.info("inside TableCtrl>Chat()");
		  var clientChannel = ChatService.getClientChannel(trackingId);
		  var agentChannel = ChatService.getAgentChannel(trackingId);		  
	      var idList = [];
	      var broadcastMessageCallback = function(from, msg) {
	          for(var i = 0; i < idList.length; i ++) {
	        	  console.log("inside for loop");
	              chatboxManager.addBox(idList[i]);
	              $("#" + idList[i]).chatbox("option", "boxManager").addMsg(from, msg);
	          }
	      };
	      chatboxManager.init({messageSent : broadcastMessageCallback});
	      var id = trackingId;
	      idList.push(id);
	      chatboxManager.addBox(id, 
                  {dest:"dest" + id, // not used in demo
                   title:"box" + id                   
                   //you can add your own options too
                  });
	  };
	  
	  $scope.chat = function(trackingId){
		  $log.info("inside TableCtrl>Chat()");
		  var config = {
					width : 220, //px
					gap : 20,
					maxBoxes : 5					
				    };
		  var clientChannel = ChatService.getClientChannel(trackingId);
		  var agentChannel = ChatService.getAgentChannel(trackingId);		  
		  
		  
		  var agent = "Agent";			
		  var msg = "";
		  
		  var boxClosedCallback = function(id){
			  var el = '#'+id;
			  console.log($(el).parents('.ui-chatbox'));
			  $(el).parents('.ui-chatbox').remove();
			  var idx =  ChatService.BOX_LIST.indexOf(id);
			  if(idx != -1) {
				  ChatService.BOX_LIST.splice(idx, 1);
			  }			  
		  };
		  var getNextOffset = function() {
			  var offset = (config.width + config.gap) * ChatService.BOX_LIST.length;
				return (config.width + config.gap) * ChatService.BOX_LIST.length;
			    };		  
		  var el = document.createElement('div');
		  el.setAttribute('id', trackingId);
		  /*if(box) {
			  box.chatbox("option", "boxManager").toggleBox();
		  }*/
		  //else {  
		  ChatService.BOX = $(el).chatbox({
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
			ChatService.BOX_LIST.push(trackingId);
		            $('.ui-chatbox').hide();
		          //}
		          $('.ui-chatbox').show(500);

		          pubnubInit.PUBNUB.subscribe({
			        channel : agentChannel,
			        message : function(msg){ 
			          if(msg != 99){
			        	  console.log("inside pubnub subscribe");			          
				          ChatService.BOX.chatbox("option", "boxManager").addMsg(trackingId,msg);  
			          }
			          else{
			        	  ChatService.BOX.chatbox("option", "boxManager").addMsg(trackingId,"User closed chat"); 
			          }
			          }
			    	});		          		        
			    $('.ui-chatbox-input-box ').keydown(function(event) {
			          console.log("in here");
			          if (event.keyCode && event.keyCode == $.ui.keyCode.ENTER) {
			              msg = $.trim($(this).val());
			              console.log("msg -- "+msg);
			              if (msg.length > 0) {
			            	  ChatService.BOX.chatbox("option", "boxManager").addMsg("Me", msg);
			                  			                  
			                  pubnubInit.PUBNUB.publish({
						            channel : clientChannel,
						            message : msg
						        });
		              		}
			              $(this).val('');
			              return false;
			          }
			      });
		  };
  }]);