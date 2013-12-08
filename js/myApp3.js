var myApp3 = angular.module('myApp3', [])
.directive('jmThroughputPlot', function() {
	var directiveDefinitionObject = {
		restrict: 'A',
		scope: {
			fileName: '@',
			folderName: '@',
			id: '@'
		},
		transclude: true,
		// controller: 'MyMetricController',
		link: function (scope, elem, attrs) {

			d3.csv("./data/".concat(scope.folderName, "/", scope.fileName), function(data) {
				console.log(data);
				//convert to numeric
				data.map(function(d) { d.timeStamp = +d.timeStamp; });

				// to roundup time to its nearest x sec
				var coeff = 1000 * 5;

				data.map(function(d) { d.timeStamp2 = Math.round(+d.timeStamp/coeff) * coeff; });

				// for each unique timeStamp2, count samples
				groupbyTimeStamp = d3.nest()
									.key(function(d) { return d.timeStamp2; })
									.sortKeys(d3.ascending)
									// for each group of label perform the below group wise computation
									.rollup(function(d) {

									// d is an array of objects (for each label)
									// console.log("d inside nest");
									// console.log(d);
									// label is same for each of the objects inside the array
									// because its grouped by label
									// console.log(d[0].label);
									// console.log(d.length);
									// pluck works on each element of data d
									// console.log(_.pluck(d, 'elapsed').map(function(d2) {return +d2}).sort(d3.ascending));
									// count of samples for each uniq time stamp
										return { throughput: d.length };
									})
									.entries(data);

					console.log(groupbyTimeStamp);

				var margin = {top: 20, right: 20, bottom: 400, left: 100},
					width = 2000 - margin.left - margin.right,
					height = 800 - margin.top - margin.bottom;

				// ranges for x and y axis
				var x = d3.time.scale().range([0, width]);
				var y = d3.scale.linear().range([height, 0]);

				// set x domain
				x.domain(d3.extent(groupbyTimeStamp.map(function(d) { return +d.key; })));

				// set y domain
				y.domain(d3.extent(groupbyTimeStamp.map(function(d){return d.values.throughput;})));


				var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom")
					.ticks(20)
					.tickFormat(d3.time.format("%H:%M:%S"));
					//.tickFormat(d3.time.format("%Y-%m-%d %H:%M:%S"));
					//.tickFormat(function(d) { return "Test Time: " + format(d); } );

				var yAxis = d3.svg.axis()
								.scale(y)
								.orient("left");

				var svg = d3.select('#'.concat(scope.id)).append("svg")
									.attr("width", width + margin.left + margin.right)
									.attr("height", height + margin.top + margin.bottom)
									.append("g")
									.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				// draw x axis          
				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);

				// rotate the text 90 degrees
				// console.log(svg.selectAll(".x.axis text"));
				svg.selectAll(".x.axis text")  // select all the text elements for the xaxis
						.style("text-anchor", "end")
						.attr("transform", function(d) {
						// console.log("getBBox");
						// console.log(this.getBBox());
							return "translate(" + this.getBBox().height*-1.0 + "," + this.getBBox().height + ")rotate(-90)";
						});
				// draw y axis
				svg.append("g")
					.attr("class", "y axis")
					.call(yAxis);
				
				// scatter plot
				svg.selectAll("scatter-dots")
					//.data(groupbyTimeStamp) // join by index
					.data(groupbyTimeStamp, function(d) { return d.key; }) // join by key, uniq timestamp
					.enter().append("svg:circle")
					.attr("cy", function (d) { return y(d.values.throughput); } )
					.attr("cx", function (d) { return x(+d.key); } )
					.attr("r", 4)
					.style("opacity", 0.3)
					.append("title").text(function(d){ return d.values.throughput; });
				
					console.log(x.domain());
					console.log('Start Time in Epoch Sec = ' + x.domain()[0]/1000);
					console.log('End Time in Epoch Sec = ' + x.domain()[1]/1000);

			});
		}

	};
	// when chrome console is open, it stops at this point
	// so that we can see all the variables at this point
	// debugger; 
	return directiveDefinitionObject;
});