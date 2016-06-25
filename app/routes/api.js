'use strict';

var path = process.cwd();
var ApiService = require(path + '/app/service/ApiService.js');

module.exports = function (app, wss) {

    var apiService = new ApiService(wss);

    app.route('/api/stockCode')
        .post(apiService.addStockCode);

    app.route('/api/stockCode/:stockCode')
        .delete(apiService.deleteStockCode);

};