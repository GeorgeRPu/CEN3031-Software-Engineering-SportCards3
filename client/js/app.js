angular.module('sportsCardApp', ["ngRoute"])

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
                //                controller: ;

            })
            .when("/admincatalog", {
                templateUrl: "admincatalog.html",
                //                controller: ;

            })

            .otherwise({
                templateUrl: "about.html"
            });
    });
