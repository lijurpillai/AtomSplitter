(function(){
    var pubnub = PUBNUB.init({
      publish_key   : 'pub-c-43e4e48b-0a32-4edc-8555-58875edc6cbc',
      subscribe_key : 'sub-c-95086202-154f-11e3-9b93-02ee2ddab7fe'
  });
  pubnub.publish({
          channel : "sstore_analyticsData",
          message : "from OpenShift"
      });
  pubnub.subscribe({
      channel : "analyticsData",
      message : function(m){ alert(m); }     
  	});
})();