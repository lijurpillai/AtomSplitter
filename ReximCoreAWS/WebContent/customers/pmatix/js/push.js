jQ(function(){
	var adminClientId = "";
	var supportUser = "";

	jQ(".footer-container").append("<div id ='offerCode'><span></span></div>");
	jQ('#offerCode').append('<div id="dialogBox" title="Basic dialog"></div>');
	//jQ('#offerCode').dialog({autoOpen: true});

	jQ( "#offerCode" )
	.dialog({autoOpen: false,show: {effect: "slide",duration: 1000},
	hide: {effect: "puff",duration: 1000}
    },{ title: "Offer Code" },
		{ position: { my: "right ", at: "bottom", of: ".footer-container" } },
			{ buttons: [ { text: "OK", click: function() { jQ( this ).dialog( "close" ); } } ] 
	});

	socket.on('offerCode',function(data){  // data coming from sever to the specific instance.....
          console.log("OFFer");
          console.log(data);
          var offerMessage = "Use offer code '" + data 
          		+"' to avail free shipping. Offer valid for next 10 mins";
          jQ( "#offerCode span" ).text(offerMessage);
          jQ( "#offerCode" ).dialog( "open" );
          
        });  
});