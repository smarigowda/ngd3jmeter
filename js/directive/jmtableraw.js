myApp
.directive('jmTableRaw', ['metriclist', 'input', '$compile', function(metriclist, input, $compile) {
	var directiveDefinitionObject = {
		restrict: 'A',
		scope: {
			fileName: '@',
			folderName: '@',
		},
		// transclude: true,
		controller: 'MyController',
		link: function (scope, elem, attrs) {

			d3.csv("./data/".concat(scope.folderName, "/", scope.fileName), function(d) {
						// data will be available in controller
						// scope.data = d;
						// var filter_input;
												
						// data binding of elements created by d3.
						// var htmlinput = d3.select('#'.concat(attrs.id))
						// 					.append("input")
						// 						.attr("type", "text")
						// 						.attr("ng-model", "filter_input.elapsedTime")
						// 						.attr("ng-controller", "MyController");

						// console.log('htmlinput');
						// console.log(htmlinput[0][0]); // the HTML text

						// // compile the template
						// var linkFn = $compile(htmlinput[0][0]);

						// // link the template with scope
						// var element = linkFn(scope);
						
						var raw_table = d3.select('#'.concat(attrs.id)).append("table");

						scope.$watch('filter_input.label', function(oldVal, newVal) {
							if (oldVal !== newVal) {
								redraw(scope.filter_input, d, raw_table, attrs.id);
							}
						});

						scope.$watch('filter_input.elapsedTime', function() {
							redraw(scope.filter_input, d, raw_table, attrs.id);
						});

						// force dogest loop, which in turn checks watch list
						scope.$apply();
						
			});

			function redraw(filter_input, d, raw_table, attr_id) {

				var filt_data = d;
				var table_row;
				
				var rexLabel = new RegExp('.*'.concat(filter_input.label, '.*'));
				var rexElapsed = new RegExp('.*'.concat(filter_input.elapsedTime, '.*'));

				// console.log(rexElapsed);
				filt_data = _.filter(d, function(d) {  return rexLabel.test(d.label) && rexElapsed.test(d.elapsed); });

				raw_table.selectAll('*').remove();

				raw_table.append('th').text('Label');
				raw_table.append('th').text('elapsed');

				table_row = raw_table.selectAll('tbody')
									.data(filt_data)
									.enter()
									.append('tr');

				table_row.append('td').text(function(d) { return d.label; });
				table_row.append('td').text(function(d) { return d.elapsed; });

			}
		}
	};
	return directiveDefinitionObject;
}]);

