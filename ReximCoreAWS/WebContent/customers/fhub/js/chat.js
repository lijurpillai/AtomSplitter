jQ(function() {
	var box = null;
	var trackingId = _fPrint;
	/*var pubnub = PUBNUB.init({
		publish_key   : 'pub-c-d3ac13ed-c7c1-4998-ab20-1b35279e2537',
	    subscribe_key : 'sub-c-2786f95e-30bc-11e3-8450-02ee2ddab7fe',
    	restore    : true, 
        uuid: _fPrint
	});*/
	var boxClosedCallback = function(id) {
		console.log(id);
		__PUBNUB.publish({
			channel : channelChatDashBorard,
			message : {
				msgType : 99,
				msg : "closed",
				trackingId:id
			}
		// user closed chat window
		});
	};
	
	jQ(".footer-container").append("<div id ='chatBox'></div>");
	if (box) {
		box.chatbox("option", "boxManager").toggleBox();
	} else {
		box = jQ("#chatBox").chatbox({
			id : trackingId,
			user : {
				key : "value"
			},
			title : "Live Chat",
			boxClosed : boxClosedCallback,
			messageSent : function(id, user, msg) {
				jQ("#chatBox").chatbox("option", "boxManager").addMsg(id, msg);
			}
		});
		jQ('.ui-chatbox').hide();
	}

	
	var channelChatClient = trackingId + "_" + "fhub" + "_" + "chat" + "_"
			+ "client" + "_" + "qa";
	var channelChatDashBorard = trackingId + "_" + "fhub" + "_" + "chat"
			+ "_" + "agent"+"_" + "qa";
	__PUBNUB.subscribe({
				channel : channelChatClient,
				message : function(msg) {
					if (msg.msgType == 21) {
						jQ('body').append("<div id ='offerCode'><span></span></div>");
						//jQ('#offerCode').append('<div id="dialogBox" title="Basic dialog"></div>');
						jQ( "#offerCode" )						
						.dialog(
							{ position: {at: "left bottom"}},
							{autoOpen: false,							
							dialogClass: "dialog_style",
							show: {effect: "bounce",duration: 1000},
							hide: {effect: "puff",duration: 1000}		
							},
							{ title: "Message from Finahub" },
						  //, at: "left bottom"},
						  { buttons: [ { text: "OK", click: function() { jQ( this ).dialog( "close" ); } } ] 
						}).parent().css('position', 'fixed');						
						
						console.log("OFFer");
				        console.log(msg.msg);				        
				        jQ( "#offerCode span" ).text(msg.msg);
				        jQ( "#offerCode" ).dialog( "open" );
				        //jQ(".ui-dialog").addClass("dialog_style");
						
					}
					if (msg.msgType == 1) {
						jQ('.ui-chatbox').show(500);
						box.chatbox("option", "boxManager").addMsg("Agent",
								msg.msg);
					} 

				}
			});

	jQ('.ui-chatbox-input-box ').keydown(function(event) {
		if (event.keyCode && event.keyCode == jQ.ui.keyCode.ENTER) {
			msg = jQ.trim(jQ(this).val());
			if (msg.length > 0) {
				box.chatbox("option", "boxManager").addMsg("Me", msg);
				__PUBNUB.publish({
					channel : channelChatDashBorard,
					message : {
						msgType : 1,
						msg : msg,
						trackingId:trackingId
					}
				});

			}
			jQ(this).val('');
			return false;
		}
	});
});