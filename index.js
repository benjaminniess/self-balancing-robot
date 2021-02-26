const five = require('johnny-five')
const Raspi = require('raspi-io').RaspiIO
const board = new five.Board({
  io: new Raspi(),
})

let gTempX, gTempY, gTempZ
let gXDelta, gOffsetX, gTotalX
let lastX = null
let rotationX, rotationY

//#K and K1-- > Constants used with the complementary filter
const K = 0.98
const K1 = 1 - K
const timeDiff = 0.02

board.on('ready', function () {
  let gyro = new five.Gyro({
    controller: 'MPU6050',
  })

  let accelerometer = new five.Accelerometer({
    controller: 'MPU6050',
    pins: ['GPIO2', 'GPIO3'],
    // sensitivity: 16384 // optional
  })

  accelerometer.on("change", function() {
    update()
  });

  gyro.on("change", function() {

  });

  lastX = xRotation()
  gOffsetX = gyro.x
  gTotalX = lastX - gOffsetX

  
  function update() {
    rotationX = xRotation()

    gyroX = gyro.x
    gyroX -= gOffsetX

    gXDelta = gyroX * timeDiff
    
    lastX = K * (lastX + gXDelta) + K1 * rotationX

    console.log(lastX);
  }


  function yRotation() {
    let yRotRadiand = Math.atan2(
      accelerometer.x,
      distance(accelerometer.y, accelerometer.z),
    )
    return -toDegrees(yRotRadiand)
  }

  function toDegrees(angle) {
    return angle * (180 / Math.PI)
  }

  function xRotation() {
    let xRotRadiand = Math.atan2(
      accelerometer.y,
      distance(accelerometer.x, accelerometer.z),
    )
    return toDegrees(xRotRadiand)
  }

  function distance(a, b) {
    return Math.sqrt(a * a + b * b)
  }
})
