// var myApp = angular.module('myApp', ['uiJMRouter'])
myApp
.directive('durationReport', function () {
	return {
		restrict: 'A',
		scope: {},
		controller: 'MyReportController',
		link: function (scope, elem, attrs) {
			// console.log("Recognized the fundoo-rating directive usage");

			// scope of director is same as the scope of the controller MyReportController
			// check via console, they both will have the same $id
			window.director_scope = scope;
			console.log(scope);
			// console.log(elem);
			// console.log(attrs);
			// console.log(attrs.folderName);
			// console.log(attrs.fileName);

			scope.genReport(attrs.folderName, attrs.fileName);
			// var file_name = 'tg_startend_report.txt';
			// var folder_name = 'iml_Nov2013/29112013_145001_BASELINE_50TCHR_500STU';
		
		}
	};
});