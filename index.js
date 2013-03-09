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
, leftRight: 'A1'
, frontBack: 'A4'
, turn: 'A5'
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

  remote.on('left', function (value) {
    console.log('left', value);
  });

  remote.on('right', function (value) {
    console.log('right', value);
  });

});
