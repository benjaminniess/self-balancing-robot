const five = require('johnny-five')
const Raspi = require('raspi-io').RaspiIO
const board = new five.Board({
  io: new Raspi(),
})
const PIDController = require('./pid-controller.js')
let lastY = null
let rotationY
let lastTimestamp = new Date().getTime()

//#K and K1-- > Constants used with the complementary filter
const K = 0.98
const K1 = 1 - K
const PID = new PIDController( -78.5, 1.0, 1.0);

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
    setTimeout(update, 1000);
  });

  
  const motor1a = new five.Motor('GPIO10');
  const motor1b = new five.Motor('GPIO9')
  const motor2a = new five.Motor('GPIO8');
  const motor2b = new five.Motor('GPIO7')

  function moveForward(value = 255) {
    motor1a.start(value)
    motor1b.stop();
    motor2a.start(value)
    motor2b.stop();
  }
  function moveBackward(value = 255) { 
    motor1b.start(value)
    motor1a.stop();
    motor2b.start(value)
    motor2a.stop();
  }

  function stop() { 
    motor1a.stop()
    motor1b.stop();
    motor2a.stop()
    motor2b.stop();
  }

  lastY = yRotation()
  gOffsetY = gyro.y
  gTotalY = lastY - gOffsetY
 
  
  function update() {
    let currentTime = new Date().getTime()
    let timeDiff = ( currentTime - lastTimestamp ) / 100
    lastTimestamp = currentTime
    rotationY = yRotation()

    gyroY = gyro.y
    gyroY -= gOffsetY

    gYDelta = gyroY * timeDiff
    
    lastY = K * (lastY + gYDelta) + K1 * rotationY

//    console.log(lastY, PID.step(lastY) )
    if (lastY < 0 ) {
      moveForward(50)
    } else {
      moveBackward(100)
    }    
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

  function distance(a, b) {
    return Math.sqrt(a * a + b * b)
  }
})
