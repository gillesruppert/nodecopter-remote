var net = require('net');

// server - receives commands
var server = net.createServer(function (c) {
  console.log('server connected');
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



