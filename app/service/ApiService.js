'use strict';

function ApiService (wss) {

    console.log('### ApiService');
    var currentStockCodes = [];

    function broadCastToAllClients(wss) {
        wss.broadcast(JSON.stringify(currentStockCodes));
    }

    wss.on('connection', function connection(ws) {
        ws.send(JSON.stringify(currentStockCodes));
    });

    this.addStockCode = function (req, res) {
        var stockCode = req.body.stockCode;
        //TODO validate

        currentStockCodes.push(stockCode);
        broadCastToAllClients(wss);
        return res.status(200);
    };

    this.deleteStockCode = function (req, res) {
        var stockCode = req.params.stockCode;

        var index = currentStockCodes.indexOf(stockCode);
        if (index >= 0) {
            currentStockCodes.splice(index, 1);
        }
        broadCastToAllClients(wss);
        return res.status(200);
    };
}

module.exports = ApiService;