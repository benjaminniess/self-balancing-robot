class PIDController {
  constructor(P, I, D, balanceValue) {
    this.KP = P
    this.KI = I
    this.KD = D
    this.target = balanceValue

    this.lastError = 0
    this.integrator = 0
  }

  setTarget(bVal) {
    this.target = bVal
    this.integrator = 0
  }

  setP(val) {
    this.KP = val
  }

  setI(val) {
    this.KI = val
  }

  setD(val) {
    this.KD = val
  }

  resetError() {
    this.integrator = 0
  }

  step(currentValue) {
    let error = currentValue - this.target

    let P = -this.KP * error
    let I = this.KI * this.integrator
    let D = this.KD * (error - this.lastError)

    let output = P + +I + D

    this.lastError = error
    this.integrator += error

    return {
      result: output,
      P: P,
      I: I,
      D: D,
      angle: error,
    }
  }
}
module.exports = PIDController
