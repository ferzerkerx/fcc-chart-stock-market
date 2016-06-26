'use strict';


var stockControllers = angular.module('stockControllers', []);

stockControllers.controller('mainController', ['$scope', '$route', '$rootScope', '$window','$location', 'stockServices', 'notifyingService',
    function ($scope, $route, $rootScope, $window, $location, stockServices, notifyingService) {
        $scope.form = {};

        $scope.currentStocks = stockServices.currentStocks();

        function generateColor() {
            var number = Math.floor(Math.random() * 16777216);
            return '#' + number.toString(16);
        }

        var refreshStockData = function() {
            $scope.currentStocks = stockServices.currentStocks();
            if ($scope.currentStocks.length === 0) {
                renderChart([], []);
                return;
            }

            var startDate = "2015-09-11";
            var endDate = "2016-01-14";
            stockServices.listStockData(startDate, endDate).then(function (data) {
                var quotes = data;
                var dataSets = {};
                var labels = [];

                $scope.currentStocks.forEach(function(currentValue) {

                    var color = generateColor();
                    dataSets[currentValue.stockCode] =
                    {
                        label: currentValue.stockCode,
                        data: [],
                        backgroundColor: color,
                        borderWidth: 1,
                        lineTension: 0.2,
                        fill: false,
                        borderColor: color,
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter'

                    };
                });


                var currentQuote = undefined;
                for (var i = 0; i < quotes.length; i++) {
                    var quote = quotes[i];
                    dataSets[quote.Symbol].data.push(quote.Close);
                    if (currentQuote === undefined) {
                        currentQuote = quote.Symbol;
                    }

                    if (currentQuote === quote.Symbol) {
                        labels.push(quote.Date);
                    }
                }

                var values = Object.keys(dataSets).map(function(key){
                    return dataSets[key];
                });
                renderChart(values, labels);
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
                    alert('Invalid Stock.');
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