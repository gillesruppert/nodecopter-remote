var five = require('johnny-five');
var client = require('./client');

var board = new five.Board();

var js1Pins = ['A0', 'A1'];
//var js2Pins = ['A4', 'A5'];
var takeoffPin = 2;
var landPin = 3;
var upDownPin = 0;
var turnPin = 1;
var flipPin = 4;
var frontBackPin = 4;
var leftRigthPin = 5;


board.on('ready', function () {

  var takeoff = new five.Button(takeoffPin);
  var land = new five.Button(landPin);
  var flip = new five.Button(flipPin);

  flip.on('down', function () {
    console.log('flip');
  });

  var upDown = new five.Sensor(upDownPin);
  var turn = new five.Sensor(turnPin);
  var frontBack = new five.Sensor(frontBackPin);
  var leftRight = new five.Sensor(leftRigthPin);

  takeoff.on('down', function () {
    console.log('takeoff');
    client.write('takeoff');
  });

  land.on('down', function () {
    console.log('land');
    client.write('land');
  });

  var frontBackLastValue = 10000;
  frontBack.on('read', function (err, value) {
    if (isSimilar(value, frontBackLastValue)) {
      return;
    }

    console.log('frontback', value);
    frontBackLastValue = value;

    if (value > 550) {
      client.write('back');
    } else if (value < 500) {
      client.write('front');
    } else {
      client.write('fbstop');
    }
  });



  var leftRightLastValue = 10000;
  leftRight.on('read', function (err, value) {
    if (isSimilar(value, leftRightLastValue)) {
      return;
    }

    console.log('leftright', value);
    leftRightLastValue = value;

    if (value > 550) {
      client.write('right');
    } else if (value < 500) {
      client.write('left');
    } else {
      client.write('lrstop');
    }
  });

  var upDownLastValue = 10000;
  upDown.on('change', function (err, value) {
    if (isSimilar(value, upDownLastValue)) {
      return;
    }
    console.log('updown', value);
    upDownLastValue = value;
    if (value > 550) {
      client.write('down');
    } else if (value < 500) {
      client.write('up');
    } else {
      client.write('udstop');
    }
  });

  var turnLastValue = 10000;
  turn.on('read', function (err, value) {
    if (isSimilar(value, turnLastValue)) {
      return;
    }

    console.log('turn', value);
    turnLastValue = value;

    if (value > 550) {
      client.write('clockwise');
    } else if (value < 480) {
      client.write('counterClockwise');
    } else {
      client.write('turnstop');
    }
  });
  function isSimilar(value, compare, tolerance) {
    tolerance = tolerance || 10;
    if (Math.abs(value - compare) > tolerance) {
      return false;
    } else {
      return true;
    }
  }
});
