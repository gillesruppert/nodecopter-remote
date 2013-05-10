var five = require('johnny-five');
var arDrone = require('ar-drone');
var Remote = require('./lib/remote');
var dronestream = require('dronestream');
var http = require('http');
var fs = require('fs');

// initialise the Arduino and the the drone client
var board = new five.Board();
var client = arDrone.createClient();


// enable the stream
var server = http.createServer(function (req, res) {
  fs.createReadStream(__dirname + '/index.html').pipe(res);

});

dronestream.listen(server);
server.listen(5555);


// enable the nav data
client.config('general:navdata_demo', 'FALSE');
//client.on('navdata', console.log);
// will also emit `landed`, `hovering`, `flying`, `landing`, `batteryChange`, `altitudeChange`


// These animation are available. 1st block are regular animations, 2nd are
// led animations
// 'phiM30Deg', 'phi30Deg', 'thetaM30Deg', 'theta30Deg', 'theta20degYaw200deg',
// 'theta20degYawM200deg', 'turnaround', 'turnaroundGodown', 'yawShake',
// 'yawDance', 'phiDance', 'thetaDance', 'vzDance', 'wave', 'phiThetaMixed',
// 'doublePhiThetaMixed', 'flipAhead', 'flipBehind', 'flipLeft', 'flipRight'
//
// 'blinkGreenRed', 'blinkGreen', 'blinkRed', 'blinkOrange', 'snakeGreenRed',
// 'fire', 'standard', 'red', 'green', 'redSnake', 'blank', 'rightMissile',
// 'leftMissile', 'doubleMissile', 'frontLeftGreenOthersRed',
// 'frontRightGreenOthersRed', 'rearRightGreenOthersRed',
// 'rearLeftGreenOthersRed', 'leftGreenRightRed', 'leftRedRightGreen',
// 'blinkStandard'

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


board.on('ready', function () {
  var remote = new Remote();

  cmds.forEach(function (cmd) {
    remote.on(cmd, getCmd(cmd));
  });


  // returns the 
  function getCmd(cmd) {
    if (cmd === 'takeoff') {
      return function (value, hz, dur) {
        client.disableEmergency();
        process.nextTick(
          client[cmd].bind(client, value, hz, dur)
        );
      };
    } else {
      return client[cmd].bind(client);
    }
  }
});
