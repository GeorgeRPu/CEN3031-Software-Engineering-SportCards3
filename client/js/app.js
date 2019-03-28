angular.module('sportsCardApp', ["ngRoute", 'infinite-scroll'])



    .config(function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "about.html",

            })
            .when("/catalog", {
                templateUrl: "catalog.html",
                controller: 'cardController'

            })
            .when("/adminupload", {
                templateUrl: "adminupload.html",
                

            })
            .when("/admincatalog", {
                templateUrl: "admincatalog.html",
                controller: 'cardController'

            })
            .otherwise({
                templateUrl: "about.html"
            });
    });


