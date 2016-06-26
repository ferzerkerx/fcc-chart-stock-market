'use strict';


var stockControllers = angular.module('stockControllers', []);

stockControllers.controller('mainController', ['$scope', '$route', '$rootScope', '$window','$location', 'stockServices', 'notifyingService',
    function ($scope, $route, $rootScope, $window, $location, stockServices, notifyingService) {

        function generateColor() {
            var number = Math.floor(Math.random() * 16777216);
            return '#' + number.toString(16);
        }

        function formatDate(date) {
            return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
        }

        $scope.form = {};
        var now = new Date(Date.now());
        var millisecondsInMonth = 1000 * 60 * 60 * 24 * 30;
        $scope.controls = {startDate: new Date(Date.now() - millisecondsInMonth), endDate: now};

        $scope.currentStocks = stockServices.currentStocks();


        $scope.control = function(data) {
            var multiplier = 1;
            switch (data) {
                case '1m':
                    multiplier = 1;
                    break;
                case '3m':
                    multiplier = 3;
                    break;
                case '6m':
                    multiplier = 6;
                    break;
            }

            $scope.controls.startDate = new Date(Date.now() - (millisecondsInMonth * multiplier));
            refreshStockData();

        };

        var refreshStockData = function() {
            $scope.currentStocks = stockServices.currentStocks();
            if ($scope.currentStocks.length === 0) {
                renderChart([], []);
                return;
            }

            var startDate = formatDate($scope.controls.startDate);
            var endDate = formatDate($scope.controls.endDate);
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
                    dataSets[quote.Symbol].data.unshift(quote.Close);
                    if (currentQuote === undefined) {
                        currentQuote = quote.Symbol;
                    }

                    if (currentQuote === quote.Symbol) {
                        labels.unshift(quote.Date);
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