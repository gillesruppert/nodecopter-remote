//var arDrone = require('ar-drone');
//var client = arDrone.createClient();

var dronestream = require('dronestream');
var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
  fs.createReadStream(__dirname + '/index.html').pipe(res);

});

dronestream.listen(server);
server.listen(5555);
