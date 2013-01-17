var net = require('net');

var client;
exports.client = client;
// server - receives commands
var server = exports.server = net.createServer(function (c) {
  console.log('server connected');
  client = c;
  c.on('end', function () {
    console.log('server disconnected');
  });

  c.write('hello\r\n');
  c.on('data', function (data) {
    console.log(data.toString());
  });
  //c.pipe(process.stdin);
  //c.pipe(c);
});

server.listen(8124, function () {
  console.log('server bound');
});



