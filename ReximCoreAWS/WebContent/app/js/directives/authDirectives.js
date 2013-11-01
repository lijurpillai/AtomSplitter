'use strict';

/* Directives */


angular.module('myApp.authDirectives', []).
  directive('reximUserName', function($log,$rootScope) {
    return function(scope,element,attrs){
    	scope.$watch(attrs.reximUserName, function(value) {			
			$rootScope.SHOW_USER_ERROR = false;
	      });    	
    };
   
  }).
  directive('reximPassword', function($log,$rootScope) {
	    return function(scope,element,attrs){
	    	scope.$watch(attrs.reximPassword, function(value) {		    		
				$rootScope.SHOW_PWD_ERROR = false;
		      });    	
	    };
	   
	  }).
	  directive('focusMe', function($timeout, $parse) {
		  return {
		    link: function(scope, element, attrs) {
		      var model = $parse(attrs.focusMe);
		      scope.$watch("open", function(value) {
		        console.log('value=',value);
		        if(value === true) { 
		          $timeout(function() {
		            element[0].focus(); 
		          });
		        }
		      });		     
		    }
		  };
		}).
		directive('chart', function(AnalyticsData){
		    return{
		        restrict: 'E',
		        link: function(scope, elem, attrs){
		            
		            var chart = null;
		            /*var options = {
		                    series: {
		                        bars: {show: true,fill:1,fillColor: "#757dad",align: "center" },
		                        color: "#454d7d"
		                    },		                    
		                    xaxis: {ticks: AnalyticsData.getPageCountConfigs()}	                    	
		                    
		                };	*/	
		            
		           /* var options = {
		            		series: {
		            	        bars: {
		            	            show: true,
		            	            align: "center",
		            	            barWidth: 0.5
		            	        }
		            	    },
		            	    xaxis: {
		            	        axisLabel: "Page Names",
		            	        axisLabelUseCanvas: true,
		            	        axisLabelFontSizePixels: 12,
		            	        axisLabelFontFamily: 'Verdana, Arial',
		            	        axisLabelPadding: 10
		            	        //ticks: ticks
		            	        
		            	    }
		            		
		            };*/
		                    
		            var data = scope[attrs.ngModel];            
		            
		            // If the data changes somehow, update it in the chart
		            scope.$watch('chartData', function(chartData){
		            	console.log(AnalyticsData.getPageCountConfigs());
		            	var ticks =  AnalyticsData.getPageCountConfigs();
		            	console.log("final ticks");
		            	console.log(ticks);
		            	console.log("final chartData");
		            	console.log(chartData);
		            	 var options = {
				            		series: {
				            	        bars: {
				            	            show: true,
				            	            align: "center",
				            	            barWidth: 0.5
				            	        }
				            	    },
				            	    xaxis: {
				            	    	axisLabel: "Page Count",
				            	        axisLabelUseCanvas: true,
				            	        axisLabelFontSizePixels: 12,
				            	        axisLabelFontFamily: 'Verdana, Arial',
				            	        axisLabelPadding: 10,
				            	        ticks: ticks				            	        
				            	    }				            		
				            };
				              
		            	 chart = $.plot(elem, chartData , options);
		                 /*if(!chart){
		                    chart = $.plot(elem, chartData , options);
		                    //elem.show();
		                }else{
		                    chart.setData(chartData);
		                    chart.setupGrid();
		                    chart.draw();
		                }*/
		            });
		        }
		    };
		}).		
  directive('appVersion', ['version', function(version) {
	    return function(scope, elm, attrs) {
	      elm.text(version);
	    };
	  }]);
