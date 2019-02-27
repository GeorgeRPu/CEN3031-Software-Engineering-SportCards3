angular.module('sportsCardApp',["ngRoute"])

.config(function($routeProvider){
  $routeProvider
  .when("/",{
      templateUrl: "about.html",
      
  })
  .when("/catalog",{
      templateUrl: "catalog.html",
     
  })
  .when("/contact",{
      templateUrl: "contact.html",
      
  })
  .otherwise({
      templateUrl: "index.html"
  });
});






