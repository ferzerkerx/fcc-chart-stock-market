
'use strict';

/* Services */

var stockServices = angular.module('stockServices', ['ngResource']);

stockServices.factory('stockServices', ['$http', '$location', 'notifyingService',
    function($http, $location, notifyingService) {

        var currentStocks = [];
        var ws = new WebSocket("ws://" + $location.host() + ':' + $location.port());

        ws.onmessage = function (evt) {
            var received_msg = evt.data;
            console.log("Message is received..." + received_msg);
            currentStocks = JSON.parse(received_msg);
            notifyingService.notify();
        };

        ws.onclose = function() {
            console.log("Connection is closed...");
        };

        var addStockCode = function(stockCode) {
            ws.send(stockCode);
        };

        var getCurrentStockCodes = function() {
            return currentStocks;
        };

        var listStockData = function() {
            var url = 'https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.historicaldata where symbol IN ("YHOO", "CSCO") and startDate = "2015-09-11" and endDate = "2016-03-10"&format=json&env=store://datatables.org/alltableswithkeys';
            return $http.get(url).then(function (response) {
                return response.data;
            });
        };

        return {
            listStockData: listStockData,
            addStockCode: addStockCode,
            currentStocks: getCurrentStockCodes
        };
    }]);


stockServices.factory('notifyingService', function($rootScope) {
    return {
        subscribe: function(scope, callback) {
            var handler = $rootScope.$on('notifying-service-event', callback);
            scope.$on('$destroy', handler);
        },

        notify: function() {
            $rootScope.$emit('notifying-service-event');
        }
    };
});
