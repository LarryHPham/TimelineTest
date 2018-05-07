const express = require('express');

const server = {

    app: express(),

    initialize() {
        server.urlConfs();
        server.startWebServer();
    },

    startWebServer() {
        server.app.listen(8077);
        console.log('Listening on port 8077');
    },

    urlConfs() {
        server.app.use(express.static(__dirname + '/public'));
    }
};

server.initialize();
