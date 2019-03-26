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
            .when("/admin", {
                templateUrl: "admin.html"
            })
            .when("/contact", {
                templateUrl: "contact.html"
            })
            .otherwise({
                templateUrl: "about.html"
            });
    });