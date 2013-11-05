'use strict';

/* Directives */

var chartDirective = angular.module('myApp.chartDirectives', []);

chartDirective.directive('chart', function(AnalyticsData){
	    return{
	        restrict: 'E',
	        link: function(scope, elem, attrs){            
	            var chart = null;
	            var data = scope[attrs.ngModel];            
	            
	            // If the data changes somehow, update it in the chart
	            scope.$watch('chartData', function(chartData){	            	
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

			            	    	axisLabel:"",
			            	        axisLabelUseCanvas: false,
			            	        axisLabelFontSizePixels: 10,
			            	        axisLabelFontFamily: 'Verdana, Arial',
			            	        axisLabelPadding: 10,
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

chartDirective.directive('piechart', function() {
    return {
        restrict: 'E',        
        link: function(scope, elem, attrs) {
        	var chart = null;
            scope.$watch('pieChartUserType', function(v){ 
            	var options = {
            			series: {
		        	        pie: {
		        	            show: true,
		        	            label: {
		        	                show: true,		        	                
		        	                labelFormatter: function (label, series) {
		        	                    return '<div style="border:1px solid grey;font-size:8pt;text-align:center;padding:5px;color:white;">' +
		        	                    label + ' : ' +
		        	                    Math.round(series.percent) +
		        	                    '%</div>';
		        	                },
		        	        }
		        	    },
		        	    grid: {
		        	        hoverable: true
		        	    }
            	}
            };
                if(v) 
                {
                    chart = $.plot(elem, v, options);                    
                }
            });
        }
    };
});

