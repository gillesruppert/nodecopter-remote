Nodecopter remote
=================

Nodecopter remote is a little project for building your own remote control with
Arduino and controlling a Parrot AR Drone.

## installation
```shell
npm install nodecopter-remote
```

## usage
You can see an example on hooking up the nodecopter-remote in `example/index.js`.
If you want to execute the example, you need to `cd` into `nodecopter-remote`
and run `npm install` to install the dev dependencies. Then you can execute
the example with `node example/index.js` and have a working remote, given that
you are connected to the drone via WiFi and have your Arduino connected.

The remote that is exported is an event emitter.

The events emitted by the remote are:
```javascript
var events = [
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
```

These events have the same name as the methods on the drone client, so binding 
them 1 to 1 is easy. (See bottom of `example/index.js`).

There is one case you might want to code for: When the drone crashes or is flipped
over, it goes into emergency mode. This is either disabled my creating a new client
or by calling `client.disableEmergency()` which allows you to start flying again.

You can see one way of handling it in `example/index.js`, i.e. by proxying the `takeoff`
method and always calling `client.disableEmergency()` before takeoff.


If you have used the provided diagramme, you can just use it out of the box. If
not, you can override the pin map. You can also override the default animations.

An example of overriding the defaults:
```javascript
  var remote = new Remote(five, {
      takeoffLand: 7
    , button1: 8 // joystick button left
    , button2: 9 // joystick button right
    // pins for the joystick
    , frontBack: 'A0'
    , leftRight: 'A1'
    , upDown: 'A2'
    , turn: 'A3'
    }, [
      'flipLeft' // animation on the left joystick
    , 'flipRight' // animation on the right joystick
    ]
  );
```

Available animations:

```javascript
// led animations
[
  'blinkGreenRed', 'blinkGreen', 'blinkRed', 'blinkOrange', 'snakeGreenRed',
  'fire', 'standard', 'red', 'green', 'redSnake', 'blank', 'rightMissile',
  'leftMissile', 'doubleMissile', 'frontLeftGreenOthersRed',
  'frontRightGreenOthersRed', 'rearRightGreenOthersRed',
  'rearLeftGreenOthersRed', 'leftGreenRightRed', 'leftRedRightGreen',
  'blinkStandard'
];

// move animations
[
  'phiM30Deg', 'phi30Deg', 'thetaM30Deg', 'theta30Deg', 'theta20degYaw200deg',
  'theta20degYawM200deg', 'turnaround', 'turnaroundGodown', 'yawShake',
  'yawDance', 'phiDance', 'thetaDance', 'vzDance', 'wave', 'phiThetaMixed',
  'doublePhiThetaMixed', 'flipAhead', 'flipBehind', 'flipLeft', 'flipRight'
];
```

**N.B: you need to inject your copy of `johnny-five` into the Remote constructor now.
Take a look at the updated example. The example will work.**

## building the remote
You can find an image of the finished remote in `example/remote.jpg`.

If you want to reproduce the remote exactly, I created a Fritzing diagramme
that shows you how everything is wired up. Fritzing is an open-source software
available on all major platforms and can be downloaded at [http://fritzing.org](http://fritzing.org).

## hardware components
The components you need:
- 3x 10k resistors
- 2x PS3 style joysticks, preferably with push-button functionality
- 1x regular push button
- a few cables
- breadboard
- Arduino Uno (others might work, but I only tested with the Uno)

## License
The code is licensed under the MIT license.
