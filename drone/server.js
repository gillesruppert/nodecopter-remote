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
    //console.log(data.toString());
    var command = data.toString();

    if (command.indexOf('stop') === 0) {
      drone.stop();
    } else if (command.indexOf('land') === 0) {
      console.log('land');
      drone.stop();
      drone.land();
    } else if (command.indexOf('takeoff') === 0) {
      console.log('takeoff');
      drone.takeoff();

    } else if (command.indexOf('flip') === 0) {
      console.log('flip');
      drone.animate('flipAhead', 15);


    } else if (command.indexOf('front') === 0) {
      console.log('front');
      drone.front(1);
    } else if (command.indexOf('back') === 0) {
      console.log('back');
      drone.back(1);
    } else if (command.indexOf('fbstop') === 0) {
      console.log('fbstop');
      drone.front(0);


    } else if (command.indexOf('left') === 0) {
      console.log('left');
      drone.left(1);
    } else if (command.indexOf('right') === 0) {
      console.log('right');
      drone.right(1);
    } else if (command.indexOf('lrstop') === 0) {
      console.log('lrstop');
      drone.right(0);


    } else if (command.indexOf('up') === 0) {
      console.log('up');
      drone.up(1);
    } else if (command.indexOf('down') === 0) {
      console.log('down');
      drone.down(1);
    } else if (command.indexOf('udstop') === 0) {
      console.log('updownstop');
      drone.up(0);


    } else if (command.indexOf('clockwise') === 0) {
      console.log('clockwise');
      drone.clockwise(1);
    } else if (command.indexOf('counterClockwise') === 0) {
      console.log('counterClockwise');
      drone.counterClockwise(1);
    } else if (command.indexOf('turnstop') === 0) {
      console.log('turnstop');
      drone.clockwise(0);
    }


  });
  //c.pipe(process.stdin);
  //c.pipe(c);
});

server.listen(8124, function () {
  console.log('server bound');
});



