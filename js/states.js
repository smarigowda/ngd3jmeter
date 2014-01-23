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
			})
			.state("thrplots", {
				url: "/thrplots",
				templateUrl: '/template/jmthrplot_template.html'
			})
			.state("tsplot_bcsep2013", {
				url: "/tsplot_bcsep2013",
				templateUrl: '/template/jmtsplot_bcsep2013_template.html'
			})
			.state("tsplot_bcjan2014mergdb", {
				url: "/tsplot_bcjan2014mergdb",
				templateUrl: '/template/jmtsplot_bcjan2014mergdb_template.html'
			})
			.state("tsplot_imljan2014", {
				url: "/tsplot_imljan2014",
				templateUrl: '/template/jmtsplot_imljan2014_template.html'
			});

    }]);