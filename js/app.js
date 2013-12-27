angular.module('myApp', [])
    .controller('MyController',
        ['$scope', '$parse', function($scope, $parse) {
            $scope.person = {
                name: "Ari Lerner"
            };
            $scope.$watch('expr', function(newVal, oldVal, scope) {
                if (newVal !== oldVal) {
                    // Let's set up our parseFun with the expression
                    // console.log(newVal);
                    var parseFun = $parse(newVal);
                    // Get the value of the parsed expression, set it on the scope for output
                    scope.parsedExpr = parseFun(scope);
                }
            });
    }]);
