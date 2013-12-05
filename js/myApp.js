var myApp = angular.module('myApp', [])
.factory('Data', function() {
	return { elapsedTime: 0 };
})

// note that $injector can be injected!
.controller('MyController', ['$scope', 'Data', '$injector', function($scope, Data, $injector){
  $scope.resp_time = Data;
  window.scope = $scope;
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
		
		},
		templateUrl: 'template.html'
	};
})
.directive('jmTsplot', function() {
	var directiveDefinitionObject = {
		restrict: 'A',
		scope: {},
		transclude: true,
		controller: 'MyMetricController',
		link: function (scope, elem, attrs) {
			window.director_scope = scope;
			console.log(scope);

			// console.log('hello from directive jmTsPlot');
			// console.log('@ directive folder name = '.concat(attrs.folderName));
			// console.log('@ directive file name = '.concat(attrs.fileName));
			
			d3.csv("./data/".concat(attrs.folderName, "/", attrs.fileName), function(data) {
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

				var select2 = d3.select('#'.concat(attrs.id)).append('select');
				select2.append('option').attr('value', 'elapsed').text('elapsed');
				select2.append('option').attr('value', 'Latency').text('Latency');

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

				})

				// console.log('@ directive: select is....');
				// console.log(select);
				// add another selection for metric
				// scope.$apply( d3.select('#'.concat(attrs.id))
				// 						.append('select')
				// 						.attr('id', 'metric')
				// 						.attr('ng-model', 'metric.name'));
				// d3.selectAll('#metric').append('option').attr('value', 'elapsedTime').text('elapsedTime');
				// //selectMetric.append('option').attr('value', 'latency').text('latency');

				// scope.$apply(d3.select('body').append('div').text('hello...div {{ metric.name }}'));

				//scope.$apply(selectMetric);


					// filter the data and redraw the plot
						select.on('change', function() {
							console.log(scope.getMetric());
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

					var margin = {top: 30, right: 20, bottom: 50, left: 50},
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

		},
		templateUrl: '../template/jmtsplot_template.html'
	};
	// when chrome console is open, it stops at this point
	// so that we can see all the variables at this point
	// debugger; 
	return directiveDefinitionObject;
})
.controller('MyMetricController', ['$scope', function($scope){
	// console.log('hello from MyTSPlotController');
	window.MyMetricController_scope = $scope;
	console.log($scope);

	$scope.metric = { name: 'DUMMY'};

	$scope.passMetric = function(metric_name) {
		console.log('metric passed = '.concat(metric_name));
		$scope.metric.name = metric_name;
		console.log($scope.metric.name);
	};

	$scope.getMetric = function() {
		return $scope.metric;
	};

}]);