var myApp = angular.module('myApp2', [])
.controller('MyController', ['$scope', '$injector', function($scope, Data, $injector){
	$scope.resp_time = Data;
	window.scope = $scope;
}])
.directive('jmBootstrapTest', function() {
	var directiveDefinitionObject = {
		restrict: 'A',
		scope: {
			fileName: '@',
			folderName: '@'
		},
		transclude: true,
		controller: 'MyController',
		link: function (scope, elem, attrs) {
			d3.selectAll('#test').append('button').attr('ng-hide', 'true').text('Hello From Director.!');
		}
	};
	return directiveDefinitionObject;
});

// angular.bootstrap(document.getElementById("container"), [ 'myApp2'])