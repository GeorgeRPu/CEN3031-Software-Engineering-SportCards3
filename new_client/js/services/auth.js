// interface UserDetails {
//   _id: string;
//   email: string;
//   name: string;
//   exp: number;
//   iat: number;
// }
//
// interface TokenResponse {
//   token: string;
// }
//
// interface TokenPayload {
//   email: string;
//   password: string;
//   name?: string;
// }

angular.module("sportsCardApp").factory("AuthService",
  ["$timeout", "$http", "$location", "$route",
    function($timeout, $http, $location, $route) {

      var token = null;

      // return available functions for use in the controllers
      return ({
        isLoggedIn: isLoggedIn,
        login: login,
        logout: logout,
        register: register
      });

      function saveToken(token_arg) {
        localStorage.setItem("json-token", token_arg);
        token = token_arg;
      }

      function getToken() {
        if (token) {
          token = localStorage.getItem("json-token");
        }
        return token;
      }

      function getUserDetails() {
        var token = getToken();
        var payload;
        if (token) {
          payload = token.split(".")[1];
          payload = window.atob(payload);
          return JSON.parse(payload);
        } else {
          return null;
        }
      }

      function isLoggedIn() {
        var user = getUserDetails();
        if (user) {
          // login expires after a certain amount of time
          return user.exp > Date.now() / 1000;
        } else {
          return false;
        }
      }

      function logout() {
        token = "";
        window.localStorage.removeItem("json-token");
        $location.path("/");
        $route.reload();
      }

      function register(email, name, password) {
        $http.post(window.location.origin + '/api/auth/register', {
            email: email,
            name: name,
            password: password
          })
          .then(function(res) {
            if (res.status === 200) {
              $location.path("/admin/login");
              $route.reload();
            }
          });
      }

      function login(email, password) {
        $http.post(window.location.origin + '/api/auth/login', {
            email: email,
            password: password
          })
          .then(function(res) {
            if (res.status === 200 && res.token) {
              saveToken(res.token);
            } else {
              token = null;
            }
          });
      }

    }
  ]);
