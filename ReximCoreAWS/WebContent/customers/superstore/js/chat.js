jQ(function() {
	var box = null;
	var pubnub = PUBNUB.init({
		publish_key : 'pub-c-43e4e48b-0a32-4edc-8555-58875edc6cbc',
		subscribe_key : 'sub-c-95086202-154f-11e3-9b93-02ee2ddab7fe'
	});
	var boxClosedCallback = function(id) {
		console.log(id);
		pubnub.publish({
			channel : channelChatDashBorard,
			message : {
				msgType : 99,
				msg : "closed"
			}
		// user closed chat window
		});
	};
	
	jQ(".footer-container").append("<div id ='chatBox'></div>");
	if (box) {
		box.chatbox("option", "boxManager").toggleBox();
	} else {
		box = jQ("#chatBox").chatbox({
			id : "CSR",
			user : {
				key : "value"
			},
			title : "REXIM Chat",
			boxClosed : boxClosedCallback,
			messageSent : function(id, user, msg) {
				jQ("#chatBox").chatbox("option", "boxManager").addMsg(id, msg);
			}
		});
		jQ('.ui-chatbox').hide();
	}

	var trackingId = _fingerPrint.get();
	var channelChatClient = trackingId + "_" + "sstore" + "_" + "chat" + "_"
			+ "client";
	var channelChatDashBorard = trackingId + "_" + "sstore" + "_" + "chat"
			+ "_" + "agent";
	pubnub
			.subscribe({
				channel : channelChatClient,
				message : function(msg) {
					if (msg.msgType == 21) {
						jQ(".footer-container").append("<div id ='offerCode'><span></span></div>");
						jQ('#offerCode').append('<div id="dialogBox" title="Basic dialog"></div>');
						jQ( "#offerCode" )
						.dialog({autoOpen: false,show: {effect: "slide",duration: 1000},
						hide: {effect: "puff",duration: 1000}
					    },{ title: "Offer Code" },
							{ position: { my: "right ", at: "bottom", of: ".footer-container" } },
								{ buttons: [ { text: "OK", click: function() { jQ( this ).dialog( "close" ); } } ] 
						});						
						
						console.log("OFFer");
				        console.log(msg.msg);				        
				        jQ( "#offerCode span" ).text(msg.msg);
				        jQ( "#offerCode" ).dialog( "open" );
						
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
				pubnub.publish({
					channel : channelChatDashBorard,
					message : {
						msgType : 1,
						msg : msg
					}
				});

			}
			jQ(this).val('');
			return false;
		}
	});
});