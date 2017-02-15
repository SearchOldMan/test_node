var server = require('./server');
var router = require('./n6');

server.start(router.route);