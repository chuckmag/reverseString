
var app = angular.module('reverseString', []);
app.controller('indexCtrl', function($scope, $http) {
    $scope.stringToReverse = "";
	$scope.reverseString = function(s) {
		$http({
        method : "GET",
        url : "./reverseString/" + encodeURIComponent(s)
		}).then(function mySucces(response) {
			$scope.reversedString = response.data;
		}, function myError(response) {
			console.log(response.statusText);
		});
	};
});