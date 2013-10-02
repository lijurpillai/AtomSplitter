jQ(function() {
	var box = null;
	var pubnub = PUBNUB.init({
		publish_key : 'pub-c-43e4e48b-0a32-4edc-8555-58875edc6cbc',
		subscribe_key : 'sub-c-95086202-154f-11e3-9b93-02ee2ddab7fe'
	});
	var boxClosedCallback = function(id){
		console.log(id);
		pubnub.publish({
			channel : channelChatDashBorard,
			message : 99 // closed
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
	pubnub.subscribe({
		channel : channelChatClient,
		message : function(msg) {
			jQ('.ui-chatbox').show(500);
			box.chatbox("option", "boxManager").addMsg("Agent", msg);
		}
	});

	jQ('.ui-chatbox-input-box ').keydown(function(event) {
		if (event.keyCode && event.keyCode == jQ.ui.keyCode.ENTER) {
			msg = jQ.trim(jQ(this).val());
			if (msg.length > 0) {
				box.chatbox("option", "boxManager").addMsg("Me", msg);
				pubnub.publish({
					channel : channelChatDashBorard,
					message : msg
				});

			}
			jQ(this).val('');
			return false;
		}
	});
});