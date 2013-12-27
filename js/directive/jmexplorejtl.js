// var myApp = angular.module('myApp', ['uiJMRouter'])
myApp
.directive('jmExploreJtl', ['metriclist', function(metriclist) {
	var directiveDefinitionObject = {
		restrict: 'A',
		scope: {
			fileName: '@',
			folderName: '@',
			id: '@'
		},
		transclude: true,
		controller: 'myd3Controller',
		compile: function (element, attrs, transcludeFn) {
			return function postLink(scope, element, attrs, controller) {
				// console.log(element);
				// console.log(transcludeFn(scope));
				var tElement = transcludeFn(scope);
				var httpsample;
				
				// tElement.map(function(ele) { console.log(ele); });

				// _.map(tElement, function(ele) { console.log(ele); });

				// console.log('find element');
				// console.log(tElement);
				// console.log(tElement[0]);
				// console.log(tElement[1]);
				// console.log(tElement.find('input'));
				element.append(tElement);
				// element.append(tElement[1]);
				// element.append(tElement[3]);
				// element.append(tElement.find('input'));
				// console.log(angular.element(tElement));
				scope.getXMLData(scope.fileName, 'jtl')
					.then(function(data) {
						// console.log('xml data...');
						// console.log(data);
						var sample = d3.select(data).selectAll("sample");
						// console.log(sample[0]);

						httpsample = d3.select(data).selectAll("httpSample")[0];
						console.log(httpsample);

						// httpsample2 = _.filter(httpsample, function(d) { return d.attributes.t.value > 25000; });
						// httpsample2 = _.filter(httpsample, function(d) { return (d.attributes.t.value !== d.attributes.lt.value) && d.attributes.t.value > 25000; });


						var labels = _.map(httpsample, function(d) { return d.attributes.lb.nodeValue; } );
						console.log(_.uniq(_.map(httpsample, function(d) { return d.attributes.hn.nodeValue; })));
						// console.log(attrarray);

						// var transactions = attrarray.filter(function(d) { return d.lb.nodeValue.match(/^S0.*/); });
						// var transactions = attrarray.filter(function(d) { return d.lb.nodeValue; });
						// console.log(transactions);
						display_data(httpsample, scope.id);
					});

				scope.$watch('input.label', function(oldVal, newVal) {
					if (oldVal !== newVal) {
						console.log(scope.input.label);
						filter_data(scope.input.label, scope.input.elapsed);
					}
				});

				scope.$watch('input.elapsed', function(oldVal, newVal) {
					if (oldVal !== newVal) {
						console.log(scope.input.elapsed);
						filter_data(scope.input.label, scope.input.elapsed);
					}
				});

				var filter_data = function(label, elapsed) {
						var rexElapsed = new RegExp('.*'.concat(elapsed, '.*'));
						var rexLabel = new RegExp('.*'.concat(label, '.*'));
						var filt_httpsample = _.filter(httpsample, function(d) {
								return rexElapsed.test(d.attributes.t.value) && rexLabel.test(d.attributes.lb.nodeValue);
						});
						display_data(filt_httpsample);
				};

				var display_data = function(httpsample, id) {
						d3.select('div'.concat('#', id)).selectAll("p").remove();
						d3.select('div'.concat('#', id)).selectAll("p")
								.data(httpsample).enter()
								.append("p")
								.text(function(d,i) {
									return new Date(+d.attributes.ts.nodeValue) + '....' + d.attributes.lb.nodeValue + '...LOAD TIME...' + d.attributes.t.value + ' msec' + '...LATENCY...' + d.attributes.lt.value + ' msec';
								});
				};
			};
		}
	};
	return directiveDefinitionObject;
}]);
