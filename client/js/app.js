angular.module('sportsCardApp', ["ngRoute", 'infinite-scroll'])



    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "about.html",

            })
            .when("/catalog", {
                templateUrl: "catalog.html",
                controller: 'cardController'

            })
            .otherwise({
                templateUrl: "about.html"
            })
        $locationProvider.html5Mode({enabled: true, requireBase: false});
    });
