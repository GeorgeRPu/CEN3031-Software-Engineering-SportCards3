angular.module('sportsCardApp')
    .controller('cardController',
        function ($scope, $http) {

            //initial card data
            $http.get(window.location.origin + "/api/cards/")
                .then(function (response) {

                    $scope.cards = response.data;
                    console.log($scope.cards);
                })

            $scope.showCardDetails = function (card) {

                $scope.cardId = card._id;
                $scope.cardName = card.playerName;
                $scope.cardYear = card.year;
                $scope.cardManufacturer = card.manufacturer;
                $scope.cardTeam = card.team;
                $scope.cardNum = card.cardNum;
                $scope.cardOtherInfo = card.otherInfo;
                $scope.cardImgBack = card.imgBack;
                $scope.cardImgFront = card.imgFront;

                $scope.cardImg = card.imgFront; //display front side by default
                $scope.front = true;
            }

            $scope.toggleImageSide = function (card) {

                if (document.getElementById(card._id).getAttribute("src") == 'https://drive.google.com/uc?id=' + card.imgBack)
                    document.getElementById(card._id).setAttribute("src", 'https://drive.google.com/uc?id=' + card.imgFront);

                else
                    document.getElementById(card._id).setAttribute("src", 'https://drive.google.com/uc?id=' + card.imgBack);
            }

            $scope.toggleModalImageSide = function () {

                if ($scope.front) {
                    $scope.cardImg = $scope.cardImgBack;
                    $scope.front = false;
                } else {
                    $scope.cardImg = $scope.cardImgFront;
                    $scope.front = true;
                }
            }


            $scope.orderByCriteria = "";

            $scope.orderBy = function (criteria) {
                $scope.orderByCriteria = criteria;
            }





        });