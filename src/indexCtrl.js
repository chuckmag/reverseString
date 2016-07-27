
var app = angular.module('reverseString', [
	'btford.socket-io',
	]).factory('socket', function (socketFactory) {
		return socketFactory({
			prefix: '',
		});
	});
app.controller('indexCtrl', function($scope, $http, socket) {
	var reverseStringHandler = function(rs){
		$scope.reversedStringSocket = rs;
	};
	
	socket.on('reverse string', reverseStringHandler);
	
    $scope.stringToReverse = "";
	$scope.reverseString = function() {
		$http({
        method : "GET",
        url : "./reverseString/" + encodeURIComponent($scope.stringToReverse)
		}).then(function mySucces(response) {
			$scope.reversedString = response.data;
		}, function myError(response) {
			console.log(response.statusText);
		});
	};
	
    $scope.stringToReverseSocket = "";
	$scope.reverseStringSocket = function() {
		socket.emit('reverse string', $scope.stringToReverseSocket);
	};
	
});