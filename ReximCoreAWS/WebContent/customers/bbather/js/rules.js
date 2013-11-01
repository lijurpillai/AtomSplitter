jQ(function(){ 
	
  //***  RuleData constructor ***//
  function RuleData(custId,apiKey,version,ruleId){
    this.ruleId = ruleId; 
    this.isRule = true;
    this.custId = custId;
    this.apiKey = apiKey;
    this.version = version;
    this.trackingId = getTrackingId();    
    this.userId = getUserId();
    this.clientId = "";
    this.pageData = {};	    
    this.isNewUser = isNewUser();
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
    	this.ruleName = getRuleDetails(ruleId).rName;
    	this.ruleDesc =  getRuleDetails(ruleId).rDesc;          	    	   
      }
	if(window.location.search.indexOf("product/search&filter_name") >= 0)
    {
                var ruleId = "0001";
                if(jQ('.content').text().indexOf("There is no product that matches the search criteria") >=0) {
                var ruleData = new RuleData("bbather","apiKEY" ,"1.0",ruleId );
                ruleData.ruleDetails = new RuleDetails(ruleId);
                ruleData.pageData = getPageData();
                ruleData.ruleDetails.searchParam = window.location.search.split("filter_name=").pop();
                console.log(ruleData);
                __PUBNUB.publish({
                      channel : _channel,
                      message : ruleData
               });
            } 
    }
	if(window.location.pathname==("/returns-policy"))
    {
                var ruleId = "0002";
                var ruleData = new RuleData("bbather","apiKEY" ,"1.0",ruleId );
                ruleData.ruleDetails = new RuleDetails(ruleId);
                ruleData.pageData = getPageData();
                console.log(ruleData);
                __PUBNUB.publish({
                      channel : _channel,
                      message : ruleData
               });
             
    }
	if(window.location.pathname==("/login"))
    {
              var ruleId = "0003";
              if(jQ('.warning').text().indexOf("Warning: No match for E-Mail Address and/or Password") >=0) {
                var ruleData = new RuleData("bbather","apiKEY" ,"1.0",ruleId );
                ruleData.ruleDetails = new RuleDetails(ruleId);
                ruleData.pageData = getPageData();
                console.log(ruleData);
                __PUBNUB.publish({
                      channel : _channel,
                      message : ruleData
               });
             }  
    }
	
	
	//** Utils **//
	function getUserId(){  // get user id from screen
		return "unknown";
  	}
	
	function getPageData(){
		var pageDetails = {};
		pageDetails.url = window.location.href;
	    pageDetails.host = window.location.host;
	    pageDetails.hostname = window.location.hostname;
	    pageDetails.hash = window.location.hash;
	    pageDetails.pathname = window.location.pathname;
	    pageDetails.params = window.location.search;
	    pageDetails.navigatorVersion = navigator.appVersion;
	    pageDetails.navigatorAgent = navigator.userAgent;
	    pageDetails.browserName = navigator.appName;
	    pageDetails.platform = navigator.platform;
	    pageDetails.cookieEnabled = navigator.cookieEnabled;
	    pageDetails.localStorageEnabled = hasStorage();
	    pageDetails.referrer = document.referrer;
	    if(hasStorage()){
	    	pageDetails.firstVisit = getStorageData().firstVisit;
	    	pageDetails.lastVisit = getStorageData().lastVisit;
	    	pageDetails.totalVisit = getStorageData().visit;
	    }
	    
	    return pageDetails;
	}
	
	function isNewUser(){
		var newUser = false;
		//**This should not happen since analytics js will set it**//
		if(!jQ.cookie('__uatma')){
			console.log("first time user");
			newUser = true;			
		}
		return newUser;
	}
	
	function getTrackingId(){
		//**Return global varaible**//
		return _fPrint;
	}
	
	function hasStorage(){
		//**Return global varaible**//
		return __hasStorage;
	}
	
	function getStorageData(){
		return JSON.parse( localStorage.getItem( '__userData' ) );
	}

  	function getRuleDetails(ruleId) {
  		switch(ruleId)
    	{
    		case "0001":
    		return {rName :"Search:No products" , rDesc : "Search returned no products"}; 
    		case "0002":
        	return {rName :"Clicked: Exchange&Refunds" , rDesc : "Clicked: Exchange&Refunds"}; 
    		case "0003":
            return {rName :"Error: Login" , rDesc : "Error: Not able to login"};
    		default: return {rtype :"" , rdesc : ""};
    	}
    }

});