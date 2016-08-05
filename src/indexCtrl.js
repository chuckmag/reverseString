
var app = angular.module('reverseString', [
	'btford.socket-io',
	]).factory('socket', function (socketFactory) {
		return socketFactory({
			prefix: '',
		});
	});
app.factory('palindromeService', function($http, $q) {
	return {
		isPalindrome: function(s) {
			return $http.get("./isPalindrome/" + encodeURIComponent(s))
				.then(function(response) {
					return response.data;
				}, function(response) {
					return $q.reject(response.data);
				});
		},
		isPalindromeBad: function(s, reverseS) {
			return $http.get("./isPalindromeBad/" + encodeURIComponent(s) + "/" + encodeURIComponent(reverseS))
				.then(function(response) {
					return response.data;
				}, function(response) {
					return $q.reject(response.data);
				});
		}
	};
});
app.factory('reverseStringService', function($http, $q) {
	return {
		reverseString: function(s) {
			return $http.get("./reverseString/" + encodeURIComponent(s))
				.then(function(response) {
					return response.data;
				}, function(response) {
					return $q.reject(response.data);
				});
		}
	};
});

app.controller('indexCtrl', function($scope, $http, socket, palindromeService, reverseStringService) {
	var reverseStringHandler = function(rs){
		$scope.reversedStringSocket = rs;
	};
	
	socket.on('reverse string', reverseStringHandler);
	
    $scope.stringToReverse = "";
	$scope.reverseString = reverseStringService.reverseString;
	
	var checkIfPalindrome = function(s, $scope) {
		var errorHandler = function(error) {
				new Error(error);
		};
		
		palindromeService.isPalindrome(s)
			.then(function(isPalindrome) {
				$scope.isPalindrome = isPalindrome;
			}, errorHandler);
		
		var reverseString = function(s) {
			return reverseStringService.reverseString(s)
				.then(function(reversedString) {
					$scope.reversedString = reversedString;
					return reversedString;
				});
		}
		
		var checkIfPalindromeBad = function(reversedString) {
			return palindromeService.isPalindromeBad(s, reversedString)
					.then(function(isPalindrome) {
						$scope.isPalindromeBad = isPalindrome;
					});
		}
		
		reverseString(s)
			.then(checkIfPalindromeBad)
			.catch(errorHandler);
	};
	
	$scope.checkIfPalindrome = function(s) {
		if (s === null) {
			$scope.isPalindrome = false;
			$scope.isPalindromeBad = false;
		}
		checkIfPalindrome(s, $scope);
	}
	
	
	
    $scope.stringToReverseSocket = "";
	$scope.reverseStringSocket = function() {
		socket.emit('reverse string', $scope.stringToReverseSocket);
	};
	
});