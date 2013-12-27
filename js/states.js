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
			})
			.state("tables", {
				url: "/tables",
				templateUrl: '/template/jmtable_template.html'
			})
			.state("tableraw", {
				url: "/tableraw",
				templateUrl: '/template/jmtableraw_template.html'
			})			
			.state("explorejtl", {
				url: "/explorejtl",
				templateUrl: '/template/jmexplorejtl_template.html'
			});
    }]);