'use strict';


var stockControllers = angular.module('stockControllers', []);

stockControllers.controller('mainController', ['$scope', '$route', '$rootScope', '$window','$location', 'stockServices', 'notifyingService',
    function ($scope, $route, $rootScope, $window, $location, stockServices, notifyingService) {

        console.log('### controller');
        $scope.form = {};

        $scope.currentStocks = stockServices.currentStocks();

        var refreshStockData = function() {
            $scope.currentStocks = stockServices.currentStocks();
            console.log("### refreshStockData:" + JSON.stringify($scope.currentStocks));
            stockServices.listStockData().then(function (data) {
                console.log('TEST####' + JSON.stringify(data));
                renderChart();
            });

        };

        notifyingService.subscribe($scope, refreshStockData);

        $scope.addStock = function () {
            stockServices.addStockCode($scope.form.stockCode).then(function(data) {

            });
        };

        $scope.removeStock = function (stockCode) {
            stockServices.removeStockCode(stockCode).then(function(data) {

            });
        };


        var renderChart = function() {
            var ctx = $("#myChart");
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                    datasets: [{
                        label: '# of Votes',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
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