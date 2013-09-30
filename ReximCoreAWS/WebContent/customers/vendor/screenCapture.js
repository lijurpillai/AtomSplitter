jQ(function(){ 
console.log("loading screenCapture.js....");
//var data = {};
html2canvas(document.body, {
  onrendered: function(canvas) {
    //document.body.appendChild(canvas);
	  var dataURL= canvas.toDataURL();  
    //socket.emit('screenShot',dataURL);
  }
});

function dataURLtoBlob(dataURL) {
    // Decode the dataURL    
    var binary = atob(dataURL.split(',')[1]);
    // Create 8-bit unsigned array
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    // Return our Blob object
    return new Blob([new Uint8Array(array)], {type: 'image/png'});
  }


});