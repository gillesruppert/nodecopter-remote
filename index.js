var five = require('johnny-five');
var Remote = require('./lib/remote');
var arDrone = require('ar-drone');

var board = new five.Board();
var client = arDrone.createClient();

var dronestream = require('dronestream');
var http = require('http');
var fs = require('fs');



var server = http.createServer(function (req, res) {
  fs.createReadStream(__dirname + '/index.html').pipe(res);

});

dronestream.listen(server);
server.listen(5555);

client.config('general:navdata_demo', 'FALSE');
client.on('navdata', console.log);




// pins for the remote!
var pins = {
  takeoffLand: 7
, button1: 8
, button2: 9

, frontBack: 'A0'
, leftRight: 'A1'

, upDown: 'A2'
, turn: 'A3'
};

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

var animations = [
  'turnaroundGodown'
, 'flipLeft'
];

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
  var remote = new Remote(pins, animations);

  cmds.forEach(function (cmd) {
    remote.on(cmd, function (value, hz, dur) {
      console.log(cmd, value, hz, dur);
      if (cmd === 'takeoff') {
        client.disableEmergency();
        process.nextTick(client[cmd].bind(client, value, hz, dur));
      } else {
        client[cmd](value, hz, dur);
      }
    });
  });
});
