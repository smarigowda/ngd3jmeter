myApp
.directive('jmThroughputPlot', ['metriclist', '$window', function(metriclist, window) {
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

					window.rawdata = data;
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
							.key(function(d) { return d.timeStamp2; })
							.sortKeys(d3.ascending)
							// for each group of label perform the below group wise computation
							.rollup(function(d) {
								return { throughput: d.length };
							})
							.entries(data);

					console.log(window);
					window.groupbyTimeStamp = groupbyTimeStamp;
					scope.drawPlot(groupbyTimeStamp);

			});

			scope.drawPlot = function(data) {

					var div = d3.select('#'.concat(attrs.id)).append("div")
									.attr("class", "tooltip")
									.style("opacity", 0);

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
					data.map(function(d) { d.key = +d.key; });

					// console.log(data);
					// x.domain(d3.extent(data.map(function(d) { return d.key; })));
					x.domain([d3.min(data.map(function(d) { return d.key; })),
						d3.max(data.map(function(d) { return d.key; }))]);

					// set y domain
					// y.domain(d3.extent(data.map(function(d){ return d.values.throughput; })));
					y.domain([d3.min(data.map(function(d){ return d.values.throughput; })),
						d3.max(data.map(function(d){ return d.values.throughput; }))]);
					
					// debugger;

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
						.attr("cy", function (d) { return y(d.values.throughput); } )
						.attr("cx", function (d) { return x(d.key); } )
						.attr("r", 4)
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

							div.html(d.values.throughput)
								.style("left", (d3.event.pageX) + "px")
								.style("top", (d3.event.pageY - 30) + "px");
						})
						.on("mouseout", function(d) {
							div.transition()
								.duration(2000)
								.style("opacity", 0);
						});
			};

		}
	};
	// when chrome console is open, it stops at this point
	// so that we can see all the variables at this point
	// debugger; 
	return directiveDefinitionObject;
}]);
