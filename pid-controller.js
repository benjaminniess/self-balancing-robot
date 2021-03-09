class PIDController {
  constructor(P, I, D, balanceValue) {
    this.KP = P
    this.KI = I
    this.KD = D
    this.target = balanceValue

    this.lastError = 0
    this.integrator = 0
  }

  step(currentValue) {
    let error = currentValue - this.target
    let output =
      this.KP * error +
      this.KI * this.integrator +
      this.KD * (error - this.lastError)
    this.lastError = error
    this.integrator += error

    return output
  }
}
module.exports = PIDController
