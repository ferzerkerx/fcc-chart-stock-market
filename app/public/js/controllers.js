'use strict';


var stockControllers = angular.module('stockControllers', []);

stockControllers.controller('mainController', ['$scope', '$route', '$rootScope', '$window','$location', 'stockServices', 'notifyingService',
    function ($scope, $route, $rootScope, $window, $location, stockServices, notifyingService) {
        $scope.form = {};

        $scope.currentStocks = stockServices.currentStocks();

        function generateColor() {
            var number = Math.floor(Math.random() * 16777216);
            var color = '#' + number.toString(16);
            return color;
        }

        var refreshStockData = function() {
            $scope.currentStocks = stockServices.currentStocks();
            if ($scope.currentStocks.length === 0) {
                renderChart([], []);
                return;
            }
            stockServices.listStockData().then(function (data) {
                var quotes = data.query.results.quote;
                var dataSets = {};
                var labels = [];

                $scope.currentStocks.forEach(function(currentValue) {

                    dataSets[currentValue.stockCode] =
                    {
                        labels: [],
                        label: currentValue.name,
                        data: [],
                        backgroundColor: [generateColor()],
                        borderColor: [generateColor()],
                        borderWidth: 1

                    };
                });

                quotes.forEach(function(currentValue) {
                    dataSets[currentValue.Symbol].data.push(currentValue.Close);
                    labels.push(currentValue.Date);
                });

                renderChart(dataSets, labels);
            });

        };

        notifyingService.subscribe($scope, refreshStockData);

        $scope.addStock = function () {

            for (var i = 0; i < $scope.currentStocks.length; i++) {
                if ($scope.currentStocks[i] === $scope.form.stockCode) {
                    return;
                }
            }

            stockServices.addStockCode($scope.form.stockCode).then(function(data) {
                if (data === undefined) {
                    console.error('Invalid Stock.');
                }
                $scope.form.stockCode = "";
            });
        };

        $scope.removeStock = function (stockCode) {
            stockServices.removeStockCode(stockCode).then(function(data) {

            });
        };


        var renderChart = function(data, labels) {
            var ctx = $("#myChart");
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: data
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            });
        };
    }]);