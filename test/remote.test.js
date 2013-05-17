var expect = require('expect.js');
var sinon = require('sinon');
var five = require('johnny-five');
var Remote = require('../remote');
var isSimilar = Remote.isSimilar;
var isMiddle = Remote.isMiddle;
var normaliseValue = Remote.normaliseValue;


describe('remote', function () {
  describe('isSimilar()', function () {
    it('should return true if within the tolerance', function () {
      expect(isSimilar(10, 10)).to.be(true);
    });

    it('should return false if outside the tolerance', function () {
      expect(isSimilar(10, 50)).to.be(false);
    });

    it('should use a tolerance of 10 if no tolerance is passed', function () {
      expect(isSimilar(10, 0)).to.be(true);
      expect(isSimilar(10, 10)).to.be(true);
      expect(isSimilar(10, 20)).to.be(true);
      expect(isSimilar(10, 21)).to.be(false);
      expect(isSimilar(11, 0)).to.be(false);
    });

    it('should use the tolerance that is passed in', function () {
      expect(isSimilar(50, 30, 20)).to.be(true);
      expect(isSimilar(50, 70, 20)).to.be(true);
      expect(isSimilar(50, 29, 20)).to.be(false);
      expect(isSimilar(50, 71, 20)).to.be(false);
    });

    it('should return false if the compare value is not defined or null', function () {
      expect(isSimilar(50)).to.be(false);
      expect(isSimilar(50, false)).to.be(false);
      expect(isSimilar(50, null)).to.be(false);
      expect(isSimilar(50, undefined)).to.be(false);
    });
  });

  describe('isMiddle()', function () {
    it('should return true if the value is within the tolerance of the middle', function () {
      expect(isMiddle(451)).to.be(true);
      expect(isMiddle(572)).to.be(true);
      expect(isMiddle(512)).to.be(true);
      expect(isMiddle(450)).to.be(false);
      expect(isMiddle(573)).to.be(false);
    });
  });

  describe('normaliseValue()', function () {
    it('should return a negative value if it is down', function () {
      expect(normaliseValue(450)).to.be.within(-1, 0);
      expect(normaliseValue(0)).to.be.within(-1, 0);
    });

    it('should return a positive value if it is up', function () {
      expect(normaliseValue(573)).to.be.within(0, 1);
      expect(normaliseValue(1023)).to.be.within(0, 1);
    });

    it('should return 0 if it is in the middle', function () {
      expect(normaliseValue(455)).to.be(0);
      expect(normaliseValue(510)).to.be(0);
      expect(normaliseValue(570)).to.be(0);
    });

    it('should return -1 at the lowest down value', function () {
      expect(normaliseValue(0)).to.be(-1);
    });

    it('should return 0 at the smallest down value', function () {
      expect(normaliseValue(450)).to.be(0);
    });

    it('should return 1 at the highest up value', function () {
      expect(normaliseValue(1023)).to.be(1);
    });

    it('should return 0 at the smallest up value', function () {
      expect(normaliseValue(573)).to.be(0);
    });
  });

  describe('Remote', function () {
    beforeEach(function () {
      this.sinon = sinon.sandbox.create();
      function Test () {}
      Test.prototype.on = function () {};
      this._Button = five.Button;
      this._Sensor = five.Sensor;
      five.Button = Test;
      five.Sensor = Test;
      this.remote = new Remote({});
    });

    afterEach(function () {
      this.sinon.restore();
      five.Button = this._Button;
      five.Sensor = this._Sensor;
      delete this.remote;
      delete this._Button;
      delete this._Sensor;
    });

    describe('handlers', function () {
      beforeEach(function () {
        this.front = this.sinon.spy();
        this.back = this.sinon.spy();

        this.left = this.sinon.spy();
        this.right = this.sinon.spy();

        this.up = this.sinon.spy();
        this.down = this.sinon.spy();

        this.clockwise = this.sinon.spy();
        this.counterClockwise = this.sinon.spy();

        this.remote.on('front', this.front);
        this.remote.on('back', this.back);

        this.remote.on('left', this.left);
        this.remote.on('right', this.right);

        this.remote.on('up', this.up);
        this.remote.on('down', this.down);

        this.remote.on('clockwise', this.clockwise);
        this.remote.on('counterClockwise', this.counterClockwise);

        this.remote.frontBackHandler = this.remote.getHandler({ HIGH: 'back', LOW: 'front' });
        this.remote.leftRightHandler = this.remote.getHandler({ HIGH: 'right', LOW: 'left' });
        this.remote.upDownHandler = this.remote.getHandler({ HIGH: 'down', LOW: 'up' });
        this.remote.turnHandler = this.remote.getHandler({ HIGH: 'clockwise', LOW: 'counterClockwise' });
      });

      describe('front back handlers', function () {
        it('should emit the `back` event with a value of 0 when in the middle', function () {
          this.remote.frontBackHandler(null, 500);
          expect(this.front.callCount).to.be(0);
          expect(this.back.callCount).to.be(1);
          expect(this.back.args[0][0]).to.be(0);
        });

        it('should emit the `front` event if the value is below 450', function () {
          this.remote.frontBackHandler(null, 200);
          expect(this.front.callCount).to.be(1);
          expect(this.front.getCall(0).args[0]).to.be.within(0, 1);
          expect(this.back.callCount).to.be(0);
        });

        it('should emit the `back` event if the value is above 573', function () {
          this.remote.frontBackHandler(null, 600);
          expect(this.front.callCount).to.be(0);
          expect(this.back.callCount).to.be(1);
          expect(this.back.getCall(0).args[0]).to.be.within(0, 1);
        });

        it('should save the last value sent', function () {
          this.remote.frontBackHandler(null, 700);
          expect(this.remote.frontBackHandler.lastValue).to.be(700);
        });

        it('should not fire an event if 2 similar values are passed in a row', function () {
          this.remote.frontBackHandler(null, 300);
          expect(this.front.callCount).to.be(1);
          this.remote.frontBackHandler(null, 305);
          expect(this.front.callCount).to.be(1);
        });
      });

      describe('left right handlers', function () {
        it('should emit the `right` event with a value of 0 if in the middle', function () {
          this.remote.leftRightHandler(null, 500);
          expect(this.left.callCount).to.be(0);
          expect(this.right.callCount).to.be(1);
          expect(this.right.args[0][0]).to.be(0);
        });

        it('should emit the `left` event if the value is below 450', function () {
          this.remote.leftRightHandler(null, 200);
          expect(this.left.callCount).to.be(1);
          expect(this.left.getCall(0).args[0]).to.be.within(0, 1);
          expect(this.right.callCount).to.be(0);
        });

        it('should emit the `right` event if the value is above 573', function () {
          this.remote.leftRightHandler(null, 600);
          expect(this.left.callCount).to.be(0);
          expect(this.right.callCount).to.be(1);
          expect(this.right.getCall(0).args[0]).to.be.within(0, 1);
        });

        it('should save the last value sent', function () {
          this.remote.leftRightHandler(null, 700);
          expect(this.remote.leftRightHandler.lastValue).to.be(700);
        });

        it('should not fire an event if 2 similar values are passed in a row', function () {
          this.remote.leftRightHandler(null, 300);
          expect(this.left.callCount).to.be(1);
          this.remote.leftRightHandler(null, 305);
          expect(this.left.callCount).to.be(1);
        });
      });

      describe('up down handlers', function () {
        it('should emit the `down` event with a value of 0 if in the middle', function () {
          this.remote.upDownHandler(null, 500);
          expect(this.up.callCount).to.be(0);
          expect(this.down.callCount).to.be(1);
          expect(this.down.args[0][0]).to.be(0);
        });

        it('should emit the `up` event if the value is below 450', function () {
          this.remote.upDownHandler(null, 200);
          expect(this.up.callCount).to.be(1);
          expect(this.up.getCall(0).args[0]).to.be.within(0, 1);
          expect(this.down.callCount).to.be(0);
        });

        it('should emit the `down` event if the value is above 573', function () {
          this.remote.upDownHandler(null, 600);
          expect(this.up.callCount).to.be(0);
          expect(this.down.callCount).to.be(1);
          expect(this.down.getCall(0).args[0]).to.be.within(0, 1);
        });

        it('should save the last value sent', function () {
          this.remote.upDownHandler(null, 700);
          expect(this.remote.upDownHandler.lastValue).to.be(700);
        });

        it('should not fire an event if 2 similar values are passed in a row', function () {
          this.remote.upDownHandler(null, 300);
          expect(this.up.callCount).to.be(1);
          this.remote.upDownHandler(null, 305);
          expect(this.up.callCount).to.be(1);
        });
      });

      describe('turn handlers', function () {
        it('should emit the `clockwise` event with the value of 0 if in the middle', function () {
          this.remote.turnHandler(null, 500);
          expect(this.counterClockwise.callCount).to.be(0);
          expect(this.clockwise.callCount).to.be(1);
          expect(this.clockwise.args[0][0]).to.be(0);
        });

        it('should emit the `counterClockwise` event if the value is below 450', function () {
          this.remote.turnHandler(null, 200);
          expect(this.counterClockwise.callCount).to.be(1);
          expect(this.counterClockwise.getCall(0).args[0]).to.be.within(0, 1);
          expect(this.clockwise.callCount).to.be(0);
        });

        it('should emit the `clockwise` event if the value is above 573', function () {
          this.remote.turnHandler(null, 600);
          expect(this.counterClockwise.callCount).to.be(0);
          expect(this.clockwise.callCount).to.be(1);
          expect(this.clockwise.getCall(0).args[0]).to.be.within(0, 1);
        });

        it('should save the last value sent', function () {
          this.remote.turnHandler(null, 700);
          expect(this.remote.turnHandler.lastValue).to.be(700);
        });

        it('should not fire an event if 2 similar values are passed in a row', function () {
          this.remote.turnHandler(null, 300);
          expect(this.counterClockwise.callCount).to.be(1);
          this.remote.turnHandler(null, 305);
          expect(this.counterClockwise.callCount).to.be(1);
        });
      });

      describe('multiple events', function () {
        it('should fire the right events for the different movements', function () {
          this.remote.turnHandler(null, 400);
          this.remote.upDownHandler(null, 700);
          this.remote.leftRightHandler(null, 800);

          expect(this.counterClockwise.callCount).to.be(1);
          expect(this.remote.turnHandler.lastValue).to.be(400);
          expect(this.down.callCount).to.be(1);
          expect(this.remote.upDownHandler.lastValue).to.be(700);
          expect(this.right.callCount).to.be(1);
          expect(this.remote.leftRightHandler.lastValue).to.be(800);
          this.remote.leftRightHandler(null, 300);
          expect(this.right.callCount).to.be(1);
          expect(this.left.callCount).to.be(1);
          expect(this.remote.leftRightHandler.lastValue).to.be(300);
        });
      });
    });

  });
});
