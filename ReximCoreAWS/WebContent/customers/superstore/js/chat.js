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
					if (msg.msgType != 98) {
						jQ('.ui-chatbox').show(500);
						box.chatbox("option", "boxManager").addMsg("Agent",
								msg.msg);
					} else {
						console.log("requesting for screen shot");
						html2canvas(
								document.body,
								{
									onrendered : function(canvas) {
										console.log(canvas.toDataURL());
										var dataURL = canvas.toDataURL();
										// need to replace this with Ajax call
										/*
										 * pubnub.publish({ channel :
										 * channelChatDashBorard, message :
										 * {msgType:msg.msgType,msg:"test"} });
										 */
										jQ
												.ajax({
													type : 'GET',
													url : "http://localhost:8080/ReximCoreAWS/api/screenShot",
													data : "dataURL",
													async : false,
													jsonpCallback : 'getEmployeeCallback',
													dataType : 'jsonp',
													success : function(json) {
														// implement your own
														// logic here
														console.log("succsess");
													}
												});
									}
								});
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