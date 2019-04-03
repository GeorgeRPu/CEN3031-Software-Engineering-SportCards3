angular.module('sportsCardApp', ["ngRoute", 'infinite-scroll'])



    .config(function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "login.html",

            })
            .when("/catalog", {
                templateUrl: "admincatalog.html",
                controller: 'cardController'

            })
            .when("/upload", {
                templateUrl: "adminupload.html",
                

            })
            .otherwise({
                templateUrl: "about.html"
            });
    });


