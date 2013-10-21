jQ(function(){ 
	_channel = "bbather_analyticsData_qa";
	_fingerPrint = new Fingerprint();
	_fPrint = _fingerPrint.get();
	var uatma = null;
	var newUser = false;
	var cookieData = {};
	//***Storagedata constructor*//
	function StorageData(_fPrint,firstVisit,visit){
	       this.tId = _fPrint;
	       this.firstVisit = firstVisit;
	       this.lastVisit = Date.now();
	       this.visit = visit;
	  }
	StorageData.prototype ={
	    constuctor : StorageData	    
	  };
	//***Storagedata constructor ends*//
	
	//***AnalyticsData constructor*//
	  function AnalyticsData(custId,apiKey,version){
	    this.custId = custId;
	    this.apiKey = apiKey;
	    this.version = version;
	    this.trackingId = _fPrint;
	    this.ruleName = "Active User";
	    this.userId = getUserId();
	    this.clientId = "";
	    this.pageData = {};	    
	    this.isNewUser = newUser; 
	  }
	  AnalyticsData.prototype ={
	    constuctor : AnalyticsData,
	    getCustId : function(){
	      alert(this.custId);
	    }
	  };
	  //***AnalyticsData constructor ends*// 
	
	//***Check if browser supports storage Set as Global*//
	__hasStorage = (function() {
	      try {
	        localStorage.setItem("test", "value");
	        localStorage.removeItem("test");
	        return true;
	      } catch(e) {
	        return false;
	      }
	    }());
	//***Storage check ends*//
	//***Storage setter getter*//
	function setStorageData(storageData){
			localStorage.setItem( '__userData', JSON.stringify(storageData) );
	}
	
	function getStorageData(){
		return JSON.parse( localStorage.getItem( '__userData' ) );
	}
	//***Storage setter getter ends*//
	//***Check for first time user*//
	if(!jQ.cookie('__uatma')){
		console.log("first time user");
		newUser = true;
		cookieData = {tId:_fPrint , firstVisit:Date.now()};
		jQ.cookie('__uatma',JSON.stringify(cookieData), { expires: 1000, path: '/' });
		uatma = JSON.parse(jQ.cookie('__uatma'));
	}
	//***Check for repeat user*//
	else{		
		uatma = JSON.parse(jQ.cookie('__uatma'));
		var fristVisit = uatma.firstVisit;
		var currentTime =Date.now();
		if((currentTime-fristVisit)<60000){//86400000	
			newUser = true;			
		}
		if(_fPrint!=uatma.tId){
			_fPrint = uatma.tId;
		}
	}
	//***Check for first time/repeat user ends*//
	//***Set storage data to localstorage*//
	if(__hasStorage){
		var visit = 1;
		if(!newUser && getStorageData()){
			visit = getStorageData().visit + 1;
		}
		var storageData = new StorageData(_fPrint,uatma.firstVisit,visit);
		setStorageData(storageData);
	}
  console.log("browser fingerprint " + _fingerPrint.get()); 
  //***Pub nub global variable*//
  __PUBNUB = PUBNUB.init({
      publish_key   : 'pub-c-d3ac13ed-c7c1-4998-ab20-1b35279e2537',
      subscribe_key : 'sub-c-2786f95e-30bc-11e3-8450-02ee2ddab7fe',
      restore    : true, 
      uuid: _fPrint
  });
  //***Dummy subscription so that presence feature of pubnub works*//
  __PUBNUB.subscribe({
      channel : _channel ,
      message : function(m){ console.log(m);}
  	});
  
  //***Initialize Analytics obj and set values*//
    var analyticsData = new AnalyticsData("bbather","apiKEY" , "1.0");
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
    analyticsData.pageData.cookieEnabled = navigator.cookieEnabled;
    analyticsData.pageData.localStorageEnabled = __hasStorage;
    analyticsData.pageData.referrer = document.referrer;
    if(__hasStorage){
    	analyticsData.pageData.firstVisit = getStorageData().firstVisit;
    	analyticsData.pageData.lastVisit = getStorageData().lastVisit;
    	analyticsData.pageData.totalVisit = getStorageData().visit;
    }    
    console.log(JSON.stringify(analyticsData));
    //***Init ends*//
    
    //***Publish to dashboard**//
     __PUBNUB.publish({
          channel : _channel,
          message : analyticsData
      });
     
    function getUserId(){
    	return "unknown";
    }
    
});