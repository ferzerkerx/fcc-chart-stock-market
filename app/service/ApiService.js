'use strict';

function ApiService (wss) {

    console.log('### ApiService');
    var currentStockCodes = [];

    function broadCastToAllClients(wss) {
        wss.broadcast(JSON.stringify(currentStockCodes));
    }

    wss.on('connection', function connection(ws) {

        console.log('###connection:');
        ws.on('message', function incoming(stockCode) {
            console.log('received: %s', stockCode);
            currentStockCodes.push(stockCode);
            broadCastToAllClients(wss);
        });


        ws.send(JSON.stringify(currentStockCodes));
    });

    this.addStockCode = function (req, res) {
        var stockCode = req.params.stockCode;
        currentStockCodes.push(stockCode);
        broadCastToAllClients();
        return res.status(200);
    };

    this.deleteStockCode = function (req, res) {
        var stockCode = req.params.stockCode;

        var index = currentStockCodes.indexOf(stockCode);
        if (index >= 0) {
            currentStockCodes.splice(index, 1);
        }
        broadCastToAllClients();
        return res.status(200);
    };
}

module.exports = ApiService;