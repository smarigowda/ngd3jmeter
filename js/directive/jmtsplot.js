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

				console.log(window);

				scope.getData(scope.fileName, scope.folderName).then(function(data) {

					// console.log(data);

					// var groupbyLabel2 = d3.nest()
					// 						.key(function(d) { return d.label; })
					// 						.sortKeys(d3.ascending)
					// 						.rollup(function(d) {
					// 							return {
					// 								label: d.label,
					// 								timestamp: d.timeStamp,
					// 								elapsed: d.elapsed
					// 							};
					// 						})
					// 						.entries(data);
					// console.log(groupbyLabel2);

					// mapping

					var data2 = _.map(data, function(d) {
						return {
							values: {
								timeStamp: d.timeStamp,
								label: d.label,
								elapsed: d.elapsed
							}
						};
					});
					// console.log(data2);

					var mapdata = _.map(data[0], function(d) { return d; } );
					// console.log(mapdata);

					// use unique data labels
					var labels = _.uniq(data.map(function(d) { return d.label; } ));

					console.log(labels);
					var result = {};
					var x = _.map(labels, function(d) {
							// return d;
						// result[d] = _.filter(data2, function(d2) {
							// console.log(d2.label);
							// return d2.values.label === d;
						// });
							return _.map(data2, function(d2) {
								if (d === d2.values.label ) {
									return {
										label: d2.values.label,
										values: {
											timestamp: d2.values.timestamp,
											label: d2.values.label,
											elapsed: d2.values.elapsed
										}
									};
								}
							});
							// label: d
						// return d;
					});

					console.log(x);

					var xfilt = _.map(x, function(d) {
						return _.filter(d, function(d2) {
								return d2 !== undefined;
						});
					});

					// var xfilt = 
					console.log(xfilt);

					var x2 = _.map(labels, function(d2) {
									return {
										label: d2,
										// values: {

										values : _.filter(_.map(data2, function(d) {
												if (d2 === d.values.label) {
													return {
														elapsed: +d.values.elapsed,
														timeStamp: +d.values.timeStamp
													}
												}
										}), function(d) { return d !== undefined })
										// values: _.map(data2, function(d3) {
											// return {
											// 	timestamp: d3.values.timestamp,
											// 	label: d3.values.label,
											// 	elapsed: d3.values.elapsed
											// };
										// });
										// }
									}
					});

					console.log(x2);

					// console.log(result);
					scope.drawPlotMultiLine(x2, labels, data);

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


			scope.drawPlotMultiLine = function(data, labels, orig_data) {

				d3.select('#'.concat(attrs.id)).append("p").append("h1").text(attrs.title);

				var div = d3.select('#'.concat(attrs.id)).append("div")   
					.attr("class", "tooltip")               
					.style("opacity", 0);

				// console.log(data);

				var margin = {top: 20, right: 100, bottom: 100, left: 100},
					width = 1500 - margin.left - margin.right,
					height = 500 - margin.top - margin.bottom;
				
				var parseDate = d3.time.format("%Y%m%d").parse;

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

				// _.each(data, function(d) { console.log(parseDate(d[0].timestamp)); });

				var line = d3.svg.line()
					// .interpolate("basis")
					.interpolate("linear")
					.x(function(d) { return x(d.timeStamp); })
					.y(function(d) { return y(d.elapsed); });

				// console.log(labels);

				// console.log(orig_data);

				_.each(orig_data, function(d) { d.timeStamp = +d.timeStamp; });
				_.each(orig_data, function(d) { d.elapsed = +d.elapsed; });
				x.domain(d3.extent(_.pluck(orig_data, 'timeStamp')));

				// console.log(x.domain());

				y.domain([
					d3.min(orig_data, function(c) { return c.elapsed; }),
					d3.max(orig_data, function(c) { return c.elapsed; })
				]);

				// console.log(y.domain());

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
						//return "translate(" + this.getBBox().height*-1.0 + "," + this.getBBox().height + ")rotate(0)"; */


				console.log(svg);



				console.log(data);

				window.svg = svg;
				window.data = data;

				var labels = svg.selectAll(".city")
						.data(data)
						.enter().append("g")
						.attr("class", "city");

				// console.log(svg);


				// console.log(labels);

				labels.append("path")
						.attr("class", "line")
						.attr("d", function(d) {
							// console.log(line(d.values));
							return line(d.values);
						})
						.style("stroke", function(d) {
							return color(d.label);
						})
						.on("mouseover", function(d, i) {
							console.log(d3.mouse(this));
							console.log(d3.event);
							console.log(d3.event.timeStamp);
							console.log(d);
							console.log(i);
							// console.log({"x": d3.event.x, "y": d3.event.y});
							div.transition()
								.duration(0)
								.style("opacity", .9);

							div.html(d.label)
								.style("left", (d3.event.pageX) + "px")
								.style("top", (d3.event.pageY - 28) + "px");
						})
						.on("mouseout", function(d) {
							div.transition()      
								.duration(2000)
								.style("opacity", 0);
						});

				labels.append("text")
						.datum(function(d) {
							return {
								label: d.label, 
								value: d.values[d.values.length - 1]
							};
						})
						// .datum(function(d) { return {label: d.label, value: d.values[0]}; })
						.attr("transform", function(d) {
							return "translate(" + x(d.value.timeStamp) + "," + y(d.value.elapsed) + ")";
						})
						.attr("x", 3)
						.attr("dy", ".35em")
						// .text(function(d) { return d.label; })
						.on('mouseover', function(d) {
							console.log('mouseover event fired...');
						});

				// console.log(data['S01_IR_T01_HOME']);
				// var line1 = line(data['S01_IR_T01_HOME']);
				// console.log(line1);
			}

		}
		// templateUrl: '/template/jmtsplot_template.html'
	};
	// when chrome console is open, it stops at this point
	// so that we can see all the variables at this point
	// debugger; 
	return directiveDefinitionObject;
}]);
