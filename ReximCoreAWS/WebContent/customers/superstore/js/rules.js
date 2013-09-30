jQ(function(){ 
 
  console.log("browser fingerprint rules page " + _fingerPrint.get());
  var pubnub = PUBNUB.init({
      publish_key   : 'pub-c-43e4e48b-0a32-4edc-8555-58875edc6cbc',
      subscribe_key : 'sub-c-95086202-154f-11e3-9b93-02ee2ddab7fe'
  }); 

  //***  RuleData constructor ***//
  function RuleData(custId,apiKey,version,ruleId){
    this.ruleId = ruleId;
    this.custId = custId;
    this.apiKey = apiKey;
    this.version = version;    
    this.url = window.location.href;
    this.trackingId = _fingerPrint.get();
    this.userId = getUserId();
    this.clientId = "";            
  }
  RuleData.prototype ={
    constuctor : RuleData,
    getCustId : function(){
      alert(this.custId);
    }
  };
 //** RuleData Const ends **//

 //**Rule constructor**//
	function RuleDetails(ruleId){    	
    	this.ruleType = getRuleDetails(ruleId).rtype;
    	this.ruleDesc =  getRuleDetails(ruleId).rdesc;          	    	   
      }  



    /** Rule 0001 - No results found
    **  In "catalogsearch/result/" page when ".note-msg" == "Your search returns no results."
    **  then no results found for product "?q="
    **/

    if(window.location.pathname == "/catalogsearch/result/")
    {   var ruleId = "0001";
		console.log("inside rule " + ruleId);
    	if(jQ('.note-msg').text().trim() == 'Your search returns no results.'){
    		var ruleData = new RuleData("SuperStore","apiKEY" , "1.0",ruleId );
    		ruleData.ruleDetails = new RuleDetails(ruleId);
    		ruleData.ruleDetails.searchParam = window.location.search; // add params
            ruleData.ruleDetails.chat = true;
            ruleData.ruleDetails.offer = true;
    		console.log(ruleData );
    		socket.emit('0001',ruleData);
            pubnub.publish({
              channel : "rule",
              message : ruleData
            })
       	}   		
    }
    /** Rule 0001 ends **/

    /** Rule 0002 - Coupon code error
    **  In "catalogsearch/result/" page when ".note-msg" == "Your search returns no results."
    **  then no results found for product "?q="
    **/

     if(window.location.pathname == "/checkout/cart/")
     {
     	var ruleId = "0002";
     	var triggerPrice = 200;
     	console.log("inside rule " + ruleId);
     	// getting subtotal element
     	var subtotalElem = jQ('#shopping-cart-totals-table tbody span.price').text(); 
        // remove ',' and convert to  int.	
     	var subtotal = parseFloat(subtotalElem.substring(2).replace(/\,/g,'')); 
     	console.log(subtotal);
     	// if error on apply coupon and subtotal > trigger price
     	if((jQ('.error-msg').length > 0)&&(subtotal>triggerPrice)){
     		console.log("activating rule 0002");
     		var ruleData = new RuleData("SuperStore","apiKEY" , "1.0",ruleId );
     		ruleData.ruleDetails = new RuleDetails(ruleId);
            ruleData.ruleDetails.chat = true;
            ruleData.ruleDetails.offer = false;
     		console.log(ruleData);
     		socket.emit('0002',ruleData);
     		
     	}
     }

     /** Rule 0003 - A2C Auto Response over 2000 Rs
    **  In "catalogsearch/result/" page when ".note-msg" == "Your search returns no results."
    **  then no results found for product "?q="
    **/

    if(window.location.pathname == "/checkout/cart/")
    {   var ruleId = "0003";
        var triggerPrice = 300;
        console.log("inside rule " + ruleId);
        // getting subtotal element
        var subtotalElem = jQ('#shopping-cart-totals-table tbody span.price').text(); 
        // remove ',' and convert to  int.  
        var subtotal = parseFloat(subtotalElem.substring(2).replace(/\,/g,''));
        console.log(subtotal);
        if(subtotal>triggerPrice){
            var ruleData = new RuleData("SuperStore","apiKEY" , "1.0",ruleId );
            ruleData.ruleDetails = new RuleDetails(ruleId);
            ruleData.ruleDetails.autoResponseOffer = true;
            ruleData.ruleDetails.chat = true;
            ruleData.ruleDetails.offer = false;
            socket.emit('0003',ruleData);
        }

    }
    /** Rule 003 Ends**/


	//console.log(jQ('h2[class = "product-name"]').text(0));
	jQ('h2[class = "product-name"]').each(function(index){
		if(jQ(this).text() =='CN Clogs Beach/Garden Clog')
			jQ(this).bind("click",function(e){
				e.stopPropagation();
				console.log("sending socket");
			});
	});	

	//** Utils **//
	function getUserId(){  // get user id from screen
      var userId = "";        
      userId = jQ('.welcome-msg').text();
      return userId;
  	}

  	function getRuleDetails(ruleId) {
    	switch(ruleId)
    	{
    		case "0001":
    		 return {rtype :"No Results Found" , rdesc : "Prod search returns no result"};
    		case "0002":
    		 return {rtype :"Coupon Error" , rdesc : "Coupon error with subtotal greter than 2000"};
            case "0003":
             return {rtype :"A2C auto response" , rdesc : "A2C for amount greater than 3000"};
    		default: return {rtype :"" , rdesc : ""};
    	}
    }

});