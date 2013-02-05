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


  frontBack.on('change', this.frontBackHandler.bind(this));
  leftRight.on('change', this.leftRightHandler.bind(this));
  upDown.on('change', this.upDownHandler.bind(this));
  turn.on('read', this.turnHandler.bind(this));
};

util.inherits(Remote, EventEmitter);

Remote.prototype.frontBackHandler = function frontBackHandler(err, value) {
    if (err) console.error(err);
    if (isSimilar(value, frontBackHandler.lastValue)) return;
    frontBackHandler.lastValue = value;

    value = normaliseValue(value);
    if (value === 0) {
      this.emit('fbstop');
    // the joysticks are wired upside down, hence the reversal of the values!
    } else if (value > 0) {
      this.emit('back', Math.abs(value));
    } else if (value < 0) {
      this.emit('front', Math.abs(value));
    }
};

Remote.prototype.leftRightHandler = function leftRightHandler(err, value) {
    if (err) console.error(err);
    if (isSimilar(value, leftRightHandler.lastValue)) return;
    leftRightHandler.lastValue = value;

    value = normaliseValue(value);
    if (value === 0) {
      this.emit('lrstop');
    } else if (value > 0) {
      this.emit('right', Math.abs(value));
    } else if (value < 0) {
      this.emit('left', Math.abs(value));
    }
};

Remote.prototype.upDownHandler = function upDownHandler(err, value) {
    if (err) console.error(err);
    if (isSimilar(value, upDownHandler.lastValue)) return;
    upDownHandler.lastValue = value;

    value = normaliseValue(value);
    if (value === 0) {
      this.emit('udstop');
    // the joysticks are wired upside down, hence the reversal of the values!
    } else if (value > 0) {
      this.emit('down', Math.abs(value));
    } else if (value < 0) {
      this.emit('up', Math.abs(value));
    }
};

Remote.prototype.turnHandler = function turnHandler(err, value) {
    if (err) console.error(err);
    if (isSimilar(value, turnHandler.lastValue)) return;
    turnHandler.lastValue = value;

    value = normaliseValue(value);
    if (value === 0) {
      this.emit('turnstop');
    } else if (value > 0) {
      this.emit('clockwise', Math.abs(value));
    } else if (value < 0) {
      this.emit('counterClockwise', Math.abs(value));
    }
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
