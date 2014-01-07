myApp
.directive('jmThroughputPlot', ['metriclist', function(metriclist) {
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
					// use unique data labels
					var labels = _.uniq(data.map(function(d) { return d.label; } ));

					//convert to numeric
					// data.map(function(d) { d.timeStamp = +d.timeStamp; });

					// to roundup time to its nearest x sec
					// ex: roundup time to its nearest 5 sec
					var coeff = 1000 * 5;
					data.map(function(d) { d.timeStamp2 = Math.round(+d.timeStamp/coeff) * coeff; });

					// for each unique timeStamp2, count samples
					var groupbyTimeStamp = d3.nest()
							.key(function(d) { return d.timeStamp; })
							.sortKeys(d3.ascending)
							// for each group of label perform the below group wise computation
							.rollup(function(d) {
								return { throughput: d.length };
							})
							.entries(data);

					// defaults
					var metric_selected = 'elapsed';
					var selected_label = 'ALL';
				
					var data_bkp = data;
					var filt_data;

					// construct an option to select 'Transaction'
					var select = d3.select('#'.concat(attrs.id)).append('select');
					select.append('option').attr('value', 'ALL').text('ALL');
					select.selectAll('option')
							.data(labels).enter().append('option')
							.attr('value', function(d) { return d; })
							.text(function(d) { return d; });

					// construct an option to select a metric 
					// (elapsed or Latency)
					var select2 = d3.select('#'.concat(attrs.id)).append('select');
					select2.selectAll('option')
							.data(metriclist.names).enter().append('option')
							.attr('value', function(d) { return d; })
							.text(function(d) { return d; });

					select2.on('change', function() {
						metric_selected = this.value;

						d3.select('#'.concat([attrs.id])).selectAll('svg').remove();

						if ( selected_label === 'ALL' ) {
							scope.drawPlot(data_bkp, metric_selected);
						} else {
							filt_data = _.filter(data, function(d) { return d.label === selected_label; });
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
						d3.select('#'.concat([attrs.id])).selectAll('svg').remove();
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
					// convert the value of elapsed or Latency to number
					data.map(function(d) { d[ydataLabel] = +d[ydataLabel]; });

					// console.log(data);
					x.domain(d3.extent(data.map(function(d) {return d.timeStamp;})));

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
						.attr('fill', function(d) { if (d[ydataLabel] > 1000) { return 'red'; } else { return 'green'; } })
						.style("opacity", 0.3)
						.append("title").text(function(d){ return ''.concat(ydataLabel, " : ", d[ydataLabel], ' : ' , d.label); });
			};

		}
	};
	// when chrome console is open, it stops at this point
	// so that we can see all the variables at this point
	// debugger; 
	return directiveDefinitionObject;
}]);
