'use strict';

var server = require('http').createServer();
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ server: server });

var express = require('express');
var bodyParser = require('body-parser');

var routesIndex = require('./app/routes/index.js');
var routesApi = require('./app/routes/api.js');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('dotenv').config();

app.use('/public', express.static(process.cwd() + '/app/public'));

routesIndex(app);
routesApi(app, wss);

var port = process.env.PORT || 8080;


wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
};

server.on('request', app);
server.listen(port, function () {
    console.log('Node.js listening on port ' + port + '...');
});
