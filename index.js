var five = require('johnny-five');
var arDrone = require('ar-drone');
var dronestream = require('dronestream');
var http = require('http');
var fs = require('fs');
var Remote = require('./lib/remote');

// initialise the Arduino and the the drone client
var board = new five.Board();
var client = arDrone.createClient();


// enable the stream
var server = http.createServer(function (req, res) {
  fs.createReadStream(__dirname + '/index.html').pipe(res);
});

dronestream.listen(server);
server.listen(5555);


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

  cmds.forEach(function (cmd) {
    remote.on(cmd, client[cmd].bind(client));
  });
});
