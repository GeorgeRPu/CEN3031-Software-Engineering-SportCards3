angular.module('sportsCardApp', ["ngRoute", 'infinite-scroll'])



    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when("/admin/", {
                templateUrl: "login.html",

            })
            .when("/admin/catalog", {
                templateUrl: "./admincatalog.html",
                controller: 'cardController'

            })
            .when("/admin/upload", {
                templateUrl: "adminupload.html",


            })
            .otherwise({
                templateUrl: "about.html"
            })
        $locationProvider.html5Mode({enabled: true, requireBase: false});
    });
