var socket = io()

var enginesStart = document.getElementById('engines-start')
var balanceValue = document.getElementById('balanceVal')
var pVal = document.getElementById('pVal')
var iVal = document.getElementById('iVal')
var dVal = document.getElementById('dVal')

var pFeedbackVal = document.getElementById('pFeedbackValue')
var iFeedbackVal = document.getElementById('iFeedbackValue')
var dFeedbackVal = document.getElementById('dFeedbackValue')
var resultFeedbackVal = document.getElementById('resultFeedbackValue')
var resetLink = document.getElementById('reset')

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
})
