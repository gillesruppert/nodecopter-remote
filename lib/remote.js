var five = require('johnny-five');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Remote = exports = module.exports = function Remote (pins) {
  EventEmitter.call(this);

  var takeoff = new five.Button(pins.takeoff);
  var land = new five.Button(pins.land);
  var flip = new five.Button(pins.flip);

  var upDown = new five.Sensor(pins.upDown);
  var leftRight = new five.Sensor(pins.leftRigth);
  var frontBack = new five.Sensor(pins.frontBack);
  var turn = new five.Sensor(pins.turn);


  takeoff.on('down', function () {
    this.emit('takeoff');
  });

  land.on('down', function () {
    this.emit('land');
  });

  flip.on('down', function () {
    this.emit('flip');
  });


  frontBack.on('change', this.getHandler({
    STOP: 'fbstop',
    // the joysticks are wired upside down, hence the reversal of the values!
    HIGH: 'back',
    LOW: 'front'
  }));
  leftRight.on('change', this.getHandler({
    STOP: 'lrstop',
    HIGH: 'right',
    LOW: 'left'
  }));
  upDown.on('change', this.getHandler({
    STOP: 'udstop',
    // the joysticks are wired upside down, hence the reversal of the values!
    HIGH: 'down',
    LOW: 'up'
  }));
  turn.on('change', this.getHandler({
    STOP: 'turnstop',
    HIGH: 'clockwise',
    LOW: 'counterClockwise'
  }));
};

util.inherits(Remote, EventEmitter);

Remote.prototype.getHandler = function getHandler(opts) {
  return function (err, value) {
    if (err) console.error(err);
    if (isSimilar(value, arguments.callee.lastValue)) return;
    arguments.callee.lastValue = value;

    value = normaliseValue(value);
    if (value === 0) {
      this.emit(opts.STOP);
    } else if (value > 0) {
      this.emit(opts.HIGH, Math.abs(value));
    } else if (value < 0) {
      this.emit(opts.LOW, Math.abs(value));
    }
  };
};

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
