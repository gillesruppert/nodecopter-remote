var five = require('johnny-five');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var EMPTY = function () {};

var ledAnimations = [
  'blinkGreenRed', 'blinkGreen', 'blinkRed', 'blinkOrange', 'snakeGreenRed',
  'fire', 'standard', 'red', 'green', 'redSnake', 'blank', 'rightMissile',
  'leftMissile', 'doubleMissile', 'frontLeftGreenOthersRed',
  'frontRightGreenOthersRed', 'rearRightGreenOthersRed',
  'rearLeftGreenOthersRed', 'leftGreenRightRed', 'leftRedRightGreen',
  'blinkStandard'
];

var animations = [
  'phiM30Deg', 'phi30Deg', 'thetaM30Deg', 'theta30Deg', 'theta20degYaw200deg',
  'theta20degYawM200deg', 'turnaround', 'turnaroundGodown', 'yawShake',
  'yawDance', 'phiDance', 'thetaDance', 'vzDance', 'wave', 'phiThetaMixed',
  'doublePhiThetaMixed', 'flipAhead', 'flipBehind', 'flipLeft', 'flipRight'
];

var Remote = exports = module.exports = function Remote (pins, anims) {
  EventEmitter.call(this);

  var isFlying = false;

  var takeoffLand = new five.Button(pins.takeoffLand);
  var button1 = new five.Button(pins.button1);
  var button2 = new five.Button(pins.button2);

  var upDown = new five.Sensor(pins.upDown);
  var turn = new five.Sensor(pins.turn);

  var frontBack = new five.Sensor(pins.frontBack);
  var leftRight = new five.Sensor(pins.leftRight);


  takeoffLand.on('down', function () {
    var cmd = (isFlying = !isFlying) ? 'takeoff' : 'land';
    this.emit(cmd);
  }.bind(this));


  // listening for `up` as the joystick is using
  // pull-up rather than pull-down resistors
  button1.on('up', getAnimation(anims[0]).bind(this));
  button2.on('up', getAnimation(anims[1]).bind(this));


  frontBack.on('change', this.getHandler({
    // the joysticks are wired upside down, hence the reversal of the values!
    HIGH: 'back',
    LOW: 'front'
  }).bind(this));

  leftRight.on('change', this.getHandler({
    HIGH: 'right',
    LOW: 'left'
  }).bind(this));


  upDown.on('change', this.getHandler({
    // the joysticks are wired upside down, hence the reversal of the values!
    HIGH: 'down',
    LOW: 'up'
  }).bind(this));

  turn.on('change', this.getHandler({
    HIGH: 'clockwise',
    LOW: 'counterClockwise'
  }).bind(this));
};

util.inherits(Remote, EventEmitter);

Remote.prototype.getHandler = function getHandler(opts) {
  return function (err, value) {
    if (err) console.error(err);
    if (isSimilar(value, arguments.callee.lastValue)) return;
    arguments.callee.lastValue = value;

    value = normaliseValue(value);
    if (value === 0) {
      this.emit(opts.HIGH, value);
    } else if (value > 0) {
      this.emit(opts.HIGH, Math.abs(value));
    } else if (value < 0) {
      this.emit(opts.LOW, Math.abs(value));
    }
  };
};

function getAnimation (anim) {
  if (typeof anim !== 'string') return EMPTY;
  if (ledAnimations.indexOf(anim) !== -1) {
    return function () {
      this.emit('animateLeds', anim, 50, 5);
    };
  } else if (animations.indexOf(anim) !== -1) {
    return function () {
      this.emit('animate', anim, 500);
    };
  }
}

// helpers
var isSimilar = exports.isSimilar = function isSimilar(value, compare, tolerance) {
  tolerance = tolerance || 10;
  return (Math.abs(value - compare) <= tolerance);
};

var isMiddle = exports.isMiddle = function isMiddle(value) {
  return (value > 450 && value < 573);
};


var normaliseValue = exports.normaliseValue = function normaliseValue(value) {
  if (isMiddle(value)) return 0;
  if (value <= 450) return (value - 450) / 450;
  if (value >= 573) return (value - 573) / 450;
};
