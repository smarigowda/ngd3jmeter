myApp
.directive('jmTableAggregate', ['metriclist', function(metriclist) {
	var directiveDefinitionObject = {
		restrict: 'A',
		scope: {
			fileName: '@',
			folderName: '@',
		},
		transclude: true,
		link: function (scope, elem, attrs) {

			d3.csv("./data/".concat(scope.folderName, "/", scope.fileName), function(d) {
						console.log('data read by jmTableAggregate');
						console.log(d);

						var groupbyLabel = d3.nest()
								.key(function(d) { return d.label; })
								.sortKeys(d3.ascending)
								// for each group of label perform the below group wise computation
								.rollup(function(d) {

								// d is an array of objects (for each label)
								//console.log("d inside nest");
								//console.log(d);
								// label is same for each of the objects inside the array
								// because its grouped by label
								console.log(d[0].label);
								console.log(d.length);
								// pluck works on each element of data d
								console.log(_.pluck(d, 'elapsed').map(function(d2) {return +d2;}).sort(d3.ascending));

									return {
										// each element of d is passed to the function
										avg_elapsed: d3.mean(d, function(g) { return +g.elapsed; }),
										// d3.quantile expects the array to be ordered in ascending
										// map is used to convert the string elements into numbers
										percentile: d3.quantile(_.pluck(d, 'elapsed').map(function(d2) {return +d2;}).sort(d3.ascending), 0.90),
										error_count: _.pluck(d, 'ErrorCount').map(function(d) { return +d; } ).reduce(function(prev, curr) { return prev + curr; }),
										// throughput
										sample_count: d.length,
										//sample_start_time: new Date(+d[0].timeStamp),
										//sample_end_time: new Date(+d[d.length - 1].timeStamp),
										//throughput: d.length / (((new Date(+d[d.length - 1].timeStamp) - new Date(+d[0].timeStamp)) / 1000)/60)
										//max_ts: d3.max(_.pluck(d, 'timeStamp')),
										//min_ts: d3.min(_.pluck(d, 'timeStamp')),
										// another strategy is used to get the throughput
										//throughput: d.length / (((new Date(d3.max(+(_.pluck(d, 'timeStamp')))) - new Date(d3.min(+(_.pluck(d, 'timeStamp'))))) / 1000)/60)
									};
								})
								.entries(d);

						var barplot_table = d3.select('#'.concat(attrs.id)).append("table");

						scope.$apply(barplot_table);
						
						barplot_table.append('th').text('Label');
						barplot_table.append('th').text('Percentile');
						barplot_table.append('th').text('error_count');

						var table_row = barplot_table.selectAll('tbody')
											.data(groupbyLabel)
											.enter().append('tbody')
											.append('tr');

						table_row.append('td').text(function(d) { return d.key; });
						table_row.append('td').text(function(d) { return d.values.percentile.toFixed(0); });
						table_row.append('td').text(function(d) { return d.values.error_count; });
			});
		}
	};
	return directiveDefinitionObject;
}]);