var five = require('johnny-five');
var client = require('./client');

var board = new five.Board();

var js1Pins = ['A0', 'A1'];
//var js2Pins = ['A4', 'A5'];
var takeoffPin = 2;
var landPin = 3;
var frontBackPin = 4;
var leftRigthPin = 5;


board.on('ready', function () {

  var js1 = new five.Joystick({ pins: js1Pins, freq: 20 });
  //var js2 = new five.Joystick({ pins: js2Pins });

  var takeoff = new five.Button(takeoffPin);
  var land = new five.Button(landPin);

  var frontBack = new five.Sensor(frontBackPin);
  var leftRight = new five.Sensor(leftRigthPin);

  board.repl.inject({ });

  takeoff.on('down', function () {
    console.log('takeoff');
    client.write('takeoff');
  });

  land.on('down', function () {
    console.log('land');
    client.write('land');
  });

  frontBack.on('read', function (err, value) {
    if (value > 550) {
      client.write('back');
    } else if (value < 500) {
      client.write('front');
    } else {
      client.write('stop');
    }
    console.log('frontback', value);
  });

  leftRight.on('read', function (err, value) {
    if (value > 550) {
      client.write('right');
    } else if (value < 500) {
      client.write('left');
    } else {
      client.write('stop');
    }
    console.log('leftRight', value);
  });

  js1.on('axismove', function (err, timestamp) {
    if (this.fixed.y > 0.55 || this.fixed.y < 0.45) {
      //console.log('joystick1', this.fixed);
    }

    if (this.fixed.y > 0.55) {
      client.write('down');
    } else if (this.fixed.y < 0.45) {
      client.write('up');
    } else {
      client.write('stop');
    }
  });




  //js2.on('axismove', function (err, timestamp) {
    ////console.log('joystick2', this.fixed);
  //});


});
