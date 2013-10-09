jQ(function(){ 
	_fingerPrint = new Fingerprint();
	  console.log("browser fingerprint " + _fingerPrint.get()); 
  var channel = "sstore_analyticsData_qa";
  var pubnub = PUBNUB.init({
	  publish_key   : 'pub-c-d3ac13ed-c7c1-4998-ab20-1b35279e2537',
      subscribe_key : 'sub-c-2786f95e-30bc-11e3-8450-02ee2ddab7fe',
      restore    : true, 
      uuid: _fingerPrint.get()
  });

  
  var custId = "SuperStore";
  var adminClientId = "";   
  console.log(document.cookie);
  pubnub.subscribe({
      channel : channel ,
      message : function(m){ console.log(m);}
  	});


//  AnalyticsData constructor
  function AnalyticsData(custId,apiKey,version){
    this.custId = custId;
    this.apiKey = apiKey;
    this.version = version;
    this.trackingId = _fingerPrint.get();
    this.ruleName = "Active User";
    this.userId = getUserId();
    this.clientId = "";
    this.pageData = {};

    /*this.pageData.url = window.location.href;
    this.pageData.referrer = document.referrer;*/    
  }
  AnalyticsData.prototype ={
    constuctor : AnalyticsData,
    getCustId : function(){
      alert(this.custId);
    }
  };
 	// Const ends  
    
    var analyticsData = new AnalyticsData("owaCustomer1","apiKEY" , "1.0");
//    analyticsData.userId = getUserId();
    analyticsData.pageData.url = window.location.href;
    analyticsData.pageData.host = window.location.host;
    analyticsData.pageData.hostname = window.location.hostname;
    analyticsData.pageData.hash = window.location.hash;
    analyticsData.pageData.pathname = window.location.pathname;
    analyticsData.pageData.params = window.location.search;
    analyticsData.pageData.navigatorVersion = navigator.appVersion;
    analyticsData.pageData.navigatorAgent = navigator.userAgent;
    analyticsData.pageData.browserName = navigator.appName;
    analyticsData.pageData.platform = navigator.platform;
//    analyticsData.pageData.geoLocation = navigator.geolocation.getCurrentPosition();
    analyticsData.pageData.cookieEnabled = navigator.cookieEnabled;
    analyticsData.pageData.referrer = document.referrer;
    console.log(JSON.stringify(analyticsData));
    
     pubnub.publish({
          channel : channel,
          message : analyticsData
      });
     
    function getUserId(){
      var userId = "";
      /*if(jQ('.quick-access .last ').find('a:first').text() == "Log Out"){
        userId = jQ('.welcome-msg').text();
        console.log("user id --> " + userId);
      }  */   
      userId = jQ('.welcome-msg').text();
      return userId;
    }
});