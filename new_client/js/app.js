var app = angular.module("sportsCardApp", ["ngRoute", "infinite-scroll"]);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "about.html",
      access: {
        restricted: false
      }
    })
    .when("/catalog", {
      templateUrl: "catalog.html",
      controller: "catalogController",
      access: {
        restricted: false
      }
    })
    .when("/admin/welcome", {
      templateUrl: "admin-welcome.html",
      access: {
        restricted: true
      }
    })
    .when("/admin/register", {
      templateUrl: "admin-register.html",
      controller: "registerController",
      access: {
        restricted: false
      }
    })
    .when("/admin/login", {
      templateUrl: "admin-login.html",
      controller: "loginController",
      access: {
        restricted: false
      }
    })
    .when("/admin/catalog", {
      templateUrl: "admin-catalog.html",
      access: {
        restricted: true
      }
    })
    .when("/admin/upload", {
      template: "admin-upload.html",
      access: {
        restricted: true
      }
    })
    .otherwise({
      redirectTo: "/"
    });
  $locationProvider.html5Mode({enabled: true, requireBase: false});
});

app.run(["$rootScope", "$location", "$route", "AuthService",
  function($rootScope, $location, $route, AuthService) {
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
      if (next.access.restricted && !AuthService.isLoggedIn()) {
        $location.path("/admin/login");
        $route.reload();
      }
    });
  }
]);
