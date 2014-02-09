var myApp = angular.module('myApp', ['uiJMRouter']);

myApp.factory('input', function() {
		return { elapsedTime: '', label: '' };
})
.factory('metriclist', function(){
	// headers of data file
	return { names: [ 'elapsed', 'Latency', 'SampleCount' ] };
})
.controller('MyController', ['$scope', 'input', function($scope, input){
		$scope.filter_input = input;
		// $scope.filter_input = { elapsedTime: '', label: '' };
		// $scope.ctrl_filter_input = { elapsedTime: 0};
		// the scope variables received by the directive is also available to controller
		// file name, folder name etc... are available to the controller
}])
.controller('myd3Controller', function($scope, $q) {
	// console.log('Hello my controller');
	$scope.getData = function (fileName, folderName) {
		var deferred = $q.defer();
		d3.csv("./data/".concat(folderName, "/", fileName), function(data) {
			deferred.resolve(data);
			$scope.$apply(); // great...enter angular world, digest cycle.
		});
		return deferred.promise;
	};

	$scope.getBarPlotData = function() {
	};

	$scope.getAggregateData = function() {
	};

	$scope.getXMLData = function(fileName, folderName) {
		var deferred = $q.defer();
		d3.xml("./data/".concat(folderName, "/", fileName), function(data) {
			deferred.resolve(data);
			// you are in d3 world
			// enter angular world, kick-off digest cycle
			$scope.$apply();
		});
		// return promise immediately
		return deferred.promise;
	};

})
.controller('MyReportController', ['$scope', function($scope){
	$scope.tgreport = {};
	$scope.genReport = function(folder_name, file_name) {

			d3.csv("./data/".concat(folder_name, "/", file_name), function(data) {
				data.map(function(d) { d.strStartTime = new Date(+d.start_time); } );
				data.map(function(d) { d.strEndTime = new Date(+d.end_time); } );
				// unit = min
				data.map(function(d) { d.duration = Math.round((d.strEndTime - d.strStartTime) / 1000 / 60); } );
				$scope.tgreport = data;
				// communicate to ng
				$scope.$apply($scope.tgreport);
				// console.log($scope.tgreport.data);
			});
	};

	// to debug
	window.controller_scope = $scope;
	console.log($scope);
}]);
