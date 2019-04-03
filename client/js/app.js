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
            .when("/admin", {
                templateUrl: "login.html",
            })
            .when("/admin/catalog", {
                templateUrl: "admincatalog.html",
                controller: 'cardController',
            })
            .when("/admin/upload", {
                templateUrl: "adminupload.html",
            })
            .otherwise({
                templateUrl: "about.html"
            });
    });
