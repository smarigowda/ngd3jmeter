myApp
.directive('jmBarplot', ['metriclist', '$compile', function(metriclist, $compile) {
	var directiveDefinitionObject = {
		restrict: 'A',
		scope: {
			fileName: '@',
			folderName: '@',
			tableData: '@',
			title: '@'
		},
		transclude: true,
		controller: 'myd3Controller',
		link: function (scope, elem, attrs) {

			scope.getData(scope.fileName, scope.folderName).then(function(d) {

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

						if (scope.title !== undefined) { d3.select('#'.concat(attrs.id)).append("h1").text("Test: " + scope.title) ; }

						// data binding of elements created by d3.
						// binding happens only when the input element is used (first attempt)
						// each bar plot will get its own binding object
						var htmlinput = d3.select('#'.concat(attrs.id))
											.append("input")
												.attr("type", "text")
												.attr("ng-model", "ctrl_filter_input.elapsedTime");
												// .attr("ng-controller", "MyController3"); // this will create a new scope (hence new object which can not be watched)

						console.log('htmlinput');
						console.log(htmlinput[0][0]); // the HTML text
						scope.$watch('ctrl_filter_input.elapsedTime', function() {
								console.log('scope.ctrl_filter_input.elapsedTime = ' + scope.ctrl_filter_input.elapsedTime);
						});


						// compile the template
						var linkFn = $compile(htmlinput[0][0]);

						// link the template with scope
						var element = linkFn(scope);

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
}]);
