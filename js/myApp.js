var myApp = angular.module('myApp', ['uiJMRouter'])
.factory('Data', function() {
	return {
				elapsedTime: '',
				label: ''
	};
})
.factory('metriclist', function(){
	// headers of data file
	return { names: [ 'elapsed', 'Latency', 'SampleCount' ] };
})
// note that $injector can be injected!
.controller('MyController', ['$scope', 'Data', '$injector', function($scope, Data, $injector){
  $scope.filter_input = Data;


  // the scope variables received by the directive is also available to controller
  // file name, folder name etc... are available to the controller
  window.mycontrollerscope = $scope;

}])
.controller('MyController2', ['$scope', 'Data', '$injector', function($scope, Data, $injector){
  $scope.filter_input = Data;


  // the scope variables received by the directive is also available to controller
  // file name, folder name etc... are available to the controller
  window.mycontrollerscope2 = $scope;

}])
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
}])
.controller('MyTSPlotController', ['$scope', function($scope){
	// console.log('hello from MyTSPlotController');

	window.controller_scope = $scope;
	console.log($scope);
}])
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
})
.directive('jmTsplot', ['metriclist', function(metriclist) {
	var directiveDefinitionObject = {
		restrict: 'A',
		scope: {
			fileName: '@',
			folderName: '@'
		},
		transclude: true,
		controller: 'MyMetricController',
		link: function (scope, elem, attrs) {
			window.director_scope = scope;
			console.log(scope);
			console.log('@ fileName = '.concat(scope.fileName));
			console.log('@ director metriclist = '.concat(metriclist));

			// console.log('hello from directive jmTsPlot');
			// console.log('@ directive folder name = '.concat(attrs.folderName));
			// console.log('@ directive file name = '.concat(attrs.fileName));
			
			d3.csv("./data/".concat(scope.folderName, "/", scope.fileName), function(data) {

				// console.log('data @ controller'.concat(data));

				// create a selection html element
				// use unique data labels
				var labels = _.uniq(data.map(function(d) { return d.label; } ));
				// console.log(labels);

				var metric_selected = 'elapsed';
				var selected_label = 'ALL';
				
				// attach data to the scope...
				scope.d3data = data;
				var data_bkp = data;
				var filt_data;



				// var select = d3.select('body').append('select');
				var select = d3.select('#'.concat(attrs.id)).append('select');
				select.append('option').attr('value', 'ALL').text('ALL');
				select.selectAll('option')
						.data(labels).enter().append('option')
						.attr('value', function(d) { return d; })
						.text(function(d) { return d; });

				// var metriclist = ['elapsed', 'Latency'];
				// console.log('metriclist='.concat(metriclist));
				var select2 = d3.select('#'.concat(attrs.id)).append('select');
				select2.selectAll('option')
						.data(metriclist.names).enter().append('option')
						.attr('value', function(d) { return d; })
						.text(function(d) { return d; });

				// select2.append('option').attr('value', 'elapsed').text('elapsed');
				// select2.append('option').attr('value', 'Latency').text('Latency');

				select2.on('change', function() {
					metric_selected = this.value;
					console.log('in d3js, metric selected = '.concat(metric_selected));

					if (selected_label !== 'ALL') {
						filt_data = _.filter(data, function(d) { return d.label === selected_label; });
					}

					// console.log('Filtered data...');
					// console.log(filt_data);
					// remove the plot
					// d3.selectAll('svg').remove();
					d3.select('#'.concat([attrs.id])).selectAll('svg').remove();
					// console.log('data bkp......');
					// console.log(data_bkp);
					// re-draw the plot
					if ( selected_label === 'ALL' ) { scope.drawPlot(data_bkp, metric_selected); } else { scope.drawPlot(filt_data, metric_selected); }

				});

				// console.log('@ directive: select is....');
				// console.log(select);
				// add another selection for metric
				// scope.$apply( d3.select('#'.concat(attrs.id))
				// 					.append('select')
				// 						.attr('id', 'metric')
				// 						.attr('ng-model', 'metric.name'));
				// d3.selectAll('#metric').append('option').attr('value', 'elapsedTime').text('elapsedTime');
				// //selectMetric.append('option').attr('value', 'latency').text('latency');

				// scope.$apply(d3.select('body').append('div').text('hello...div {{ metric.name }}'));

				//scope.$apply(selectMetric);


					// filter the data and redraw the plot
						select.on('change', function() {
							console.log('in label select, metric selected = '.concat(metric_selected));
							selected_label = this.value;

							// console.log('selected value:'.concat(this.value));

							if (selected_label !== 'ALL') {
								filt_data = _.filter(data, function(d) { return d.label === selected_label; });
							}

							// console.log('Filtered data...');
							// console.log(filt_data);
							// remove the plot
							// d3.selectAll('svg').remove();
							d3.select('#'.concat([attrs.id])).selectAll('svg').remove();
							// console.log('data bkp......');
							// console.log(data_bkp);
							// re-draw the plot
							if ( selected_label === 'ALL' ) { scope.drawPlot(data_bkp, metric_selected); } else { scope.drawPlot(filt_data, metric_selected); }

						});
				// console.log('csv data read:');
				scope.drawPlot(data_bkp, metric_selected);

			});

			scope.drawPlot = function(data, ydataLabel) {

					console.log('ydataLabel = '.concat(ydataLabel));

					var margin = {top: 30, right: 20, bottom: 80, left: 50},
						width = 1000 - margin.left - margin.right,
						height = 400 - margin.top - margin.bottom;

					var x = d3.time.scale().range([0, width]);
					var y = d3.scale.linear().range([height, 0]);
					var xAxis = d3.svg.axis()
						.scale(x)
						.orient("bottom")
						.ticks(30)
						.tickFormat(d3.time.format("%H-%M-%S"));

					var yAxis = d3.svg.axis()
						.scale(y)
						.orient("left");

					// convert time stamp to number
					data.map(function(d) { d.timeStamp = +d.timeStamp; });
					// data.map(function(d) { d.elapsed = +d.elapsed; });
					data.map(function(d) { d[ydataLabel] = +d[ydataLabel]; });

					// console.log(data);
					x.domain(d3.extent(data.map(function(d) {return d.timeStamp;})));

					// console.log("x.domain()");
					// console.log(x.domain());
					// console.log("x.range()");
					// console.log(x.range());
					// console.log(x(new Date(0)));
					// set y domain
					y.domain(d3.extent(data.map(function(d){return d[ydataLabel];})));
					// console.log(y.domain());
					var svg = d3.select('#'.concat(attrs.id)).append("svg")
									.attr("width", width + margin.left + margin.right)
									.attr("height", height + margin.top + margin.bottom)
									.append("g")
									.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
					// draw x axis          
					svg.append("g")
						.attr("class", "x axis")
						.attr("transform", "translate(0," + height + ")")
						.call(xAxis);
					// draw y axis
					svg.append("g")
						.attr("class", "y axis")
						.call(yAxis);
					svg.selectAll(".x.axis text")  // select all the text elements for the xaxis
						.style("text-anchor", "end")
						.attr("transform", function(d) {
							// console.log("getBBox");
							// console.log(this.getBBox());
							return "translate(" + this.getBBox().height*-1.0 + "," + this.getBBox().height + ")rotate(-90)"; });
							// console.log(this.getBBox());
							//return "translate(" + this.getBBox().height*-1.0 + "," + this.getBBox().height + ")rotate(0)"; */
					// scatter plot
					svg.selectAll("scatter-dots")
						.data(data)
						.enter().append("svg:circle")
						.attr("cy", function (d) { return y(d[ydataLabel]); } )
						.attr("cx", function (d) { return x(d.timeStamp); } )
						.attr("r", 5)
						.attr('fill', function(d) { if (d.elapsed > 5000) { return 'red'; } else { return 'green'; } })
						.style("opacity", 0.3)
						.append("title").text(function(d){ return ''.concat(ydataLabel, " : ", d[ydataLabel], ' : ' , d.label); });
			};

		}
		// templateUrl: '/template/jmtsplot_template.html'
	};
	// when chrome console is open, it stops at this point
	// so that we can see all the variables at this point
	// debugger; 
	return directiveDefinitionObject;
}])
.controller('MyMetricController', ['$scope', function($scope){
	// console.log('hello from MyTSPlotController');
	window.MyMetricController_scope = $scope;
	console.log($scope);
}])
.directive('jmBarplot', ['metriclist', function(metriclist) {
	var directiveDefinitionObject = {
		restrict: 'A',
		scope: {
			fileName: '@',
			folderName: '@',
			tableData: '@'
		},
		transclude: true,
		link: function (scope, elem, attrs) {

			console.log('tableData = '.concat(scope.tableData));
			console.log('fileName = '.concat(scope.fileName));
			console.log('folderName = '.concat(scope.folderName));

			d3.csv("./data/".concat(scope.folderName, "/", scope.fileName), function(d) {
						console.log(d);

						// group by label, perform "average of elapsed time" and "percentile" for each label
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

						console.log('groupbyLabel');
						// data here is an array of objects
						// each object has two properties: 1. key, 2. values
						// key is a string
						// values is an object with two properties (1) avg_elapsed (2) percentile
						console.log(groupbyLabel);

						var margin = {top: 20, right: 20, bottom: 400, left: 100},
							width = 1000 - margin.left - margin.right,
							height = 800 - margin.top - margin.bottom;
						var x = d3.scale.ordinal()
									.rangeRoundBands([0, width], 0.1);

						var y = d3.scale.linear()
									.range([height, 0]);

						var xAxis = d3.svg.axis()
							.scale(x)
							.orient("bottom");

						var yAxis = d3.svg.axis()
							.scale(y)
							.orient("left");

						function make_x_axis() { return d3.svg.axis()
								.scale(x)
								.orient("bottom")
								.ticks(5);
						}

						function make_y_axis() { return d3.svg.axis()
								.scale(y)
								.orient("left")
								.ticks(5);
						}

						var svg = d3.select('#'.concat(attrs.id)).append("svg")
							.attr("width", width + margin.left + margin.right)
							.attr("height", height + margin.top + margin.bottom)
						.append("g")
							.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

						x.domain(groupbyLabel.map(function(d) { return d.key; })); // label for x axis
						y.domain([0, d3.max(groupbyLabel, function(d) { return +d.values.percentile; })]);

						svg.append("g")
							.attr("class", "x axis")
							.attr("transform", "translate(0," + height + ")")
							.call(xAxis);
						
						// rotate the text 90 degrees
						svg.selectAll(".x.axis text")  // select all the text elements for the xaxis
							.style("text-anchor", "end")
							.attr("transform", function(d) {
									return "translate(" + this.getBBox().height*-1.0 + "," + this.getBBox().height + ")rotate(-90)";
									//console.log(this.getBBox());
									//return "translate(" + this.getBBox().height*-1.0 + "," + this.getBBox().height + ")rotate(0)";
							});

						svg.append("g")
								.attr("class", "y axis")
								.call(yAxis);

						svg.selectAll(".bar")
							.data(groupbyLabel)
							.enter().append("rect")
								.attr("class", "bar")
								.attr("x", function(d) { return x(d.key); })
								.attr("width", x.rangeBand())
								.attr("y", function(d) { return y(d.values.percentile); })
								.attr("height", function(d) { return height - y(d.values.percentile); })
								.append("title")
								.text(function(d) {return [ ''.concat(Math.round(d.values.percentile), ' msec | Error Count = ', d.values.error_count,
															' | Sample Count = ', d.values.sample_count)]; });
			});
		}
	};

	return directiveDefinitionObject;

}])
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
}])
.directive('jmTableRaw', ['metriclist', 'Data', '$compile', function(metriclist, Data, $compile) {
	var directiveDefinitionObject = {
		restrict: 'A',
		scope: {
			fileName: '@',
			folderName: '@',
			data: '=tableData'
		},
		transclude: true,
		controller: 'MyController',
		link: function (scope, elem, attrs) {

			d3.csv("./data/".concat(scope.folderName, "/", scope.fileName), function(d) {
				
						window.mydirscope = scope;
						scope.filter_input = Data;

						// data will be available in controller
						// two way binding?
						scope.data = d;
						var filter_input;
						console.log('data read by jmTableAggregate');
						console.log(d);
												
						console.log(filter_input);

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

						scope.$watch('filter_input.label', function() {
							// console.log('resp time value changing...');
							redraw(scope.filter_input, scope.data, table_row, raw_table, attrs.id);
						});

						scope.$watch('filter_input.elapsedTime', function() {
							// console.log('elapsed time changing...');
							// console.log(scope.filter_input.elapsedTime);
							redraw(scope.filter_input, scope.data, table_row, raw_table, attrs.id);
						});

						var raw_table = d3.select('#'.concat(attrs.id)).append("table");

						scope.$apply(raw_table);
						
						// raw_table.append('th').text('Label');
						// raw_table.append('th').text('elapsed');
						
						var table_row = raw_table.selectAll('tbody')
											.data(d)
											.enter().append('tbody')
											.append('tr');

						table_row.append('td').text(function(d) { return d.label; });
						table_row.append('td').text(function(d) { return d.elapsed; });
			});

			function redraw(filter_val, d, table_row, raw_table, attr_id) {

				// console.log('redraw table.....' + new Date());
				// console.log(d);
				// console.log(filter_val.label);
				// console.log(filter_val.elapsedTime);
				// console.log(table_row);

				var filt_data = d;
				
				var rexLabel = new RegExp('.*'.concat(filter_val.label, '.*'));
				var rexElapsed = new RegExp('.*'.concat(filter_val.elapsedTime, '.*'));

				// console.log(rexElapsed);
				filt_data = _.filter(d, function(d) {  return rexLabel.test(d.label) && rexElapsed.test(d.elapsed); });

				// console.log(filt_data);

				raw_table.selectAll('*').remove();

				raw_table.append('th').text('Label');
				raw_table.append('th').text('elapsed');

				table_row = raw_table.selectAll('tbody')
									.data(filt_data)
									.enter().append('tbody')
									.append('tr');

				table_row.append('td').text(function(d) { return d.label; });
				table_row.append('td').text(function(d) { return d.elapsed; });

			}
		}
	};
	return directiveDefinitionObject;
}]);

