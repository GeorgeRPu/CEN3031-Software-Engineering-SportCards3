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
            .when("/admin/login", {
                templateUrl: "admin-login.html",
                
            })
            .when("/admin/register", {
                templateUrl: "admin-register.html",
            })
            .otherwise({
                templateUrl: "about.html"
            })
        $locationProvider.html5Mode({enabled: true, requireBase: false});
    });
