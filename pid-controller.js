class PIDController {
    constructor(P, I, D) {
        this.KP = P
        this.KI = I
        this.KD = D
        this.target = 0

        this.lastError = 0
        this.integrator = 0
    }

    setTarget( newTarget) {
        this.target = newTarget
        this.integrator = 0
    }

    step( currentValue) {
        let error = currentValue - this.target

        let output = (this.KP * error + this.KI * this.integrator + this.KD * (error - this.lastError))

        this.lastError = error
        this.integrator += error

        return output
    }
}
module.exports = PIDController
