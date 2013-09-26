
angular.module('myApp.indexControllers', []).
 controller('NavCtrl',['$scope','$location',function($scope,$location){
	 console.log("inside NavCtrl control-->" + $location.path());	 
	 $scope.isActive = function(route) {
	        return route === $location.path();
	 };
}]);