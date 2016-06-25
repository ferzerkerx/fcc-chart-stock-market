'use strict';

//TODO if websockets are supported
//if (!"WebSocket" in window) {
//    alert("WebSocket NOT supported by your Browser! app won't be loaded");
//    break;
//}

var stockApp = angular.module('stockApp', [
    'ngRoute',
    'stockControllers',
    'stockServices'
]);

stockApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/main', {
            templateUrl: 'public/partials/main.html',
            controller: 'mainController'
        }).
        otherwise({
            redirectTo: '/main'
        });
    }]);
