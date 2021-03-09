const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const five = require('johnny-five')
const Raspi = require('raspi-io').RaspiIO
const board = new five.Board({
  io: new Raspi(),
})

const motor1a = new five.Motor('GPIO10')
const motor1b = new five.Motor('GPIO9')
const motor2a = new five.Motor('GPIO8')
const motor2b = new five.Motor('GPIO7')

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

const PIDController = require('./pid-controller.js')
let lastY = null
let rotationY
let lastTimestamp = 0

//#K and K1-- > Constants used with the complementary filter
const K = 0.98
const K1 = 1 - K
const balanceValue = argv.balanceValue ? argv.balanceValue : 0
const pValue = argv.p ? argv.p : 0
const iValue = argv.i ? argv.i : 0
const dValue = argv.d ? argv.d : 0
const PID = new PIDController(pValue, iValue, dValue, balanceValue)
let engineStart = false

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/html/index.html')
})

app.get('/html/*', (req, res) => {
  res.sendFile(__dirname + '/html/' + req.params[0])
})

io.on('connection', (socket) => {
  socket.on('paramUpdate', (socketVal) => {
    switch (socketVal.param) {
      case 'engineSwitch':
        engineStart = socketVal.value === true ? true : false
        if (engineStart === false) {
          stop()
        }
        break
      case 'balanceValue':
        PID.setTarget(parseFloat(socketVal.value))
        break
      case 'pVal':
        PID.setP(parseFloat(socketVal.value))
        break
      case 'iVal':
        PID.setI(parseFloat(socketVal.value))
        break
      case 'dVal':
        PID.setD(parseFloat(socketVal.value))
        break
      default:
        break
    }
  })
})

http.listen(3000, () => {
  console.log('listening on *:3000')
})

function moveBackward(value = 255) {
  if (engineStart === true) {
    console.log('back ' + value)
    motor1a.start(value)
    motor1b.stop()
    motor2a.start(value)
    motor2a.start()
    motor2b.stop()
  }
}
function moveForward(value = 255) {
  if (engineStart === true) {
    console.log('fo ' + value)
    motor1b.start(value)
    motor1a.stop()
    motor2b.start(value)
    motor2a.stop()
  }
}

function stop() {
  motor1a.stop()
  motor1b.stop()
  motor2a.stop()
  motor2b.stop()
}

board.on('ready', function () {
  let gyro = new five.Gyro({
    controller: 'MPU6050',
  })

  let accelerometer = new five.Accelerometer({
    controller: 'MPU6050',
    pins: ['GPIO2', 'GPIO3'],
    // sensitivity: 16384 // optional
  })

  accelerometer.on('change', function () {
    update()
  })

  lastY = 0

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
      let newVal = PID.step(lastY)
      if (newVal < 0) {
        moveBackward(-newVal)
      } else {
        moveForward(newVal)
      }
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
