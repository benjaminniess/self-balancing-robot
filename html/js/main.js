const socket = io()

let enginesStart = document.getElementById('engines-start')
let balanceValue = document.getElementById('balanceVal')
let pVal = document.getElementById('pVal')
let iVal = document.getElementById('iVal')
let dVal = document.getElementById('dVal')

let resultFeedbackVal = document.getElementById('resultFeedbackValue')
let resetLink = document.getElementById('reset')

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
    { strokeStyle: '#F03E3E', min: -90, max: -20 }, // Red from 100 to 130
    { strokeStyle: '#FFDD00', min: -20, max: -10 }, // Yellow
    { strokeStyle: '#30B32D', min: -10, max: 10 }, // Green
    { strokeStyle: '#FFDD00', min: 10, max: 20 }, // Yellow
    { strokeStyle: '#F03E3E', min: 20, max: 90 }, // Red
  ],
})

// Does not work in the declaration for some reason
gauge.maxValue = 90
gauge.minValue = -90
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
  let roundedP = Math.round(PIDData.P * 100) / 100
  let roundedI = Math.round(PIDData.I * 100) / 100
  let roundedD = Math.round(PIDData.D * 100) / 100
  let roundedResult = Math.round(PIDData.result * 100) / 100

  gauge.set(PIDData.angle)

  chart.options.data[0].dataPoints[0].y = PIDData.angle
  chart.options.data[0].dataPoints[1].y = roundedP
  chart.options.data[0].dataPoints[2].y = roundedI
  chart.options.data[0].dataPoints[3].y = roundedD
  chart.options.data[0].dataPoints[4].y = roundedResult

  chart.render()
})

let chart = new CanvasJS.Chart('chartContainer', {
  title: {
    text: 'PID feedback',
  },
  axisY: {
    title: 'Absolute value',
    includeZero: true,
    suffix: '',
    maximum: 255,
    minimum: -255,
  },
  data: [
    {
      type: 'column',
      yValueFormatString: '#,###',
      indexLabel: '{y}',
      dataPoints: [
        { label: 'Angle error', y: 0 },
        { label: 'KP * error', y: 0 },
        { label: 'KI * (sum of errors)', y: 0 },
        { label: 'KD * (error - previous error)', y: 0 },
        { label: 'Motors speed', y: 0 },
      ],
    },
  ],
})
