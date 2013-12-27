var myApp = angular.module('myd3App', [])
.controller('myController', function($scope, $q, $timeout) {
	// console.log('Hello my controller');
	$scope.getData = function (fileName, folderName) {
		// console.log('hello from getData');
		// console.log('at myController:' + fileName);
		// console.log('at myController:' + folderName);
		
		var deferred = $q.defer();

		d3.csv("./data/".concat(folderName, "/", fileName), function(data) {
			// console.log(data);
			// wait for 10 sec...for debugging
			// $timeout(function() {
			// 	console.log('timeout is over...');
			// 	deferred.resolve(data);
			// 	$scope.$apply(); // great...enter angular world, digest cycle.
			// }, 5000);
			deferred.resolve(data);
			$scope.$apply(); // great...enter angular world, digest cycle.
		});

		return deferred.promise;
	};
})
.directive('d3PromiseDemo', function($q) {
	var directiveDefinitionObject = {
		restrict: 'A',
		scope: {
			fileName: '@',
			folderName: '@'
		},
		// transclude: true,
		controller: 'myController',
		link: function (scope, elem, attrs) {
			// window.director_scope = scope;
			// console.log(scope);
			// console.log('fileName = '.concat(scope.fileName));
			// console.log('folderName = '.concat(scope.folderName));

			// console.log('hello from directive jmTsPlot');
			// console.log('@ directive folder name = '.concat(attrs.folderName));
			// console.log('@ directive file name = '.concat(attrs.fileName));
			// var deferred = $q.defer();
			// deferred.promise.then(function(data) { console.log('promise successfully resolved'); });
			// console.log(deferred);
			// console.log(scope);
			// console.log(scope.getData(scope.fileName, scope.folderName));
			var d3promise = scope.getData(scope.fileName, scope.folderName);
			console.log(d3promise);
			d3promise.then(function(data) {
				console.log('promise resolved');
				console.log(data);
			});
		}
	};
	return directiveDefinitionObject;
});


