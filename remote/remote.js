var five = require('johnny-five');
var t = require('temporal');
var client = require('./client');

var board = new five.Board();
var takeoffPin = 2;
var landPin = 3;
var fx1Pin = 4;
var fx2Pin = 5;
var fx3Pin = 6;

var takeoffLedPin = 9;
var landLedPin = 11;
var fxLedPin = 10;

board.on('ready', function () {
  // controls
  var takeoff = new five.Button(takeoffPin);
  var land = new five.Button(landPin);

  var fx1 = new five.Button(fx1Pin);
  var fx2 = new five.Button(fx2Pin);
  var fx3 = new five.Button(fx3Pin);

  var takeoffLed = new five.Led(takeoffLedPin);
  var landLed = new five.Led(landLedPin);
  var fxLed = new five.Led(fxLedPin);

  board.repl.inject({
    tLed: takeoffLed,
    lLed: landLed
  });

  takeoff.on('down', function () {
    if (takeoffLed.isOn || takeoffLed.isRunning) return;
    console.log('takeoff');
    takeoffLed.on();
    client.write('takeoff');
  });

  land.on('down', function () {
    if (landLed.isOn || landLed.isRunning) return;
    console.log('land');
    takeoffLed.fadeOut();
    landLed.on();
    t.delay(2000, landLed.fadeOut.bind(landLed, 2000));
    client.write('land');
  });



/*
 *  var pot = new five.Sensor({ pin: 'A0' });
 *  var flex = new five.Sensor({
 *    pin: 'A1',
 *    range: [100, 240]
 *  });
 *
 *  pot.on('change', function () {
 *    console.log('pot', this.value);
 *  });
 *
 *  flex.scale([0, 100]).on('bend', function () {
 *    console.log('flex', parseInt(this.value, 10));
 *  });
 */


});
