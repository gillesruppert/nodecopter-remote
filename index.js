var five = require('johnny-five');
var board = new five.Board();
var Remote = require('./lib/remote');

// start the drone. Once the server is listening, start up the remote


// pins for the remote!
var pins = {
  takeoff: 2
, land: 3
, emergency: 8
, flip: 9
, upDown: 'A0'
, turn: 'A1'
, frontBack: 'A4'
, leftRight: 'A5'
};



board.on('ready', function () {
  var remote = new Remote(pins);
  remote.on('takeoff', function () {
    console.log('takeoff');
  });

  remote.on('land', function () {
    console.log('land');
  });

  remote.on('flip', function () {
    console.log('flip');
  });

  remote.on('up', function (value) {
    console.log('up', value);
  });

  remote.on('down', function (value) {
    console.log('down', value);
  });

  remote.on('counterClockwise', function (value) {
    console.log('counterClockwise', value);
  });

  remote.on('clockwise', function (value) {
    console.log('clockwise', value);
  });

});
