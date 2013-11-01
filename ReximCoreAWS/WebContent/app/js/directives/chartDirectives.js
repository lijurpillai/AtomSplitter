'use strict';

/* Directives */
angular.module('myApp.chartDirectives', []).directive('chart', function(AnalyticsData){
    return{
        restrict: 'E',
        link: function(scope, elem, attrs){            
            var chart = null;
            var data = scope[attrs.ngModel];            
            
            // If the data changes somehow, update it in the chart
            scope.$watch('chartData', function(chartData){
            	console.log(AnalyticsData.getPageCountConfigs());
            	var ticks =  AnalyticsData.getPageCountConfigs();            	
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
            });
        }
    };
});