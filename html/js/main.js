const socket = io()

let enginesStart = document.getElementById('engines-start')
let balanceValue = document.getElementById('balanceVal')
let pVal = document.getElementById('pVal')
let iVal = document.getElementById('iVal')
let dVal = document.getElementById('dVal')

let pFeedbackVal = document.getElementById('pFeedbackValue')
let iFeedbackVal = document.getElementById('iFeedbackValue')
let dFeedbackVal = document.getElementById('dFeedbackValue')
let resultFeedbackVal = document.getElementById('resultFeedbackValue')
let resetLink = document.getElementById('reset')
let currentAngle = document.getElementById('currentAngle')

let target = document.getElementById('gaugeCanevas')
let gauge = new Gauge(target).setOptions({
  angle: 0, // The span of the gauge arc
  lineWidth: 0.27, // The line thickness
  radiusScale: 1, // Relative radius
  pointer: {
    length: 0.6, // // Relative to gauge radius
    strokeWidth: 0.035, // The thickness
    color: '#000000', // Fill color
  },
  animationSpeed: 10,
  strokeColor: '#E0E0E0', // to see which ones work best for you
  generateGradient: true,
  highDpiSupport: true, // High resolution support
  staticZones: [
    { strokeStyle: '#F03E3E', min: -45, max: -15 }, // Red from 100 to 130
    { strokeStyle: '#FFDD00', min: -15, max: -10 }, // Yellow
    { strokeStyle: '#30B32D', min: -10, max: 10 }, // Green
    { strokeStyle: '#FFDD00', min: 10, max: 15 }, // Yellow
    { strokeStyle: '#F03E3E', min: 15, max: 45 }, // Red
  ],
})

// Does not work in the declaration for some reason
gauge.maxValue = 45
gauge.minValue = -45
gauge.setTextField(currentAngle)
gauge.set(0)

enginesStart.addEventListener('change', function (e) {
  e.preventDefault()
  socket.emit('paramUpdate', {
    param: 'engineSwitch',
    value: enginesStart.checked,
  })
})

balanceValue.addEventListener('change', function (e) {
  e.preventDefault()
  socket.emit('paramUpdate', {
    param: 'balanceValue',
    value: balanceValue.value,
  })
})

pVal.addEventListener('change', function (e) {
  e.preventDefault()
  socket.emit('paramUpdate', {
    param: 'pVal',
    value: pVal.value,
  })
})

iVal.addEventListener('change', function (e) {
  e.preventDefault()
  socket.emit('paramUpdate', {
    param: 'iVal',
    value: iVal.value,
  })
})

dVal.addEventListener('change', function (e) {
  e.preventDefault()
  socket.emit('paramUpdate', {
    param: 'dVal',
    value: dVal.value,
  })
})

resetLink.addEventListener('click', (e) => {
  e.preventDefault()
  socket.emit('paramUpdate', {
    param: 'reset',
  })
})

socket.on('PID', (PIDData) => {
  pFeedbackVal.innerHTML = Math.round(PIDData.P * 100) / 100
  iFeedbackVal.innerHTML = Math.round(PIDData.I * 100) / 100
  dFeedbackVal.innerHTML = Math.round(PIDData.D * 100) / 100
  resultFeedbackVal.innerHTML = Math.round(PIDData.result * 100) / 100
  gauge.set(PIDData.angle)
})
