const five = require('johnny-five')
const Raspi = require('raspi-io').RaspiIO
const board = new five.Board({
  io: new Raspi(),
})

board.on('ready', function () {
  let gyro = new five.Gyro({
    controller: 'MPU6050',
  })

  let accelerometer = new five.Accelerometer({
    controller: 'MPU6050',
    pins: ['GPIO2', 'GPIO3'],
  })

  accelerometer.on('change', function () {
    update()
  })

  let lastY = 0
  function update() {
    let currentTime = new Date().getTime() / 1000
    let timeDiff = currentTime - lastTimestamp
    if (timeDiff > 0.02) {
      lastTimestamp = currentTime
      rotationY = yRotation()

      gyroY = gyro.rate.y
      if (gyroY > 0 && gyroY < 1) {
        gyroY = 0
      } else if (gyroY < 0 && gyroY > -1) {
        gyroY = 0
      }
      gYDelta = gyroY * timeDiff

      lastY = K * (lastY - gYDelta) + K1 * rotationY
    }
  }

  function yRotation() {
    let yRotRadiand = Math.atan2(
      accelerometer.x,
      distance(accelerometer.y, accelerometer.z),
    )
    return toDegrees(yRotRadiand)
  }

  function toDegrees(angle) {
    return angle * (180 / Math.PI)
  }

  function distance(a, b) {
    return Math.sqrt(a * a + b * b)
  }
})
