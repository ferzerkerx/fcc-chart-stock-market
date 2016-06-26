'use strict';

var request = require('request');


function ApiService (wss) {
    var currentStockCodes = [];

    function broadCastToAllClients(wss) {
        wss.broadcast(JSON.stringify(currentStockCodes));
    }

    wss.on('connection', function connection(ws) {
        ws.send(JSON.stringify(currentStockCodes));
    });

    this.addStockCode = function (req, res) {
        var stockCode = req.body.stockCode;

        request('https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.quotes where symbol in ("' + stockCode + '")&format=json&env=store://datatables.org/alltableswithkeys',
            function (error, response, body) {
                if (!error && response.statusCode == 200) {

                    var quote = JSON.parse(body).query.results.quote;
                    var name = quote.Name;
                    if (name === null) {
                        return res.status(500).end();
                    }
                    currentStockCodes.push({stockCode: stockCode, name: name});
                    broadCastToAllClients(wss);
                    return res.status(200).end();
                }
            });
    };

    this.deleteStockCode = function (req, res) {
        var stockCode = req.params.stockCode;

        for (var i = 0; i < currentStockCodes.length; i++) {
            var currentStockCode = currentStockCodes[i].stockCode;
            if (currentStockCode === stockCode) {
                currentStockCodes.splice(i, 1);
                break;
            }

        }
        broadCastToAllClients(wss);
        return res.status(200).end();
    };
}

module.exports = ApiService;