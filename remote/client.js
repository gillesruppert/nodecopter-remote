var net = require('net');

// client - sends commands
var client = module.exports = net.connect({port: 8124}, function () {
  console.log('client connected');
});

client.on('data', function (data) {
  console.log('client received', data.toString());
  //client.end();
});

client.on('end', function () {
  console.log('client disconnected');
});

