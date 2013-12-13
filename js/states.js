angular.module('uiJMRouter')
	.config([ '$stateProvider', '$urlRouterProvider', function ($stateProvider,   $urlRouterProvider) {
      
		$urlRouterProvider
			.otherwise('/');

		$stateProvider
			.state("home", {
				url: "/",
				template: '<h1> Welcome to my JMeter Analysis Tool</h1>'
			})
			.state("barplots", {
				url: "/barplots",
				templateUrl: '/template/jmbar_template.html'
			})
			.state("tsplots", {
				url: "/tsplots",
				templateUrl: '/template/jmtsplot_template.html'
			});

	

    }]);