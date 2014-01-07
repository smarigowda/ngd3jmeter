// var myApp = angular.module('myApp', ['uiJMRouter'])
myApp
.directive('jmTsplot', ['metriclist', '$window', function(metriclist, window) {
	var directiveDefinitionObject = {
		restrict: 'A',
		scope: {
			fileName: '@',
			folderName: '@'
		},
		transclude: true,
		controller: 'myd3Controller',
		link: function (scope, elem, attrs) {

				scope.getData(scope.fileName, scope.folderName).then(function(data) {

					window.csvdata = data;

					// console.log('zipppp');
					// console.log(_.zip.apply(_, data));

					var data3 = {
							timeStamp: _.map(data, function(d) {
											return +d.timeStamp;
										}),
							elapsed:  _.map(data, function(d) {
											return +d.elapsed;
										}),
							Latency:  _.map(data, function(d) {
											return +d.Latency;
										})
					};

					// select only the required group of data
					var data2 = _.map(data, function(d) {
						return {
							values: {
								timeStamp: d.timeStamp,
								label: d.label,
								elapsed: d.elapsed,
								Latency: d.Latency
							}
						};
					});

					// unique labels
					var labels = _.uniq(data.map(function(d) { return d.label; } ));

					var data_multiline = _.map(labels, function(d2) {
									return {
										label: d2,
										values : _.chain(data2)
													.map(function(d) {
														// map only the rows matching label
														if (d2 === d.values.label) {
															return {
																elapsed: +d.values.elapsed,
																timeStamp: +d.values.timeStamp
															};
														}
													})
													.compact()
													// .tap(function(d) { alert(d); })
													.value()
									};
					});

					console.log(data_multiline);

					// console.log(result);
					scope.drawPlotMultiLine(data_multiline, data3);

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
						// console.log('in d3js, metric selected = '.concat(metric_selected));

						if (selected_label !== 'ALL') {
							filt_data = _.filter(data, function(d) { return d.label === selected_label; });
						}

						// console.log('Filtered data...');
						// console.log(filt_data);
						// remove the plot
						// d3.selectAll('svg').remove();
						d3.select('#'.concat([attrs.id])).selectAll('svg.'.concat(attrs.id)).remove();
						// console.log('data bkp......');
						// console.log(data_bkp);
						// re-draw the plot
						if ( selected_label === 'ALL' ) {
							scope.drawPlot(data_bkp, metric_selected);
						} else {
							scope.drawPlot(filt_data, metric_selected);
						}

					});

					// filter the data and redraw the plot
					select.on('change', function() {
						// console.log('in label select, metric selected = '.concat(metric_selected));
						selected_label = this.value;
						// console.log('selected value:'.concat(this.value));
						if (selected_label !== 'ALL') {
							filt_data = _.filter(data, function(d) { return d.label === selected_label; });
						}
						// console.log('Filtered data...');
						// console.log(filt_data);
						// remove the plot
						// d3.selectAll('svg').remove();
						d3.select('#'.concat([attrs.id])).selectAll('svg.'.concat(attrs.id)).remove();
						// console.log('data bkp......');
						// console.log(data_bkp);
						// re-draw the plot
						if ( selected_label === 'ALL' ) {
							scope.drawPlot(data_bkp, metric_selected);
						} else {
							scope.drawPlot(filt_data, metric_selected);
						}
					});

					// draw first time.
					scope.drawPlot(data_bkp, metric_selected);

			});

			scope.drawPlot = function(data, ydataLabel) {

					// console.log('ydataLabel = '.concat(ydataLabel));

					var margin = {top: 30, right: 100, bottom: 80, left: 100},
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
									.attr("class", attrs.id)
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


			scope.drawPlotMultiLine = function(data, orig_data) {

				d3.select('#'.concat(attrs.id)).append("p").append("h1").text(attrs.title);

				var div = d3.select('#'.concat(attrs.id)).append("div")
								.attr("class", "tooltip")
								.style("opacity", 0);

				var margin = { top: 20, right: 100, bottom: 100, left: 100 },
					width = 1500 - margin.left - margin.right,
					height = 500 - margin.top - margin.bottom;
				
				// var parseDate = d3.time.format("%Y%m%d").parse;

				var x = d3.time.scale()
					.range([0, width]);

				var y = d3.scale.linear()
					.range([height, 0]);

				var color = d3.scale.category10();

				var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom")
					.ticks(40)
					.tickFormat(d3.time.format("%H-%M-%S"));

				var yAxis = d3.svg.axis()
					.scale(y)
					.orient("left");

				var svg = d3.select('#'.concat(attrs.id)).append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				var line = d3.svg.line()
					// .interpolate("basis")
					.interpolate("linear")
					.x(function(d) { return x(d.timeStamp); })
					.y(function(d) { return y(d.elapsed); });

				// _.each(orig_data, function(d) { d.timeStamp = +d.timeStamp; });
				// _.each(orig_data, function(d) { d.elapsed = +d.elapsed; });
				x.domain(d3.extent(orig_data.timeStamp));

				y.domain([
					d3.min(orig_data.elapsed),
					d3.max(orig_data.elapsed)
				]);

				svg.append("g")
						.attr("class", "x axis")
						.attr("transform", "translate(0," + height + ")")
						.call(xAxis);

				svg.append("g")
						.attr("class", "y axis")
						.call(yAxis)
					.append("text")
						.attr("transform", "rotate(-90)")
						.attr("y", 6)
						.attr("dy", ".71em")
						.style("text-anchor", "end")
						.text("elapsed");

				svg.selectAll(".x.axis text")  // select all the text elements for the xaxis
					.style("text-anchor", "end")
					.attr("transform", function(d) {
						// console.log("getBBox");
						// console.log(this.getBBox());
						return "translate(" + this.getBBox().height*-1.0 + "," + this.getBBox().height + ")rotate(-90)"; });
						// console.log(this.getBBox());

				var labels = svg.selectAll(".labels")
						.data(data)
						// data is an array. Each array element has 'label' and 'values'
						// values object has timeStamp, elapsed and Latency
						.enter().append("g")
						.attr("class", "labels");

				labels.append("path")
						.attr("class", "line")
						.attr("d", function(d) {
							return line(d.values);
							// d.values is an array
							// each element is an object 
							// having 'timeStamp', 'elapsed' and 'Latency'
						})
						.style("stroke", function(d) {
							// console.log(color(d.label));
							return color(d.label);
						})
						.on("mouseover", function(d, i) {
							// console.log(d3.mouse(this));
							// console.log(d3.event);
							// console.log(d3.event.timeStamp);
							// console.log(d);
							// console.log(i);
							// console.log({"x": d3.event.x, "y": d3.event.y});
							div.transition()
								.duration(0)
								.style("opacity", 1.0);

							div.html(d.label)
								.style("left", (d3.event.pageX) + "px")
								.style("top", (d3.event.pageY - 28) + "px");
						})
						.on("mouseout", function(d) {
							div.transition()
								.duration(2000)
								.style("opacity", 0);
						});
			}

		}
		// templateUrl: '/template/jmtsplot_template.html'
	};
	// when chrome console is open, it stops at this point
	// so that we can see all the variables at this point
	// debugger; 
	return directiveDefinitionObject;
}]);
