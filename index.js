var five = require('johnny-five');
var Remote = require('./lib/remote');
var arDrone = require('ar-drone');

var board = new five.Board();
var drone = arDrone.createClient();

// start the drone. Once the server is listening, start up the remote


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
  'blinkGreenRed'
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
      drone[cmd](value, hz, dur);
    });
  });
});
