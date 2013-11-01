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
		            	            barWidth: 0.7
		            	        }
		            	    },
		            	    xaxis: {
		            	    	axisLabel: "Pages",
		            	        axisLabelUseCanvas: false,
		            	        axisLabelFontSizePixels: 9,
		            	        axisLabelFontFamily: 'Verdana, Arial',
		            	        axisLabelPadding: 3,
		            	        ticks: ticks			            	        
		            	    },	
		            	    grid: {
		                        hoverable: true,
		                        borderWidth: 0,
		                        backgroundColor: { colors: ["#ffffff", "#EDF5FF"] }
		                       }
		            };
		              
            	 chart = $.plot(elem, chartData , options);                 
            });
        }
    };
});