var five = require('johnny-five');
var arDrone = require('ar-drone');
var Remote = require('../remote');

// initialise the Arduino and the the drone client
var board = new five.Board();
var client = arDrone.createClient();

// make sure the client always calls disableEmergency() before taking off
var takeoff = client.takeoff;
client.takeoff = function (value) {
  this.disableEmergency();
  takeoff.call(this, value);
};


var cmds = [
  'takeoff'
, 'land'
, 'up'
, 'down'
, 'clockwise'
, 'counterClockwise'
, 'front'
, 'back'
, 'left'
, 'right'
, 'animate'
, 'animateLeds'
];

// initialise the remote once the board is ready
board.on('ready', function () {
  var remote = new Remote();

  // iterate over all the commands and bind them to the event listeners
  cmds.forEach(function (cmd) {
    remote.on(cmd, client[cmd].bind(client));
  });
});
