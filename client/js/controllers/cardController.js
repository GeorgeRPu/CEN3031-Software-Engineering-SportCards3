angular.module('sportsCardApp')
    .controller('cardController',
        function ($scope, $http, $filter) {

            //initial card data
            $http.get(window.location.origin + "/api/cards/")
                .then(function (response) {

                    $scope.cards = response.data;
                    console.log($scope.cards);
                    $scope.searchedCards = $scope.cards;
                    $scope.shownCards = $scope.cards.slice(0, 8);
                    $scope.maxCardsLoaded = 8;
                })

            $scope.loadMore = function () {
                var last = $scope.maxCardsLoaded - 1;
                for (var i = 1; i <= 8; i++) {
                    if ((last + i > $scope.searchedCards.length) || $scope.searchedCards[last + i] == undefined)
                        break
                    $scope.shownCards.push($scope.searchedCards[last + i]);
                    $scope.maxCardsLoaded += 1;
                }
            };
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

                if (document.getElementById(card._id).getAttribute("src") == 'https://storage.cloud.google.com/sport-cards-bucket/' + card.imgBack)
                    document.getElementById(card._id).setAttribute("src", 'https://storage.cloud.google.com/sport-cards-bucket/' + card.imgFront);

                else
                    document.getElementById(card._id).setAttribute("src", 'https://storage.cloud.google.com/sport-cards-bucket/' + card.imgBack);
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

            $('.dropdown-menu a').click(function () {
                $('#dropdownMenuButton').text($(this).text());
            });

            $scope.searchCards = function (val) {
                $scope.searchedCards = $filter('filter')($scope.cards, val);
                $scope.shownCards = $scope.searchedCards.slice(0, $scope.maxCardsLoaded);
            }
            $scope.orderBy = function (criteria, reverse) {
                $scope.searchedCards = $filter('orderBy')($scope.searchedCards, criteria, reverse)
                $scope.cards = $filter('orderBy')($scope.cards, criteria, reverse)
                if ($scope.maxCardsLoaded > $scope.searchedCards.length)
                    $scope.shownCards = $scope.searchedCards.slice(0, $scope.searchedCards.length);
                else
                    $scope.shownCards = $scope.searchedCards.slice(0, $scope.maxCardsLoaded);
            }





        });
