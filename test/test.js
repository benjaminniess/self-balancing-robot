const assert = require('chai').assert
const PIDController = require('../pid-controller.js') 

describe('PID test', function () {
  describe('Get/Set', function () {
    it('Should calculate the correct amount of PWM required', function () {
      let PID = new PIDController(-78.5,1,1)
      assert.equal(PID.step(0), 0)
    })
  })
})
