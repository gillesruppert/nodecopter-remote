var net = require('net');
var five = require('johnny-five');

// client - sends commands
var client = net.connect({port: 8124}, function () {
  console.log('client connected');
  client.write('world!\r\n');
});

client.on('data', function (data) {
  console.log(data.toString());
  //client.end();
});

client.on('end', function () {
  console.log('client disconnected');
});



var board = new five.Board();

board.on('ready', function () {
  var b1 = new five.Button(2);
  var b2 = new five.Button(3);
  var pot = new five.Sensor({
    pin: 'A0'
  });

  var flex = new five.Sensor({
    pin: 'A1',
    range: [100, 240]
  });

  b1.on('hold', function () {
    console.log('b1 hold');
    client.write('takeoff');
  });

  b2.on('down', function () {
    console.log('b2 down');
    client.write('land');
  });

  pot.on('change', function () {
    console.log('pot', this.value);
  });

  flex.scale([0, 100]).on('bend', function () {
    console.log('flex', parseInt(this.value, 10));
  });


});
