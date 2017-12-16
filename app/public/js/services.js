
'use strict';

/* Services */

var stockServices = angular.module('stockServices', ['ngResource']);

stockServices.factory('stockServices', ['$http', '$location', 'notifyingService',
    function($http, $location, notifyingService) {


        var appContext = $location.absUrl();
        if (appContext.indexOf("#")) {
            appContext =  appContext.substring(0, appContext.indexOf("#") - 1);
        }

        var currentStocks = [];
        var socketUrl = (($location.protocol() === 'http') ? "ws://" : "wss://") + ($location.host() + ':' + $location.port());
        var ws = new WebSocket(socketUrl);

        ws.onmessage = function (evt) {
            var received_msg = evt.data;
            currentStocks = JSON.parse(received_msg);
            notifyingService.notify();
        };

        ws.onclose = function() {
            throw 'Lost connection with the server try to reload the page.';
        };

        var addStockCode = function(stockCode) {
            var url = appContext + '/api/stockCode';
            return $http.post(url, {stockCode: stockCode}).then(function (response) {
                return response.data;
            },
             function errorCallback() {
                    return undefined;
            });
        };

        var removeStockCode = function(stockCode) {
            var url = appContext + '/api/stockCode/' + stockCode;
            return $http.delete(url).then(function (response) {
                return response.data;
            });
        };

        var getCurrentStockCodes = function() {
            return currentStocks;
        };

        var listStockData = function(startDate, endDate) {
            var stockCodes = [];
            currentStocks.forEach(function(e) {
                stockCodes.push('"' + e.stockCode + '"');
            });
            stockCodes = stockCodes.join(',');

            var url = 'https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.historicaldata where symbol IN (' + stockCodes +') and startDate = "' + startDate +'" and endDate = "' + endDate + '"&format=json&env=store://datatables.org/alltableswithkeys';
            return $http.get(url).then(function (response) {
                if (response.data.query.results === null) {
                    return {};
                }
                return response.data.query.results.quote.map(function(e) {
                    return {Close: e.Close, Symbol: e.Symbol, Date: e.Date};

                });

            });
        };

        return {
            listStockData: listStockData,
            addStockCode: addStockCode,
            removeStockCode: removeStockCode,
            currentStocks: getCurrentStockCodes
        };
    }]);


//http://www.codelord.net/2015/05/04/angularjs-notifying-about-changes-from-services-to-controllers/
stockServices.factory('notifyingService', function($rootScope) {
    return {
        subscribe: function(scope, callback) {
            var removeHandler = $rootScope.$on('notifying-service-event', callback);
            scope.$on('$destroy', removeHandler);
        },

        notify: function() {
            $rootScope.$emit('notifying-service-event');
        }
    };
});
