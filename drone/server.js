var net = require('net');
var ardrone = require('ar-drone');

var drone = ardrone.createClient();


// server - receives commands
var server = exports.server = net.createServer(function (c) {
  console.log('server connected');
  c.on('end', function () {
    console.log('server disconnected');
  });

  c.write('hello\r\n');
  c.on('data', function (data) {
    console.log(data.toString());
    var command = data.toString();

    if (command.indexOf('stop') === 0) {
      command = 'stop';
    } else if (command.indexOf('land') === 0) {
      command = 'land';
    } else if (command.indexOf('takeoff') === 0) {
      command = 'takeoff';
    } else if (command.indexOf('up') === 0) {
      command = 'up';
    } else if (command.indexOf('down') === 0) {
      command = 'down';
    } else if (command.indexOf('front') === 0) {
      command = 'front';
    } else if (command.indexOf('back') === 0) {
      command = 'back';
    } else if (command.indexOf('left') === 0) {
      command = 'left';
    } else if (command.indexOf('right') === 0) {
      command = 'right';
    }


    drone[command](1);
  });
  //c.pipe(process.stdin);
  //c.pipe(c);
});

server.listen(8124, function () {
  console.log('server bound');
});



