var five = require('johnny-five');
var board = new five.Board();

// start the drone. Once the server is listening, start up the remote


// pins for the remote!
var pins = {
  takeoff: 2
, land: 3
, flip: 8
, upDown: 'A0'
, leftRight: 'A1'
, frontBack: 'A4'
, turn: 'A5'
};



board.on('ready', function () {
});
