var myApp2 = angular.module('myApp2', [])
.controller('MyController', ['$scope', '$injector', function($scope, $injector){
	window.scope = $scope;
}])
.directive('testDir', function() {
	var directiveDefinitionObject = {
		restrict: 'E',
		scope: { },
		transclude: true,
		// transclude: element,
		template: '<h1> Hello Template... </h1><div ng-transclude></div>',
		compile: function(element, attrs, transcludeFn){
			// console.log(transcludeFn);

			// this function gets called after compile
			// trascluded element will always get a new scope irrespective of scope: {}
			// function name postLink is optional
			return function postLink(scope, element, attrs)  {
				// scope passed here is the isolated scope if - scope: {}
				// console.log(scope);
				// console.log(transcludeFn(scope));
				// clone element
				transcludeFn(scope, function(clone) {
					// console.log(clone);
					// console.log(scope);
					// console.log(element);
					// console.log(element.find('div'));
					var newScope = scope.$parent.$new();
					// console.log(newScope);
					element.find('div').append(transcludeFn(newScope));
				});
			};
		},
		controller: function($scope, $transclude) {
			// pre bound to child of parent scope
			// console.log($transclude);
			console.log($transclude()); // not a clone
		},
		link: function (scope, elem, attrs) {
			// console.log(scope);
		}
	};
	return directiveDefinitionObject;
})
.directive('if', function() {
	var directiveDefinitionObject = {
		restrict: 'A',
		// scope: {},
		// replace: true,
		transclude: true,
		require: 'ngModel',
		// transclude: 'element', // attributes are copied into replaced element
		template: '<h1>Hello Template</h1>',
		// use compile or link but not both
		compile: function(element, attr, transcludeFn){
			return function preLink(scope, element, attr)  {
				scope.$watch(attr['if'], function (newValue) {
					// console.log('if watch');
					// console.log(newValue);
				});
			};
		},
		controller: function($scope, $transclude, $element, $attrs) {

			$scope.count = {};
			$scope.count.id  = 'cid';

			// console.log($scope);
			// console.log($element);
			// console.log($attrs);
		},
		// you can either use link or compile but not both.
		// link: function (scope, elem, attrs, ngMCtrl) {
		// 	console.log('Hello...from link.');
		// 	console.log(ngMCtrl);
		// }
	};
	return directiveDefinitionObject;
})
.controller('AccordionController', ['$scope', '$attrs',
		function ($scope, $attrs) {

			this.groups = [];

			this.closeOthers = function(openGroup) {
				angular.forEach(this.groups, function (group) {
					if ( group !== openGroup ) {
						group.isOpen = false;
					}
				});
			};

			this.addGroup = function(groupScope) {
				var that = this;
				this.groups.push(groupScope);
				groupScope.$on('$destroy', function (event) {
					that.removeGroup(groupScope);
				});
			};

			this.removeGroup = function(group) {
				var index = this.groups.indexOf(group);
					if ( index !== -1 ) {
						this.groups.splice(this.groups.indexOf(group), 1);
					}
			};

}])
.directive('accordion', function () {
	return {
		restrict:'E', controller:'AccordionController',
		link: function(scope, element, attrs) {
			element.addClass('accordion');
		}
	};
})
.directive('accordionGroup', function() {
	return {
		require:'^accordion',
		restrict:'E',
		transclude:true,
		replace: true,
		// templateUrl:'template/accordion/accordion-group.html',
		template: 'Hello',
		scope:{ heading:'@' },
		link: function(scope, element, attrs, accordionCtrl) {
					accordionCtrl.addGroup(scope);
					scope.isOpen = false;
					scope.$watch('isOpen', function(value) {
						if ( value ) {
							accordionCtrl.closeOthers(scope);
						}
					});
		}
	};
})
.controller('testcontroller', function($scope) {
	$scope.getName = function() {
		return $scope.name;
	}

	$scope.getNameLog = function() {
		console.log('dirty-checking');
		return $scope.name;
	}
});